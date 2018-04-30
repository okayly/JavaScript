/********************************************************************
Title : PacketDist_Inventory
Date : 2016.07.21
Desc : 패킷 연결 - 가방
writer : dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketInventory = require('../../Packets/PacketInventory/PacketInventory.js');

var SellItem	= require('../../Contents/Inventory/SellItem.js');
var UserItem	= require('../../Contents/Inventory/UseItem.js');
var UseRandomBox= require('../../Contents/Inventory/UseRandomBox.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Inventory Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Inventory Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketInventory.inst.cmdReqUseItem() :
					ack_cmd					= PacketInventory.inst.cmdAckUseItem();
					ack_packet				= PacketInventory.inst.GetPacketAckUseItem();
					ack_packet.packet_srl	= recv.packet_srl;

					UserItem.inst.ReqUseItem(user, recv, ack_cmd, ack_packet);
					break;

				case PacketInventory.inst.cmdReqSellItem() :
					ack_cmd					= PacketInventory.inst.cmdAckSellItem();
					ack_packet				= PacketInventory.inst.GetPacketAckSellItem();
					ack_packet.packet_srl	= recv.packet_srl;

					SellItem.inst.ReqSellItem(user, recv, ack_cmd, ack_packet);
					break;

				case PacketInventory.inst.cmdReqUseRandomBox() :
					ack_cmd					= PacketInventory.inst.cmdAckUseRandomBox();
					ack_packet				= PacketInventory.inst.GetPacketAckUseRandomBox();
					ack_packet.packet_srl	= recv.packet_srl;

					UseRandomBox.inst.ReqUseRandomBox(user, recv, ack_cmd, ack_packet);
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