/********************************************************************
Title : SetGTHero
Date : 2017.02.17
Update : 2017.04.03
Writer : jongwook
Desc : Promise Set - 영웅
********************************************************************/
var GTMgr = require('../GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');
var BaseExpRe = require('../../Data/Base/BaseExpRe.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SelectUserEffect = function(p_uuid, p_effect_call, p_effect_type) {
		return new Promise(function (resolve, reject) {
			// p_effect_call - 이펙트가 저장된 곳

			// GT_USER_EFFECT select
			GTMgr.inst.GetGTUserEffect().findAll({
				where : { UUID : p_uuid, EFFECT_TYPE : p_effect_type, EFFECT_CALL : p_effect_call, EXIST_YN : true }
			})
			.then(p_ret_list => { resolve(p_ret_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// !!!!!!! 여기에서 영웅 경험치 추가 사항이 있으면 처리 한다. !!!!!!!	
	inst.SetHero = function(p_uuid, p_hero_data_list, p_user_level, p_reward_exp, p_t) {
		return new Promise(function (resolve, reject) {
			// 길드 스킬 - 추가 영웅 경험치 획득
			SelectUserEffect(p_uuid, DefineValues.inst.SkillEffectCallGuild, DefineValues.inst.SkillEffectHeroExpUp)
			.then(p_ret_effect_list => {
				let ret_exp = p_reward_exp;

				if ( p_ret_effect_list.length > 0 ) {
					let value1 = 0;
					let value2 = 0;
					
					p_ret_effect_list.map(effect => {
						// console.log('SetHero effect', effect);
						value1 = value1 + effect.dataValues.VALUE1;
						value2 = value2 + effect.dataValues.VALUE2;
					});

					if ( value1 != 0 || value2 != 0 ) {
						let plus_exp = ( p_reward_exp * value1 ) + value2;
						ret_exp = p_reward_exp + plus_exp;

						console.log('!!경험치 추가 획득!! %d + %d = %d', plus_exp, p_reward_exp, ret_exp);
					}
				}

				return ret_exp;
			})
			.then(p_ret_exp => {
				// exp, level
				Promise.all(p_hero_data_list.map(row => {
					console.log('before hero_level : %d, hero_exp : %d', row.dataValues.HERO_LEVEL, row.dataValues.EXP);

					let sum_exp = row.dataValues.EXP + p_ret_exp;
					let ret_exp = 0;
					let ret_level = 0;
					let limit_level = DefineValues.inst.MinLevel + ( row.dataValues.EVOLUTION_STEP - 1 ) * 5;

					let levelup_exp = BaseExpRe.inst.GetLevelupHeroExp(limit_level, sum_exp);
					if ( typeof levelup_exp === 'undefined' )
						throw ([ PacketRet.inst.retFail(), 'Error Levelup exp HeroLevel', row.dataValues.HERO_LEVEL, 'Sum Exp', sum_exp ]);

					// 영웅 레벨이 계정 레벨과 같고 경험치도 꽉찬 상태
					if ( row.dataValues.HERO_LEVEL >= limit_level && row.dataValues.EXP >= levelup_exp.total_exp ) {
						return row;
					} else {
						if ( row.dataValues.HERO_LEVEL >= limit_level ) {
							ret_level = limit_level;
							ret_exp = levelup_exp.total_exp;
						} else {
							ret_level = levelup_exp.level;
							ret_exp = sum_exp;
						}

						if ( ret_level == 0 || ret_exp == 0 )
							logger.error('(ret_level == 0 || ret_exp == 0)', 'ret_level', ret_level, 'ret_exp', ret_exp);

						// GT_HERO update
						return row.updateAttributes({ HERO_LEVEL : ret_level, EXP : ret_exp }, { transaction : p_t });
					}
				}))
				.then(values => { resolve(values); })
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;