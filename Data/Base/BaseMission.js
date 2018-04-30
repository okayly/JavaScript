/********************************************************************
Title : BaseMission
Date : 2016.08.09
Update : 2017.03.16
Desc : BT 정보 - 미션
writer : jongwook
********************************************************************/
//-----------------------------------------------------------------------------------------------
(function (exports) {
	// public
	let inst = {};

	let Reward = function() {
		this.reward_type;
		this.reward_id;
		this.reward_value;
	}

	inst.BaseMission = function() {
		this.mission_id;
		this.mission_type;
		this.conquest_mission_id;
		this.link_group;
		this.next_mission_id;
		this.mission_goal_group;
		this.mission_goal_type;
		this.mission_goal_value;
		this.mission_open_lv;
		this.prev_value_inheritance;

		this.reward_list = new Array();

		this.AddReward = function(p_type, p_id, p_value) {
			let reward = new Reward();
			reward.reward_type  = p_type;
			reward.reward_id    = p_id;
			reward.reward_value = p_value;

			this.reward_list.push(reward);
		}

		this.GetRewardList = function() { return this.reward_list; }
	}

	let mission_map = new HashMap();

	inst.AddMission = function(p_mission_id, p_mission) {
		// console.log('AddMission %d', p_mission_id, p_mission);
		mission_map.set(p_mission_id, p_mission);
	}

	inst.GetMission = function(p_mission_id) { return ( mission_map.has(p_mission_id) == true ) ? mission_map.get(p_mission_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;