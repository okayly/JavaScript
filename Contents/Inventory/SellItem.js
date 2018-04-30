/********************************************************************
Title : SellItem
Date : 2016.02.03
Update : 2017.04.03
Desc : 아이템 판매
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTInventory	= require('../../DB/GTLoad/LoadGTInventory.js');

var SetGTUser = require('../../DB/GTSet/SetGTUser.js');
var SetGTInventory = require('../../DB/GTSet/SetGTInventory.js');

var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetTransaction = function(p_values, p_sell_count, p_get_gold) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_inventory = p_values[1];

			let remain_item_count = ret_inventory.dataValues.ITEM_COUNT - p_sell_count;
			let ret_gold = ret_user.dataValues.GOLD + p_get_gold;

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				// console.log('SetTransaction');
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTUser.inst.UpdateUserGold(ret_user, ret_gold, t),
					SetGTInventory.inst.UpdateItemCount(t, ret_inventory, remain_item_count)
				])
				.then(values => {
					// console.log('values', values);
					t.commit();

					resolve(values);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				})
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqSellItem = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqSellItem -', p_user.uuid, p_recv);

		var recv_iuid = parseInt(p_recv.iuid);
		var recv_sell_count = parseInt(p_recv.sell_count);

		// Promise.all GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTInventory.inst.SelectItemFromIUID(p_user.uuid, recv_iuid)
		])
		.then(values =>{
			// console.log('ReqSellItem values', values);
			let ret_user = values[0];
			let ret_inventory = values[1];

			if ( ret_user == null || ret_inventory == null)
				throw ([ PacketRet.inst.retFail(), 'ret_user or ret_inventory is null' ]);
			
			if ( ret_inventory.dataValues.ITEM_COUNT < recv_sell_count || recv_sell_count <= 0 )
				throw ([ PacketRet.inst.retIncorrectUseCount(), 'Sell Count', recv_sell_count, 'Current Count', ret_inventory.dataValues.ITEM_COUNT ]);

			let base_item = BaseItemRe.inst.GetItem(ret_inventory.dataValues.ITEM_ID);
			if ( typeof base_item === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Item In Base' ]);

			if ( base_item.sell_gold == 0 ) 
				throw ([ PacketRet.inst.retNotSellItem(), 'item_id', ret_inventory.dataValues.ITEM_ID ]);

			let get_gold = base_item.sell_gold * recv_sell_count;

			return SetTransaction(values, recv_sell_count, get_gold);
		})
		.then(values => {
			let ret_user = values[0];
			let ret_inventory = values[1];

			p_ack_packet.sell_item				= new PacketCommonData.Item();
			p_ack_packet.sell_item.iuid			= ret_inventory.dataValues.IUID;
			p_ack_packet.sell_item.item_id		= ret_inventory.dataValues.ITEM_ID;
			p_ack_packet.sell_item.item_count	= ret_inventory.dataValues.ITEM_COUNT;

			p_ack_packet.gold					= ret_user.dataValues.GOLD;

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