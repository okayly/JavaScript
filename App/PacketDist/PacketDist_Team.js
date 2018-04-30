/********************************************************************
Title : PacketDist_Team
Date : 2016.05.18
Update : 2016.08.16
Desc : 패킷 연결 - 팀
writer: dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketTeam = require('../../Packets/PacketTeam/PacketTeam.js');

var TeamChange = require('../../Contents/Team/TeamChange.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Team Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Team Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketTeam.inst.cmdReqChangeTeam() :
					ack_cmd 	= PacketTeam.inst.cmdAckChangeTeam();
					ack_packet	= PacketTeam.inst.GetPacketAckChangeTeam();
					ack_packet.packet_srl = recv.packet_srl;
					TeamChange.inst.ReqChangeTeam(user, recv, ack_cmd, ack_packet);
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