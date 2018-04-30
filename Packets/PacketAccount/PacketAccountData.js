/********************************************************************
Title : Packet AccountData
Date : 2015.12.31
Update : 2017.01.03
Desc : 패킷 정의 - 유저
writer: jongwook
********************************************************************/
exports.ReqLogon = function () {
	this.packet_srl;
	this.account;
}
exports.AckLogon = function () {
	this.packet_srl;
	this.result;
	this.uuid;
}

exports.ReqUser = function () {
	this.packet_srl;
	this.uuid;
	this.last_login_unix_time;
}
exports.AckUser = function () {
	this.packet_srl;
	this.result;
	this.nick;
	this.icon;
	this.level;	
	this.exp;
	this.gold;
	this.cash
	this.pvp_point;
	this.guild_point;
	this.challenge_point;
	this.stamina;
	this.max_stamina;
	this.stamina_remain_time;
	this.skill_point;
	this.max_skill_point;
	this.skill_point_remain_time;
	this.account_buff_point;
	this.max_equip_item_inventory_slot;
	this.buy_equip_item_inventory_slot;
}

exports.ReqInventory = function () {
	this.packet_srl;
	this.uuid;
}
exports.AckInventory = function () {
	this.packet_srl;
	this.result;
	this.items = [];
}

exports.ReqHeroBases = function() {
	this.packet_srl;
}
exports.AckHeroBases = function () {
	this.packet_srl;
	this.result;
	this.heroes = [];
	this.hero_equip_list = [];
}

exports.ReqTeam = function () {
	this.packet_srl;
}
exports.AckTeam = function () {
	this.packet_srl;
	this.result;
	this.team_list = [];
}

// castle
exports.ReqChapterReward = function() {
	this.packet_srl;
	this.chapter_id;
	this.reward_box_id;
}
exports.AckChapterReward = function() {
	this.packet_srl;
	this.result;
	this.cash;
	this.gold;
	this.item_list = [];
	this.equipment_list = [];
}

exports.ReqStageInfo = function() {
	this.packet_srl;
}
exports.AckStageInfo = function() {
	this.packet_srl;
	this.result;
	this.chapter_list = [];
	this.stage_list = [];	
}

exports.ReqVip = function () {
	this.packet_srl;
	this.uuid;
}
exports.AckVip = function () {
	this.packet_srl;
	this.result;
	this.step;
	this.buy_stamina_count;
	this.buy_gold_count;
	this.buy_add_attend_count;
	this.accum_buy_cash;
	this.reward_steps = [];	// 보상 받은 스텝
}
exports.ReqVipReward = function () {
	this.packet_srl;
	this.uuid;
	this.step;
}
exports.AckVipReward = function() {
	this.packet_srl;
	this.result;
	this.vip_step;
	this.reward_box;	// PacketCommonData.RewardBox
}

exports.ReqGachaInfo = function() {
	this.packet_srl;
}

exports.AckGachaInfo = function() {
	this.packet_srl;
	this.result;
	this.gacha_info_list = [];
}

exports.ReqWeeklyDungeonExecCount = function() {
	this.packet_srl;
}
exports.AckWeeklyDungeonExecCount = function() {
	this.packet_srl;
	this.result;	
	this.exec_count;
}

exports.ReqAttendInfo = function () {
	this.packet_srl;
}
exports.AckAttendInfo = function () {
	this.packet_srl;
	this.result;
	this.attend_accum_day;
	this.last_attend_reward_day;
	this.attend_accum_reward_days = [];
	this.buy_add_attend_count;
}

// mission
exports.ReqMissionInfo = function() {
	this.packet_srl;
	this.mission_ids = [];
}
exports.AckMissionInfo = function() {
	this.packet_srl;
	this.result;
	this.mission_list = []; // PacketCommonData.Mission
}

// guild
exports.ReqGuildInfo = function() { 
	this.packet_srl;
}
exports.AckGuildInfo = function() {
	this.packet_srl;
	this.result;
	this.guild_id;
	this.prev_guild_auth;
	this.guild_auth;
	this.remain_donation_count;
	this.take_donation_reward;
	this.lately_free_donation_time;
	this.guild_skill_list = []; // PacketCommonData.GuildSkillInfo
}

exports.ReqReConnect = function() {
	this.packet_srl;
	this.uuid;
}
exports.AckReConnect = function() {
	this.packet_srl;
	this.result;
}

exports.ReqChangeNick = function() {
	this.packet_srl;
	this.nick;
}
exports.AckChangeNick = function() {
	this.packet_srl;
	this.result;
	this.nick;
}

exports.ReqChangeUserIcon = function() {
	this.packet_srl;
	this.icon_id;
}
exports.AckChangeUserIcon = function() {
	this.packet_srl;
	this.result;
	this.icon_id;
}

exports.ReqPvpInfo = function() {
	this.packet_srl;
}
exports.AckPvpInfo = function() {
	this.packet_srl;
	this.result;
	this.last_play_count_charge_date;
	this.league_index;
	this.league_rank;
	this.group_index;
	this.group_rank;
	this.pvp_point;
	this.remain_honor_point;
	this.remain_pvp_play_count;
	this.battle_power;
	this.win_weekly_pvp;
	this.lose_weekly_pvp;
	this.highest_reach_league_id;
	this.take_league_reward_id;
}