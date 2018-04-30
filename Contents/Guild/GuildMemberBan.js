/********************************************************************
Title : GuildMemberBan
Date : 2016.06.14
Update : 2017.03.06
Dec : 길드 멤버 벤
	GUILD_AUTH  	(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION 	(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES 	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
writer: dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');
var SetGTUser = require('../../DB/GTSet/SetGTUser.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketNotice = require('../../Packets/PacketNotice/PacketNotice.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetGuildMember = function(p_ret_target_member, p_t){
		return new Promise(function (resolve, reject) {
			let join_states = false;
			let effect_call = DefineValues.inst.SkillEffectCallGuild;

			return Promise.all([
				SetGTGuild.inst.UpdateGuildMember(p_ret_target_member, p_ret_target_member.dataValues.GUILD_ID, p_ret_target_member.dataValues.GUILD_AUTH, join_states, p_t),
				SetGTUser.inst.DelUserEffect(p_ret_target_member.dataValues.UUID, effect_call, p_t)
			])			
			.then(values => { resolve(values[0]); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildMemberBan = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildMemberBan -', p_user.uuid, p_recv);

		var recv_target_uuid = parseInt(p_recv.target_uuid);

		// Promise.all GO!
		Promise.all([
			LoadGTGuild.inst.GetGuildMember(p_user.uuid),
			LoadGTGuild.inst.GetGuildMember(recv_target_uuid)
		])
		.then(values => {
			let ret_user_member = values[0];
			let ret_target_member = values[1];

			// 길드 멤버 확인
			if ( ret_user_member == null || ret_target_member == null )
				throw ([ PacketRet.inst.retNotGuildMember(), 'values is null' ]);

			// 같은 길드 확인
			if ( ret_user_member.dataValues.GUILD_ID != ret_target_member.dataValues.GUILD_ID )
				throw ([ PacketRet.inst.retNotGuildMember(), 'Not match guild_id' ]);

			// 길드 가입 상태 확인
			if ( ret_user_member.dataValues.JOIN_STATES == false || ret_target_member.dataValues.JOIN_STATES == false )
				throw ([ PacketRet.inst.retNotGuildMember(), 'JOIN_STATES is false' ]);

			// 자기 자신 벤 확인(불가능)
			if ( ret_user_member.dataValues.UUID == ret_target_member.dataValues.UUID )
				throw ([ PacketRet.inst.retNotGuildMember(), 'UUID same' ]);

			let user_auth = ret_user_member.dataValues.GUILD_AUTH;
			let target_auth = ret_target_member.dataValues.GUILD_AUTH;
			
			// 길드장 ( 벤 가능 : 장로, 길드원. ) 장로. ( 벤 가능 : 길드원. ) 길드원( 벤 불가능 )
			if ( user_auth == DefineValues.inst.GuildAuthMember || 
				( user_auth == DefineValues.inst.GuildAuthElder && target_auth != DefineValues.inst.GuildAuthMember ))
				throw([ PacketRet.inst.retNotEnoughAuth(), 'user_auth error' ]);

			return new Promise(function (resolve, reject) {
				// start transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					SetGuildMember(ret_target_member, t)
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
		})
		.then(value => {
			// 결과 전송. 
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

			// 대상에게 알림. 
			var evt_cmd		= PacketNotice.inst.cmdEvtBanAtGuild();
			var evt_packet	= PacketNotice.inst.GetPacketEvtBanAtGuild();

			Sender.inst.toTargetPeer(value.dataValues.UUID, evt_cmd, evt_packet);
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