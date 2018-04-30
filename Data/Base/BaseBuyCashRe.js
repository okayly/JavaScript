/********************************************************************
Title : BaseBuyCashRe
Date : 2016.07.19
Desc : BT 정보 - 캐쉬 구매
writer: jongwook
********************************************************************/
(function(exports) {
	// private 변수
	
	// public	
	var inst = {};
	
	inst.BuyCash = function() {
		this.cash_id;		// 캐쉬 구매 아이디
		this.gain_cash;		// 캐쉬
		this.daily_value;	// 매일 1회 로그인 시 지급할 캐쉬
		this.daily_period;	// 지급할 기간
	}

	var buy_cash_map = new HashMap();	// key : Cash ID, value : BuyCash

	inst.AddBuyCash = function(p_cash_id, p_buy_cash) { buy_cash_map.set(p_cash_id, p_buy_cash); }
	inst.GetBuyCash = function(p_cash_id) { return ( buy_cash_map.has(p_cash_id) == true ) ? buy_cash_map.get(p_cash_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;