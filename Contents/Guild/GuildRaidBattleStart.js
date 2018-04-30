/********************************************************************
Title : GuildRaidBattleStart
Date : 2016.05.12
Update : 2016.02.22 (dongsu)
Desc : 길드 레이드 배틀 시작
writer: jongwook
********************************************************************/
var LoadUser 	= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레이드 배틀 시작
	inst.ReqGuildRaidBattleStart = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqGuildRaidBattleStart', p_user.uuid, p_recv);

		var recv_guild_id 	= parseInt(p_recv.guild_id);
		var recv_chapter_id	= parseInt(p_recv.chapter_id);
		var recv_stage_id	= parseInt(p_recv.stage_id);

		Promise.all([	LoadUser.inst.SelectDaily(p_user.uuid),
				LoadGuild.inst.GetGuildRaid(recv_guild_id)])
		.then(values => {
			let daily_data 	= values[0];
			let raid_data 	= (values[1] != null) ? values[1].dataValues : values[1];

			console.log('확인용 - ', raid_data);

			if ( raid_data == null ) { throw ([PacketRet.inst.retFail(), 'Not Open Raid']); }

			if ( daily_data.dataValues.GUILD_RAID_BATTLE_COUNT <= 0 ) {
				throw ([PacketRet.inst.retNotEnoughGuildRaidBattleCount(), 'retNotEnoughGuildRaidBattleCount']);
			}

			if ( raid_data.CHAPTER_ID != recv_chapter_id ) {
				throw ([PacketRet.inst.retFail(), 'Not Open Chapter']);
			}

			// 3. 진행 스테이지 확인. 
			if ( raid_data.PROGRESS_STAGE_ID != recv_stage_id ) {
				throw ([PacketRet.inst.retFail(), 'Not Open Stage']);
			}

			p_ack_packet.stage_id	= recv_stage_id;
			p_ack_packet.boss_hp	= raid_data.PROGRESS_STAGE_BOSS_HP;

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