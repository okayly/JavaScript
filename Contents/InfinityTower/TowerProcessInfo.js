/********************************************************************
Title : TowerProcessInfo
Date : 2016.04.08
Update : 2017.03.23
Desc : 무한탑 - 진행 정보
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketInfinityTower = require('../../Packets/PacketInfinityTower/PacketInfinityTower.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var GetTowerFloorList = function(p_uuid, p_today_floor) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_FLOOR select
			GTMgr.inst.GetGTInfinityTowerFloor().findAll({
				where : { UUID : p_uuid, FLOOR : { lte : p_today_floor }, EXIST_YN : true }
			})
			.then(p_ret_floor_list => { resolve(p_ret_floor_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqTowerProcessInfo = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerProcessInfo', p_user.uuid, p_recv);

		LoadGTTower.inst.SelectTowerUser(p_user.uuid)
		.then(value => {
			let tower_user = value;

			return new Promise(function (resolve, reject) {
				if ( tower_user == null ) {
					resolve([ null, null ]);
				} else {
					GetTowerFloorList(p_user.uuid, tower_user.dataValues.TODAY_FLOOR)
					.then(value => { resolve([ tower_user, value ]); })
					.catch(p_error => { reject(p_error); });
				}
			});
		})
		.then(values => {
			// console.log('values', values);
			let ret_tower_user = values[0]
			let ret_floor_list = values[1];

			if ( ret_tower_user == null || ret_floor_list == null || ret_floor_list.length == 0 ) {
				p_ack_packet.floor					= 0;
				p_ack_packet.battle_type			= 0;
				p_ack_packet.battle_clear_grade		= 0;
				p_ack_packet.is_reward_box_open		= false;
				p_ack_packet.cash_reward_box_count	= 0;
				p_ack_packet.is_secret_maze_entrance= false;
				p_ack_packet.secret_maze_type		= 0;
				p_ack_packet.is_secret_maze_reset	= false;
				p_ack_packet.buff_list				= null;
				p_ack_packet.awake_buff				= 0;
				p_ack_packet.all_clear				= false;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			} else {
				// console.log('ret_floor_list', ret_floor_list);
				for ( var cnt in ret_floor_list ) {
					var floor_data = ret_floor_list[cnt].dataValues;
					// Last floor
					if ( floor_data.FLOOR == ret_tower_user.dataValues.TODAY_FLOOR ) {
						// console.log('TODAY_FLOOR', floor_data);
						p_ack_packet.floor					= floor_data.FLOOR;
						p_ack_packet.battle_type			= floor_data.BATTLE_TYPE;
						p_ack_packet.battle_clear_grade		= floor_data.BATTLE_CLEAR_GRADE;
						p_ack_packet.is_reward_box_open		= ( floor_data.IS_REWARD_BOX_OPEN == 1 ) ? true : false;
						p_ack_packet.cash_reward_box_count	= floor_data.CASH_REWARD_BOX_COUNT;
						p_ack_packet.is_secret_maze_entrance= floor_data.IS_SECRET_MAZE_ENTRANCE;
						p_ack_packet.secret_maze_type		= floor_data.SECRET_MAZE_TYPE;
						p_ack_packet.is_secret_maze_reset	= ( floor_data.IS_SECRET_MAZE_RESET == 1 ) ? true : false;
						p_ack_packet.secret_maze_battle_id	= floor_data.SECRET_MAZE_BATTLE_ID;

						if ( floor_data.BATTLE_TYPE == DefineValues.inst.InfinityTowerBattleAwake ) {
							p_ack_packet.awake_buff = PacketInfinityTower.inst.GetPacketInfinityTowerBuff();
							p_ack_packet.awake_buff.floor = floor_data.FLOOR;
							p_ack_packet.awake_buff.buff_list.push(floor_data.BUFF_ID_1);
							p_ack_packet.awake_buff.buff_list.push(floor_data.BUFF_ID_2);
							p_ack_packet.awake_buff.buff_list.push(floor_data.BUFF_ID_3);
							p_ack_packet.awake_buff.buy_buff_list.push(floor_data.BUY_BUFF_ID_1);
							p_ack_packet.awake_buff.buy_buff_list.push(floor_data.BUY_BUFF_ID_2);
							p_ack_packet.awake_buff.buy_buff_list.push(floor_data.BUY_BUFF_ID_3);
						} else {
							p_ack_packet.awake_buff = null;
						}
					}

					// 버프 상점 정보
					if ( floor_data.FLOOR_TYPE == DefineValues.inst.InfinityTowerBuffShopFloor ||
						(floor_data.FLOOR_TYPE == DefineValues.inst.InfinityTowerSecretMazeFloor && 
						 floor_data.SECRET_MAZE_TYPE == DefineValues.inst.InfinityTowerSecretMazeBuffShop) ) {

						var tower_buff = PacketInfinityTower.inst.GetPacketInfinityTowerBuff();
						
						tower_buff.floor = floor_data.FLOOR;
						tower_buff.buff_list.push(floor_data.BUFF_ID_1);
						tower_buff.buff_list.push(floor_data.BUFF_ID_2);
						tower_buff.buff_list.push(floor_data.BUFF_ID_3);
						tower_buff.buy_buff_list.push(floor_data.BUY_BUFF_ID_1);
						tower_buff.buy_buff_list.push(floor_data.BUY_BUFF_ID_2);
						tower_buff.buy_buff_list.push(floor_data.BUY_BUFF_ID_3);

						p_ack_packet.buff_list.push(tower_buff);
					}
				}

				if ( p_ack_packet.buff_list.length == 0 ) {
					p_ack_packet.buff_list = null;
				}

				p_ack_packet.all_clear = ( ret_tower_user.dataValues.ALL_CLEAR == 1 ) ? true : false;
				
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			}
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