/********************************************************************
Title : PacketDist_WeeklyDungeon
Date : 2016.11.25
Update : 
Desc : 패킷 연결 - 요일던전
writer: dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketWeeklyDungeon = require('../../Packets/PacketWeeklyDungeon/PacketWeeklyDungeon.js');

var WeeklyDungeonStart = require('../../Contents/WeeklyDungeon/WeeklyDungeonStart.js');
var WeeklyDungeonFinish = require('../../Contents/WeeklyDungeon/WeeklyDungeonFinish.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {

		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error WeeklyDungeon Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error WeeklyDungeon Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketWeeklyDungeon.inst.cmdReqWeeklyDungeonStart() :
					ack_cmd 	= PacketWeeklyDungeon.inst.cmdAckWeeklyDungeonStart();
					ack_packet	= PacketWeeklyDungeon.inst.GetPacketAckWeeklyDungeonStart();
					ack_packet.packet_srl = recv.packet_srl;
					WeeklyDungeonStart.inst.ReqWeeklyDungeonStart(user, recv, ack_cmd, ack_packet);
					break;

				case PacketWeeklyDungeon.inst.cmdReqWeeklyDungeonFinish() :
					ack_cmd 	= PacketWeeklyDungeon.inst.cmdAckWeeklyDungeonFinish();
					ack_packet	= PacketWeeklyDungeon.inst.GetPacketAckWeeklyDungeonFinish();
					ack_packet.packet_srl = recv.packet_srl;
					WeeklyDungeonFinish.inst.ReqWeeklyDungeonFinish(user, recv, ack_cmd, ack_packet);
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