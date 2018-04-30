/********************************************************************
Title : PacketDist_EquipItem
Date : 2016.05.18
Update : 2017.04.03
Desc : 패킷 연결 - 장착 아이템
writer : dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketEquipItem = require('../../Packets/PacketEquipItem/PacketEquipItem.js');

var EquipItem			= require('../../Contents/EquipItem/EquipItem.js');
var EquipItemLevelup	= require('../../Contents/EquipItem/EquipItemLevelup.js');
var EquipItemReinforce	= require('../../Contents/EquipItem/EquipItemReinforce.js');
var EquipItemLock		= require('../../Contents/EquipItem/EquipItemLock.js');
var EquipItemSell		= require('../../Contents/EquipItem/EquipItemSell.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error EquipItem Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error EquipItem Packet Not Find User Socket ID :', p_socket.id);
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
			console.log('p_cmd', p_cmd);

			switch(p_cmd) {
				case PacketEquipItem.inst.cmdReqEquipment() :
					ack_cmd 	= PacketEquipItem.inst.cmdAckEquipment();
					ack_packet	= PacketEquipItem.inst.GetPacketAckEquipment();
					ack_packet.packet_srl = recv.packet_srl;
					EquipItem.inst.ReqEquipment(user, recv, ack_cmd, ack_packet);
					break;

				case PacketEquipItem.inst.cmdReqEquipItem() :
					ack_cmd 	= PacketEquipItem.inst.cmdAckEquipItem();
					ack_packet	= PacketEquipItem.inst.GetPacketAckEquipItem();
					ack_packet.packet_srl = recv.packet_srl;
					EquipItem.inst.ReqEquipItem(user, recv, ack_cmd, ack_packet);
					break;

				case PacketEquipItem.inst.cmdReqEquipItemOne() :
					ack_cmd 	= PacketEquipItem.inst.cmdAckEquipItemOne();
					ack_packet	= PacketEquipItem.inst.GetPacketAckEquipItemOne();
					ack_packet.packet_srl = recv.packet_srl;
					EquipItem.inst.ReqEquipItemOne(user, recv, ack_cmd, ack_packet);
					break;

				case PacketEquipItem.inst.cmdReqEquipItemLevelup() :
					ack_cmd 	= PacketEquipItem.inst.cmdAckEquipItemLevelup();
					ack_packet	= PacketEquipItem.inst.GetPacketAckEquipItemLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					EquipItemLevelup.inst.ReqEquipItemLevelup(user, recv, ack_cmd, ack_packet);
					break;

				case PacketEquipItem.inst.cmdReqEquipItemReinforce() :
					ack_cmd 	= PacketEquipItem.inst.cmdAckEquipItemReinforce();
					ack_packet	= PacketEquipItem.inst.GetPacketAckEquipItemReinforce();
					ack_packet.packet_srl = recv.packet_srl;
					EquipItemReinforce.inst.ReqEquipItemReinforce(user, recv, ack_cmd, ack_packet);
					break;

				case PacketEquipItem.inst.cmdReqEquipItemLock() :
					ack_cmd 	= PacketEquipItem.inst.cmdAckEquipItemLock();
					ack_packet	= PacketEquipItem.inst.GetPacketAckEquipItemLock();
					ack_packet.packet_srl = recv.packet_srl;
					EquipItemLock.inst.ReqEquipItemLock(user, recv, ack_cmd, ack_packet);
					break;

				case PacketEquipItem.inst.cmdReqEquipItemSell() :
					ack_cmd 	= PacketEquipItem.inst.cmdAckEquipItemSell();
					ack_packet	= PacketEquipItem.inst.GetPacketAckEquipItemSell();
					ack_packet.packet_srl = recv.packet_srl;
					EquipItemSell.inst.ReqEquipItemSell(user, recv, ack_cmd, ack_packet);
					break;



				case PacketEquipItem.inst.cmdReqHeroEquipItem() :
					ack_cmd 	= PacketEquipItem.inst.cmdAckHeroEquipItem();
					ack_packet	= PacketEquipItem.inst.GetPacketAckHeroEquipItem();
					ack_packet.packet_srl = recv.packet_srl;
					EquipItem.inst.ReqHeroEquipItem(user, recv, ack_cmd, ack_packet);
					break;

				default :
					err_report.inst.SendReportExecption(user.uuid, user.account, ack_cmd, p_error.stack);
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