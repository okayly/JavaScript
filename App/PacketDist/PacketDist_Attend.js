/********************************************************************
Title : PacketDist_Attend
Date : 2016.07.25
Desc : 패킷 연결 - 출석 보상
writer: dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketAttend = require('../../Packets/PacketAttend/PacketAttend.js');

var DailyReward = require('../../Contents/Attend/DailyReward.js');
var AccumReward = require('../../Contents/Attend/AccumReward.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Attend Packet Convert - cmd is ', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Attend Packet Not Find User Socket ID : ', p_socket.id);
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
				case PacketAttend.inst.cmdReqAttendDailyReward() :
					ack_cmd		= PacketAttend.inst.cmdAckAttendDailyReward();
					ack_packet	= PacketAttend.inst.GetPacketAckAttendDailyReward();
					ack_packet.packet_srl = recv.packet_srl;
					DailyReward.inst.ReqAttendDailyReward(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAttend.inst.cmdReqAddAttendDailyReward() :
					ack_cmd		= PacketAttend.inst.cmdAckAddAttendDailyReward();
					ack_packet	= PacketAttend.inst.GetPacketAckAddAttendDailyReward();
					ack_packet.packet_srl = recv.packet_srl;
					DailyReward.inst.ReqAddAttendDailyReward(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAttend.inst.cmdReqAttendAccumReward() :
					ack_cmd		= PacketAttend.inst.cmdAckAttendAccumReward();
					ack_packet	= PacketAttend.inst.GetPacketAckAttendAccumReward();
					ack_packet.packet_srl = recv.packet_srl;
					AccumReward.inst.ReqAttendAccumReward(user, recv, ack_cmd, ack_packet);
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