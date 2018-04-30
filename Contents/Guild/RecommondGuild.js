/********************************************************************
Title : RecommondGuild
Date : 2016.06.14
Update : 2016.08.16
Desc : 추천 길드 리스트 목록
writer: dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqRecommondGuild = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqRecommondGuild -', p_user.uuid, p_recv);

		mkDB.inst.GetSequelize().query('select A.GUILD_ID, A.GUILD_MARK, A.GUILD_NAME, A.GUILD_LEVEL, A.JOIN_OPTION, D.NICK, D.USER_LEVEL, B.MAX_MEMBER_COUNT, \
											(select COUNT(*) from GT_GUILD_MEMBERs where GUILD_ID = A.GUILD_ID and JOIN_STATES = true) as MEMBER_COUNT  \
										from GT_GUILDs as A  \
										left join BT_GUILDs as B on A.GUILD_LEVEL = B.GUILD_LV \
										left join GT_GUILD_MEMBERs as C on A.GUILD_ID = C.GUILD_ID and C.GUILD_AUTH = 1 \
										left join GT_USERs as D on D.UUID = C.UUID \
										where (select COUNT(*) from GT_GUILD_MEMBERs where GUILD_ID = A.GUILD_ID and JOIN_STATES = true) < B.MAX_MEMBER_COUNT \
											and A.JOIN_OPTION != 3 and A.GUILD_STATES = true \
											and A.GUILD_ID not in (select GUILD_ID from GT_GUILD_JOIN_PENDING_APPROVALs where UUID = ? and APPROVAL_STATES = 0 ) \
										order by A.REG_DATE desc limit 7;',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_user.uuid ]
		)
		.then(function (p_ret_guild_list) {
			if ( Object.keys(p_ret_guild_list).length > 0 ) {
				for ( var cnt in p_ret_guild_list ) {
					var data = p_ret_guild_list[cnt];
					logger.info('추천 길드 정보. -', data.dataValues);
					
					var guild = new PacketCommonData.Guild();
					
					guild.guild_id				= data.GUILD_ID;
					guild.guild_mark			= data.GUILD_MARK;
					guild.guild_name			= data.GUILD_NAME;
					guild.guild_level			= data.GUILD_LEVEL;
					guild.guild_master_nick		= data.NICK;
					guild.guild_master_level	= data.USER_LEVEL;
					guild.guild_limit_member	= data.MAX_MEMBER_COUNT;
					guild.guild_current_member	= data.MEMBER_COUNT;
					guild.guild_join_option		= data.JOIN_OPTION;

					p_ack_packet.guild_list.push(guild);
				}
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqRecommondGuild');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;