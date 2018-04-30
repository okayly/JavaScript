/********************************************************************
Title : TowerClearInfo
Date : 2016.04.08
Update : 2016.08.18
Desc : 무한탑 - 클리어 정보
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketInfinityTower = require('../../Packets/PacketInfinityTower/PacketInfinityTower.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 전날 배틀 정보
	inst.ReqTowerClearInfo = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerClearInfo', p_user.uuid, p_recv);

		// GT_INFINITY_TOWER_USER select - 전날 올라간 층수 확인
		GTMgr.inst.GetGTInfinityTowerUser().find({
			where: { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_tower_user) {
			// console.log('p_ret_tower_user', p_ret_tower_user);
			if ( p_ret_tower_user == null ) {
				p_ack_packet.past_battle_clear_list = null;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			} else {
				// GT_INFINITY_TOWER_FLOOR select
				GTMgr.inst.GetGTInfinityTowerFloor().findAll({
					where : { UUID : p_user.uuid, FLOOR : { lte : p_ret_tower_user.LAST_FLOOR }, EXIST_YN : true }
				})
				.then(function (p_ret_floor) {
					// console.log('p_ret_floor', p_ret_floor);
					for ( var cnt in p_ret_floor ) {
						var floor_data = p_ret_floor[cnt].dataValues;

						if ( floor_data.FLOOR_TYPE == DefineValues.inst.InfinityTowerBattleFloor && floor_data.BATTLE_CLEAR_GRADE != 0 ) {
							var battle_clear = PacketInfinityTower.inst.GetPacketInfinityTowerBattleClear();

							battle_clear.floor		= floor_data.FLOOR;
							battle_clear.battle_type= floor_data.BATTLE_TYPE;
							battle_clear.clear_grade= floor_data.BATTLE_CLEAR_GRADE;

							p_ack_packet.past_battle_clear_list.push(battle_clear);
						}
					}

					if (p_ack_packet.past_battle_clear_list.length == 0) {
						p_ack_packet.past_battle_clear_list = null;
					}
					
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerClearInfo - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerClearInfo - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;