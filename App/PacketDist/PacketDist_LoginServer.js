/********************************************************************
Title : PacketDist_LoginServer
Date : 2016.08.29
Updaate : 2016.09.29
Desc : 패킷 연결 - 로그인 서버
writer: jongwook
********************************************************************/
var PacketLoginServer = require('../../Packets/PacketLoginServer/PacketLoginServer.js');

var UserCount = require('../../Contents/LoginServer/UserCount.js');
var DuckMail = require('../../Contents/Duck/DuckMail.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = null;
		if ( typeof p_packet !== 'undefined' ) {
			recv = JSON.parse(p_packet);
		}

		var ack_cmd = undefined;
		var ack_packet = undefined;

		try {
			switch (p_cmd) {
				case PacketLoginServer.inst.cmdReqUserCount() :
					ack_cmd 	= PacketLoginServer.inst.cmdAckUserCount();
					ack_packet	= PacketLoginServer.inst.GetPacketAckUserCount();

					UserCount.inst.ReqUserCount(p_socket, recv, ack_cmd, ack_packet);
					break;

				case PacketLoginServer.inst.cmdReqSendReservationMail() :
					DuckMail.inst.ReqSendReservationMail(p_socket, recv, ack_cmd, ack_packet);
					break;
					
				default :
					logger.error('Error Packet Dist! Cmd : %d', p_cmd);
					break;
			}
		} catch (p_error) {
			err_report.inst.SendReportExecption(0, p_socket.id, ack_cmd, p_error.stack);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;