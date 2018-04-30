/********************************************************************
Title : PacketDuck
Date : 2016.03.22
Update : 2016.11.22
Desc : 패킷 정의 - 서버 테스트
writer: jongwook
********************************************************************/
var PacketDuckData = require('./PacketDuckData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function() {
		logger.debug('**** Duck packet command init ****');

		fp.readFile('./Packets/PacketDuck/PacketDuckCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Client
	inst.cmdReqAccountLevelSet = function() { return packet_cmd.Req.AccountLevelSet; }
	inst.cmdAckAccountLevelSet = function() { return packet_cmd.Ack.AccountLevelSet; }

	inst.cmdReqHeroLevelSet = function() { return packet_cmd.Req.HeroLevelSet; }
	inst.cmdAckHeroLevelSet = function() { return packet_cmd.Ack.HeroLevelSet; }

	inst.cmdReqMakeInventoryItem = function() { return packet_cmd.Req.MakeInventoryItem; }
	inst.cmdAckMakeInventoryItem = function() { return packet_cmd.Ack.MakeInventoryItem; }

	inst.cmdReqInfinityTowerReset = function() { return packet_cmd.Req.InfinityTowerReset; }
	inst.cmdAckInfinityTowerReset = function() { return packet_cmd.Ack.InfinityTowerReset; }

	inst.cmdReqWalletPoint = function() { return packet_cmd.Req.WalletPoint; }
	inst.cmdAckWalletPoint = function() { return packet_cmd.Ack.WalletPoint; }

	// Web - Command
	inst.cmdReqConfirmAccount = function() { return packet_cmd.Req.ConfirmAccount; }
	inst.cmdAckConfirmAccount = function() { return packet_cmd.Ack.ConfirmAccount; }
	
	inst.cmdReqAccountLevel = function() { return packet_cmd.Req.AccountLevel; }
	inst.cmdAckAccountLevel = function() { return packet_cmd.Ack.AccountLevel; }
	inst.cmdEvtAccountLevel = function() { return packet_cmd.Evt.AccountLevel; }

	inst.cmdReqAccountBuff = function() { return packet_cmd.Req.AccountBuff; }
	inst.cmdAckAccountBuff = function() { return packet_cmd.Ack.AccountBuff; }
	inst.cmdEvtAccountBuff = function() { return packet_cmd.Evt.AccountBuff; }

	inst.cmdReqVip = function() { return packet_cmd.Req.Vip; }
	inst.cmdAckVip = function() { return packet_cmd.Ack.Vip; }
	inst.cmdEvtVip = function() { return packet_cmd.Evt.Vip; }

	inst.cmdReqCash = function() { return packet_cmd.Req.Cash; }
	inst.cmdAckCash = function() { return packet_cmd.Ack.Cash; }
	inst.cmdEvtCash = function() { return packet_cmd.Evt.Cash; }

	inst.cmdReqGold = function() { return packet_cmd.Req.Gold; }
	inst.cmdAckGold = function() { return packet_cmd.Ack.Gold; }
	inst.cmdEvtGold = function() { return packet_cmd.Evt.Gold; }

	inst.cmdReqHonorPoint = function() { return packet_cmd.Req.HonorPoint; }
	inst.cmdAckHonorPoint = function() { return packet_cmd.Ack.HonorPoint; }
	inst.cmdEvtHonorPoint = function() { return packet_cmd.Evt.HonorPoint; }

	inst.cmdReqAlliancePoint = function() { return packet_cmd.Req.AlliancePoint; }
	inst.cmdAckAlliancePoint = function() { return packet_cmd.Ack.AlliancePoint; }
	inst.cmdEvtAlliancePoint = function() { return packet_cmd.Evt.AlliancePoint; }

	inst.cmdReqChallengePoint = function() { return packet_cmd.Req.ChallengePoint; }
	inst.cmdAckChallengePoint = function() { return packet_cmd.Ack.ChallengePoint; }
	inst.cmdEvtChallengePoint = function() { return packet_cmd.Evt.ChallengePoint; }

	inst.cmdReqStamina = function() { return packet_cmd.Req.Stamina; }
	inst.cmdAckStamina = function() { return packet_cmd.Ack.Stamina; }
	inst.cmdEvtStamina = function() { return packet_cmd.Evt.Stamina; }

	inst.cmdReqSkillPoint = function() { return packet_cmd.Req.SkillPoint; }
	inst.cmdAckSkillPoint = function() { return packet_cmd.Ack.SkillPoint; }
	inst.cmdEvtSkillPoint = function() { return packet_cmd.Evt.SkillPoint; }

	inst.cmdReqHeroSkill = function() { return packet_cmd.Req.HeroSkill; }
	inst.cmdAckHeroSkill = function() { return packet_cmd.Ack.HeroSkill; }
	inst.cmdEvtHeroSkill = function() { return packet_cmd.Evt.HeroSkill; }

	inst.cmdReqHeroLevel = function() { return packet_cmd.Req.HeroLevel; }
	inst.cmdAckHeroLevel = function() { return packet_cmd.Ack.HeroLevel; }
	inst.cmdEvtHeroLevel = function() { return packet_cmd.Evt.HeroLevel; }

	inst.cmdReqHeroExp = function() { return packet_cmd.Req.HeroExp; }
	
	inst.cmdReqHeroEvolution = function() { return packet_cmd.Req.HeroEvolution; }
	inst.cmdAckHeroEvolution = function() { return packet_cmd.Ack.HeroEvolution; }
	inst.cmdEvtHeroEvolution = function() { return packet_cmd.Evt.HeroEvolution; }

	inst.cmdReqHeroReinforce = function() { return packet_cmd.Req.HeroReinforce; }
	inst.cmdAckHeroReinforce = function() { return packet_cmd.Ack.HeroReinforce; }
	inst.cmdEvtHeroReinforce = function() { return packet_cmd.Evt.HeroReinforce; }

	inst.cmdReqItemLevel = function() { return packet_cmd.Req.ItemLevel; }
	inst.cmdAckItemLevel = function() { return packet_cmd.Ack.ItemLevel; }
	inst.cmdEvtItemLevel = function() { return packet_cmd.Evt.ItemLevel; }

	inst.cmdReqItemEvolution = function() { return packet_cmd.Req.ItemEvolution; }
	inst.cmdAckItemEvolution = function() { return packet_cmd.Ack.ItemEvolution; }
	inst.cmdEvtItemEvolution = function() { return packet_cmd.Evt.ItemEvolution; }

	inst.cmdReqItemReinforce = function() { return packet_cmd.Req.ItemReinforce; }
	inst.cmdAckItemReinforce = function() { return packet_cmd.Ack.ItemReinforce; }
	inst.cmdEvtItemReinforce = function() { return packet_cmd.Evt.ItemReinforce; }

	inst.cmdReqCreateItemOne = function() { return packet_cmd.Req.CreateItemOne; }
	inst.cmdReqCreateItemCategory = function() { return packet_cmd.Req.CreateItemCategory; }
	inst.cmdReqCreateItemAll = function() { return packet_cmd.Req.CreateItemAll; }
	inst.cmdAckInventory = function() { return packet_cmd.Ack.Inventory; }
	inst.cmdEvtInventory = function() { return packet_cmd.Evt.Inventory; }

	inst.cmdReqDailyContents = function() { return packet_cmd.Req.DailyContents; }
	inst.cmdAckDailyContents = function() { return packet_cmd.Ack.DailyContents; }
	inst.cmdEvtDailyContents = function() { return packet_cmd.Evt.DailyContents; }

	inst.cmdReqStageClear = function() { return packet_cmd.Req.StageClear; }
	inst.cmdAckStageClear = function() { return packet_cmd.Ack.StageClear; }
	inst.cmdEvtStageClear = function() { return packet_cmd.Evt.StageClear; }

	inst.cmdReqSendMail = function() { return packet_cmd.Req.SendMail; }
	inst.cmdAckSendMail = function() { return packet_cmd.Ack.SendMail; }
	inst.cmdEvtSendMail = function() { return packet_cmd.Evt.SendMail; }

	inst.cmdReqMailReservation = function() { return packet_cmd.Req.MailReservation; }
	inst.cmdAckMailReservation = function() { return packet_cmd.Ack.MailReservation; }
	inst.cmdEvtMailReservation = function() { return packet_cmd.Evt.MailReservation; }

	inst.cmdReqSendReservationMail = function() { return packet_cmd.Req.SendReservationMail; }
	inst.cmdAckSendReservationMail = function() { return packet_cmd.Ack.SendReservationMail; }
	inst.cmdEvtSendReservationMail = function() { return packet_cmd.Evt.SendReservationMail; }

	inst.cmdReqServerMsg = function() { return packet_cmd.Req.ServerMsg; }
	inst.cmdAckServerMsg = function() { return packet_cmd.Ack.ServerMsg; }
	inst.cmdEvtServerMsg = function() { return packet_cmd.Evt.ServerMsg; }

	inst.cmdReqGuildPoint = function() { return packet_cmd.Req.GuildPoint; }
	inst.cmdAckGuildPoint = function() { return packet_cmd.Ack.GuildPoint; }
	inst.cmdEvtGuildPoint = function() { return packet_cmd.Evt.GuildPoint; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckAccountLevelSet = function() { return new PacketDuckData.AckAccountLevelSet(); }
	inst.GetPacketAckHeroLevelSet = function() { return new PacketDuckData.AckHeroLevelSet(); }
	inst.GetPacketAckMakeInventoryItem = function() { return new PacketDuckData.AckMakeInventoryItem(); }
	inst.GetPacketAckInfinityTowerReset = function() { return new PacketDuckData.AckInfinityTowerReset(); }

	// Web
	inst.GetPacketAckConfirmAccount = function() { return new PacketDuckData.AckConfirmAccount(); }

	inst.GetPacketAckAccountLevel = function() { return new PacketDuckData.AckAccountLevel(); }
	inst.GetPacketEvtAccountLevel = function() { return new PacketDuckData.EvtAccountLevel(); }

	inst.GetPacketAckAccountBuff = function() { return new PacketDuckData.AckAccountBuff(); }
	inst.GetPacketEvtAccountBuff = function() { return new PacketDuckData.EvtAccountBuff(); }

	inst.GetPacketAckVip = function() { return new PacketDuckData.AckVip(); }
	inst.GetPacketEvtVip = function() { return new PacketDuckData.EvtVip(); }
	
	inst.GetPacketAckCash = function() { return new PacketDuckData.AckCash(); }
	inst.GetPacketEvtCash = function() { return new PacketDuckData.EvtCash(); }

	inst.GetPacketAckGold = function() { return new PacketDuckData.AckGold(); }
	inst.GetPacketEvtGold = function() { return new PacketDuckData.EvtGold(); }

	inst.GetPacketAckHonorPoint = function() { return new PacketDuckData.AckHonorPoint(); }
	inst.GetPacketEvtHonorPoint = function() { return new PacketDuckData.EvtHonorPoint(); }

	inst.GetPacketAckAlliancePoint = function() { return new PacketDuckData.AckAlliancePoint(); }
	inst.GetPacketEvtChallengePoint = function() { return new PacketDuckData.EvtChallengePoint(); }

	inst.GetPacketAckChallengePoint = function() { return new PacketDuckData.AckChallengePoint(); }
	inst.GetPacketEvtAlliancePoint = function() { return new PacketDuckData.EvtAlliancePoint(); }

	inst.GetPacketAckStamina = function() { return new PacketDuckData.AckStamina(); }
	inst.GetPacketEvtStamina = function() { return new PacketDuckData.EvtStamina(); }

	inst.GetPacketAckSkillPoint = function() { return new PacketDuckData.AckSkillPoint(); }
	inst.GetPacketEvtSkillPoint = function() { return new PacketDuckData.EvtSkillPoint(); }

	inst.GetPacketAckHeroSkill = function() { return new PacketDuckData.AckHeroSkill(); }
	inst.GetPacketEvtHeroSkill = function() { return new PacketDuckData.EvtHeroSkill(); }

	inst.GetPacketAckHeroLevel = function() { return new PacketDuckData.AckHeroLevel(); }
	inst.GetPacketEvtHeroLevel = function() { return new PacketDuckData.EvtHeroLevel(); }

	inst.GetPacketAckHeroEvolution = function() { return new PacketDuckData.AckHeroEvolution(); }
	inst.GetPacketEvtHeroEvolution = function() { return new PacketDuckData.EvtHeroEvolution(); }

	inst.GetPacketAckHeroReinforce = function() { return new PacketDuckData.AckHeroReinforce(); }
	inst.GetPacketEvtHeroReinforce = function() { return new PacketDuckData.EvtHeroReinforce(); }

	inst.GetPacketAckItemLevel = function() { return new PacketDuckData.AckItemLevel(); }
	inst.GetPacketEvtItemLevel = function() { return new PacketDuckData.EvtItemLevel(); }

	inst.GetPacketAckItemEvolution = function() { return new PacketDuckData.AckItemEvolution(); }
	inst.GetPacketEvtItemEvolution = function() { return new PacketDuckData.EvtItemEvolution(); }

	inst.GetPacketAckItemReinforce = function() { return new PacketDuckData.AckItemReinforce(); }
	inst.GetPacketEvtItemReinforce = function() { return new PacketDuckData.EvtItemReinforce(); }

	inst.GetPacketAckInventory = function() { return new PacketDuckData.AckInventory(); }
	inst.GetPacketEvtInventory = function() { return new PacketDuckData.EvtInventory(); }

	inst.GetPacketAckDailyContents = function() { return new PacketDuckData.AckDailyContents(); }
	inst.GetPacketEvtDailyContents = function() { return new PacketDuckData.EvtDailyContents(); }

	inst.GetPacketAckStageClear = function() { return new PacketDuckData.AckStageClear(); }
	inst.GetPacketEvtStageClear = function() { return new PacketDuckData.EvtStageClear(); }

	inst.GetPacketAckSendMail = function() { return new PacketDuckData.AckSendMail(); }
	inst.GetPacketEvtSendMail = function() { return new PacketDuckData.EvtSendMail(); }

	inst.GetPacketAckServerMsg = function() { return new PacketDuckData.AckServerMsg(); }
	inst.GetPacketEvtServerMsg = function() { return new PacketDuckData.EvtServerMsg(); }

	inst.GetPacketAckGuildPoint = function() { return new PacketDuckData.AckGuildPoint(); }
	inst.GetPacketEvtGuildPoint = function() { return new PacketDuckData.EvtGuildPoint(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;