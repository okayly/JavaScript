/********************************************************************
Title : PacketDist_Mission
Date : 2016.05.18
Update : 2016.08.16
Desc : 패킷 연결 - 미션
writer : dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketMission = require('../../Packets/PacketMission/PacketMission.js');

var MissionReward	= require('../../Contents/Mission/MissionReward.js');
var MissionProgress	= require('../../Contents/Mission/MissionProgress.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Mission Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Mission Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketMission.inst.cmdReqMissionReward() :
					ack_cmd 	= PacketMission.inst.cmdAckMissionReward();
					ack_packet	= PacketMission.inst.GetPacketAckMissionReward();
					ack_packet.packet_srl = recv.packet_srl;
					MissionReward.inst.ReqMissionReward(user, recv, ack_cmd, ack_packet);
					break;

				case PacketMission.inst.cmdReqMissionProgress() :
					ack_cmd 	= PacketMission.inst.cmdAckMissionProgress();
					ack_packet	= PacketMission.inst.GetPacketAckMissionProgress();
					ack_packet.packet_srl = recv.packet_srl;
					MissionProgress.inst.ReqMissionProgess(user, recv, ack_cmd, ack_packet);
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