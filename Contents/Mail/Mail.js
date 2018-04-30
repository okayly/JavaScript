/********************************************************************
Title : Mail
Date : 2016.02.23
Update : 2017.04.07
Desc : 우편 기능 - 우편 리스트, 확인, 보상, 지우기
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var GTMgr = require('../../DB/GTMgr.js');
var RewardMgr = require('../RewardMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');
var moment = require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// Mail 확인 목록 요청
	inst.ReqMailReadInfo = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqMailReadInfo -', p_user.uuid, p_recv);

		// GT_MAIL select
		GTMgr.inst.GetGTMail().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_mail) {
			// console.log('p_ret_mail', p_ret_mail);
			for ( var cnt in p_ret_mail ) {
				var read_info = new PacketCommonData.MailReadInfo();

				read_info.mail_id = p_ret_mail[cnt].dataValues.MAIL_ID;
				read_info.read_yn = (p_ret_mail[cnt].dataValues.MAIL_READ_YN == true);

				p_ack_packet.mail_read_infos.push(read_info);

			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailReadInfo');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// Mail list 요청
	inst.ReqMailList = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqMailList -', p_user.uuid, p_recv);

		var recv_all = (p_recv.recv_all == true || p_recv.recv_all == 'true') ? true : false;
		var mail_ids = p_recv.mail_ids;
		
		if ( (recv_all == 0) && mail_ids.length == 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Recv mail_ids.length == 0');
			return;
		}

		// 전체 리스트 주기
		if ( recv_all == true ) {
			// call ad-hoc query
			mkDB.inst.GetSequelize().query('select *, ifnull((select nick from GT_USERs A where A.UUID = B.MAIL_SENDER), \'GM\') as SENDER_NICK \
											from GT_MAILs B WHERE UUID = ? and EXIST_YN = true \
											order by MAIL_READ_YN asc, REG_DATE desc;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_user.uuid ]
			)
			.then(function (p_ret_mail_list) {
				SendPacketMailList(p_user, p_ret_mail_list, p_ack_cmd, p_ack_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailList - 2');
			});
		} else {
			// call ad-hoc query
			mkDB.inst.GetSequelize().query('select *, ifnull((select nick from GT_USERs A where A.UUID = B.MAIL_SENDER), \'GM\') as SENDER_NICK \
											from GT_MAILs B WHERE UUID = ? and EXIST_YN = true and MAIL_ID in (?) \
											order by MAIL_READ_YN asc, REG_DATE desc;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_user.uuid, mail_ids ]
			)
			.then(function (p_ret_mail_list) {
				SendPacketMailList(p_user, p_ret_mail_list, p_ack_cmd, p_ack_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailList - 1');
			});
		}
	}

	var SendPacketMailList = function (p_user, p_ret_mail_list, p_ack_cmd, p_ack_packet) {
		for (var cnt in p_ret_mail_list) {
			var mail_data = p_ret_mail_list[cnt];

			var list_info				= new PacketCommonData.MailListInfo();
			list_info.sender			= mail_data.SENDER_NICK;
			list_info.mail_string_id	= mail_data.MAIL_STRING_ID;
			list_info.mail_id			= mail_data.MAIL_ID;
			list_info.mail_type			= mail_data.MAIL_TYPE;
			list_info.mail_icon_type	= mail_data.MAIL_ICON_TYPE;
			list_info.mail_icon_item_id	= mail_data.MAIL_ICON_ITEM_ID;
			list_info.mail_icon_count	= mail_data.MAIL_ICON_COUNT;
			list_info.read_yn			= (mail_data.MAIL_READ_YN == true);
			list_info.reg_date			= moment(mail_data.REG_DATE).unix();	// unix time 으로
			list_info.subject			= mail_data.MAIL_SUBJECT;

			p_ack_packet.mail_list_infos.push(list_info);
		}

		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
	}

	//------------------------------------------------------------------------------------------------------------------
	// Mail 일기
	// 보상이 있는 메일은 보상을 받아야 읽음 처리
	inst.ReqMailRead = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqMailRead -', p_user.uuid, p_recv);

		var recv_mail_id = parseInt(p_recv.mail_id);

		if ( recv_mail_id == 0 || isNaN(recv_mail_id) ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectMailID());
			return;
		}

		// GT_MAIL select
		mkDB.inst.GetSequelize().query('call sp_update_mail_read(?, ?);',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_user.uuid, recv_mail_id ]
		)
		.then(function (p_ret_mail) {
			p_ack_packet.mail_id			= p_ret_mail[0][0].MAIL_ID;
			p_ack_packet.mail_string_id		= p_ret_mail[0][0].MAIL_STRING_ID;
			p_ack_packet.mail_contents		= p_ret_mail[0][0].MAIL_CONTENTS;
			p_ack_packet.string_value_list	= (p_ret_mail[0][0].MAIL_STRING_VALUE_LIST != null) ? p_ret_mail[0][0].MAIL_STRING_VALUE_LIST.split(',') : null;
			p_ack_packet.read_yn			= (p_ret_mail[0][0].MAIL_READ_YN == 1);
			p_ack_packet.read_date			= moment(p_ret_mail[0][0].MAIL_READ_DATE).unix();	// unix time

			for ( var cnt = 0; cnt < DefineValues.inst.MaxMailReward; ++cnt ) {
				if ( p_ret_mail[0][0]['REWARD' + (cnt + 1) + '_TYPE'] != DefineValues.inst.NotReward ) {
					var item = new PacketCommonData.MailReward();
					item.reward_type	= p_ret_mail[0][0]['REWARD' + (cnt + 1) + '_TYPE'];
					item.reward_item_id	= p_ret_mail[0][0]['REWARD' + (cnt + 1) + '_ITEM_ID'];
					item.reward_count	= p_ret_mail[0][0]['REWARD' + (cnt + 1) + '_COUNT'];

					p_ack_packet.mail_rewards.push(item);
				}
			}
			
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailRead');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// Mail Reward 요청 수정
	inst.ReqMailReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqMailReward -', p_user.uuid, p_recv);

		var recv_mail_id = parseInt(p_recv.mail_id);

		if ( recv_mail_id == 0 || isNaN(recv_mail_id) ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectMailID());
			return;
		}

		// GT_MAIL select
		GTMgr.inst.GetGTMail().find({
			where : { UUID : p_user.uuid, MAIL_ID : recv_mail_id, EXIST_YN : true }
		})
		.then(function (p_ret_mail) {
			// console.log('p_ret_mail', p_ret_mail);
			if ( p_ret_mail == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Mail In GT_MAIL Mail ID', recv_mail_id);
				return;
			}
			var mail_data = p_ret_mail.dataValues;

			// console.log('mail_data', mail_data.MAIL_TYPE, DefineValues.inst.ItemMail, mail_data.MAIL_TYPE == DefineValues.inst.ItemMail);

			if ( mail_data.MAIL_TYPE == DefineValues.inst.ItemMail && mail_data.MAIL_READ_YN == true ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyRewardMail(), 'Mail ID', recv_mail_id);
				return;
			}

			// GT_MAIL update
			p_ret_mail.updateAttributes({
				MAIL_READ_YN : true,
				MAIL_READ_DATE : Timer.inst.GetNowByStrDate()
			})
			.then(function (p_ret_mail_update) {
				var mail_update_data = p_ret_mail_update.dataValues;

				// 보상에 태우려면 array 형식으로 바꿔줘야 하는게 번거롭다.
				var RewardInfo = function() {
					this.reward_type;
					this.reward_id;
					this.reward_count;
				}

				var reward_list = [];
				p_ack_packet.mail_id = mail_update_data.MAIL_ID;

				for ( var cnt = 0; cnt < DefineValues.inst.MaxMailReward; ++cnt ) {
					if ( mail_update_data['REWARD_TYPE' + (cnt + 1)] != DefineValues.inst.NotReward ) {
						var reward_info = new RewardInfo();
						reward_info.reward_type		= mail_update_data['REWARD' + (cnt + 1) + '_TYPE'];
						reward_info.reward_id		= mail_update_data['REWARD' + (cnt + 1) + '_ITEM_ID'];
						reward_info.reward_count	= mail_update_data['REWARD' + (cnt + 1) + '_COUNT'];
						reward_list.push(reward_info);
					}
				}

				RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, reward_list);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailRewardRe - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailRewardRe - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// Mail Reward All 요청
	// 우편 전체 받기는 우편 하나씩 받는 걸로 변경(핑퐁 형식)
	inst.ReqMailRewardAllRe = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqMailRewardAllRe -', p_user.uuid, p_recv);

		var recv_mail_id = parseInt(p_recv.mail_id);

		if ( recv_mail_id == 0 || isNaN(recv_mail_id) ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectMailID());
			return;
		}

		// GT_MAIL select
		GTMgr.inst.GetGTMail().find({
			where : { UUID : p_user.uuid, MAIL_ID : recv_mail_id, EXIST_YN : true }
		})
		.then(function (p_ret_mail) {
			// console.log('p_ret_mail', p_ret_mail);
			if ( p_ret_mail == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFailMailRewardAll(), 'Not Find Mail In GT_MAIL Mail ID', recv_mail_id);
				return;
			}
			var mail_data = p_ret_mail.dataValues;

			// console.log('mail_data', mail_data.MAIL_TYPE, DefineValues.inst.ItemMail, mail_data.MAIL_TYPE == DefineValues.inst.ItemMail);

			if ( mail_data.MAIL_TYPE == DefineValues.inst.ItemMail && mail_data.MAIL_READ_YN == true ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFailMailRewardAll(), 'Mail ID', recv_mail_id);
				return;
			}

			// GT_MAIL update
			p_ret_mail.updateAttributes({
				MAIL_READ_YN : true,
				MAIL_READ_DATE : Timer.inst.GetNowByStrDate()
			})
			.then(function (p_ret_mail_update) {
				var mail_update_data = p_ret_mail_update.dataValues;

				// 보상에 태우려면 array 형식으로 바꿔줘야 하는게 번거롭다.
				var RewardInfo = function() {
					this.reward_type;
					this.reward_id;
					this.reward_count;
				}

				var reward_list = [];
				p_ack_packet.mail_id = mail_update_data.MAIL_ID;

				for ( var cnt = 0; cnt < DefineValues.inst.MaxMailReward; ++cnt ) {
					if ( mail_update_data['REWARD_TYPE' + (cnt + 1)] != DefineValues.inst.NotReward ) {
						var reward_info = new RewardInfo();
						reward_info.reward_type		= mail_update_data['REWARD' + (cnt + 1) + '_TYPE'];
						reward_info.reward_id		= mail_update_data['REWARD' + (cnt + 1) + '_ITEM_ID'];
						reward_info.reward_count	= mail_update_data['REWARD' + (cnt + 1) + '_COUNT'];
						reward_list.push(reward_info);
					}
				}

				RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, reward_list);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailRewardRe - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailRewardRe - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// Mail Reward All 요청
	inst.ReqMailRewardAll = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqMailRewardAll -', p_user.uuid, p_recv);

		mkDB.inst.GetSequelize().query('call sp_insert_mail_reward_all(?);',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_user.uuid ]
		)
		.then(function (p_ret_mail) {
			if ( Object.keys(p_ret_mail[0]).length != 0 ) {
				for ( var cnt in p_ret_mail[0] ) {
					p_ack_packet.mail_ids.push(parseInt(p_ret_mail[0][cnt].MAIL_ID));
				}
			} else {
				p_ack_packet.mail_ids = [];
			}

			p_ack_packet.gold			= p_ret_mail[1][0].GOLD;
			p_ack_packet.cash			= p_ret_mail[1][0].CASH;
			p_ack_packet.point_honor	= p_ret_mail[1][0].POINT_HONOR;
			p_ack_packet.point_alliance	= p_ret_mail[1][0].POINT_ALLIANCE;
			p_ack_packet.point_challenge= p_ret_mail[1][0].POINT_CHALLENGE;
			p_ack_packet.stamina		= p_ret_mail[1][0].STAMINA;

			if ( Object.keys(p_ret_mail[0]).length != 0 ) {
				for ( var cnt in p_ret_mail[2] ) {
					var get_item		= new PacketCommonData.Item();
					get_item.iuid		= p_ret_mail[2][cnt].IUID;
					get_item.item_id	= p_ret_mail[2][cnt].ITEM_ID;
					get_item.item_count	= p_ret_mail[2][cnt].ITEM_COUNT;

					p_ack_packet.get_items.push(get_item);
				}
			} else {
				p_ack_packet.get_items = [];
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMailRewardAll');
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;