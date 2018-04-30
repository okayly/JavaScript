/********************************************************************
Title : LoadGTGuild
Date : 2017.02.17
Update : 2017.04.10
Writer : dongsu -> jongwook
Desc : Promise 로드 - 길드
********************************************************************/
var GTMgr = require('../GTMgr.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuild = function(p_guild_id) {
		return new Promise((resolve, reject) => {
			GTMgr.inst.GetGTGuild().find({
				where : { GUILD_ID : p_guild_id, EXIST_YN : true }
			})
			.then(p_ret => {
				if ( p_ret == null )
					throw ([ PacketRet.inst.retFail(), 'Not Find Guild' ]);

				resolve(p_ret);
			})
			.catch(p_error => { reject(p_error); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuildByUUID = function(p_uuid) {
		return new Promise((resolve, reject) => {
			GTMgr.inst.GetGTGuildMember().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret => {
				if ( p_ret != null ) {
					let guild_id = p_ret.dataValues.GUILD_ID;
					GTMgr.inst.GetGTGuildSkill().findAll({
						where : { GUILD_ID : guild_id, EXIST_YN : true }
					})
					.then(p_ret_skill => {
						resolve(p_ret_skill);
					})
					.catch(p_error => { reject([p_error, 'GetGuildByUUID - 2']); })
				}

				resolve(null);
			})
			.catch(p_error => { reject([p_error, 'GetGuildByUUID - 1']); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuildByName = function(p_guild_name) {
		return new Promise(function (resolve, reject) {
			GTMgr.inst.GetGTGuild().find({ where : { GUILD_NAME : p_guild_name, EXIST_YN : true } })
			.then(p_ret => { resolve(p_ret); })
			.catch(p_error => { reject(p_error); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuildMember = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_MEMBER select
			GTMgr.inst.GetGTGuildMember().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_member => { resolve(p_ret_member); })
			.catch(p_error => { reject(p_error); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuildMemberList = function(p_guild_id) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_MEMBER select
			GTMgr.inst.GetGTGuildMember().findAll({
				where : { GUILD_ID : p_guild_id, EXIST_YN : true }
			})
			.then(p_ret_member_list => { resolve(p_ret_member_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuildRaid = function(p_guild_id) {
		return new Promise((resolve, reject) => {
			// GT_GUILD_RAID select
			GTMgr.inst.GetGTGuildRaid().find({
				where : { GUILD_ID : p_guild_id, EXIST_YN : true }
			})
			.then(p_ret => {
				// if ( p_ret == null ) { throw ([ PacketRet.inst.retFail(), 'Not Find Guild']); }
				// 없을 수 있다. 
				resolve(p_ret);
			})
			.catch(p_error => { reject(p_error); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuildRaidParticipant = function(p_uuid, p_guild_id, p_chapter_id, p_stage_id) {
		return new Promise((resolve, reject) => {
			// GT_GUILD_RAID_PARICIPANT select
			GTMgr.inst.GetGTGuildRaidParicipant().find({
				where : { GUILD_ID : p_guild_id, UUID : p_uuid, CHAPTER_ID : p_chapter_id, STAGE_ID : p_stage_id, EXIST_YN : true }
			})
			.then(p_ret => {
				resolve(p_ret); // null 일 수 있다. 
			})
			.catch(p_error => { reject(p_error); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuildRaidParticipantAll = function(p_guild_id) {
		return new Promise((resolve, reject) => {
			// GT_GUILD_RAID_PARICIPANT select
			GTMgr.inst.GetGTGuildRaidParicipant().findAll({
				where : { GUILD_ID : p_guild_id, EXIST_YN : true }
			})
			.then(p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject(p_error); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------\
	inst.GetGuildMemberCount = function(p_guild_id)  {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_MEMBER select
			GTMgr.inst.GetGTGuildMember().count({
				where : { GUILD_ID : p_guild_id, JOIN_STATES : true, EXIST_YN : true }
			})
			.then(p_ret_count => { resolve(p_ret_count); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetGuildSkill = function(p_guild_id, p_skill_id) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_SKILL select
			GTMgr.inst.GetGTGuildSkill().find({
				where : { GUILD_ID : p_guild_id, SKILL_ID : p_skill_id, EXIST_YN : true }
			})
			.then(p_ret_skill => { resolve(p_ret_skill); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectJoinPendingApproval = function(p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_JOIN_PENDING_APPROVAL select
			GTMgr.inst.GetGTGuildJoinPendingApproval().find({
				where : { UUID : p_uuid, GUILD_ID : p_guild_id, EXIST_YN : true }
			})
			.then(p_ret_join => { resolve(p_ret_join); })
			.catch(p_error => { reject(p_error); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;