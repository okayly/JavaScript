/********************************************************************
Title : MissionReward 
Date : 2016.06.29
Update : 2017.03.30
Desc : 미션 보상
	   완료한 미션 보상 받기
	   미션 보상만 RewardType이 0이면 계정 경험치 보상이다.(기획과 합의 내용. 2016-06-16 jongwook)
writer: dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');
var RewardMgr = require('../RewardMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTMission = require('../../DB/GTLoad/LoadGTMission.js');

var BaseMission = require('../../Data/Base/BaseMission.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetMission = function(p_ret_mission, p_mission_type, p_next_mission_id, p_t) {
		return new Promise(function (resolve, reject) {
			// 순서 중요.
			// 1. 보상 ID에 현재 MISSION_ID 설정
			p_ret_mission['REWARD_MISSION_ID'] = p_ret_mission.dataValues.MISSION_ID;

			// 2. 다음 미션 ID가 있으면 MISSION_ID 를 next_mission_id로 바꾼다.
			if ( p_next_mission_id != 0 )
				p_ret_mission['MISSION_ID'] = p_next_mission_id;

			// 3. 정복 미션은 진행 값을 초기화
			if ( p_mission_type == DefineValues.inst.ConquestyMission )
				p_ret_mission['PROGRESS_COUNT'] = 0;

			p_ret_mission['LAST_DATE'] = Timer.inst.GetNowByStrDate();

			// GT_MISSION update
			p_ret_mission.save({ transaction : p_t })
			.then(p_ret_mission_update => { resolve(p_ret_mission_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqMissionReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqMissionReward -', p_user.uuid, p_recv);

		var recv_mission_id	 = parseInt(p_recv.mission_id);

		let base_mission = BaseMission.inst.GetMission(recv_mission_id);
		if ( typeof base_mission === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist mission MissionID :', recv_mission_id ]);

		// Promise.all GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTMission.inst.SelectMission(p_user.uuid, recv_mission_id)
		])
		.then(values => {
			let ret_user = values[0];
			let ret_mission = values[1];

			if ( ret_user == null || ret_mission == null )
				throw ([ PacketRet.inst.retFail(), 'User or mission is null' ]);

			console.log('REWARD_MISSION_ID', ret_mission.dataValues.REWARD_MISSION_ID, Object.prototype.toString.call(ret_mission.dataValues.REWARD_MISSION_ID));
			console.log('recv_mission_id', recv_mission_id, Object.prototype.toString.call(recv_mission_id));

			if ( ret_mission.dataValues.REWARD_MISSION_ID != 0 && ret_mission.dataValues.REWARD_MISSION_ID == recv_mission_id )
				throw ([ PacketRet.inst.retAlreadyRewardPayment, 'Already reward' ]);

			return new Promise(function (resolve, reject) {
				// start transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					SetMission(ret_mission, base_mission.mission_type, base_mission.next_mission_id, t)
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
			let mission_data = value.dataValues;

			p_ack_packet.mission_id = recv_mission_id;
			p_ack_packet.progress_count = mission_data.PROGRESS_COUNT;

			// 패킷은 RewardMgr에서 보낸다. 이거 좀 맘에 안드는데. 바꾸고 싶다. 2017.03.16
			let reward_list = base_mission.GetRewardList();
			RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, reward_list);
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