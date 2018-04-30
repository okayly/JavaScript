/********************************************************************
Title : FriendSendMemo
Date : 2016.08.08
Update : 
Desc : 친구 - 쪽지 보내기
writer: jongwook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');
var MailMgr	= require('../../Contents/Mail/MailMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendSendMemo = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendSendMemo -', p_user.uuid, p_recv);

		var friend_uuid = parseInt(p_recv.friend_uuid);
		var memo = p_recv.memo;

		if ( memo == null || memo == '' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.MessageTextIsBlank());
			return;
		}

		// GT_FRIEND select - 친구 확인
		GTMgr.inst.GetGTFriend().find({
			where : { UUID : p_user.uuid, FRIEND_UUID : friend_uuid, EXIST_YN : true }
		})
		.then(function (p_ret_friend) {
			if ( p_ret_friend == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Friend UUID', friend_uuid);
				return;
			}

			var subject = '';
			var contents = '';

			var limit_subject_length = 10;
			var limit_content_length = 80;

			if ( memo != null ) {
				if ( memo.length > limit_subject_length ) {
					subject = memo.substr(0, limit_subject_length);
				} else {
					subject = memo;
				}

				if ( contents.length > limit_content_length ) {
					contents = memo.subject(0, limit_content_length);
				} else {
					content = memo;
				}
			}

			MailMgr.inst.SendTextMail(p_user, p_recv, p_ack_cmd, p_ack_packet, friend_uuid, subject, memo);
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendMemo - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;