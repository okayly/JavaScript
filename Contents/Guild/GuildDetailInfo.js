/********************************************************************
Title : GuildDetailInfo
Date : 2016.05.24
Update : 2016.08.11
Desc : 길드 상세 정보
writer: dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');
var Timer	= require('../../Utils/Timer.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildDetailInfo = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildDetailInfo -', p_user.uuid, p_recv);

		var recv_guild_id = parseInt(p_recv.guild_id);

		// call ad-hoc query - Guild
		mkDB.inst.GetSequelize().query('select A.GUILD_ID, A.GUILD_MARK, A.GUILD_NAME, A.GUILD_LEVEL, A.GUILD_NOTICE, B.MAX_MEMBER_COUNT, \
							(select COUNT(*) from GT_GUILD_MEMBERs where GUILD_ID = A.GUILD_ID and JOIN_STATES = true) as MEMBER_COUNT,  \
							A.PREV_WEEKLY_ACCUM_GUILD_POINT, A.WEEKLY_ACCUM_GUILD_POINT, \
							A.AUTO_MASTER_CHANGE, A.ELDER_RAID_OPEN, \
							A.GUILD_POINT, A.JOIN_OPTION, A.REG_DATE from GT_GUILDs as A  \
						left join BT_GUILDs as B on A.GUILD_LEVEL = B.GUILD_LV \
						where A.GUILD_ID = ?;',
			null,
			{ raw : true, type : 'SELECT' },
			[ recv_guild_id ]
		)
		.then(function (p_ret_guild) {
			// console.log('p_ret_guild', p_ret_guild);
			// 길드 정보. 
			if ( p_ret_guild == null || p_ret_guild.length <= 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistGuild(), 'Guild ID', recv_guild_id);
				return;
			}

			p_ack_packet.guild_detail_info.guild_id				= p_ret_guild[0].GUILD_ID;
			p_ack_packet.guild_detail_info.guild_mark			= p_ret_guild[0].GUILD_MARK;
			p_ack_packet.guild_detail_info.guild_name			= p_ret_guild[0].GUILD_NAME;
			p_ack_packet.guild_detail_info.guild_level			= p_ret_guild[0].GUILD_LEVEL;
			p_ack_packet.guild_detail_info.guild_notice			= p_ret_guild[0].GUILD_NOTICE;
			p_ack_packet.guild_detail_info.guild_limit_member	= p_ret_guild[0].MAX_MEMBER_COUNT;
			p_ack_packet.guild_detail_info.guild_current_member	= p_ret_guild[0].MEMBER_COUNT;
			p_ack_packet.guild_detail_info.guild_total_point	= p_ret_guild[0].GUILD_POINT;
			p_ack_packet.guild_detail_info.guild_create_date	= Timer.inst.GetUnixTime(p_ret_guild[0].REG_DATE);
			p_ack_packet.guild_detail_info.guild_join_option	= p_ret_guild[0].JOIN_OPTION;
			p_ack_packet.guild_detail_info.auto_master_change	= ( p_ret_guild[0].AUTO_MASTER_CHANGE == 1 ) ? true : false;
			p_ack_packet.guild_detail_info.elder_raid_open		= ( p_ret_guild[0].ELDER_RAID_OPEN == 1 ) ? true : false;

			p_ack_packet.guild_detail_info.prev_weekly_accum_guild_point = p_ret_guild[0].PREV_WEEKLY_ACCUM_GUILD_POINT;
			p_ack_packet.guild_detail_info.weekly_accum_guild_point	= p_ret_guild[0].WEEKLY_ACCUM_GUILD_POINT;

			// call ad-hoc query - GuildMember
			mkDB.inst.GetSequelize().query('select B.UUID, B.NICK, B.LAST_LOGIN_DATE, B.USER_LEVEL, B.ICON, \
								A.GUILD_AUTH, A.WEEKLY_ACCUM_DONATION_POINT, \
								A.TOTAL_ACCUM_DONATION_POINT, A.JOIN_DATE, \
								if(isnull(C.DAMAGE), 0, C.DAMAGE) as DAMAGE \
								from GT_GUILD_MEMBERs as A \
								left join GT_USERs as B on A.UUID = B.UUID \
								left join GT_GUILD_RAID_PARTICIPANTs as C on A.UUID = C.UUID \
							where A.GUILD_ID = ? and A.JOIN_STATES = true;',
				null,
				{ raw : true, type : 'SELECT' },
				[ recv_guild_id ]
			)
			.then(function (p_ret_member) {
				// console.log('p_ret_member', p_ret_member);
				// 길드 멤버 정보. 
				if ( Object.keys(p_ret_member).length > 0 ) {
					for ( var cnt in p_ret_member ) {
						var member = new PacketCommonData.GuildMember();
						member.uuid							= p_ret_member[cnt].UUID;
						member.user_icon					= p_ret_member[cnt].ICON;
						member.user_nick					= p_ret_member[cnt].NICK;
						member.user_last_connection_date 	= Timer.inst.GetUnixTime(p_ret_member[cnt].LAST_LOGIN_DATE);
						member.user_level					= p_ret_member[cnt].USER_LEVEL;
						member.guild_member_auth			= p_ret_member[cnt].GUILD_AUTH;
						member.weekly_accum_donation_point	= p_ret_member[cnt].WEEKLY_ACCUM_DONATION_POINT;
						member.total_accum_donation_point	= p_ret_member[cnt].TOTAL_ACCUM_DONATION_POINT;
						member.damage						= p_ret_member[cnt].DAMAGE;
						member.join_date 					= Timer.inst.GetUnixTime(p_ret_member[cnt].JOIN_DATE);

						p_ack_packet.guild_member_list.push(member);
					}
				}

				// GT_DAILY_CONTENTS
				GTMgr.inst.GetGTDailyContents().find({
					where: { UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(function(p_ret_daily_contents) {
					p_ack_packet.guild_raid_battle_count = p_ret_daily_contents.dataValues.GUILD_RAID_BATTLE_COUNT;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function(p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildDetailInfo - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildDetailInfo - 2');
			});			
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildDetailInfo - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;