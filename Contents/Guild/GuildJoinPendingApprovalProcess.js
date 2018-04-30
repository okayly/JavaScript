/********************************************************************
Title : GuildJoinPendingApprovalProcess
Date : 2016.06.14
Update : 2017.04.10
Desc : 길드 가입 승인 과정
	GUILD_AUTH  	(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION 	(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES 	
	0 : 승인 대기(GuildPendingApprovalWait)
	1 : 승인(GuildPendingApprovalAccept)
	2 : 거부(GuildPendingApprovalReject)
writer: dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');
var PacketNotice	= require('../../Packets/PacketNotice/PacketNotice.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var UpdateJoinPendingApproval = function(p_t, p_ret_join_pending, p_process_type) {
		// GT_GUILD_JOIN_PENDING_APPROVAL update
		return new Promise(function (resolve, reject) {
			return p_ret_join_pending.updateAttributes({
				APPROVAL_STATES : p_process_type,
				EXIST_YN : false
			}, { transaction : p_t })
			.then(p_ret_join_pending_update => { resolve(p_ret_join_pending_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertOrNotMember = function(p_t, p_ret_guild_member, p_target_uuid, p_guild_id, p_process_type) {
		return new Promise(function (resolve, reject) {
			let auth = DefineValues.inst.GuildAuthMember;

			if ( p_process_type == DefineValues.inst.GuildJoinPendingApprovalAccept ) {
				let join_states = true;

				SetGTGuild.inst.SetGuildMember(p_ret_guild_member, p_target_uuid, p_guild_id, DefineValues.inst.GuildAuthMember, join_states, p_t)
				.then(p_ret_member_insert => {
					console.log('InsertOrNotMember');
					resolve();
				})
				.catch(p_error => { reject(p_error); });
			} else {
				// 멤버 등록 안함.
				console.log('InsertOrNotMember Not');
				resolve();
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_target_uuid, p_process_type) {
		let ret_member_me = p_values[0];
		let ret_member_target = p_values[1];
		let ret_join_pending = p_values[2];

		if ( ret_join_pending == null || ret_join_pending.dataValues.APPROVAL_STATES != DefineValues.inst.GuildJoinPendingApprovalWait )
			throw ([ PacketRet.inst.retFail(), 'GuildJoinPendingApproval is null or GuildJoinPendingApprovalWait' ]);

		let guild_id = ret_member_me.dataValues.GUILD_ID;

		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				if ( ret_member_target == null || ret_member_target.dataValues.JOIN_STATES == false ) {
					// 길드에 가입 안함
					Promise.all([
						UpdateJoinPendingApproval(t, ret_join_pending, p_process_type),
						InsertOrNotMember(t, ret_member_target, p_target_uuid, guild_id, p_process_type)
					])
					.then(values => {
						t.commit();

						resolve(values);
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
				} else {
					UpdateJoinPendingApproval(t, ret_join_pending, DefineValues.inst.GuildJoinPendingApprovalReject)
					then(value => {
						reject ([ PacketRet.inst.retAlReadyJoinGuild(), 'AlReadyJoinGuild' ]);
					})
					.catch(p_error => { reject(p_error); });
				}
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildJoinPendingApprovalProcess = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildJoinPendingApprovalProcess -', p_user.uuid, p_recv);

		var recv_target_uuid	= parseInt(p_recv.target_uuid);
		var recv_process_type	= parseInt(p_recv.process_type);

		if ( recv_target_uuid == 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser());
			return;
		}

		// 1. 승인 처리 - 다른 길드 가입 여부 판단 필요.
		// 2. 거부 처리 - 다른 길드 가입 여부 판단 필요 없음.
		// Promise.all GO!
		Promise.all([
			LoadGTGuild.inst.GetGuildMember(p_user.uuid),
			LoadGTGuild.inst.GetGuildMember(recv_target_uuid)
		])
		.then(values => {
			let ret_member_me = values[0];
			let ret_member_target = values[1];

			if ( ret_member_me == null )
				throw ([ PacketRet.inst.retNotGuildMember(), 'NotGuildMember' ]);

			// 1. 권한 확인. (길드장, 장로)
			let guild_id	= ret_member_me.dataValues.GUILD_ID;
			let user_auth	= ret_member_me.dataValues.GUILD_AUTH; // (1 : 길드장, 2 : 장로, 3 : 일반.)

			// 권한이 부족한다.
			if ( user_auth == DefineValues.inst.GuildAuthMember )
				throw ([ PacketRet.inst.retNotEnoughAuth(), 'NotEnoughAuth' ]);

			return new Promise(function (resolve, reject) {
				LoadGTGuild.inst.SelectJoinPendingApproval(recv_target_uuid, guild_id)
				.then(ret_join_pending => {
					values.push(ret_join_pending);

					resolve(values);
				})
				.catch(p_error => { reject(p_error); });
			});
		})
		.then(values => {
			// console.log('values', values);
			return ProcessTransaction(values, recv_target_uuid, recv_process_type);
		})
		.then(values => {
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