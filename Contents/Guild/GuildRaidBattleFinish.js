/********************************************************************
Title : GuildRaidBattleFinish
Date : 2016.05.12
Update : 2017.02.22 (dongsu)
Desc : 길드 레이드 배틀 종료
writer: jongwook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var Timer	= require('../../Utils/Timer.js');

var LoadUser 	= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGuild = require('../../DB/GTLoad/LoadGTGuild.js');
var MailMgr	= require('../Mail/MailMgr.js');

var BaseStage 	= require('../../Data/Base/BaseStage.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 참여 횟수 증가.
	var UpdateRaidEntryCount = function(p_tran, p_uuid) {
		return new Promise((resolve, reject) => {
			LoadUser.inst.SelectDaily(p_uuid)
			.then(function (out_daily) {

				let ret_battle_count = out_daily.dataValues.GUILD_RAID_BATTLE_COUNT - 1;

				out_daily.updateAttributes({
					GUILD_RAID_BATTLE_COUNT : ret_battle_count
				}, { transaction : p_tran })
				.then(p_ret_update => { resolve(p_ret_update); })
				.catch(p_error => { reject([p_error, 'UpdateRaidEntryCount - 2']); })
			})
			.catch(p_error => { reject([p_error, 'UpdateRaidEntryCount - 1']); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 데미지 상승.
	var UpdateRaidDamage = function(p_tran, p_uuid, p_guild_id, p_chapter_id, p_stage_id, p_damage) {
		return new Promise((resolve, reject) => {
			LoadGuild.inst.GetGuildRaidParticipant(p_uuid, p_guild_id, p_chapter_id, p_stage_id)
			.then(function (out_participant) {
				if ( out_participant == null ) {
					GTMgr.inst.GetGTGuildRaidParicipant().create({
						GUILD_ID : p_guild_id,
						CHAPTER_ID : p_chapter_id,
						STAGE_ID : p_stage_id,
						UUID : p_uuid,
						DAMAGE : p_damage
					}, { transaction : p_tran })
					.then(p_ret_create => { resolve(p_ret_create); })
					.catch(p_error => { reject([p_error, 'UpdateRaidDamage - 3']); })
				}
				else {
					let ret_damage = out_participant.dataValues.DAMAGE + p_damage;
					out_participant.updateAttributes({
						DAMAGE : ret_damage
					}, { transaction : p_tran })
					.then(p_ret_update => { resolve(p_ret_update); })
					.catch(p_error => { reject([p_error, 'UpdateRaidDamage - 2']); })
				}
			})
			.catch(p_error => { reject([p_error, 'UpdateRaidDamage - 1']); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 레이드 정보 업데이트.
	var UpdateRaid = function(p_tran, p_guild_id,  p_chapter_id, p_stage_id, p_boss_hp) {
		// console.log('확인용 - UpdateRaid : 길드 아이디 : %d, 쳅터 : %d, 스테이지 : %d, 보스 : %d', p_guild_id,  p_chapter_id, p_stage_id, p_boss_hp);
		return new Promise((resolve, reject) => {
			LoadGuild.inst.GetGuildRaid(p_guild_id)
			.then(function (out_raid) {
				var raid_data = out_raid.dataValues;
				if ( p_boss_hp <= 0 ) {

					var base_stage = BaseStage.inst.GetBaseStage(raid_data.PROGRESS_STAGE_ID);
					if ( base_stage == undefined ) {
						throw ([ PacketRet.inst.retFail(), 'Not Find Stage']);
					}
					
					if ( base_stage.next_stage_id != 0) {
						var next_base_stage = BaseStage.inst.GetBaseStage(base_stage.next_stage_id);
						if ( next_base_stage == undefined ) {
							throw ([ PacketRet.inst.retFail(), 'Not Find Next Stage']);
						}

						// 1. 다음 스테이지가 있다.	
						out_raid.updateAttributes({
							PROGRESS_STAGE_ID : next_base_stage.stage_id,
							PROGRESS_STAGE_BOSS_HP : next_base_stage.boss_hp
						}, { transaction : p_tran })
						.then(p_ret_update => {
							resolve(p_ret_update);
						})
						.catch(p_error => { reject([p_error, 'UpdateRaid - 3-2']); })
					}
					else {
						// 2. 다음 스테이지가 없다. 	
						out_raid.updateAttributes({
							PROGRESS_STAGE_BOSS_HP : 0,
							RAID_STATE : false,
							EXIST_YN : false,
						}, { transaction : p_tran })
						.then(p_ret_update => {
							resolve(p_ret_update);
						})
						.catch(p_error => { reject([p_error, 'UpdateRaid - 3-1']); })
					}
				}
				else {
					out_raid.updateAttributes({
						PROGRESS_STAGE_BOSS_HP : p_boss_hp
					}, { transaction : p_tran })
					.then(p_ret_update => { resolve(p_ret_update); })
					.catch(p_error => { reject([p_error, 'UpdateRaid - 2']); })
				}
			})
			.catch(p_error => { reject([p_error, 'UpdateRaid - 1']); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateGuild = function(p_tran, p_guild_id, p_chapter_id, p_open_date) {
		return new Promise((resolve, reject) => {
			LoadGuild.inst.GetGuild(p_guild_id)
			.then(function (out_guild) {
				let max_clear_chapter = out_guild.dataValues.MAX_CLEAR_RAID_CHAPTER;
				console.log('확인용 - current_max_chapter : %d, input_max_chapter : %d', max_clear_chapter, p_chapter_id);

				let now_date 	= Timer.inst.GetNowByStrDate();
				let delta_date 	= Timer.inst.GetUnixTime(now_date) - Timer.inst.GetUnixTime(p_open_date);

				if ( max_clear_chapter < p_chapter_id ) {

					out_guild.updateAttributes({
						MAX_CLEAR_RAID_CHAPTER : p_chapter_id,
						MAX_CLEAR_RAID_DATE : delta_date
					}, { transaction : p_tran })
					.then(p_ret_update => { resolve(p_ret_update); })
					.catch(p_error => { reject([p_error, 'UpdateGuild - 3']); })
				}
				else if ( max_clear_chapter == p_chapter_id && 
					delta_date < out_guild.dataValues.MAX_CLEAR_RAID_DATE ) {

					out_guild.updateAttributes({
						MAX_CLEAR_RAID_DATE : delta_date
					}, { transaction : p_tran })
					.then(p_ret_update => { resolve(p_ret_update); })
					.catch(p_error => { reject([p_error, 'UpdateGuild - 2']); })	
				}
				else 
				{
					resolve(out_guild);
				}
			})
			.catch(p_error => { reject([p_error, 'UpdateGuild - 1']); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetTransaction = function(p_user, p_guild_id, p_chapter_id, p_stage_id, p_damage, p_boss_hp) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (transaction) {
				let tran = transaction;
				return Promise.all([	UpdateRaidEntryCount(tran, p_user.uuid), 
							UpdateRaidDamage(tran, p_user.uuid, p_guild_id, p_chapter_id, p_stage_id, p_damage)])
				.then(values => {
					
					return UpdateRaid(tran, p_guild_id, p_chapter_id, p_stage_id, p_boss_hp)
					.then(function (out_raid) {
						// console.log('확인용 2', out_raid);
						values.push(out_raid);
						
						if ( out_raid.dataValues.RAID_STATE == false ) {
							return UpdateGuild(tran, p_guild_id, p_chapter_id, out_raid.dataValues.OPEN_DATE)
							.then(function (out_guild) {
								tran.commit();	
								resolve(values);
							})
							.catch(p_error => { 
								if ( tran ) { tran.rollback(); }
								reject([p_error, 'SetTransaction - 3']);
							})
						}
						else {
							tran.commit();
							resolve(values);	
						}
					})
					.catch(p_error => { 
						if ( tran ) { tran.rollback(); }
						reject([p_error, 'SetTransaction - 2']);
					});
				})
				.catch(p_error => {
					if ( tran ) { tran.rollback(); }
					reject([p_error, 'SetTransaction - 1']);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레이드 배틀 종료
	inst.ReqGuildRaidBattleFinish = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqGuildRaidBattleFinish', p_user.uuid, p_recv);

		var recv_guild_id		= parseInt(p_recv.guild_id);
		var recv_chapter_id		= parseInt(p_recv.chapter_id);
		var recv_stage_id		= parseInt(p_recv.stage_id);
		var recv_ret_boss_hp	= parseInt(p_recv.ret_boss_hp);
		var recv_attack_damage	= parseInt(p_recv.attack_damage);

		LoadGuild.inst.GetGuildRaid(recv_guild_id) 
		.then(function (out_raid) {
			
			if ( out_raid == null ) { throw ([PacketRet.inst.retFail(), 'Not Find Raid']); }

			return SetTransaction(p_user, recv_guild_id, recv_chapter_id, recv_stage_id, recv_attack_damage, recv_ret_boss_hp);

		}).then(values => {
			
			let entry_count_info 	= values[0];
			let damage_info 	= values[1];
			let raid_info 		= values[2];

			p_ack_packet.stage_id			= recv_stage_id;
			p_ack_packet.accum_damage		= damage_info.DAMAGE;
			p_ack_packet.boss_hp			= recv_ret_boss_hp;
			p_ack_packet.guild_raid_battle_count 	= entry_count_info.GUILD_RAID_BATTLE_COUNT;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

			return raid_info;
		}).then(values => {
			// console.log('확인용 2 - ', values);
			if ( values.dataValues.PROGRESS_STAGE_ID != recv_stage_id ) {
				// 스테이지 종료 보상 전송. 
				MailMgr.inst.SendRaidStageClearReward(p_user, p_ack_cmd, p_ack_packet, recv_guild_id, recv_chapter_id, recv_stage_id);
			}

			// 쳅터 종료 보상. 
			if ( values.dataValues.RAID_STATE == false ) {
				MailMgr.inst.SendRaidStageClearReward(p_user, p_ack_cmd, p_ack_packet, recv_guild_id, recv_chapter_id, recv_stage_id);
				MailMgr.inst.SendRaidChapterClearReward(p_user, p_ack_cmd, p_ack_packet, recv_guild_id, recv_chapter_id);	
			}
			
		}).catch(p_error => {
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