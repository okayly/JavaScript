/********************************************************************
Title : FriendInfo
Date : 2016.08.04
Update : 
Desc : 친구 - 정보
writer: jongwook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendInfo = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendInfo -', p_user.uuid, p_recv);

		// GT_DAILY_CONTENTS select
		GTMgr.inst.GetGTDailyContents().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_daily_contents) {
			if ( p_ret_daily_contents == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error Not Exist DailyContents In GT_DAILY_CONTENTS');
				return;
			}

			// Packet
			p_ack_packet.delete_count = p_ret_daily_contents.dataValues.FRIEND_DELETE_COUNT;

			// GT_FRIEND select
			mkDB.inst.GetSequelize().query('select A.UUID, A.FRIEND_UUID, A.SEND_STAMINA_DATE, A.RECV_STAMINA_DATE, A.IS_TAKE_STAMINA, B.ACCOUNT, B.NICK, B.ICON, B.USER_LEVEL, B.LAST_LOGIN_DATE \
											from GT_FRIENDs A \
											left join GT_USERs B on A.FRIEND_UUID = B.UUID \
											where A.UUID = ? and A.EXIST_YN = true order by B.LAST_LOGIN_DATE desc;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_user.uuid ]
			)
			.then(function (p_ret_friend) {
				// console.log('p_ret_friend', p_ret_friend);
				for ( var cnt in p_ret_friend ) {
					var friend_data = p_ret_friend[cnt];

					var packet_friend		= new PacketCommonData.Friend();
					packet_friend.user_info	= new PacketCommonData.UserInfo();

					packet_friend.user_info.uuid				= friend_data.FRIEND_UUID;
					packet_friend.user_info.nick				= friend_data.NICK;
					packet_friend.user_info.user_level			= friend_data.USER_LEVEL;
					packet_friend.user_info.user_icon			= friend_data.ICON;
					packet_friend.user_info.last_login_unix_time= Timer.inst.GetUnixTime(friend_data.LAST_LOGIN_DATE);

					packet_friend.is_take_stamina		= ( friend_data.IS_TAKE_STAMINA == 1 ) ? true : false;
					packet_friend.send_stamina_unix_time= Timer.inst.GetUnixTime(friend_data.SEND_STAMINA_DATE);
					packet_friend.recv_stamina_unix_time= Timer.inst.GetUnixTime(friend_data.RECV_STAMINA_DATE);

					p_ack_packet.friend_list.push(packet_friend);
				}

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendInfo - 1');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendInfo - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;