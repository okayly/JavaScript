/********************************************************************
Title : FindGuild
Date : 2016.05.18
Update : 2016.08.11
writer: dongsu
Desc : 길드 찾기
	GUILD_AUTH		(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION		(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFindGuild = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqFindGuild -', p_user.uuid, p_recv);

		// call ad-hoc query - 1. 길드 검색. 
		mkDB.inst.GetSequelize().query('select A.GUILD_ID, A.GUILD_MARK, A.GUILD_NAME, A.GUILD_LEVEL, D.NICK, D.USER_LEVEL, B.MAX_MEMBER_COUNT, \
								(select COUNT(*) from GT_GUILD_MEMBERs where GUILD_ID = A.GUILD_ID and JOIN_STATES = true) \
								as MEMBER_COUNT, A.JOIN_OPTION \
							from GT_GUILDs as A \
								left join BT_GUILDs as B on A.GUILD_LEVEL = B.GUILD_LV \
								left join GT_GUILD_MEMBERs as C on A.GUILD_ID = C.GUILD_ID and C.GUILD_AUTH = 1 \
								left join GT_USERs as D on D.UUID = C.UUID \
							where \
								(select COUNT(*) from GT_GUILD_MEMBERs where GUILD_ID = A.GUILD_ID) < B.MAX_MEMBER_COUNT \
								and A.GUILD_NAME = ? and A.GUILD_STATES = true;',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_recv.guild_name ]
		)
		.then(function (p_ret_guild) {
			if ( Object.keys(p_ret_guild).length <= 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistGuild());
				return;
			}

			p_ack_packet.guild_info.guild_id			= p_ret_guild[0].GUILD_ID;
			p_ack_packet.guild_info.guild_mark			= p_ret_guild[0].GUILD_MARK;
			p_ack_packet.guild_info.guild_name			= p_ret_guild[0].GUILD_NAME;
			p_ack_packet.guild_info.guild_level			= p_ret_guild[0].GUILD_LEVEL;
			p_ack_packet.guild_info.guild_master_nick	= p_ret_guild[0].NICK;
			p_ack_packet.guild_info.guild_master_level	= p_ret_guild[0].USER_LEVEL;
			p_ack_packet.guild_info.guild_limit_member	= p_ret_guild[0].MAX_MEMBER_COUNT;
			p_ack_packet.guild_info.guild_current_member= p_ret_guild[0].MEMBER_COUNT;
			p_ack_packet.guild_info.guild_join_option	= p_ret_guild[0].JOIN_OPTION;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFindGuild');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;