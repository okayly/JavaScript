/********************************************************************
Title : BaseItemRe
Date : 2015.12.08
Update : 2017.02.07
Desc : BT 정보 - 아이템 정보
writer : dongsu
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseItemPromotion = function() {
		this.promotion_id;
		this.step;
		this.need_gold;
		this.limit_item_level;
		this.need_item_map = new HashMap();	// key : item_id, value : item_count

		this.AddNeedItem = function(p_item_id, p_item_count) {
			if ( this.need_item_map.has(p_item_id) == true ) {
				var item_count = this.need_item_map.get(p_item_id);
				this.need_item_map.set(p_item_id, p_item_count + item_count);
			} else {
				this.need_item_map.set(p_item_id, p_item_count);
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseItem = function() {
		this.item_id;
		this.category1;
		this.category2;
		this.index;
		this.buy_cost_gold;
		this.buy_cost_cash;
		this.buy_cost_point;
		this.sell_gold;
		this.equip_status_id;
		this.promotion_id;
		this.hero_id;
		this.effect1_id;
		this.effect1_value1;
		this.effect1_value2;
		this.effect2_id;
		this.effect2_value1;
		this.effect2_value2;
		this.effect3_id;
		this.effect3_value1;
		this.effect3_value2;
		this.max_promotion_step;
		
		this.promotion_map = new HashMap();
		
		this.AddPromotionInfo = function(p_promotion_step, p_promotion) {
			// console.log('AddPromotionInfo promotion_step : %d, promotion :', p_promotion_step, p_promotion);
			this.promotion_map.set(p_promotion_step, p_promotion);

			if ( typeof this.max_promotion_step === 'undefined' ) {
				this.max_promotion_step = p_promotion_step;
			} else {
				if ( this.max_promotion_step < p_promotion_step )
					this.max_promotion_step = p_promotion_step;
			}
			// console.log('item_id : %d, this.max_promotion_step : %d', this.item_id, this.max_promotion_step);
		}
		this.GetPromotionInfo = function(p_step) { return this.promotion_map.get(p_step); }
	}

	var base_item_map = new HashMap();

	inst.AddItem = function(p_item_id, p_item) { base_item_map.set(p_item_id, p_item); }
	inst.GetItem = function(p_item_id) { return (base_item_map.has(p_item_id) == true) ? base_item_map.get(p_item_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;