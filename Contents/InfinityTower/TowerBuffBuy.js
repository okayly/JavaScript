/********************************************************************
Title : TowerBuffBuy
Date : 2016.04.01
Update : 2017.04.03
Desc : 무한탑 버프 층 - 구매
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var SetGTTower = require('../../DB/GTSet/SetGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

var moment = require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var UpdateTowerUserTicket = function(p_ret_tower_user, p_ticket, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_USER update
			p_ret_tower_user.updateAttributes({
				TODAY_TICKET: p_ticket,
				LAST_DATE	: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_tower_user_update => {
				console.log('SetTowerUserTicket update', p_ret_tower_user_update.dataValues.UUID);
				resolve(p_ret_tower_user_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_uuid, p_floor_type, p_buff_list, p_slot_id, p_hero_list) {
		let ret_tower_user = p_values[0];
		let ret_tower_floor = p_values[1];

		// 티켓 검사
		if ( ret_tower_user.dataValues.TODAY_TICKET < p_buff_list.need_ticket )
			throw ([ PacketRet.inst.retNotEnoughTowerTicket(), 'Need Ticket', p_buff_list.need_ticket, 'Current Ticket', ret_tower_user.dataValues.TODAY_TICKET ]);

		let ticket = ret_tower_user.dataValues.TODAY_TICKET - p_buff_list.need_ticket;

		// 비밀미로 버프 구매는 한번 밖에 할 수 없다.
		if ( p_floor_type == DefineValues.inst.InfinityTowerSecretMazeFloor &&
			( ret_tower_floor.dataValues.BUY_BUFF_ID_1 != 0 || ret_tower_floor.dataValues.BUY_BUFF_ID_2 != 0 || ret_tower_floor.dataValues.BUY_BUFF_ID_3 != 0 )) {
			throw ([ PacketRet.inst.retAlreadyTowerBuyBuff() ]);
		}

		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					UpdateTowerUserTicket(ret_tower_user, ticket, t),
					SetGTTower.inst.SetTowerBuyBuff(ret_tower_floor, p_slot_id, t),
					SetGTTower.inst.SetTowerBattleHero(p_uuid, p_hero_list, t)
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
	// 무한탑 버프 구매 : 강적 배틀, 버프 상점, 비밀미로 회복샘 같이 써보자
	inst.ReqBuyTowerBuff = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBuyTowerBuff', p_user.uuid, p_recv);

		let recv_floor	= parseInt(p_recv.floor);
		let recv_slot_id= parseInt(p_recv.slot_id);
		let recv_buff_id= parseInt(p_recv.buff_id);

		let tower_base = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof tower_base === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		if ( tower_base.floor_type == DefineValues.inst.InfinityTowerRewardBoxFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', recv_floor, 'Floor Type', tower_base.floor_type);
			return;
		}

		let buff_list = BaseTower.inst.GetBuffList(recv_buff_id);
		if ( typeof buff_list === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Buff Info In Base Buff ID', recv_buff_id);
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerUser(p_user.uuid),
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor)
		])
		.then(values => {
			return ProcessTransaction(values, p_user.uuid, recv_floor, buff_list, recv_slot_id, p_recv.recovery_hero_list);
		})
		.then(values => {
			let ret_tower_user = values[0];
			let ret_tower_buff = values[1];

			p_ack_packet.ticket = ret_tower_user.dataValues.TODAY_TICKET;
			p_ack_packet.slot_id = recv_slot_id;

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