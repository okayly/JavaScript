/********************************************************************
Title : BT_Skill
Date : 2017.02.22
Update : 2017.02.22
Desc : BT 로더 - DarkDungeon
writer: jong wook
********************************************************************/
var BaseSkill = require('../../Data/Base/BaseSkill.js');

(function (exports) {
	// public
	var inst = {};

	var GetEffectValue = function(p_bt_effect, p_effect_id) {
		return new Promise(function (resolve, reject) {
			// GT_SKILL_EFFECT select
			p_bt_effect.find({
				where : { EFFECT_ID : p_effect_id }
			})
			.then(p_ret_effect => { resolve(p_ret_effect); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadSkill = function (p_bt_skill, p_bt_effect) {
		logger.debug('*** Start LoadSkill ***');

		let max_value = 3;
		
		// GT_SKILL select
		p_bt_skill.findAll({ order : 'SKILL_ID asc' })
		.then(p_ret_skill_list => {
			return new Promise(function (resolve, reject) {
				Promise.all(p_ret_skill_list.map(row => {
					let skill_data = row.dataValues;

					let skill = new BaseSkill.inst.BaseSkill();
					skill.skill_id			= skill_data.SKILL_ID;
					skill.skill_type		= skill_data.SKILL_TYPE;
					skill.skill_effect_id	= skill_data.SKILL_EFFECT_ID;

					BaseSkill.inst.AddSkill(skill_data.SKILL_ID, skill);

					return GetEffectValue(p_bt_effect, skill_data.SKILL_EFFECT_ID)
					.then(p_ret_effect => {
						let effect_data = p_ret_effect.dataValues;

						skill.skill_effect = new BaseSkill.inst.SkillEffect();
						skill.skill_effect.effect_id = effect_data.EFFECT_ID;
						
						for (let cnt = 0; cnt < max_value; ++cnt) {
							let effect_value = new BaseSkill.inst.EffectValue();
							effect_value.effect_type		= effect_data['EFFECT' + (cnt + 1) + '_TYPE'];
							effect_value.hit_count			= effect_data['EFFECT' + (cnt + 1) + '_HIT_COUNT'];
							effect_value.target_hit_anim	= effect_data['EFFECT' + (cnt + 1) + '_TARGET_HIT_ANIM'];
							effect_value.target_die_anim	= effect_data['EFFECT' + (cnt + 1) + '_TARGET_DIE_ANIM'];
							effect_value.use_weapon_fx		= effect_data['EFFECT' + (cnt + 1) + '_USE_WEAPON_FX'];
							effect_value.target_type		= effect_data['EFFECT' + (cnt + 1) + '_TARGET_TYPE'];
							effect_value.duration			= effect_data['EFFECT' + (cnt + 1) + '_DURATION'];
							effect_value.positivity			= effect_data['EFFECT' + (cnt + 1) + '_POSITIVITY'];
							effect_value.value1				= effect_data['EFFECT' + (cnt + 1) + '_VALUE1'];
							effect_value.value1_lv			= effect_data['EFFECT' + (cnt + 1) + '_VALUE1_LV'];
							effect_value.value2				= effect_data['EFFECT' + (cnt + 1) + '_VALUE2'];
							effect_value.value2_lv			= effect_data['EFFECT' + (cnt + 1) + '_VALUE2_LV'];
							effect_value.value3				= effect_data['EFFECT' + (cnt + 1) + '_VALUE3'];
							effect_value.value3_lv			= effect_data['EFFECT' + (cnt + 1) + '_VALUE3_LV'];
							skill.skill_effect.effect_value_list.push(effect_value);
							// console.log('effect_value', effect_value);
						}

						return skill;
					});
				}))
				.then(values => {
					console.log('*** Finish LoadSkill ***');
					resolve();
				})
				.catch(p_error => {
					logger.error('Error LoadSkill!!!!', p_error);
					reject(p_error);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
	
})(exports || global);
(exports || global).inst;