/********************************************************************
Title : TowerScoreRankInfo
Date : 2016.04.08
Update : 2017.03.23
Desc : 무한탑 - 랭킹 리스트, 상세 정보
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');
var PacketInfinityTower = require('../../Packets/PacketInfinityTower/PacketInfinityTower.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 배틀 스코어 랭킹 리스트
	inst.ReqTowerScoreRankList = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerScoreRankList', p_user.uuid, p_recv);

		var page_num = parseInt(p_recv.page_num);

		// call sp
		mkDB.inst.GetSequelize().query('call sp_select_infinity_tower_ranker_list(?);',
			null,
			{ raw : true, type : 'SELECT' },
			[ page_num ]
		)
		.then(function (p_ret_ranker_list) {
			p_ack_packet.page_num = page_num;

			if (Object.keys(p_ret_ranker_list[0]).length > 0) {
				for ( var cnt in p_ret_ranker_list[0] ) {
					var ranker = new PacketInfinityTower.inst.GetPacketInfinityTowerUser();
					
					ranker.uuid			= p_ret_ranker_list[0][cnt].UUID;
					ranker.bot_rank_id	= p_ret_ranker_list[0][cnt].BOT_RANK_ID;
					ranker.user_level	= p_ret_ranker_list[0][cnt].USER_LEVEL;
					ranker.user_rank	= p_ret_ranker_list[0][cnt].ORDER_RANK;
					ranker.user_nick	= p_ret_ranker_list[0][cnt].NICK;
					ranker.user_icon	= p_ret_ranker_list[0][cnt].ICON;
					ranker.alliance_name= 'pocatcom'; // TODO : 길드 시스템 추가시 변경.
					ranker.max_floor	= p_ret_ranker_list[0][cnt].LAST_FLOOR;
					ranker.battle_score	= p_ret_ranker_list[0][cnt].LAST_RANK_SCORE;					

					p_ack_packet.score_rank_list.push(ranker);
				}
			} else {
				p_ack_packet.score_rank_list = null;
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerScoreRankList');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 배틀 랭커 상세 정보
	inst.ReqTowerRankerDetailInfo = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerRankerDetailInfo', p_user.uuid, p_recv);

		var uuid = parseInt(p_recv.uuid);

		// GT_INFINITY_TOWER_TEAM select
		GTMgr.inst.GetGTInfinityTowerTeam().find({
			where : { UUID : uuid, EXIST_YN : true }
		})
		.then(function (p_ret_team) {
			// console.log('p_ret_team', p_ret_team);
			if ( p_ret_team != null ) {
				for ( var cnt = 0; cnt < DefineValues.inst.MaxTeamSlot; ++ cnt ) {
					(function (cnt) {
						var column	= cnt + 1;

						var match_hero = new PacketCommonData.MatchHero();
						match_hero.hero_id = p_ret_team.dataValues['HERO_ID' + column];

						p_ack_packet.slot_hero_list.push(match_hero);
					})(cnt);
				}
			}

			if (p_ack_packet.slot_hero_list.length == 0) {
				p_ack_packet.slot_hero_list = null;
			}

			if (p_ack_packet.tag_slot_hero_list.length == 0) {
				p_ack_packet.tag_slot_hero_list = null;
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerRankerDetailInfo');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;