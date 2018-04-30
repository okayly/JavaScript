/********************************************************************
Title : PacketCommonData
Date : 2016.02.02
Desc : 패킷 정의 - 스테미너, 스킬 포인트
writer: jongwook
********************************************************************/
exports.ReqChargeStamina = function () {
	this.packet_srl;
	this.uuid;
}
exports.AckChargeStamina = function () {
	this.packet_srl;
	this.result;
	this.stamina;
	this.stamina_remain_time;
}

exports.ReqChargeSkillPoint = function () {
	this.packet_srl;
	this.uuid;
}
exports.AckChargeSkillPoint = function () {
	this.packet_srl;
	this.result;
	this.skill_point;
	this.skill_point_remain_time;
}