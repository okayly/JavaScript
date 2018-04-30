/********************************************************************
Title : AccountBuffReset
Date : 2016.03.14
Update : 2017.04.07
Desc : 계정 버프 초기화
writer: jong wook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseAccountBuffRe = require('../../Data/Base/BaseAccountBuffRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};	

	//------------------------------------------------------------------------------------------------------------------
	// 계정 버프 초기화
	inst.ReqAccountBuffReset = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqAccountBuffReset -', p_user.uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
			}
			var user_data = p_ret_user.dataValues;

			if ( user_data.CASH < DefineValues.inst.AccountBuffResetNeedCash ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Need Cash', DefineValues.inst.AccountBuffResetNeedCash, 'Current Cash', user_data.CASH);
				return;
			}

			// GT_ACCOUNT_BUFF select
			GTMgr.inst.GetGTAccountBuff().findAll({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_buff_list) {
				if ( p_ret_buff_list == null || Object.keys(p_ret_buff_list).length <= 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistNeedAccountBuff(), 'Account Buff List', p_ret_buff_list);
					return;
				}

				var need_item_id = BaseAccountBuffRe.inst.GetNeedItemID();
				// console.log('need_item_id', need_item_id);

				// Get user total gold, total need_item_count
				var tot_use_gold = 0;
				var tot_use_item_count = 0;
				for ( var cnt_buff in p_ret_buff_list ) {
					(function (cnt_buff) {
						var buff_data		= p_ret_buff_list[cnt_buff];
						tot_use_gold		= tot_use_gold + buff_data.ACCUM_USE_GOLD;
						tot_use_item_count	= tot_use_item_count + buff_data.ACCUM_USE_RESOURCE_COUNT;
					})(cnt_buff);
				}

				// console.log('tot_use_gold : %d, tot_use_item_count : %d', tot_use_gold, tot_use_item_count);

				var refund_gold = tot_use_gold * DefineValues.inst.AccountBuffResetRefundGoldRate;

				// call ad-hoc query
				mkDB.inst.GetSequelize().query('call sp_update_account_buff_reset(?, ?, ?, ?, ?, ?);'
					, null
					, { raw : true, type : 'SELECT' }
					, [ p_user.uuid,
						DefineValues.inst.AccountBuffResetNeedCash,
						refund_gold,
						DefineValues.inst.AccountBuffResetRefundGoldRate,
						need_item_id,
						tot_use_item_count
					]
				)
				.then(function (p_ret_buff_reset) {
					// console.log('p_ret_buff_reset:', p_ret_buff_reset);
					// 재화
					p_ack_packet.gold = p_ret_buff_reset[0][0].GOLD;
					p_ack_packet.cash = p_ret_buff_reset[0][0].CASH;

					p_ack_packet.refund_gold = p_ret_buff_reset[1][0].REFUND_GOLD;
					p_ack_packet.refund_resource_count = p_ret_buff_reset[1][0].REFUND_RESOURCE_COUNT;

					// 획득 아이템
					if (Object.keys(p_ret_buff_reset[2]).length == 0) {
						p_ack_packet.refund_item = null;
					} else {
						p_ack_packet.refund_item = new PacketCommonData.Item();
						p_ack_packet.refund_item.iuid		= p_ret_buff_reset[2][0].IUID;
						p_ack_packet.refund_item.item_id	= p_ret_buff_reset[2][0].ITEM_ID;
						p_ack_packet.refund_item.item_count	= p_ret_buff_reset[2][0].ITEM_COUNT;
					}

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
 					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountBuffReset - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountBuffReset - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountBuffReset - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;