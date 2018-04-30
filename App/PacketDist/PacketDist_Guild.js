/********************************************************************
Title : PacketDist_Guild
Date : 2016.05.26
Update : 2017.03.06
Desc : 패킷 연결 - 길드
writer : dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketGuild				= require('../../Packets/PacketGuild/PacketGuild.js');

var GuildCreate					= require('../../Contents/Guild/GuildCreate.js');
var RecommondGuild				= require('../../Contents/Guild/RecommondGuild.js');
var GuildDetailInfo				= require('../../Contents/Guild/GuildDetailInfo.js');
var GuildJoin					= require('../../Contents/Guild/GuildJoin.js');
var GuildJoinPendingApprovalList	= require('../../Contents/Guild/GuildJoinPendingApprovalList.js');
var GuildJoinPendingApprovalProcess	= require('../../Contents/Guild/GuildJoinPendingApprovalProcess.js');
var GuildMemberBan				= require('../../Contents/Guild/GuildMemberBan.js');
var FindGuild					= require('../../Contents/Guild/FindGuild.js');
var LeaveGuild					= require('../../Contents/Guild/LeaveGuild.js');
var ChangeGuildInfo				= require('../../Contents/Guild/ChangeGuildInfo.js');
var GuildInvitation				= require('../../Contents/Guild/GuildInvitation.js');
var GuildInvitationList			= require('../../Contents/Guild/GuildInvitationList.js');
var GuildInvitationProcess		= require('../../Contents/Guild/GuildInvitationProcess.js');
var ChangeAuth					= require('../../Contents/Guild/ChangeAuth.js');
var ChangeAuthConfirm			= require('../../Contents/Guild/ChangeAuthConfirm.js');
var GuildPoint					= require('../../Contents/Guild/GuildPoint.js');
var GuildLevelup				= require('../../Contents/Guild/GuildLevelup.js');
var GuildRaidInfo				= require('../../Contents/Guild/GuildRaidInfo.js');
var GuildRaidOpen 				= require('../../Contents/Guild/GuildRaidOpen.js');
var GuildRaidBattleStart 		= require('../../Contents/Guild/GuildRaidBattleStart.js');
var GuildRaidBattleFinish 		= require('../../Contents/Guild/GuildRaidBattleFinish.js');
var GuildRaidRank 	 			= require('../../Contents/Guild/GuildRaidRank.js');
var WeeklyReward				= require('../../Contents/Guild/WeeklyDonationReward.js');
var GuildDonationRank 			= require('../../Contents/Guild/GuildDonationRank.js');
var GuildSkillLevelUp 			= require('../../Contents/Guild/GuildSkillLevelUp.js');
var ForceChangeAuth 			= require('../../Contents/Guild/ForceChangeAuth.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {

		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Guild Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Guild Packet Not Find User Socket ID :', p_socket.id);
			return;
		}

		if ( recv.packet_srl == user.GetPacketBuf().packet_srl ) {
			logger.info('UUID : %d, PacketSrl : %d Already Recv Packet Request', user.uuid, recv.packet_srl);
			p_socket.emit(user.GetPacketBuf().packet_cmd, JSON.stringify(user.GetPacketBuf().packet_data));
			return;
		}
			
		// 분배. 
		var ack_cmd;
		var ack_packet;

		try {
			switch(p_cmd) {
				case PacketGuild.inst.cmdReqCreateGuild() :
					ack_cmd 	= PacketGuild.inst.cmdAckCreateGuild();
					ack_packet	= PacketGuild.inst.GetPacketAckCreateGuild();
					ack_packet.packet_srl = recv.packet_srl;
					GuildCreate.inst.ReqCreateGuild(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqRecommandGuild() :
					ack_cmd 	= PacketGuild.inst.cmdAckRecommandGuild();
					ack_packet 	= PacketGuild.inst.GetPacketAckRecommandGuild();
					ack_packet.packet_srl = recv.packet_srl;
					RecommondGuild.inst.ReqRecommondGuild(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildDetailInfo() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildDetailInfo();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildDetailInfo();
					ack_packet.packet_srl = recv.packet_srl;
					GuildDetailInfo.inst.ReqGuildDetailInfo(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildJoin() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildJoin();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildJoin();
					ack_packet.packet_srl = recv.packet_srl;
					GuildJoin.inst.ReqGuildJoin(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildPendingApprovalList() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildPendingApprovalList();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildPendingApprovalList();
					ack_packet.packet_srl = recv.packet_srl;
					GuildJoinPendingApprovalList.inst.ReqGuildJoinPendingApprovalList(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildPendingApprovalProcess() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildPendingApprovalProcess();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildPendingApprovalProcess();
					ack_packet.packet_srl = recv.packet_srl;
					GuildJoinPendingApprovalProcess.inst.ReqGuildJoinPendingApprovalProcess(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildMemberBan() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildMemberBan();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildMemberBan();
					ack_packet.packet_srl = recv.packet_srl;
					GuildMemberBan.inst.ReqGuildMemberBan(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqFindGuild() :
					ack_cmd 	= PacketGuild.inst.cmdAckFindGuild();
					ack_packet 	= PacketGuild.inst.GetPacketAckFindGuild();
					ack_packet.packet_srl = recv.packet_srl;
					FindGuild.inst.ReqFindGuild(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqLeaveGuild() :
					ack_cmd 	= PacketGuild.inst.cmdAckLeaveGuild();
					ack_packet 	= PacketGuild.inst.GetPacketAckLeaveGuild();
					ack_packet.packet_srl = recv.packet_srl;
					LeaveGuild.inst.ReqLeaveGuild(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqChangeGuildInfo() :
					ack_cmd 	= PacketGuild.inst.cmdAckChangeGuildInfo();
					ack_packet 	= PacketGuild.inst.GetPacketAckChangeGuildInfo();
					ack_packet.packet_srl = recv.packet_srl;
					ChangeGuildInfo.inst.ReqChangeGuildInfo(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildInvitation() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildInvitation();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildInvitation();
					ack_packet.packet_srl = recv.packet_srl;
					GuildInvitation.inst.ReqGuildInvitation(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildInvitationList() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildInvitationList();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildInvitationList();
					ack_packet.packet_srl = recv.packet_srl;
					GuildInvitationList.inst.ReqGuildInvitationList(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildInvitationProcess() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildInvitationProcess();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildInvitationProcess();
					ack_packet.packet_srl = recv.packet_srl;
					GuildInvitationProcess.inst.ReqGuildInvitationProcess(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqChangeAuth() :
					ack_cmd 	= PacketGuild.inst.cmdAckChangeAuth();
					ack_packet 	= PacketGuild.inst.GetPacketAckChangeAuth();
					ack_packet.packet_srl = recv.packet_srl;
					ChangeAuth.inst.ReqChangeAuth(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqChangeAuthConfirm() :
					ack_cmd 	= PacketGuild.inst.cmdAckChangeAuthConfirm();
					ack_packet 	= PacketGuild.inst.GetPacketAckChangeAuthConfirm();
					ack_packet.packet_srl = recv.packet_srl;
					ChangeAuthConfirm.inst.ReqChangeAuthConfirm(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildPointDonation() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildPointDonation();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildPointDonation();
					ack_packet.packet_srl = recv.packet_srl;
					GuildPoint.inst.ReqGuildPointDonation(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildLevelup() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildLevelup();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					GuildLevelup.inst.ReqGuildLevelup(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildRaidInfo() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildRaidInfo();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildRaidInfo();
					ack_packet.packet_srl = recv.packet_srl;
					GuildRaidInfo.inst.ReqGuildRaid(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildRaidOpen() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildRaidOpen();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildRaidOpen();
					ack_packet.packet_srl = recv.packet_srl;
					GuildRaidOpen.inst.ReqGuildRaidOpen(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildRaidBattleStart() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildRaidBattleStart();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildRaidBattleStart();
					ack_packet.packet_srl = recv.packet_srl;
					GuildRaidBattleStart.inst.ReqGuildRaidBattleStart(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildRaidBattleFinish() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildRaidBattleFinish();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildRaidBattleFinish();
					ack_packet.packet_srl = recv.packet_srl;
					GuildRaidBattleFinish.inst.ReqGuildRaidBattleFinish(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildRaidRank() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildRaidRank();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildRaidRank();
					ack_packet.packet_srl = recv.packet_srl;
					GuildRaidRank.inst.ReqGuildRaidRank(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqWeeklyDonationReward() :
					ack_cmd 	= PacketGuild.inst.cmdAckWeeklyDonationReward();
					ack_packet 	= PacketGuild.inst.GetPacketAckWeeklyDonationReward();
					ack_packet.packet_srl = recv.packet_srl;
					WeeklyReward.inst.ReqWeeklyDonationReward(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqDonationRank() :
					ack_cmd 	= PacketGuild.inst.cmdAckDonationRank();
					ack_packet 	= PacketGuild.inst.GetPacketAckDonationRank();
					ack_packet.packet_srl = recv.packet_srl;
					GuildDonationRank.inst.ReqDonationRank(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqGuildSkillLevelUp() :
					ack_cmd 	= PacketGuild.inst.cmdAckGuildSkillLevelUp();
					ack_packet 	= PacketGuild.inst.GetPacketAckGuildSkillLevelUp();
					ack_packet.packet_srl = recv.packet_srl;
					GuildSkillLevelUp.inst.ReqGuildSkillLevelUp(user, recv, ack_cmd, ack_packet);
					break;

				case PacketGuild.inst.cmdReqForceChangeAuth() :
					ack_cmd 	= PacketGuild.inst.cmdAckForceChangeAuth();
					ack_packet 	= PacketGuild.inst.GetPacketAckForceChangeAuth();
					ack_packet.packet_srl = recv.packet_srl;
					ForceChangeAuth.inst.ReqForceChangeAuth(user, recv, ack_cmd, ack_packet);
					break;
					
				default :
					logger.error('UUID : %d Error Packet Dist! - data:\n', user.uuid, recv, ack_cmd);
				break;
			}
		} catch (p_error) {
			err_report.inst.SendReportExecption(user.uuid, user.account, ack_cmd, p_error.stack);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;