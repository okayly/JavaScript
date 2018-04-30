/********************************************************************
Title : PacketHero
Date : 2015.12.31
Update : 2017.04.07
Desc : 패킷 정의 - 영웅
writer : dongsu
********************************************************************/
var PacketCommonData = require('../PacketCommonData.js');

exports.ReqHeroEvolution = function() {
	this.packet_srl;
	this.uuid;
	this.hero_id;
	this.need_item_iuid;
}

exports.AckHeroEvolution = function() {
	this.packet_srl;
	this.result;
	this.hero_id;
	this.evolution_step;
	this.gold;
	this.gain_skill_id;
	this.result_item = new PacketCommonData.Item();
}

exports.ReqHeroLevelUp = function() {
	this.packet_srl;
	this.uuid;
	this.hero_id;
	this.recv_iuid;
	this.recv_item_count;
}

exports.AckHeroLevelUp = function() {
	this.packet_srl;
	this.result;
	this.hero_id;
	this.hero_level;
	this.hero_exp;
	this.result_item = new PacketCommonData.Item();
}

exports.ReqHeroReinforce = function() {
	this.packet_srl;
	this.uuid;
	this.hero_id;
	this.need_item_iuids = [];
}

exports.AckHeroReinforce = function() {
	this.packet_srl;
	this.result;
	this.hero_id;
	this.promotion_step;
	this.gold;
	this.result_items = []; 	
}

exports.ReqHeroSummon = function() {
	this.packet_srl;
	this.uuid;
	this.hero_id;
}

exports.AckHeroSummon = function() {
	this.packet_srl;
	this.result;
	this.hero_id; 		
	this.result_item = new PacketCommonData.Item();
	this.skill_ids = [];
	this.army_id_list = [];
}

// Skill
exports.Skill = function() {
	this.skill_id;
	this.skill_level;
}

exports.ReqHeroSkills = function() {
	this.packet_srl;
	this.hero_id;
}
exports.AckHeroSkills = function() {
	this.packet_srl;
	this.result;
	this.skills = [];
}

exports.ReqHeroSkillLevelup = function() {
	this.packet_srl;
	this.hero_id;
	this.skill_id;
}
exports.AckHeroSkillLevelup = function() {
	this.packet_srl;
	this.result;
	this.hero_id;
	this.gold;
	this.skill_id;
	this.skill_level;
	this.skill_point;
	this.skill_point_remain_time;
}

// Army Skill
exports.ArmySkill = function() {
	this.army_skill_id;
	this.skill_level;
}

exports.ReqHeroArmySkill = function() {
	this.packet_srl;
	this.hero_id;
}
exports.AckHeroArmySkill = function() {
	this.packet_srl;
	this.result;
	this.army_skill_list = [];	// ArmySkill array
}

exports.ReqHeroCombiBuff = function() {
	this.packet_srl;
	this.buff_id;
	this.buff_level;
}
exports.AckHeroCombiBuff = function() {
	this.packet_srl;
	this.result;
	this.buff_id;
	this.buff_level;
}