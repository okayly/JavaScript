/********************************************************************
Title : PacketHero
Date : 2015.10.16
Update : 2017.04.04
Desc : 피캣 정의 - 영웅
writer : dongsu
********************************************************************/
var PacketHeroData = require('./PacketHeroData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;	

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function() {
		logger.debug('**** Hero packet command init ****');

		fp.readFile('./Packets/PacketHero/PacketHeroCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};
	
	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqHeroSummon = function() { return packet_cmd.Req.Summon; }
	inst.cmdAckHeroSummon = function() { return packet_cmd.Ack.Summon; }
	inst.cmdReqHeroLevelup = function() { return packet_cmd.Req.Levelup; }
	inst.cmdAckHeroLevelup = function() { return packet_cmd.Ack.Levelup; }
	inst.cmdReqHeroEvolution = function() { return packet_cmd.Req.Evolution; }
	inst.cmdAckHeroEvolution = function() { return packet_cmd.Ack.Evolution; }
	inst.cmdReqHeroReinforce = function() { return packet_cmd.Req.Reinforce; }
	inst.cmdAckHeroReinforce = function() { return packet_cmd.Ack.Reinforce; }

	// Skill
	inst.cmdReqHeroSkills = function() { return packet_cmd.Req.Skills; }
	inst.cmdAckHeroSkills = function() { return packet_cmd.Ack.Skills; }

	inst.cmdReqHeroSkillLevelup = function() { return packet_cmd.Req.SkillLevelup; }
	inst.cmdAckHeroSkillLevelup = function() { return packet_cmd.Ack.SkillLevelup; }

	// ArmySkill
	inst.cmdReqHeroArmySkill = function() { return packet_cmd.Req.ArmySkill; }
	inst.cmdAckHeroArmySkill = function() { return packet_cmd.Ack.ArmySkill; }

	// CombiBuff
	inst.cmdReqHeroCombiBuff = function() { return packet_cmd.Req.CombiBuff; }
	inst.cmdAckHeroCombiBuff = function() { return packet_cmd.Ack.CombiBuff; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckEvolution = function() { return new PacketHeroData.AckHeroEvolution(); } 
	inst.GetPacketAckLevelup = function() { return new PacketHeroData.AckHeroLevelUp(); }
	inst.GetPacketAckReinforce = function() { return new PacketHeroData.AckHeroReinforce(); }
	inst.GetPacketAckSummon = function() { return new PacketHeroData.AckHeroSummon(); }

	// Skill
	inst.GetPacketSkill = function() { return new PacketHeroData.Skill(); }

	inst.GetPacketAckSkills = function() { return new PacketHeroData.AckHeroSkills(); }
	inst.GetPacketAckSkillLevelup = function() { return new PacketHeroData.AckHeroSkillLevelup(); }

	// ArmySkill
	inst.GetPacketArmySkill = function() { return new PacketHeroData.ArmySkill(); }
	inst.GetPacketAckArmySkill = function() { return new PacketHeroData.AckHeroArmySkill(); }

	// CombiBuff
	inst.GetPacketAckCombiBuff = function() { return new PacketHeroData.AckHeroCombiBuff(); }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;