/********************************************************************
Title : PacketDist_Version
Date : 2016.05.30
Updaate : 2016.08.16
Desc : 패킷 연결 - 버전
writer: jongwook
********************************************************************/
var PacketVersion = require('../../Packets/PacketVersion/PacketVersion.js');

var Version = require('../../Contents/Version/Version.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Packet Convert - cmd is', p_cmd);
			return;
		}

		var ack_cmd = undefined;
		var ack_packet = undefined;

		try {
			switch(p_cmd) {
				case PacketVersion.inst.cmdReqVersion() :
					ack_cmd 	= PacketVersion.inst.cmdAckVersion();
					ack_packet	= PacketVersion.inst.GetPacketAckVersion();
					ack_packet.packet_srl = recv.packet_srl;
					Version.inst.ReqVersion(p_socket, recv, ack_cmd, ack_packet);
					break;
					
				default :
					logger.error('Error Packet Dist! Cmd : %d', p_cmd);
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