/********************************************************************
Title : GuildLevelup
Date : 2016.05.03
Update : 2016.08.16
Desc : 길드장이 길드 포인트로 길드 레벨업
Writer : jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');

var BaseGuild = require('../../Data/Base/BaseGuild.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레벨 업
	inst.ReqGuildLevelup = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqGuildLevelup', p_user.uuid, p_recv);

		var recv_guild_id = parseInt(p_recv.guild_id);

		// GT_GUILD select
		GTMgr.inst.GetGTGuild().find(
			{ where : { GUILD_ID : recv_guild_id, EXIST_YN : true }
		})
		.then(function (p_ret_guild) {
			if ( p_ret_guild == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Guild In GT_GUILD Guild ID', recv_guild_id);
				return;
			}
			
			// GT_GUILD_MEMBER select
			GTMgr.inst.GetGTGuildMember().find(
				{ where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function(p_ret_guild_member) {
				// 길드장 확인
				if ( p_ret_guild_member.dataValues.GUILD_AUTH != 1 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotGuildMaster(), 'AUTH', p_ret_guild_member.dataValues.GUILD_AUTH);
					return;
				}

				var target_level = p_ret_guild.dataValues.GUILD_LEVEL + 1;
				if ( target_level > BaseGuild.inst.max_guild_level ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyGuildLevelMax(), 'Max Guild Level', BaseGuild.inst.max_guild_level);
					return;
				}

				var base_guild = BaseGuild.inst.GetGuildInfo(target_level);
				if ( typeof base_guild === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Guild Info In Base Target Level', target_level);
					return;
				}

				if ( p_ret_guild.dataValues.GUILD_POINT < base_guild.need_guild_point ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGuildPoint(), 'Need Guild Point', base_guild.need_guild_point, 'Current Guild Point', p_ret_guild.dataValues.GUILD_POINT);
					return;
				}
				
				// GT_GUILD update
				p_ret_guild.updateAttributes({
					GUILD_LEVEL : target_level,
					GUILD_POINT : p_ret_guild.dataValues.GUILD_POINT - base_guild.need_guild_point
				})
				.then(function (p_ret_guild_update) {

					p_ack_packet.guild_level 	= p_ret_guild_update.dataValues.GUILD_LEVEL;
					p_ack_packet.guild_point 	= p_ret_guild_update.dataValues.GUILD_POINT;
					p_ack_packet.skill_id 	= 0;

					// 1. 오픈 스킬이 있다.
					if ( base_guild.open_guild_skill != 0 ) {
						GTMgr.inst.GetGTGuildSkill().create({
							GUILD_ID : p_ret_guild_member.dataValues.GUILD_ID,
							SKILL_ID : base_guild.open_guild_skill
						})
						.then(function (p_ret_skill_create) {

							p_ack_packet.skill_id = base_guild.open_guild_skill;
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());	
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildLevelup - 4');
						})
					}
					else {
						// 2. 오픈 스킬이 없다. 
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					}
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildLevelup - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildLevelup - 2');
			});
		}).catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildLevelup - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;