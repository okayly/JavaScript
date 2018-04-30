/********************************************************************
Title : FindFriend
Date : 2016.08.04
Update : 
Desc : 친구 - 닉네임으로 찾기
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFindFriend = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFindFriend -', p_user.uuid, p_recv);

		var find_nick = p_recv.nick;
		if ( find_nick == null ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Find Nick', find_nick);
			return;
		}

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { NICK : find_nick, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Find Nick', find_nick);
				return;
			}
			var user_data = p_ret_user.dataValues;

			// 자신의 정보는 패스
			if ( user_data.UUID == p_user.uuid ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Find UUID', user_data.UUID);
				return;
			}

			p_ack_packet.user_info = new PacketCommonData.UserInfo();

			p_ack_packet.user_info.uuid					= user_data.UUID;
			p_ack_packet.user_info.nick					= user_data.NICK;
			p_ack_packet.user_info.user_level			= user_data.USER_LEVEL;
			p_ack_packet.user_info.user_icon			= user_data.ICON;
			p_ack_packet.user_info.last_login_unix_time	= Timer.inst.GetUnixTime(user_data.LAST_LOGIN_DATE);

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFindFriend');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;