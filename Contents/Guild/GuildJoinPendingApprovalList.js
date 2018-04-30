/********************************************************************
Title : GuildJoinPendingApprovalList
Date : 2016.06.30
Update : 2017.04.10
writer: dongsu
Dec : 길드 가입 보류 중인 승인 신청(길드에 가입 신청한 유저 처리)
	GUILD_AUTH  	(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION 	(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES 	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var ProcessPendingApprovalList = function(p_user, p_ack_cmd, p_ack_packet, p_guild_id) {
		// call ad-hoc query
		mkDB.inst.GetSequelize().query('select A.UUID, B.NICK, B.ICON, B.USER_LEVEL, B.VIP_STEP, B.LAST_LOGIN_DATE \
							from GT_GUILD_JOIN_PENDING_APPROVALs as A \
								left join GT_USERs as B on A.UUID = B.UUID \
							where A.APPROVAL_STATES = 0 and A.GUILD_ID = ?;',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_guild_id ]
		)
		.then(function (p_ret) {
			if ( Object.keys(p_ret).length > 0 ) {
				for (var cnt in p_ret) {
					var approval_user = new PacketCommonData.GuildJoinPendingApprovalUser();
					approval_user.uuid			= p_ret[cnt].UUID;
					approval_user.user_icon		= p_ret[cnt].ICON;
					approval_user.user_nick		= p_ret[cnt].NICK;
					approval_user.user_level	= p_ret[cnt].USER_LEVEL;
					approval_user.vip_step		= p_ret[cnt].VIP_STEP;
					approval_user.last_login_date	= Timer.inst.GetUnixTime(p_ret[cnt].LAST_LOGIN_DATE);

					p_ack_packet.pending_approval_list.push(approval_user);
				}
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ProcessPendingApprovalList');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildJoinPendingApprovalList = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildJoinPendingApprovalList -', p_user.uuid, p_recv);

		// GT_GUILD_MEMBER select
		GTMgr.inst.GetGTGuildMember().find({
			where : { UUID: p_user.uuid, JOIN_STATES: true, EXIST_YN : true }
		})
		.then(function (p_ret_member) {
			if ( p_ret_member == null ) {
				// 길드 멤버가 아니다. 
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotGuildMember());
			} else {
				// 1. 권한 확인. (길드장, 장로)
				var guild_id	= p_ret_member.dataValues.GUILD_ID;
				var user_auth	= p_ret_member.dataValues.GUILD_AUTH; // (1 : 길드장, 2 : 장로, 3 : 일반.)

				if ( user_auth == 1 || user_auth == 2 ) {
					ProcessPendingApprovalList(p_user, p_ack_cmd, p_ack_packet, guild_id);
				} else {
					// 권한이 부족한다. 
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughAuth());
				}
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildJoinPendingApprovalList');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;