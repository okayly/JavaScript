/********************************************************************
Title : PacketMailData
Date : 2016.02.23
Desc : 패킷 정의 - 우편
writer : jongwook
********************************************************************/
exports.ReqMailReadInfo = function () {
	this.packet_srl;
	this.uuid;
}
exports.AckMailReadInfo = function () {
	this.packet_srl;
	this.result;
	this.mail_read_infos = [];
}

exports.ReqMailList = function () {
	this.packet_srl;
	this.uuid;
	this.mail_ids;		// int array
}
exports.AckMailList = function () {
	this.packet_srl;
	this.result;
	this.mail_list_infos = [];
}

exports.ReqMailRead = function () {
	this.packet_srl;
	this.uuid;
	this.mail_id;
}
exports.AckMailRead = function () {
	this.packet_srl;
	this.result;
	this.mail_id;
	this.mail_string_id;
	this.string_value_list;
	this.mail_conents;
	this.read_yn;
	this.read_date;
	this.mail_rewards = [];
}

exports.ReqMailReward = function () {
	this.packet_srl;
	this.uuid;
	this.mail_id;
}
exports.AckMailReward = function () {
	this.packet_srl;
	this.result;
	this.mail_id;
	this.reward_box;	// PacketCommomData.RewardBox
}

exports.ReqMailRewardAll = function () {
	this.packet_srl;
	this.uuid;
}
exports.AckMailRewardAll = function () {
	this.packet_srl;
	this.result;
	this.mail_id;
	this.reward_box;	// PacketCommomData.RewardBox
}

exports.ReqMailSend = function () {
	this.packet_srl;
	this.uuid;
	this.sender;
	this.mail_type;
	this.mail_icon_type;
	this.mail_icon_item_id;
	this.mail_icon_count;
	this.subject;
	this.contents;
	this.reward_items = [];	// Item array : max 5
}
exports.AckMailSend = function () {
	this.packet_srl;
	this.result;
	this.uuid;
	this.sender;
	this.mail_type;
	this.mail_icon_type;
	this.mail_icon_item_id;
	this.mail_icon_count;
	this.subject;
	this.contents;
	this.reward_items = [];	// Item array : max 5
}