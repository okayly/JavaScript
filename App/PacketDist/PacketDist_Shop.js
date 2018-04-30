/********************************************************************
Title : PacketDist_Shop
Date : 2016.05.18
Update : 2016.08.01
Desc : 패킷 연결 - 샵
writer: dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketShop = require('../../Packets/PacketShop/PacketShop.js');

var ShopID			= require('../../Contents/Shop/ShopID.js');
var ShopBuy			= require('../../Contents/Shop/ShopBuy.js');
var ShopBuyHeroExp	= require('../../Contents/Shop/ShopBuyHeroExp.js');
var ShopReset		= require('../../Contents/Shop/ShopReset.js');
var RandomShop		= require('../../Contents/Shop/RandomShop.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Shop Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Shop Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketShop.inst.cmdReqShopIDs() :
					ack_cmd 	= PacketShop.inst.cmdAckShopIDs();
					ack_packet	= PacketShop.inst.GetPacketAckShopIDs();
					ack_packet.packet_srl = recv.packet_srl;
					ShopID.inst.ReqShopIDs(user, recv, ack_cmd, ack_packet);
					break;

				case PacketShop.inst.cmdReqShopBuy() :
					ack_cmd 	= PacketShop.inst.cmdAckShopBuy();
					ack_packet	= PacketShop.inst.GetPacketAckShopBuy();
					ack_packet.packet_srl = recv.packet_srl;
					ShopBuy.inst.ReqShopBuy(user, recv, ack_cmd, ack_packet);
					break;

				case PacketShop.inst.cmdReqShopReset() :
					ack_cmd 	= PacketShop.inst.cmdAckShopReset();
					ack_packet	= PacketShop.inst.GetPacketAckShopReset();
					ack_packet.packet_srl = recv.packet_srl;
					ShopReset.inst.ReqShopReset(user, recv, ack_cmd, ack_packet);
					break;

				case PacketShop.inst.cmdReqShopResetCount() :
					ack_cmd 	= PacketShop.inst.cmdAckShopResetCount();
					ack_packet	= PacketShop.inst.GetPacketAckShopResetCount();
					ack_packet.packet_srl = recv.packet_srl;
					ShopReset.inst.ReqShopResetCount(user, recv, ack_cmd, ack_packet);
					break;

				case PacketShop.inst.cmdReqRandomShopIsOpen() :
					ack_cmd 	= PacketShop.inst.cmdAckRandomShopIsOpen();
					ack_packet	= PacketShop.inst.GetPacketAckRandomShopIsOpen();
					ack_packet.packet_srl = recv.packet_srl;
					RandomShop.inst.ReqRandomShopIsOpen(user, recv, ack_cmd, ack_packet);
					break;

				case PacketShop.inst.cmdReqRandomShopOpen() :
					ack_cmd 	= PacketShop.inst.cmdAckRandomShopOpen();
					ack_packet	= PacketShop.inst.GetPacketAckRandomShopOpen();
					ack_packet.packet_srl = recv.packet_srl;
					RandomShop.inst.ReqRandomShopOpen(user, recv, ack_cmd, ack_packet);
					break;

				case PacketShop.inst.cmdReqShopBuyHeroExp() :
					ack_cmd 	= PacketShop.inst.cmdAckShopBuyHeroExp();
					ack_packet	= PacketShop.inst.GetPacketAckShopBuyHeroExp();
					ack_packet.packet_srl = recv.packet_srl;
					ShopBuyHeroExp.inst.ReqShopBuyHeroExp(user, recv, ack_cmd, ack_packet);
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