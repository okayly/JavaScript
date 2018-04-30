/********************************************************************
Title : BaseChapter
Date : 2015.12.08
Update : 2017.03.29
Desc : BT 정보 - 챕터 정보
writer: dongsu -> jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.RewardBox = function() {
		this.RewardItem = function() {
			this.item_id;
			this.item_count;
		}

		this.gold;
		this.cash;
		this.need_star;
		this.reward_item_list = new Array();

		this.AddItem = function(p_index, p_item_id, p_item_count) {
			// console.log('RewardBox AddItem index : %d, item_id : %d, item_count : %d', p_index, p_item_id, p_item_count);			
			let reward_item	= new this.RewardItem();
			reward_item.item_id		= p_item_id;
			reward_item.item_count	= p_item_count;

			this.reward_item_list.push(reward_item);
		}
		this.GetItemList = function() { return this.reward_item_list; }
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseChapter = function() {
		this.chapter_id;
		this.chapter_type;
		this.reward_box_map = new HashMap();	// key : index, value : RewardBox
		this.first_stage_id;	// 길드 레이드 챕터에서 사용

		this.AddRewardBox = function(p_index, p_reward_box) { this.reward_box_map.set(p_index, p_reward_box); }
		this.GetRewardBox = function(p_index) { return (this.reward_box_map.has(p_index) == true) ? this.reward_box_map.get(p_index) : undefined; }
	}

	var chapter_map = new HashMap();

	inst.AddBaseChapter = function(p_chapter_id, p_chapter) { chapter_map.set(p_chapter_id, p_chapter); }
	inst.GetBaseChapter = function(p_chapter_id) { return (chapter_map.has(p_chapter_id) == true) ? chapter_map.get(p_chapter_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;