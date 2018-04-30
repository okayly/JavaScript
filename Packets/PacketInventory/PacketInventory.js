/********************************************************************
Title : PacketInventory
Date : 2016.02.03
Desc : 패킷 정의 - 가방
writer: jongwook
********************************************************************/
var PacketInventoryData = require('./PacketInventoryData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Inventory packet command init ****');

		fp.readFile('./Packets/PacketInventory/PacketInventoryCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqUseItem = function () { return packet_cmd.Req.UseItem; }
	inst.cmdAckUseItem = function () { return packet_cmd.Ack.UseItem; }

	inst.cmdReqSellItem = function () { return packet_cmd.Req.SellItem; }
	inst.cmdAckSellItem = function () { return packet_cmd.Ack.SellItem; }

	inst.cmdReqUseRandomBox = function () { return packet_cmd.Req.UseRandomBox; }
	inst.cmdAckUseRandomBox = function () { return packet_cmd.Ack.UseRandomBox; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckUseItem = function () { return new PacketInventoryData.AckUseItem(); }
	inst.GetPacketAckSellItem = function () { return new PacketInventoryData.AckSellItem(); }
	inst.GetPacketAckUseRandomBox = function () { return new PacketInventoryData.AckUseRandomBox(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;