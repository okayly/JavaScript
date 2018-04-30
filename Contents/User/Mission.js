/********************************************************************
Title : Mission
Date : 2016.07.14
Update : 2017.03.16
Desc : 로그인 정보 - 미션
writer: dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	var GetMissionList = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_MISSION select
			GTMgr.inst.GetGTMission().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_mission_list => { resolve(p_ret_mission_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var CheckDailyMission = function(p_ret_mission, p_t) {
		return new Promise(function (resolve, reject) {
			if ( Timer.inst.IsNewDay(p_ret_mission.dataValues.LAST_DATE) ) {
				// GT_MISSION update
				p_ret_mission.updateAttributes({
					PROGRESS_COUNT : 0,
					REWARD_MISSION_ID : 0,
					LAST_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_mission_update => { resolve(p_ret_mission_update); })
				.catch(p_error => { reject(p_error); });
			} else {
				resolve(p_ret_mission);
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var CheckWeeklyMission = function(p_ret_mission, p_t) {
		return new Promise(function (resolve, reject) {
			if ( Timer.inst.IsNewWeek(p_ret_mission.dataValues.LAST_DATE) ) {
				// GT_MISSION update
				p_ret_mission.updateAttributes({
					PROGRESS_COUNT : 0,
					REWARD_MISSION_ID : 0,
					LAST_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_mission_update =>{ resolve(p_ret_mission_update); })
				.catch(p_error => { reject(p_error); });
			} else {
				resolve(p_ret_mission);
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqMission = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqMission -', p_user.uuid, p_recv);

		// 미션 정보를 주면서 new day 확인 후 초기화가 필요한 미션 확인 후 초기화 진행
		// 일일 미션은 매일 05:00에 초기화
		// 주간 미션은 매주 월요일 05:00에 초기화

		// GT_MISSION select
		GetMissionList(p_user.uuid)
		.then(values => {
			return new Promise(function (resolve, reject) {
				// start transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					Promise.all(values.map(row => {
						if ( row.dataValues.MISSION_TYPE == DefineValues.inst.DailyMission ) {
							return CheckDailyMission(row, t);
						} else if ( row.dataValues.MISSION_TYPE == DefineValues.inst.WeeklyMission ) {
							return CheckWeeklyMission(row, t);
						} else {
							return row;
						}
					}))
					.then(values => {
						t.commit();

						resolve(values);
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		})
		.then(values => {
			// console.log('values', values);
			values.map(row => {
				let mission = new PacketCommonData.Mission();

				mission.mission_id = row.dataValues.MISSION_ID;
				mission.progress_count = row.dataValues.PROGRESS_COUNT;
				mission.is_rewarded = ( row.dataValues.REWARD_MISSION_ID == row.dataValues.MISSION_ID );

				p_ack_packet.mission_list.push(mission);
			});

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;