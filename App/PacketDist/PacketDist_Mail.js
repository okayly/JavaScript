/********************************************************************
Title : PacketDist_Mail
Date : 2016.05.18
Update : 2016.08.16
Desc : 패킷 연결 - 우편
writer : dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketMail = require('../../Packets/PacketMail/PacketMail.js');

var Mail = require('../../Contents/Mail/Mail.js');
var MailSend = require('../../Contents/Mail/MailSend.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Challenge Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Challenge Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketMail.inst.cmdReqMailSend() :
					ack_cmd 	= PacketMail.inst.cmdAckMailSend();
					ack_packet	= PacketMail.inst.GetPacketAckMailSend();
					ack_packet.packet_srl = recv.packet_srl;
					MailSend.inst.ReqMailSend(user, recv, ack_cmd, ack_packet);
					break;

				case PacketMail.inst.cmdReqMailReadInfo() :
					ack_cmd 	= PacketMail.inst.cmdAckMailReadInfo();
					ack_packet	= PacketMail.inst.GetPacketAckMailReadInfo();
					ack_packet.packet_srl = recv.packet_srl;
					Mail.inst.ReqMailReadInfo(user, recv, ack_cmd, ack_packet);
					break;

				case PacketMail.inst.cmdReqMailList() :
					ack_cmd 	= PacketMail.inst.cmdAckMailList();
					ack_packet	= PacketMail.inst.GetPacketAckMailList();
					ack_packet.packet_srl = recv.packet_srl;
					Mail.inst.ReqMailList(user, recv, ack_cmd, ack_packet);
					break;

				case PacketMail.inst.cmdReqMailRead() :
					ack_cmd 	= PacketMail.inst.cmdAckMailRead();
					ack_packet	= PacketMail.inst.GetPacketAckMailRead();
					ack_packet.packet_srl = recv.packet_srl;
					Mail.inst.ReqMailRead(user, recv, ack_cmd, ack_packet);
					break;

				case PacketMail.inst.cmdReqMailReward() :
					ack_cmd 	= PacketMail.inst.cmdAckMailReward();
					ack_packet	= PacketMail.inst.GetPacketAckMailReward();
					ack_packet.packet_srl = recv.packet_srl;
					Mail.inst.ReqMailReward(user, recv, ack_cmd, ack_packet);
					break;

				case PacketMail.inst.cmdReqMailRewardAll() :
					ack_cmd 	= PacketMail.inst.cmdAckMailRewardAll();
					ack_packet	= PacketMail.inst.GetPacketAckMailRewardAll();
					ack_packet.packet_srl = recv.packet_srl;
					Mail.inst.ReqMailRewardAllRe(user, recv, ack_cmd, ack_packet);
					break;

				default :
					logger.error('UUID : %d Error Packet Dist! Cmd : %d', user.uuid, p_cmd);
				break;
			}
		} catch (p_error) {
			// console.log('p_error', p_error);
			err_report.inst.SendReportExecption(user.uuid, user.account, ack_cmd, p_error);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;