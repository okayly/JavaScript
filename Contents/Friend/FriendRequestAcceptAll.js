/********************************************************************
Title : FriendRequestAcceptAll
Date : 2016.08.04
Update : 
Desc : 친구 전부 수락
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketNotice = require('../../Packets/PacketNotice/PacketNotice.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	// 친구 수락에 있는 유저 정보는 신뢰할 수 있다.(친구 신청 할때 먼저 따진다.)
	inst.ReqFriendRequestAcceptAll = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendRequestAcceptAll -', p_user.uuid, p_recv);

		var str_now = Timer.inst.GetNowByStrDate();

		// GT_FRIEND select - 최대 친구 수 50명 체크
		GTMgr.inst.GetGTFriend().findAndCountAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_friend_list) {
			var friend_count = p_ret_friend_list.count;

			// 50명이 넘으면 안된다.
			if ( friend_count >= DefineValues.inst.Friend_ListMax ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retUserFriendLimit(), 'Friend Count', friend_count);
				return;
			}

			// GT_FRIEND_REQUEST select - 나를 친구로 요청한 데이터 검색
			GTMgr.inst.GetGTFriendRequest().findAndCountAll({
				where : { REQUEST_UUID : p_user.uuid, EXIST_YN : true }, order : 'UPDATE_DATE desc' 
			})
			.then(function (p_ret_request_list) {
				// console.log('p_ret_request_list', p_ret_request_list);
				var request_count = p_ret_request_list.count;
				if ( request_count <= 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNoTargetUser(), 'Request Count', request_count);
					return;
				}

				// 2가지의 경우
				// 1. A와 B가 서로 친구 요청( 쌍방향 )
				// 2. A가 B를 친구 요청( 한방향 )
				var accept_uuid_list = [];
				
				for ( var row in p_ret_request_list.rows ) {
					// 쌍방향 검사를 위함
					accept_uuid_list.push(p_ret_request_list.rows[row].dataValues.UUID);

					// GT_FRIEND_REQUEST update
					p_ret_request_list.rows[row].updateAttributes({
						UPDATE_DATE : str_now,
						EXIST_YN : false
					})
					.then(function (p_ret_request_update) {
						console.log('1 - GT_FRIEND_REQUEST UUID : %d, REQUEST_UUID : %d, EXIST_YN', p_ret_request_update.dataValues.UUID, p_ret_request_update.dataValues.REQUEST_UUID, p_ret_request_update.dataValues.EXIST_YN);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAcceptAll - 5');
					});

					// 50명 이상은 친구가 될 수 없다.
					var sum_count = (friend_count + parseInt(row, 10));
					if ( sum_count >= (DefineValues.inst.Friend_ListMax - 1) )
						break;
				}

				// GT_FRIEND_REQUEST select 쌍방향 검사
				GTMgr.inst.GetGTFriendRequest().findAll({
					where : { UUID : p_user.uuid, REQUEST_UUID : { in : accept_uuid_list }, EXIST_YN : true }
				})
				.then(function (p_ret_my_request_list) {
					for (var cnt_my in p_ret_my_request_list ) {
						// GT_FRIEND_REQUEST update
						p_ret_my_request_list[cnt_my].updateAttributes({
							UPDATE_DATE : str_now,
							EXIST_YN : false
						})
						.then(function (p_ret_my_request_update) {
							console.log('2 - GT_FRIEND_REQUEST UUID : %d, REQUEST_UUID : %d, EXIST_YN', p_ret_my_request_update.dataValues.UUID, p_ret_my_request_update.dataValues.REQUEST_UUID, p_ret_my_request_update.dataValues.EXIST_YN);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAcceptAll - 4');
						});
					}
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAcceptAll - 3');
				});

				// 친구 만들기
				MakeFriendProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, accept_uuid_list, str_now);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAcceptAll - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAcceptAll - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var MakeFriendProcess = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_accept_uuid_list, p_str_now) {
		var evt_cmd		= PacketNotice.inst.cmdEvtFriendAccept();
		var evt_packet	= PacketNotice.inst.GetPakcetEvtFriendAccept();

		// Packet
		p_ack_packet.accept_uuid_list = p_accept_uuid_list;

		// GT_FRIEND select
		GTMgr.inst.GetGTFriend().findAll({
			where : { UUID : p_user.uuid, FRIEND_UUID : { in : p_accept_uuid_list } }
		})
		.then(function (p_ret_friend_list) {
			// 데이터 확인
			for (var cnt_friend in p_ret_friend_list ) {
				(function (cnt_friend) {
					var friend_data = p_ret_friend_list[cnt_friend].dataValues;

					// 친구 update - 이전 데이터가 있을때
					if ( friend_data.EXIST_YN == false ) {
						// GT_FRIEND update
						p_ret_friend_list[cnt_friend].updateAttributes({
							UPDATE_DATE : p_str_now,
							EXIST_YN : true
						})
						.then(function (p_ret_friend_update_my) {
							var update_data_my = p_ret_friend_update_my.dataValues;

							console.log('update my GT_FRIEND UUID : %d, FRIEND_UUID : %d, EXIST_YN :', update_data_my.UUID, update_data_my.FRIEND_UUID, update_data_my.EXIST_YN);

							// GT_FRIEND select - 쌍방향으로 설정
							GTMgr.inst.GetGTFriend().find({
								where : { UUID : friend_data.FRIEND_UUID, FRIEND_UUID : p_user.uuid, EXIST_YN : false }
							})
							.then(function (p_ret_friend_other) {
								if ( p_ret_friend_other != null ) {
									// GT_FRIEND update
									p_ret_friend_other.updateAttributes({
										UPDATE_DATE : p_str_now,
										EXIST_YN : true
									})
									.then(function (p_ret_friend_update_other) {
										var update_data_other = p_ret_friend_update_other.dataValues;
										console.log('update other GT_FRIEND UUID : %d, FRIEND_UUID : %d, EXIST_YN :', update_data_other.UUID, update_data_other.FRIEND_UUID, update_data_other.EXIST_YN);

										// 친구 요청한 유저 Evt
										evt_packet.accept_uuid = update_data_other.FRIEND_UUID;
										Sender.inst.toTargetPeer(update_data_other.UUID, evt_cmd, evt_packet);
									})
									.catch(function (p_error) {
										Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error MakeFriendProcess - 1');
									});
								}
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error MakeFriendProcess - 1');
							});
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error MakeFriendProcess - 1');
						});
					}

					// 리스트에서 뺀다.
					var find_index = p_accept_uuid_list.indexOf(friend_data.FRIEND_UUID);
					if ( find_index != -1 ) {
						p_accept_uuid_list.splice(find_index, 1);
					}
				})(cnt_friend);
			}

			// 친구 생성
			for ( var cnt_insert in p_accept_uuid_list ) {
				(function (cnt_insert) {
					var accept_uuid = p_accept_uuid_list[cnt_insert];

					// GT_FRIEND insert
					GTMgr.inst.GetGTFriend().bulkCreate([
						{ UUID : p_user.uuid, FRIEND_UUID : accept_uuid, UPDATE_DATE : p_str_now, REG_DATE : p_str_now },
						{ UUID : accept_uuid, FRIEND_UUID : p_user.uuid, UPDATE_DATE : p_str_now, REG_DATE : p_str_now }
					])
					.then(function (p_ret_friend_create_list) {
						for ( var cnt_create in p_ret_friend_create_list ) {
							var create_data = p_ret_friend_create_list[cnt_create];
							console.log('create GT_FRIEND create UUID : %d, FRIEND_UUID : %d', cnt_create, create_data.UUID, create_data.FRIEND_UUID);

							if ( create_data.UUID == accept_uuid ) {
								// 친구 요청한 유저 Evt
								evt_packet.accept_uuid = create_data.FRIEND_UUID;
								Sender.inst.toTargetPeer(create_data.UUID, evt_cmd, evt_packet);
							}
						}
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error MakeFriendProcess - 2');
					});
				})(cnt_insert);
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error MakeFriendProcess - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;