/********************************************************************
Title : BaseDailyContents
Date : 2016.04.26
Update : 2016.08.26
Desc: BT 정보 - 일일 결산 보상
Writer: jongwook
********************************************************************/
(function (exports) {
	// private 변수
	var Reward = function() {
		this.reward_type;
		this.reward_item_id;
		this.reward_count;
	}
	
	// public
	var inst = {};

	// RankMatch, 09:00
	inst.RewardRankingMatch = function() {
		this.reward_id;
		this.mail_string_id;
		this.rank_min;
		this.rank_max;
		this.reward_list = [];

		this.AddReward = function(p_reward_type, p_reward_item_id, p_reward_count) {
			var reward = new Reward();
			reward.reward_type = p_reward_type;
			reward.reward_item_id = p_reward_item_id;
			reward.reward_count = p_reward_count;

			this.reward_list.push(reward);
		}
	}
	
	// Reward InfinityTower, 05:00
	inst.RewardInfinityTower = function() {
		this.reward_id;
		this.mail_string_id;
		this.rank_min;
		this.rank_max;
		this.reward_list = [];

		this.AddReward = function(p_reward_type, p_reward_item_id, p_reward_count) {
			var reward = new Reward();
			reward.reward_type = p_reward_type;
			reward.reward_item_id = p_reward_item_id;
			reward.reward_count = p_reward_count;

			this.reward_list.push(reward);
		}
	}
	
	var reward_infinity_tower_map = new HashMap();
	var reward_rank_match_map = new HashMap();

	inst.SetRewardInfinityTower = function(p_reward_group_id, p_reward) {
		if (reward_infinity_tower_map.has(p_reward_group_id) == false) {
			reward_infinity_tower_map.set(p_reward_group_id, p_reward);
			// console.log('InfinityTower reward_group_id: %d, reward', p_reward_group_id, p_reward);
		}
	}
	inst.GetRewardInfinityTower = function(p_reward_group_id) {
		return (reward_infinity_tower_map.has(p_reward_group_id) == true) ? reward_infinity_tower_map.get(p_reward_group_id) : undefined;
	}

	inst.SetRewardRankingMatch = function(p_reward_group_id, p_reward) {
		if (reward_rank_match_map.has(p_reward_group_id) == false) {
			reward_rank_match_map.set(p_reward_group_id, p_reward);
			// console.log('RankingMatch reward_group_id: %d, reward', p_reward_group_id, p_reward);
		}
	}
	inst.GetRewardRankingMatch = function(p_reward_group_id) {
		return (reward_rank_match_map.has(p_reward_group_id) == true) ? reward_rank_match_map.get(p_reward_group_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;