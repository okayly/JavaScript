/********************************************************************
Title : BaseHeroEvolutionRe
Date : 2015.12.08
Desc : BT 정보 - 영웅 진화(별) 기본 정보.
writer: dongsu
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseHeroEvolution = function() {
		this.evolution_step;
		this.need_gold;
		this.need_hero_stone_count;
		this.hero_stone_exchange;
	}

	var hero_evolution_map = new HashMap();

	inst.AddHeroEvolution = function(p_evolution_step, p_evolution) { hero_evolution_map.set(p_evolution_step, p_evolution); }
	inst.GetHeroEvolution = function(p_evolution_step) { return hero_evolution_map.has(p_evolution_step) ? hero_evolution_map.get(p_evolution_step) : undefined; }
	inst.GetNeedStoneCountByEvolutionStep = function(p_evolution_step) {
		var stone_count = 0;
		for (var step = 1; step <= p_evolution_step; ++step) {
			if (hero_evolution_map.has(step) == true) {
				stone_count = stone_count + hero_evolution_map.get(step).need_hero_stone_count;
			}
		}
		return stone_count;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;