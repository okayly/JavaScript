/********************************************************************
Title : pvp info
Date : 2017.02.27
Desc : pvp 정보 전달. 
writer: dongsu
********************************************************************/
// var GTMgr = require('../../DB/GTMgr.js');
var mkDB = require('../../DB/mkDB.js');

var PVPMatchMgr 	= require('./PVPMatchMgr.js');

var LoadPVP = require('../../DB/GTLoad/LoadGTPVP.js');

var Timer	= require('../../Utils/Timer.js');

var Sender = require('../../App/Sender.js');

var moment = require('moment');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	// 리그 랭킹 구하기. 
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

	// 조별 랭크 구하기. 
	var GetGroupRank = function(p_uuid, p_league_id, p_group_id) {
		return new Promise((resolve, reject) => {
			if ( p_group_id == 0 ) {
				resolve(null);
			}
			else {
				return  mkDB.inst.GetSequelize().query('select \
										(select count(*) from GT_PVPs where LEAGUE_ID = ? and GROUP_ID = ?) as MEMBER_COUNT, \
										(select count(*) + 1 \
											from GT_PVPs \
											where PVP_ELO > A.PVP_ELO \
												and LEAGUE_ID = ? \
												and GROUP_ID = ?) as RANK \
										from GT_PVPs as A where A.LEAGUE_ID = ? and A.UUID = ? order by PVP_ELO desc;',
					null,
					{ raw : true, type : 'SELECT' },
					[ p_league_id, p_group_id, p_league_id, p_group_id, p_league_id, p_uuid ]
				).then(p_ret => {
					resolve(p_ret);
				})
				.catch(p_error => { reject([p_error, 'GetGroupRank']) })
			}
		});
	}

	var LoadRankInfo = function(p_uuid, p_league_id, p_group_id, p_ack_packet) {
		
		return Promise.all([ 	GetLeagueRank(p_uuid, p_league_id),
					GetGroupRank(p_uuid, p_league_id, p_group_id)])
		.then(values => {
			console.log('확인용 - ', values);
			p_ack_packet.league_members_count 	= (values[0].length > 0) ? values[0][0].MEMBER_COUNT : 0;
			p_ack_packet.league_rank 			= (values[0].length > 0) ? values[0][0].RANK : 0;
			p_ack_packet.group_members_count 	= (values[1] != null) ? values[1][0].MEMBER_COUNT : 0;
			p_ack_packet.group_rank 			= (values[1] != null) ? values[1][0].RANK : 0;
		})
		.catch(p_error => { 
			// reject([p_error, 'ProcessTransaction']); 
			throw ([PacketRet.inst.retFail(), 'LoadRankInfo'])
		})
	}

	// 참여 횟수 갱신 
	var RenewAbleCount = function(p_uuid) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (out_tran) {
				LoadPVP.inst.GetPVP(p_uuid)
				.then(out_pvp => {
					let now_date 	= Timer.inst.GetNowByStrDate();
					let delta_time 	= Timer.inst.GetDeltaTime(out_pvp.dataValues.LATELY_PLAY_COUNT_CHARGE_DATE);
					console.log('확인용 - delta_time : ', delta_time);
					let temp_count = out_pvp.dataValues.ABLE_PLAY_COUNT + Math.floor(delta_time/1800);
					console.log('확인용 - current_count : %d,  temp_count : ',out_pvp.dataValues.ABLE_PLAY_COUNT, temp_count);
					let able_count = (temp_count > 10) ? 10 : temp_count;

					out_pvp.updateAttributes({
						ABLE_PLAY_COUNT : able_count,
						LATELY_PLAY_COUNT_CHARGE_DATE : now_date
					}, { transaction : out_tran })
					.then(p_ret_update => {
						out_tran.commit();
						resolve(p_ret_update);
					})
					.catch(p_error => {
						out_tran.rollback();
						reject([p_error, 'RenewAbleCount - update']);
					})
				})
				.catch(p_error => { reject([p_error, 'RenewAbleCount']); })	
			})
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqPvPInfoUpdate = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqPvPInfo -', p_user.uuid, p_recv);

		let recv_except_uuids = [0, 0, 0];
		if (Array.isArray(p_recv.except_uuids)){
			recv_except_uuids = p_recv.except_uuid_list;
		}

		let attack_ell 	= 0;
		let temp_map 	= new Map();
		LoadPVP.inst.GetPVP(p_user.uuid)
		.then(out_pvp => {
			
			let pvp_data 	= out_pvp.dataValues;
			let league_id 	= pvp_data.LEAGUE_ID;
			let group_id 	= pvp_data.GROUP_ID;
			attack_ell 	= pvp_data.ATTACK_ELL;

			p_ack_packet.remain_pvp_play_count 		= pvp_data.ABLE_PLAY_COUNT;
			p_ack_packet.group_id 				= group_id;
			p_ack_packet.last_play_count_charge_date 	= Timer.inst.GetUnixTime(pvp_data.LATELY_PLAY_COUNT_CHARGE_DATE);

			return LoadRankInfo(p_user.uuid, league_id, group_id, p_ack_packet);
		})
		.then( values => {

			let delta_time = Timer.inst.GetDeltaTime(p_ack_packet.last_play_count_charge_date);
			if ( delta_time >= 3600 ) {
				return RenewAbleCount(p_user.uuid);
			}
			else {
				return null;
			}
		})
		.then( values => {
			if (values[0] != null ) {
				p_ack_packet.remain_pvp_play_count 		= values[0].dataValues.ABLE_PLAY_COUNT;
				p_ack_packet.last_play_count_charge_date 	= Timer.inst.GetUnixTime(values[0].dataValues.LATELY_PLAY_COUNT_CHARGE_DATE);
			}
									
			
			return PVPMatchMgr.inst.GetMatchPlayer(p_user, attack_ell, 1, p_recv.except_uuid_list, 0, temp_map);
		})
		.then( values => {
			temp_map.forEach(function (value, key) {
				p_ack_packet.match_player_list.push(value);
			})
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
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