/********************************************************************
Title : PacketDuckData
Date : 2016.03.22
Update : 2017.02.22
Desc : 패킷 정의 - 테스트
writer: jongwook
********************************************************************/
// 계정 레벨 설정
exports.ReqAccountLevelSet = function() {
	this.uuid;
	this.account_level;
}
exports.AckAccountLevelSet = function() {
	this.result;
	this.packet_srl;
	this.uuid;
	this.account_level;
	this.account_exp;
}

// 영웅 레벨 설정
exports.ReqHeroLevelSet = function() {
	this.uuid;
	this.hero_id;
	this.hero_level;
}
exports.AckHeroLevelSet = function() {
	this.result;
	this.packet_srl;
	this.uuid;
	this.hero_level;
	this.hero_exp;
}

// 인벤토리 아이템 생성
exports.ReqMakeInventoryItem = function() {
	this.uuid;
}
exports.AckMakeInventoryItem = function() {
	this.result;
	this.packet_srl;
	this.item_list = [];
	this.equipment_list = [];
}

// 무한탑 리셋
exports.ReqInfinityTowerReset = function() {
	this.uuid;
}
exports.AckInfinityTowerReset = function() {
	this.result;
	this.packet_srl;
	this.tower_user;
	this.tower_floor;
	this.tower_hero;
	this.tower_battle_bot;
	this.tower_battle_bot_status;
}


// 계정 확인
exports.ReqConfirmAccount = function() {
	this.account;
}
exports.AckConfirmAccount = function() {
	this.uuid;
}

exports.ReqAccountLevel = function() {
	this.account_exp;
}
exports.AckAccountLevel = function() {
	this.account_level;
	this.account_exp;
	this.stamina;
}
exports.EvtAccountLevel = function() {
	this.account_level;
	this.account_exp;
	this.stamina;
}

exports.ReqAccountBuff = function() {
	this.account_buff_level;
}
exports.AckAccountBuff = function() {
	this.account_buff_list = [];
}
exports.EvtAccountBuff = function() {
	this.account_buff_list = [];
}

exports.ReqVip = function() {
	this.accum_cash;
}
exports.AckVip = function() {
	this.vip_step;
	this.accum_cash;
	this.max_buy_gold_count;
	this.max_buy_stamina_count;
	this.max_buy_add_attend_count;
	this.skill_point_charge_time;
}
exports.EvtVip = function() {
	this.vip_step;
	this.accum_cash;
	this.max_buy_gold_count;
	this.max_buy_stamina_count;
	this.max_buy_add_attend_count;
	this.skill_point_charge_time;
}

// 재화 충전
exports.ReqCash = function() {
	this.cash;
}
exports.AckCash = function() {
	this.msg;
	this.total_cash;
}
exports.EvtCash = function() {
	this.total_cash;
}

exports.ReqGold = function() {
	this.gold;
}
exports.AckGold = function() {
	this.msg;
	this.total_gold;
}
exports.EvtGold = function() {
	 this.total_gold;
}

exports.ReqHonorPoint = function() {
	this.honor_point;
}
exports.AckHonorPoint = function() {
	this.msg;
	this.total_honor_point;
}
exports.EvtHonorPoint = function() {
	this.total_honor_point;
}

exports.ReqAlliancePoint = function() {
	this.alliance_point;
}
exports.AckAlliancePoint = function() {
	this.msg;
	this.total_alliance_point;
}
exports.EvtAlliancePoint = function() {
	this.total_alliance_point;
}

exports.ReqChallengePoint = function() {
	this.challenge_point;
}
exports.AckChallengePoint = function() {
	this.msg;
	this.total_challenge_point;
}
exports.EvtChallengePoint = function() {
	this.total_challenge_point;
}

exports.ReqStamina = function() {
	this.stamina;
}
exports.AckStamina = function() {
	this.msg;
	this.total_stamina;
	this.stamina_remain_time;
}
exports.EvtStamina = function() {
	this.total_stamina;
	this.stamina_remain_time;
}

