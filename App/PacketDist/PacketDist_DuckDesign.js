/********************************************************************
Title : PacketDist_DuckDesign
Date : 2016-03-23
Update : 2017.04.07
Desc : 서버 테스트 코드들
	   클라이언트에서 보내는 메세지
	   웹에서 보내는 메세지
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');
var UserMgr	= require('../../Data/Game/UserMgr.js');

var PacketDuck = require('../../Packets/PacketDuck/PacketDuck.js');

var DefineValues = require('../../Common/DefineValues.js');

var Duck			= require('../../Contents/Duck/Duck.js');
var DuckDesign		= require('../../Contents/Duck/DuckDesign.js');
var DuckAccount		= require('../../Contents/Duck/DuckAccount.js');
var DuckStamina		= require('../../Contents/Duck/DuckStamina.js');
var DuckSkillPoint	= require('../../Contents/Duck/DuckSkillPoint.js');
var DuckHero		= require('../../Contents/Duck/DuckHero.js');
var DuckItem		= require('../../Contents/Duck/DuckItem.js');
var DuckStage		= require('../../Contents/Duck/DuckStage.js');
var DuckMail		= require('../../Contents/Duck/DuckMail.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		console.log('Dist recv', recv);
		if ( recv == null ) {
			logger.error('Error DuckDesign Packet Convert - cmd is ', p_cmd);
			return;
		}

		// 서버 재시작 브로드 케스팅
		console.log('pass', recv.pass);
		if ( recv.pass == true || recv.pass == 'true' ) {
			var ack_cmd		= PacketDuck.inst.cmdAckServerMsg();
			var ack_packet	= PacketDuck.inst.GetPacketAckServerMsg();
			var evt_cmd		= PacketDuck.inst.cmdEvtServerMsg();
			var evt_packet	= PacketDuck.inst.GetPacketEvtServerMsg();

			DuckAccount.inst.ReqServerMsg(p_socket, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
			return;
		}

		var user = undefined;

		var account = recv.account;
		if ( account == NaN || typeof account === 'undefined' ) {
			user = UserMgr.inst.GetUserbySocket(p_socket.id);
			if ( typeof user === 'undefined' ) {
				account = '';
				logger.info('Empty User Socket ID of Duck Packet :', p_socket.id);				
			} else {
				account = user.account;
			}
		}

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { ACCOUNT : account, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			// console.log('p_ret_user', p_ret_user);
			if ( p_ret_user == null ) {
				logger.info('DuckDesign Not GTUser - cmd is', p_cmd);
				try {
					switch (p_cmd) {
						case PacketDuck.inst.cmdReqSendMail():
							ack_cmd		= PacketDuck.inst.cmdAckSendMail();
							ack_packet	= PacketDuck.inst.GetPacketAckSendMail();
							evt_cmd		= PacketDuck.inst.cmdEvtSendMail();
							evt_packet	= PacketDuck.inst.GetPacketEvtSendMail();

							DuckMail.inst.ReqDuckSendMail(p_socket, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqMailReservation() :
							ack_cmd		= PacketDuck.inst.cmdAckSendMail();
							ack_packet	= PacketDuck.inst.GetPacketAckSendMail();
							
							DuckMail.inst.ReqDuckMailReservation(p_socket, recv, ack_cmd, ack_packet);
							break;

						case PacketDuck.inst.cmdReqSendReservationMail() :
							ack_cmd		= PacketDuck.inst.cmdAckSendMail();
							ack_packet	= PacketDuck.inst.GetPacketAckSendMail();
							
							DuckMail.inst.ReqSendReservationMail(p_socket, recv, ack_cmd, ack_packet);
							break;
					}
				} catch (p_error) {
					console.log('error - 3', p_error);
				}
			} else {
				var uuid = p_ret_user.dataValues.UUID;

				// 분배
				var ack_cmd		= undefined;
				var ack_packet	= undefined;
				var evt_cmd		= undefined;
				var evt_packet	= undefined;

				try {
					switch(p_cmd) {
						// Client Packet
						case PacketDuck.inst.cmdReqAccountLevelSet() :
							ack_cmd		= PacketDuck.inst.cmdAckAccountLevelSet();
							ack_packet	= PacketDuck.inst.GetPacketAckAccountLevelSet();
							ack_packet.packet_srl = recv.packet_srl;
							Duck.inst.ReqAccountLevelSet(user, recv, ack_cmd, ack_packet);
							break;

						case PacketDuck.inst.cmdReqHeroLevelSet() :
							ack_cmd		= PacketDuck.inst.cmdAckHeroLevelSet();
							ack_packet	= PacketDuck.inst.GetPacketAckHeroLevelSet();
							ack_packet.packet_srl = recv.packet_srl;
							Duck.inst.ReqHeroLevelSet(user, recv, ack_cmd, ack_packet);
							break;

						case PacketDuck.inst.cmdReqMakeInventoryItem() :
							ack_cmd		= PacketDuck.inst.cmdAckMakeInventoryItem();
							ack_packet	= PacketDuck.inst.GetPacketAckMakeInventoryItem();
							ack_packet.packet_srl = recv.packet_srl;
							Duck.inst.ReqMakeInventoryItem(user, recv, ack_cmd, ack_packet);
							break;

						case PacketDuck.inst.cmdReqInfinityTowerReset() :
							ack_cmd		= PacketDuck.inst.cmdAckInfinityTowerReset();
							ack_packet	= PacketDuck.inst.GetPacketAckInfinityTowerReset();
							ack_packet.packet_srl = recv.packet_srl;
							Duck.inst.ReqInfinityTowerReset(user, recv, ack_cmd, ack_packet);
							break;

						case PacketDuck.inst.cmdReqWalletPoint() :
							ack_cmd		= PacketDuck.inst.cmdAckWalletPoint();
							ack_packet	= PacketDuck.inst.GetPacketAckWalletPoint();
							ack_packet.packet_srl = recv.packet_srl;
							Duck.inst.ReqWalletPoint(user, recv, ack_cmd, ack_packet);
							break;

						// Web Packet
						case PacketDuck.inst.cmdReqConfirmAccount():
							ack_cmd		= PacketDuck.inst.cmdAckConfirmAccount();
							ack_packet	= PacketDuck.inst.GetPacketAckConfirmAccount();

							DuckDesign.inst.ReqConfirmAccount(p_socket, uuid, recv, ack_cmd, ack_packet);
							break;

						case PacketDuck.inst.cmdReqAccountLevel():
							ack_cmd		= PacketDuck.inst.cmdAckAccountLevel();
							ack_packet	= PacketDuck.inst.GetPacketAckAccountLevel();
							evt_cmd		= PacketDuck.inst.cmdEvtAccountLevel();
							evt_packet	= PacketDuck.inst.GetPacketEvtAccountLevel();

							DuckAccount.inst.ReqAccountLevel(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqAccountBuff():
							ack_cmd		= PacketDuck.inst.cmdAckAccountBuff();
							ack_packet	= PacketDuck.inst.GetPacketAckAccountBuff();
							evt_cmd		= PacketDuck.inst.cmdEvtAccountBuff();
							evt_packet	= PacketDuck.inst.GetPacketEvtAccountBuff();

							DuckAccount.inst.ReqAccountBuff(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqVip():
							ack_cmd		= PacketDuck.inst.cmdAckVip();
							ack_packet	= PacketDuck.inst.GetPacketAckVip();
							evt_cmd		= PacketDuck.inst.cmdEvtVip();
							evt_packet	= PacketDuck.inst.GetPacketEvtVip();

							DuckAccount.inst.ReqVip(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqCash():
							ack_cmd		= PacketDuck.inst.cmdAckCash();
							ack_packet	= PacketDuck.inst.GetPacketAckCash();
							evt_cmd		= PacketDuck.inst.cmdEvtCash();
							evt_packet	= PacketDuck.inst.GetPacketEvtCash();

							DuckAccount.inst.ReqWallet(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet, DefineValues.inst.CashReward);
							break;

						case PacketDuck.inst.cmdReqGold():
							ack_cmd		= PacketDuck.inst.cmdAckGold();
							ack_packet	= PacketDuck.inst.GetPacketAckGold();
							evt_cmd		= PacketDuck.inst.cmdEvtGold();
							evt_packet	= PacketDuck.inst.GetPacketEvtGold();

							DuckAccount.inst.ReqWallet(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet, DefineValues.inst.GoldReward);
							break;

						case PacketDuck.inst.cmdReqHonorPoint():
							ack_cmd		= PacketDuck.inst.cmdAckHonorPoint();
							ack_packet	= PacketDuck.inst.GetPacketAckHonorPoint();
							evt_cmd		= PacketDuck.inst.cmdEvtHonorPoint();
							evt_packet	= PacketDuck.inst.GetPacketEvtHonorPoint();

							DuckAccount.inst.ReqWallet(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet, DefineValues.inst.HonorPointReward);
							break;

						case PacketDuck.inst.cmdReqAlliancePoint():
							ack_cmd		= PacketDuck.inst.cmdAckAlliancePoint();
							ack_packet	= PacketDuck.inst.GetPacketAckAlliancePoint();
							evt_cmd		= PacketDuck.inst.cmdEvtAlliancePoint();
							evt_packet	= PacketDuck.inst.GetPacketEvtAlliancePoint();

							DuckAccount.inst.ReqWallet(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet, DefineValues.inst.AlliancePointReward);
							break;

						case PacketDuck.inst.cmdReqChallengePoint():
							ack_cmd		= PacketDuck.inst.cmdAckChallengePoint();
							ack_packet	= PacketDuck.inst.GetPacketAckChallengePoint();
							evt_cmd		= PacketDuck.inst.cmdEvtChallengePoint();
							evt_packet	= PacketDuck.inst.GetPacketEvtChallengePoint();

							DuckAccount.inst.ReqWallet(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet, DefineValues.inst.ChallengePointReward);
							break;

						case PacketDuck.inst.cmdReqStamina():
							ack_cmd		= PacketDuck.inst.cmdAckStamina();
							ack_packet	= PacketDuck.inst.GetPacketAckStamina();
							evt_cmd		= PacketDuck.inst.cmdEvtStamina();
							evt_packet	= PacketDuck.inst.GetPacketEvtStamina();

							DuckStamina.inst.ReqStamina(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqSkillPoint():
							ack_cmd		= PacketDuck.inst.cmdAckSkillPoint();
							ack_packet	= PacketDuck.inst.GetPacketAckSkillPoint();
							evt_cmd		= PacketDuck.inst.cmdEvtSkillPoint();
							evt_packet	= PacketDuck.inst.GetPacketEvtSkillPoint();

							DuckSkillPoint.inst.ReqSkillPoint(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqHeroLevel():
							ack_cmd		= PacketDuck.inst.cmdAckHeroLevel();
							ack_packet	= PacketDuck.inst.GetPacketAckHeroLevel();
							evt_cmd		= PacketDuck.inst.cmdEvtHeroLevel();
							evt_packet	= PacketDuck.inst.GetPacketEvtHeroLevel();

							DuckHero.inst.ReqHeroLevel(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqHeroExp():
							ack_cmd		= PacketDuck.inst.cmdAckHeroLevel();
							ack_packet	= PacketDuck.inst.GetPacketAckHeroLevel();
							evt_cmd		= PacketDuck.inst.cmdEvtHeroLevel();
							evt_packet	= PacketDuck.inst.GetPacketEvtHeroLevel();

							DuckHero.inst.ReqHeroExp(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqHeroSkill():
							ack_cmd		= PacketDuck.inst.cmdAckHeroSkill();
							ack_packet	= PacketDuck.inst.GetPacketAckHeroSkill();
							evt_cmd		= PacketDuck.inst.cmdEvtHeroSkill();
							evt_packet	= PacketDuck.inst.GetPacketEvtHeroSkill();

							DuckHero.inst.ReqHeroSkill(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqHeroEvolution():
							ack_cmd		= PacketDuck.inst.cmdAckHeroEvolution();
							ack_packet	= PacketDuck.inst.GetPacketAckHeroEvolution();
							evt_cmd		= PacketDuck.inst.cmdEvtHeroEvolution();
							evt_packet	= PacketDuck.inst.GetPacketEvtHeroEvolution();

							DuckHero.inst.ReqHeroEvolution(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqHeroReinforce():
							ack_cmd		= PacketDuck.inst.cmdAckHeroReinforce();
							ack_packet	= PacketDuck.inst.GetPacketAckHeroReinforce();
							evt_cmd		= PacketDuck.inst.cmdEvtHeroReinforce();
							evt_packet	= PacketDuck.inst.GetPacketEvtHeroReinforce();

							DuckHero.inst.ReqHeroReinforce(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqItemLevel():
							ack_cmd		= PacketDuck.inst.cmdAckItemLevel();
							ack_packet	= PacketDuck.inst.GetPacketAckItemLevel();
							evt_cmd		= PacketDuck.inst.cmdEvtItemLevel();
							evt_packet	= PacketDuck.inst.GetPacketEvtItemLevel();

							DuckItem.inst.ReqEquipItemLevel(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqItemEvolution():
							ack_cmd		= PacketDuck.inst.cmdAckItemEvolution();
							ack_packet	= PacketDuck.inst.GetPacketAckItemEvolution();
							evt_cmd		= PacketDuck.inst.cmdEvtItemEvolution();
							evt_packet	= PacketDuck.inst.GetPacketEvtItemEvolution();

							DuckItem.inst.ReqEquipItemEvolution(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqItemReinforce():
							ack_cmd		= PacketDuck.inst.cmdAckItemReinforce();
							ack_packet	= PacketDuck.inst.GetPacketAckItemReinforce();
							evt_cmd		= PacketDuck.inst.cmdEvtItemReinforce();
							evt_packet	= PacketDuck.inst.GetPacketEvtItemReinforce();

							DuckItem.inst.ReqEquipItemReinforce(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqCreateItemOne():
							ack_cmd		= PacketDuck.inst.cmdAckInventory();
							ack_packet	= PacketDuck.inst.GetPacketAckInventory();
							evt_cmd		= PacketDuck.inst.cmdEvtInventory();
							evt_packet	= PacketDuck.inst.GetPacketEvtInventory();

							DuckItem.inst.ReqCreateItemOne(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqCreateItemCategory():
							ack_cmd		= PacketDuck.inst.cmdAckInventory();
							ack_packet	= PacketDuck.inst.GetPacketAckInventory();
							evt_cmd		= PacketDuck.inst.cmdEvtInventory();
							evt_packet	= PacketDuck.inst.GetPacketEvtInventory();

							DuckItem.inst.ReqCreateItemCategory(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqCreateItemAll():
							ack_cmd		= PacketDuck.inst.cmdAckInventory();
							ack_packet	= PacketDuck.inst.GetPacketAckInventory();
							evt_cmd		= PacketDuck.inst.cmdEvtInventory();
							evt_packet	= PacketDuck.inst.GetPacketEvtInventory();

							DuckItem.inst.ReqCreateItemAll(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqDailyContents():
							ack_cmd		= PacketDuck.inst.cmdAckDailyContents();
							ack_packet	= PacketDuck.inst.GetPacketAckDailyContents();
							evt_cmd		= PacketDuck.inst.cmdEvtDailyContents();
							evt_packet	= PacketDuck.inst.GetPacketEvtDailyContents();

							DuckAccount.inst.ReqDailyContents(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqStageClear():
							ack_cmd		= PacketDuck.inst.cmdAckStageClear();
							ack_packet	= PacketDuck.inst.GetPacketAckStageClear();
							evt_cmd		= PacketDuck.inst.cmdEvtStageClear();
							evt_packet	= PacketDuck.inst.GetPacketEvtStageClear();

							DuckStage.inst.ReqStageClear(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;

						case PacketDuck.inst.cmdReqGuildPoint():
							ack_cmd		= PacketDuck.inst.cmdAckGuildPoint();
							ack_packet	= PacketDuck.inst.GetPacketAckGuildPoint();
							evt_cmd		= PacketDuck.inst.cmdEvtGuildPoint();
							evt_packet	= PacketDuck.inst.GetPacketEvtGuildPoint();

							DuckAccount.inst.ReqGuildPoint(p_socket, uuid, recv, ack_cmd, ack_packet, evt_cmd, evt_packet);
							break;
						
						default :
							logger.error('uuid: %d Error Packet Dist! - data:\n', uuid, recv, ack_cmd);
						break;
					}
				} catch (p_error) {
					console.log('error - 2', p_error);
				}
			}
		})
		.catch(function (p_error) {
			console.log('error - 1', p_error);			
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;