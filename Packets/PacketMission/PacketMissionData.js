/********************************************************************
Title : PacketMissionData
Date : 2016.03.17
Update : 2017.03.16
Desc : 패킷 정의 - 미션
writer : dongsu
********************************************************************/
exports.ReqMissionReward = function() {
	this.packet_srl;
	this.mission_id;
}
exports.AckMissionReward = function() {
	this.packet_srl;
	this.result;
	this.mission_id;
	this.reward_box;	// PacketCommomData.RewardBox
}

exports.ReqMissionProgress = function() {
	this.packet_srl;
	this.mission_id;
}
exports.AckMissionProgress = function() {
	this.packet_srl;
	this.result;
	this.mission_id;
	this.progress_count;
}