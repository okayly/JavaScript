/********************************************************************
Title : PacketAccountBuff
Date : 2016.08.09
Desc : 패킷 정의 - 계정 버프
writer: jongwook
********************************************************************/
var PacketAccountBuffData = require('./PacketAccountBuffData.js');

var fp = require('fs');

(function(exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function() {
		logger.debug('**** AccountBuff packet command init ****');

		fp.readFile('./Packets/PacketAccountBuff/PacketAccountBuffCmd.json', 'utf8', function(err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	// 계정 버프
	inst.cmdReqAccountBuffInfo = function() { return packet_cmd.Req.AccountBuffInfo; }
	inst.cmdAckAccountBuffInfo = function() { return packet_cmd.Ack.AccountBuffInfo; }
	
	inst.cmdReqAccountBuffLevelup = function() { return packet_cmd.Req.AccountBuffLevelup; }
	inst.cmdAckAccountBuffLevelup = function() { return packet_cmd.Ack.AccountBuffLevelup; }
	
	inst.cmdReqAccountBuffReset = function() { return packet_cmd.Req.AccountBuffReset; }
	inst.cmdAckAccountBuffReset = function() { return packet_cmd.Ack.AccountBuffReset; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data	
	// 계정 버프
	inst.GetPacketAckAccountBuffInfo	= function() { return new PacketAccountBuffData.AckAccountBuffInfo(); }
	inst.GetPacketAckAccountBuffLevelup	= function() { return new PacketAccountBuffData.AckAccountBuffLevelup(); }
	inst.GetPacketAckAccountBuffReset	= function() { return new PacketAccountBuffData.AckAccountBuffReset(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;