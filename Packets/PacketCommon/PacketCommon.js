/********************************************************************
Title : PacketCommon
Date : 2016.02.02
Desc : 패킷 정의 - 스테미너 스킬 포인트
writer: jongwook
********************************************************************/
var PacketCommonData = require('./PacketCommonData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//-----------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Common packet command init ****');

		fp.readFile('./Packets/PacketCommon/PacketCommonCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqChargeStamina = function () { return packet_cmd.Req.ChargeStamina; }
	inst.cmdAckChargeStamina = function () { return packet_cmd.Ack.ChargeStamina; }
	
	inst.cmdReqChargeSkillPoint = function () { return packet_cmd.Req.ChargeSkillPoint; }
	inst.cmdAckChargeSkillPoint = function () { return packet_cmd.Ack.ChargeSkillPoint; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckChargeStamina = function () { return new PacketCommonData.AckChargeStamina(); }
	inst.GetPacketAckChargeSkillPoint = function () { return new PacketCommonData.AckChargeSkillPoint(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;