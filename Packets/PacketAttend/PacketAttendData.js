/********************************************************************
Title : PacketAttendData
Date : 2016.03.03
Update : 2016.08.30
Desc : 패킷 정의 - 출석 보상
writer: jongwook
********************************************************************/
// 일일 보상
exports.ReqAttendDailyReward = function () {
	this.packet_srl;
	this.reward_day;
}
exports.AckAttendDailyReward = function () {
	this.packet_srl;
	this.result;
	this.accum_attend_date;
	this.vip_reward;
	this.reward_box;	// PacketCommomData.RewardBox
}

// 추가 일일 보상
exports.ReqAddAttendDailyReward = function () {
	this.packet_srl;
}
exports.AckAddAttendDailyReward = function () {
	this.packet_srl;
	this.result;
	this.reamin_buy_count;
	this.accum_attend_date;
	this.vip_reward;
	this.cash;
	this.reward_box;	// PacketCommomData.RewardBox
}

// 누적 보상
exports.ReqAttendAccumReward = function () {
	this.packet_srl;
	this.reward_day;
}
exports.AckAttendAccumReward = function () {
	this.packet_srl;
	this.result;
	this.accum_reward_date;
	this.reward_box;	
}