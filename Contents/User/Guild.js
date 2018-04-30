/********************************************************************
Title : Guild
Date : 2016.07.14
Update : 2016.09.27
Desc : 로그인 정보 - 길드
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');
var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuild = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuild -', p_user.uuid, p_recv);

		// GT_GUILD_MEMBER select
		GTMgr.inst.GetGTGuildMember().find({
			where : { UUID : p_user.uuid, JOIN_STATES: true } 
		})
		.then(function (p_ret_guild_member) {
			if ( p_ret_guild_member == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				return;
			}

			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where: { UUID: p_user.uuid, EXIST_YN: true }
			})
			.then(function (p_ret_daily_contents) {
				p_ack_packet.guild_id			= p_ret_guild_member.dataValues.GUILD_ID;
				p_ack_packet.prev_guild_auth	= p_ret_guild_member.dataValues.PREV_GUILD_AUTH;
				p_ack_packet.guild_auth			= p_ret_guild_member.dataValues.GUILD_AUTH;

				p_ack_packet.remain_donation_count		= p_ret_daily_contents.GUILD_POINT_DONATION_COUNT;
				p_ack_packet.lately_free_donation_time	= Timer.inst.GetUnixTime(p_ret_daily_contents.LATELY_FREE_DONATION_TIME);

				// GT_WEEKLY_CONTENTS select
				GTMgr.inst.GetGTWeeklyContents().find({
					where : { UUID : p_user.uuid }
				})
				.then(function (p_ret_weekly) {
					p_ack_packet.take_donation_reward = p_ret_weekly.dataValues.TAKE_DONATION_REWARD;

					// GT_GUILD_SKILL select
					GTMgr.inst.GetGTGuildSkill().findAll({
						where : { GUILD_ID : p_ret_guild_member.dataValues.GUILD_ID }
					})
					.then(function (p_ret_skill_list) {
						for ( var cnt in p_ret_skill_list ) {
							var temp_skill = new PacketCommonData.GuildSkillInfo();
							temp_skill.skill_id 	= p_ret_skill_list[cnt].SKILL_ID;
							temp_skill.skill_level 	= p_ret_skill_list[cnt].SKILL_LEVEL;

							p_ack_packet.guild_skill_list.push(temp_skill);
						}

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuild - 4');	
					})
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuild - 3');
				})
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuild - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuild - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;