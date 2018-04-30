// /********************************************************************
// Title : pvp info
// Date : 2017.04.03
// Desc : pvp 정보 전달. 
// writer: dongsu
// ********************************************************************/
var mkDB 	= require('../../DB/mkDB.js');

var LoadPVP 	= require('../../DB/GTLoad/LoadGTPVP.js');
var LoadUser 	= require('../../DB/GTLoad/LoadGTUser.js');
var LoadHero 	= require('../../DB/GTLoad/LoadGTHero.js');
var BasePVP 	= require('../../Data/Base/BasePVP.js');

var Timer	= require('../../Utils/Timer.js');

var Sender 	= require('../../App/Sender.js');


(function (exports) {
	// private 변수

	// public
	var inst = {};

	// // 리그 랭킹 구하기. 
	var GetLeagueRank = function(p_uuid, p_league_id) {
		return new Promise((resolve, reject) => {
			return  mkDB.inst.GetSequelize().query('select \
									(select count(*) from GT_PVPs where LEAGUE_ID = ? and A.GROUP_ID != 0) as MEMBER_COUNT, \
									(select count(*) + 1 from GT_PVPs where PVP_ELO > A.PVP_ELO and LEAGUE_ID = ? and A.GROUP_ID != 0) as RANK \
									from GT_PVPs as A \
									where A.LEAGUE_ID = ? and A.UUID = ? and A.GROUP_ID != 0 order by PVP_ELO desc;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_league_id, p_league_id, p_league_id, p_uuid ]
			).then(p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetLeagueRank']) })
		});
	}

	// // 조별 랭크 구하기. 
	var GetGroupRank = function(p_uuid, p_league_id, p_group_id) {
		return new Promise((resolve, reject) => {
			if ( p_group_id == 0 ) {
				resolve(null);
			}
			else {
				return  mkDB.inst.GetSequelize().query('select \
										(select count(*) + 1 \
											from GT_PVPs \
											where PVP_ELO > A.PVP_ELO \
												and LEAGUE_ID = ? \
												and GROUP_ID = ?) as RANK \
										from GT_PVPs as A where A.LEAGUE_ID = ? and A.UUID = ? order by PVP_ELO desc;',
					null,
					{ raw : true, type : 'SELECT' },
					[ p_league_id, p_group_id, p_league_id, p_uuid ]
				).then(p_ret => {
					resolve(p_ret);
				})
				.catch(p_error => { reject([p_error, 'GetGroupRank']) })
			}
		});
	}

	var ProcessTransaction = function(p_user_pvp, p_ack_packet) {
		return new Promise((resolve, reject) => {
			
			let pvp_data = p_user_pvp.dataValues;
			if ( pvp_data.ABLE_PLAY_COUNT == 10 ) {
				p_ack_packet.remain_pvp_play_count 	  = pvp_data.ABLE_PLAY_COUNT;
				p_ack_packet.last_play_count_charge_date = Timer.inst.GetUnixTime(Timer.inst.GetNowByStrDate());
				resolve(null);
			}
			else {
				let diff_sec 	= Timer.inst.GetDeltaTime(pvp_data.LATELY_PLAY_COUNT_CHARGE_DATE);;
				console.log('확인용 - diff_sec : ', diff_sec);
				if ( diff_sec > 1800 ) { // 1 시간 경과. 
					let add_value 	= Math.floor(diff_sec/1800);
					console.log('확인용 add_value : ', add_value);
					let ret_value 	= ((pvp_data.ABLE_PLAY_COUNT + add_value) > 10) ? 10 : pvp_data.ABLE_PLAY_COUNT + add_value;
					let now_date 	= Timer.inst.GetNowByStrDate();
					
					return mkDB.inst.GetSequelize().transaction(function (out_tran) {
					
						p_user_pvp.updateAttributes({
							ABLE_PLAY_COUNT : ret_value,
							LATELY_PLAY_COUNT_CHARGE_DATE : now_date
						}, { transaction : out_tran })
						.then(p_ret_update => {
							p_ack_packet.remain_pvp_play_count 	  = ret_value;
							p_ack_packet.last_play_count_charge_date = Timer.inst.GetUnixTime(now_date);

							out_tran.commit();
							resolve(p_ret_update);
						})
						.catch(p_error => {
							out_tran.rollback();
							reject([p_error, 'RenewAbleCount - update']);
						})
					})
				}
			}

			resolve(null);	
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqPvPInfo = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqPvPInfo -', p_user.uuid, p_recv);

		let temp_league_id 	= 0;
		let temp_group_id 	= 0;
		
		Promise.all([ 	LoadPVP.inst.GetPVP(p_user.uuid),
				LoadUser.inst.SelectDaily(p_user.uuid),
				LoadHero.inst.SelectTeam(p_user.uuid, 7)])
		.then( values => {
			
			let pvp_data 	= values[0].dataValues;
			let daily_data 	= values[1].dataValues;
			let team_data 	= values[2].dataValues;

			let base_pvp 	= BasePVP.inst.GetLeague(pvp_data.LEAGUE_ID);
			if ( base_pvp == null ) {
				throw ([ PacketRet.inst.retFail(), 'Not Exist base PVP', pvp_data.LEAGUE_ID ]);
			}

			let able_gain_honor_point = base_pvp.daily_max_honor_point - daily_data.PVP_GAIN_HONOR_POINT;

			temp_league_id 	= pvp_data.LEAGUE_ID;
			temp_group_id 	= pvp_data.GROUP_ID;

			p_ack_packet.league_index 				= pvp_data.LEAGUE_ID;
			p_ack_packet.group_index 				= pvp_data.GROUP_ID;
			p_ack_packet.pvp_point 				= pvp_data.PVP_ELO;
			p_ack_packet.remain_honor_point 			= (able_gain_honor_point < 0) ? 0 : able_gain_honor_point;
			
			p_ack_packet.battle_power 				= team_data.BATTLE_POWER;
			p_ack_packet.win_weekly_pvp 			= pvp_data.WEEK_PVP_WIN_COUNT;
			p_ack_packet.lose_weekly_pvp 			= pvp_data.WEEK_PVP_LOSE_COUNT;
			p_ack_packet.highest_reach_league_id 		= pvp_data.MAX_LEAGUE_ID;
			p_ack_packet.take_league_reward_id 		= pvp_data.GAIN_ACHIEVEMENT_REWARD;

			return ProcessTransaction(values[0], p_ack_packet);
		})
		.then( values => {
			
			Promise.all([	GetLeagueRank(p_user.uuid, temp_league_id),
					GetGroupRank(p_user.uuid, temp_league_id, temp_group_id)])
			.then( values => {
				console.log('확인용 - ', values);
				p_ack_packet.league_rank 	= (values[0].length > 0) ? values[0][0].RANK : 0; 
				p_ack_packet.group_rank 	= (values[1] == null) ? 0 : values[1][0].RANK;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		})
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;