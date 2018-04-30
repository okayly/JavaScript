/********************************************************************
Title : SellItem
Date : 2016.02.03
Update : 2016.07.21
Desc : 아이템 판매
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqSellItem = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqUseItem -', p_user.uuid, p_recv);

		var recv_iuid = parseInt(p_recv.iuid);
		var sell_count = parseInt(p_recv.sell_count);

		// GT_INVENTORY select
		GTMgr.inst.GetGTInventory().find({
			where : { UUID : p_user.uuid, IUID : recv_iuid, EXIST_YN : true }
		})
		.then(function (p_ret_inventory) {
			if ( p_ret_inventory == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Item In GT_INVENTORY');
				return;
			}

			var inventory_data = p_ret_inventory.dataValues;
			if ( inventory_data.ITEM_COUNT < sell_count || sell_count <= 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount(), 'Sell Count', sell_count, 'Current Count', inventory_data.ITEM_COUNT);
				return;	
			}

			var item_base = BaseItemRe.inst.GetItem(inventory_data.ITEM_ID);
			if ( typeof item_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item In Base');
				return;
			}

			if ( item_base.sell_gold == 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotSellItem());
				return;
			}

			var add_gold = item_base.sell_gold * sell_count;

			// GT_USER select
			GTMgr.inst.GetGTUser().find({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_user) {
				if ( p_ret_user == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
					return;
				}

				var ret_gold = add_gold + p_ret_user.dataValues.GOLD;

				// GT_USER update
				p_ret_user.updateAttributes({
					GOLD : ret_gold
				})
				.then(function (p_ret_user_update) {
					var ret_count = inventory_data.ITEM_COUNT - sell_count;
					var ret_exist = ( ret_count > 0 ) ? true : false;

					// GT_INVENTORY
					p_ret_inventory.updateAttributes({
						ITEM_COUNT : ret_count,
						EXIST_YN : ret_exist
					})
					.then(function (p_update_item) {
						p_ack_packet.sell_item				= new PacketCommonData.Item();
						p_ack_packet.sell_item.iuid			= inventory_data.IUID;
						p_ack_packet.sell_item.item_id		= inventory_data.ITEM_ID;
						p_ack_packet.sell_item.item_count	= ret_count;
						p_ack_packet.gold					= ret_gold;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqSellItem - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqSellItem - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqSellItem - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqSellItem - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;