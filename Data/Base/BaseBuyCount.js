/********************************************************************
Title : BaseBuyCount
Date : 2017.02.07
Update : 2017.02.07
Desc : BT 정보 - 구매 횟수 필요 캐쉬
writer : jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseBuyCount = function() {
		this.count;
		this.inventory_slot_count;
		this.need_inventory_slot_cash;
		this.need_prophcy_spring_join_cash;	// 예언의샘 참여 소비 캐쉬
	}

	var buy_count_map = new HashMap();
		
	inst.AddBuyCount = function(p_count, p_buy_count) {
		// console.log('AddBuyCount %d', p_count);
		buy_count_map.set(p_count, p_buy_count);
	}
	inst.GetBuyCount = function(p_count) { return (buy_count_map.has(p_count) == true) ? buy_count_map.get(p_count) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;