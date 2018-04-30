/********************************************************************
Title : LeaveGuild
Date : 2017.03.06
Update : 2017.03.07
Decs : 길드 탈퇴(길드 맴버 자신)
	GUILD_AUTH  	(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION 	(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES (0 : 승인 대기. 1 : 승인, 2 : 거부.)
	GUILD_STATES 	( true : 활성, false : 폐쇄.)
writer: jongwook
Logic :
	// 1. 길드 멤버 인지 확인. 		
	// 2. 길드장 인지 확인. 
	// 2-1. 길드 장이라면 길드원이 존재하는지 확인.
	// 2-1-1. 길드원이 존재 한다면 불가. 
	// 2-1-2. 길드원이 존재 하지 않는다면 탈퇴 후 길드 폐쇄.
	// 3. 길드 장이 아니라면 길드 탈퇴. 
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var SetGTUser = require('../../DB/GTSet/SetGTUser.js');
var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var CloseGuild = function(p_ret_guild, p_t) {
		var DeleteGuild = function() {
			return new Promise(function (resolve, reject) {
				// GT_GUILD update
				p_ret_guild.updateAttributes({
					GUILD_STATES : false,
					EXIST_YN : false
				}, { transaction : p_t })
				.then(p_ret_guild_update => { resolve(p_ret_guild_update); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var DeleteSkill = function() {
			return new Promise(function (resolve, reject) {
				let guild_id = p_ret_guild.dataValues.GUILD_ID;

				// GT_GUILD_SKILL select
				GTMgr.inst.GetGTGuildSkill().findAll({
					where : { GUILD_ID : guild_id, EXIST_YN : true }
				}, { transaction : p_t })
				.then(p_ret_skill_list => {
					if ( p_ret_skill_list.length == 0 ) {
						resolve();
					} else {
						return Promise.all(p_ret_skill_list.map(row => {
							row.updateAttributes({ EXIST_YN : false }, { transaction : p_t });
						}))
						.then(values => { resolve(values); })
						.catch(p_error => { reject(p_error); });
					}
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		return new Promise(function (resolve, reject) {
			return Promise.all([
				DeleteGuild(),
				DeleteSkill()
			])
			.then(values => { resolve(values); })
			.catch(p_error => { reject(p_error); });
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	var LeaveGuild = function(p_ret_member, p_uuid, p_guild_id, p_auth, p_t) {
		return new Promise(function (resolve, reject) {
			let join_states = false;
			let effect_call = DefineValues.inst.SkillEffectCallGuild;

			// Promise.all GO!
			Promise.all([
				SetGTGuild.inst.SetGuildMember(p_ret_member, p_uuid, p_guild_id, p_auth, join_states, p_t),
				SetGTUser.inst.DelUserEffect(p_uuid, effect_call, p_t)
			])
			.then(values => {
				console.log('Done LeaveGuild');
				resolve(values[0]);
			})
			.catch(p_error => {
				console.log('Error LeaveGuild');
				reject(p_error);
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetLeaveGuild = function(p_ret_member, p_t) {
		return new Promise(function (resolve, reject) {
			let guild_id = p_ret_member.dataValues.GUILD_ID;
			let auth = p_ret_member.dataValues.GUILD_AUTH;
			let uuid = p_ret_member.dataValues.UUID;

			let join_states = false;
			let effect_call = DefineValues.inst.SkillEffectCallGuild;		

			// 길드원
			if ( auth != DefineValues.inst.GuildAuthMaster ) {
				LeaveGuild(p_ret_member, uuid, guild_id, auth, p_t)
				.then(values => {
					console.log('Done SetLeaveGuild - 1');
					resolve(values);
				})
				.catch(p_error => {
					console.log('Error SetLeaveGuild - 1');
					reject(p_error);
				});
			} else {
				// 길드 마스트(장)
				return Promise.all([
					LoadGTGuild.inst.GetGuild(guild_id),
					LoadGTGuild.inst.GetGuildMemberCount(guild_id)
				])
				.then(values => {
					console.log('Promise.all done');

					let ret_guild = values[0];
					let member_count = values[1];

					// 길드원이 있을때는 탈퇴 못함.
					if ( member_count > 1 ) {
						reject ( PacketRet.inst.retExistGuildMember() );
					} else {
						return Promise.all([
							LeaveGuild(p_ret_member, uuid, guild_id, auth, p_t),
							CloseGuild(ret_guild, p_t)
						])
						.then(values => { resolve(values[0]); })
						.catch(p_error => { reject(p_error); });
					}
				});
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqLeaveGuild = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqLeaveGuild -', p_user.uuid, p_recv);

		LoadGTGuild.inst.GetGuildMember(p_user.uuid)
		.then(p_ret_member => {
			if ( p_ret_member == null )
				throw ( PacketRet.inst.retNotGuildMember() );

			return new Promise(function (resolve, reject) {
				// start transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					SetLeaveGuild(p_ret_member, t)
					.then(value => {
						console.log('commit');
						t.commit();

						resolve(value);
					})
					.catch(p_error => {
						console.log('Error ReqLeaveGuild');

						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		})
		.then(value => {
			console.log('길드 탈퇴', ( value != null ) ? value.dataValues : value);
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;