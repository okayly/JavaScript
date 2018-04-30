/********************************************************************
Title : FriendRequest
Date : 2016.07.26
Update : 2016.08.03
Desc : 친구 - 요청
       MaxCount 50
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');
var PacketNotice = require('../../Packets/PacketNotice/PacketNotice.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SendRequestUserInfo = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_request_uuid_list) {
		var evt_cmd		= PacketNotice.inst.cmdEvtFriendRequest();
		var evt_packet	= PacketNotice.inst.GetPakcetEvtFriendRequest();

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user != null ) {
				var user_data = p_ret_user.dataValues;
				evt_packet.user_info = new PacketCommonData.UserInfo();

				evt_packet.user_info.uuid					= user_data.UUID;
				evt_packet.user_info.nick					= user_data.NICK;
				evt_packet.user_info.user_level				= user_data.USER_LEVEL;
				evt_packet.user_info.user_icon				= user_data.ICON;
				evt_packet.user_info.last_login_unix_time	= Timer.inst.GetUnixTime(user_data.LAST_LOGIN_DATE);

				for ( var cnt_uuid in p_request_uuid_list ) {
					Sender.inst.toTargetPeer(p_request_uuid_list[cnt_uuid], evt_cmd, evt_packet);
				}
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SendRequestUserInfo');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var FriendRequestProcess = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_request_uuid_list) {
		// GT_FRIEND_REQUEST select - 친구 요청 데이타 update 또는 insert
		GTMgr.inst.GetGTFriendRequest().findAll({
			where : { UUID : p_user.uuid, REQUEST_UUID : { in : p_request_uuid_list }, EXIST_YN : false }
		})
		.then(function (p_ret_request_list) {
			var str_now = Timer.inst.GetNowByStrDate();

			if ( p_ret_request_list == null || Object.keys(p_ret_request_list).length <= 0 ) {
				var insert_array = [];
				for ( var cnt in p_request_uuid_list ) {
					insert_array.push({
						UUID		: p_user.uuid,
						REQUEST_UUID: p_request_uuid_list[cnt],
						UPDATE_DATE	: str_now,
						REG_DATE	: str_now
					});
				}

				// GT_FRIEND_REQUEST insert - 친구 요청 등록
				GTMgr.inst.GetGTFriendRequest().bulkCreate(
					insert_array
				)
				.then(function (p_ret_request_create) {
					for ( var create_cnt in p_ret_request_create ) {
						var create_data = p_ret_request_create[create_cnt].dataValues;
						console.log('BULK CREATE REQUEST_UUID : %d, EXIST_YN :', create_data.REQUEST_UUID, create_data.EXIST_YN);

						p_ack_packet.request_uuid_list.push(create_data.REQUEST_UUID);
					}
					
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

					// 친구 요청한 대상 유저들에게 Evt 보내기
					SendRequestUserInfo(p_user, p_recv, p_ack_cmd, p_ack_packet, p_ack_packet.request_uuid_list);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error FriendRequestProcess - 4');
				});
			} else {
				// Packet
				for ( var cycle_cnt in p_request_uuid_list )
					p_ack_packet.request_uuid_list.push(p_request_uuid_list[cycle_cnt]);
				
				for ( var cnt = 0 in p_ret_request_list ) {
					var request_data = p_ret_request_list[cnt].dataValues;

					var find_index = p_request_uuid_list.indexOf(request_data.REQUEST_UUID);
					// console.log('UUID : %d, find_index : %d', request_data.REQUEST_UUID, find_index)
					if ( find_index != -1 ) {
						// GT_FRIEND_REQUEST update - 이전에 친구 요청한 데이터 갱신
						p_ret_request_list[cnt].updateAttributes({
							UPDATE_DATE : str_now, EXIST_YN : true
						})
						.then(function (p_ret_request_update) {
							var	update_data = p_ret_request_update.dataValues;
							console.log('UPDATE REQUEST_UUID : %d, EXIST_YN :', update_data.REQUEST_UUID, update_data.EXIST_YN);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error FriendRequestProcess - 3');
						});

						p_request_uuid_list.splice(find_index, 1);
					}
				}

				for ( var create_cnt  in p_request_uuid_list ) {
					var create_uuid = p_request_uuid_list[create_cnt];

					// GT_FRIEND_REQUEST inert - 친구 요청 데이터 등록
					GTMgr.inst.GetGTFriendRequest().create({
						UUID		: p_user.uuid,
						REQUEST_UUID: create_uuid,
						UPDATE_DATE	: str_now,
						REG_DATE	: str_now
					})
					.then(function (p_ret_request_create) {
						var create_data = p_ret_request_create.dataValues;
						console.log('CREATE REQUEST_UUID : %d, EXIST_YN :', create_data.REQUEST_UUID, create_data.EXIST_YN);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error FriendRequestProcess - 2');
					});
				}

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

				// 친구 요청한 대상 유저들에게 Evt 보내기
				if ( p_ack_packet.p_request_uuid_list != null && p_ack_packet.p_request_uuid_list.length > 0 ) {
					SendRequestUserInfo(p_user, p_recv, p_ack_cmd, p_ack_packet, p_ack_packet.request_uuid_list);
				}
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error FriendRequestProcess - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendRequest = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {		
		logger.debug('UUID : %d recv - ReqFriendRequest -', p_user.uuid, p_recv);

		var request_uuid_list = p_recv.request_uuid_list;

		// 유저 검증
		if ( request_uuid_list.length <= 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Request UUID Length', request_uuid_list.length);
			return;
		}

		for ( var cnt in request_uuid_list ) {
			var request_uuid = request_uuid_list[cnt];
			if ( request_uuid == p_user.uuid || isNaN(request_uuid) ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Request UUID', request_uuid);
				return;
			}
		}

		// 친구 요청 가능 횟수 확인
		GTMgr.inst.GetGTFriendRequest().findAndCountAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_request_list) {
			var request_count = p_ret_request_list.count;

			if ( request_count >= DefineValues.inst.Friend_ListMax ) {
				Sender.inst.toPeer(puser, p_ack_cmd, p_ack_packet, PacketRet.inst.retFriendRequestLimit(), 'Request Count', request_count);
				return;
			}

			var ret_uuid_list = [];

			// GT_USER select - UUID 검증
			GTMgr.inst.GetGTUser().findAll({
				where : { UUID : { in : request_uuid_list }, EXIST_YN : true }
			})
			.then(function (p_ret_user_list) {
				if ( Object.keys(p_ret_user_list).length <= 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Request UUID', request_uuid);
					return;
				}

				for ( var user_cnt in p_ret_user_list ) {
					ret_uuid_list.push(p_ret_user_list[user_cnt].dataValues.UUID);
				}

				console.log('ret_uuid_list - START', ret_uuid_list);

				// GT_FRIEND select - 친구인지 확인
				GTMgr.inst.GetGTFriend().findAll({
					where : { UUID : p_user.uuid, FRIEND_UUID : { in : ret_uuid_list }, EXIST_YN : true }
				})
				.then(function (p_ret_friend_list) {
					for ( var friend_cnt in p_ret_friend_list ) {
						var friend_uuid = p_ret_friend_list[friend_cnt].dataValues.FRIEND_UUID;

						// 이미 친구인 유저는 빼고
						var slice_friend_index = ret_uuid_list.indexOf(friend_uuid);
						if ( slice_friend_index != -1 ) {
							ret_uuid_list.splice(slice_friend_index, 1);
							// console.log('ret_uuid_list - 2 GT_FRIEND', ret_uuid_list);
						}
					}

					// console.log('ret_uuid_list - 3', ret_uuid_list);

					// 50명 이상이면 넘는건 자른다.
					// if ( request_count + ret_uuid_list.length > DefineValues.inst.Friend_ListMax ) {
					// 	var slice_count = (request_count + ret_uuid_list.length) - DefineValues.inst.Friend_ListMax;
					// }

					// 이미 신청 했는지 확인
					for ( var row in p_ret_request_list.rows ) {
						// console.log('p_ret_request_list.rows[%d]', row, p_ret_request_list.rows[row].dataValues);
						var request_uuid = p_ret_request_list.rows[row].dataValues.REQUEST_UUID;
						var slice_request_index = ret_uuid_list.indexOf(request_uuid);

						// console.log('request_uuid : %d, slice_request_index : %d', request_uuid, slice_request_index);
						
						if ( slice_request_index != -1 ) {
							ret_uuid_list.splice(slice_request_index, 1);
							// console.log('ret_uuid_list - 4 GT_FRIEND_REQUEST', ret_uuid_list);
						}
					}

					if ( ret_uuid_list.length <= 0 ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Result UUID List', ret_uuid_list);
						return;
					}

					console.log('ret_uuid_list - END', ret_uuid_list);

					FriendRequestProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, ret_uuid_list);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequest - 4');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequest - 3');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequest - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;