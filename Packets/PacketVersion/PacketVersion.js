/********************************************************************
Title : PacketVersion
Date : 2016.11.21
Desc : 패킷 정의 - 버전
writer : jongwook
********************************************************************/
var PacketVersionData = require('./PacketVersionData.js');

var fp = require('fs');

(function(exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function() {
		logger.debug('**** Version packet command init ****');

		fp.readFile('./Packets/PacketVersion/PacketVersionCmd.json', 'utf8', function(err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqVersion = function() { return packet_cmd.Req.Version; }
	inst.cmdAckVersion = function() { return packet_cmd.Ack.Version; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckVersion = function() { return new PacketVersionData.AckVersion(); } 

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;