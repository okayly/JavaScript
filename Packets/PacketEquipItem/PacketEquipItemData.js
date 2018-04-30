/********************************************************************
Title : PacketEquipItemDAta
Date : 2016.01.05
Update : 2017.04.03
Desc : 패킷 정의 - 장착 아이템
writer: jongwook
********************************************************************/
exports.ReqEquipment = function () {
	this.packet_srl;
}
exports.AckEquipment = function () {
	this.packet_srl;
	this.result;
	this.equipment_list = [];	// PacketCommonData.Equipment
}

exports.ReqEquipItem = function () {
	this.packet_srl;
	this.hero_id;
	this.equip_set_id;
	this.equip_slot_list = [];	// PacketCommonData.EquipSlot
}
exports.AckEquipItem = function () {
	this.packet_srl;
	this.result;
}

exports.ReqEquipItemOne = function () {
	this.packet_srl;
	this.hero_id;
	this.equip_set_id;
	this.equip_slot;	// PacketCommonData.EquipSlot
}
exports.AckEquipItemOne = function () {
	this.packet_srl;
	this.result;
}

exports.ReqEquipItemLevelup = function () {
	this.packet_srl;
	this.iuid;
}
exports.AckEquipItemLevelup = function () {
	this.packet_srl;
	this.result;
	this.iuid;
	this.item_level;
	this.gold;
}

exports.ReqEquipItemReinforce = function () {
	this.packet_srl;
	this.iuid;
}
exports.AckEquipItemReinforce = function () {
	this.packet_srl;
	this.result;
	this.result_reinforce;
	this.iuid;
	this.reinforce_step;
	this.gold;
	this.result_item;
}

exports.ReqEquipItemLock = function () {
	this.packet_srl;
	this.iuid;
	this.is_lock;
}
exports.AckEquipItemLock = function () {
	this.packet_srl;
	this.result;
	this.iuid;
	this.is_lock;
}

exports.ReqEquipItemSell = function () {
	this.packet_srl;
	this.iuid_list = [];
}
exports.AckEquipItemSell = function () {
	this.packet_srl;
	this.result;
	this.gold;
	this.iuid_list = [];
}