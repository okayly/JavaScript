/********************************************************************
Title : FriendList
Date : 2016.07.26
Update : 2016.07.28
Desc : 친구 - 목록, 추천
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
	var SendPacketUserList = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_recommnad_list) {
		// console.log('p_recommnad_list', p_recommnad_list);
		for ( var cnt in p_recommnad_list ) {
			var recommand_data	= ( typeof p_recommnad_list[cnt].dataValues === 'undefined') ? p_recommnad_list[cnt] : p_recommnad_list[cnt].dataValues;
			var user_info		= new PacketCommonData.UserInfo();

			user_info.uuid					= recommand_data.UUID;
			user_info.nick					= recommand_data.NICK;
			user_info.user_level			= recommand_data.USER_LEVEL;
			user_info.user_icon				= recommand_data.ICON;
			user_info.last_login_unix_time	= Timer.inst.GetUnixTime(recommand_data.LAST_LOGIN_DATE);

			p_ack_packet.user_info_list.push(user_info);
		}

		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendRecommandList = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendRecommandList -', p_user.uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// GT_USER select
			// 친구 목록 가져오는거 sp 써야 되겠다.
			// 추천 친구 조건 - 레벨 +5, -5
			// 신청을 보냈거나, 현재 친구
			var min_level = user_data.USER_LEVEL - 5;
			if ( min_level < 1 )
				min_level = 1;

			var max_level = user_data.USER_LEVEL + 5;
			var limit_count = 5;

			// call ad-hoc query
			mkDB.inst.GetSequelize().query('select * from GT_USERs \
											where USER_LEVEL >= ? and USER_LEVEL <= ? \
											and UUID != ? \
											and UUID not in (select UUID from GT_FRIENDs where FRIEND_UUID = ? and EXIST_YN = true) \
											and UUID not in (select REQUEST_UUID from GT_FRIEND_REQUESTs where UUID = ? and EXIST_YN = true) \
											order by rand() limit ?;',
				null,
				{ raw : true, type : 'SELECT' },
				[ min_level, max_level, p_user.uuid, p_user.uuid, p_user.uuid, limit_count ]
			)
			.then(function (p_find_friend) {
				// console.log('p_find_friend', p_find_friend);
				if ( p_find_friend == null || Object.keys(p_find_friend).length < limit_count ) {
					// call ad-hoc query
					mkDB.inst.GetSequelize().query('select * from GT_USERs \
													where UUID not in (select UUID from GT_FRIENDs where FRIEND_UUID = ? and EXIST_YN = true) \
													and UUID != ? \
													and UUID not in (select REQUEST_UUID from GT_FRIEND_REQUESTs where UUID = ? and EXIST_YN = true) \
													order by rand() limit ?;',
						null,
						{ raw : true, type : 'SELECT' },
						[ p_user.uuid, p_user.uuid, p_user.uuid, limit_count ]
					)
					.then(function (p_ret_friend_re) {
						SendPacketUserList(p_user, p_recv, p_ack_cmd, p_ack_packet, p_ret_friend_re);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRecommandList - 2');
					});
				} else {
					SendPacketUserList(p_user, p_recv, p_ack_cmd, p_ack_packet, p_find_friend);
				}
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRecommandList - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRecommandList - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendRequestSendList = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendRequestSendList -', p_user.uuid, p_recv);

		// call ad-hoc query
		mkDB.inst.GetSequelize().query('select A.REQUEST_UUID as UUID, B.ACCOUNT, B.NICK, B.ICON, B.USER_LEVEL, B.LAST_LOGIN_DATE \
										from GT_FRIEND_REQUESTs A \
										left join GT_USERs B on A.REQUEST_UUID = B.UUID \
										where A.UUID = ? and A.EXIST_YN = true order by B.LAST_LOGIN_DATE desc;',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_user.uuid ]
		)
		.then(function (p_ret_request) {
			SendPacketUserList(p_user, p_recv, p_ack_cmd, p_ack_packet, p_ret_request);
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestSendList - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendRequestRecvList = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendRequestRecvList -', p_user.uuid, p_recv);

		// call ad-hoc query
		mkDB.inst.GetSequelize().query('select A.UUID, B.ACCOUNT, B.NICK, B.ICON, B.USER_LEVEL, B.LAST_LOGIN_DATE \
										from GT_FRIEND_REQUESTs A \
										left join GT_USERs B on A.UUID = B.UUID \
										where A.REQUEST_UUID = ? and A.EXIST_YN = true order by B.LAST_LOGIN_DATE desc;',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_user.uuid ]
		)
		.then(function (p_ret_recv) {
			SendPacketUserList(p_user, p_recv, p_ack_cmd, p_ack_packet, p_ret_recv);
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestRecvList - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;