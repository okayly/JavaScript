/********************************************************************
Title : PacketFriend
Date : 2016.07.26
Update : 2016.08.02
Desc : 패킷 정의 - Friend
writer: jongwook
********************************************************************/
var PacketFriendData = require('./PacketFriendData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Friend packet command init ****');

		fp.readFile('./Packets/PacketFriend/PacketFriendCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqFriendInfo = function() { return packet_cmd.Req.FriendInfo; }
	inst.cmdAckFriendInfo = function() { return packet_cmd.Ack.FriendInfo; }

	inst.cmdReqFindFriend = function() { return packet_cmd.Req.FindFriend; }
	inst.cmdAckFindFriend = function() { return packet_cmd.Ack.FindFriend; }

	inst.cmdReqFriendRecommandList = function() { return packet_cmd.Req.FriendRecommandList; }
	inst.cmdAckFriendRecommandList = function() { return packet_cmd.Ack.FriendRecommandList; }

	inst.cmdReqFriendRequestSendList = function() { return packet_cmd.Req.FriendRequestSendList; }
	inst.cmdAckFriendRequestSendList = function() { return packet_cmd.Ack.FriendRequestSendList; }

	inst.cmdReqFriendRequestRecvList = function() { return packet_cmd.Req.FriendRequestRecvList; }
	inst.cmdAckFriendRequestRecvList = function() { return packet_cmd.Ack.FriendRequestRecvList; }

	inst.cmdReqFriendSendStamina = function() { return packet_cmd.Req.FriendSendStamina; }
	inst.cmdAckFriendSendStamina = function() { return packet_cmd.Ack.FriendSendStamina; }

	inst.cmdReqFriendTakeStamina = function() { return packet_cmd.Req.FriendTakeStamina; }
	inst.cmdAckFriendTakeStamina = function() { return packet_cmd.Ack.FriendTakeStamina; }

	inst.cmdReqFriendSearch = function() { return packet_cmd.Req.FriendSearch; }
	inst.cmdAckFriendSearch = function() { return packet_cmd.Ack.FriendSearch; }

	inst.cmdReqFriendRequest = function() { return packet_cmd.Req.FriendRequest; }
	inst.cmdAckFriendRequest = function() { return packet_cmd.Ack.FriendRequest; }

	inst.cmdReqFriendRequestAccept = function() { return packet_cmd.Req.FriendRequestAccept; }
	inst.cmdAckFriendRequestAccept = function() { return packet_cmd.Ack.FriendRequestAccept; }

	inst.cmdReqFriendRequestCancel = function() { return packet_cmd.Req.FriendRequestCancel; }
	inst.cmdAckFriendRequestCancel = function() { return packet_cmd.Ack.FriendRequestCancel; }

	inst.cmdReqFriendRequestRefuse = function() { return packet_cmd.Req.FriendRequestRefuse; }
	inst.cmdAckFriendRequestRefuse = function() { return packet_cmd.Ack.FriendRequestRefuse; }

	inst.cmdReqFriendDelete = function() { return packet_cmd.Req.FriendDelete; }
	inst.cmdAckFriendDelete = function() { return packet_cmd.Ack.FriendDelete; }

	inst.cmdReqFriendSendMemo = function() { return packet_cmd.Req.FriendSendMemo; }
	inst.cmdAckFriendSendMemo = function() { return packet_cmd.Ack.FriendSendMemo; }

	inst.cmdReqUserInfo = function() { return packet_cmd.Req.UserInfo; }
	inst.cmdAckUserInfo = function() { return packet_cmd.Ack.UserInfo; }

	inst.cmdReqFriendRequestAcceptAll = function() { return packet_cmd.Req.FriendRequestAcceptAll; }
	inst.cmdAckFriendRequestAcceptAll = function() { return packet_cmd.Ack.FriendRequestAcceptAll; }

	inst.cmdReqFriendRequestCancelAll = function() { return packet_cmd.Req.FriendRequestCancelAll; }
	inst.cmdAckFriendRequestCancelAll = function() { return packet_cmd.Ack.FriendRequestCancelAll; }

	inst.cmdReqFriendRequestRefuseAll = function() { return packet_cmd.Req.FriendRequestRefuseAll; }
	inst.cmdAckFriendRequestRefuseAll = function() { return packet_cmd.Ack.FriendRequestRefuseAll; }

	inst.cmdReqFriendSendStaminaAll = function() { return packet_cmd.Req.FriendSendStaminaAll; }
	inst.cmdAckFriendSendStaminaAll = function() { return packet_cmd.Ack.FriendSendStaminaAll; }

	inst.cmdReqFriendTakeStaminaAll = function() { return packet_cmd.Req.FriendTakeStaminaAll; }
	inst.cmdAckFriendTakeStaminaAll = function() { return packet_cmd.Ack.FriendTakeStaminaAll; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketReqFriendInfo = function() { return new PacketFriendData.ReqFriendInfo; }
	inst.GetPacketAckFriendInfo = function() { return new PacketFriendData.AckFriendInfo; }

	inst.GetPacketReqFindFriend = function() { return new PacketFriendData.ReqFindFriend; }
	inst.GetPacketAckFindFriend = function() { return new PacketFriendData.AckFindFriend; }

	inst.GetPacketReqFriendRecommandList = function() { return new PacketFriendData.ReqFriendRecommandList; }
	inst.GetPacketAckFriendRecommandList = function() { return new PacketFriendData.AckFriendRecommandList; }

	inst.GetPacketReqFriendRequestSendList = function() { return new PacketFriendData.ReqFriendRequestSendList; }
	inst.GetPacketAckFriendRequestSendList = function() { return new PacketFriendData.AckFriendRequestSendList; }

	inst.GetPacketReqFriendRequestRecvList = function() { return new PacketFriendData.ReqFriendRequestRecvList; }
	inst.GetPacketAckFriendRequestRecvList = function() { return new PacketFriendData.AckFriendRequestRecvList; }

	inst.GetPacketReqFriendRequest = function() { return new PacketFriendData.ReqFriendRequest; }
	inst.GetPacketAckFriendRequest = function() { return new PacketFriendData.AckFriendRequest; }

	inst.GetPacketReqFriendRequestAccept = function() { return new PacketFriendData.ReqFriendRequestAccept; }
	inst.GetPacketAckFriendRequestAccept = function() { return new PacketFriendData.AckFriendRequestAccept; }

	inst.GetPacketReqFriendRequestAcceptAll = function() { return new PacketFriendData.ReqFriendRequestAcceptAll; }
	inst.GetPacketAckFriendRequestAcceptAll = function() { return new PacketFriendData.AckFriendRequestAcceptAll; }

	inst.GetPacketReqFriendRequestCancel = function() { return new PacketFriendData.ReqFriendRequestCancel; }
	inst.GetPacketAckFriendRequestCancel = function() { return new PacketFriendData.AckFriendRequestCancel; }

	inst.GetPacketReqFriendRequestCancelAll = function() { return new PacketFriendData.ReqFriendRequestCancelAll; }
	inst.GetPacketAckFriendRequestCancelAll = function() { return new PacketFriendData.AckFriendRequestCancelAll; }

	inst.GetPacketReqFriendRequestRefuse = function() { return new PacketFriendData.ReqFriendRequestRefuse; }
	inst.GetPacketAckFriendRequestRefuse = function() { return new PacketFriendData.AckFriendRequestRefuse; }

	inst.GetPacketReqFriendRequestRefuseAll = function() { return new PacketFriendData.ReqFriendRequestRefuseAll; }
	inst.GetPacketAckFriendRequestRefuseAll = function() { return new PacketFriendData.AckFriendRequestRefuseAll; }

	inst.GetPacketReqFriendDelete = function() { return new PacketFriendData.ReqFriendDelete; }
	inst.GetPacketAckFriendDelete = function() { return new PacketFriendData.AckFriendDelete; }

	inst.GetPacketReqFriendSendMemo = function() { return new PacketFriendData.ReqFriendSendMemo; }
	inst.GetPacketAckFriendSendMemo = function() { return new PacketFriendData.AckFriendSendMemo; }

	inst.GetPacketReqFriendSendStamina = function() { return new PacketFriendData.ReqFriendSendStamina; }
	inst.GetPacketAckFriendSendStamina = function() { return new PacketFriendData.AckFriendSendStamina; }

	inst.GetPacketReqFriendSendStaminaAll = function() { return new PacketFriendData.ReqFriendSendStaminaAll; }
	inst.GetPacketAckFriendSendStaminaAll = function() { return new PacketFriendData.AckFriendSendStaminaAll; }

	inst.GetPacketReqFriendTakeStamina = function() { return new PacketFriendData.ReqFriendTakeStamina; }
	inst.GetPacketAckFriendTakeStamina = function() { return new PacketFriendData.AckFriendTakeStamina; }

	inst.GetPacketReqFriendTakeStaminaAll = function() { return new PacketFriendData.ReqFriendTakeStaminaAll; }
	inst.GetPacketAckFriendTakeStaminaAll = function() { return new PacketFriendData.AckFriendTakeStaminaAll; }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;