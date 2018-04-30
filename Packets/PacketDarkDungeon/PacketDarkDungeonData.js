/********************************************************************
Title : PacketDarkDungeonData
Date : 2016.12.09
Update : 2016.12.19
Desc : 패킷 정의 - DarkDungeon
writer: jongwook
********************************************************************/
exports.DarkDungeonChapter = function() {
	this.chapter_id;
	this.curr_stage_id;
	this.chapter_state;
	this.start_unix_time;
	this.reward_main_item_list = [];	// int array
}

exports.ReqDarkDungeon = function() {
	this.packet_srl;
}
exports.AckDarkDungeon = function() {
	this.packet_srl;
	this.result;
	this.darkdungeon_list = [];
}

exports.ReqDarkDungeonCreate = function() {
	this.packet_srl;
	this.chapter_id;
}
exports.AckDarkDungeonCreate = function() {
	this.packet_srl;
	this.result;
	this.darkdungeon;
}

exports.ReqDarkDungeonChapter = function() {
	this.packet_srl;
	this.chapter_id;
}
exports.AckDarkDungeonChapter = function() {
	this.packet_srl;
	this.result;
	this.darkdungeon;
}

exports.ReqDarkDungeonBattleStart = function() {
	this.packet_srl;
	this.chapter_id;
	this.stage_id;
}
exports.AckDarkDungeonBattleStart = function() {
	this.packet_srl;
	this.result;
}

exports.ReqDarkDungeonBattleFinish = function() {
	this.packet_srl;
}
exports.AckDarkDungeonBattleFinish = function() {
	this.packet_srl;
	this.result;
	this.chapter_id;
	this.stage_id;
	this.result_gold;
	this.result_user_level;
	this.result_user_exp;
	this.account_buff_point;
	this.stamina;
	this.max_stamina;
	this.stamina_remain_time;
	this.result_hero_list = [];
	this.result_item_list = [];
	this.result_equipment_list = [];
}

exports.ReqDarkDungeonReward = function() {
	this.packet_srl;
}
exports.AckDarkDungeonReward = function() {
	this.packet_srl;
	this.result;
	this.chapter_state;
	this.reward_box;	// PacketCommomData.RewardBox
}

exports.ReqDarkDungeonNextStage = function() {
	this.packet_srl;
	this.chapter_id;
	this.stage_id;
}
exports.AckDarkDungeonNextStage = function() {
	this.packet_srl;
	this.result;
	this.chapter_id;
	this.stage_id;
	this.chapter_state
}

exports.ReqDarkDungeonReward = function() {
	this.packet_srl;
	this.chapter_id;
}
exports.AckDarkDungeonReward = function() {
	this.packet_srl;
	this.result;
	this.chapter_id;
	this.stage_id;
	this.state;
	this.reward_box;	// PacketCommomData.RewardBox
}

exports.ReqDarkDungeonChapterReset = function() {
	this.packet_srl;
	this.chapter_id;
	this.stage_id;
}
exports.AckDarkDungeonChapterReset = function() {
	this.packet_srl;
	this.result;
	this.cash;
	this.darkdugeon;
}