exports.ReqSkillPoint = function() {
	this.skill_point;
}
exports.AckSkillPoint = function() {
	this.msg;
	this.total_skill_point;
	this.skill_point_remain_time;
}
exports.EvtSkillPoint = function() {
	this.total_skill_point;
	this.skill_point_remain_time;
}

exports.ReqHeroSkill = function() {
	this.skill_level;
}
exports.AckHeroSkill = function() {
	this.msg;
	this.hero_skill_info_list = [];
}
exports.EvtHeroSkill = function() {
	this.hero_skill_level;
}

exports.ReqHeroLevel = function() {
	this.hero_level;
}
exports.AckHeroLevel = function() {
	this.msg;
	this.hero_level_info_list = [];
}
exports.EvtHeroLevel = function() {
	this.hero_level;
}

exports.ReqHeroExp = function() {
	this.hero_exp;
}
// ReqHeroLevel과 같은 응답 패킷

exports.ReqHeroEvolution = function() {
	this.evolution_step;
}
exports.AckHeroEvolution = function() {
	this.msg;
	this.hero_evolution_list = [];
}
exports.EvtHeroEvolution = function() {
	this.hero_evolution_step;
}

exports.ReqHeroReinforce = function() {
	this.reinforce_step;
}
exports.AckHeroReinforce = function() {
	this.msg;
	this.hero_reinforce_list = [];
}
exports.EvtHeroReinforce = function() {
	this.hero_reinforce_step;
}

exports.ReqItemLevel = function() {
	this.item_level;
}
exports.AckItemLevel = function() {
	this.msg;
	this.equip_item_list = [];
}
exports.EvtItemLevel = function() {
	this.item_level;
}

exports.ReqItemEvolution = function() {
	this.evolution_step;
}
exports.AckItemEvolution = function() {
	this.msg;
	this.equip_item_list = [];
}
exports.EvtItemEvolution = function() {
	this.item_evolution_step;
}

exports.ReqItemReinforce = function() {
	this.reinforce_step;
}
exports.AckItemReinforce = function() {
	this.msg;
	this.equip_item_list = [];
}
exports.EvtItemReinforce = function() {
	this.item_reinforce_step;
}

exports.ReqCreateItemOne = function() {
	this.item_id;
	this.item_count;
}
exports.ReqCreateItemCategory = function() {
	this.item_category;
	this.item_count;
}
exports.ReqCreateItemAll = function() {
	this.item_count;
}
exports.AckInventory = function() {
	this.msg;
	this.item_list = [];
	this.equipment_list = [];
}
exports.EvtInventory = function() {
	this.item_list = [];
	this.equipment_list = [];
}

exports.ReqDailyContents = function() {
}
exports.AckDailyContents = function() {
	this.msg;
	this.challenge_battle_count;
	this.shop_reset_count;
	this.gold_buy_count;
	this.stamina_buy_count;
	this.guild_raid_battle_count;
	this.gacha_info_list = [];
}
exports.EvtDailyContents = function() {
	this.challenge_battle_count;
	this.shop_reset_count;
	this.gold_buy_count;
	this.stamina_buy_count;
	this.guild_raid_battle_count;
	this.gacha_info_list = [];
}

exports.ReqStageClear = function() {
}
exports.AckStageClear = function() {
	this.msg;
	this.chapter_list = [];
	this.stage_list = [];
}
exports.EvtStageClear = function() {
	this.chapter_list = [];
	this.stage_list = [];
}

exports.ReqSendMail = function() {
	this.uuid;
	this.sender;
	this.mail_type;
	this.mail_icon_type;
	this.mail_icon_item_id;
	this.mail_icon_count;
	this.subject;
	this.contents;
	this.reward_items = [];	// Item array : max 5
}
exports.AckSendMail = function() {
	this.msg;
}
exports.EvtSendMail = function() {
}

exports.ReqServerMsg = function() {
	this.msg;
}
exports.AckServerMsg = function() {
	this.msg;
}
exports.EvtServerMsg = function() {
	this.msg;
}

exports.ReqGuildPoint = function() {
	this.guild_point;
}
exports.AckGuildPoint = function() {
	this.msg;
	this.guild_point;
}
exports.EvtGuildPoint = function() {
	this.guild_point;
}