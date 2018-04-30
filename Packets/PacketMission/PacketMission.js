/********************************************************************
Title : PacketMission
Date : 2016.07.13
Update : 2016.11.22
writer : dongsu
********************************************************************/
var PacketMissionData = require('./PacketMissionData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Mission packet command init ****');

		fp.readFile('./Packets/PacketMission/PacketMissionCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};
	
	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqMissionReward = function() { return packet_cmd.Req.Reward; }
	inst.cmdAckMissionReward = function() { return packet_cmd.Ack.Reward; }
	inst.cmdReqMissionProgress = function() { return packet_cmd.Req.Progress; }
	inst.cmdAckMissionProgress = function() { return packet_cmd.Ack.Progress; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckMissionReward	= function() { return new PacketMissionData.AckMissionReward(); }
	inst.GetPacketAckMissionProgress= function() { return new PacketMissionData.AckMissionProgress(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;