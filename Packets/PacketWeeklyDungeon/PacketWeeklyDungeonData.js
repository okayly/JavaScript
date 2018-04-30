/********************************************************************
Title : PacketWeeklyDungeonData
Date : 2016.11.25
Update : 2017.03.28
Desc : 패킷 정의 - 요일 던전
writer: dongsu
********************************************************************/

var PacketCommonData = require('../PacketCommonData.js');

// challenge
exports.ReqWeeklyDungeonStart = function () {
	this.packet_srl;
	this.stage_id;
}
exports.AckWeeklyDungeonStart = function () {
	this.packet_srl;
	this.result;
}

exports.ReqWeeklyDungeonFinish = function() {
	this.packet_srl;
	this.stage_id;
	this.team_id;
}
exports.AckWeeklyDungeonFinish = function() {
	this.packet_srl;
	this.result;
	this.result_gold;
	this.result_user_level;
	this.result_user_exp;
	this.account_buff_point;
	this.stamina;
	this.max_stamina;
	this.stamina_remain_time;
	this.exec_count;	
	this.result_hero_list = [];	// PacketCommonData.HeroLevelInfo Array
	this.result_item_list = []; // PacketCommonData.Item Array
	this.result_equipment_list = [];
}