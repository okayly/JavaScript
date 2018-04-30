/********************************************************************
Title : PacketInventoryData
Date : 2016.02.03
Desc : 패킷 정의 - 가방
writer : jongwook
********************************************************************/
exports.ReqUseItem = function() {
	this.packet_srl;
	this.uuid;
	this.iuid;
}
exports.AckUseItem = function() {
	this.packet_srl;
	this.result;
	this.gold;
	this.cash;
	this.point_honor;
	this.point_alliance;
	this.point_challenge;
	this.stamina;
	this.stamina_remain_time;
	this.use_item;
}

exports.ReqSellItem = function() {	
	this.packet_srl;
	this.iuid;
	this.sell_count;
}
exports.AckSellItem = function() {
	this.packet_srl;
	this.result;
	this.gold;	
	this.sell_item;
}

exports.ReqUseRandomBox = function() {
	this.packet_srl;
	this.uuid;
	this.iuid;
}
exports.AckUseRandomBox = function() {
	this.packet_srl;
	this.result;
	this.use_item;
	this.gold;
	this.cash;
	this.point_honor;
	this.point_alliance;
	this.point_challenge;
	this.get_items = [];
}