/********************************************************************
Title : BaseStage
Date : 2015.12.08
Update : 2016.07.21
Desc : BT 정보 - 스테이지 정보
writer: dongsu
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.BaseStage = function() {
		this.RewardItem = function() {
			this.item_id;
			this.item_count;
		}

		this.stage_id;
		this.next_stage_id; 	// 길드 레이드 용.
		this.boss_hp; 		// 길드 레이드 용.
		this.drop_item_group_id;
		this.need_stamina;
		this.reward_account_exp;
		this.reward_hero_exp;
		this.reward_gold;
		this.first_clear_reward_item_map = new HashMap();	// key : index, value : RewardItem
		this.sweep_reward_item_map = new HashMap();			// key : index, value : RewardItem

		this.AddFristClearRewardItem = function(p_index, p_item_id, p_item_count) {
			// console.log('AddFristClearRewardItem AddItem index : %d, item_id : %d, item_count : %d', p_index, p_item_id, p_item_count);
			if ( p_item_id != 0 ) {
				var reward_item			= new this.RewardItem();
				reward_item.item_id		= p_item_id;
				reward_item.item_count	= p_item_count;

				this.first_clear_reward_item_map.set(p_index, reward_item);
			}
		}
		this.GetFristClearRewardItem = function(p_index) { return (this.first_clear_reward_item_map.has(p_index) == true) ? this.first_clear_reward_item_map.get(p_index) : undefined; }
		this.GetFristClearRewardAllItem = function() { return this.first_clear_reward_item_map; }

		this.AddSweepRewardItem = function(p_index, p_item_id, p_item_count) {
			// console.log('AddSweepRewardItem AddItem index : %d, item_id : %d, item_count : %d', p_index, p_item_id, p_item_count);
			if ( p_item_id != 0 ) {
				var reward_item			= new this.RewardItem();
				reward_item.item_id		= p_item_id;
				reward_item.item_count	= p_item_count;

				this.sweep_reward_item_map.set(p_index, reward_item);
			}
		}
		this.GetSweepRewardItem = function(p_index) { return (this.sweep_reward_item_map.has(p_index) == true) ? this.sweep_reward_item_map.get(p_index) : undefined; }
		this.GetSweepRewardAllItem = function() { return this.sweep_reward_item_map; }
	}

	var stage_map = new HashMap();	// key : stage_id, value : BaseStage

	inst.AddBaseStage = function(p_stage_id, p_stage) { stage_map.set(p_stage_id, p_stage); }
	inst.GetBaseStage = function(p_stage_id) { return (stage_map.has(p_stage_id) == true) ? stage_map.get(p_stage_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;