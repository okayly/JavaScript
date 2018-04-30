/********************************************************************
Title : TowerRewardFloor
Date : 2016.04.01
Update : 2017.04.03
Desc : 무한탑 보상 층 - 보상 상자, 캐쉬 추가 보상 상자(랜덤 박스)
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var RewardMgr = require('../RewardMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var SetGTUser = require('../../DB/GTSet/SetGTUser.js');
var SetGTTower = require('../../DB/GTSet/SetGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseRandomBoxRe	= require('../../Data/Base/BaseRandomBoxRe.js');
var BaseTower		= require('../../Data/Base/BaseTower.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetTransactionRewardBox = function(p_values, p_uuid, p_floor, p_floor_type, p_reward_box_list) {
		let ret_tower_floor = p_values[0];
		let ret_tower_user = p_values[1];
		
		// 무한탑 일일 초기화 할때 이 값들 모두 false로 해줘야 할듯
		if ( ret_tower_floor != null && ret_tower_floor.dataValues.IS_REWARD_BOX_OPEN == true ) {
			// 이미 보상 받은 처리 해야 한다.
		}

		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				Promise.all([
					SetGTTower.inst.SetTowerReward(ret_tower_floor, p_uuid, p_floor, p_floor_type, p_reward_box_list, t),
					SetGTTower.inst.InsertOrUpdateTowerUser(t, p_uuid, ret_tower_user, p_floor)
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
	
	// 무한탑 보물상자 : 비밀미로 보물상자도 같은 패킷 사용
	inst.ReqTowerRewardBox = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerRewardBox', p_user.uuid, p_recv);

		var recv_floor = parseInt(p_recv.floor);

		var base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		if ( base_tower.floor_type != DefineValues.inst.InfinityTowerRewardBoxFloor && base_tower.floor_type != DefineValues.inst.InfinityTowerSecretMazeFloor) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', recv_floor, 'Floor Type', base_tower.floor_type);
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor),
			LoadGTTower.inst.SelectTowerUser(p_user.uuid)
		])		
		.then(values => {
			let ret_tower_floor = values[0];
			let ret_tower_user = values[1];

			return SetTransactionRewardBox(values, p_user.uuid, recv_floor, base_tower.floor_type, base_tower.reward_box_list);
		})
		.then(values => {
			let ret_tower_floor = values[0];

			RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, base_tower.reward_box_list);
		})
		.catch(p_error =>{
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetTransactionCash = function(p_values, p_uuid, p_floor) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_tower_floor = p_values[1];
			let ret_tower_user = p_values[2];

			if ( ret_user == null || ret_tower_floor == null || ret_tower_user == null )
				throw ([ PacketRet.inst.retFail(),'user or tower or tower_user is null' ]);

			if ( ret_tower_floor.dataValues.CASH_REWARD_BOX_COUNT >= ret_tower_floor.dataValues.MAX_CASH_REWARD_BOX_COUNT )
				throw ([ PacketRet.inst.retNotEnoughTowerCashRewardBoxCount(), 'Floor', p_floor, 'Current Cash Reward Box Count', ret_tower_floor.dataValues.CASH_REWARD_BOX_COUNT, 'Max Cash Reward Box Count', ret_tower_floor.dataValues.MAX_CASH_REWARD_BOX_COUNT ]);

			let ret_buy_count = ret_tower_floor.dataValues.CASH_REWARD_BOX_COUNT + 1;

			let base_reward_box = BaseTower.inst.GetCashRewardBox(ret_buy_count);
			if ( typeof base_reward_box === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Find Cash Reward Box In Base Floor', p_floor, 'Buy Count', ret_buy_count ]);

			console.log('base_reward_box', base_reward_box);

			// 캐쉬 설정
			if ( ret_user.dataValues.CASH < base_reward_box.need_cash )
				throw ([ PacketRet.inst.retNotEnoughCash(), 'Need Cash', base_reward_box.need_cash, 'Current Cash', ret_user.dataValues.CASH ]);

			let ret_cash = ret_user.dataValues.CASH - base_reward_box.need_cash;

			// 캐쉬 감소 하고 카운터 증가 하고 랜덤박스 사용되야 됨.
			let random_box_group = BaseRandomBoxRe.inst.GetRandomBoxGroup(base_reward_box.randombox_item_id);
			if ( typeof random_box_group === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Find RandomBoxGroup in Base Randombox group_id', base_reward_box.randombox_item_id ]);

			let select_box = random_box_group.SelectBox();
			if ( typeof select_box === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Find RandomBox In in Base Random group_id', base_reward_box.randombox_item_id] );

			console.log('select_box', select_box);
		
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTUser.inst.UpdateUserCash(t, ret_user, ret_cash),
					SetGTTower.inst.SetTowerCashReward(ret_tower_floor, ret_buy_count, t),
					SetGTTower.inst.InsertOrUpdateTowerUser(t, p_uuid, ret_tower_user, p_floor)
				])
				.then(values => {
					t.commit();

					// 리턴 값에 보상 추가
					values.push(select_box);

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
	// 무한탑 보물상자(캐쉬) - 랜덤 상자 로직
	inst.ReqTowerRewardBoxByCash = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerRewardBoxByCash', p_user.uuid, p_recv);

		var recv_floor = parseInt(p_recv.floor);

		// 보물상자 각 층에서 최대 10번 구매 가능
		var base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		if ( base_tower.floor_type != DefineValues.inst.InfinityTowerRewardBoxFloor ) {
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
			return SetTransactionCash(values, p_user.uuid, recv_floor);
		})
		.then(values => {
			let ret_user = values[0];
			let ret_tower_floor = values[1];
			let ret_tower_user = values[2];
			let select_box = values[3];

			p_ack_packet.cash = ret_user.dataValues.CASH;
			p_ack_packet.buy_count = ret_tower_floor.dataValues.CASH_REWARD_BOX_COUNT;

			let reward_list = [];
			reward_list.push(select_box);

			RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, reward_list);
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