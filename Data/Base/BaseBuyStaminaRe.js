/********************************************************************
Title : BaseBuyStaminaRe
Date : 2016.07.19
Desc : BT 정보 - 스테미너 구매
writer: jongwook
********************************************************************/
(function(exports) {
	// private 변수
	
	// public	
	var inst = {};
	
	inst.BuyStamina = function() {
		this.count;			// 충전 회차
		this.need_cash;		// VIP 단계
		this.gain_stamina;	// 누적 구매 캐쉬
	}

	var buy_stamina_map = new HashMap();	// key : Buy Count, value : BuyCash

	inst.AddBuyStamina = function(p_count, p_buy_stamina) { buy_stamina_map.set(p_count, p_buy_stamina); }
	inst.GetBuyStamina = function(p_count) { return ( buy_stamina_map.has(p_count) == true ) ? buy_stamina_map.get(p_count) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;