/********************************************************************
Title : PacketGuildData
Date : 2016.03.23
Update : 2017.03.13
Desc : 패킷 정의 - 길드
writer : dongsu
********************************************************************/
var PacketCommonData = require('../PacketCommonData.js');

exports.ReqCreateGuild = function() {
	this.packet_srl;
	this.guild_name;
	this.guild_mark;
}
exports.AckCreateGuild = function() {
	this.packet_srl;
	this.guild_id;
	this.result;
	this.result_cash;
}

exports.ReqRecommandGuild = function() {
	this.packet_srl;
}
exports.AckRecommandGuild = function() {
	this.packet_srl;
	this.result;
	this.guild_list = []; // PacketCommonData.Guild
}

exports.ReqGuildDetailInfo = function() {
	this.packet_srl;
	this.guild_id;
}
exports.AckGuildDetailInfo = function() {
	this.packet_srl;
	this.result;
	this.guild_detail_info 	= new PacketCommonData.GuildDetailInfo();
	this.guild_member_list 	= []; // PacketCommonData.GuildMember Array
	this.guild_raid_battle_count;
}

exports.ReqGuildJoin = function() {
	this.packet_srl;
	this.guild_id;
}
exports.AckGuildJoin = function() {
	this.packet_srl;
	this.result;
	this.guild_id;
}

exports.ReqGuildPendingApprovalList = function() {
	this.packet_srl;
}
exports.AckGuildPendingApprovalList = function() {
	this.packet_srl;
	this.result;
	this.pending_approval_list = []; // PacketCommonData.GuildJoinPendingApprovalUser Array
}

exports.ReqGuildPendingApprovalProcess = function() {
	this.packet_srl;
	this.target_uuid;
	this.process_type;
}
exports.AckGuildPendingApprovalProcess = function() {
	this.packet_srl;
	this.result;
}

exports.ReqGuildMemberBan = function() {
	this.packet_srl;
	this.target_uuid;
}
exports.AckGuildMemberBan = function() {
	this.packet_srl;
	this.result;
}

exports.ReqFindGuild = function() {
	this.packet_srl;
	this.guild_name;
}
exports.AckFindGuild = function() {
	this.packet_srl;
	this.result;
	this.guild_info = new PacketCommonData.Guild();
}

exports.ReqLeaveGuild = function() { 
	this.packet_srl;
}
exports.AckLeaveGuild = function() {
	this.packet_srl;
	this.result;
}

exports.ReqChangeGuildInfo = function() {
	this.packet_srl;
	this.guild_mark;
	this.guild_notice;
	this.guild_join_option;
	this.auto_master_change;
	this.elder_raid_open;
}
exports.AckChangeGuildInfo = function() {
	this.packet_srl;
	this.result;
	this.guild_mark;
	this.guild_notice;
	this.guild_join_option;
	this.auto_master_change;
	this.elder_raid_open;
}

exports.ReqGuildInvitation = function() {
	this.packet_srl;
	this.user_nick;
}
exports.AckGuildInvitation = function() {
	this.packet_srl;
	this.result;
}

exports.ReqGuildInvitationList = function() {
	this.packet_srl;
}
exports.AckGuildInvitationList = function() {
	this.packet_srl;
	this.result;
	this.guild_info_list = []; 	// PacketCommonData.Guild() Array
}

exports.ReqGuildInvitationProcess = function() {
	this.packet_srl;
	this.guild_id;
	this.process_type;
}
exports.AckGuildInvitationProcess = function() {
	this.packet_srl;
	this.result;
	this.guild_id;
}

exports.ReqChangeAuth = function() {
	this.packet_srl;
	this.target_uuid;
	this.auth_type;
}
exports.AckChangeAuth = function() {
	this.packet_srl;
	this.result;
}

exports.ReqChangeAuthConfirm = function() {
	this.packet_srl;
} 
exports.AckChangeAuthConfirm = function() {
	this.packet_srl;
	this.result;
}

exports.ReqGuildPointDonation = function() {
	this.packet_srl;
	this.guild_id;
	this.donation_id;
}
exports.AckGuildPointDonation = function() {
	this.packet_srl;
	this.result;
	this.wallet;
	this.guild_point;
	this.weekly_guild_accum_donation_point;
	this.remain_donation_count;
	this.lately_free_donation_time; 	// UNIX TIME
}

exports.ReqGuildLevelup = function() {
	this.packet_srl;
	this.guild_id;
}
exports.AckGuildLevelup = function() {
	this.packet_srl;
	this.result;
	this.guild_level;
	this.guild_point;
	this.skill_id;
}



// Raid
exports.ReqGuildRaidInfo = function() {
	this.packet_srl;
	this.guild_id;
}
exports.AckGuildRaidInfo = function() {
	this.max_clear_raid_chapter;
	this.max_clear_raid_date;
	this.current_raid_chapter_id;
	this.current_raid_stage_id;
	this.current_raid_boss_hp;
	this.raid_open_date;
	this.raid_daily_join_count;
	this.raid_state;
}

exports.ReqGuildRaidOpen = function() {
	this.packet_srl;
	this.guild_id;
	this.chapter_id;
	this.stage_id;
}
exports.AckGuildRaidOpen = function() {
	this.packet_srl;
	this.result;
	this.guild_raid_chapter_id;
	this.guild_point;
	this.open_date;
}

exports.ReqGuildRaidBattleStart = function() {
	this.packet_srl;
	this.chapter_id;
	this.stage_id;
}
exports.AckGuildRaidBattleStart = function() {
	this.packet_srl;
	this.result;
	this.stage_id;
	this.boss_hp;
}

exports.ReqGuildRaidBattleFinish = function() {
	this.packet_srl;
	this.guild_id;
	this.chapter_id;
	this.stage_id;
	this.ret_boss_hp;
	this.attack_damage;
}
exports.AckGuildRaidBattleFinish = function() {
	this.packet_srl;
	this.result;
	this.stage_id;
	this.accum_damage;
	this.boss_hp;
	this.guild_raid_battle_count;
}

exports.ReqGuildRaidRank = function() {
	this.packet_srl;
	this.guild_id;
	this.rank_type;
	this.stage_id;
}
exports.AckGuildRaidRank = function() {
	this.packet_srl;
	this.result;
	this.rank_type;
	this.ranker_list = [];
}

exports.ReqWeeklyDonationReward = function() {
	this.packet_srl;
}
exports.AckWeeklyDonationReward = function() {
	this.packet_srl;
	this.result;
	this.reward_box; 	// RewardBox
}

exports.ReqDonationRank = function() {
	this.packet_srl;
}
exports.AckDonationRank = function() {
	this.packet_srl;
	this.result;
	this.user_list = []; 	// DonationRankUserInfo
}

exports.ReqGuildSkillLevelUp = function() {
	this.packet_srl;
	this.skill_id;
}
exports.AckGuildSkillLevelUp = function() {
	this.packet_srl;
	this.result;
	this.guild_point;
	this.skill_id;
	this.skill_level;
}

exports.ReqForceChangeAuth = function() {
	this.packet_srl;
	this.master_uuid;
}
exports.AckForceChangeAuth = function() {
	this.packet_srl;
	this.result;
	this.master_uuid;
}