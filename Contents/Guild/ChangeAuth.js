/********************************************************************
Title : ChangeAuth
Date : 2016.03.31
Update : 2017.04.13
writer: dongsu -> jongwook
Desc : 길드 권한 변경
	GUILD_AUTH		(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION		(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
	GUILD_STATES	( true : 활성, false : 폐쇄.)
Logic :
	// 1. 길드 멤버 인지 확인. 
	// 2. 권한 확인. 
	// 2-1. 길드장이다. 
	// 2-1-1. 길드장 양도.
	// 2-1-2. 장로 임명.
	// 2-1-2-1. 장로 인원 제한
	// 2-1-3.  장로 해임.
	// 2-2. 길드장이 아니다.
	// 2-2-1. 권한 변환 불가. 
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var UpdateMemberAuth = function(p_t, p_ret_member, p_new_auth) {
		return new Promise(function (resolve, reject) {
			let old_auth = p_ret_member.dataValues.GUILD_AUTH;
			// GT_GUILD_MEMBER update
			p_ret_member.updateAttributes({
				PREV_GUILD_AUTH : old_auth,
				GUILD_AUTH : p_new_auth
			}, { transaction : p_t })
			.then(p_ret_member_update => { resolve(p_ret_member_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 마스터 양도. 
	var TransferGuildMaster = function(p_t, p_ret_member_self, p_ret_member_target) {
		return new Promise(function (resolve, reject) {
			// Promise.all GO!
			return Promise.all([
				UpdateMemberAuth(p_t, p_ret_member_self, DefineValues.inst.GuildAuthMember),
				UpdateMemberAuth(p_t, p_ret_member_target, DefineValues.inst.GuildAuthMaster)
			])
			.then(values => {
				resolve(values);
			})
			.catch(p_erorr => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectElderCount = function(p_t, p_guild_id) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_MEMBER select
			GTMgr.inst.GetGTGuildMember().count({
				where : { GUILD_ID : p_guild_id, GUILD_AUTH : DefineValues.inst.GuildAuthElder, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_count => { resolve(p_ret_count); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 부길드장 임명
	var AppointElder = function(p_t, p_ret_member_target) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_member_target.dataValues.GUILD_AUTH == DefineValues.inst.GuildAuthElder )
				throw ([ PacketRet.inst.retAlreadyGuildElder(), 'Already guild elder']);

			SelectElderCount(p_t, p_ret_member_target.dataValues.GUILD_ID)
			.then(p_ret_elder_count => {
				if ( p_ret_elder_count >= DefineValues.inst.MaxGuildElderCount )
					throw ([ PacketRet.inst.retAlreadyMaxElderCount(), 'Elder Count', elder_count ]);

				return UpdateMemberAuth(p_t, p_ret_member_target, DefineValues.inst.GuildAuthElder)
				.then(p_ret_member_update => { resolve(p_ret_member_update); })
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var DemoteElder = function(p_t, p_ret_member_target) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_member_target.dataValues.GUILD_AUTH != DefineValues.inst.GuildAuthElder )
				throw([ PacketRet.inst.retTargetIsNotElder(), p_ret_member_target.dataValues.GUILD_AUTH ]);

			return UpdateMemberAuth(p_t, p_ret_member_target, DefineValues.inst.GuildAuthMember)
			.then(p_ret_member_update => { resolve(p_ret_member_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_auth_type, p_ret_member_self, p_ret_member_target) {
		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				switch (p_auth_type) {
					// 2-1-1. 길드장 양도.
					case DefineValues.inst.TransferGuildMaster : {
						return TransferGuildMaster(t, p_ret_member_self, p_ret_member_target)
						.then(values => {
							t.commit();
							resolve(values);
						})
						.catch(p_error => {
							if (t)
								t.rollback();
							reject(p_error);
						});
					}

					// 2-1-2. 장로 임명.
					case DefineValues.inst.AppointElder : {
						return AppointElder(t, p_ret_member_target)
						.then(value => {
							t.commit();
							resolve(value);
						})
						.catch(p_error => {
							if (t)
								t.rollback();
							reject(p_error);
						});
					}

					// 2-1-3. 장로 해임.
					case DefineValues.inst.DemoteElder : {
						return	DemoteElder(t, p_ret_member_target)
						.then(value => {
							t.commit();
							resolve(value);
						})
						.catch(p_error => {
							if (t)
								t.rollback();
							reject(p_error);
						});
					}

					default : throw([ PacketRet.inst.retUndefinedChangeAuthType(), 'UndefinedChangeAuthType' ]);
				}
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChangeAuth = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChangeAuth -', p_user.uuid, p_recv);

		var recv_target_uuid = parseInt(p_recv.target_uuid);
		var recv_change_auth_type = parseInt(p_recv.auth_type);

		// Promise.all GO!
		Promise.all([
			LoadGTGuild.inst.GetGuildMember(p_user.uuid),
			LoadGTGuild.inst.GetGuildMember(recv_target_uuid)
		])
		.then(values => {
			// console.log('values', values);
			let ret_member_self = values[0];
			let ret_member_target = values[1];

			if ( ret_member_self == null || ret_member_target == null )
				throw([ PacketRet.inst.retFail(), 'Guild member is null' ]);

			if ( ret_member_self.dataValues.GUILD_AUTH != DefineValues.inst.GuildAuthMaster )
				throw ([ PacketRet.inst.retNotEnoughAuth(), 'Not guild master', ret_member_self.dataValues.GUILD_AUTH ]);

			if ( ret_member_self.dataValues.UUID == ret_member_target.dataValues.UUID )
				throw ([ PacketRet.inst.retFail(), 'Same UUID' ]);

			if ( ret_member_self.dataValues.JOIN_STATES == false || ret_member_target.dataValues.JOIN_STATES == false )
				throw ([ PacketRet.inst.retFail(), 'join states is false', ret_member_self.dataValues.JOIN_STATES, ret_member_target.dataValues.JOIN_STATES ]);

			return ProcessTransaction(recv_change_auth_type, ret_member_self, ret_member_target);
		})
		.then(values => {
			// console.log('values', values);
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;