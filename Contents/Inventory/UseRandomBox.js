/********************************************************************
Title : UseRandomBox
Date : 2016.02.03
Update : 2017.04.03
Desc : 랜덤 박스 사용
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var RewardMgr = require('../RewardMgr.js');

var LoadGTUser		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTInventory	= require('../../DB/GTLoad/LoadGTInventory.js');

var SetGTUser		= require('../../DB/GTSet/SetGTUser.js');
var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var DefineValues	= require('../../Common/DefineValues.js');

var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');
var BaseRandomBoxRe	= require('../../Data/Base/BaseRandomBoxRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetTransaction = function(p_values, p_reward_list, p_use_count) {
		return new Promise(function (resolve, reject) {
			let ret_user		= p_values[0];
			let ret_inventory	= p_values[1];

			if ( ret_user == null || ret_inventory == null)
				throw ([ PacketRet.inst.retFail(),'user or tower or tower_user is null' ]);

			let random_box;
			let ret_item_count = ret_inventory.dataValues.ITEM_COUNT - p_use_count;
		
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// 1. 랜덤박스 아이템 설정
				SetGTInventory.inst.UpdateItemCount(t, ret_inventory, ret_item_count)
				.then(value => {
					random_box = value;

					// 2. 랜덤박스 아이템 획득
					let reward = RewardMgr.inst.GetReward(p_reward_list);

					// Promise.all GO!
					return Promise.all([
						SetGTUser.inst.SetReward(ret_user, reward.gold, reward.cash, reward.honor_point, reward.alliance_point, reward.challenge_point, reward.stamina, reward.account_exp, t),
						SetGTInventory.inst.SetRewardItemList(ret_user.dataValues.UUID, reward.item_list, t)
					]);
				})
				.then(values => {
					t.commit();

					values.push(random_box);

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
	inst.ReqUseRandomBox = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqUseItem -', p_user.uuid, p_recv);

		var recv_iuid = parseInt(p_recv.iuid);
		var recv_use_count = parseInt(p_recv.use_count);

		if ( recv_use_count <= 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount());
			return;			
		}

		// Promise.all GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTInventory.inst.SelectItemFromIUID(p_user.uuid, recv_iuid)
		])
		.then(values => {
			// console.log('ReqSellItem values', values);
			let ret_user = values[0];
			let ret_inventory = values[1];

			if ( ret_user == null || ret_inventory == null)
				throw ([ PacketRet.inst.retFail(), 'ret_user or ret_inventory is null' ]);

			if ( ret_inventory.dataValues.ITEM_COUNT < recv_use_count )
				throw([ PacketRet.inst.retIncorrectUseCount(), 'Use Count', recv_use_count, 'Current Count', ret_inventory.dataValues.ITEM_COUNT ]);

			let base_item = BaseItemRe.inst.GetItem(ret_inventory.dataValues.ITEM_ID);
			if ( typeof base_item === 'undefined' )
				throw([ PacketRet.inst.retFail(), 'Not Exist Item In Base' ]);

			// RandomBox 카테고리 검사
			if ( base_item.category1 != DefineValues.inst.FirstCategoryConsumption )
				throw([ PacketRet.inst.retFail(), 'Not Match Item Type cate 1 Need Category', DefineValues.inst.FirstCategoryConsumption, 'Item Category', base_item.category1 ]);

			if ( base_item.category2 != DefineValues.inst.SecondCategoryRandomBoxByConsumption)
				throw([ PacketRet.inst.retFail(), 'Not Match Item Type cate 2 Need Category', DefineValues.inst.SecondCategoryRandomBoxByConsumption, 'Item Category', base_item.category2 ]);

			let base_random_box = BaseRandomBoxRe.inst.GetRandomBoxGroup(base_item.item_id);
			if ( typeof base_random_box === 'undefined' )
				throw([ PacketRet.inst.retFail(), 'Not Eixst RandomBox In Base RandomBox ID', base_item.item_id ]);

			let reward_list = [];

			for ( let cnt = 0; cnt < recv_use_count; ++cnt ) {
				let select_box = base_random_box.SelectBox();
				if ( typeof select_box === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Find RandomBox In in Base Random group_id', base_reward_box.randombox_item_id] );

				console.log('select_box', select_box);
				reward_list.push(select_box);
			}

			return SetTransaction(values, reward_list, recv_use_count);
		})
		.then(values => {
			let ret_user = values[0];
			let ret_inventory = values[1];
			let ret_random_box = values[2];

			p_ack_packet.use_item			= new PacketCommonData.Item();
			p_ack_packet.use_item.iuid		= ret_random_box.dataValues.IUID;
			p_ack_packet.use_item.item_id	= ret_random_box.dataValues.ITEM_ID;
			p_ack_packet.use_item.item_count= ret_random_box.dataValues.ITEM_COUNT;

			p_ack_packet.gold			= ret_user.dataValues.GOLD;
			p_ack_packet.cash			= ret_user.dataValues.CASH;
			p_ack_packet.point_honor	= ret_user.dataValues.POINT_HONOR;
			p_ack_packet.point_alliance	= ret_user.dataValues.POINT_ALLIANCE;
			p_ack_packet.point_challenge= ret_user.dataValues.POINT_CHALLENGE;
			
			// 획득 아이템 정보
			ret_inventory.map(row => {
				let reward_item	= new PacketCommonData.Item();
				reward_item.iuid		= row.dataValues.IUID;
				reward_item.item_id		= row.dataValues.ITEM_ID;
				reward_item.item_count	= row.dataValues.ITEM_COUNT;

				p_ack_packet.get_items.push(reward_item);
			});

			if ( p_ack_packet.get_items.length == 0 )
				p_ack_packet.get_items = null;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;