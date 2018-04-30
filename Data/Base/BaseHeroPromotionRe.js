/********************************************************************
Title : BaseHeroPromotionRe
Date : 2015.12.08
Update : 2016.07.21
Desc : 영웅 승급(테두리) 기본 정보.
writer: dongsu
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var NeedItem = function() {
		this.item_id;
		this.item_count;
	}

	inst.BaseHeroPromotion = function() {
		this.promotion_id;
		this.promotion_step;
		this.need_gold;

		this.need_item_map = new HashMap();

		this.AddNeedItem = function(p_item_id, p_item_count) {
			var need_item		= new NeedItem();
			need_item.item_id	= p_item_id;
			need_item.item_count= p_item_count;

			this.need_item_map.set(p_item_id, need_item);
		}
		this.GetNeedItemMap = function() { return this.need_item_map; }
	}

	inst.BaseHeroPromotionGroup = function() {
		this.group_id;
		this.hero_promotion_map = new HashMap();

		this.AddHeroPromotion = function(p_promotion_step, p_promotion) {
			// console.log('AddHeroPromotion', p_promotion_step, p_promotion);
			this.hero_promotion_map.set(p_promotion_step, p_promotion);
		}
		this.GetHeroPromotion = function(p_promotion_step) { return (this.hero_promotion_map.has(p_promotion_step) == true) ? this.hero_promotion_map.get(p_promotion_step) : undefined; }
	}

	var hero_promotion_group_map = new HashMap();

	inst.AddHeroPromotionGroup = function(p_promotion_group_id, p_promotion_group) { hero_promotion_group_map.set(p_promotion_group_id, p_promotion_group); }
	inst.GetHeroPromotionGroup = function(p_promotion_group_id) { return hero_promotion_group_map.has(p_promotion_group_id) ? hero_promotion_group_map.get(p_promotion_group_id) : undefined; }

	inst.GetHeroPromotion = function(p_promotion_group_id, p_promotion_step) {
		if (hero_promotion_group_map.has(p_promotion_group_id) == false)
			return undefined;

		return hero_promotion_group_map.get(p_promotion_group_id).GetHeroPromotion(p_promotion_step);
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;