/********************************************************************
Title : BaseSoulBound
Date : 2016.03.24
Desc:  BT 정보 - 룬 슬롯, 룬 레시피, 룬 성장
Writer: jongwook
********************************************************************/

(function (exports) {
	// private 변수
	var NeedItem = function () {
		this.item_id;
		this.item_count;
	}

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// RuneSlot
	inst.RuneSlot = function () {
		this.rune_slot_id;
		this.rune_slot_type;
		this.rune_slot_step;

		this.open_slot_need_hero_level;
		this.open_slot_need_gold;
		this.open_slot_need_item_map = new HashMap();

		this.remove_rune_need_gold;
		this.remove_rune_need_item;

		this.AddOpenSlotNeedItem = function (p_item_id, p_item_count) {
			if ( this.open_slot_need_item_map.has(p_item_id) == false ) {
				var item		= new NeedItem();
				item.item_id	= p_item_id;
				item.item_count	= p_item_count;

				this.open_slot_need_item_map.set(item.item_id, item);
			}
		}

		this.SetRemoveRuneNeedItem = function (p_item_id, p_item_count) {
			if ( typeof this.remove_rune_need_item === 'undefined' ) {
				this.remove_rune_need_item				= new NeedItem();
				this.remove_rune_need_item.item_id		= p_item_id;
				this.remove_rune_need_item.item_count	= p_item_count;
			}
		}
	}

	var rune_slot_map = new HashMap();		// RuneSlot map

	inst.AddRuneSlot = function (p_rune_slot_id, p_rune_slot) {
		if (rune_slot_map.has(p_rune_slot_id) == false) {
			rune_slot_map.set(p_rune_slot_id, p_rune_slot);
			// console.log('rune_slot_id: %d, rune_slot:', p_rune_slot_id, p_rune_slot);
		}
	}

	inst.GetRuneSlot = function (p_rune_slot_id) {
		return rune_slot_map.has(p_rune_slot_id) ? rune_slot_map.get(p_rune_slot_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// RuneRecipe
	inst.RuneRecipe = function () {
		this.rune_recipe_id;
		this.need_account_level;
		this.need_gold;
		this.need_rune_craft_point;
		this.need_soul_stone_grade;
		this.bonus_soul_stone_type;
	}	
	
	var rune_recipe_map = new HashMap();	// RuneRecipe map

	// RuneRecipe
	inst.AddRuneRecipe = function (p_rune_recipe_id, p_rune_recipe) {
		if (rune_recipe_map.has(p_rune_recipe_id) == false) {
			rune_recipe_map.set(p_rune_recipe_id, p_rune_recipe);
			// console.log('recipe_id: %d, recipe:', p_rune_recipe_id, p_rune_recipe);
		}
	}

	inst.GetRuneRecipe = function (p_rune_recipe_id) {
		return rune_recipe_map.has(p_rune_recipe_id) ? rune_recipe_map.get(p_rune_recipe_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;