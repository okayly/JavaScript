/********************************************************************
Title : Mail
Date : 2016.09.09
Update : 2016.11.22
Desc : 우편 기능 - 우편 보내기, 우편 예약
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	// Mail Send 요청
	inst.ReqMailSend = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqMailSend -', p_user.uuid, p_recv);

		// call ad-hoc query
		mkDB.inst.GetSequelize().query('call sp_insert_mail(?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?);',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_user.uuid,
				parseInt(p_recv.sender) ,
				p_recv.mail_type,
				p_recv.reward_items[0].reward_type,
				p_recv.reward_items[0].reward_item_id,
				p_recv.reward_items[0].reward_count,
				p_recv.subject,
				p_recv.contents,
				p_recv.reward_items[0].reward_type, p_recv.reward_items[0].reward_item_id, p_recv.reward_items[0].reward_count,
				p_recv.reward_items[1].reward_type, p_recv.reward_items[1].reward_item_id, p_recv.reward_items[1].reward_count,
				p_recv.reward_items[2].reward_type, p_recv.reward_items[2].reward_item_id, p_recv.reward_items[2].reward_count,
				p_recv.reward_items[3].reward_type, p_recv.reward_items[3].reward_item_id, p_recv.reward_items[3].reward_count,
				p_recv.reward_items[4].reward_type, p_recv.reward_items[4].reward_item_id, p_recv.reward_items[4].reward_count
			]
		)
		.then(function (p_ret_mail) {
			var data = p_ret_mail[0][0];
			p_ack_packet.uuid				= data.UUID;
			p_ack_packet.sender				= data.MAIL_SENDER;
			p_ack_packet.mail_type			= data.MAIL_TYPE;
			p_ack_packet.mail_icon_type		= data.MAIL_ICON_TYPE;
			p_ack_packet.mail_icon_item_id	= data.MAIL_ICON_ITEM_ID;
			p_ack_packet.mail_icon_count	= data.MAIL_ICON_COUNT;
			p_ack_packet.subject			= data.MAIL_SUBJECT;
			p_ack_packet.contents			= data.MAIL_CONTENTS;
			for ( var cnt = 0; cnt < DefineValues.inst.MaxMailReward; ++cnt ) {
				var col_id = cnt + 1;

				var reward = new PacketCommonData.MailReward();
				reward.reward_type		= data['REWARD' + col_id + '_TYPE'];
				reward.reward_item_id	= data['REWARD' + col_id + '_ITEM_ID'];
				reward.reward_count		= data['REWARD' + col_id + '_COUNT'];

				p_ack_packet.reward_items.push(reward);
			}
			
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess(), 'Error ReqMailSend');
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;