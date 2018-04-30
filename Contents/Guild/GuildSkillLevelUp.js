/********************************************************************
Title : GuildSkillLevelup
Date : 2017.02.06
Update : 2017.03.07
Desc : 길드 스킬 레벨업
writer: dongsu
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var SetGTUser = require('../../DB/GTSet/SetGTUser.js');
var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');

var BaseGuild	= require('../../Data/Base/BaseGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketNotice= require('../../Packets/PacketNotice/PacketNotice.js');
var Sender		= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var GetGuild = function(p_guild_id) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD select
			GTMgr.inst.GetGTGuild().find({
				where : { GUILD_ID : p_guild_id, EXIST_YN : true }
			})
			.then(function (p_ret_guild) { resolve(p_ret_guild); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetGuildPoint = function(p_ret_guild, p_point, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD update
			p_ret_guild.updateAttributes({
				GUILD_POINT : p_point
			}, { transaction : p_t })
			.then(p_ret_guild_update => { resolve(p_ret_guild_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetGuildSkillLevel = function(p_ret_guild_skill, p_skill_level, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_SKILL update
			p_ret_guild_skill.updateAttributes({
				SKILL_LEVEL : p_skill_level
			}, { transaction : p_t })
			.then(p_ret_guild_skill_update => { resolve(p_ret_guild_skill_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetGuild = function(p_ret_guild, p_ret_guild_skill, p_guild_point, p_skill_level) {
		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				console.log('SetTransaction');

				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGuildPoint(p_ret_guild, p_guild_point, t),
					SetGuildSkillLevel(p_ret_guild_skill, p_skill_level, t),
					SetGTGuild.inst.SetGuildMemberAllUserEffect(p_ret_guild.dataValues.GUILD_ID, p_ret_guild_skill.dataValues.SKILL_ID, p_skill_level, t)
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
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildSkillLevelUp = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildSkillLevelUp -', p_user.uuid, p_recv);

		let recv_skill_id = parseInt(p_recv.skill_id);

		// Promise GO! 1. 길드 가입 확인
		LoadGTGuild.inst.GetGuildMember(p_user.uuid)
		.then(p_ret_member => {
			// console.log('p_ret_member', p_ret_member);
			return new Promise(function (resolve, reject) {
				if ( p_ret_member == null ) {
					reject(PacketRet.inst.retNotGuildMember());
				}
				let member_data = p_ret_member.dataValues;
				// console.log('member_data', member_data);

				// 2. 길드장 권한 확인. 
				if ( member_data.GUILD_AUTH != 1 ) {
					reject([ PacketRet.inst.retNotGuildMaster(), 'AUTH', member_data.GUILD_AUTH ]);
				}

				let guild_id = member_data.GUILD_ID;
			
				return Promise.all([
					GetGuild(guild_id),
					LoadGTGuild.inst.GetGuildSkill(guild_id, recv_skill_id)
				])
				.then(values => {
					values.push(p_ret_member);
					resolve(values);
				})
				.catch(p_error => { reject(p_error); });
			});
		})
		.then(values => {
			console.log('All done Get Guild');
			let guild_data		= ( values[0] == null ) ? values[0] : values[0].dataValues;
			let guild_skill_data= ( values[1] == null ) ? values[1] : values[1].dataValues;
			let member_data		= ( values[2] == null ) ? values[2] : values[2].dataValues;

			return new Promise(function (resolve, reject) {
				if ( guild_data == null || guild_skill_data == null ) {
					reject([ PacketRet.inst.retFail(), 'Not Exist guild_data || guild_skill_data' ]);
				}

				// console.log('guild_data', guild_data);
				// console.log('guild_skill_data', guild_skill_data);

				let base_skill_cost = BaseGuild.inst.GetSkillCost(recv_skill_id);
				if ( base_skill_cost == undefined ) {
					reject([ PacketRet.inst.retFail(), 'Not Exist Skill In Base Skill ID', recv_skill_id ]);
				}

				// 4. 재화 차감. OpenCost + CostLv * Skill_Lv (현재 스킬 레벨)
				let need_point = base_skill_cost.open_cost + ( base_skill_cost.cost_level * guild_skill_data.SKILL_LEVEL );
				if ( guild_data.GUILD_POINT < need_point ) {
					reject(PacketRet.inst.retNotEnoughGuildPoint());
				}

				console.log('정보 확인용. -', need_point);

				let ret_guild_point = guild_data.GUILD_POINT - need_point;
				let ret_skill_level = guild_skill_data.SKILL_LEVEL + 1;

				resolve(SetGuild(values[0], values[1], ret_guild_point, ret_skill_level));
			});
		})
		.then(values => {
			console.log('All done Set Guild');

			let guild_data		= values[0].dataValues;
			let guild_skill_data= values[1].dataValues;

			p_ack_packet.guild_point	= guild_data.GUILD_POINT;
			p_ack_packet.skill_id		= recv_skill_id;
			p_ack_packet.skill_level	= guild_skill_data.SKILL_LEVEL;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());	

			// 길드원에게 전송. 
			let evt_cmd		= PacketNotice.inst.cmdEvtGuildSkillUp();
			let evt_packet	= PacketNotice.inst.GetPakcetEvtGuildSkillUp();

			evt_packet.skill_id 	= recv_skill_id;
			evt_packet.skill_level 	= guild_skill_data.SKILL_LEVEL;
			
			Sender.inst.toGuild(guild_data.GUILD_ID, p_user.uuid, evt_cmd, evt_packet);
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;