/********************************************************************
Title : PacketGacha
Date : 2016.01.18
Update : 2016.08.17
Desc : 패킷 정의 - Gacha
writer : dongsu
********************************************************************/
var PacketGachaData = require('./PacketGachaData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Gacha packet command init ****');

		fp.readFile('./Packets/PacketGacha/PacketGachaCmd.json', 'utf8', function (err, data) {
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
	// Content
	inst.cmdReqGacha = function() { return packet_cmd.Req.Gacha; }
	inst.cmdAckGacha = function() { return packet_cmd.Ack.Gacha; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckGacha = function() { return new PacketGachaData.AckGacha(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;