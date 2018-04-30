/********************************************************************
Title : BaseExpRe
Date : 2016.06.23
Update : 2017.04.07
Desc : 
	   BT 정보 - 계정 경험치, 영웅 경험치
	   스킬 레벨업 필요 비용, 아이템 레벨업 필요 비용
writer: jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.BaseExp = function() {
		this.level;
		this.need_exp;
		this.total_exp;
	}
	
	var max_account_level = 0;
	var account_exp_map = new HashMap();	// key : level, value : BaseExp(account)

	var max_hero_level = 0;
	var hero_exp_map = new HashMap();		// key : level, value : BaseExp(Hero)

	inst.AddAccountExp = function(p_account_level, p_account_exp) {
		if (p_account_level > max_account_level)
			max_account_level = p_account_level;

		account_exp_map.set(p_account_level, p_account_exp);
	}
	inst.GetAccountExp = function(p_account_level) {
		return (account_exp_map.has(p_account_level) == true) ? account_exp_map.get(p_account_level) : undefined;
	}
	inst.GetLevelupAccountExp = function(p_sum_exp) {
		let find_exp = undefined;
		let keys = account_exp_map.keys();

		for ( let cnt = 0; cnt < keys.length; ++cnt ) {
			let exp = account_exp_map.get(keys[cnt]);

			if ( exp.total_exp <= p_sum_exp ) {
				// console.log('find level : %d, exp : %d', exp.level, exp.total_exp);
				find_exp = exp;
			} else {
				break;
			}
		}
		return find_exp;
	}
	inst.GetMaxAccountLevel = function() { return max_account_level; }

	inst.AddHeroExp = function(p_hero_level, p_hero_exp) {
		if (p_hero_level > max_hero_level)
			max_hero_level = p_hero_level;

		hero_exp_map.set(p_hero_level, p_hero_exp);
	}
	inst.GetHeroExp = function(p_hero_level) {
		return (hero_exp_map.has(p_hero_level) == true) ? hero_exp_map.get(p_hero_level) : undefined;
	}
	// HeroLevel 은 limit_level 높을 수 없다.
	inst.GetLevelupHeroExp = function(limit_level, p_sum_exp) {
		let find_exp = undefined;

		let keys = hero_exp_map.keys();

		for (let cnt = 0; cnt < keys.length; ++cnt) {
			let exp = hero_exp_map.get(keys[cnt]);

			if (exp.total_exp <= p_sum_exp && exp.level <= limit_level) {				
				// console.log('%d find level: %d, exp: %d', exp.level, exp.level, exp.total_exp);
				find_exp = exp;
			} else {
				break;
			}
		}
		return find_exp;
	}

	inst.GetMaxHeroLevel = function() { return max_hero_level; }

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 스킬 레벨업 정보
	var max_skill_level = 0;
	var hero_skill_need_gold_map = new HashMap();	// key : level, value : need_gold

	inst.AddHeroSkillNeedGold = function(p_skill_level, p_need_gold) {
		if (p_skill_level > max_skill_level)
			max_skill_level = p_skill_level;

		hero_skill_need_gold_map.set(p_skill_level, p_need_gold);
	}
	inst.GetHeroSkillNeedGold = function(p_skill_level) {
		return (hero_skill_need_gold_map.has(p_skill_level) == true) ? hero_skill_need_gold_map.get(p_skill_level) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 장착 아이템 레벨업 정보	
	var max_equip_item_level = 0;
	var equip_item_need_gold_map = new HashMap();	// key : level, value : need_gold

	inst.AddEquipItemNeedGold = function(p_equip_item_level, p_need_gold) {
		if (p_equip_item_level > max_equip_item_level)
			max_equip_item_level = p_equip_item_level;

		equip_item_need_gold_map.set(p_equip_item_level, p_need_gold);
	}
	inst.GetEquipItemNeedGold = function(p_equip_item_level) { 
		return (equip_item_need_gold_map.has(p_equip_item_level) == true) ? equip_item_need_gold_map.get(p_equip_item_level) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;