/********************************************************************
Title : BaseArmy
Date : 2016.12.13
Update : 2016.12.13
Desc : BT 정보 - 부대
writer: jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// ArmySkill 부대 스킬
	var army_skill_map = new HashMap();

	inst.AddArmySkill = function(p_army_id, p_skill_id) {
		// console.log('AddArmySkill p_army_id : %d, p_skill_id : ', p_army_id, p_skill_id);
		army_skill_map.set(p_army_id, p_skill_id);
	}
	inst.GetArmySkill = function(p_army_id) { return (army_skill_map.has(p_army_id) == true) ? army_skill_map.get(p_army_id) : undefined; }
	

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;