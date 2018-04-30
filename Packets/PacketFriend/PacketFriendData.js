/********************************************************************
Title : PacketFriendData
Date : 2016.07.26
Desc : 패킷 정의 - Friend
writer: jongwook
********************************************************************/
exports.ReqFriendInfo = function() {
	this.packet_srl;
}
exports.AckFriendInfo = function() {
	this.packet_srl;
	this.result;
	this.friend_list = [];	// PacketCommonData.Friend Array
	this.delete_count;
}

exports.ReqFindFriend = function() {
	this.packet_srl;
	this.nick;
}
exports.AckFindFriend = function() {
	this.packet_srl;
	this.result;	
	this.user_info;			// PacketCommonData.UerInfo
}

exports.ReqFriendRecommandList = function() {
	this.packet_srl;
}
exports.AckFriendRecommandList = function() {
	this.packet_srl;
	this.result;
	this.user_info_list = [];	// PacketCommonData.UserInfo Array
}

exports.ReqFriendRequestSendList = function() {
	this.packet_srl;
}
exports.AckFriendRequestSendList = function() {
	this.packet_srl;
	this.result;
	this.user_info_list = [];	// PacketCommonData.UserInfo Array
}

exports.ReqFriendRequestRecvList = function() {
	this.packet_srl;
}
exports.AckFriendRequestRecvList = function() {
	this.packet_srl;
	this.result;
	this.user_info_list = [];	// PacketCommonData.UserInfo Array
}

exports.ReqFriendRequest = function() {
	this.packet_srl;
	this.request_uuid;
}
exports.AckFriendRequest = function() {
	this.packet_srl;
	this.result;
	this.request_uuid_list = [];	// long Array
	this.request_count;
}

exports.ReqFriendRequestAccept = function() {
	this.packet_srl;
	this.accept_uuid;
}
exports.AckFriendRequestAccept = function() {
	this.packet_srl;
	this.result;
	this.accept_uuid;
}

exports.ReqFriendRequestAcceptAll = function() {
	this.packet_srl;
}
exports.AckFriendRequestAcceptAll = function() {
	this.packet_srl;
	this.result;
	this.accept_uuid_list = [];
}

exports.ReqFriendRequestAccept = function() {
	this.packet_srl;
	this.accept_uuid;
}
exports.AckFriendRequestAccept = function() {
	this.packet_srl;
	this.result;
	this.accept_user_info;
}

exports.ReqFriendRequestCancel = function() {
	this.packet_srl;
	this.cancel_uuid;
}
exports.AckFriendRequestCancel = function() {
	this.packet_srl;
	this.result;
	this.cancel_uuid;
}

exports.ReqFriendRequestCancelAll = function() {
	this.packet_srl;
}
exports.AckFriendRequestCancelAll = function() {
	this.packet_srl;
	this.result;
	this.cancel_uuid_list = [];
}

exports.ReqFriendRequestRefuse = function() {
	this.packet_srl;
	this.refuse_uuid;
}
exports.AckFriendRequestRefuse = function() {
	this.packet_srl;
	this.result;
	this.refuse_uuid;
}

exports.ReqFriendRequestRefuseAll = function() {
	this.packet_srl;
}
exports.AckFriendRequestRefuseAll = function() {
	this.packet_srl;
	this.result;
	this.refuse_uuid_list = [];
}

exports.ReqFriendDelete = function() {
	this.packet_srl;
	this.delete_uuid_list = [];
}
exports.AckFriendDelete = function() {
	this.packet_srl;
	this.result;
	this.delete_count;
	this.delete_uuid_list = [];	
}

exports.ReqFriendSendStamina = function() {
	this.packet_srl;
	this.friend_uuid;
}
exports.AckFriendSendStamina = function() {
	this.packet_srl;
	this.result;
	this.friend_uuid;
	this.stamina;
	this.stamin_remain_time;
}

exports.ReqFriendSendStaminaAll = function() {
	this.packet_srl;
}
exports.AckFriendSendStaminaAll = function() {
	this.packet_srl;
	this.result;
	this.friend_uuid_list = [];
	this.stamina;
	this.stamin_remain_time;
}

exports.ReqFriendTakeStamina = function() {
	this.packet_srl;
	this.friend_uuid;
}
exports.AckFriendTakeStamina = function() {
	this.packet_srl;
	this.result;
	this.friend_uuid;
	this.stamina;
	this.stamina_remain_time;
}

exports.ReqFriendTakeStaminaAll = function() {
	this.packet_srl;
}
exports.AckFriendTakeStaminaAll = function() {
	this.packet_srl;
	this.result;
	this.friend_uuid_list = [];
	this.stamina;
	this.stamina_remain_time;
}

exports.ReqFriendRequestAll = function() {
	this.packet_srl;
}
exports.AckFriendRequestAll = function() {
	this.packet_srl;
	this.result;
	this.uuid_list = [];
}

exports.ReqFriendSendMemo = function() {
	this.packet_srl;
	this.friend_uuid;
	this.memo;
}
exports.AckFriendSendMemo = function() {
	this.packet_srl;
	this.result;
	this.friend_uuid;
}