/********************************************************************
Title : PacketBuy
Date : 2016.01.14
Desc : 패킷 정의 - Buy
writer: jongwook
********************************************************************/
var PacketBuyData = require('./PacketBuyData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Buy packet command init ****');

		fp.readFile('./Packets/PacketBuy/PacketBuyCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqBuyCash = function () { return packet_cmd.Req.BuyCash; }
	inst.cmdAckBuyCash = function () { return packet_cmd.Ack.BuyCash; }

	inst.cmdReqBuyGold = function () { return packet_cmd.Req.BuyGold; }
	inst.cmdAckBuyGold = function () { return packet_cmd.Ack.BuyGold; }

	inst.cmdReqBuyStamina = function () { return packet_cmd.Req.BuyStamina; }
	inst.cmdAckBuyStamina = function () { return packet_cmd.Ack.BuyStamina; }
	
	inst.cmdReqBuySkillPoint = function () { return packet_cmd.Req.BuySkillPoint; }
	inst.cmdAckBuySkillPoint = function () { return packet_cmd.Ack.BuySkillPoint; }

	inst.cmdReqProphecySpringAbleCount = function () { return packet_cmd.Req.BuyProphecySpringAbleCount; }
	inst.cmdAckProphecySpringAbleCount = function () { return packet_cmd.Ack.BuyProphecySpringAbleCount; }

	inst.cmdReqBuyEquipItemInventorySlot = function () { return packet_cmd.Req.BuyEquipItemInventorySlot; }
	inst.cmdAckBuyEquipItemInventorySlot = function () { return packet_cmd.Ack.BuyEquipItemInventorySlot; }

	inst.cmdReqBuyPvpAbleCount = function () { return packet_cmd.Req.BuyPvpAbleCount; }
	inst.cmdAckBuyPvpAbleCount = function () { return packet_cmd.Ack.BuyPvpAbleCount; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckBuyCash		= function () { return new PacketBuyData.AckBuyCash(); }
	inst.GetPacketAckBuyGold		= function () { return new PacketBuyData.AckBuyGold(); }
	inst.GetPacketAckBuyStamina		= function () { return new PacketBuyData.AckBuyStamina(); }
	inst.GetPacketAckBuySkillPoint	= function () { return new PacketBuyData.AckBuySkillPoint(); }
	inst.GetPacketAckBuyProphecySpringAbleCount	= function () { return new PacketBuyData.AckBuyProphecySpringAbleCount(); }
	inst.GetPacketAckBuyEquipItemInventorySlot	= function () { return new PacketBuyData.AckBuyEquipItemInventorySlot(); }
	inst.GetPacketAckBuyPvpAbleCount	= function () { return new PacketBuyData.AckBuyPvpAbleCount(); }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;