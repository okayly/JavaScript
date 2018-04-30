/********************************************************************
Title : GuildRaidOpen
Date : 2017.02.24
Update : 2017.03.13
Desc : 길드 레이드 챕터 오픈
writer: dongsu
********************************************************************/
var GTMgr 	= require('../../DB/GTMgr.js');
var mkDB	= require('../../DB/mkDB.js');

var LoadUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var BaseChapter = require('../../Data/Base/BaseChapter.js');
var BaseStage = require('../../Data/Base/BaseStage.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var UpdateRaid = function(p_tran, p_guild_id, p_chapter_id, p_base_stage) {
		return new Promise((resolve, reject) => {
			let now_date = Timer.inst.GetNowByStrDate();

			// GT_GUILD_RAID insert
			GTMgr.inst.GetGTGuildRaid().create({
				GUILD_ID : p_guild_id,
				CHAPTER_ID : p_chapter_id,
				PROGRESS_STAGE_ID : p_base_stage.stage_id,
				PROGRESS_STAGE_BOSS_HP : p_base_stage.boss_hp,
				OPEN_DATE : now_date
			}, { transaction : p_tran })
			.then(p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([ p_error, 'InsertRaid' ]); });
		});
	}

//------------------------------------------------------------------------------------------------------------------
	var UpdateGuild = function(p_tran, p_guild_id, p_guild_point) {
		return new Promise((resolve, reject) => {
			LoadGuild.inst.GetGuild(p_guild_id)
			.then(function (p_out_guild) {
				// GT_GUILD update
				p_out_guild.updateAttributes({
					GUILD_POINT : p_guild_point
				}, { transaction : p_tran })
				.then(p_ret_update => {
					resolve(p_ret_update);
				})
				.catch(p_error => { reject([ p_error, 'UpdateGuild' ]); });
			})
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateRaidParticipant = function(p_tran, p_guild_id) {
		return new Promise((resolve, reject) => {
			LoadGuild.inst.GetGuildRaidParticipantAll(p_guild_id).then(function (out_members) {
				return Promise.all(out_members.map(row => {
					return row.updateAttributes({ EXIST_YN : false }, { transaction : p_tran });
				}))
				.then(p_ret_update_list => {
					resolve(p_ret_update_list);
				})
				.catch(p_error => { reject([ p_error, 'UpdateRaidParticipant' ]); });
			})
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_guild_id, p_guild_point, p_chapter_id, p_base_stage) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (out_tran) {
				let tran = out_tran;
				// Promise.all GO!
				return Promise.all([
					UpdateRaid(tran, p_guild_id, p_chapter_id, p_base_stage), 
					UpdateGuild(tran, p_guild_id, p_guild_point),
					UpdateRaidParticipant(tran, p_guild_id)
				])
				.then(values => { 
					tran.commit();

					resolve(values);
				})
				.catch(p_error => { 
					if (tran)
						tran.rollback();

					reject(p_error); 
				});
			});	
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레이드 챕터 오픈
	inst.ReqGuildRaidOpen = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqGuildRaidOpen', p_user.uuid, p_recv);

		var recv_guild_id	= parseInt(p_recv.guild_id);
		var recv_chapter_id	= parseInt(p_recv.chapter_id);
		var recv_stage_id 	= parseInt(p_recv.stage_id);

		Promise.all([
			LoadGuild.inst.GetGuild(recv_guild_id),
			LoadGuild.inst.GetGuildRaid(recv_guild_id),
			LoadGuild.inst.GetGuildMember(p_user.uuid)
		])
		.then(values => {
			let guild_data = ( values[0] != null ) ? values[0].dataValues : values[0];
			let raid_data  = ( values[1] != null ) ? values[1].dataValues : values[1];
			let member_data = ( values[2] != null ) ? values[2].dataValues : values[2];

			if ( raid_data != null ) { throw ([ PacketRet.inst.retAlreadyGuildRaidChapterOpen(), '' ]); }
			if ( guild_data == null ) { throw ([ PacketRet.inst.retNotExistGuild(), '' ]); }
			if ( member_data == null ) { throw ([ PacketRet.inst.retNotGuildMember(), p_user.uuid ]); }

			// 길드 레이드 오픈 조건
			// 1. 길드장 가능, 2. 부길마는 옵션 true면 가능, 3. 길드원 불가능
			if ( member_data.GUILD_AUTH == DefineValues.inst.GuildAuthMember )
				throw ([ PacketRet.inst.retNotEnoughAuth(), 'You are guild member' ]);

			if ( member_data.GUILD_AUTH == DefineValues.inst.GuildAuthElder && guild_data.ELDER_RAID_OPEN == false )
				throw ([ PacketRet.inst.retElderOpenRaidFalse(), 'Elder raid open is false' ]);

			// 최대 클리어 쳅터 + 1을 넘을 수 없다. 
			if ( guild_data.MAX_CLEAR_RAID_CHAPTER != 0 ) {
				let able_max_chapter = guild_data.MAX_CLEAR_RAID_CHAPTER + 1;	
				if ( recv_chapter_id > able_max_chapter ) {
					throw ([PacketRet.inst.retFail(), 'Able Over Chapter']);
				}
			}

			var chapter_base = BaseChapter.inst.GetBaseChapter(recv_chapter_id);
			if ( typeof chapter_base === 'undefined' ) {
				throw ([ PacketRet.inst.retFail(), 'Not Find Chapter Info In Base Chapter ID', chapter_id ]);
			}

			if ( guild_data.GUILD_POINT < chapter_base.open_cost ) {
				throw PacketRet.inst.retNotEnoughGuildPoint();
			}

			var base_stage = BaseStage.inst.GetBaseStage(recv_stage_id);
			if ( base_stage == undefined ) {
				throw ([ PacketRet.inst.retFail(), 'Not Find Stage' ]);
			}

			var ret_guild_point = guild_data.GUILD_POINT - chapter_base.open_cost;
			return ProcessTransaction(recv_guild_id, ret_guild_point, recv_chapter_id, base_stage);
		})
		.then(values => {
			let ret_raid	= values[0];
			let ret_guild	= values[1];

			p_ack_packet.guild_point			= ret_guild.dataValues.GUILD_POINT;
			p_ack_packet.guild_raid_chapter_id	= recv_chapter_id;
			p_ack_packet.open_date				= Timer.inst.GetUnixTime(ret_raid.OPEN_DATE);

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;