/********************************************************************
Title : PacketDist_Summon
Date : 2016.05.18
Update : 2016.08.17
Desc : 패킷 연결 - 궁극 소환수
writer: jongwook
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketSummon = require('../../Packets/PacketSummon/PacketSummon.js');

var SummonGage				= require('../../Contents/Summon/SummonGage.js');
var SummonInfo				= require('../../Contents/Summon/SummonInfo.js');
var SummonOpen				= require('../../Contents/Summon/SummonOpen.js');
var SummonUse				= require('../../Contents/Summon/SummonUse.js');
var SummonLevelup			= require('../../Contents/Summon/SummonLevelup.js');
var SummonLevelupCash		= require('../../Contents/Summon/SummonLevelupCash.js');
var SummonTraitLevelup		= require('../../Contents/Summon/SummonTraitLevelup.js');
var SummonTraitLevelupCash	= require('../../Contents/Summon/SummonTraitLevelupCash.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {

		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Summon Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Summon Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketSummon.inst.cmdReqSummonInfo() :
					ack_cmd 	= PacketSummon.inst.cmdAckSummonInfo();
					ack_packet	= PacketSummon.inst.GetPacketAckSummonInfo();
					ack_packet.packet_srl = recv.packet_srl;
					SummonInfo.inst.ReqSummonInfo(user, recv, ack_cmd, ack_packet);
					break;

				case PacketSummon.inst.cmdReqSummonGage() :
					ack_cmd 	= PacketSummon.inst.cmdAckSummonGage();
					ack_packet	= PacketSummon.inst.GetPacketAckSummonGage();
					ack_packet.packet_srl = recv.packet_srl;
					SummonGage.inst.ReqSummonGage(user, recv, ack_cmd, ack_packet);
					break;

				case PacketSummon.inst.cmdReqSummonOpen() :
					ack_cmd 	= PacketSummon.inst.cmdAckSummonOpen();
					ack_packet	= PacketSummon.inst.GetPacketAckSummonOpen();
					ack_packet.packet_srl = recv.packet_srl;
					SummonOpen.inst.ReqSummonOpen(user, recv, ack_cmd, ack_packet);
					break;

				case PacketSummon.inst.cmdReqSummonUse() :
					ack_cmd 	= PacketSummon.inst.cmdAckSummonUse();
					ack_packet	= PacketSummon.inst.GetPacketAckSummonUse();
					ack_packet.packet_srl = recv.packet_srl;
					SummonUse.inst.ReqSummonUse(user, recv, ack_cmd, ack_packet);
					break;

				case PacketSummon.inst.cmdReqSummonLevelup() :
					ack_cmd 	= PacketSummon.inst.cmdAckSummonLevelup();
					ack_packet	= PacketSummon.inst.GetPacketAckSummonLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					SummonLevelup.inst.ReqSummonLevelup(user, recv, ack_cmd, ack_packet);
					break;

				case PacketSummon.inst.cmdReqSummonLevelupCash() :
					ack_cmd 	= PacketSummon.inst.cmdAckSummonLevelupCash();
					ack_packet	= PacketSummon.inst.GetPacketAckSummonLevelupCash();
					ack_packet.packet_srl = recv.packet_srl;
					SummonLevelupCash.inst.ReqSummonLevelupCash(user, recv, ack_cmd, ack_packet);
					break;

				case PacketSummon.inst.cmdReqSummonTraitLevelup() :
					ack_cmd 	= PacketSummon.inst.cmdAckSummonTraitLevelup();
					ack_packet	= PacketSummon.inst.GetPacketAckSummonLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					SummonTraitLevelup.inst.ReqSummonTraitLevelup(user, recv, ack_cmd, ack_packet);
					break;

				case PacketSummon.inst.cmdReqSummonTraitLevelupCash() :
					ack_cmd 	= PacketSummon.inst.cmdAckSummonTraitLevelupCash();
					ack_packet	= PacketSummon.inst.GetPacketAckSummonLevelupCash();
					ack_packet.packet_srl = recv.packet_srl;
					SummonTraitLevelupCash.inst.ReqSummonTraitLevelupCash(user, recv, ack_cmd, ack_packet);
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