/********************************************************************
Title : ShopBuyHeroExp
Date : 2016.01.18
Update : 2016.08.02
Desc : 상점 - 영웅 경험치 구매
writer: jongwook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var BaseShopRe = require('../../Data/Base/BaseShopRe.js')
var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqShopBuyHeroExp = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqShopBuyHeroExp -', p_user.uuid, p_recv);

		var recv_item_id = parseInt(p_recv.item_id);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// 구매 아이템 Base 정보 확인
			var hero_exp_item_base = BaseShopRe.inst.GetShopHeroExp(recv_item_id);
			if ( typeof hero_exp_item_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item In Shop Base');
				return;
			}

			// 아이템 레벨 확인
			if ( user_data.USER_LEVEL < hero_exp_item_base.limit_level || (hero_exp_item_base.limit_level == 0) ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughUserLevel());
				return;
			}
			// 아이템 BT 정보
			var item_base = BaseItemRe.inst.GetItem(hero_exp_item_base.item_id);
			if ( typeof item_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item In Base ItemID', hero_exp_item_base.item_id);
				return;
			}

			// 구매 가격 계산
			var need_cash = item_base.buy_cost_cash * parseInt(p_recv.item_count);
			if ( user_data.CASH < need_cash ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Need Cash', need_cash, 'Current Cash', user_data.CASH);
				return;
			}

			// GT_USER update
			p_ret_user.updateAttributes({
				CASH : user_data.CASH - need_cash
			})
			.then(function (p_ret_user_update) {
				var user_update_data = p_ret_user_update.dataValues;
				// console.log('user_update_data', user_update_data);
				p_ack_packet.cash = user_update_data.CASH;

				SendPacketBuyHeroExp(p_user, p_recv, p_ack_cmd, p_ack_packet, hero_exp_item_base.item_id, parseInt(p_recv.item_count, 10));
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopBuyHeroExp - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopBuyHeroExp - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SendPacketBuyHeroExp = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_item_id, p_item_count) {
		// GT_INVENTORY select - 아이템 구매
		GTMgr.inst.GetGTInventory().find({
			where : { UUID : p_user.uuid, ITEM_ID : p_item_id, EXIST_YN : true }
		})
		.then(function (p_ret_inventory) {
			if ( p_ret_inventory == null ) {
				// GT_INVENTORY insert
				GTMgr.inst.GetGTInventory().create({
					UUID : p_user.uuid, ITEM_ID : p_item_id, ITEM_COUNT : p_item_count
				})
				.then(function (p_ret_inventory_create) {
					var inventory_data = p_ret_inventory_create.dataValues;
					// console.log('create item', inventory_data);
					// Send Packet
					p_ack_packet.result_item			= new PacketCommonData.Item();
					p_ack_packet.result_item.iuid		= inventory_data.IUID;
					p_ack_packet.result_item.item_id	= inventory_data.ITEM_ID;
					p_ack_packet.result_item.item_count	= inventory_data.ITEM_COUNT;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_ret_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SendPacketBuyItem - 3');
				});
			} else {
				// GT_INVENTORY update
				p_ret_inventory.updateAttributes({
					ITEM_COUNT : p_ret_inventory.dataValues.ITEM_COUNT + p_item_count
				})
				.then(function (p_ret_inventory_update) {
					var inventory_data = p_ret_inventory_update.dataValues;
					// console.log('update item', inventory_data);
					// Send Packet
					p_ack_packet.result_item			= new PacketCommonData.Item();
					p_ack_packet.result_item.iuid		= inventory_data.IUID;
					p_ack_packet.result_item.item_id	= inventory_data.ITEM_ID;
					p_ack_packet.result_item.item_count	= inventory_data.ITEM_COUNT;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SendPacketBuyItem - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SendPacketBuyItem - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;