/********************************************************************
Title : PacketLoginServerData
Date : 2016.08.26
Update : 2016.09.29
Desc : 패킷 정의
writer: jongwook
********************************************************************/
exports.ReqUserCount = function () {
	this.packet_srl;
}
exports.AckUserCount = function () {
	this.user_count;
}