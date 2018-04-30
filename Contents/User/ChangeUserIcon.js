/********************************************************************
Title : ChangeUserIcon
Date : 2016.08.24
Update : 2016.08.24
Desc : 유저 아이콘 변경
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChangeUserIcon = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChangeUserIcon -', p_user.uuid, p_recv);

		var recv_icon_id = parseInt(p_recv.icon_id);

		if ( recv_icon_id == 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUserIconID(), 'Icon ID', recv_icon_id);
			return;
		}

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			if ( user_data.ICON == recv_icon_id ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadySameUserIcon());
				return;
			}

			// GT_USER update
			p_ret_user.updateAttributes({
				ICON : recv_icon_id
			})
			.then(function (p_ret_user_update) {
				var user_update_data = p_ret_user_update.dataValues;

				p_ack_packet.icon_id = user_update_data.ICON;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChangeUserIcon');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChangeUserIcon');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;