/********************************************************************
Title : PacketRank
Date : 2016.03.04
Desc : 패킷 정의 - 랭킹전
writer : dongsu
********************************************************************/
var PacketRankData = require('./PacketRankData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Rank packet command init ****');

		fp.readFile('./Packets/PacketRank/PacketRankCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqFindMatchPlayer = function() { return packet_cmd.Req.FindMatchPlayer; }
	inst.cmdAckFindMatchPlayer = function() { return packet_cmd.Ack.FindMatchPlayer; }
	inst.cmdReqPlayerDetailInfo = function() { return packet_cmd.Req.PlayerDetailInfo; }
	inst.cmdAckPlayerDetailInfo = function() { return packet_cmd.Ack.PlayerDetailInfo; }
	inst.cmdReqRankMatchStart = function() { return packet_cmd.Req.MatchStart; }
	inst.cmdAckRankMatchStart = function() { return packet_cmd.Ack.MatchStart; }
	inst.cmdReqRankMatchFinish = function() { return packet_cmd.Req.MatchFinish; }
	inst.cmdAckRankMatchFinish = function() { return packet_cmd.Ack.MatchFinish; }
	inst.cmdReqPlayCountReward = function() { return packet_cmd.Req.PlayCountReward; }
	inst.cmdAckPlayCountReward = function() { return packet_cmd.Ack.PlayCountReward; }
	inst.cmdReqWinningStreakReward = function() { return packet_cmd.Req.WinningStreakReward; }
	inst.cmdAckWinningStreakReward = function() { return packet_cmd.Ack.WinningStreakReward; }
	inst.cmdReqAchievementReward = function() { return packet_cmd.Req.AchievementReward; }
	inst.cmdAckAchievementReward = function() { return packet_cmd.Ack.AchievementReward; }
	inst.cmdReqBuyMatchCount = function() { return packet_cmd.Req.BuyMatchCount; }
	inst.cmdAckBuyMatchCount = function() { return packet_cmd.Ack.BuyMatchCount; }
	inst.cmdReqBuyReplaceMatchPlayer = function() { return packet_cmd.Req.BuyReplaceMatchPlayer; }
	inst.cmdAckBuyReplaceMatchPlayer = function() { return packet_cmd.Ack.BuyReplaceMatchPlayer; }
	inst.cmdReqInitMatchRemainTime = function() { return packet_cmd.Req.InitMatchRemainTime; }
	inst.cmdAckInitMatchRemainTime = function() { return packet_cmd.Ack.InitMatchRemainTime; }
	inst.cmdReqRankList = function() { return packet_cmd.Req.RankList; }
	inst.cmdAckRankList = function() { return packet_cmd.Ack.RankList; }
	inst.cmdReqRecordList = function() { return packet_cmd.Req.RecordList; }
	inst.cmdAckRecordList = function() { return packet_cmd.Ack.RecordList; }
	inst.cmdReqRecordDetailInfo = function() { return packet_cmd.Req.RecordDetailInfo; }
	inst.cmdAckRecordDetailInfo = function() { return packet_cmd.Ack.RecordDetailInfo; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckFindMatchPlayer = function() { return new PacketRankData.AckFindMatchPlayer(); }
	inst.GetPacketAckPlayerDetailInfo = function() { return new PacketRankData.AckPlayerDetailInfo(); }
	inst.GetPacketAckRankMatchStart = function() { return new PacketRankData.AckRankMatchStart(); }
	inst.GetPacketAckRankMatchFinish = function() { return new PacketRankData.AckRankMatchFinish(); }
	inst.GetPacketAckPlayCountReward = function() { return new PacketRankData.AckPlayCountReward(); }
	inst.GetPacketAckWinningStreakReward = function() { return new PacketRankData.AckWinningStreakReward(); }
	inst.GetPacketAckRankAchievementReward = function() { return new PacketRankData.AckRankAchievementReward(); }
	inst.GetPacketAckBuyRankMatchCount = function() { return new PacketRankData.AckBuyRankMatchCount(); }
	inst.GetPacketAckBuyReplaceMatchPlayer = function() { return new PacketRankData.AckBuyReplaceMatchPlayer(); }
	inst.GetPacketAckInitMatchRemainTime = function() { return new PacketRankData.AckInitMatchRemainTime(); }
	inst.GetPakcetAckRankList = function() { return new PacketRankData.AckRankList(); }
	inst.GetPacketAckRankMatchRecord = function() { return new PacketRankData.AckRankMatchRecord(); }
	inst.GetPacketAckRankMatchRecordDetailInfo = function() { return new PacketRankData.AckRankMatchRecordDetailInfo(); }

	inst.GetPacketAckReward = function() { return new PacketRankData.AckReward(); }

	exports.inst = inst;

})(exports || global);
(exports || global).inst;