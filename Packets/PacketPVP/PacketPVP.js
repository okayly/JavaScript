/********************************************************************
Title : PacketPVP
Date : 2017.02.27
Desc : 
writer: dongsu
********************************************************************/
var PacketPVPData = require('./PacketPVPData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** PVP packet command init ****');

		fp.readFile('./Packets/PacketPVP/PacketPVPCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqPVPInfoUpdate = function () { return packet_cmd.Req.InfoUpdate; }
	inst.cmdAckPVPInfoUpdate = function () { return packet_cmd.Ack.InfoUpdate; }
	inst.cmdReqFindMatchPlayer = function () { return packet_cmd.Req.FindMatchPlayer; }
	inst.cmdAckFindMatchPlayer = function () { return packet_cmd.Ack.FindMatchPlayer; }
	inst.cmdReqPvpLeagueRankList = function () { return packet_cmd.Req.PvpLeagueRankList; }
	inst.cmdAckPvpLeagueRankList = function () { return packet_cmd.Ack.PvpLeagueRankList; }
	inst.cmdReqPvpGroupRankList = function () { return packet_cmd.Req.PvpGroupRankList; }
	inst.cmdAckPvpGroupRankList = function () { return packet_cmd.Ack.PvpGroupRankList; }
	inst.cmdReqPvpStart = function () { return packet_cmd.Req.PvpStart; }
	inst.cmdAckPvpStart = function () { return packet_cmd.Ack.PvpStart; }
	inst.cmdReqPvpFinish = function () { return packet_cmd.Req.PvpFinish; }
	inst.cmdAckPvpFinish = function () { return packet_cmd.Ack.PvpFinish; }
	inst.cmdReqPvpAchievementReward = function () { return packet_cmd.Req.PvpAchievementReward; }
	inst.cmdAckPvpAchievementReward = function () { return packet_cmd.Ack.PvpAchievementReward; }
	inst.cmdReqPvpRecord = function () { return packet_cmd.Req.PvpRecord; }
	inst.cmdAckPvpRecord = function () { return packet_cmd.Ack.PvpRecord; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckPVPInfoUpdate		= function () { return new PacketPVPData.AckPvpInfoUpdate(); }
	inst.GetPacketAckFindMatchPlayer		= function () { return new PacketPVPData.AckFindMatchPlayer(); }
	inst.GetPacketAckPvpLeagueRankList	= function () { return new PacketPVPData.AckPvpLeagueRankList(); }
	inst.GetPacketAckPvpGroupRankList	= function () { return new PacketPVPData.AckPvpGroupRankList(); }
	inst.GetPacketAckPvpStart			= function () { return new PacketPVPData.AckPvpStart(); }
	inst.GetPacketAckPvpFinish			= function () { return new PacketPVPData.AckPvpFinish(); }
	inst.GetPacketAckPvpAchievementReward	= function () { return new PacketPVPData.AckPvpAchievementReward(); }
	inst.GetPacketAckPvpRecord		= function () { return new PacketPVPData.AckPvpRecord(); }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;7