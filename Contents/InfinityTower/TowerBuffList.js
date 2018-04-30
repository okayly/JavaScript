/********************************************************************
Title : TowerBuffList
Date : 2016.04.01
Update : 2017.04.03
Desc : 무한탑 버프 층 - 버프 목록
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var SetGTTower = require('../../DB/GTSet/SetGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

var moment = require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetTransaction = function(p_values, p_uuid, p_floor, p_floor_type, p_buff_list) {
		let ret_tower_user = p_values[0];
		let ret_tower_floor = p_values[1];

		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTTower.inst.InsertOrUpdateTowerUser(t, p_uuid, ret_tower_user, p_floor),
					SetGTTower.inst.SetTowerBuffList(ret_tower_floor, p_uuid, p_floor, p_floor_type, p_buff_list, t)
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
	// 무한탑 버프 저장
	inst.ReqTowerBuffList = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBuffList', p_user.uuid, p_recv);

		var recv_floor = parseInt(p_recv.floor);
		var recv_buff_list = p_recv.buff_id_list;

		var base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerUser(p_user.uuid),
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor)
		])
		.then(values => {
			return SetTransaction(values, p_user.uuid, recv_floor, base_tower.floor_type, recv_buff_list);
		})
		.then(values =>{
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