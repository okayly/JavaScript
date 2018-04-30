/********************************************************************
Title : MissionProgress
Date : 2016.06.29
Update : 2017.03.16
Desc : 미션 진행 정보
writer: dongsu
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTMission = require('../../DB/GTLoad/LoadGTMission.js');

var BaseMission = require('../../Data/Base/BaseMission.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetMission = function(p_ret_mission, p_uuid, p_mission_id, p_progress_count, p_type, p_group_id, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_mission == null ) {
				// GT_MISSION insert
				GTMgr.inst.GetGTMission().create({
					UUID			: p_uuid,
					MISSION_ID		: p_mission_id,
					MISSION_TYPE	: p_type,
					MISSION_GROUP_ID: p_group_id,
					START_MISSION_ID: p_mission_id,
					PROGRESS_COUNT	: p_progress_count,
					LAST_DATE		: Timer.inst.GetNowByStrDate(),
					REG_DATE		: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_mission_create => {
					console.log('Mission create');
					resolve(p_ret_mission_create);
				})
				.catch(p_error => { reject(p_error); });
			} else {
				// GT_MISSION update
				p_ret_mission.updateAttributes({
					PROGRESS_COUNT	: p_progress_count,
					LAST_DATE		: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_mission_update => {
					console.log('Mission update', p_ret_mission_update.dataValues.PROGRESS_COUNT);
					resolve(p_ret_mission_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		})
		.catch(p_error => {
			console.log('Error', p_error);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	inst.ReqMissionProgess = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqMissionProgess -', p_user.uuid, p_recv);

		let recv_mission_id = parseInt(p_recv.mission_id);
		let recv_progress_count = parseInt(p_recv.progress_count);
		let recv_is_accum = ( p_recv.is_accum == true || p_recv.is_accum == 'true' ) ? true : false;

		let base_mission = BaseMission.inst.GetMission(recv_mission_id);
		if ( typeof base_mission === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist mission MissionID :', recv_mission_id ]);

		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTMission.inst.SelectMission(p_user.uuid, recv_mission_id)
		])
		.then(values => {
			let ret_user = values[0];
			let ret_mission = values[1];

			if ( ret_user == null )
				throw ([ PacketRet.inst.retFail(), 'User is null' ]);

			// if ( base_mission.mission_open_lv != 0 && base_mission.mission_open_lv > ret_user.dataValues.USER_LEVEL )
			// 	throw ([ PacketRet.inst.retNotEnoughUserLevel(), 'Need UserLevel : ', base_mission.mission_open_lv ]);

			// 미션 카운트 처리
			if ( ret_mission != null ) {
				if ( recv_is_accum == true ) {
					recv_progress_count = ret_mission.dataValues.PROGRESS_COUNT + recv_progress_count;
				}
			}

			return new Promise(function (resolve, reject) {
				// start transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					SetMission(ret_mission, p_user.uuid, recv_mission_id, recv_progress_count, base_mission.mission_type, base_mission.link_group, t)
					.then(value => {
						t.commit();

						resolve(value);
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		})
		.then(value => {
			// console.log('value', value);
			p_ack_packet.mission_id = value.dataValues.MISSION_ID;
			p_ack_packet.progress_count = value.dataValues.PROGRESS_COUNT;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;