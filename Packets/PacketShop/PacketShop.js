/********************************************************************
Title : PacketShop
Date : 2016.01.18
Update : 2016.08.01
Desc : 패킷 정의 - Shop
writer: jongwook
********************************************************************/
var PacketShopData = require('./PacketShopData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Shop packet command init ****');

		fp.readFile('./Packets/PacketShop/PacketShopCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};
	
	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqShopIDs = function () { return packet_cmd.Req.ShopIDs; }
	inst.cmdAckShopIDs = function () { return packet_cmd.Ack.ShopIDs; }
	inst.cmdReqShopBuy = function () { return packet_cmd.Req.ShopBuy; }
	inst.cmdAckShopBuy = function () { return packet_cmd.Ack.ShopBuy; }
	inst.cmdReqShopReset = function () { return packet_cmd.Req.ShopReset; }
	inst.cmdAckShopReset = function () { return packet_cmd.Ack.ShopReset; }
	inst.cmdReqShopResetCount = function () { return packet_cmd.Req.ShopResetCount; }
	inst.cmdAckShopResetCount = function () { return packet_cmd.Ack.ShopResetCount; }
	inst.cmdReqRandomShopIsOpen = function () { return packet_cmd.Req.RandomShopIsOpen; }
	inst.cmdAckRandomShopIsOpen = function () { return packet_cmd.Ack.RandomShopIsOpen; }
	inst.cmdReqRandomShopOpen = function () { return packet_cmd.Req.RandomShopOpen; }
	inst.cmdAckRandomShopOpen = function () { return packet_cmd.Ack.RandomShopOpen; }
	inst.cmdReqShopBuyHeroExp = function () { return packet_cmd.Req.BuyHeroExp; }
	inst.cmdAckShopBuyHeroExp = function () { return packet_cmd.Ack.BuyHeroExp; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckShopIDs = function () { return new PacketShopData.AckShopIDs(); }
	inst.GetPacketAckShopBuy = function () { return new PacketShopData.AckShopBuy(); }
	inst.GetPacketAckShopReset = function () { return new PacketShopData.AckShopReset(); }
	inst.GetPacketAckShopResetCount = function () { return new PacketShopData.AckShopResetCount(); }
	inst.GetPacketAckRandomShopIsOpen = function () { return new PacketShopData.AckRandomShopIsOpen(); }
	inst.GetPacketAckRandomShopOpen = function() { return new PacketShopData.AckRandomShopOpen(); }
	inst.GetPacketAckShopBuyHeroExp = function () { return new PacketShopData.AckShopBuyHeroExp(); }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;