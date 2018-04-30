/********************************************************************
Title : PacketBuyData
Date : 2016.01.14
Update : 2017.02.07
Desc : 패킷 정의 - Buy
writer: jongwook
********************************************************************/
exports.ReqBuyGold = function() {
	this.packet_srl;
	this.uuid;
}
exports.AckBuyGold = function() {
	this.packet_srl;
	this.result;
	this.gold;
	this.cash;
	this.gain_gold;
	this.gamble_multiple;
	this.remain_buy_count;
}

exports.ReqBuyStamina = function() {
	this.packet_srl;
	this.uuid;
}
exports.AckBuyStamina = function() {
	this.packet_srl;
	this.result;
	this.stamina;
	this.cash;
	this.remain_time;
	this.remain_buy_count;
}

exports.ReqBuyCash = function() {
	this.packet_srl;
	this.result;
	this.uuid;
	this.cash_id;
}
exports.AckBuyCash = function() {
	this.packet_srl;
	this.result;
	this.cash;
	this.vip_step;
}

exports.ReqBuySkillPoint = function() {
	this.packet_srl;
	this.uuid;
}
exports.AckBuySkillPoint = function() {
	this.packet_srl;
	this.result;
	this.skill_point;
	this.cash;
	this.remain_time;
}

exports.ReqBuyProphecySpringAbleCount = function() {
	this.packet_srl;
	this.chapter_id;
	this.stage_id;
}
exports.AckBuyProphecySpringAbleCount = function() {
	this.packet_srl;
	this.result;
	this.cash;
}

exports.ReqBuyEquipItemInventorySlot = function() {
	this.packet_srl;
}
exports.AckBuyEquipItemInventorySlot = function() {
	this.packet_srl;
	this.result;
	this.cash;
	this.max_equip_item_inventory_slot;
	this.buy_equip_item_inventory_slot;
}

exports.ReqBuyPvpAbleCount = function() {
	this.packet_srl;
}
exports.AckBuyPvpAbleCount = function() {
	this.packet_srl;
	this.result;
	this.result_cash;
	this.remain_pvp_play_count;
}
