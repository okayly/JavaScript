/********************************************************************
Title : BaseSkill
Date : 2017.02.22
Update : 2017.02.28
Desc : BT 정보 - 스킬, 스킬 이펙트
writer : dongsu
********************************************************************/
var DefineValues= require('../../Common/DefineValues.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	

	//------------------------------------------------------------------------------------------------------------------
	inst.EffectValue = function() {
		this.effect_type;
		this.hit_count;
		this.target_hit_anim;
		this.target_die_anim;
		this.use_weapon_fx;
		this.target_type;
		this.duration;
		this.positivity;
		this.value1;
		this.value1_lv;
		this.value2;
		this.value2_lv;
		this.value3;
		this.value3_lv;
	}

	inst.SkillEffect = function() {
		this.effect_id;
		this.effect_value_list = [];	// EffectValue array

		this.GetEffectValueList = function() { return this.effect_value_list; }
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseSkill = function() {
		this.skill_id;
		this.skill_type;
		this.skill_effect_id;
		this.skill_effect;
	}

	let skill_map = new HashMap();

	inst.AddSkill = function(p_skill_id, p_skill) { skill_map.set(p_skill_id, p_skill); }
	inst.GetSkill = function(p_skill_id) { return skill_map.has(p_skill_id) ? skill_map.get(p_skill_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;