/********************************************************************
Title : TowerAllClear
Date : 2016.04.08
Update : 2017.03.28
Desc : 무한탑 - 마지막층 클리어
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	var SetTowerAllClear = function(p_ret_tower_user, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_USER update
			return p_ret_tower_user.updateAttributes({ ALL_CLEAR : true }, { transaction : p_t })
			.then(value => { resolve(value); })
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetTransaction = function(p_ret_tower_user) {
		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				SetTowerAllClear(p_ret_tower_user, t)
				.then(value => {
					t.commit();

					resolve(value);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				});
			});
		});
	}

	// 무한탑 클리어
	inst.ReqTowerAllClear = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerAllClear', p_user.uuid, p_recv);

		LoadGTTower.inst.SelectTowerUser(p_user.uuid)
		.then(value => {
			let ret_tower_user = value;

			return SetTransaction(ret_tower_user);
		})
		.then(value => {
			console.log('INFINITY TOWER ALL CLEAR :', ( value.dataValues.ALL_CLEAR == 1 ) ? true : false);
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