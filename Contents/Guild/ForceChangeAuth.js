/********************************************************************
Title : ForceChangeAuth
Date : 2017.03.09
Update : 2017.03.13
writer: jongwook
Desc : 길드 권한 변경
	GUILD_AUTH		(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION		(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
	GUILD_STATES	( true : 활성, false : 폐쇄.)
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');
var SetGTUser = require('../../DB/GTSet/SetGTUser.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');
var moment = require('moment');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var ChangeAuth = function(p_ret_member, p_auth, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_member.dataValues.GUILD_AUTH != p_auth ) {
				p_ret_member.updateAttributes({
					GUILD_AUTH : p_auth
				}, { transaction : p_t })
				.then(p_ret_auth => { resolve(p_ret_auth); })
				.catch(p_error => { reject(p_error); });
			} else {
				resolve(p_ret_member);
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqForceChangeAuth = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChangeAuth -', p_user.uuid, p_recv);

		var recv_guild_id = parseInt(p_recv.guild_id);
		var recv_master_uuid = parseInt(p_recv.master_uuid);

		if ( p_user.uuid == recv_master_uuid )
			throw ([ PacketRet.inst.retFail(), 'Same UUID' ]);

		// Promise.all GO!
		return Promise.all([
			LoadGTUser.inst.SelectUser(recv_master_uuid),
			LoadGTGuild.inst.GetGuildMember(recv_master_uuid),
			LoadGTGuild.inst.GetGuildMember(p_user.uuid)
		])
		.then(values => {
			let ret_user = values[0];
			let ret_master = values[1];
			let ret_self = values[2];

			if ( ret_user == null || ret_master == null || ret_self == null )
				throw ([ PacketRet.inst.retFail(), 'Not find user or master or self' ]);

			if ( ret_master.dataValues.GUILD_ID != ret_self.dataValues.GUILD_ID )
				throw ([ PacketRet.inst.retNotGuildMember(), 'Not match guild' ]);

			// 접속 시간 확인 - 5
			let limit_day = 2;
			let diff_days = moment().diff(moment(ret_user.dataValues.LAST_LOGIN_DATE), 'minutes');
			// let diff_days = moment().diff(moment(ret_user.dataValues.LAST_LOGIN_DATE), 'days');
			console.log('diff_days', diff_days);

			if ( diff_days < limit_day )
				throw ([ PacketRet.inst.retRemainTime(), 'diff_days', diff_days ]);

			if ( ret_master.dataValues.GUILD_AUTH != DefineValues.inst.GuildAuthMaster )
				throw ([ PacketRet.inst.retNotEnoughAuth(), 'Not guild master' ]);

			// 길드 권한 변경
			return new Promise(function (resolve, reject) {
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;
					
					return Promise.all([
						ChangeAuth(ret_master, DefineValues.inst.GuildAuthMember, t),
						ChangeAuth(ret_self, DefineValues.inst.GuildAuthMaster, t)
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
				});
			});
		})
		.then(values => {
			// console.log('SendPacket', values);
			let ret_master = values[0];
			let ret_self = values[1]

			p_ack_packet.master_uuid = ret_self.dataValues.UUID;

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