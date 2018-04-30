/********************************************************************
Title : 
Date : 
Update : 
Desc : 
writer : dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketPVP = require('../../Packets/PacketPVP/PacketPVP.js');

var PVPInfo			= require('../../Contents/PVP/PVPInfo.js');
var RenewMatchPlayer	= require('../../Contents/PVP/RenewMatchPlayer.js');
var PVPStart			= require('../../Contents/PVP/PVPStart.js');
var PVPFinish		= require('../../Contents/PVP/PVPFinish.js');
var PVPAchievementReward= require('../../Contents/PVP/PVPAchievementReward.js');
var PVPLeagueRankList	= require('../../Contents/PVP/PVPLeagueRankList.js');
var PVPGroupRankList	= require('../../Contents/PVP/PVPGroupRankList.js');
var PVPRecord		= require('../../Contents/PVP/PVPRecord.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error PVP Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error PVP Packet Not Find User Socket ID :', p_socket.id);
			return;
		}

		if ( recv.packet_srl == user.GetPacketBuf().packet_srl ) {
			logger.info('UUID : %d, PacketSrl : %d Already Recv Packet Request', user.uuid, recv.packet_srl);
			p_socket.emit(user.GetPacketBuf().packet_cmd, JSON.stringify(user.GetPacketBuf().packet_data));
			return;
		}
			
		// 분배. 
		var ack_cmd = undefined;
		var ack_packet = undefined;

		try {
			switch(p_cmd) {
				case PacketPVP.inst.cmdReqPVPInfoUpdate() :
					ack_cmd 	= PacketPVP.inst.cmdAckPVPInfoUpdate();
					ack_packet	= PacketPVP.inst.GetPacketAckPVPInfoUpdate();
					ack_packet.packet_srl = recv.packet_srl;
					PVPInfo.inst.ReqPvPInfoUpdate(user, recv, ack_cmd, ack_packet);
					break;

				case PacketPVP.inst.cmdReqFindMatchPlayer() :
					ack_cmd 	= PacketPVP.inst.cmdAckFindMatchPlayer();
					ack_packet	= PacketPVP.inst.GetPacketAckFindMatchPlayer();
					ack_packet.packet_srl = recv.packet_srl;
					RenewMatchPlayer.inst.ReqFindMatchPlayer(user, recv, ack_cmd, ack_packet);
					break;

				case PacketPVP.inst.cmdReqPvpStart() :
					ack_cmd 	= PacketPVP.inst.cmdAckPvpStart();
					ack_packet	= PacketPVP.inst.GetPacketAckPvpStart();
					ack_packet.packet_srl = recv.packet_srl;
					PVPStart.inst.ReqPvpStart(user, recv, ack_cmd, ack_packet);
					break;

				case PacketPVP.inst.cmdReqPvpFinish() :
					ack_cmd 	= PacketPVP.inst.cmdAckPvpFinish();
					ack_packet	= PacketPVP.inst.GetPacketAckPvpFinish();
					ack_packet.packet_srl = recv.packet_srl;
					PVPFinish.inst.ReqPvpFinish(user, recv, ack_cmd, ack_packet);
					break;

				case PacketPVP.inst.cmdReqPvpAchievementReward() :
					ack_cmd 	= PacketPVP.inst.cmdAckPvpAchievementReward();
					ack_packet	= PacketPVP.inst.GetPacketAckPvpAchievementReward();
					ack_packet.packet_srl = recv.packet_srl;
					PVPAchievementReward.inst.ReqPvpAchievementReward(user, recv, ack_cmd, ack_packet);
					break;

				case PacketPVP.inst.cmdReqPvpLeagueRankList() :
					ack_cmd 	= PacketPVP.inst.cmdAckPvpLeagueRankList();
					ack_packet	= PacketPVP.inst.GetPacketAckPvpLeagueRankList();
					ack_packet.packet_srl = recv.packet_srl;
					PVPLeagueRankList.inst.ReqPvpLeagueRankList(user, recv, ack_cmd, ack_packet);
					break;

				case PacketPVP.inst.cmdReqPvpGroupRankList() :
					ack_cmd 	= PacketPVP.inst.cmdAckPvpGroupRankList();
					ack_packet	= PacketPVP.inst.GetPacketAckPvpGroupRankList();
					ack_packet.packet_srl = recv.packet_srl;
					PVPGroupRankList.inst.ReqPvpGroupRankList(user, recv, ack_cmd, ack_packet);
					break;

				case PacketPVP.inst.cmdReqPvpRecord() :
					ack_cmd 	= PacketPVP.inst.cmdAckPvpRecord();
					ack_packet	= PacketPVP.inst.GetPacketAckPvpRecord();
					ack_packet.packet_srl = recv.packet_srl;
					PVPRecord.inst.ReqPvpRecord(user, recv, ack_cmd, ack_packet);
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