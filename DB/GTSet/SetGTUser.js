/********************************************************************
Title : SetGTUser
Date : 2017.02.17
Update : 2017.04.03
Writer : jongwook
Desc : Promise Set - 유저
********************************************************************/
var GTMgr = require('../GTMgr.js');

var BaseExpRe = require('../../Data/Base/BaseExpRe.js');
var BaseLevelUnlock	= require('../../Data/Base/BaseLevelUnlock.js');
var BaseSkill = require('../../Data/Base/BaseSkill.js');

var DefineValues = require('../../Common/DefineValues.js');

var Timer = require('../../Utils/Timer.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SelectUserEffect = function(p_uuid, p_effect_id, p_effect_call, p_effect_type, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_USER_EFFECT select
			GTMgr.inst.GetGTUserEffect().find({
				where : {
					UUID : p_uuid,
					EFFECT_ID : p_effect_id,
					EFFECT_CALL : p_effect_call,
					EFFECT_TYPE : p_effect_type
				}
			}, { transaction : p_t })
			.then(p_ret_effect => { resolve(p_ret_effect); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertUserEffect = function(p_uuid, p_effect_id, p_effect_call, p_effect_type, p_effect_level, p_value1, p_value2, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_USER_EFFECT insert
			GTMgr.inst.GetGTUserEffect().create({
				UUID : p_uuid,
				EFFECT_ID : p_effect_id,
				EFFECT_LEVEL : p_effect_level,
				EFFECT_CALL : p_effect_call,
				EFFECT_TYPE : p_effect_type,
				VALUE1 : p_value1,
				VALUE2 : p_value2,
				REG_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_effect => {
				console.log('GT_USER_EFFECT insert');
				resolve(p_ret_effect);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateUserEffect = function(p_ret_effect, p_effect_level, p_value1, p_value2, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_USER_EFFECT update
			p_ret_effect.updateAttributes({
				EFFECT_LEVEL : p_effect_level,
				VALUE1 : p_value1,
				VALUE2 : p_value2,
				EXIST_YN : true
			}, { transaction : p_t })
			.then(p_ret_effect_update => {
				console.log('GT_USER_EFFECT update');
				resolve(p_ret_effect_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertOrUpdateUserEffect = function(p_uuid, p_effect_id, p_effect_call, p_effect_type, p_effect_level, p_value1, p_value2, p_t) {
		console.log('InsertOrUpdateUserEffect', p_uuid, p_effect_id, p_effect_call, p_effect_type, p_effect_level, p_value1, p_value2);
		return new Promise(function (resolve, reject) {
			// GT_USER_EFFECT select
			SelectUserEffect(p_uuid, p_effect_id, p_effect_call, p_effect_type, p_t)
			.then(p_ret_effect => {
				if ( p_ret_effect == null ) {
					// insert
					InsertUserEffect(p_uuid, p_effect_id, p_effect_call, p_effect_type, p_effect_level, p_value1, p_value2, p_t)
					.then(value => { resolve(value); })
					.catch(p_error => { reject(p_error); });
				} else {
					if ( p_ret_effect.EXIST_YN == false || p_ret_effect.dataValues.VALUE1 != p_value1 || p_ret_effect.dataValues.VALUE2 != p_value2 ) {
						// Update
						UpdateUserEffect(p_ret_effect, p_effect_level, p_value1, p_value2, p_t)
						.then(value => { resolve(value); })
						.catch(p_error => { reject(p_error); });
					} else {
						resolve(p_ret_effect);
					}
				}
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.AddUserEffect = function(p_uuid, p_effect_call, p_skill_id, p_skill_level, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_skill_id != 0 ) {
				let base_skill = BaseSkill.inst.GetSkill(p_skill_id);

				if ( typeof base_skill === 'undefined')
					throw ([ PacketRet.inst.retFail(), 'Not Exist base_skill', p_skill_id ]);

				let effect_value_list = base_skill.skill_effect.GetEffectValueList();

				// 경험치, 골드 추가 스킬만 추려 낸다.
				let Effect = function() {
					this.effect_type;
					this.values = [ 0, 0, 0 ];
				}

				let effect_list = new Array();

				let FindEffect = function(p_effect_type) {
					let find_effect_list = effect_list.filter(function (value) {
						return ( value.effect_type == p_effect_type );
					});
					return find_effect_list;
				}

				// 계산 방법		
				// 1. BT_HERO_SKILL_EFFECT 테이블로 스킬 레벨별 값 계산
				// Effect1_Value1 + ( Effect1_Value1_per_LV * (SkillLv - 1) ) => 계산된 결과 값이 value1
				// Effect1_Value2 + ( Effect1_Value2_per_LV * (SkillLv - 1) ) => 계산된 결과 값이 value2
				// Effect1_Value3 + ( Effect1_Value3_per_LV * (SkillLv - 1) ) => 계산된 결과 값이 value3

				// 2. Effect 결과 값(value1 ~ 3) 를 이용 해서 최종 값 계산
				// ClearGold + (ClearGold * value1) + value2
				// ClearExp + (ClearExp * value1) + value2

				effect_value_list.map(effect => {
					// 골드, 영웅 경험치 추가 획득 스킬만 적용.(나중에 늘어 나면 타입을 추가 한다.)
					// console.log('effect.effect_type', effect.effect_type, DefineValues.inst.SkillEffectClearGoldUp);
					if ( effect.effect_type != DefineValues.inst.SkillEffectNone &&
						( effect.effect_type == DefineValues.inst.SkillEffectClearGoldUp || effect.effect_type == DefineValues.inst.SkillEffectHeroExpUp )) {
						// console.log('loop effect_type : %s, value1 : %d %d, value2 : %d %d, value3 : %d %d', effect.effect_type, effect.value1, effect.value1_lv, effect.value2, effect.value2_lv, effect.value3, effect.value3_lv);

						let find_effect = FindEffect(effect.effect_type);
						let ret_level = ( p_skill_level <= 0 ) ? 0 : ( p_skill_level - 1 );

						if ( find_effect.length == 0 ) {
							let new_effect = new Effect();

							new_effect.effect_type = effect.effect_type;
							new_effect.values[0] = effect.value1 + ( effect.value1_lv * ret_level );
							new_effect.values[1] = effect.value2 + ( effect.value2_lv * ret_level );
							new_effect.values[2] = effect.value3 + ( effect.value3_lv * ret_level );

							effect_list.push(new_effect);
						} else {
							find_effect[0].values[0] = find_effect[0].values[0] + effect.value1 + ( effect.value1_lv * ret_level );
							find_effect[0].values[1] = find_effect[0].values[1] + effect.value2 + ( effect.value2_lv * ret_level );
							find_effect[0].values[2] = find_effect[0].values[2] + effect.value3 + ( effect.value3_lv * ret_level );
						}
					}
				});

				// console.log('effect_list', effect_list);

				// Promise.all
				Promise.all(effect_list.map(effect => {
					// console.log('type : %s, value :', effect.effect_type, effect.values);
					return InsertOrUpdateUserEffect(p_uuid, base_skill.skill_effect_id, p_effect_call, effect.effect_type, p_skill_level, effect.values[0], effect.values[1], p_t);
				}))
				.then(values => { resolve(values); })
				.catch(p_error => { reject(p_error); });
			} else {
				resolve();
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.DelUserEffect = function(p_uuid, p_effect_call, p_t) {
		console.log('DelUserEffect uuid : %d, effect_call :', p_uuid, p_effect_call);
		return new Promise(function (resolve, reject) {
			// GT_USER_EFFECT select
			GTMgr.inst.GetGTUserEffect().findAll({
				where : { UUID : p_uuid, EFFECT_CALL : p_effect_call, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_effect_list => {
				if ( p_ret_effect_list.length == 0 ) {
					resolve();
				} else {
					Promise.all(p_ret_effect_list.map(row => {
						return new Promise(function (resolve, reject) {
							// GT_USER_EFFECT update
							return row.updateAttributes({
								EXIST_YN : false
							}, { transaction : p_t })
							.then(p_ret_effect_update => { resolve(); })
							.catch(p_error => { reject(p_error); });
						});
					}))
					.then(values => { resolve(); })
					.catch(p_error => {reject(p_error); });
				}
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.UpdateUserCash = function(p_t, p_ret_user, p_cash) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_user.dataValues.CASH == p_cash ) {
				resolve(p_ret_user);
			} else {
				// GT_USER update
				p_ret_user.updateAttributes({ CASH : p_cash }, { transaction : p_t})
				.then(p_ret_user_update => {
					console.log('UpdateUserCash', p_ret_user_update.dataValues.CASH);
					resolve(p_ret_user_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.UpdateUserGold = function(p_ret_user, p_gold, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_user.dataValues.GOLD == p_gold ) {
				resolve(p_ret_user);
			} else {
				// GT_USER update
				p_ret_user.updateAttributes({ GOLD : p_gold }, { transaction : p_t})
				.then(p_ret_user_update => {
					console.log('UpdateUserGold', p_ret_user_update.dataValues.GOLD);
					resolve(p_ret_user_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 계정 레벨업 때 해줘야 할게 많다.
	var SetExp = function(p_ret_user, p_add_exp) {
		if ( p_add_exp != 0 ) {
			let ret_exp = p_ret_user.dataValues.USER_EXP + p_add_exp;

			let levelup_exp = BaseExpRe.inst.GetLevelupAccountExp(ret_exp);
			if ( typeof levelup_exp === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Exp In Base exp', ret_exp ]);

			// Levelup 에 확인 해줘야 되는 것들
			if ( levelup_exp.level > p_ret_user.dataValues.USER_LEVEL ) {
				let base_unlock = BaseLevelUnlock.inst.GetLevelUnlock(levelup_exp.level);
				
				if ( typeof base_unlock === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist LevelUnlock In Base level', levelup.level ]);

				// use account_buff
				let old_level = p_ret_user.dataValues.USER_LEVEL;

				p_ret_user['USER_LEVEL'] = levelup_exp.level;

				// 1. MAX 스테미너 증가
				p_ret_user['MAX_STAMINA'] = base_unlock.max_stamina;
				// p_ret_user['LAST_STAMINA_CHANGE_DATE'] = Timer.inst.GetNowByStrDate();

				// 2. 스테미너 회복
				p_ret_user['STAMINA'] = p_ret_user.dataValues.STAMINA + base_unlock.recovery_stamina;

				// 3. 계정 버프 포인트 계산
				if ( base_unlock.open_accountbuff == true ) {
					let ret_buff_point = ( levelup_exp.level - old_level ) * DefineValues.inst.AccountBuffPoint;

					console.log('ret_buff_point : %d', ret_buff_point);

					p_ret_user['ACCOUNT_BUFF_POINT'] = p_ret_user.dataValues.ACCOUNT_BUFF_POINT + ret_buff_point;
				}
			}

			p_ret_user['USER_EXP'] = ret_exp;
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	var GetExtraGold = function(p_uuid, p_base_gold) {
		return new Promise(function (resolve, reject) {
			let extra_gold = 0;

			let type = DefineValues.inst.SkillEffectClearGoldUp;
			let call = DefineValues.inst.SkillEffectCallGuild;

			// GT_USER_EFFECT select
			GTMgr.inst.GetGTUserEffect().findAll({
				where : { UUID : p_uuid, EFFECT_TYPE : type, EFFECT_CALL : call, EXIST_YN : true }
			})
			.then(p_ret_effect_list => {
				if ( p_ret_effect_list.length > 0 ) {
					let value1 = 0;
					let value2 = 0;
					
					p_ret_effect_list.map(effect => {
						// console.log('GetExtraGold effect', effect);
						value1 = value1 + effect.dataValues.VALUE1;
						value2 = value2 + effect.dataValues.VALUE2;
					});

					if ( value1 != 0 || value2 != 0 ) {
						extra_gold = ( p_base_gold * value1 ) + value2;
						console.log('!!골드 추가 획득!! BaseGold : %d, ExtraGold : %d, RetGold : %d', p_base_gold, extra_gold, p_base_gold + extra_gold);
					}
				}

				resolve(extra_gold);
			})
			.catch(p_error => {
				reject(p_error);
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// !!!!!!! gold 여기에서 추가 골드를 계산 한다.(스킬, 이벤트 등) !!!!!!!
	inst.SetBattleReward = function(p_ret_user, p_need_stamina, p_reward_exp, p_reward_gold, p_t) {
		return new Promise(function (resolve, reject) {
			console.log('before level : %d, stamina : %d, exp : %d, gold : %d, account_buff_point : %d', p_ret_user.dataValues.USER_LEVEL, p_ret_user.dataValues.STAMINA, p_ret_user.dataValues.USER_EXP, p_ret_user.dataValues.GOLD, p_ret_user.dataValues.ACCOUNT_BUFF_POINT);

			// 스테미너
			if ( p_need_stamina != 0 )
				p_ret_user['STAMINA'] = p_ret_user.dataValues.STAMINA - p_need_stamina;

			// 경험치 - 계정 버프 포인트 계산때문에 함수로 따로 처리.
			SetExp(p_ret_user, p_reward_exp);

			// 골드 추가 획득 계산
			GetExtraGold(p_ret_user.dataValues.UUID, p_reward_gold)
			.then(p_ret_extra_gold => {
				let ret_gold = p_ret_user.dataValues.GOLD + p_reward_gold + p_ret_extra_gold;
			
				p_ret_user['GOLD'] = ret_gold;

				// GT_USER update
				return p_ret_user.save({ transaction : p_t })
				.then(p_ret_user_update => {
					console.log('after  level : %d, stamina : %d, exp : %d, gold : %d, account_buff_point : %d', p_ret_user_update.dataValues.USER_LEVEL, p_ret_user_update.dataValues.STAMINA, p_ret_user_update.dataValues.USER_EXP, p_ret_user_update.dataValues.GOLD, p_ret_user_update.dataValues.ACCOUNT_BUFF_POINT);
					resolve(p_ret_user_update);
				}).catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// p_reward는 RewardMgr.js에 정의 되어 있다.(2017.03.29 jongwook)
	inst.SetReward = function(p_ret_user, p_gold, p_cash, p_honor_point, p_alliance_point, p_challenge_point, p_stamina, p_account_exp, p_t) {
		return new Promise(function (resolve, reject) {
			let begin_data = function() {
				this.user_level;
				this.stamina;
				this.user_exp;
				this.gold;
				this.cash;
				this.account_buff_point;
				this.point_honor;
				this.point_alliance;
				this.point_challenge;
			}

			let temp = new begin_data();
			temp.user_level = p_ret_user.dataValues.USER_LEVEL;
			temp.stamina = p_ret_user.dataValues.STAMINA;
			temp.user_exp = p_ret_user.dataValues.USER_EXP;
			temp.gold = p_ret_user.dataValues.GOLD;
			temp.cash = p_ret_user.dataValues.CASH;
			temp.account_buff_point = p_ret_user.dataValues.ACCOUNT_BUFF_POINT;
			temp.point_honor = p_ret_user.dataValues.POINT_HONOR;
			temp.point_alliance = p_ret_user.dataValues.POINT_ALLIANCE;
			temp.point_challenge = p_ret_user.dataValues.POINT_CHALLENGE;

			// 골드 - 스킬 효과로 추가 골드를 획득하는지 먼저 계산
			GetExtraGold(p_ret_user.dataValues.UUID, p_gold)
			.then(p_ret_extra_gold => {
				let gold = p_ret_user.dataValues.GOLD + p_gold + p_ret_extra_gold;
			
				p_ret_user['GOLD'] = gold;

				// 캐쉬
				if ( p_cash != 0 )
					p_ret_user['CASH'] = p_ret_user.dataValues.CASH + p_cash;

				// 명예 포인트
				if ( p_honor_point != 0 )
					p_ret_user['POINT_HONOR'] = p_ret_user.dataValues.POINT_HONOR + p_honor_point;

				// 길드 포인트
				if ( p_alliance_point != 0 )
					p_ret_user['POINT_ALLIANCE'] = p_ret_user.dataValues.POINT_ALLIANCE + p_alliance_point;

				// PVP 포인트
				if ( p_challenge_point != 0 )
					p_ret_user['POINT_CHALLENGE'] = p_ret_user.dataValues.POINT_CHALLENGE + p_challenge_point;

				// 스테미너
				if ( p_stamina != 0 )
					p_ret_user['STAMINA'] = p_ret_user.dataValues.STAMINA + p_stamina;

				// 유저계정 경험치
				SetExp(p_ret_user, p_account_exp);

				// GT_USER update
				return p_ret_user.save({ transaction : p_t })
				.then(p_ret_user_update => {
					console.log('SetReward level : %d -> %d : %d\n stamina : %d -> %d : %d\n exp : %d -> %d : %d\n gold : %d -> %d : %d\n cash : %d -> %d : %d\n account_buff_point : %d -> %d : %d\n honor_point : %d -> %d : %d\n alliance_point : %d -> %d : %d\n challenge_point : %d -> %d', 
						temp.user_level,			p_ret_user.dataValues.USER_LEVEL, ( p_ret_user.dataValues.USER_LEVEL - temp.user_level),
						temp.stamina,				p_ret_user.dataValues.STAMINA, ( p_ret_user.dataValues.STAMINA - temp.stamina),
						temp.user_exp,				p_ret_user.dataValues.USER_EXP, ( p_ret_user.dataValues.USER_EXP - temp.user_exp),
						temp.gold,					p_ret_user.dataValues.GOLD, ( p_ret_user.dataValues.GOLD - temp.gold),
						temp.cash,					p_ret_user.dataValues.CASH, ( p_ret_user.dataValues.CASH - temp.cash),
						temp.account_buff_point,	p_ret_user.dataValues.ACCOUNT_BUFF_POINT, ( p_ret_user.dataValues.ACCOUNT_BUFF_POINT - temp.account_buff_point),
						temp.point_honor,			p_ret_user.dataValues.POINT_HONOR, ( p_ret_user.dataValues.POINT_HONOR - temp.point_honor),
						temp.point_alliance,		p_ret_user.dataValues.POINT_ALLIANCE,( p_ret_user.dataValues.POINT_ALLIANCE - temp.point_alliance),
						temp.point_challenge,		p_ret_user.dataValues.POINT_CHALLENGE, ( p_ret_user.dataValues.POINT_CHALLENGE - temp.point_challenge)
					);
					resolve(p_ret_user_update);
				}).catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});	
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.UpdateGoldAndCash = function(p_t, p_ret_user, p_gold, p_cash) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_user.dataValues.GOLD != p_gold || p_ret_user.dataValues.CASH != p_cash ) {
				if ( p_ret_user.dataValues.GOLD != p_gold )
					p_ret_user['GOLD'] = p_gold;

				if ( p_ret_user.dataValues.CASH != p_cash )
					p_ret_user['CASH'] = p_cash;
			
				// GT_USER update
				p_ret_user.save({ transaction : p_t })
				.then(p_ret_user_update => { resolve(p_ret_user); })
				.catch(p_error => { reject(p_error); });
			} else {
				resolve(p_ret_user);
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;