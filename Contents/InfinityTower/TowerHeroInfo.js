/********************************************************************
Title : TowerHeroInfo
Date : 2016.04.08
Update : 2017.03.23
Desc : 무한탑 정보 - 영웅
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var PacketInfinityTower = require('../../Packets/PacketInfinityTower/PacketInfinityTower.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SelectBattleHeroList = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_HERO select
			GTMgr.inst.GetGTInfinityTowerHero().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_battle_hero_list => { resolve(p_ret_battle_hero_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 정보 영웅
	inst.ReqTowerHeroInfo = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerHeroInfo', p_user.uuid, p_recv);
		
		SelectBattleHeroList(p_user.uuid)
		.then(value => {
			// console.log('value', value, value.length);

			let ret_battle_hero_list = value;			

			if ( ret_battle_hero_list == null || ret_battle_hero_list.length == 0 ) {
				p_ack_packet.hero_list = null;
			} else {
				for(let cnt in ret_battle_hero_list) {
					let battle_hero = PacketInfinityTower.inst.GetPacketInfinityTowerHero();

					battle_hero.hero_id = ret_battle_hero_list[cnt].dataValues.HERO_ID;
					battle_hero.hero_hp = ret_battle_hero_list[cnt].dataValues.HP;

					p_ack_packet.hero_list.push(battle_hero);
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