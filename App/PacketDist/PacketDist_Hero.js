/********************************************************************
Title : PacketDist_Hero
Date : 2016.05.18
Update : 2017.04.07
Desc : 패킷 연결 - 영웅
writer: dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketHero = require('../../Packets/PacketHero/PacketHero.js');

var HeroEvolution	= require('../../Contents/Hero/HeroEvolution.js');
var HeroSkillInfo	= require('../../Contents/Hero/HeroSkillInfo.js');
var HeroLevelUp		= require('../../Contents/Hero/HeroLevelUp.js');
var HeroSummon		= require('../../Contents/Hero/HeroSummon.js');
var HeroReinforce	= require('../../Contents/Hero/HeroReinforce.js');
var HeroSkillLevelup= require('../../Contents/Hero/HeroSkillLevelup.js');
var HeroArmy		= require('../../Contents/Hero/HeroArmy.js');
var HeroCombiBuff	= require('../../Contents/Hero/HeroCombiBuff.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Hero Packet Convert - cmd is', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Hero Packet Not Find User Socket ID :', p_socket.id);
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
				case PacketHero.inst.cmdReqHeroEvolution() :
					ack_cmd 	= PacketHero.inst.cmdAckHeroEvolution();
					ack_packet	= PacketHero.inst.GetPacketAckEvolution();
					ack_packet.packet_srl = recv.packet_srl;
					HeroEvolution.inst.ReqHeroEvolution(user, recv, ack_cmd, ack_packet);
					break;

				case PacketHero.inst.cmdReqHeroLevelup() :
					ack_cmd 	= PacketHero.inst.cmdAckHeroLevelup();
					ack_packet	= PacketHero.inst.GetPacketAckLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					HeroLevelUp.inst.ReqHeroLevelUp(user, recv, ack_cmd, ack_packet);
					break;

				case PacketHero.inst.cmdReqHeroSummon() :
					ack_cmd 	= PacketHero.inst.cmdAckHeroSummon();
					ack_packet	= PacketHero.inst.GetPacketAckSummon();
					ack_packet.packet_srl = recv.packet_srl;
					HeroSummon.inst.ReqHeroSummon(user, recv, ack_cmd, ack_packet);
					break;

				case PacketHero.inst.cmdReqHeroReinforce() :
					ack_cmd 	= PacketHero.inst.cmdAckHeroReinforce();
					ack_packet	= PacketHero.inst.GetPacketAckReinforce();
					ack_packet.packet_srl = recv.packet_srl;
					HeroReinforce.inst.ReqHeroReinforce(user, recv, ack_cmd, ack_packet);
					break;

				case PacketHero.inst.cmdReqHeroSkills() :
					ack_cmd 	= PacketHero.inst.cmdAckHeroSkills();
					ack_packet	= PacketHero.inst.GetPacketAckSkills();
					ack_packet.packet_srl = recv.packet_srl;
					HeroSkillInfo.inst.ReqHeroSkills(user, recv, ack_cmd, ack_packet);
					break;

				case PacketHero.inst.cmdReqHeroSkillLevelup() :
					ack_cmd 	= PacketHero.inst.cmdAckHeroSkillLevelup();
					ack_packet	= PacketHero.inst.GetPacketAckSkillLevelup();
					ack_packet.packet_srl = recv.packet_srl;
					HeroSkillLevelup.inst.ReqHeroSkillLevelup(user, recv, ack_cmd, ack_packet);
					break;

				case PacketHero.inst.cmdReqHeroArmySkill() :
					ack_cmd 	= PacketHero.inst.cmdAckHeroArmySkill();
					ack_packet	= PacketHero.inst.GetPacketAckArmySkill();
					ack_packet.packet_srl = recv.packet_srl;
					HeroArmy.inst.ReqHeroArmySkill(user, recv, ack_cmd, ack_packet);
					break;

				case PacketHero.inst.cmdReqHeroCombiBuff() :
					ack_cmd 	= PacketHero.inst.cmdAckHeroCombiBuff();
					ack_packet	= PacketHero.inst.GetPacketAckCombiBuff();
					ack_packet.packet_srl = recv.packet_srl;
					HeroCombiBuff.inst.ReqHeroCombiBuff(user, recv, ack_cmd, ack_packet);
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