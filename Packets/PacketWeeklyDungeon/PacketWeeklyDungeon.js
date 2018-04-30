/********************************************************************
Title : PacketWeeklyDungeon
Date : 2016.11.25
Desc : 패킷 정의 - 요일 던전
writer : dongsu
********************************************************************/
var PacketWeeklyDungeonData = require('./PacketWeeklyDungeonData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** WeeklyDungeon packet command init ****');

		fp.readFile('./Packets/PacketWeeklyDungeon/PacketWeeklyDungeonCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqWeeklyDungeonStart = function() { return packet_cmd.Req.WeeklyDungeonStart; }
	inst.cmdAckWeeklyDungeonStart = function() { return packet_cmd.Ack.WeeklyDungeonStart; }
	inst.cmdReqWeeklyDungeonFinish = function() { return packet_cmd.Req.WeeklyDungeonFinish; }
	inst.cmdAckWeeklyDungeonFinish = function() { return packet_cmd.Ack.WeeklyDungeonFinish; }	

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckWeeklyDungeonStart = function() { return new PacketWeeklyDungeonData.AckWeeklyDungeonStart(); }
	inst.GetPacketAckWeeklyDungeonFinish = function() { return new PacketWeeklyDungeonData.AckWeeklyDungeonFinish(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;