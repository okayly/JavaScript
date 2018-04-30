/********************************************************************
Title : PacketLoginServer
Date : 2016.08.29
Desc : 패킷 정의 - 로그인 서버
writer: jongwook
********************************************************************/
var PacketLoginServerData = require('./PacketLoginServerData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** LoginServer packet command init ****');

		fp.readFile('./Packets/PacketLoginServer/PacketLoginServerCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqUserCount = function () { return packet_cmd.Req.UserCount; }
	inst.cmdAckUserCount = function () { return packet_cmd.Ack.UserCount; }

	inst.cmdReqSendReservationMail = function () { return packet_cmd.Req.SendReservationMail; }
	inst.cmdAckSendReservationMail = function () { return packet_cmd.Ack.SendReservationMail; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckUserCount = function () { return new PacketLoginServerData.AckUserCount(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;