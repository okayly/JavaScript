/********************************************************************
Title : BaseTower
Date : 2016.04.05
Update : 2016.08.18
Desc : BT 정보 - 무한탑 배틀, 보물상자, 버프상점, 비밀미로
Writer : jongwook
********************************************************************/
(function(exports) {
	// private 변수
	var BattleReward = function() {
		this.ticket;
		this.score;
	}

	var Reward = function() {
		this.reward_type;
		this.reward_item_id;
		this.reward_count;
	}
	
	// public
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	// Tower
	inst.Tower = function() {
		this.tower_id;
		this.floor;
		this.floor_type;
		this.battle_reward_map = new HashMap();	// BattleReward map
		this.awake_reward_challenge_point;		// 각성 배틀 도전 포인트 보상
		this.reward_box_list = [];				// Reward array
		this.buff_group_id_list = [];			// int array
		this.secret_maze_buff_id_list = [];		// int array

		this.AddBattleReward = function(p_battle_type, p_ticket, p_score) {
			if (this.battle_reward_map.has(p_battle_type) == false) {
				var reward = new BattleReward();
				reward.ticket	= p_ticket;
				reward.score	= p_score;

				this.battle_reward_map.set(p_battle_type, reward);
			}
		}
		this.GetBattleReward = function(p_battle_type) {
			return (this.battle_reward_map.has(p_battle_type) == true) ? this.battle_reward_map.get(p_battle_type) : undefined;
		}

		this.AddRewardBox = function(p_reward_type, p_reward_item_id, p_reward_count) {
			var reward_box = new Reward();
			reward_box.reward_type		= p_reward_type;
			reward_box.reward_item_id	= p_reward_item_id;
			reward_box.reward_count		= p_reward_count;

			this.reward_box_list.push(reward_box);
		}
	}

	var tower_map = new HashMap();

	inst.AddTowerFloor = function(p_floor, p_tower) {
		if (tower_map.has(p_floor) == false) {
			tower_map.set(p_floor, p_tower);
			// console.log('tower_floor: %d, tower:', p_floor, p_tower);
		}
	}
	inst.GetTowerFloor = function(p_floor) {
		return (tower_map.has(p_floor) == true) ? tower_map.get(p_floor) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// BuffList
	inst.BuffList = function() {
		this.buff_id;
		this.need_ticket;
	}

	var buff_list_map = new HashMap();

	inst.AddBuffList = function(p_buff_id, p_buff_list) {
		if (buff_list_map.has(p_buff_id) == false) {
			buff_list_map.set(p_buff_id, p_buff_list);
			// console.log('buff_id: %d, buff_list:', p_buff_id, p_buff_list);
		}
	}
	inst.GetBuffList = function(p_buff_id) {
		return (buff_list_map.has(p_buff_id) ? buff_list_map.get(p_buff_id) : undefined);
	}

	//------------------------------------------------------------------------------------------------------------------
	// CashRewardBox
	inst.CashRewardBox = function() {
		this.buy_count;
		this.need_cash;
		this.randombox_id;
	}

	var cash_reward_box_map = new HashMap();

	inst.AddCashRewardBox = function(p_buy_count, p_cash_reward_box) {
		if (cash_reward_box_map.has(p_buy_count) == false) {
			cash_reward_box_map.set(p_buy_count, p_cash_reward_box);
			// console.log('buy_count: %d, cash_reward_box:', p_buy_count, p_cash_reward_box);
		}
	}
	inst.GetCashRewardBox = function(p_buy_count) {
		return (cash_reward_box_map.has(p_buy_count) == true) ? cash_reward_box_map.get(p_buy_count) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// BattleSkip
	inst.BattleSkip = function() {
		this.battle_skip_continue_day;
		this.max_battle_skip_floor;
	}

	var battle_skip_map = new HashMap();

	inst.AddBattleSkipMaxFloor = function(p_skip_continue_day, p_max_battle_skip_floor) {
		if (battle_skip_map.has(p_skip_continue_day) == false) {
			battle_skip_map.set(p_skip_continue_day, p_max_battle_skip_floor);
			// console.log('battle_skip_continue_day: %d, max_battle_skip_floor: %d', p_skip_continue_day, p_max_battle_skip_floor);
		}
	}
	inst.GetBattleSkipMaxFloor = function(p_skip_continue_day) {
		if (p_skip_continue_day == 0){
			p_skip_continue_day = 1
		}
		else if (p_skip_continue_day > battle_skip_map.count()) {
			p_skip_continue_day = battle_skip_map.count();
		}

		return (battle_skip_map.has(p_skip_continue_day) == true) ? battle_skip_map.get(p_skip_continue_day) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// AccumScoreReward
	inst.AccumScoreReward = function() {
		this.score_reward_id;
		this.accum_score;
		this.reward_list = [];

		this.AddReward = function(p_reward_type, p_reward_item_id, p_reward_count) {
			var reward = new Reward();
			reward.reward_type		= p_reward_type;
			reward.reward_item_id	= p_reward_item_id;
			reward.reward_count		= p_reward_count;

			this.reward_list.push(reward);
		}
	}

	var accum_score_reward_map = new HashMap();

	inst.AddAccumScoreReward = function(p_score_reward_id, p_accum_score, p_reward) {
		if (accum_score_reward_map.has(p_score_reward_id) == false) {
			accum_score_reward_map.set(p_score_reward_id, p_reward);
			// console.log('score_reward_id:%d, accum_score: %d, reward:', p_score_reward_id, p_accum_score, p_reward);
		}
	}
	inst.GetAccumScoreReward = function(p_score_reward_id) {
		return (accum_score_reward_map.has(p_score_reward_id) == true) ? accum_score_reward_map.get(p_score_reward_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// RankReward
	inst.RankReward = function() {
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
	
	var rank_reward_map = new HashMap();

	inst.AddRankReward = function(p_reward_id, p_rank_reward) {
		if (rank_reward_map.has(p_reward_id) == false) {
			rank_reward_map.set(p_reward_id, p_rank_reward);
			// console.log('reward_id: %d, rank_reward:', p_reward_id, p_rank_reward);
		}
	}
	inst.GetRankReward = function(p_rank) {
		var rank_reward = undefined;
		rank_reward_map.forEach(function(value, key) {
			if (value.rank_min <= p_rank && value.rank_max >= p_rank)
				rank_reward = value;
		});
		return rank_reward;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;