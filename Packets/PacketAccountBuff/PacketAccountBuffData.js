/********************************************************************
Title : PacketAccountData
Date : 2016.08.09
Update : 2017.01.03
Desc : 패킷 정의 - AccountBuff
writer: jongwook
********************************************************************/
exports.ReqAccountBuffInfo = function () {
	this.packet_srl;
}
exports.AckAccountBuffInfo = function () {
	this.packet_srl;
	this.result;
	this.account_buff_list = [];	// AccountBuff array
}

exports.ReqAccountBuffLevelup = function () {
	this.packet_srl;
	this.account_buff_id;
}
exports.AckAccountBuffLevelup = function () {
	this.packet_srl;
	this.result;
	this.gold;
	this.buff_id;
	this.buff_level;
	this.account_buff_point;
	this.result_item;		// Item
}

exports.ReqAccountBuffReset = function () {
	this.packet_srl;
}
exports.AckAccountBuffReset = function () {
	this.packet_srl;
	this.result;
	this.cash;
	this.refund_gold
	this.refund_item;	// Item
}