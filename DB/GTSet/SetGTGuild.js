/********************************************************************
Title : SetGTGuild
Date : 2017.03.02
Update : 2017.03.07
Writer : jongwook
Desc : Promise Set - 길드
********************************************************************/
var GTMgr = require('../GTMgr.js');

var SetGTUser = require('./SetGTUser.js');
var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var Timer = require('../../Utils/Timer.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// GUILD_AUTH (1 : 길드장, 2 : 장로, 3 : 일반.)
	var InsertGuildMember = function(p_uuid, p_guild_id, p_guild_auth, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_MEMBER insert
			GTMgr.inst.GetGTGuildMember().create({
				UUID : p_uuid,
				GUILD_ID : p_guild_id,
				GUILD_AUTH : p_guild_auth,
				JOIN_DATE : Timer.inst.GetNowByStrDate(),
				REG_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_guild_member => { resolve(p_ret_guild_member); })
			.catch(p_error => { reject(p_error); });
		})
		.catch(p_error => {
			console.log('Error InsertGuildMember', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateGuildMember = function(p_ret_guild_member, p_guild_id, p_guild_auth, p_join_states, p_t) {
		return new Promise(function (resolve, reject) {
			p_ret_guild_member['GUILD_ID'] = p_guild_id;
			p_ret_guild_member['GUILD_AUTH'] = p_guild_auth;
			p_ret_guild_member['JOIN_STATES'] = p_join_states;
			p_ret_guild_member['REG_DATE'] = Timer.inst.GetNowByStrDate();

			if ( p_join_states == true)
				p_ret_guild_member['JOIN_DATE'] = Timer.inst.GetNowByStrDate();

			// GT_GUILD_MEMBER update
			p_ret_guild_member.save({ transaction : p_t })
			.then(p_ret_member_update => { resolve(p_ret_member_update); })
			.catch(p_error => { reject(p_error); });
		})
		.catch(p_error => {
			console.log('Error UpdateGuildMember', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SetGuildMember = function(p_ret_guild_member, p_uuid, p_guild_id, p_guild_auth, p_join_states, p_t) {
		// p_ret_guild_member 가 null 이면 길드 멤버 정보가 없음.
		return new Promise(function (resolve, reject) {
			if ( p_ret_guild_member == null ) {
				InsertGuildMember(p_uuid, p_guild_id, p_guild_auth, p_t)
				.then(value => {
					console.log('SetGuildMember - 1');
					resolve(value);
				})
				.catch(p_error => { reject(p_error); });
			} else {
				UpdateGuildMember(p_ret_guild_member, p_guild_id, p_guild_auth, p_join_states, p_t)
				.then(value => {
					console.log('SetGuildMember - 2');
					resolve(value);
				})
				.catch(p_error => { reject(p_error); });
			}
		})
		.catch(p_error => {
			console.log('Error SetGuildMember', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.03.07 길드 스킬 효과(골드, 영웅 경험치 추가 보상)를 GT_USER_EFFECT 에 추가 한다.
	// 개인 멤버
	inst.SetGuildMemberOneUserEffect = function(p_uuid, p_guild_id, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_SKILL select
			GTMgr.inst.GetGTGuildSkill().findAll({
				where : { GUILD_ID : p_guild_id, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_guild_skill_list => {
				if ( p_ret_guild_skill_list.length == 0 ) {
					console.log('SetGuildMemberOneUserEffect - 1');
					resolve();
				} else {
					let effect_call = DefineValues.inst.SkillEffectCallGuild;

					// Set GT_USER_EFFECT
					return Promise.all(p_ret_guild_skill_list.map(row => {
						let skill_level = row.dataValues.SKILL_LEVEL;

						return new Promise(function (resolve, reject) {
							if ( skill_level > 0 ) {
								SetGTUser.inst.AddUserEffect(p_uuid, effect_call, row.dataValues.SKILL_ID, row.dataValues.SKILL_LEVEL, p_t)
								.then(value => { resolve(); })
								.catch(p_error => { reject(p_error); });
							} else {
								resolve();
							}
						});
					}))
					.then(values => {
						console.log('SetGuildMemberOneUserEffect - 2');
						resolve();
					})
					.catch(p_error => { reject(p_error); });
				}
			})
			.catch(p_error => { reject(p_error); });
		})
		.catch(p_error => {
			console.log('Error SetGuildMemberOneUserEffect', p_error);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	// 2017.03.07 길드 스킬 효과(골드, 영웅 경험치 추가 보상)를 GT_USER_EFFECT 에 추가 한다.
	// 길드 멤버 모두에게 스킬 적용
	inst.SetGuildMemberAllUserEffect = function(p_guild_id, p_skill_id, p_skill_level, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_skill_level <= 0 ) {
				resolve();
			} else {
				// GT_GUILD_MEMBER select
				GTMgr.inst.GetGTGuildMember().findAll({
					where : { GUILD_ID : p_guild_id, EXIST_YN : true }
				}, { transaction : p_t })
				.then(p_member_list => {
					console.log('SetGuildMemberAllUserEffect');

					let effect_call = DefineValues.inst.SkillEffectCallGuild;

					// Promise.all
					return Promise.all(p_member_list.map(member => {
						return SetGTUser.inst.AddUserEffect(member.dataValues.UUID, effect_call, p_skill_id, p_skill_level, p_t);
					}))
					.then(p_values => {
						console.log('SetGuildMemberAllUserEffect');
						resolve();
					})
					.catch(p_error => { reject(p_error); });
				})
				.catch(p_error => { reject(p_error); });
			}
		})
		.catch(p_error => {
			console.log('Error SetGuildMemberAllUserEffect', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;