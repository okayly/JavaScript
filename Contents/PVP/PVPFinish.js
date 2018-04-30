/********************************************************************
Title : pvp info
Date : 2017.04.03
Desc : 
writer: dongsu
********************************************************************/
var mkDB 		= require('../../DB/mkDB.js');
var GTMgr 		= require('../../DB/GTMgr.js');
var LoadPVP 		= require('../../DB/GTLoad/LoadGTPVP.js');
var LoadUser 		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadHero 		= require('../../DB/GTLoad/LoadGTHero.js');
var Sender 		= require('../../App/Sender.js');
var BasePVP 		= require('../../Data/Base/BasePVP.js');
var Timer		= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};


	// 승 : 1, 무 : 0, 패 : 2
	var GetEllValue = function(p_battle_result) {
		if ( p_battle_result == 1 ) { return 0.9;}		// 승
		else if ( p_battle_result == 0 ) { return 0.5;	}	// 무
		return 0;						// 패.
	}

	var GetTargetEllValue = function(p_battle_result) { 	// 배틀 결과의 반대.
		if ( p_battle_result == 1 ) { return 0;}		// 승
		else if ( p_battle_result == 0 ) { return 0.5;	}	// 무
		return 0.9;						// 패.	
	}

	var GetEloValue = function(p_battle_result) {
		if ( p_battle_result == 1 ) { return 0.9;}		// 승
		else if ( p_battle_result == 0 ) { return 0.5;	}	// 무
		return 0;						// 패.
	}

	var GetUserPVPGroup = function( p_league_id, p_group_id, p_change_league) {
		return new Promise((resolve, reject) => {

			let ret_group_id = p_group_id;
			
			if ( ret_group_id == 0 || p_change_league == true) {
				Promise.all([ 	LoadPVP.inst.GetJoinGroup(p_league_id),
						LoadPVP.inst.GetGroupMaxIndex(p_league_id)])
				.then(values => {
					console.log('확인용 GetUserPVPGroup - values : ', values);
					console.log('확인용 GetUserPVPGroup - values[0] : ', values[0].length);
					
					let join_group = (values[0].length > 0) ? values[0][0].GROUP_ID : 0;
					let max_index = (values[1] != null ) ? values[1] : 0;
					console.log('확인용 GetUserPVPGroup - join_group : ', join_group);
					console.log('확인용 GetUserPVPGroup - max_index : ', max_index);

					if ( join_group == 0 ) {
			
						if ( max_index = null ) {
							ret_group_id = 1;	
						}
						else {
							ret_group_id = max_index + 1;
						}
					}
					else {
						ret_group_id = join_group;
					}

					resolve(ret_group_id);
				})
				.catch(p_error => { reject([p_error, 'ProcessUpdateUserPvPInfo']); });
			}
			else {

				resolve(ret_group_id);
			}
		});
	}

	var UpdateTargetInfo = function(p_tran, p_ret_target_pvp, p_ell) {
		return new Promise((resolve, reject) => {
			p_ret_target_pvp.updateAttributes({
				DEPENSE_ELL : p_ell
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch( p_error => { reject([p_error, 'UpdateTargetInfo']); })
		});
	}

	var UpdateUserPvPInfo = function(p_tran, p_ret_user_pvp, p_attack_ell, p_pvp_elo, p_max_league_id, p_league_id, p_group_id, p_able_count, p_battle_result) {
		return new Promise((resolve, reject) => {

			let win_count = (p_battle_result == 1) ? (p_ret_user_pvp.dataValues.WEEK_PVP_WIN_COUNT + 1) : p_ret_user_pvp.dataValues.WEEK_PVP_WIN_COUNT;
			let lose_count = (p_battle_result == 2) ? (p_ret_user_pvp.dataValues.WEEK_PVP_LOSE_COUNT + 1) : p_ret_user_pvp.dataValues.WEEK_PVP_LOSE_COUNT;

			
			console.log('확인용 WEEK_PVP_WIN_COUNT- ', p_ret_user_pvp.dataValues.WEEK_PVP_WIN_COUNT);
			console.log('확인용 WEEK_PVP_LOSE_COUNT- ', p_ret_user_pvp.dataValues.WEEK_PVP_LOSE_COUNT);
			console.log('확인용 win_count- ', win_count);
			console.log('확인용 lose_count- ', lose_count);

			p_ret_user_pvp.updateAttributes({
				PVP_ELO 			: p_pvp_elo, 		// PVP 점수. 
				ATTACK_ELL 		: p_attack_ell,		// 공격 ELL
				ABLE_PLAY_COUNT 	: p_able_count, 	// 참여 가능 횟수. 
				MAX_LEAGUE_ID 		: p_max_league_id,
				LEAGUE_ID 			: p_league_id, 	// 리그. 
				GROUP_ID 			: p_group_id, 		// 조 편성.
				WEEK_PVP_WIN_COUNT 	: win_count,
				WEEK_PVP_LOSE_COUNT: lose_count
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'UpdateUserPvPInfo']); })
		});
	}

	var UpdateUserInfo = function(p_tran, p_ret_user, p_honor_point) {
		
		return new Promise((resolve, reject) => {
			p_ret_user.updateAttributes({
				POINT_HONOR : p_honor_point // 보상. 
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'UpdateUserInfo']); })
		});
	}

	var UpdateUserDailyInfo = function(p_tran, p_ret_user_daily, p_honor_point) {
		return new Promise((resolve, reject) => {
			// 보상 수령 가능 횟수. 
			let ret_play_count 		= p_ret_user_daily.dataValues.PVP_PLAY_COUNT + 1;
			let ret_gain_honor_point 	= p_ret_user_daily.dataValues.PVP_GAIN_HONOR_POINT + p_honor_point;
			p_ret_user_daily.updateAttributes({
				PVP_GAIN_HONOR_POINT : ret_gain_honor_point,
				PVP_PLAY_COUNT 		: ret_play_count
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'UpdateUserDailyInfo']); })
		});
	}

	var InsertPvPRecord = function(p_tran, p_uuid, p_battle_result, p_delta_point, p_target_data, p_target_hero_data, p_target_battle_power) {
		// console.log('확인용 InsertPvPRecord- p_target_data : ', p_target_data);
		// console.log('확인용 InsertPvPRecord- p_target_hero_data : ', p_target_hero_data);
		// console.log('확인용 InsertPvPRecord- p_target_hero_data size : ', p_target_hero_data.length);

		return new Promise((resolve, reject) => {
			GTMgr.inst.GetGTPVPRecord().create({
				UUID 				: p_uuid,
				BATTLE_RESULT 		: p_battle_result,
				DELTA_POINT 		: p_delta_point,
				TARGET_NICK		: p_target_data.dataValues.NICK,
				TARGET_USER_LEVEL	: p_target_data.dataValues.USER_LEVEL,
				TARGET_ICON		: p_target_data.dataValues.ICON,
				TARGET_BATTLE_POWER : p_target_battle_power,
				TARGET_HERO_SLOT1_HERO_ID   			: (p_target_hero_data[0] != undefined) ? p_target_hero_data[0].HERO_ID : 0,
				TARGET_HERO_SLOT1_HERO_LEVEL 			: (p_target_hero_data[0] != undefined) ? p_target_hero_data[0].HERO_LEVEL : 0,
				TARGET_HERO_SLOT1_HERO_REINFORCE_STEP 	: (p_target_hero_data[0] != undefined) ? p_target_hero_data[0].REINFORCE_STEP : 0,
				TARGET_HERO_SLOT1_HERO_EVOLUTION_STEP 	: (p_target_hero_data[0] != undefined) ? p_target_hero_data[0].EVOLUTION_STEP : 0,
				TARGET_HERO_SLOT2_HERO_ID 			: (p_target_hero_data[1] != undefined) ? p_target_hero_data[1].HERO_ID : 0,
				TARGET_HERO_SLOT2_HERO_LEVEL 			: (p_target_hero_data[1] != undefined) ? p_target_hero_data[1].HERO_LEVEL : 0,
				TARGET_HERO_SLOT2_HERO_REINFORCE_STEP 	: (p_target_hero_data[1] != undefined) ? p_target_hero_data[1].REINFORCE_STEP : 0,
				TARGET_HERO_SLOT2_HERO_EVOLUTION_STEP 	: (p_target_hero_data[1] != undefined) ? p_target_hero_data[1].EVOLUTION_STEP : 0,
				TARGET_HERO_SLOT3_HERO_ID 			: (p_target_hero_data[2] != undefined) ? p_target_hero_data[2].HERO_ID : 0,
				TARGET_HERO_SLOT3_HERO_LEVEL 			: (p_target_hero_data[2] != undefined) ? p_target_hero_data[2].HERO_LEVEL : 0,
				TARGET_HERO_SLOT3_HERO_REINFORCE_STEP 	: (p_target_hero_data[2] != undefined) ? p_target_hero_data[2].REINFORCE_STEP : 0,
				TARGET_HERO_SLOT3_HERO_EVOLUTION_STEP 	: (p_target_hero_data[2] != undefined) ? p_target_hero_data[2].EVOLUTION_STEP : 0,
				TARGET_HERO_SLOT4_HERO_ID 			: (p_target_hero_data[3] != undefined) ? p_target_hero_data[3].HERO_ID : 0,
				TARGET_HERO_SLOT4_HERO_LEVEL 			: (p_target_hero_data[3] != undefined) ? p_target_hero_data[3].HERO_LEVEL : 0,
				TARGET_HERO_SLOT4_HERO_REINFORCE_STEP 	: (p_target_hero_data[3] != undefined) ? p_target_hero_data[3].REINFORCE_STEP : 0,
				TARGET_HERO_SLOT4_HERO_EVOLUTION_STEP 	: (p_target_hero_data[3] != undefined) ? p_target_hero_data[3].EVOLUTION_STEP : 0,
				REG_DATE			: Timer.inst.GetNowByStrDate()
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'InsertPvPRecord']); })
		});
	}

	// TODO : 상수를 밖으로 빼야 한다. 
	var ProcessTransaction = function(p_uuid, p_user_pvp, p_target_pvp, p_user_data, p_user_daily, p_target_data, p_target_hero_data, p_target_battle_power, p_battle_result, p_ack_packet) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (out_tran) {
				
				let tran 		= out_tran;
				let target_value 	= p_target_pvp.dataValues;
				let user_value 	= p_user_pvp.dataValues;

				let ell_e_value 		= 1/(1+10^((target_value.DEPENSE_ELL - user_value.ATTACK_ELL)/400));
				logger.info('확인용 - 배틀 결과 : %d, ell_e_value : ',p_battle_result, ell_e_value);

				let ell_target_s_value 		= GetTargetEllValue(p_battle_result);
				logger.info('확인용 - 배틀 결과 : %d, ell_target_s_value : ',p_battle_result, ell_target_s_value);
				let ell_target_add_value 	= Math.floor(80 * (ell_target_s_value - ell_e_value));
				logger.info('확인용 - 배틀 결과 : %d, ell_target_add_value : ',p_battle_result, ell_target_add_value);
				let temp_depense_ell 	= target_value.DEPENSE_ELL + ell_target_add_value;
				logger.info('확인용 - 배틀 결과 : %d, temp_depense_ell : ',p_battle_result, temp_depense_ell);
				let target_depense_ell 	= (temp_depense_ell < 0) ? 0 : temp_depense_ell;

				// 유저 공격 ELL 및 ELO 계산. 
				let ell_s_value 	= GetEllValue(p_battle_result);
				logger.info('확인용 - 배틀 결과 : %d, ell_s_value : ',p_battle_result, ell_s_value);
				let ell_add_value 	= Math.floor(80 * (ell_s_value - ell_e_value));
				logger.info('확인용 - 배틀 결과 : %d, ell_add_value : ',p_battle_result, ell_add_value);
				let ret_attack_ell 	= user_value.ATTACK_ELL + ell_add_value;
				logger.info('확인용 - 배틀 결과 : %d, ret_attack_ell : ',p_battle_result, ret_attack_ell);

				let elo_s_value 	= GetEloValue(p_battle_result);
				logger.info('확인용 - 배틀 결과 : %d, elo_s_value : ',p_battle_result, elo_s_value);
				let pvp_elo_rate 	= elo_s_value - 1/(1+10^(( target_value.DEPENSE_ELL - user_value.PVP_ELO )/400));
				logger.info('확인용 - 배틀 결과 : %d, pvp_elo_rate : ',p_battle_result, pvp_elo_rate);
				// let pvp_up_point 	= (p_battle_result == 1) ? Math.floor(30 * pvp_elo_rate) : (Math.floor(30 * pvp_elo_rate) * -1);
				let pvp_up_point 	= Math.floor(30 * pvp_elo_rate);
				logger.info('확인용 - 배틀 결과 : %d, pvp_up_point : ',p_battle_result, pvp_up_point);
				let temp_elo 		= user_value.PVP_ELO + pvp_up_point;
				let ret_pvp_elo 	= (temp_elo < 0 ) ? 0 : temp_elo;
				logger.info('확인용. - 결과 ELO : %d', ret_pvp_elo);

				
				let ret_league_id 	= user_value.LEAGUE_ID;
				let max_league_id 	= user_value.MAX_LEAGUE_ID;
				let change_league 	= false;
				
				let league_data_by_elo 	= BasePVP.inst.GetLeagueByPoint(ret_pvp_elo);
				let current_league_data 	= BasePVP.inst.GetLeague(user_value.LEAGUE_ID);
				let ret_league_data 		= current_league_data;
				if ( league_data_by_elo.league_id != user_value.LEAGUE_ID ) {
					// 리그 변경. 
					
					if ( 	league_data_by_elo.league_id > user_value.LEAGUE_ID &&
						current_league_data.league_up_point <= ret_pvp_elo ) {

						ret_league_id 		= league_data_by_elo.league_id;
						ret_league_data 	= league_data_by_elo;
						change_league 	= true;
						if ( max_league_id < ret_league_id ) {
							max_league_id = ret_league_id;
						}
					}
					else if ( league_data_by_elo.league_id < user_value.LEAGUE_ID &&
						 current_league_data.league_down_point >= ret_pvp_elo ) {

						ret_league_id 		= league_data_by_elo.league_id;
						ret_league_data 	= league_data_by_elo;
						change_league 	= true;
					}
				}


				// 유저 참여 보상. 
				let gain_honor_point 		= 0;
				let ret_remain_honor_point 	= ret_league_data.daily_max_honor_point - p_user_daily.dataValues.PVP_GAIN_HONOR_POINT;
				if ( p_user_daily.dataValues.PVP_GAIN_HONOR_POINT < ret_league_data.daily_max_honor_point &&
					p_battle_result == 1 ) {
					gain_honor_point 		= ret_league_data.reward_honor_point;
					ret_remain_honor_point 	= ret_remain_honor_point - gain_honor_point;
				}

				// 유저 기본 정보.
				let ret_able_cnt 	= user_value.ABLE_PLAY_COUNT - 1;
				let ret_honor_point 	= p_user_data.dataValues.POINT_HONOR + gain_honor_point;

				// 조 판별. 
				GetUserPVPGroup( ret_league_id, user_value.GROUP_ID, change_league)
				.then( value => {
					console.log('확인용 - 조 ', value);
					// 결과 업데이트. 
					return Promise.all([ UpdateTargetInfo(tran, p_target_pvp, target_depense_ell),
							        UpdateUserPvPInfo(tran, p_user_pvp, ret_attack_ell, ret_pvp_elo, max_league_id, ret_league_id, value, ret_able_cnt, p_battle_result),
							        UpdateUserInfo(tran, p_user_data, ret_honor_point),
							        UpdateUserDailyInfo(tran, p_user_daily, gain_honor_point),
							        InsertPvPRecord(tran, p_uuid, p_battle_result, pvp_up_point, p_target_data, p_target_hero_data, p_target_battle_power)])	
					.then( values => {

						// 패킷 생성. 
						p_ack_packet.cur_league_id		= ret_league_id;
						p_ack_packet.battle_result 			= p_battle_result;
						p_ack_packet.pvp_point 			= ret_pvp_elo;
						p_ack_packet.honor_point 			= ret_honor_point;
						p_ack_packet.remain_honor_point 		= ret_remain_honor_point;
						p_ack_packet.remain_pvp_play_count 	= ret_able_cnt;

						tran.commit();
						resolve(values);
					})
					.catch(p_error => { 
						tran.rollback();
						reject([p_error, 'ProcessTransaction - Promise.all']); 
					});
				})
				.catch(p_error => { reject([p_error, 'ProcessTransaction - GetUserPVPGroup']); });
			})
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqPvpFinish = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqPvpFinish -', p_user.uuid, p_recv);

		var recv_target_uuid 		= parseInt(p_recv.target_uuid);
		var recv_battle_result 	= parseInt(p_recv.battle_result);

		var target_user_pvp_data;

		Promise.all([ 	LoadPVP.inst.GetPVP(p_user.uuid),
				LoadPVP.inst.GetPVP(recv_target_uuid),
				LoadUser.inst.SelectUser(p_user.uuid),
				LoadUser.inst.SelectDaily(p_user.uuid),
				LoadUser.inst.SelectUser(recv_target_uuid),
				LoadHero.inst.GetHeroInTeam(recv_target_uuid, 7),
				LoadHero.inst.SelectTeam(recv_target_uuid, 7)])
		.then( values => {
			let user_pvp 	= values[0];
			let target_pvp 	= values[1];
			let user_data 	= values[2];
			let user_daily 	= values[3];
			let target_data 	= values[4];
			let target_hero_data 	= values[5];
			let target_battle_power = values[6].dataValues.BATTLE_POWER;

			return ProcessTransaction(p_user.uuid, user_pvp, target_pvp, user_data, user_daily, target_data, target_hero_data, target_battle_power, recv_battle_result, p_ack_packet);
		})
		.then( values => {
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