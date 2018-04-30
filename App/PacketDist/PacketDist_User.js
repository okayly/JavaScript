/********************************************************************
Title : PacketDist_User
Date : 2016.07.21
Udpate : 2016.08.09
Desc : 패킷 연결 - 유저
writer : dongsu
********************************************************************/
var UserMgr			= require('../../Data/Game/UserMgr.js');
var Reconnect		= require('../../Contents/User/Reconnect.js');
var PacketAccount		= require('../../Packets/PacketAccount/PacketAccount.js');

var Logon			= require('../../Contents/User/Logon.js');
var DefaultInfo		= require('../../Contents/User/DefaultInfo.js');
var Inventory			= require('../../Contents/User/Inventory.js');
var Hero			= require('../../Contents/User/Hero.js');
var Team			= require('../../Contents/User/Team.js');
var Stage			= require('../../Contents/User/Stage.js');
var Vip				= require('../../Contents/User/Vip.js');
var Gacha			= require('../../Contents/User/Gacha.js');
var Attend			= require('../../Contents/User/Attend.js');
var Guild			= require('../../Contents/User/Guild.js');
var Mission			= require('../../Contents/User/Mission.js');
var ChangeNick		= require('../../Contents/User/ChangeNick.js');
var ChangeUserIcon		= require('../../Contents/User/ChangeUserIcon.js');
var WeeklyDungeon		= require('../../Contents/User/WeeklyDungeon.js');
var PVPInfo 			= require('../../Contents/User/PVPInfo.js');

var UserChapterReward	= require('../../Contents/Account/UserChapterReward.js');
var VipReward		= require('../../Contents/Vip/VipReward.js');


