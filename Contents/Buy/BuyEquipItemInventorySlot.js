/********************************************************************
Title : BuyEquipItemInventorySlot
Date : 2017.02.07
Update : 2017.03.13
Desc : 장비 아이템 창고수 구매
writer: jongwook
********************************************************************/
var GTMgr		= require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseBuyCount = require('../../Data/Base/BaseBuyCount.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBuyEquipItemInventorySlot = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqBuyEquipItemInventorySlot -', p_user.uuid, p_recv);
		
		let recv_iuid = parseInt(p_recv.iuid);

		var getUser = function() {
			return new Promise(function (resolve, reject) {
				console.log('1. getUser');

				// GT_USER select
				GTMgr.inst.GetGTUser().find({
					where : { UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(p_ret_user => { resolve(p_ret_user); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var checkUser = function(p_ret_user) {
			return new Promise(function (resolve, reject) {
				console.log('2. checkUser');

				if ( p_ret_user == null )
					throw ([ PacketRet.inst.retFail(), 'user == null' ]);

				let user_data = p_ret_user.dataValues;
				
				let ret_buy_count = user_data.BUY_EQUIP_ITEM_INVENTORY_SLOT + 1;

				let base_buy_count = BaseBuyCount.inst.GetBuyCount(ret_buy_count);
				if ( typeof base_buy_count === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist BuyCount Info In Base buy_count', ret_buy_count ]);

				let need_cash = base_buy_count.need_inventory_slot_cash;

				if ( need_cash < 0 )
					throw ([ PacketRet.inst.retFail(), 'No more buy equip item inventory slot', need_cash ]);

				if ( user_data.CASH < need_cash )
					throw ([ PacketRet.inst.retNotEnoughCash(), 'Not Enough Cash need_cash', need_cash, 'user_cash', user_data.CASH ]);

				let ret_cash = user_data.CASH - need_cash;
				let ret_inventory_slot = user_data.MAX_EQUIP_ITEM_INVENTORY_SLOT + base_buy_count.inventory_slot_count;

				resolve([p_ret_user, ret_cash, ret_buy_count, ret_inventory_slot ]);
			});
		}

		var setUser = function(p_ret_user, p_cash, p_buy_count, p_inventory_slot) {
			return new Promise(function (resolve, reject) {
				console.log('setUser', p_buy_count, p_inventory_slot);

				// GT_USER update
				p_ret_user.updateAttributes({ 
					CASH : p_cash,
					BUY_EQUIP_ITEM_INVENTORY_SLOT : p_buy_count,
					MAX_EQUIP_ITEM_INVENTORY_SLOT : p_inventory_slot
				})
				.then(p_ret_user_update => { 
					// console.log('p_ret_user_update', p_ret_user_update);
					resolve(p_ret_user_update);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		// Promise GO!
		getUser()
		.then(p_ret_user => {
			return checkUser(p_ret_user);
		})
		.then(values => {
			return setUser(values[0], values[1], values[2], values[3]);
		})
		.then(p_ret_user => {
			let user_data = p_ret_user.dataValues;

			p_ack_packet.cash							= user_data.CASH;
			p_ack_packet.max_equip_item_inventory_slot	= user_data.MAX_EQUIP_ITEM_INVENTORY_SLOT;
			p_ack_packet.buy_equip_item_inventory_slot	= user_data.BUY_EQUIP_ITEM_INVENTORY_SLOT;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			console.log('error Promise.all', p_error);

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