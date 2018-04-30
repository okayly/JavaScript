/********************************************************************
Title : GuildRaidInfo
Date : 2016.05.24
Update : 2017.02.21 (dongsu)
Desc : 길드 레이드 기본 정보.
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var LoadGuild = require('../../DB/GTLoad/LoadGTGuild.js');
var LoadUser = require('../../DB/GTLoad/LoadGTUser.js');

var Timer = require('../../Utils/Timer.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	var UpdateRaid = function(p_tran, p_guild_raid) {
		return new Promise((resolve, reject) => {
			p_guild_raid.updateAttributes({
				RAID_STATE : false,
				EXIST_YN : false
			}, { transaction : p_tran })
			.then( p_ret_update => {
				resolve(p_ret_update);
			})
			.catch(p_error => {
				reject(p_error);
			})
		});
	}

	var ProcessTransaction = function(p_value, p_guild_raid) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (transaction) {
				let tran = transaction;

				return UpdateRaid(tran, p_guild_raid)
				.then(p_ret => {
					tran.commit();
					resolve([p_value[0], p_value[1], p_ret]);
				})
				.catch(p_error => { 
					tran.rollback();
					reject(p_error); 
				})
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildRaid = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildRaid -', p_user.uuid, p_recv);

		var recv_guild_id = parseInt(p_recv.guild_id);

		Promise.all([	LoadUser.inst.SelectDaily(p_user.uuid),
				LoadGuild.inst.GetGuild(recv_guild_id),
				LoadGuild.inst.GetGuildRaid(recv_guild_id)])
		.then(values => {

			let guild_raid_info = values[2];
			if ( guild_raid_info != null ) {
				let delta_time = Timer.inst.GetDeltaTime(guild_raid_info.dataValues.OPEN_DATE);
				if ( delta_time >= 604800 ) {
					return ProcessTransaction(values, guild_raid_info);
				}
			}

			return values;
		})
		.then(values => {
			let daily_info 		= values[0].dataValues;
			let guild_info 		= values[1].dataValues;
			let guild_raid_info 	= (values[2] != null) ?  values[2].dataValues : values[2];

			p_ack_packet.max_clear_raid_chapter 	= guild_info.MAX_CLEAR_RAID_CHAPTER;
			p_ack_packet.max_clear_raid_date 	= guild_info.MAX_CLEAR_RAID_DATE;
			p_ack_packet.current_raid_chapter_id 	= 0;
			p_ack_packet.current_raid_stage_id 	= 0;
			p_ack_packet.current_raid_boss_hp 	= 0;
			p_ack_packet.raid_open_date 		= 0;
			p_ack_packet.raid_state  			= false;

			if ( guild_raid_info != null && guild_raid_info.RAID_STATE == true ) {

				p_ack_packet.current_raid_chapter_id 	= guild_raid_info.CHAPTER_ID;
				p_ack_packet.current_raid_stage_id 	= guild_raid_info.PROGRESS_STAGE_ID;
				p_ack_packet.current_raid_boss_hp 	= guild_raid_info.PROGRESS_STAGE_BOSS_HP;
				p_ack_packet.raid_state 			= true;
				p_ack_packet.raid_open_date 		= Timer.inst.GetUnixTime(guild_raid_info.OPEN_DATE);	
			}
			
			p_ack_packet.raid_daily_join_count 	= daily_info.GUILD_RAID_BATTLE_COUNT;

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