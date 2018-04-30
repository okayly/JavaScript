/********************************************************************
Title : ChangeNick
Date : 2016.08.24
Update : 2016.08.24
Desc : 유저 닉 변경
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChangeNick = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChangeNick -', p_user.uuid, p_recv);

		var recv_nick = p_recv.nick;

		if ( recv_nick == '' || recv_nick.length == 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectNick(), 'Empty Nick', recv_nick);
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

			if ( user_data.NICK == recv_nick ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadySameNick());
				return;
			}

			// GT_USER update
			p_ret_user.updateAttributes({
				NICK : recv_nick
			})
			.then(function (p_ret_user_update) {
				var user_update_data = p_ret_user_update.dataValues;

				p_ack_packet.nick = user_update_data.NICK;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChangeNick');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChangeNick');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;