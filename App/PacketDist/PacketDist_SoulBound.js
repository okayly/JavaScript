/********************************************************************
Title : PacketDist_SoulBound
Date : 2016.03.24
Update : 2016.08.11
Desc : 패킷 연결 - 영혼 각인
writer: jongwook
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketSoulBound = require('../../Packets/PacketSoulBound/PacketSoulBound.js');

var HeroRuneInfo		= require('../../Contents/SoulBound/HeroRuneInfo.js');
var HeroRuneSlotInfo	= require('../../Contents/SoulBound/HeroRuneSlotInfo.js');
var HeroRuneSlotOpen	= require('../../Contents/SoulBound/HeroRuneSlotOpen.js');
var HeroRuneCreate		= require('../../Contents/SoulBound/HeroRuneCreate.js');
var HeroRuneEquip		= require('../../Contents/SoulBound/HeroRuneEquip.js');
var HeroRuneUnEquip		= require('../../Contents/SoulBound/HeroRuneUnEquip.js');
var HeroRuneLevelup		= require('../../Contents/SoulBound/HeroRuneLevelup.js');
var HeroEquipRuneLevelup= require('../../Contents/SoulBound/HeroEquipRuneLevelup.js');
var HeroRuneSell		= require('../../Contents/SoulBound/HeroRuneSell.js');

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
				// 룬 슬롯 정보 요청
				case PacketSoulBound.inst.cmdReqHeroRuneSlotInfo() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroRuneSlotInfo();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroRuneSlotInfo();
					ack_packet.packet_srl = recv.packet_srl;					
					HeroRuneSlotInfo.inst.ReqHeroRuneSlotInfo(user, recv, ack_cmd, ack_packet);
					break;

				// 룬 정보 요청
				case PacketSoulBound.inst.cmdReqHeroRuneInfo() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroRuneInfo();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroRuneInfo();
					ack_packet.packet_srl = recv.packet_srl;
					HeroRuneInfo.inst.ReqHeroRuneInfo(user, recv, ack_cmd, ack_packet);
					break;

				// 룬 슬롯 오픈
				case PacketSoulBound.inst.cmdReqHeroRuneSlotOpen() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroRuneSlotOpen();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroRuneSlotOpen();
					ack_packet.packet_srl = recv.packet_srl;
					HeroRuneSlotOpen.inst.ReqHeroRuneSlotOpen(user, recv, ack_cmd, ack_packet);
					break;

				// 룬 생성
				case PacketSoulBound.inst.cmdReqHeroRuneCreate() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroRuneCreate();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroRuneCreate();
					ack_packet.packet_srl = recv.packet_srl;
					HeroRuneCreate.inst.ReqHeroRuneCreate(user, recv, ack_cmd, ack_packet);
					break;

				// 룬 장착
				case PacketSoulBound.inst.cmdReqHeroRuneEquip() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroRuneEquip();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroRuneEquip();
					ack_packet.packet_srl = recv.packet_srl;
					HeroRuneEquip.inst.ReqHeroRuneEquip(user, recv, ack_cmd, ack_packet);
					break;

				// 룬 장착 해제
				case PacketSoulBound.inst.cmdReqHeroRuneUnEquip() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroRuneUnEquip();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroRuneUnEquip();
					ack_packet.packet_srl = recv.packet_srl;
					HeroRuneUnEquip.inst.ReqHeroRuneUnEquip(user, recv, ack_cmd, ack_packet);
					break;

				// 룬 강화
				case PacketSoulBound.inst.cmdReqHeroRuneLevelup() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroRuneLevelup();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroRuneLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					HeroRuneLevelup.inst.ReqHeroRuneLevelup(user, recv, ack_cmd, ack_packet);
					break;

				// 장착 룬 강화
				case PacketSoulBound.inst.cmdReqHeroEquipRuneLevelup() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroEquipRuneLevelup();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroEquipRuneLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					HeroEquipRuneLevelup.inst.ReqHeroEquipRuneLevelup(user, recv, ack_cmd, ack_packet);
					break;

				// 룬 판매
				case PacketSoulBound.inst.cmdReqHeroRuneSell() :
					ack_cmd		= PacketSoulBound.inst.cmdAckHeroRuneSell();
					ack_packet	= PacketSoulBound.inst.GetPacketAckHeroRuneSell();
					ack_packet.packet_srl = recv.packet_srl;
					HeroRuneSell.inst.ReqHeroRuneSell(user, recv, ack_cmd, ack_packet);
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