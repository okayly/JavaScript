/********************************************************************
Title : GuildInvitationList
Date : 2016.06.28
Update : 2016.08.11
writer: dongsu
Desc : 나를 초대한 길드 리스트 확인
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
	// 2-1-1-1. 상대가 길드원이 아니어야 한다. 
	// 2-1-1-2. 상대의 초대 개수가 10개 이하여야 한다. 
	// 2-2. 길드장이 아니다. 
	// 2-2-1. 초대 불가. 
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildInvitationList = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildInvitationList -', p_user.uuid, p_recv);

		// call ad-hoc query - 1. 길드 검색
		mkDB.inst.GetSequelize().query('select B.GUILD_ID, B.GUILD_MARK, B.GUILD_NAME, B.GUILD_LEVEL, D.NICK, D.USER_LEVEL, B.JOIN_OPTION, E.MAX_MEMBER_COUNT, \
											(select COUNT(*) from GT_GUILD_MEMBERs where GUILD_ID = A.GUILD_ID and JOIN_STATES = true) as MEMBER_COUNT \
										from GT_GUILD_INVITATIONs as A \
										left join GT_GUILDs as B on A.GUILD_ID = B.GUILD_ID \
										left join GT_GUILD_MEMBERs as C on A.GUILD_ID = C.GUILD_ID and C.GUILD_AUTH = 1 and JOIN_STATES = true \
										left join GT_USERs as D on C.UUID = D.UUID \
										left join BT_GUILDs as E on B.GUILD_LEVEL = E.GUILD_LV \
										where A.UUID = ? and A.INVITE_STATES = true \
										order by A.REG_DATE limit ?;' ,
			null,
			{ raw: true, type: 'SELECT' },
			[ p_user.uuid, DefineValues.inst.GuildInvitationMaxList ]
		)
		.then(function (p_ret_guild) {
			// console.log('p_ret_guild', p_ret_guild);
			if ( Object.keys(p_ret_guild).length > 0 ) {
				for ( var cnt in p_ret_guild ) {
					var guild = new PacketCommonData.Guild();
					guild.guild_id				= p_ret_guild[cnt].GUILD_ID;
					guild.guild_mark			= p_ret_guild[cnt].GUILD_MARK;
					guild.guild_name			= p_ret_guild[cnt].GUILD_NAME;
					guild.guild_level			= p_ret_guild[cnt].GUILD_LEVEL;
					guild.guild_master_nick		= p_ret_guild[cnt].NICK;
					guild.guild_master_level	= p_ret_guild[cnt].USER_LEVEL;
					guild.guild_join_option		= p_ret_guild[cnt].JOIN_OPTION;
					guild.guild_limit_member	= p_ret_guild[cnt].MAX_MEMBER_COUNT;
					guild.guild_current_member	= p_ret_guild[cnt].MEMBER_COUNT;

					p_ack_packet.guild_info_list.push(guild);
				}
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildInvitationList');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;