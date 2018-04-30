/********************************************************************
Title : FriendDelete
Date : 2016.08.03
Update : 
Desc : 친구 - 삭제
       하루 5명 삭제 가능
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var PacketNotice = require('../../Packets/PacketNotice/PacketNotice.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var DeleteFriendOther = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_friend_uuid, p_str_now){
		// GT_FRIEND select
		GTMgr.inst.GetGTFriend().find({
			where : { UUID : p_friend_uuid, FRIEND_UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_friend) {
			if ( p_ret_friend != null ) {
				// GT_FRIEND update
				p_ret_friend.updateAttributes({
					UPDATE_DATE : p_str_now,
					EXIST_YN : false
				})
				.then(function (p_ret_friend_update) {
					var update_data = p_ret_friend_update.dataValues;

					var evt_cmd		= PacketNotice.inst.cmdEvtFriendDelete();
					var evt_packet	= PacketNotice.inst.GetPakcetEvtFriendDelete();

					evt_packet.friend_uuid = update_data.FRIEND_UUID;

					Sender.inst.toTargetPeer(update_data.UUID, evt_cmd, evt_packet);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error DeleteFriendOther - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error DeleteFriendOther - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendDelete = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendDelete -', p_user.uuid, p_recv);
		
		var delete_uuid_list = p_recv.delete_uuid_list;

		// 유저 검증
		if ( delete_uuid_list.length <= 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Delete UUID List', delete_uuid_list);
			return;
		}

		for ( var cnt in delete_uuid_list ) {
			var delete_uuid = delete_uuid_list[cnt];
			if ( delete_uuid == p_user.uuid || isNaN(delete_uuid) ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Delete UUID', delete_uuid);
				return;
			}
		}

		// GT_DAILY_CONTENTS - 하루에 친구 삭제는 5번
		GTMgr.inst.GetGTDailyContents().find({
			where : { UUID : p_user.uuid, EXIST_YN : true}
		})
		.then(function (p_ret_daily_contents) {
			if ( p_ret_daily_contents == null ){
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error Not Find DailyContents in GT_DAILY_CONTENTS UUID', p_user.uuid);
				return;
			}
			var daily_data = p_ret_daily_contents.dataValues;

			if ( daily_data.FRIEND_DELETE_COUNT <= 0 || (daily_data.FRIEND_DELETE_COUNT < delete_uuid_list.length) ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFriendDeleteLimit(), 'Delete Count', daily_data.FRIEND_DELETE_COUNT);
				return;
			}

			var ret_delete_count = daily_data.FRIEND_DELETE_COUNT - delete_uuid_list.length;

			// GT_DAILY_CONTENTS update
			p_ret_daily_contents.updateAttributes({
				FRIEND_DELETE_COUNT : ret_delete_count
			})
			.then(function (p_ret_daily_update) {
				var str_now = Timer.inst.GetNowByStrDate();
				p_ack_packet.delete_count = p_ret_daily_contents.dataValues.FRIEND_DELETE_COUNT;

				// GT_FRIEND select - 자신
				GTMgr.inst.GetGTFriend().findAndCountAll({
					where : { UUID : p_user.uuid, FRIEND_UUID : { in : delete_uuid_list }, EXIST_YN : true }
				})
				.then(function (p_ret_friend_list) {
					// console.log('p_ret_friend_list', p_ret_friend_list);
					if ( p_ret_friend_list.count <= 0 ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Not Find User in GT_FRIEND Friend UUID', delete_uuid_list);
						return;
					}

					for ( var row in p_ret_friend_list.rows ) {
						(function (cnt) {
							var friend_data = p_ret_friend_list.rows[row].dataValues;

							// packet
							p_ack_packet.delete_uuid_list.push(friend_data.FRIEND_UUID);

							// console.log('friend_data', friend_data);
							if ( friend_data.EXIST_YN == true ) {
								// GT_FRIEND update
								p_ret_friend_list.rows[row].updateAttributes({ 
									UPDATE_DATE : str_now,
									EXIST_YN : false
								})
								.then(function (p_ret_friend_list_update) {
									var update_data = p_ret_friend_list_update.dataValues;
									console.log('update GT_FRIEND  UUID : %d, FRIEND_UUID : %d, EXIST_YN :', update_data.UUID, update_data.FRIEND_UUID, update_data.EXIST_YN);

									// 친구에서 나를 삭제
									DeleteFriendOther(p_user, p_recv, p_ack_cmd, p_ack_packet, update_data.FRIEND_UUID, str_now);
								})
								.catch(function (p_error) {
									Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestAccept - 2');
								});
							}
						})(cnt);
					}
					
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendDelete - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendDelete - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendDelete - 1');
		});		
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;