/********************************************************************
Title : BT_Mission
Date : 2016.03.17
Update : 2017.03.16
Desc : 미션 로드
writer: jongwwok
********************************************************************/
var BaseMission = require('../../Data/Base/BaseMission.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadBTMission = function (p_bt_mission) {
		logger.debug('*** Start LoadBTMission ***');

		p_bt_mission.findAll()
		.then( p_ret_mission => {
			for ( let cnt in p_ret_mission ) {
				let mission = new BaseMission.inst.BaseMission();

				mission.mission_id = p_ret_mission[cnt].MISSION_ID;
				mission.mission_type = p_ret_mission[cnt].MISSION_TYPE;
				mission.conquest_mission_id = p_ret_mission[cnt].CONQUEST_MISSION_ID;
				mission.link_group = p_ret_mission[cnt].LINK_GROUP;
				mission.next_mission_id = p_ret_mission[cnt].NEXT_MISSION_ID;
				mission.mission_goal_group = p_ret_mission[cnt].MISSION_GOAL_GROUP;
				mission.mission_goal_type = p_ret_mission[cnt].MISSION_GOAL_TYPE;
				mission.mission_goal_value = p_ret_mission[cnt].MISSION_GOAL_VALUE;
				mission.mission_open_lv = p_ret_mission[cnt].MISSION_OPEN_LV;
				mission.prev_value_inheritance = p_ret_mission[cnt].PREV_VALUE_INHERITANCE;

				mission.AddReward(p_ret_mission[cnt].REWARD_TYPE1, p_ret_mission[cnt].REWARD_ID1, p_ret_mission[cnt].REWARD_VAUE1);
				mission.AddReward(p_ret_mission[cnt].REWARD_TYPE2, p_ret_mission[cnt].REWARD_ID2, p_ret_mission[cnt].REWARD_VAUE2);

				BaseMission.inst.AddMission(mission.mission_id, mission);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTMission!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
