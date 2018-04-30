/********************************************************************
Title : GuildRaidRank
Date : 2016.05.17
Update : 2016.08.16
Desc : 길드 레이드 데미지 랭크
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	var ChapterRank = function(p_user, p_guild_id, p_ack_cmd, p_ack_packet) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().query('select sum(A.DAMAGE) as DAMAGE \
									, B.NICK as NICK \
									, B.USER_LEVEL as USER_LEVEL \
									, B.ICON as ICON \
									from GT_GUILD_RAID_PARTICIPANTs as A \
									left join GT_USERs as B on A.UUID = B.UUID \
								where A.GUILD_ID = ? and A.EXIST_YN = true \
								group by A.UUID',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_guild_id ]
			)
			.then(p_rets => {
				
				p_rets.map(ret => {
					var ranker = new PacketCommonData.GuildRaidRank();
					ranker.user_nick 	= ret.NICK;
					ranker.user_level 	= ret.USER_LEVEL;
					ranker.user_icon 	= ret.ICON;
					ranker.damage 	= ret.DAMAGE;

					p_ack_packet.ranker_list.push(ranker);
				})

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(p_error => {
				if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
			})
		});
	}

	var StageRank = function(p_user, p_guild_id, p_stage_id, p_ack_cmd, p_ack_packet) {
		console.log('확인용. - ', p_guild_id, ' * ', p_stage_id);

		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().query('select sum(A.DAMAGE) as DAMAGE \
									, B.NICK as NICK \
									, B.USER_LEVEL as USER_LEVEL \
									, B.ICON as ICON \
									from GT_GUILD_RAID_PARTICIPANTs as A \
									left join GT_USERs as B on A.UUID = B.UUID \
								where A.GUILD_ID = ? and A.STAGE_ID = ? and A.EXIST_YN = true \
								group by A.UUID',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_guild_id, p_stage_id ]
			)
			.then(p_rets => {
				p_rets.map(ret => {
					
					var ranker = new PacketCommonData.GuildRaidRank();
					ranker.user_nick 	= ret.NICK;
					ranker.user_level 	= ret.USER_LEVEL;
					ranker.user_icon 	= ret.ICON;
					ranker.damage 	= ret.DAMAGE;

					p_ack_packet.ranker_list.push(ranker);
				})

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(p_error => {
				if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
			})
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레이드 스테이지 데미지 랭크
	inst.ReqGuildRaidRank = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildRaidRank -', p_user.uuid, p_recv);

		var recv_guild_id 	= parseInt(p_recv.guild_id);
		var recv_rank_type 	= parseInt(p_recv.rank_type);
		var recv_stage_id 	= parseInt(p_recv.stage_id);

		p_ack_packet.rank_type = recv_rank_type;
		if ( recv_rank_type == 0 ) {
			ChapterRank(p_user, recv_guild_id, p_ack_cmd, p_ack_packet);
		}
		else {
			StageRank(p_user, recv_guild_id, recv_stage_id, p_ack_cmd, p_ack_packet);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;