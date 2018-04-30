/********************************************************************
Title : BaseItemEvolutionRe
Date : 2015.12.11
Update : 2016.07.21
Desc : BT 정보 - 아이템 진화 기본 정보. 
writer : jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseItemEvolution = function() {
		this.step;
		this.need_gold;
		this.need_item_id;
		this.need_item_count;
	}

	var max_step;
	var evolution_map = new HashMap();

	inst.AddItemEvolution = function(p_step, p_evolution) {
		evolution_map.set(p_step, p_evolution);
		if ( typeof max_step === 'undefined' ) {
			max_step = p_step;
		} else {
			max_step = ( p_step > max_step ) ? p_step : max_step;
		}
	}
	inst.GetItemEvolution = function(p_step) { return ( evolution_map.has(p_step) == true ) ? evolution_map.get(p_step) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;