/********************************************************************
Title : GuildLevelup
Date : 2016.05.03
Update : 2017.03.07
Desc : 길드장이 길드 포인트로 길드 레벨업
Writer : jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');
var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');

var BaseGuild = require('../../Data/Base/BaseGuild.js');
var DefineValues = require('../../Common/DefineValues.js');

var Sender 	= require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.SetGuildData = function(p_ret_guild, p_guild_level, p_guild_point, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_guild_level != 0 && p_ret_guild.dataValues.GUILD_LEVEL != p_guild_level )
				p_ret_guild['GUILD_LEVEL'] = p_guild_level;

			if ( p_ret_guild.dataValues.GUILD_POINT != p_guild_point )
				p_ret_guild['GUILD_POINT'] = p_guild_point;

			// GT_GUILD update
			p_ret_guild.save({ transaction : p_t })
			.then(value => {
				console.log('SetGuildPoint');
				resolve(value);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetGuildSkill = function(p_guild_id, p_skill_id, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_skill_id == 0 ) {
				console.log('SetGuildSkill - 1');
				resolve(null);
			} else {
				// GT_GUILD_SKILL create
				GTMgr.inst.GetGTGuildSkill().create({
					GUILD_ID : p_guild_id, SKILL_ID : p_skill_id, EXIST_YN : true, REG_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_skill => {
					console.log('SetGuildSkill - 2');
					resolve(p_ret_skill);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레벨 업
	inst.ReqGuildLevelup = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqGuildLevelup', p_user.uuid, p_recv);

		var recv_guild_id = parseInt(p_recv.guild_id);

		// Promise.all GO!
		Promise.all([
			LoadGTGuild.inst.GetGuild(recv_guild_id),
			LoadGTGuild.inst.GetGuildMember(p_user.uuid)
		])
		.then(values => {
			let ret_guild = values[0];
			let ret_member = values[1];

			if ( ret_guild == null || ret_member == null )
				throw ([ PacketRet.inst.retFail(), 'Guild or Member is null' ]);

			// 길드장 확인
			if ( ret_member.dataValues.GUILD_AUTH != DefineValues.inst.GuildAuthMaster ) {
				throw ([ PacketRet.inst.retNotGuildMaster(), 'AUTH', ret_member.dataValues.GUILD_AUTH ]);
			}

			let target_level = ret_guild.dataValues.GUILD_LEVEL + 1;
			if ( target_level > BaseGuild.inst.max_guild_level ) {
				throw ([ PacketRet.inst.retAlreadyGuildLevelMax(), 'Max Guild Level', BaseGuild.inst.max_guild_level ]);
			}

			let base_guild = BaseGuild.inst.GetGuildInfo(target_level);
			if ( typeof base_guild === 'undefined' ) {
				throw([ PacketRet.inst.retFail(), 'Not Exist Guild Info In Base Target Level', target_level]);
			}

			if ( ret_guild.dataValues.GUILD_POINT < base_guild.need_guild_point ) {
				throw ([ PacketRet.inst.retNotEnoughGuildPoint(), 'Need Guild Point', base_guild.need_guild_point, 'Current Guild Point', ret_guild.dataValues.GUILD_POINT ]);
			}

			let ret_point = ret_guild.dataValues.GUILD_POINT - base_guild.need_guild_point;			

			return new Promise(function (resolve, reject) {
				// start transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;
					let skill_id = base_guild.open_guild_skill;

					// Promise.all GO!
					Promise.all([
						inst.SetGuildData(ret_guild, target_level, ret_point, t),
						SetGuildSkill(recv_guild_id, skill_id, t),
						SetGTGuild.inst.SetGuildMemberAllUserEffect(recv_guild_id, skill_id, 0, t)
					])
					.then(values => {
						console.log('transaction done');

						t.commit();

						let ret_guild = values[0];
						let ret_skill = values[1];

						p_ack_packet.guild_level = ret_guild.dataValues.GUILD_LEVEL;
						p_ack_packet.guild_point = ret_guild.dataValues.GUILD_POINT;
						p_ack_packet.skill_id = ( ret_skill == null ) ? 0 : ret_skill.dataValues.SKILL_ID;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;