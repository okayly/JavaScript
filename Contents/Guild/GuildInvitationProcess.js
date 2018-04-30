/********************************************************************
Title : GuildInvitationProcess
Date : 2016.06.14
Update : 2017.04.11
writer: dongsu -> jongwook
Dec : 길드 가입 과정
	GUILD_AUTH		(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION		(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
logic :
	// 1. 길드 멤버가 아니어야 한다. 
	// 2. 길드의 최대 인원을 확인 해야 한다. 
	// 2-1. 최대 인원에 해당 한다면 가입 불가. 
	// 2-2. 최대 인원이 아니라면 가입. 
	// 2-2-1. 초대 리스트 삭제. 
	// 2-2-2. 길드 가입 리스트 삭제. 
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');

var BaseGuild = require('../../Data/Base/BaseGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SelectInvitationList = function(p_t, p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_INVITATION select
			GTMgr.inst.GetGTGuildInvitation().findAll({
				where : { UUID : p_uuid, INVITE_STATES : true, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_invitation_list => {
				resolve(p_ret_invitation_list);
			})
			.catch(p_error => { reject(p_error); });
		})
		.catch(p_error => {
			console.log('Error SelectInvitationList', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var DeleteInvitationList = function(p_t, p_uuid) {
		return new Promise(function (resolve, reject) {
			SelectInvitationList(p_t, p_uuid)
			.then(values => {
				let ret_invitation_list = values;
				return Promise.all(ret_invitation_list.map(row => {
					// console.log('row', row.dataValues);
					return row.updateAttributes({ INVITE_STATES : false, EXIST_YN : false }, { transaction : p_t });
				}))
				.then(values => { resolve(); })
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		})
		.catch(p_error => {
			console.log('Error DeleteInvitationList', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var AcceptInvite = function(p_t, p_uuid, p_ret_guild_member, p_guild_id) {
		return new Promise(function (resolve, reject) {
			let join_states = true;

			Promise.all([
				SetGTGuild.inst.SetGuildMember(p_ret_guild_member, p_uuid, p_guild_id, DefineValues.inst.GuildAuthMember, join_states, p_t),
				DeleteInvitationList(p_t, p_uuid)
			])
			.then(function () {
				resolve();
			})
			.catch(p_error => {
				reject(p_error);
			});
		})
		.catch(p_error => {
			console.log('Error AcceptInvite', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectInvitationOne = function(p_t, p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_INVITATION select
			GTMgr.inst.GetGTGuildInvitation().find({
				where : { UUID : p_uuid, GUILD_ID : p_guild_id, INVITE_STATES : true, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_invitation => { resolve(p_ret_invitation); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var DeleteInvitationOne = function(p_t, p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			SelectInvitationOne(p_t, p_uuid, p_guild_id)
			.then(value => {
				// console.log('DeleteInvitationOne value', value);
				let ret_invitation = value;
				
				return ret_invitation.updateAttributes({
					INVITE_STATES : false,
					EXIST_YN : false
				}, { transaction : p_t })
				.then(value => { resolve(); })
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var RejectInvite = function(p_t, p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			DeleteInvitationOne(p_t, p_uuid, p_guild_id)
			.then(value => { resolve(); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_uuid, p_ret_guild_member, p_guild_id, p_process_type) {
		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				if ( p_process_type == true ) {
					// 초대 수락
					return AcceptInvite(t, p_uuid, p_ret_guild_member, p_guild_id)
					.then(function () {
						console.log('ProcessTransaction AcceptInvite');
						t.commit();
						
						resolve();
					})
					.catch(p_error => {
						it (t)
							t.rollback();

						reject(p_error);
					});
				} else {
					// 초대 거절
					return RejectInvite(t, p_uuid, p_guild_id)
					.then(function () {
						console.log('ProcessTransaction RejectInvite');
						t.commit();

						resolve();
					})
					.catch(p_error => { 
						if (t)
							t.rollback();

						reject(p_error);
					});
				}
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildInvitationProcess = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildInvitationProcess -', p_user.uuid, p_recv);

		var recv_guild_id = parseInt(p_recv.guild_id);
		var recv_process_type = ( p_recv.process_type == true || p_recv.process_type == 'true' ) ? true : false;

		console.log('확인용. ReqGuildInvitationProcess %s - guild_id : %d', ( recv_process_type == true ? 'true' : 'false' ), recv_guild_id);

		let guild_id;

		// Promise.all GO!
		Promise.all([
			LoadGTGuild.inst.GetGuild(recv_guild_id),
			LoadGTGuild.inst.GetGuildMember(p_user.uuid),
			LoadGTGuild.inst.GetGuildMemberCount(recv_guild_id)
		])
		.then(values => { 
			// console.log('values', values);
			let ret_guild = values[0];
			let ret_guild_member = values[1];
			let member_count = values[2];

			// 1. 길드 존재 확인
			if ( ret_guild == null )
				throw ( PacketRet.inst.retNotExistGuild() );

			// 길드 BaseData - 길드 최대 맴버수 구하기 위해서
			let base_guild = BaseGuild.inst.GetGuildInfo(ret_guild.dataValues.GUILD_LEVEL);
			if ( typeof base_guild === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Guild Info In Base Target Level', ret_guild.dataValues.GUILD_LEVEL ]);

			console.log('현재 인원 : %d, 최대 인원 : %d', member_count, base_guild.max_member_count);

			// 2. 길드 인원 확인
			if ( member_count >= base_guild.max_member_count )
				throw ([ PacketRet.inst.retArriveInMaxMemberCount(), 'Max Count', base_guild.max_member_count ]);

			if ( ret_guild_member != null ) {
				// 3. 길드 가입 상태 확인
				if ( ret_guild_member.dataValues.JOIN_STATES == true ) {
					if ( ret_guild_member.dataValues.GUILD_ID == ret_guild.dataValues.GUILD_ID )
						throw ([ PacketRet.inst.retAlReadyJoinGuild(), 'Already same guild member' ]);
					else
						throw ([ PacketRet.inst.retAlreadyAnotherGuildMember(), 'Already diff guild member' ]);
				} else {
					// 4. 길드 탈퇴 시간 확인 - 24시간 미만
					if ( Timer.inst.GetDeltaTime(ret_guild_member.dataValues.JOIN_DATE) < 86400 )
						throw ([ PacketRet.inst.retRemainTime(), Timer.inst.GetDeltaTime(ret_guild_member.dataValues.REG_DATE) ]);
				}
			}

			guild_id = ret_guild.dataValues.GUILD_ID;

			return ProcessTransaction(p_user.uuid, ret_guild_member, guild_id, recv_process_type);
		})
		.then(function() {
			p_ack_packet.guild_id = guild_id;

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