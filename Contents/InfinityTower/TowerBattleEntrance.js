/********************************************************************
Title : TowerBattleEntrance
Date : 2016.04.22
Update : 2017.04.03
Desc : 무한탑 배틀 층 - 입장
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var SetGTTower = require('../../DB/GTSet/SetGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var InsertOrUpdateTowerFloor = function(p_t, p_ret_tower, p_uuid, p_floor, p_floor_type, p_battle_type) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_tower == null ) {
				// GT_INFINITY_TOWER_FLOOR insert
				GTMgr.inst.GetGTInfinityTowerFloor().create({
					UUID			: p_uuid,
					FLOOR			: p_floor,
					FLOOR_TYPE		: p_floor_type,
					BATTLE_TYPE		: p_battle_type,
					LAST_DATE		: Timer.inst.GetNowByStrDate(),
					REG_DATE		: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_insert => {
					console.log('InsertOrUpdateTowerFloor insert', p_uuid);
					resolve(p_ret_tower_insert);
				})
				.catch(p_error => { reject(p_error); });
			} else {
				// GT_INFINITY_TOWER_FLOOR update
				p_ret_tower.updateAttributes({
					UUID			: p_uuid,
					FLOOR			: p_floor,
					FLOOR_TYPE		: p_floor_type,
					BATTLE_TYPE		: p_battle_type,
					LAST_DATE		: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_update => {
					console.log('InsertOrUpdateTowerFloor update', p_uuid);
					resolve(p_ret_tower_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_uuid, p_floor, p_floor_type, p_battle_type, p_bot_list) {
		// console.log('p_values', p_values);
		let ret_tower_user = p_values[0];
		let ret_tower_floor = p_values[1];
		let ret_bot_list = p_values[2];
			
		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				let ticket = 0;
				let score = 0;
				let challenge_point = 0;

				// Promise.all GO!
				Promise.all([
					SetGTTower.inst.InsertOrUpdateTowerUser(t, p_uuid, ret_tower_user, p_floor),
					InsertOrUpdateTowerFloor(t, ret_tower_floor, p_uuid, p_floor, p_floor_type, p_battle_type),
					SetGTTower.inst.InsertOrUpdateTowerBattleBot(ret_bot_list, p_uuid, p_bot_list, t)
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
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 배틀 층 입장
	inst.ReqTowerBattleEntrance = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBattleEntrance', p_user.uuid, p_recv);

		let recv_floor = parseInt(p_recv.floor);
		let recv_battle_type = parseInt(p_recv.battle_type);

		// battle_type 0:선택 안함, 1:하급, 2:중급, 3:상급, 4:강적
		// 강적은 보상이 추가로 있다.
		let base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		if ( base_tower.floor_type != DefineValues.inst.InfinityTowerBattleFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', recv_floor, 'Floor Type', base_tower.floor_type);
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerUser(p_user.uuid),
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor),
			LoadGTTower.inst.SelectBattleBotList(p_user.uuid)
		])
		.then(values => {
			return ProcessTransaction(values, p_user.uuid, recv_floor, base_tower.floor_type, recv_battle_type, p_recv.battle_bot_list);
		})
		.then(values => {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
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