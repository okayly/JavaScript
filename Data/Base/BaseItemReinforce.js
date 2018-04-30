/********************************************************************
Title : BaseItemReinforce
Date : 2017.02.07
Update : 2017.04.07
Desc : BT 정보 - 장비 아이템 강화 비용
writer : jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseEnchantCost = function() {
		this.enchat_id;
		this.need_gold;
		this.need_material_id_1;
		this.need_material_count_1;
	}

	// Level up Gold 계산 => lv_up_gold + (현재 레벨 * lv_up_gold_lv) It's simple.

	var item_enchant_map = new HashMap();
		
	inst.AddItemEnchantCost = function(p_enchant_id, p_enchant) {
		// console.log('AddItemEnchantCost %d', p_enchant_id);
		item_enchant_map.set(p_enchant_id, p_enchant);
	}
	inst.GetItemEnchantCost = function(p_enchant_id) { return (item_enchant_map.has(p_enchant_id) == true) ? item_enchant_map.get(p_enchant_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;