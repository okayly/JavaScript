/********************************************************************
Title : PacketShopData
Date : 2016.01.18
Desc : 패킷 정의 - 상점
writer: jongwook
********************************************************************/
exports.ReqShopIDs = function() {
	this.packet_srl;
	this.uuid;
}
exports.AckShopIDs = function() {
	this.packet_srl;
	this.result;
	this.normal_id;
	this.pvp_id;
	this.guild_id;
	this.random_id;
	this.reset_remain_time;
	this.random_remain_time;
}

exports.ReqShopBuy = function() {
	this.packet_srl;
	this.uuid;
	this.shop_id;
	this.item_slot;
	this.shop_type;
}
exports.AckShopBuy = function() {
	this.packet_srl;
	this.result;
	this.result_item;
	this.gold;
	this.cash;
	this.guild_point;
	this.pvp_point;
}

exports.ReqShopReset = function() {
	this.packet_srl;
	this.uuid;
	this.shop_type;
}
exports.AckShopReset = function() {
	this.packet_srl;
	this.result;
	this.shop_id;
	this.cash;
	this.reset_count;
}

exports.ReqShopResetCount = function() {
	this.packet_srl;
}
exports.AckShopResetCount = function() {
	this.packet_srl;
	this.result;
	this.reset_count;
}

exports.ReqRandomShopIsOpen = function() {
	this.packet_srl;
	this.uuid;
}
exports.AckRandomShopIsOpen = function() {
	this.packet_srl;
	this.result;
	this.shop_id;
	this.close_remain_time;
}

exports.ReqRandomShopOpen = function() {
	this.packet_srl;
}
exports.AckRandomShopOpen = function() {
	this.packet_srl;
	this.result;
}

exports.ReqShopBuyHeroExp = function() {
	this.packet_srl;
	this.result;
	this.uuid;
	this.item_id;
	this.item_count;
}
exports.AckShopBuyHeroExp = function() {
	this.packet_srl;
	this.result;
	this.result_item;
	this.cash;
}