(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Packet Convert - cmd is ', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		// console.log('PacketDist_User.js user', user);
		if ( user == undefined && p_cmd != PacketAccount.inst.cmdReqLogon() && p_cmd != PacketAccount.inst.cmdReqReConnect()) {
			logger.error('Error Packet Not Find User Socket ID : ', p_socket.id);
			return;
		}

		if ( user != undefined) {
			if ( recv.packet_srl == user.GetPacketBuf().packet_srl ) {
				logger.info('UUID : %d, PacketSrl : %d Already Recv Packet Request', user.uuid, recv.packet_srl);
				p_socket.emit(user.GetPacketBuf().packet_cmd, JSON.stringify(user.GetPacketBuf().packet_data));
				return;
			}	
		}
			
		// 분배. 
		var ack_cmd;
		var ack_packet;
		try {
			switch(p_cmd) {
				case PacketAccount.inst.cmdReqLogon() :
					ack_cmd 	= PacketAccount.inst.cmdAckLogon();
					ack_packet	= PacketAccount.inst.GetPacketAckLogon();
					ack_packet.packet_srl = recv.packet_srl;
					Logon.inst.ReqLogon(p_socket, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqUser() :
					ack_cmd 	= PacketAccount.inst.cmdAckUser();
					ack_packet	= PacketAccount.inst.GetPacketAckUser();
					ack_packet.packet_srl = recv.packet_srl;
					DefaultInfo.inst.ReqDefaultInfo(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqInventory() :
					ack_cmd 	= PacketAccount.inst.cmdAckInventory();
					ack_packet	= PacketAccount.inst.GetPacketAckInventory();
					ack_packet.packet_srl = recv.packet_srl;
					Inventory.inst.ReqInventory(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqHeroBases() :
					ack_cmd 	= PacketAccount.inst.cmdAckHeroBases();
					ack_packet	= PacketAccount.inst.GetPacketAckHeroBases();
					ack_packet.packet_srl = recv.packet_srl;
					Hero.inst.ReqHero(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqTeam() :
					ack_cmd 	= PacketAccount.inst.cmdAckTeam();
					ack_packet	= PacketAccount.inst.GetPacketAckTeam();
					ack_packet.packet_srl = recv.packet_srl;
					Team.inst.ReqTeam(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqStageInfo() :
					ack_cmd 	= PacketAccount.inst.cmdAckStageInfo();
					ack_packet	= PacketAccount.inst.GetPacketAckStageInfo();
					ack_packet.packet_srl = recv.packet_srl;
					Stage.inst.ReqStage(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqVip() :
					ack_cmd 	= PacketAccount.inst.cmdAckVip();
					ack_packet	= PacketAccount.inst.GetPacketAckVip();
					ack_packet.packet_srl = recv.packet_srl;
					Vip.inst.ReqVip(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqGachaInfo() :
					ack_cmd 	= PacketAccount.inst.cmdAckGachaInfo();
					ack_packet	= PacketAccount.inst.GetPacketAckGachaInfo();
					ack_packet.packet_srl = recv.packet_srl;
					Gacha.inst.ReqGacha(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqWeeklyDungeonExecCount() :
					ack_cmd 	= PacketAccount.inst.cmdAckWeeklyDungeonExecCount();
					ack_packet	= PacketAccount.inst.GetPacketAckWeeklyDungeonExecCount();
					ack_packet.packet_srl = recv.packet_srl;
					WeeklyDungeon.inst.ReqWeeklyDungeon(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqAttendInfo() :
					ack_cmd 	= PacketAccount.inst.cmdAckAttendInfo();
					ack_packet	= PacketAccount.inst.GetPacketAckAttendInfo();
					ack_packet.packet_srl = recv.packet_srl;
					Attend.inst.ReqAttend(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqGuildInfo() :
					ack_cmd 	= PacketAccount.inst.cmdAckGuildInfo();
					ack_packet	= PacketAccount.inst.GetPacketAckGuildInfo();
					ack_packet.packet_srl = recv.packet_srl;
					Guild.inst.ReqGuild(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqMissionInfo() :
					ack_cmd 	= PacketAccount.inst.cmdAckMissionInfo();
					ack_packet	= PacketAccount.inst.GetPacketAckMissionInfo();
					ack_packet.packet_srl = recv.packet_srl;
					Mission.inst.ReqMission(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqChapterReward() :
					ack_cmd 	= PacketAccount.inst.cmdAckChapterReward();
					ack_packet	= PacketAccount.inst.GetPacketAckChapterReward();
					ack_packet.packet_srl = recv.packet_srl;
					UserChapterReward.inst.ReqChapterReward(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqVipReward() : 
					ack_cmd 	= PacketAccount.inst.cmdAckVipReward();
					ack_packet	= PacketAccount.inst.GetPacketAckVipReward();
					ack_packet.packet_srl = recv.packet_srl;
					VipReward.inst.ReqVipReward(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqReConnect() :
					ack_cmd 	= PacketAccount.inst.cmdAckReConnect();
					ack_packet	= PacketAccount.inst.GetPacketAckReConnect();
					ack_packet.packet_srl = recv.packet_srl;
					Reconnect.inst.ReqReconnect(p_socket, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqChangeNick() :
					ack_cmd 	= PacketAccount.inst.cmdAckChangeNick();
					ack_packet	= PacketAccount.inst.GetPacketAckChangeNick();
					ack_packet.packet_srl = recv.packet_srl;
					ChangeNick.inst.ReqChangeNick(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqChangeUserIcon() :
					ack_cmd 	= PacketAccount.inst.cmdAckChangeUserIcon();
					ack_packet	= PacketAccount.inst.GetPacketAckChangeUserIcon();
					ack_packet.packet_srl = recv.packet_srl;
					ChangeUserIcon.inst.ReqChangeUserIcon(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccount.inst.cmdReqPvpInfo() :
					ack_cmd 	= PacketAccount.inst.cmdAckPvpInfo();
					ack_packet	= PacketAccount.inst.GetPacketAckPvpInfo();
					ack_packet.packet_srl = recv.packet_srl;
					PVPInfo.inst.ReqPvPInfo(user, recv, ack_cmd, ack_packet);
					break;				
					
				default :
					logger.error('UUID : %d Error Packet Dist! Cmd : %d', user.uuid, p_cmd);
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