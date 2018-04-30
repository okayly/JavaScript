/********************************************************************
Title : FriendRequestAccept
Date : 2016.07.26
Update : 
Desc : 친구 수락
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
	// 다음에 보면 이해하기 힘들거 같아 간단하게 정리
	// 1. GT_FRIEND_REQUEST의 EXIST_YN = false 설정
	// 2. GT_FRIEND 에서 친구 요청자, 수락자 데이터가 있는지 검색(친구는 쌍이라서 2개)
	// 3. 데이터가 없으면 친구 요청자, 수락자를 쌍방으로 GT_FRIEND에 등록 후 수락자는 Ack, 요청자는 Evt 보냄
	// 4. 데이터가 있다면 EXIST_YN 값 확인
	// 4-1. true면 이미 친구 사이 Ack 보내고
	// 4-2. false이면 true로 변경하고 수락자는 Ack, 요청자는 Evt 보냄
	inst.ReqFriendRequestAccept = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendRequestAccept -', p_user.uuid, p_recv);

		var sequelize = mkDB.inst.GetSequelize();
		var accept_uuid = parseInt(p_recv.accept_uuid);

		if ( p_user.uuid == accept_uuid || accept_uuid == null || isNaN(accept_uuid) ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Accept UUID', accept_uuid);
			return;
		}

		// GT_FRIEND select - 자신 친구 수 확인
		GTMgr.inst.GetGTFriend().count({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_friend_count_my) {
			if ( parseInt(p_ret_friend_count_my) >= DefineValues.inst.Friend_ListMax ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retUserFriendLimit());
				return;
			}

			// GT_FRIEND select - 상대 친구 수 확인
			GTMgr.inst.GetGTFriend().count({
				where : { UUID : accept_uuid, EXIST_YN : true }
			})
			.then(function (p_ret_friend_count_other) {
				if ( parseInt(p_ret_friend_count_other) >= DefineValues.inst.Friend_ListMax ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retTargetFriendLimit(), 'Accept UUID', accept_uuid);
					return;
				}

				// GT_FRIEND_REQUEST select - 자신을 친구 요청한 데이터
				GTMgr.inst.GetGTFriendRequest().find({
					where : { UUID : accept_uuid, REQUEST_UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(function (p_ret_request_other) {
					// console.log('p_ret_request_other', p_ret_request_other);
					if ( p_ret_request_other == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Not Find User in GT_FRIEND_REQUEST Accept UUID', accept_uuid);
						return;
					}
					var request_data = p_ret_request_other.dataValues

					// GT_FRIEND_REQUEST update - 친구 요청자 처리
					p_ret_request_other.updateAttributes({
						UPDATE_DATE : Timer.inst.GetNowByStrDate(),
						EXIST_YN : false
					})
					.then(function (p_ret_request_other_update) {
						console.log('Freind Request Accept Other GT_FRIEND_REQUEST EXIST_YN :', p_ret_request_other_update.dataValues.EXIST_YN);

						// GT_FRIEND_REQUEST select - 상대방이 나를 친구 요청했을때
						GTMgr.inst.GetGTFriendRequest().find({
							where : { UUID : p_user.uuid, REQUEST_UUID : accept_uuid }
						})
						.then(function (p_ret_request_mine) {
							if ( p_ret_request_mine != null && p_ret_request_mine.dataValues.EXIST_YN == true) {
								// GT_FRIEND_REQUEST update
								p_ret_request_mine.updateAttributes({
									UPDATE_DATE : Timer.inst.GetNowByStrDate(),
									EXIST_YN : false
								})
								.then(function (p_ret_request_mine_update) {
									console.log('Freind Request Accept Mine GT_FRIEND_REQUEST EXIST_YN :', p_ret_request_mine_update.dataValues.EXIST_YN);
								})
								.catch(function (p_error) {
									Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 7');
								});
							}
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 6');
						});
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 5');
					});

					// GT_FRIEND select - 친구 추가
					GTMgr.inst.GetGTFriend().findAll({
						where : sequelize.or( 
							    sequelize.and({ UUID : p_user.uuid, FRIEND_UUID : accept_uuid }),
							    sequelize.and({ UUID : accept_uuid, FRIEND_UUID : p_user.uuid })
						)
					})
					.then(function (p_ret_friend_list) {
						// console.log('p_ret_friend_list', p_ret_friend_list);
						// 친구를 추가한 당사자는 ack로 보내고 상대방은 evt로 보내고
						var evt_cmd		= PacketNotice.inst.cmdEvtFriendAccept();
						var evt_packet	= PacketNotice.inst.GetPakcetEvtFriendAccept();
						
						// 친구 정보가 없을때
						if ( p_ret_friend_list == null || Object.keys(p_ret_friend_list).length == 0 ) {
							// GT_FRIEND BulkCreate
							GTMgr.inst.GetGTFriend().bulkCreate([
								{ UUID : p_user.uuid, FRIEND_UUID : accept_uuid, UPDATE_DATE : Timer.inst.GetNowByStrDate(), REG_DATE : Timer.inst.GetNowByStrDate() },
								{ UUID : accept_uuid, FRIEND_UUID : p_user.uuid, UPDATE_DATE : Timer.inst.GetNowByStrDate(), REG_DATE : Timer.inst.GetNowByStrDate() }
							])
							.then(function (p_ret_friend_create_list) {
								for ( var cnt_create in p_ret_friend_create_list ) {
									var create_data = p_ret_friend_create_list[cnt_create];
									console.log('Friend Request Accept create %d GT_FRIEND create UUID : %d, FRIEND_UUID : %d', cnt_create, create_data.UUID, create_data.FRIEND_UUID);

									if ( create_data.UUID == accept_uuid ) {
										// 요청자 Evt
										evt_packet.accept_uuid = create_data.FRIEND_UUID;
										Sender.inst.toTargetPeer(create_data.UUID, evt_cmd, evt_packet);
									} else if ( create_data.UUID == p_user.uuid ) {
										// 수락자 Ack
										p_ack_packet.accept_uuid = create_data.FRIEND_UUID;
										Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
									}
								}
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 4');
							});
						} else {
							for ( var cnt in p_ret_friend_list ) {
								(function (cnt) {
									var friend_data = p_ret_friend_list[cnt].dataValues;
									// console.log('friend_data', friend_data);
									if ( friend_data.EXIST_YN == false ) {
										// GT_FRIEND update
										p_ret_friend_list[cnt].updateAttributes({ 
											EXIST_YN : true
										})
										.then(function (p_ret_friend_list_update) {
											var update_data = p_ret_friend_list_update.dataValues;
											console.log('update %d GT_FRIEND update UUID : %d, FRIEND_UUID : %d, EXIST_YN :', cnt, update_data.UUID, update_data.FRIEND_UUID, update_data.EXIST_YN);

											if ( update_data.UUID == accept_uuid ) {
												evt_packet.accept_uuid = update_data.FRIEND_UUID;

												Sender.inst.toTargetPeer(update_data.UUID, evt_cmd, evt_packet);
											} else if ( update_data.UUID == p_user.uuid ) {
												p_ack_packet.accept_uuid = update_data.FRIEND_UUID;

												Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
											}
										})
										.catch(function (p_error) {
											Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 3');
										});
									} else {
										if ( friend_data.UUID == p_user.uuid ) {
											Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyFriend(), 'Accept UUID', accept_uuid);
										}
									}
								})(cnt);
							}
						}
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;