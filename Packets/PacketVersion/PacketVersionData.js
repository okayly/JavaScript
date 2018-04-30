/********************************************************************
Title : PacketVersionData
Date : 2016.05.25
Desc : 패킷 정의 - 버전
writer: jongwook
********************************************************************/
exports.ReqVersion = function () {
	this.packet_srl;
}
exports.AckVersion = function () {
	this.packet_srl;
	this.result;
	this.app_version;
	this.data_version;
}