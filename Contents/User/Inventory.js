/********************************************************************
Title : Inventory
Date : 2016.07.14
update : 2017.02.03
Desc : 로그인 정보 - 가방
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqInventory = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqInventory -', p_user.uuid, p_recv);

		// GT_INVENTORY select
		GTMgr.inst.GetGTInventory().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true },
			order : 'ITEM_ID'
		})
		.then(function (p_ret_inventory) {
			// console.log('확인용 - ', p_ret_inventory);
			for ( var cnt in p_ret_inventory ) {
				var data = p_ret_inventory[cnt].dataValues;

				// console.log('data.CATEGORY1', data.CATEGORY1, DefineValues.inst.FirstCategoryEquipment);

				if ( data.CATEGORY1 != DefineValues.inst.FirstCategoryEquipment ) {
					// Packet
					var packet_item			= new PacketCommonData.Item();
					packet_item.iuid		= data.IUID;
					packet_item.item_id		= data.ITEM_ID;
					packet_item.item_count	= data.ITEM_COUNT;
					p_ack_packet.items.push(packet_item);
				}
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqInventory - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;