/********************************************************************
Title : PacketTeam
Date : 2016.03.14
Update : 2016.11.22
Desc : 패킷 정의 - 팀
writer : jongwook
********************************************************************/
var PacketTeamData = require('./PacketTeamData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Team packet command init ****');

		fp.readFile('./Packets/PacketTeam/PacketTeamCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqChangeTeam = function() { return packet_cmd.Req.Change; }
	inst.cmdAckChangeTeam = function() { return packet_cmd.Ack.Change; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckChangeTeam = function () { return new PacketTeamData.AckChangeTeam(); } 
	
	//-----------------------------------------------------------------------------------------------------------		
	exports.inst = inst;

})(exports || global);
(exports || global).inst;