/********************************************************************
Title : PacketPVPData
Date : 2017.02.27
Update : -
Desc : 
writer: dongsu
********************************************************************/
exports.ReqPvpInfoUpdate = function() {
	this.packet_srl;
	this.except_uuid_list;
}
exports.AckPvpInfoUpdate = function() {
	this.packet_srl;
	this.result;
	this.league_rank;
	this.group_rank;
	this.group_id;
	this.remain_pvp_play_count;
	this.last_play_count_charge_date;
	this.match_player_list = [];
	this.league_members_count;
	this.group_members_count;
}

exports.ReqFindMatchPlayer = function() {
	this.packet_srl;
	this.except_uuid_list;
}
exports.AckFindMatchPlayer = function() {
	this.packet_srl;
	this.result;
	this.match_player_list = [];
}

exports.ReqPvpLeagueRankList = function() {
	this.packet_srl;
	this.league_id;
}
exports.AckPvpLeagueRankList = function() {
	this.packet_srl;
	this.result;
	this.rank_user_list = [];
}

exports.ReqPvpGroupRankList = function() {
	this.packet_srl;
	this.page_num;
}
exports.AckPvpGroupRankList = function() {
	this.packet_srl;
	this.result;
	this.page_num;
	this.rank_user_list = [];
}

exports.ReqPvpStart = function() {
	this.packet_srl;
	this.target_uuid;
}
exports.AckPvpStart = function() {
	this.packet_srl;
	this.result;
	this.target_uuid;
	this.pvp_hero_equip_list = [];
	this.pvp_hero_skill_list = [];
	this.account_buff_list = [];
	this.guild_buff_list = [];
	this.hero_combi_buff_list = [];	// PacketCommonData.HeroCombiBuff
}

exports.ReqPvpFinish = function() {
	this.packet_srl;
	this.battle_result;
	this.target_uuid;
}
exports.AckPvpFinish = function() {
	this.packet_srl;
	this.result;
	this.cur_league_id;
	this.battle_result;
	this.pvp_point;
	this.honor_point;
	this.remain_honor_point;
	this.remain_pvp_play_count;
}

exports.ReqPvpAchievementReward = function() {
	this.packet_srl;
	this.league_id;
}
exports.AckPvpAchievementReward = function() {
	this.packet_srl;
	this.result;
	this.league_id;
	this.point_honor;
	this.cash;
}

exports.ReqPvpRecord = function() {
	this.packet_srl;
}
exports.AckPvpRecord = function() {
	this.packet_srl;
	this.result;
	this.pvp_record_list = [];
}