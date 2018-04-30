/********************************************************************
Title : GuildInvitation
Date : 2016.06.15
Update : 2017.04.11
writer: dongsu -> jongwook
Dec : 길드원 초대(초대 권한이 있는 길드원)
	GUILD_AUTH		(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION		(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
	GUILD_STATES	( true : 활성, false : 폐쇄.)
	INVITE_STATES	( 0 : 승인 대기. 1 : 승인, 2 : 거부. )
Logic :
	// 1. 길드 멤버 인지 확인.
	// 2. 권한 확인.
	// 2-1. 길드장이다. 
	// 2-1-1. 초대 가능. 
	// 2-1-1-0. 길드장이 자신을 초대 했을 경우.
	// 2-1-1-1. 상대가 길드원이 아니어야 한다. 
	// 2-1-1-2. 상대의 초대 개수가 10개 이하여야 한다. 
	// 2-2. 길드장이 아니다. 
	// 2-2-1. 초대 불가. 
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SelectInvitation = function(p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_INVITATION insert
			GTMgr.inst.GetGTGuildInvitation().find({
				where : { UUID : p_uuid, GUILD_ID : p_guild_id, EXIST_YN : true }
			})
			.then(p_ret_invitation => { resolve(p_ret_invitation); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectTargetInfo = function(p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			// Promise.all GO!
			Promise.all([
				LoadGTGuild.inst.GetGuildMember(p_uuid),
				SelectInvitation(p_uuid, p_guild_id)
			])
			.then(values => { resolve(values); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_target_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;
				// GT_GUILD_INVITATION insert
				GTMgr.inst.GetGTGuildInvitation().create({
					UUID : p_target_uuid,
					GUILD_ID : p_guild_id,
					INVITE_STATES : true,
					REG_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : t })
				.then(p_ret_invite_insert => {
					t.commit();

					resolve(p_ret_invite_insert);
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
	inst.ReqGuildInvitation = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildInvitation -', p_user.uuid, p_recv);

		let recv_nick = p_recv.user_nick;

		let guild_id;
		let target_uuid;

		// Promise.all GO!
		Promise.all([
			LoadGTGuild.inst.GetGuildMember(p_user.uuid),
			LoadGTUser.inst.SelectUserByNick(recv_nick)
		])		
		.then(values => {
			let ret_guild_member = values[0];
			let ret_target_user = values[1];

			if ( ret_guild_member == null )
				throw ([ PacketRet.inst.retNotGuildMember(), 'Not guild memeber' ]);

			if ( ret_guild_member.dataValues.GUILD_AUTH != DefineValues.inst.GuildAuthMaster )
				throw ([ PacketRet.inst.retNotEnoughAuth(), 'Not guild master', ret_guild_member.dataValues.GUILD_AUTH ]);

			if ( ret_target_user == null )
				throw ([ PacketRet.inst.retFail(), 'Target User is null' ]);

			if ( ret_target_user.dataValues.UUID == p_user.uuid )
				throw([ PacketRet.inst.retIncorrectTargetUser(), 'Same UUID' ]);

			guild_id = ret_guild_member.dataValues.GUILD_ID;
			target_uuid = ret_target_user.dataValues.UUID;

			return SelectTargetInfo(target_uuid, guild_id);
		})
		.then(values => {
			let guild_member = values[0];
			let guild_invitation = values[1];

			if ( guild_member != null && guild_member.dataValues.JOIN_STATES == true )
				throw ([ PacketRet.inst.retAlreadyAnotherGuildMember(), 'AlreadyAnotherGuildMember' ]);

			if ( guild_invitation != null )
				throw ([ PacketRet.inst.retAlreadyInviteTarget(), 'Already invite target' ]);

			return ProcessTransaction(target_uuid, guild_id);
		})
		.then(value => {
			// console.log('value', value);
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