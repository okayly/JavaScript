/********************************************************************
Title : BaseHeroRe
Date : 2015.12.08
Update : 2017.04.17
Desc : BT 정보 - 영웅 정보
writer : dongsu -> jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseHero = function() {
		this.hero_id;
		this.reinforce_id;
		this.evolution_step;
		this.stone_id;

		this.skill_list = [];
		this.army_id;

		this.AddSkillID = function(p_skill_id) {
			// console.log('p_skill_id', p_skill_id);
			if ( p_skill_id != 0 )
				this.skill_list.push(p_skill_id);
		}
		this.SetArmyID = function(p_army_id) { this.army_id = p_army_id; }		
	}

	var hero_map = new HashMap();

	inst.AddHero = function(p_hero_id, p_hero) {
		// console.log('p_hero_id', p_hero_id, p_hero);
		hero_map.set(p_hero_id, p_hero);
	}
	inst.GetHero = function(p_hero_id) { return hero_map.has(p_hero_id) ? hero_map.get(p_hero_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;