/********************************************************************
Title : TowerBotInfo
Date : 2016.04.08
Update : 2017.03.23
Desc : 무한탑 - 봇 정보
writer: jongwook
********************************************************************/
var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var PacketInfinityTower = require('../../Packets/PacketInfinityTower/PacketInfinityTower.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqTowerBotInfo = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBotInfo', p_user.uuid, p_recv);

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectBattleBotList(p_user.uuid),
			LoadGTTower.inst.SelectBattleBotHeroList(p_user.uuid)
		])
		.then(values => {
			// console.log('values', values);

			let ret_bot_list = values[0];
			let ret_bot_hero_list = values[1];

			// 배틀 봇 기본 정보
			if ( ret_bot_list == null || ret_bot_list.length == 0 ) {
				p_ack_packet.battle_bot_list = null;
			} else {
				for( let cnt in ret_bot_list ) {
					let tower_bot = PacketInfinityTower.inst.GetPacketInfinityTowerBattleBot();
					tower_bot.icon_id	= ret_bot_list[cnt].dataValues.ICON_ID;
					tower_bot.bot_name	= ret_bot_list[cnt].dataValues.BOT_NAME;
					tower_bot.bot_rank	= ret_bot_list[cnt].dataValues.BOT_RANK;

					p_ack_packet.battle_bot_list.push(tower_bot);
				}
			}

			// 배틀 봇 상세 정보
			if ( ret_bot_hero_list == null || ret_bot_hero_list.length == 0 ) {
				p_ack_packet.battle_bot_hero_list = null;
			} else {
				for( let cnt in ret_bot_hero_list ) {
					let battle_bot = PacketInfinityTower.inst.GetPacketInfinityTowerHero();
					battle_bot.hero_id			= ret_bot_hero_list[cnt].dataValues.HERO_ID;
					battle_bot.hero_hp			= ret_bot_hero_list[cnt].dataValues.HP;
					battle_bot.hero_level		= ret_bot_hero_list[cnt].dataValues.HERO_LEVEL;
					battle_bot.promotion_step	= ret_bot_hero_list[cnt].dataValues.REINFORCE_STEP;
					battle_bot.evolution_step	= ret_bot_hero_list[cnt].dataValues.EVOLUTION_STEP;
					battle_bot.slot_num			= ret_bot_hero_list[cnt].dataValues.SLOT_NUM;

					p_ack_packet.battle_bot_hero_list.push(battle_bot);
				}				
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error =>{
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