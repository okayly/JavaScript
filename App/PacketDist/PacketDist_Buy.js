/********************************************************************
Title : Packet dist - Buy
Date : 2016.04.28
Update : 2017.02.07
Desc : 구매
writer: jongwook
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketBuy = require('../../Packets/PacketBuy/PacketBuy.js');

var BuyCash			= require('../../Contents/Buy/BuyCash.js');
var BuyGold			= require('../../Contents/Buy/BuyGold.js');
var BuySkillPoint		= require('../../Contents/Buy/BuySkillPoint.js');
var BuyStamina		= require('../../Contents/Buy/BuyStamina.js');
var BuyPVPAbleCount	= require('../../Contents/Buy/BuyPVPAbleCount.js');
var ProphecySpringAbleCount	= require('../../Contents/Buy/BuyProphecySpringAbleCount.js');
var BuyEquipItemInventorySlot	= require('../../Contents/Buy/BuyEquipItemInventorySlot.js');


(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if (recv == null) {
			logger.error('Error Packet Convert - cmd is:', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if (user == undefined) {
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
				case PacketBuy.inst.cmdReqBuyGold() :
					ack_cmd 	= PacketBuy.inst.cmdAckBuyGold();
					ack_packet	= PacketBuy.inst.GetPacketAckBuyGold();
					ack_packet.packet_srl = recv.packet_srl;
					BuyGold.inst.ReqBuyGold(user, recv, ack_cmd, ack_packet);
				break;

				case PacketBuy.inst.cmdReqBuySkillPoint() :
					ack_cmd = PacketBuy.inst.cmdAckBuySkillPoint();
					ack_packet = PacketBuy.inst.GetPacketAckBuySkillPoint();
					ack_packet.packet_srl = recv.packet_srl;
					BuySkillPoint.inst.ReqBuySkillPoint(user, recv, ack_cmd, ack_packet);
				break;

				case PacketBuy.inst.cmdReqBuyStamina() :
					ack_cmd 	= PacketBuy.inst.cmdAckBuyStamina();
					ack_packet	= PacketBuy.inst.GetPacketAckBuyStamina();
					ack_packet.packet_srl = recv.packet_srl;
					BuyStamina.inst.ReqBuyStamina(user, recv, ack_cmd, ack_packet);
				break;

				case PacketBuy.inst.cmdReqBuyCash() :
					ack_cmd 	= PacketBuy.inst.cmdAckBuyCash();
					ack_packet	= PacketBuy.inst.GetPacketAckBuyCash();
					ack_packet.packet_srl = recv.packet_srl;
					BuyCash.inst.ReqBuyCash(user, recv, ack_cmd, ack_packet);
				break;

				case PacketBuy.inst.cmdReqBuySkillPoint() :
					ack_cmd 	= PacketBuy.inst.cmdAckBuySkillPoint();
					ack_packet	= PacketBuy.inst.GetPacketAckBuyStamina();
					ack_packet.packet_srl = recv.packet_srl;
					BuySkillPoint.inst.ReqBuySkillPoint(user, recv, ack_cmd, ack_packet);
				break;

				case PacketBuy.inst.cmdReqProphecySpringAbleCount() :
					ack_cmd 	= PacketBuy.inst.cmdAckProphecySpringAbleCount();
					ack_packet	= PacketBuy.inst.GetPacketAckBuyProphecySpringAbleCount();
					ack_packet.packet_srl = recv.packet_srl;
					ProphecySpringAbleCount.inst.ReqAbleCount(user, recv, ack_cmd, ack_packet);
				break;

				case PacketBuy.inst.cmdReqBuyEquipItemInventorySlot() :
					ack_cmd 	= PacketBuy.inst.cmdAckBuyEquipItemInventorySlot();
					ack_packet	= PacketBuy.inst.GetPacketAckBuyEquipItemInventorySlot();
					ack_packet.packet_srl = recv.packet_srl;
					BuyEquipItemInventorySlot.inst.ReqBuyEquipItemInventorySlot(user, recv, ack_cmd, ack_packet);
				break;

				case PacketBuy.inst.cmdReqBuyPvpAbleCount() :
					ack_cmd 	= PacketBuy.inst.cmdAckBuyPvpAbleCount();
					ack_packet	= PacketBuy.inst.GetPacketAckBuyPvpAbleCount();
					ack_packet.packet_srl = recv.packet_srl;
					BuyPVPAbleCount.inst.ReqBuyPvpAbleCount(user, recv, ack_cmd, ack_packet);
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