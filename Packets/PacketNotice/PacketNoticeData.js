/********************************************************************
Title : PacketNoticeData
Date : 2016.03.04
Update : 2016.07.27
Desc : 팻킷 정의 - Notice
writer : dongsu
********************************************************************/
exports.EvtLoseRankMatch = function() {
	this.current_rank;
}

exports.EvtMissionUpdate = function() {
	this.mission_id;
	this.progress_count;
}

exports.EvtAllowGuildJoin = function() { }
exports.EvtBanAtGuild = function() { }
exports.EvtChangeAuth = function() {
	this.prev_guild_auth;
	this.guild_auth;
}

exports.EvtFriendRequest = function() {
	this.user_info;	// PacketCommonData.UserInfo
}

exports.EvtFriendAccept = function() {
	this.friend_uuid;
}

exports.EvtFriendRecvStamina = function() {
	this.friend_uuid;
	this.recv_stamina_unix_time;
}

exports.EvtFriendDelete = function() {
	this.friend_uuid;
}

exports.EvtRandomShopOpen = function() { }

exports.EvtGuildSkillUp = function() {
	this.skill_id;
	this.skill_level;
}