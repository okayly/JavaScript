/********************************************************************
Title : ChangeAuthConfirm
Date : 2016.08.11
Update : 2017.04.13
writer: dongsu -> jongwook
Desc : 길드 권한 확인
	GUILD_AUTH		(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION		(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
	GUILD_STATES	( true : 활성, false : 폐쇄.)
Logic :
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var UpdateGuildMember = function(p_t, p_ret_member) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_MEMBER update
			return p_ret_member.updateAttributes({
				PREV_GUILD_AUTH : 0
			}, { transaction : p_t })
			.then(p_ret_member_update => { resolve(p_ret_member_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_ret_member) {
		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				UpdateGuildMember(t, p_ret_member)
				.then(value => {
					t.commit();
					resolve(value);
				})
				.catch(p_error => {
					if (t)
						t.rollback();
					reject(p_error);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChangeAuthConfirm = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChangeAuthConfirm -', p_user.uuid, p_recv);

		LoadGTGuild.inst.GetGuildMember(p_user.uuid)
		.then(value => {
			let ret_member = value;

			if ( ret_member == null || ret_member.dataValues.JOIN_STATES == false )
				throw ([ PacketRet.inst.retNotGuildMember(), 'Not guild member' ]);

			return ProcessTransaction(ret_member);
		})
		.then(value => {
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