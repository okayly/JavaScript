/********************************************************************
Title : TowerSecretMaze
Date : 2016.04.01
Update : 2017.04.03
Desc : 무한탑 비밀 미로 - 타입, 리셋, 입장
		비밀 미로 배틀 -> 배틀 입장 클래스 제한이 걸린다.(BT_INFINITY_TOWER_SECRET 테이블)
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var SetGTUser = require('../../DB/GTSet/SetGTUser.js');
var SetGTTower = require('../../DB/GTSet/SetGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 비밀미로 : 비밀미로 타입 저장 1. 배틀, 2. 보물상자, 3. 회복샘
	inst.ReqTowerSecretMazeType = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerSecretMazeType', p_user.uuid, p_recv);

		var recv_floor = parseInt(p_recv.floor);
		var recv_maze_type = parseInt(p_recv.secret_maze_type);
		var recv_battle_id = parseInt(p_recv.secret_maze_battle_id);
		
		var base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		if ( base_tower.floor_type != DefineValues.inst.InfinityTowerSecretMazeFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', recv_floor, 'Floor Type', base_tower.floor_type);
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor),
			LoadGTTower.inst.SelectTowerUser(p_user.uuid),
			LoadGTTower.inst.SelectBattleBotHeroList(p_user.uuid)	// 배틀 상대 정보
		])		
		.then(values => {
			let ret_tower_floor = values[0];
			let ret_tower_user = values[1];
			let ret_bot_list = values[2];

			let battle_type = DefineValues.inst.InfinityTowerBattleLow;
			let battle_reward = base_tower.GetBattleReward(battle_type);
			if ( typeof battle_reward === 'undefined' ) {
				throw ([ PacketRet.inst.retFail(), 'Not Find Battle Reward In Base Floor', floor ]);
			}

			console.log('Reward Ticket : %d, Reward Score : %d', battle_reward.ticket, battle_reward.score);

			return new Promise(function (resolve, reject) {
				// transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					Promise.all([
						SetGTTower.inst.InsertOrUpdateTowerMaze(t, p_user.uuid, ret_tower_floor, recv_floor, base_tower.floor_type, battle_type, battle_reward.ticket, battle_reward.score, base_tower.secret_maze_buff_id_list, recv_maze_type, recv_battle_id),
						SetGTTower.inst.InsertOrUpdateTowerUser(t, p_user.uuid, ret_tower_user, recv_floor),
						SetGTTower.inst.InsertOrUpdateTowerBattleBot(ret_bot_list, p_user.uuid, p_recv.battle_bot_list, t)
					])					
					.then(values => {
						t.commit();

						resolve(values);
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		})
		.then(values => {
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
	var UpdateTowerMazeReset = function(p_t, p_ret_tower, p_maze_type, p_battle_id, p_is_reset) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_FLOOR update
			p_ret_tower.updateAttributes({
				SECRET_MAZE_TYPE		: p_maze_type,
				SECRET_MAZE_BATTLE_ID	: p_battle_id,
				IS_SECRET_MAZE_RESET	: p_is_reset,
				LAST_DATE				: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_tower_update => {
				console.log('UpdateTowerMazeReset', p_ret_tower_update.dataValues.UUID);
				resolve(p_ret_tower_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 비밀미로 : 비밀미로 리셋(설정 값을 update 한다.)
	inst.ReqTowerSecretMazeReset = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerSecretMazeReset', p_user.uuid, p_recv);

		var recv_floor = parseInt(p_recv.floor);
		var recv_maze_type = parseInt(p_recv.secret_maze_type);
		var recv_battle_id = parseInt(p_recv.secret_maze_battle_id);
		
		var base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		if ( base_tower.floor_type != DefineValues.inst.InfinityTowerSecretMazeFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', recv_floor, 'Floor Type', base_tower.floor_type);
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor),
			LoadGTTower.inst.SelectTowerUser(p_user.uuid)
		])
		.then(values =>{
			let ret_user = values[0];
			let ret_tower_floor = values[1];
			let ret_tower_user = values[2];

			if ( ret_user == null || ret_tower_floor == null || ret_tower_user == null ) {
				throw ([ PacketRet.inst.retFail(),'user or tower or tower_user is null' ]);
			}

			// 리셋 상태 검사
			if ( ret_tower_floor.dataValues.IS_SECRET_MAZE_RESET == true ) {
				throw ([ PacketRet.inst.retAlreadyTowerSecretMazeReset(), 'Floor', recv_floor ]);
			}

			// 캐쉬 검사
			let need_cash = DefineValues.inst.InfinityTowerSecretMazeResetCash;
			if ( ret_user.dataValues.CASH < need_cash ) {
				throw([ PacketRet.inst.retNotEnoughCash(), 'Need Cash', need_cash, 'Current Cash', ret_user.dataValues.CASH ]);
			}

			let is_reset = true;
			let ret_cash = ret_user.dataValues.CASH - need_cash;

			return new Promise(function (resolve, reject) {
				// transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					// Promise.all GO!
					Promise.all([
						SetGTUser.inst.UpdateUserCash(t, ret_user, ret_cash),
						UpdateTowerMazeReset(t, ret_tower_floor, recv_maze_type, recv_battle_id, is_reset),
						SetGTTower.inst.InsertOrUpdateTowerUser(t, p_user.uuid, ret_tower_user, recv_floor)
					])
					.then(values => {
						t.commit();

						resolve(values);
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		})
		.then(values => {
			let ret_user = values[0];
			let ret_tower_floor = values[1];

			p_ack_packet.cash = ret_user.dataValues.CASH;
			p_ack_packet.recv_maze_type = ret_tower_floor.dataValues.SECRET_MAZE_TYPE;

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
	var UpdateTowerMazeEntrance = function(p_t, p_ret_tower, is_entrance) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_FLOOR update
			p_ret_tower.updateAttributes({
				IS_SECRET_MAZE_ENTRANCE	: is_entrance,
				LAST_DATE				: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_tower_update => {
				console.log('UpdateTowerMazeEntrance', p_ret_tower_update.dataValues.UUID);
				resolve(p_ret_tower_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 비밀미로 : 비밀미로 입장
	inst.ReqTowerSecretMazeEntrance = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerSecretMazeEntrance', p_user.uuid, p_recv);

		var recv_floor = parseInt(p_recv.floor);
		
		var base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		if ( base_tower.floor_type != DefineValues.inst.InfinityTowerSecretMazeFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', recv_floor, 'Floor Type', base_tower.floor_type);
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor),
			LoadGTTower.inst.SelectTowerUser(p_user.uuid)
		])
		.then(values =>{
			let ret_tower_floor = values[0];
			let ret_tower_user = values[1];

			if ( ret_tower_floor == null || ret_tower_user == null ) {
				throw ([ PacketRet.inst.retFail(),'tower or tower_user is null' ]);
			}

			let is_entrance = true;

			return new Promise(function (resolve, reject) {
				// transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					// Promise.all GO!
					Promise.all([
						UpdateTowerMazeEntrance(t, ret_tower_floor, is_entrance),
						SetGTTower.inst.InsertOrUpdateTowerUser(t, p_user.uuid, ret_tower_user, recv_floor)
					])
					.then(values => {
						t.commit();

						resolve(values);
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		})
		.then(values => {
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