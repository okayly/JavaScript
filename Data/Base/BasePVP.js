/********************************************************************
Title : 
Date : 
Desc : 
writer: dongsu
********************************************************************/

(function (exports) {
	// private 변수

	// public
	var inst = {};
	inst.LeagueInfo = function() {
		this.league_id;
		this.league_up_point;
		this.league_down_point;
		this.league_down_point_week;
		this.gain_max_point;
		this.reward_honor_point;
		this.daily_max_honor_point;
		this.achievement_homor_point;
		this.achievement_cash;
		this.reset_point_1;
		this.reset_point_2;
		this.reset_point_3;
	}

	var pvp_league_map = new Map();
	inst.AddLeague = function(p_info) {
		pvp_league_map.set(p_info.league_id, p_info);
	}
	inst.GetLeague = function(p_league_id) {
		return pvp_league_map.has(p_league_id) ? pvp_league_map.get(p_league_id) : undefined;
	}

	inst.GetLeagueByPoint = function(p_point) {
		let ret_league = pvp_league_map.get(1); // 기본 브론즈 리그를 기본으로 세팅. 
		pvp_league_map.forEach(function (value, key) {
			if ( value.league_up_point >= p_point && 
			     value.league_down_point <= p_point && 
			     value.league_up_point != 0 ) {
				logger.info('확인용 - 리그 아이디 변경 중. 입력 포인트 : %d, 리그 : - ', p_point, value);
				ret_league = value;
			}
		})

		return ret_league;
	}

	inst.GetDailyRewardRange = function(p_rank) {
		
		if ( p_rank >= 4 && p_rank <= 10 )	{
			return 1;
		}
		else if ( p_rank >= 11 && p_rank <= 30 )	{
			return 2;
		}
		else if ( p_rank >= 31 && p_rank <= 50 )	{
			return 3;
		}
		else if ( p_rank >= 51 && p_rank <= 70 )	{
			return 4;
		}
		else if ( p_rank >= 71 && p_rank <= 80 )	{
			return 5;
		}
		else if ( p_rank >= 81 && p_rank <= 100 )	{
			return 6;
		}

		return 0;
	}

	inst.GetWeekRewardRange = function(p_rank) {
		
		if ( p_rank >= 0 && p_rank <= 30 )	{
			return 1;
		}
		else if ( p_rank >= 11 && p_rank <= 30 )	{
			return 2;
		}
		else if ( p_rank >= 31 && p_rank <= 50 )	{
			return 3;
		}
		else if ( p_rank >= 51 && p_rank <= 70 )	{
			return 4;
		}
		else if ( p_rank >= 71 && p_rank <= 80 )	{
			return 5;
		}
		else if ( p_rank >= 81 && p_rank <= 100 )	{
			return 6;
		}

		return 0;
	}

	var GetRewardIndex = function(p_cycle, p_min, p_per) {
		if (p_per == false) {
			return inst.GetDailyRewardRange(p_min);
		}
		else {
			return inst.GetWeekRewardRange(p_min);
		}
	}

	inst.RewardInfo = function() {
		var reward = function() {
			this.reward_type;
			this.reward_id;
			this.reward_count;
		}

		this.reward_map = new Map();
		this.AddReward = function(p_index, p_type, p_id, p_count) {
			let data = new reward();
			data.reward_type 	= p_type;
			data.reward_id 	= p_id;
			data.reward_count 	= p_count;
			this.reward_map.set(p_index, data);
		}

		this.league_id;
		this.reward_cycle;
		this.is_per;
		this.min_range;
		this.max_range;
	}

	var RewardGroupByLeague = function() {
		this.league_id;
		this.top_rank_reward_info_map 	= new Map();
		this.AddTopInfo = function(p_index, p_info) {
			this.top_rank_reward_info_map.set(p_index, p_info) ;
		}
		this.range_rank_reward_info_map 	= new Map();
		this.AddRangeInfo = function(p_index, p_info) {
			this.range_rank_reward_info_map.set(p_index, p_info) ;
		}
		this.AddInfo = function(p_info) {
			if ( 	p_info.is_per == false && 
				(p_info.min_range == 1 || 
				 p_info.min_range == 2 || 
				 p_info.min_range == 3) ) {

				this.AddTopInfo(p_info.min_range, p_info);
			}
			else {
				let index = GetRewardIndex(p_info.reward_cycle, p_info.min_range, p_info.is_per);
				if ( index == 0 ) {
					 throw ('PVP Reward Index Error'); 
				}
				this.AddRangeInfo(index, p_info);
			}
		}
		this.GetTopInfo = function(p_rank) {
			return (this.top_rank_reward_info_map.get(p_rank) == true) ? this.top_rank_reward_info_map.get(p_rank) : undefined;
		}
		this.GetRangeInfo = function(p_rank) {
			let ret_index = GetDailyRewardRange(p_rank);
			if ( ret_index == 0 ) { 
				return undefined;
			}
			return (this.range_rank_reward_info_map.get(ret_index) == true) ? this.range_rank_reward_info_map.get(ret_index) : undefined;	
		}
	}


	var daily_rank_reward_map = new Map();
	var week_rank_reward_map = new Map();
	inst.AddPvPReward = function(p_info) {

		if ( p_info.reward_cycle == 1 ) { 	// 일일.
			if ( daily_rank_reward_map.has(p_info.league_id) == true ) {
				let daily_rank_reward = daily_rank_reward_map.get(p_info.league_id);
				daily_rank_reward.AddInfo(p_info);
			}
			else {
				let daily_rank_reward = new RewardGroupByLeague();
				daily_rank_reward.AddInfo(p_info);
				daily_rank_reward_map.set(p_info.league_id, daily_rank_reward);
			}
		}
		else { 					// 주간.
			if ( week_rank_reward_map.has(p_info.league_id) == true ) {
				let week_rank_reward = week_rank_reward_map.get(p_info.league_id);
				week_rank_reward.AddInfo(p_info);
			}
			else {
				let week_rank_reward = new RewardGroupByLeague();
				week_rank_reward.AddInfo(p_info);
				week_rank_reward_map.set(p_info.league_id, week_rank_reward);
			}	
		}
	}

	inst.GetPvPDailyReward = function(p_league_id, p_rank) {
		if ( daily_rank_reward_map.has(p_league_id) == true ) {
			let daily_rank_reward = daily_rank_reward_map.get(p_league_id);
			// daily_rank_reward.
			if ( p_rank >= 1 && p_rank <= 3 ) {
				return daily_rank_reward.GetTopInfo(p_rank);
			}
			else {
				return daily_rank_reward.GetRangeInfo(p_rank);
			}
		}

		return undefined;
	}


	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;