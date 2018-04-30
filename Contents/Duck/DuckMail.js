/********************************************************************
Title : DuckMail
Date : 2016.06.08
Update : 2016.08.22
Desc : 테스트 패킷을 관리 - 우편
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');
var MailMgr = require('../Mail/MailMgr.js');

var Timer = require('../../Utils/Timer.js');
var moment = require('moment');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 우편 보내기 - mail_string_id 가 0
	inst.ReqDuckSendMail = function(p_socket, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.info('ReqDuckSendMail recv -', p_recv);
		console.log('reward_items', p_recv.reward_items);

		var mail_string_id = 0;
		var mail_string_value_list = null;

		MailMgr.inst.SendMail(parseInt(p_recv.uuid),
			parseInt(p_recv.sender),
			p_recv.mail_type,
			mail_string_id,
			mail_string_value_list,
			p_recv.subject,
			p_recv.contents,
			p_recv.reward_items
		);
	}

	//------------------------------------------------------------------------------------------------------------------
	// Mail 예약 요청
	inst.ReqDuckMailReservation = function(p_socket, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('ReqDuckMailReservation recv -', p_recv);

		console.log('recv', p_recv);

		// var reservation_date = moment(p_recv.reservation_date).hours('00').minutes('00').seconds('00');
		var reservation_date = moment(p_recv.reservation_date);
		var recipient_type = parseInt(p_recv.recipient_type);
		var sender = parseInt(p_recv.sender);

		console.log('recipient_type', recipient_type);
		console.log('sender', sender);

		// 1. GT_MAIL_RESERVATION insert
		GTMgr.inst.GetGTMailReservation().create({
			RECV_TYPE		: parseInt(p_recv.recipient_type),
			RESERVATION_DATE: reservation_date,
			MAIL_SENDER		: parseInt(p_recv.sender),
			MAIL_TYPE		: p_recv.mail_type,
			MAIL_SUBJECT	: p_recv.subject,
			MAIL_CONTENTS	: p_recv.contents,
			REWARD1_TYPE	: (typeof p_recv.reward_item_array[0] === 'undefined') ? 0 : p_recv.reward_item_array[0].reward_type,
			REWARD1_ITEM_ID	: (typeof p_recv.reward_item_array[0] === 'undefined') ? 0 : p_recv.reward_item_array[0].reward_item_id,
			REWARD1_COUNT	: (typeof p_recv.reward_item_array[0] === 'undefined') ? 0 : p_recv.reward_item_array[0].reward_count,
			REWARD2_TYPE	: (typeof p_recv.reward_item_array[1] === 'undefined') ? 0 : p_recv.reward_item_array[1].reward_type,
			REWARD2_ITEM_ID	: (typeof p_recv.reward_item_array[1] === 'undefined') ? 0 : p_recv.reward_item_array[1].reward_item_id,
			REWARD2_COUNT	: (typeof p_recv.reward_item_array[1] === 'undefined') ? 0 : p_recv.reward_item_array[1].reward_count,
			REWARD3_TYPE	: (typeof p_recv.reward_item_array[2] === 'undefined') ? 0 : p_recv.reward_item_array[2].reward_type,
			REWARD3_ITEM_ID	: (typeof p_recv.reward_item_array[2] === 'undefined') ? 0 : p_recv.reward_item_array[2].reward_item_id,
			REWARD3_COUNT	: (typeof p_recv.reward_item_array[2] === 'undefined') ? 0 : p_recv.reward_item_array[2].reward_count,
			REWARD4_TYPE	: (typeof p_recv.reward_item_array[3] === 'undefined') ? 0 : p_recv.reward_item_array[3].reward_type,
			REWARD4_ITEM_ID	: (typeof p_recv.reward_item_array[3] === 'undefined') ? 0 : p_recv.reward_item_array[3].reward_item_id,
			REWARD4_COUNT	: (typeof p_recv.reward_item_array[3] === 'undefined') ? 0 : p_recv.reward_item_array[3].reward_count,
			REWARD5_TYPE	: (typeof p_recv.reward_item_array[4] === 'undefined') ? 0 : p_recv.reward_item_array[4].reward_type,
			REWARD5_ITEM_ID	: (typeof p_recv.reward_item_array[4] === 'undefined') ? 0 : p_recv.reward_item_array[4].reward_item_id,
			REWARD5_COUNT	: (typeof p_recv.reward_item_array[4] === 'undefined') ? 0 : p_recv.reward_item_array[4].reward_count,
			REG_DATE		: Timer.inst.GetNowByStrDate()
		})
		.then(function (p_ret_mail) {
			// console.log('p_ret_mail', p_ret_mail);
			var reservation_data = p_ret_mail.dataValues;			
			var reservation_id = reservation_data.RESERVATION_ID;

			// recipient_type에 따라서 유저 정보가 달라진다.
			// 0 : 모든 유저, 1 : 특정유저
			if ( recipient_type == 0 ) {
				// GT_USER select
				GTMgr.inst.GetGTUser().findAll({
					where : { EXIST_YN : true }
				})
				.then(function (p_ret_user_list) {
					InsertReservationUser(reservation_id, p_ret_user_list);
				})
				.catch(function (p_error) {
					Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqDuckMailReservation - 3');
				});
			} else {
				// where: { UUID: 1, HERO_ID: { in: [ p_ret_team.SLOT1, p_ret_team.SLOT2, p_ret_team.SLOT3, p_ret_team.SLOT4, p_ret_team.SLOT5, p_ret_team.SLOT6 ]}}
				// GT_USER select
				GTMgr.inst.GetGTUser().findAll({
					where : { EXIST_YN : true, UUID : { in : p_recv.recipient_array }}
				})
				.then(function (p_ret_user_list) {
					InsertReservationUser(reservation_id, p_ret_user_list);
				})
				.catch(function (p_error) {
					Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqDuckMailReservation - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqDuckMailReservation - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertReservationUser = function(p_reservation_id, p_ret_user_list) {
		for ( var cnt_user in p_ret_user_list ) {
			var user_data = p_ret_user_list[cnt_user].dataValues;
			var uuid = user_data.UUID;
		
			// 2. GT_MAIL_RESERVATION_USER insert
			GTMgr.inst.GetGTMailReservationUser().create({
				RESERVATION_ID	: p_reservation_id,
				UUID			: uuid,
				REG_DATE		: Timer.inst.GetNowByStrDate()
			})
			.then(function (p_ret_mail_user) {
				console.log('uuid', p_ret_mail_user.dataValues.UUID);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqDuckMailReservation - 2');
			});
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqSendReservationMail = function(p_socket, p_recv, p_ack_cmd, p_ack_packet) {
		// 예약 우편 발송
		// reservation : 2016-09-23 15:30
		// now : 2016-09-23 15:43
		// 현재 시간 >= 예약 시간 

		// console.log('ReqSendReservationMail', p_socket.id);

		// GT_RESERVATION_MAIL select
		GTMgr.inst.GetGTMailReservation().findAll({
			where : {
				MAIL_SEND_YN		: false,
				EXIST_YN			: true,
				RESERVATION_DATE	: { lte : Timer.inst.GetNowByStrDate() }
			}
		})
		.then(function (p_ret_reservation) {
			for ( var cnt_mail in p_ret_reservation ) {
				// GT_RESERVATION_MAIL update
				p_ret_reservation[cnt_mail].updateAttributes({
					MAIL_SEND_YN : true,
					EXIST_YN : false
				})
				.then(function (p_ret_reservation_update) {
					var mail_data = p_ret_reservation_update.dataValues;

					// GT_RESERVATION_MAIL_USER select
					GTMgr.inst.GetGTMailReservationUser().findAll({
						where : { RESERVATION_ID : mail_data.RESERVATION_ID, EXIST_YN : true }
					})
					.then(function (p_ret_user_list) {
						var RewardItem = function () {
							this.reward_type;
							this.reward_item_id;
							this.reward_count;
						}

						var reward_item_array = [];

						for ( var cnt_user in p_ret_user_list ) {
							var user_data = p_ret_user_list[cnt_user].dataValues;

							for ( var cnt_reward = 1; cnt_reward <= 5; ++cnt_reward ) {
								var reward_item = new RewardItem();

								reward_item.reward_type		= mail_data['REWARD' + cnt_reward + '_TYPE'];
								reward_item.reward_item_id	= mail_data['REWARD' + cnt_reward + '_ITEM_ID'];
								reward_item.reward_count	= mail_data['REWARD' + cnt_reward + '_COUNT'];
								reward_item_array.push(reward_item);								
							}

							// GT_MAIL insert
							MailMgr.inst.SendMail(user_data.UUID,
								0,
								mail_data.MAIL_TYPE,
								0,
								0,
								mail_data.MAIL_SUBJECT,
								mail_data.MAIL_CONTENTS,
								reward_item_array
							);
						}
					})
					.catch(function (p_error) {
						logger.error('ReqSendReservationMail - 3', p_error);
					});
				})
				.catch(function (p_error) {
					logger.error('ReqSendReservationMail - 2', p_error);
				});
			}
		})
		.catch(function (p_error) {
			logger.error('ReqSendReservationMail - 1', p_error);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;