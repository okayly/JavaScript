/********************************************************************
Title : MissionReward 
Date : 2016.06.29
Update : 2017.03.16
Desc : 미션 보상
	   완료한 미션 보상 받기
	   미션 보상만 RewardType이 0이면 계정 경험치 보상이다.(기획과 합의 내용. 2016-06-16 jongwook)
writer: dongsu
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var BTMgr		= require('../../DB/BTMgr.js');
var MissionMgr	= require('./MissionMgr.js');
var RewardMgr	= require('../RewardMgr.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var RewardInfo = function() {
		this.reward_type;
		this.reward_id;
		this.reward_count;
	}

	var ProcessReward = function(p_user, p_base_mission, p_ack_cmd, p_ack_packet) {
		// console.log('base_mission -', p_base_mission);
		logger.info('UUID : %d, Mission ID : %d 달성 보상 시작. ', p_user.uuid, p_base_mission.MISSION_ID);

		// 미션 보상 정보 2개 만들기.
		var reward_list = [];

		for (var cnt = 1; cnt <= 2; ++cnt) {
			var reward_info = new RewardInfo();
			reward_info.reward_type	= p_base_mission['REWARD_TYPE' + cnt];
			reward_info.reward_id	= p_base_mission['REWARD_ID' + cnt];
			reward_info.reward_count= p_base_mission['REWARD_VAUE' + cnt];
			reward_list.push(reward_info);
		}

		logger.info('UUID : %d, MissionID : %d, 보상 정보 - ', p_user.uuid, p_base_mission.MISSION_ID, reward_list);

		p_ack_packet.mission_id = p_base_mission.MISSION_ID;
		RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, reward_list);
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqMissionReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqMissionReward -', p_user.uuid, p_recv);

		var recv_mission_id	 = parseInt(p_recv.mission_id);
		
		// BT_MISSION select
		BTMgr.inst.GetBTMission().find({
			where : { MISSION_ID : recv_mission_id } 
		})
		.then(function (p_ret_bt_mission) {
			// 기본 미션 정보를 찾을 수 없다. 
			if ( p_ret_bt_mission == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Mission In Base mission_id', recv_mission_id);
				return;
			}
			
			var mission_data = p_ret_bt_mission.dataValues;
			if ( mission_data.MISSION_TYPE == 1 ) {
				// call ad-hoc query - 일일 미션. 
				mkDB.inst.GetSequelize().query('select PROGRESS_COUNT, PROGRESS_TYPE, REG_DATE from GT_DAILY_MISSIONs \
												where UUID = ? and MISSION_ID = ? and DATE(REG_DATE) = DATE(now());'
					, null
					, { raw: true, type: 'SELECT' }
					, [ p_user.uuid, recv_mission_id ]
				)
				.then(function (p_ret_daily_mission) {
					// 해당 미션이 존재하지 않는다. 
					if ( Object.keys(p_ret_daily_mission).length <= 0 ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Mission mission_id', recv_mission_id);
						return;
					}

					var data = p_ret_daily_mission[0];
					// ProcessMissionReward(p_user, data, mission_data, p_ack_cmd, p_ack_packet);
					if ( data.PROGRESS_TYPE == 2 ) {
						// 이미 완료. 
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyComplete());
					}
					else if ( data.PROGRESS_COUNT < mission_data.MISSION_GOAL_VALUE ) {
						// 불충분.
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCondition(), 'need_gold_value', mission_data.MISSION_GOAL_VALUE, 'progress_count', data.PROGRESS_COUNT);
					} else {
						// call ad-hoc query - 완료 업데이트. 
						mkDB.inst.GetSequelize().query('update GT_DAILY_MISSIONs set PROGRESS_TYPE = 2 \
														where UUID = ? and MISSION_ID = ? and DATE(REG_DATE) = DATE(now());'
							, null
							, { raw : false, type : 'UPDATE' }
							, [ p_user.uuid, mission_data.MISSION_ID ]
						)
						.then(function (p_ret_update) {
							logger.info('UUID : %d, MissionID : %d 일일 미션 완료. - ', p_user.uuid, mission_data.MISSION_ID);
							ProcessReward(p_user, mission_data, p_ack_cmd, p_ack_packet);

							MissionMgr.inst.MissionDailyMissionComplete(p_user);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMissionReward 1-2');
						})
					}					
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMissionReward 1-1');
				});
			} else {
				// GT_MISSION select - 누적 미션.
				GTMgr.inst.GetGTMission().find({
					where : { UUID : p_user.uuid, MISSION_ID : recv_mission_id }
				})
				.then(function (p_ret_accum_mission) {
					if ( p_ret_accum_mission == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Mission In Base mission_id', recv_mission_id);
						return;
					}
					
					var data = p_ret_accum_mission;
					if ( data.PROGRESS_TYPE == 2 ) {
						// 이미 완료. 
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyComplete());
					}
					else if ( data.PROGRESS_COUNT < p_ret_bt_mission.MISSION_GOAL_VALUE ) {
						// 불충분.
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCondition(), 'mission_gold_value', p_ret_bt_mission.MISSION_GOAL_VALUE, 'progress_count', data.PROGRESS_COUNT);
					} else {
						// GT_MISSOIN update - 완료 업데이트. 
						p_ret_accum_mission.updateAttributes({
							PROGRESS_TYPE : 2
						})
						.then(function (p_ret_update) {
							logger.info('UUID : %d, MissionID : %d 누적 미션 완료. - ', p_user.uuid, p_ret_bt_mission.MISSION_ID);
							ProcessReward(p_user, p_ret_bt_mission, p_ack_cmd, p_ack_packet);

							// 연관 미션이 있다면 발급 한다. 
							var inheritance_value = 0;
							if ( p_ret_bt_mission.PREV_VALUE_INHERITANCE == true ) {
								inheritance_value = data.PROGRESS_COUNT
							}
							
							if ( p_ret_bt_mission.NEXT_MISSION_ID != 0 ) {
								// GT_MISSION select
								GTMgr.inst.GetGTMission().create(
									{ UUID : p_user.uuid, MISSION_ID : p_ret_bt_mission.NEXT_MISSION_ID, PROGRESS_COUNT : inheritance_value, REG_DATE : Timer.inst.GetNowByStrDate() }
								)
								.then(function (ret_create) {
									logger.info('UUID : %d MissionID : %d 연관 미션 존재에 따른 미션 발급.', p_user.uuid, p_ret_bt_mission.NEXT_MISSION_ID);

									if ( p_ret_bt_mission.PREV_VALUE_INHERITANCE == false ) {
										// BT_MISSION select - 해당 미션이 특정 조건을 만족 한다면 미션 진행 률을 다시 검사해야 한다. 
										BTMgr.inst.GetBTMission().find({
											where : { MISSION_ID : p_ret_bt_mission.NEXT_MISSION_ID }
										})
										.then(function (p_next_mission) {
											if ( p_next_mission != null ) {
												if ( p_next_mission.MISSION_GOAL_GROUP_NAME == 'CollectHeroEvolution' ) {
													MissionMgr.inst.CollectHeroEvolution(p_user, p_next_mission.MISSION_GOAL_TYPE);
												} else if ( p_next_mission.MISSION_GOAL_GROUP_NAME == 'CollectHeroPromotion' ) {
													MissionMgr.inst.CollectHeroPromotion(p_user, p_next_mission.MISSION_GOAL_TYPE);
												} else if ( p_next_mission.MISSION_GOAL_GROUP_NAME == 'CollectHeroTotal' ) {
													MissionMgr.inst.MissionCollectHeroTotal(p_user);
												}		
											}
											else {
												Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Mission In Base', 'ID', p_ret_bt_mission.NEXT_MISSION_ID);
											}	
										})
										.catch(function (p_error) {
											Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMissionReward 2-4');
										})
									}
								})
								.catch(function (p_error) {
									Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMissionReward 2-3');
								});
							}
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMissionReward 2-2');
						})
					}					
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMissionReward 2-1');
				});
			}		
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMissionReward 1');
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;