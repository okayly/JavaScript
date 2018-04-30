/********************************************************************
Title : PacketGachaData
Date : 2016.01.18
Desc : 패킷 정의 - 가챠
writer : dongsu
********************************************************************/
var PacketCommonData = require('../PacketCommonData.js');

exports.ReqGacha = function () {
	this.packet_srl;
	this.gacha_id;
}
exports.AckGacha = function () {
	this.packet_srl;
	this.result;
	this.gacha_info = new PacketCommonData.GachaInfo();
	this.result_gold;
	this.result_cash;
	this.gacha_view_info = new PacketCommonData.GachaViewInfo();
	this.result_item_info = new PacketCommonData.GachaResultInfo();
}
