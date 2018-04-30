/********************************************************************
Title : PacketGuild
Date : 2016.03.23
Update : 2016.11.22
Desc : 패킷 정의 - 길드
Writer : dongsu
********************************************************************/
var PacketGuildData = require('./PacketGuildData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Guild packet command init ****');

		fp.readFile('./Packets/PacketGuild/PacketGuildCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};
	
	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqCreateGuild = function() { return packet_cmd.Req.Create; }
	inst.cmdAckCreateGuild = function() { return packet_cmd.Ack.Create; }

	inst.cmdReqRecommandGuild = function() { return packet_cmd.Req.Recommon; }
	inst.cmdAckRecommandGuild = function() { return packet_cmd.Ack.Recommon; }

	inst.cmdReqGuildDetailInfo = function() { return packet_cmd.Req.DetailInfo; }
	inst.cmdAckGuildDetailInfo = function() { return packet_cmd.Ack.DetailInfo; }

	inst.cmdReqGuildJoin = function() { return packet_cmd.Req.Join; }
	inst.cmdAckGuildJoin = function() { return packet_cmd.Ack.Join; }

	inst.cmdReqGuildPendingApprovalList = function() { return packet_cmd.Req.PendingApprovalList; }
	inst.cmdAckGuildPendingApprovalList = function() { return packet_cmd.Ack.PendingApprovalList; }

	inst.cmdReqGuildPendingApprovalProcess = function() { return packet_cmd.Req.PendingApprovalProcess; }
	inst.cmdAckGuildPendingApprovalProcess = function() { return packet_cmd.Ack.PendingApprovalProcess; }

	inst.cmdReqGuildMemberBan = function() { return packet_cmd.Req.MemberBan; }
	inst.cmdAckGuildMemberBan = function() { return packet_cmd.Ack.MemberBan; }

	inst.cmdReqFindGuild = function() { return packet_cmd.Req.FindGuild; }
	inst.cmdAckFindGuild = function() { return packet_cmd.Ack.FindGuild; }

	inst.cmdReqLeaveGuild = function() { return packet_cmd.Req.LeaveGuild; }
	inst.cmdAckLeaveGuild = function() { return packet_cmd.Ack.LeaveGuild; }

	inst.cmdReqChangeGuildInfo = function() { return packet_cmd.Req.ChangeInfo; }
	inst.cmdAckChangeGuildInfo = function() { return packet_cmd.Ack.ChangeInfo; }

	inst.cmdReqGuildInvitation = function() { return packet_cmd.Req.GuildInvitation; }
	inst.cmdAckGuildInvitation = function() { return packet_cmd.Ack.GuildInvitation; }

	inst.cmdReqGuildInvitationList = function() { return packet_cmd.Req.GuildInvitationList; }
	inst.cmdAckGuildInvitationList = function() { return packet_cmd.Ack.GuildInvitationList; }

	inst.cmdReqGuildInvitationProcess = function() { return packet_cmd.Req.GuildInvitationProcess; }
	inst.cmdAckGuildInvitationProcess = function() { return packet_cmd.Ack.GuildInvitationProcess; }

	inst.cmdReqChangeAuth = function() { return packet_cmd.Req.ChangeAuth; }
	inst.cmdAckChangeAuth = function() { return packet_cmd.Ack.ChangeAuth; }

	inst.cmdReqChangeAuthConfirm = function() { return packet_cmd.Req.ChangeAuthConfirm; }
	inst.cmdAckChangeAuthConfirm = function() { return packet_cmd.Ack.ChangeAuthConfirm; }

	inst.cmdReqGuildPointDonation = function() { return packet_cmd.Req.GuildPointDonation; }
	inst.cmdAckGuildPointDonation = function() { return packet_cmd.Ack.GuildPointDonation; }

	inst.cmdReqGuildLevelup = function() { return packet_cmd.Req.GuildLevelup; }
	inst.cmdAckGuildLevelup = function() { return packet_cmd.Ack.GuildLevelup; }

	inst.cmdReqWeeklyDonationReward = function() { return packet_cmd.Req.WeeklyDonationReward; }
	inst.cmdAckWeeklyDonationReward = function() { return packet_cmd.Ack.WeeklyDonationReward; }

	inst.cmdReqDonationRank = function() { return packet_cmd.Req.DonationRank; }
	inst.cmdAckDonationRank = function() { return packet_cmd.Ack.DonationRank; }

	inst.cmdReqGuildSkillLevelUp = function() { return packet_cmd.Req.GuildSkillLevelUp; }
	inst.cmdAckGuildSkillLevelUp = function() { return packet_cmd.Ack.GuildSkillLevelUp; }

	inst.cmdReqForceChangeAuth = function() { return packet_cmd.Req.ForceChangeAuth; }
	inst.cmdAckForceChangeAuth = function() { return packet_cmd.Ack.ForceChangeAuth; }

	// Raid
	inst.cmdReqGuildRaidInfo = function() { return packet_cmd.Req.GuildRaidInfo; }

	inst.cmdAckGuildRaidInfo = function() { return packet_cmd.Ack.GuildRaidInfo; }
	inst.cmdReqGuildRaidOpen = function() { return packet_cmd.Req.GuildRaidOpen; }

	inst.cmdAckGuildRaidOpen = function() { return packet_cmd.Ack.GuildRaidOpen; }
	inst.cmdReqGuildRaidBattleStart = function() { return packet_cmd.Req.GuildRaidBattleStart; }

	inst.cmdAckGuildRaidBattleStart = function() { return packet_cmd.Ack.GuildRaidBattleStart; }
	inst.cmdReqGuildRaidBattleFinish = function() { return packet_cmd.Req.GuildRaidBattleFinish; }

	inst.cmdAckGuildRaidBattleFinish = function() { return packet_cmd.Ack.GuildRaidBattleFinish; }
	inst.cmdReqGuildRaidRank = function() { return packet_cmd.Req.GuildRaidRank; }

	inst.cmdAckGuildRaidRank = function() { return packet_cmd.Ack.GuildRaidRank; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckCreateGuild				= function() { return new PacketGuildData.AckCreateGuild(); }
	inst.GetPacketAckRecommandGuild				= function() { return new PacketGuildData.AckRecommandGuild(); }
	inst.GetPacketAckGuildDetailInfo			= function() { return new PacketGuildData.AckGuildDetailInfo(); }
	inst.GetPacketAckGuildJoin					= function() { return new PacketGuildData.AckGuildJoin(); }
	inst.GetPacketAckGuildPendingApprovalList	= function() { return new PacketGuildData.AckGuildPendingApprovalList(); }
	inst.GetPacketAckGuildPendingApprovalProcess= function() { return new PacketGuildData.AckGuildPendingApprovalProcess(); }
	inst.GetPacketAckGuildMemberBan				= function() { return new PacketGuildData.AckGuildMemberBan(); }
	inst.GetPacketAckFindGuild					= function() { return new PacketGuildData.AckFindGuild(); }
	inst.GetPacketAckLeaveGuild					= function() { return new PacketGuildData.AckLeaveGuild(); }
	inst.GetPacketAckChangeGuildInfo			= function() { return new PacketGuildData.AckChangeGuildInfo(); }
	inst.GetPacketAckGuildInvitation			= function() { return new PacketGuildData.AckGuildInvitation(); }
	inst.GetPacketAckGuildInvitationList		= function() { return new PacketGuildData.AckGuildInvitationList(); }
	inst.GetPacketAckGuildInvitationProcess		= function() { return new PacketGuildData.AckGuildInvitationProcess(); }
	inst.GetPacketAckChangeAuth					= function() { return new PacketGuildData.AckChangeAuth(); }
	inst.GetPacketAckChangeAuthConfirm			= function() { return new PacketGuildData.AckChangeAuthConfirm(); }
	inst.GetPacketAckGuildPointDonation			= function() { return new PacketGuildData.AckGuildPointDonation(); }
	inst.GetPacketAckGuildLevelup				= function() { return new PacketGuildData.AckGuildLevelup(); }
	inst.GetPacketAckWeeklyDonationReward		= function() { return new PacketGuildData.AckWeeklyDonationReward(); }
	inst.GetPacketAckDonationRank				= function() { return new PacketGuildData.AckDonationRank(); }
	inst.GetPacketAckGuildSkillLevelUp			= function() { return new PacketGuildData.AckGuildSkillLevelUp(); }
	inst.GetPacketAckForceChangeAuth			= function() { return new PacketGuildData.AckForceChangeAuth(); }

	// Raid
	inst.GetPacketAckGuildRaidInfo = function() { return new PacketGuildData.AckGuildRaidInfo(); }
	inst.GetPacketAckGuildRaidOpen = function() { return new PacketGuildData.AckGuildRaidOpen(); }
	inst.GetPacketAckGuildRaidBattleStart = function() { return new PacketGuildData.AckGuildRaidBattleStart(); }
	inst.GetPacketAckGuildRaidBattleFinish = function() { return new PacketGuildData.AckGuildRaidBattleFinish(); }
	inst.GetPacketAckGuildRaidRank = function() { return new PacketGuildData.AckGuildRaidRank(); }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;