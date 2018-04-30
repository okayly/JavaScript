/********************************************************************
Title : PacketDist_Battle
Date : 2016.05.18
Update : 2016.08.16
Desc : 패킷 연결 - 배틀
writer : dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketBattle = require('../../Packets/PacketBattle/PacketBattle.js');

var BattleStart		= require('../../Contents/Battle/BattleStart.js');
var BattleFinish	= require('../../Contents/Battle/BattleFinish.js');
var BattleSweep		= require('../../Contents/Battle/BattleSweep.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {

		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Battle Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Battle Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketBattle.inst.cmdReqBattleStart() :
					ack_cmd 	= PacketBattle.inst.cmdAckBattleStart();
					ack_packet	= PacketBattle.inst.GetPacketAckStart();
					ack_packet.packet_srl = recv.packet_srl;
					BattleStart.inst.ReqBattleStart(user, recv, ack_cmd, ack_packet);
					break;

				case PacketBattle.inst.cmdReqBattleFinish() :
					ack_cmd 	= PacketBattle.inst.cmdAckBattleFinish();
					ack_packet	= PacketBattle.inst.GetPacketAckFinish();
					ack_packet.packet_srl = recv.packet_srl;
					BattleFinish.inst.ReqBattleFinish(user, recv, ack_cmd, ack_packet);
					break;

				case PacketBattle.inst.cmdReqBattleSweep() :
					ack_cmd 	= PacketBattle.inst.cmdAckBattleSweep();
					ack_packet	= PacketBattle.inst.GetPacketAckSweep();
					ack_packet.packet_srl = recv.packet_srl;
					BattleSweep.inst.ReqBattleSweep(user, recv, ack_cmd, ack_packet);
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