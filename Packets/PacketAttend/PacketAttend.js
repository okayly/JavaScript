/********************************************************************
Title : PacketAttend
Date : 2016.03.03
Update : 2016.11.21
Desc : 패킷 정의 - 출석
writer : jongwook
********************************************************************/
var PacketAttendData = require('./PacketAttendData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Attend packet command init ****');

		fp.readFile('./Packets/PacketAttend/PacketAttendCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqAttendDailyReward = function () { return packet_cmd.Req.AttendDailyReward; }
	inst.cmdAckAttendDailyReward = function () { return packet_cmd.Ack.AttendDailyReward; }

	inst.cmdReqAddAttendDailyReward = function () { return packet_cmd.Req.AddAttendDailyReward; }
	inst.cmdAckAddAttendDailyReward = function () { return packet_cmd.Ack.AddAttendDailyReward; }

	inst.cmdReqAttendAccumReward = function () { return packet_cmd.Req.AttendAccumReward; }
	inst.cmdAckAttendAccumReward = function () { return packet_cmd.Ack.AttendAccumReward; }
	
	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckAttendDailyReward = function () { return new PacketAttendData.AckAttendDailyReward(); }
	inst.GetPacketAckAddAttendDailyReward = function () { return new PacketAttendData.AckAddAttendDailyReward(); }
	inst.GetPacketAckAttendAccumReward = function () { return new PacketAttendData.AckAttendAccumReward(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;