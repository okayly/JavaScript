/********************************************************************
Title : PacketDist_Friend
Date : 2016.07.26
Desc : 패킷 연결 - 친구
writer : jongwook
********************************************************************/
var UserMgr			= require('../../Data/Game/UserMgr.js');
var Reconnect		= require('../../Contents/User/Reconnect.js');
var PacketFriend	= require('../../Packets/PacketFriend/PacketFriend.js');

var FriendInfo			= require('../../Contents/Friend/FriendInfo.js');
var FriendList			= require('../../Contents/Friend/FriendList.js');
var FriendRequest		= require('../../Contents/Friend/FriendRequest.js');
var FriendRequestAccept	= require('../../Contents/Friend/FriendRequestAccept.js');
var FriendRequestCancel	= require('../../Contents/Friend/FriendRequestCancel.js');
var FriendRequestRefuse	= require('../../Contents/Friend/FriendRequestRefuse.js');
var FriendSendStamina	= require('../../Contents/Friend/FriendSendStamina.js');
var FriendTakeStamina	= require('../../Contents/Friend/FriendTakeStamina.js');
var FriendDelete		= require('../../Contents/Friend/FriendDelete.js');
var FriendSendMemo		= require('../../Contents/Friend/FriendSendMemo.js');
var FindFriend			= require('../../Contents/Friend/FindFriend.js');

var FriendRequestAcceptAll	= require('../../Contents/Friend/FriendRequestAcceptAll.js');
var FriendRequestCancelAll	= require('../../Contents/Friend/FriendRequestCancelAll.js');
var FriendRequestRefuseAll	= require('../../Contents/Friend/FriendRequestRefuseAll.js');
var FriendSendStaminaAll	= require('../../Contents/Friend/FriendSendStaminaAll.js');
var FriendTakeStaminaAll	= require('../../Contents/Friend/FriendTakeStaminaAll.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if ( recv == null ) {
			logger.error('Error Packet Convert - cmd is ', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if ( user == undefined ) {
			logger.error('Error Packet Not Find: %s, User Socket ID:', p_cmd, p_socket.id);
			return;
		}

		if ( user != undefined ) {
			if ( recv.packet_srl == user.GetPacketBuf().packet_srl ) {
				logger.info('UUID : %d, PacketSrl : %d Already Recv Packet Request', user.uuid, recv.packet_srl);
				p_socket.emit(user.GetPacketBuf().packet_cmd, JSON.stringify(user.GetPacketBuf().packet_data));
				return;
			}	
		}
			
		// 분배. 
		var ack_cmd;
		var ack_packet;
		try {
			switch(p_cmd) {
				case PacketFriend.inst.cmdReqFriendInfo() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendInfo();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendInfo();
					ack_packet.packet_srl = recv.packet_srl;
					FriendInfo.inst.ReqFriendInfo(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFindFriend() :
					ack_cmd 	= PacketFriend.inst.cmdAckFindFriend();
					ack_packet	= PacketFriend.inst.GetPacketAckFindFriend();
					ack_packet.packet_srl = recv.packet_srl;
					FindFriend.inst.ReqFindFriend(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRecommandList() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRecommandList();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRecommandList();
					ack_packet.packet_srl = recv.packet_srl;
					FriendList.inst.ReqFriendRecommandList(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequestSendList() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequestSendList();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequestSendList();
					ack_packet.packet_srl = recv.packet_srl;
					FriendList.inst.ReqFriendRequestSendList(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequestRecvList() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequestRecvList();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequestRecvList();
					ack_packet.packet_srl = recv.packet_srl;
					FriendList.inst.ReqFriendRequestRecvList(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequest() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequest();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequest();
					ack_packet.packet_srl = recv.packet_srl;
					FriendRequest.inst.ReqFriendRequest(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequestAccept() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequestAccept();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequestAccept();
					ack_packet.packet_srl = recv.packet_srl;
					FriendRequestAccept.inst.ReqFriendRequestAccept(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequestAcceptAll() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequestAcceptAll();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequestAcceptAll();
					ack_packet.packet_srl = recv.packet_srl;
					FriendRequestAcceptAll.inst.ReqFriendRequestAcceptAll(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequestCancel() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequestCancel();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequestCancel();
					ack_packet.packet_srl = recv.packet_srl;
					FriendRequestCancel.inst.ReqFriendRequestCancel(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequestCancelAll() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequestCancelAll();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequestCancelAll();
					ack_packet.packet_srl = recv.packet_srl;
					FriendRequestCancelAll.inst.ReqFriendRequestCancelAll(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequestRefuse() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequestRefuse();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequestRefuse();
					ack_packet.packet_srl = recv.packet_srl;
					FriendRequestRefuse.inst.ReqFriendRequestRefuse(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendRequestRefuseAll() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendRequestRefuseAll();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendRequestRefuseAll();
					ack_packet.packet_srl = recv.packet_srl;
					FriendRequestRefuseAll.inst.ReqFriendRequestRefuseAll(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendSendStamina() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendSendStamina();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendSendStamina();
					ack_packet.packet_srl = recv.packet_srl;
					FriendSendStamina.inst.ReqFriendSendStamina(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendSendStaminaAll() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendSendStaminaAll();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendSendStaminaAll();
					ack_packet.packet_srl = recv.packet_srl;
					FriendSendStaminaAll.inst.ReqFriendSendStaminaAll(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendTakeStamina() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendTakeStamina();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendTakeStamina();
					ack_packet.packet_srl = recv.packet_srl;
					FriendTakeStamina.inst.ReqFriendTakeStamina(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendTakeStaminaAll() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendTakeStaminaAll();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendTakeStaminaAll();
					ack_packet.packet_srl = recv.packet_srl;
					FriendTakeStaminaAll.inst.ReqFriendTakeStaminaAll(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendDelete() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendDelete();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendDelete();
					ack_packet.packet_srl = recv.packet_srl;
					FriendDelete.inst.ReqFriendDelete(user, recv, ack_cmd, ack_packet);
					break;

				case PacketFriend.inst.cmdReqFriendSendMemo() :
					ack_cmd 	= PacketFriend.inst.cmdAckFriendSendMemo();
					ack_packet	= PacketFriend.inst.GetPacketAckFriendSendMemo();
					ack_packet.packet_srl = recv.packet_srl;
					FriendSendMemo.inst.ReqFriendSendMemo(user, recv, ack_cmd, ack_packet);
					break;
					
				default :
					logger.error('UUID : %d Error Packet Dist! Cmd : %d', user.uuid, p_cmd);
					break;
			}
		} catch (p_error) {
			err_report.inst.SendReportExecption(user.uuid, user.account, ack_cmd, p_error.stack);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;