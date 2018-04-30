/********************************************************************
Title : PacketDarkDungeon
Date : 2016.12.08
Update : 2016.12.23
Desc : 패킷 정의 - DarkDungeon
writer: jongwook
********************************************************************/
var PacketDarkDungeonData = require('./PacketDarkDungeonData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function() {
		logger.debug('**** DarkDungeon packet command init ****');

		fp.readFile('./Packets/PacketDarkDungeon/PacketDarkDungeonCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqDarkDungeonCreate = function() { return packet_cmd.Req.DarkDungeonCreate; }
	inst.cmdAckDarkDungeonCreate = function() { return packet_cmd.Ack.DarkDungeonCreate; }

	inst.cmdReqDarkDungeon = function() { return packet_cmd.Req.DarkDungeon; }
	inst.cmdAckDarkDungeon = function() { return packet_cmd.Ack.DarkDungeon; }

	inst.cmdReqDarkDungeonChapter = function() { return packet_cmd.Req.DarkDungeonChapter; }
	inst.cmdAckDarkDungeonChapter = function() { return packet_cmd.Ack.DarkDungeonChapter; }

	inst.cmdReqDarkDungeonBattleStart = function() { return packet_cmd.Req.DarkDungeonBattleStart; }
	inst.cmdAckDarkDungeonBattleStart = function() { return packet_cmd.Ack.DarkDungeonBattleStart; }	

	inst.cmdReqDarkDungeonBattleFinish = function() { return packet_cmd.Req.DarkDungeonBattleFinish; }
	inst.cmdAckDarkDungeonBattleFinish = function() { return packet_cmd.Ack.DarkDungeonBattleFinish; }

	inst.cmdReqDarkDungeonReward = function() { return packet_cmd.Req.DarkDungeonReward; }
	inst.cmdAckDarkDungeonReward = function() { return packet_cmd.Ack.DarkDungeonReward; }

	inst.cmdReqDarkDungeonNextStage = function() { return packet_cmd.Req.DarkDungeonNextStage; }
	inst.cmdAckDarkDungeonNextStage = function() { return packet_cmd.Ack.DarkDungeonNextStage; }

	inst.cmdReqDarkDungeonChapterReset = function() { return packet_cmd.Req.DarkDungeonChapterReset; }
	inst.cmdAckDarkDungeonChapterReset = function() { return packet_cmd.Ack.DarkDungeonChapterReset; }

	inst.cmdReqDarkDungeonReward = function() { return packet_cmd.Req.DarkDungeonReward; }
	inst.cmdAckDarkDungeonReward = function() { return packet_cmd.Ack.DarkDungeonReward; }

	//-----------------------------------------------------------------------------------------------------------
	inst.GetPacketAckDarkDungeonCreate			= function() { return new PacketDarkDungeonData.AckDarkDungeonCreate(); }
	inst.GetPacketAckDarkDungeon				= function() { return new PacketDarkDungeonData.AckDarkDungeon(); }
	inst.GetPacketAckDarkDungeonChapter			= function() { return new PacketDarkDungeonData.AckDarkDungeonChapter(); }
	inst.GetPacketAckDarkDungeonBattleStart		= function() { return new PacketDarkDungeonData.AckDarkDungeonBattleStart(); }
	inst.GetPacketAckDarkDungeonBattleFinish	= function() { return new PacketDarkDungeonData.AckDarkDungeonBattleFinish(); }
	inst.GetPacketAckDarkDungeonChapterReset	= function() { return new PacketDarkDungeonData.AckDarkDungeonChapterReset(); }
	inst.GetPacketAckDarkDungeonReward			= function() { return new PacketDarkDungeonData.AckDarkDungeonReward(); }
	inst.GetPacketAckDarkDungeonNextStage		= function() { return new PacketDarkDungeonData.AckDarkDungeonNextStage(); }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;