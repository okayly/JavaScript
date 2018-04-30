/********************************************************************
Title : PacketBattle
Date : 2016.01.13
Desc : 패킷 정의 - 배틀
writer : dongsu
********************************************************************/
var PacketBattleData = require('./PacketBattleData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Battle packet command init ****');

		fp.readFile('./Packets/PacketBattle/PacketBattleCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};
	
	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqBattleStart = function() { return packet_cmd.Req.Start; }
	inst.cmdAckBattleStart = function() { return packet_cmd.Ack.Start; }
	inst.cmdReqBattleFinish = function() { return packet_cmd.Req.Finish; }
	inst.cmdAckBattleFinish = function() { return packet_cmd.Ack.Finish; }
	inst.cmdReqBattleSweep = function() { return packet_cmd.Req.Sweep; }
	inst.cmdAckBattleSweep = function() { return packet_cmd.Ack.Sweep; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckStart = function() { return new PacketBattleData.AckBattleStart(); }
	inst.GetPacketAckFinish = function() { return new PacketBattleData.AckBattleFinish(); }
	inst.GetPacketAckSweep = function() { return new PacketBattleData.AckBattleSweep(); }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;