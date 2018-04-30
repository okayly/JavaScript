/********************************************************************
Title : BaseRankMatch
Date : 2016.04.21
Desc : BT 정보 - 랭킹전
writer: dongsu
********************************************************************/

(function (exports) {
	// private 변수

	// public
	var inst = {};
	inst.MatchRangeInfo = function() {
		this.range_id;
		this.min;
		this.max;
	}

	// -----------------------------------------------------------------------------
	// 매칭 대상 찾기 범위. 
	var match_range_map = new HashMap();
	inst.AddMatchRangeInfo = function(p_info) {
		match_range_map.set(p_info.range_id, p_info);
	}
	inst.GetAllMatchRangeInfo = function() { return match_range_map; }


	// -----------------------------------------------------------------------------
	// 참여 보상. 
	inst.ParticipationRewardInfo = function() {
		this.RewardInfo = function() {
			this.reward_id;
			this.reward_type;
			this.reward_count;
		}

		this.reward_id;
		this.progress_count;
		this.reward_map = new HashMap();
		this.AddRewardInfo = function(p_index, p_type, p_id, p_count) {
			var reward = new this.RewardInfo();
			reward.reward_id = p_id;
			reward.reward_type = p_type;
			reward.reward_count = p_count;
			this.reward_map.set(p_index, reward);
		}
		this.GetAllReward = function() { return this.reward_map; }
	}

	var participation_info_map = new HashMap(); // key : ProgressCount, value : ParticipationRewardInfo()
	inst.AddParticipationInfo = function(p_info) {
		participation_info_map.set(p_info.reward_id, p_info);
	}

	inst.GetParticipationInfo = function(p_id) {
		return participation_info_map.has(p_id) ? participation_info_map.get(p_id) : undefined;
	}

	// -----------------------------------------------------------------------------
	// 연승 보상. 
	inst.WinningStreakRewardInfo = function() {
		this.RewardInfo = function() {
			this.reward_id;
			this.reward_type;
			this.reward_count;
		}

		this.reward_id;
		this.winning_count;
		this.reward_map = new HashMap();
		this.AddRewardInfo = function(p_index, p_type, p_id, p_count) {
			var reward = new this.RewardInfo();
			reward.reward_id = p_id;
			reward.reward_type = p_type;
			reward.reward_count = p_count;
			this.reward_map.set(p_index, reward);
		}
		this.GetAllReward = function() { return this.reward_map; }
	}

	var winning_streak_info_map = new HashMap(); // key : ProgressCount, value : ParticipationRewardInfo()
	inst.AddWinningStreakInfo = function(p_info) {
		winning_streak_info_map.set(p_info.reward_id, p_info);
	}

	inst.GetWinningStreakInfo = function(p_id) {
		return winning_streak_info_map.has(p_id) ? winning_streak_info_map.get(p_id) : undefined;
	}

	// -----------------------------------------------------------------------------
	// 업적 보상. 
	inst.AchievementRewardInfo = function() {
		this.RewardInfo = function() {
			this.reward_id;
			this.reward_type;
			this.reward_count;
		}

		this.reward_id;
		this.achieved_rank;
		this.reward_map = new HashMap();
		this.AddRewardInfo = function(p_index, p_type, p_id, p_count) {
			var reward = new this.RewardInfo();
			reward.reward_id = p_id;
			reward.reward_type = p_type;
			reward.reward_count = p_count;
			this.reward_map.set(p_index, reward);
		}
		this.GetAllReward = function() { return this.reward_map; }
	}

	var achievement_info_map = new HashMap(); // key : ProgressCount, value : ParticipationRewardInfo()
	inst.AddAchievementInfo = function(p_info) {
		achievement_info_map.set(p_info.reward_id, p_info);
	}

	inst.GetAchievementInfo = function(p_id) {
		return achievement_info_map.has(p_id) ? achievement_info_map.get(p_id) : undefined;
	}

	// -----------------------------------------------------------------------------
	// 업적 보상. 
	inst.CostInfo = function() {
		this.min_count;
		this.max_count;
		this.change_match_player_cost;
		this.add_play_count_cost;
	}

	var cost_list = [];
	inst.AddCostInfo = function(p_info) {
		// logger.info('정보 추가. ', p_info);
		cost_list.push(p_info);
	}
	inst.GetCostInfo = function(p_count) {
		for (var i in cost_list) {
			if ( cost_list[i].min_count <= p_count && cost_list[i].max_count >= p_count ) {
				logger.info('코스트 반환. - ', cost_list[i]);
				return cost_list[i];
			}
		}

		return undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;