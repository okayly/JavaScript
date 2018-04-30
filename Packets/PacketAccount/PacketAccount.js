/********************************************************************
Title : PacketAccount
Date : 2015.12.31
Update : 2016.11.22
Desc : 패킷 정의 - 계정
writer: jongwook
********************************************************************/
var PacketAccountData = require('./PacketAccountData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function() {
		logger.debug('**** Account packet command init ****');

		fp.readFile('./Packets/PacketAccount/PacketAccountCmd.json', 'utf8', function(err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqLogon = function() { return packet_cmd.Req.Logon; }
	inst.cmdAckLogon = function() { return packet_cmd.Ack.Logon; }
	
	inst.cmdReqUser = function() { return packet_cmd.Req.User; }
	inst.cmdAckUser = function() { return packet_cmd.Ack.User; }
	
	// 가방
	inst.cmdReqInventory = function() { return packet_cmd.Req.Inventory }
	inst.cmdAckInventory = function() { return packet_cmd.Ack.Inventory }
	
	// 영웅
	inst.cmdReqHeroBases = function() { return packet_cmd.Req.HeroBases }
	inst.cmdAckHeroBases = function() { return packet_cmd.Ack.HeroBases }
	
	// 모드별 팀 정보
	inst.cmdReqTeam = function() { return packet_cmd.Req.Team; }
	inst.cmdAckTeam = function() { return packet_cmd.Ack.Team; }

	//
	inst.cmdReqChapterReward = function() { return packet_cmd.Req.ChapterReward; }
	inst.cmdAckChapterReward = function() { return packet_cmd.Ack.ChapterReward; }

	inst.cmdReqStageInfo = function() { return packet_cmd.Req.StageInfo; }
	inst.cmdAckStageInfo = function() { return packet_cmd.Ack.StageInfo; }

	// VIP
	inst.cmdReqVip = function() { return packet_cmd.Req.Vip; }
	inst.cmdAckVip = function() { return packet_cmd.Ack.Vip; }

	inst.cmdReqVipReward = function() { return packet_cmd.Req.VipReward; }
	inst.cmdAckVipReward = function() { return packet_cmd.Ack.VipReward; }

	// 가챠
	inst.cmdReqGachaInfo = function() { return packet_cmd.Req.Gacha; }
	inst.cmdAckGachaInfo = function() { return packet_cmd.Ack.Gacha; }

	// 도전 모드
	inst.cmdReqWeeklyDungeonExecCount = function() { return packet_cmd.Req.WeeklyDungeon; }
	inst.cmdAckWeeklyDungeonExecCount = function() { return packet_cmd.Ack.WeeklyDungeon; }

	// 출석
	inst.cmdReqAttendInfo = function() { return packet_cmd.Req.Attend; }
	inst.cmdAckAttendInfo = function() { return packet_cmd.Ack.Attend; }	
	
	// 미션
	inst.cmdReqMissionInfo = function() { return packet_cmd.Req.Mission; }
	inst.cmdAckMissionInfo = function() { return packet_cmd.Ack.Mission; }

	// 길드
	inst.cmdReqGuildInfo = function() { return packet_cmd.Req.Guild; }
	inst.cmdAckGuildInfo = function() { return packet_cmd.Ack.Guild; }

	// 재연결.
	inst.cmdReqReConnect = function() { return packet_cmd.Req.ReConnect; }
	inst.cmdAckReConnect = function() { return packet_cmd.Ack.ReConnect; }

	// 닉네임 변경
	inst.cmdReqChangeNick = function() { return packet_cmd.Req.ChangeNick; }
	inst.cmdAckChangeNick = function() { return packet_cmd.Ack.ChangeNick; }

	// 유저 아이콘 변경
	inst.cmdReqChangeUserIcon = function() { return packet_cmd.Req.ChangeUserIcon; }
	inst.cmdAckChangeUserIcon = function() { return packet_cmd.Ack.ChangeUserIcon; }

	// PvP
	inst.cmdReqPvpInfo = function() { return packet_cmd.Req.PvpInfo; }
	inst.cmdAckPvpInfo = function() { return packet_cmd.Ack.PvpInfo; }
	

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckLogon			= function() { return new PacketAccountData.AckLogon(); } 
	inst.GetPacketAckUser			= function() { return new PacketAccountData.AckUser(); }
	inst.GetPacketAckInventory			= function() { return new PacketAccountData.AckInventory(); }
	inst.GetPacketAckHeroBases		= function() { return new PacketAccountData.AckHeroBases(); }
	inst.GetPacketAckTeam			= function() { return new PacketAccountData.AckTeam(); }
	inst.GetPacketAckBuyGold			= function() { return new PacketAccountData.AckBuyGold(); }
	inst.GetPacketAckBuySkillPoint		= function() { return new PacketAccountData.AckBuySkillPoint(); }
	inst.GetPacketAckChapterReward		= function() { return new PacketAccountData.AckChapterReward(); }
	inst.GetPacketAckStageInfo			= function() { return new PacketAccountData.AckStageInfo(); }
	inst.GetPacketAckVip			= function() { return new PacketAccountData.AckVip(); }
	inst.GetPacketAckVipReward		= function() { return new PacketAccountData.AckVipReward(); }
	inst.GetPacketAckGachaInfo		= function() { return new PacketAccountData.AckGachaInfo(); }
	inst.GetPacketAckWeeklyDungeonExecCount	= function() { return new PacketAccountData.AckWeeklyDungeonExecCount(); }
	inst.GetPacketAckAttendInfo		= function() { return new PacketAccountData.AckAttendInfo(); }
	inst.GetPacketAckMissionInfo	= function() { return new PacketAccountData.AckMissionInfo(); }
	// 길드 정보
	inst.GetPacketAckGuildInfo = function() { return new PacketAccountData.AckGuildInfo(); }
	// 재연결
	inst.GetPacketAckReConnect = function() { return new PacketAccountData.AckReConnect(); }

	inst.GetPacketAckChangeNick = function() { return new PacketAccountData.AckChangeNick(); }
	inst.GetPacketAckChangeUserIcon = function() { return new PacketAccountData.AckChangeUserIcon(); }

	inst.GetPacketAckPvpInfo = function() { return new PacketAccountData.AckPvpInfo(); }
	

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;