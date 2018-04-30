/********************************************************************
Title : PacketDist_AccountBuff
Date : 2016.08.09
Udpate : 2016.08.22
Desc : 패킷 연결 - 계정 버프
writer : jongwook
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketAccountBuff = require('../../Packets/PacketAccountBuff/PacketAccountBuff.js');

var AccountBuffInfo		= require('../../Contents/AccountBuff/AccountBuffInfo.js');
var AccountBuffLevelup	= require('../../Contents/AccountBuff/AccountBuffLevelup.js');
var AccountBuffReset	= require('../../Contents/AccountBuff/AccountBuffReset.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Packet Convert - cmd is:', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Packet Not Find: %s, User Socket ID:', p_cmd, p_socket.id);
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
				case PacketAccountBuff.inst.cmdReqAccountBuffInfo() :
					ack_cmd 	= PacketAccountBuff.inst.cmdAckAccountBuffInfo();
					ack_packet	= PacketAccountBuff.inst.GetPacketAckAccountBuffInfo();
					ack_packet.packet_srl = recv.packet_srl;
					AccountBuffInfo.inst.ReqAccountBuffInfo(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccountBuff.inst.cmdReqAccountBuffLevelup() :
					ack_cmd 	= PacketAccountBuff.inst.cmdAckAccountBuffLevelup();
					ack_packet	= PacketAccountBuff.inst.GetPacketAckAccountBuffLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					AccountBuffLevelup.inst.ReqAccountBuffLevelup(user, recv, ack_cmd, ack_packet);
					break;

				case PacketAccountBuff.inst.cmdReqAccountBuffReset() :
					ack_cmd 	= PacketAccountBuff.inst.cmdAckAccountBuffReset();
					ack_packet	= PacketAccountBuff.inst.GetPacketAckAccountBuffReset();
					ack_packet.packet_srl = recv.packet_srl;
					AccountBuffReset.inst.ReqAccountBuffReset(user, recv, ack_cmd, ack_packet);
					break;
				
				default :
					logger.error('Error Packet Dist! cmd:', p_cmd);
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