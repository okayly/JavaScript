/********************************************************************
Title : PacketBattleData
Date : 2016.01.04
Update : 2017.03.13
Desc : 패킷 정의 - 배틀
writer : dongsu
********************************************************************/
exports.ReqBattleStart = function() {
	this.packet_srl;
	this.chapter_id;
	this.stage_id;
}

exports.AckBattleStart = function() {
	this.packet_srl;
	this.result;
	this.reward_item_list = [];
}

exports.ReqBattleFinish = function() {
	this.packet_srl;
	this.clear_grade;
}
exports.AckBattleFinish = function() {
	this.packet_srl;
	this.result;
	this.chapter_id;
	this.stage_id;
	this.first_enter;
	this.result_gold;
	this.result_user_level;
	this.result_user_exp;
	this.stamina;
	this.max_stamina;
	this.stamina_remain_time;
	this.account_buff_point;
	this.result_hero_list = [];
	this.result_item_list = [];
	this.result_equipment_list = [];
}

exports.ReqBattleSweep = function() {
	this.packet_srl;
	this.chapter_id;
	this.stage_id;
	this.sweep_count;
}

exports.AckBattleSweep = function() {
	this.packet_srl;
	this.result;
	this.result_user_level;
	this.result_user_exp;
	this.result_gold;
	this.stamina;
	this.max_stamina;
	this.stamina_remain_time;
	this.account_buff_point;
	this.sweep_reward_ui;			// PacketCommonData.SweepRewardItemUI
	this.stage_reward_list_ui = [];	// PacketCommonData.SweepRewardItemUI Array
	this.sweep_reward;				// PacketCommonData.SweepRewardItem
}
