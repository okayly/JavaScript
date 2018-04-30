/********************************************************************
Title : BaseChallengeChapter
Date : 2016.02.02
Update : 2016.08.08
Desc : BT_ 정보 - 도전 모드 스테이지
writer: dongsu
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.BaseChallengeStage = function() {
		this.RewardItem = function() {
			this.item_id;
			this.item_count;
		}

		this.challenge_stage_id;
		this.account_limit_open_level;
		this.need_stamina;
		this.reward_account_exp;
		this.reward_hero_exp;
		this.reward_gold;

		this.reward_item_map	= new HashMap();
		this.limit_hero_type_map= new HashMap();
		this.limit_hero_id_map	= new HashMap();

		this.AddRewardItem = function(p_item_id, p_item_count) {
			if ( p_item_id != 0 ) {
				var reward_item			= new this.RewardItem();
				reward_item.item_id		= p_item_id;
				reward_item.item_count	= p_item_count;

				if ( this.reward_item_map.has(p_item_id) == true ) {
					var temp_item			= this.reward_item_map.get(p_item_id);
					reward_item.item_count	= reward_item.item_count + temp_item.item_count;
				}

				this.reward_item_map.set(p_item_id, reward_item);
			}
		}
		this.GetRewardItemMap = function() { return this.reward_item_map; }

		this.AddLimitHeroType = function(p_type) { this.limit_hero_type_map.set(p_type, p_type); }
		this.AddLimitHeroID = function(p_id) { this.limit_hero_id_map.set(p_id, p_id); }

		this.CheckLimitHero = function(p_type, p_id) { return ( this.limit_hero_id_map.has(p_id) == true || this.limit_hero_type_map.has(p_type) == true ) ? false : true; }
	}

	var stage_map = new HashMap();	// key : stage_id, value : BaseChallengeStage

	inst.AddBaseChallengeStage = function(p_stage_id, p_stage) {
		// console.log('AddBaseChallengeStage', p_stage_id, p_stage);
		stage_map.set(p_stage_id, p_stage);
	}
	inst.GetBaseChallengeStage = function(p_stage_id) { 
		return (stage_map.has(p_stage_id) == true) ? stage_map.get(p_stage_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;