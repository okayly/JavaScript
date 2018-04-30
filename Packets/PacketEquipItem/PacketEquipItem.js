/********************************************************************
Title : Packet EquipItem
Date : 2016.01.05
Update : 2017.04.03
Desc : 패킷 정의 - 장착 아이템
writer: jongwook
********************************************************************/
var PacketEquipItemData = require('./PacketEquipItemData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** EquipItem packet command init ****');

		fp.readFile('./Packets/PacketEquipItem/PacketEquipItemCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	inst.SetResultCode = function(p_ret_code) { ret_code = p_ret_code; }

	//-----------------------------------------------------------------------------------------------------------
	// Equipment
	inst.cmdReqEquipment = function() { return packet_cmd.Req.Equipment; }
	inst.cmdAckEquipment = function() { return packet_cmd.Ack.Equipment; }
	
	inst.cmdReqEquipItem = function() { return packet_cmd.Req.EquipItem; }
	inst.cmdAckEquipItem = function() { return packet_cmd.Ack.EquipItem; }

	inst.cmdReqEquipItemOne = function() { return packet_cmd.Req.EquipItemOne; }
	inst.cmdAckEquipItemOne = function() { return packet_cmd.Ack.EquipItemOne; }

	inst.cmdReqEquipItemLevelup = function () { return packet_cmd.Req.Levelup; }
	inst.cmdAckEquipItemLevelup = function () { return packet_cmd.Ack.Levelup; }

	inst.cmdReqEquipItemReinforce = function () { return packet_cmd.Req.Reinforce; }
	inst.cmdAckEquipItemReinforce = function () { return packet_cmd.Ack.Reinforce; }

	inst.cmdReqEquipItemLock = function () { return packet_cmd.Req.Lock; }
	inst.cmdAckEquipItemLock = function () { return packet_cmd.Ack.Lock; }

	inst.cmdReqEquipItemSell = function () { return packet_cmd.Req.Sell; }
	inst.cmdAckEquipItemSell = function () { return packet_cmd.Ack.Sell; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckEquipment			= function () { return new PacketEquipItemData.AckEquipment(); }
	inst.GetPacketAckEquipItem			= function () { return new PacketEquipItemData.AckEquipItem(); }
	inst.GetPacketAckEquipItemOne		= function () { return new PacketEquipItemData.AckEquipItemOne(); }
	inst.GetPacketAckEquipItemLevelup	= function () { return new PacketEquipItemData.AckEquipItemLevelup(); }
	inst.GetPacketAckEquipItemReinforce	= function () { return new PacketEquipItemData.AckEquipItemReinforce(); }
	inst.GetPacketAckEquipItemLock		= function () { return new PacketEquipItemData.AckEquipItemLock(); }
	inst.GetPacketAckEquipItemSell		= function () { return new PacketEquipItemData.AckEquipItemSell(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;