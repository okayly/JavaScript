/********************************************************************
Title : AccountBuffLevelup
Date : 2016.03.14
Update : 2017.01.03
Desc : 계정 버프 레벨업
writer: jong wook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var BaseAccountBuffRe = require('../../Data/Base/BaseAccountBuffRe.js');

var Sender = require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetAccountBuff = function(p_user, p_ack_cmd, p_ack_packet, p_ret_user, p_ret_buff, p_recv_buff_id, p_need_gold) {
		console.log('SetAccountBuff p_ret_user', p_ret_user.dataValues, 'p_ret_buff', ( p_ret_buff == null ? null : p_ret_buff.dataValues ), 'buff_id', p_recv_buff_id, 'need_gold', p_need_gold);

		var ret_gold = p_ret_user.dataValues.GOLD - p_need_gold;
		var ret_buff_point = p_ret_user.dataValues.ACCOUNT_BUFF_POINT - 1;
		var ret_buff_level = ( p_ret_buff == null ) ? 1 : p_ret_buff.dataValues.ACCOUNT_BUFF_LEVEL + 1;

		// GT_USER update
		p_ret_user.updateAttributes({
			GOLD : ret_gold,
			ACCOUNT_BUFF_POINT : ret_buff_point
		})
		.then(function (p_ret_user_update) {
			p_ack_packet.gold = p_ret_user_update.dataValues.GOLD;

			if ( p_ret_buff == null ) {
				// GT_ACCOUNT_BUFF insert
				GTMgr.inst.GetGTAccountBuff().create({
					UUID				: p_user.uuid,
					ACCOUNT_BUFF_ID		: p_recv_buff_id,
					ACCOUNT_BUFF_LEVEL	: ret_buff_level,
					REG_DATE			: Timer.inst.GetNowByStrDate()
				})
				.then(function (p_ret_buff_create) {
					p_ack_packet.gold				= p_ret_user_update.dataValues.GOLD;
					p_ack_packet.account_buff_point	= p_ret_user_update.dataValues.ACCOUNT_BUFF_POINT;

					p_ack_packet.buff_id			= p_recv_buff_id;
					p_ack_packet.buff_level			= p_ret_buff_create.dataValues.ACCOUNT_BUFF_LEVEL;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SetAccountBuff - 3');
				});
			} else {
				// GT_ACCOUNT_BUFF update
				p_ret_buff.updateAttributes({
					ACCOUNT_BUFF_LEVEL : ret_buff_level
				})
				.then(function (p_ret_buff_update) {
					p_ack_packet.gold				= p_ret_user_update.dataValues.GOLD;
					p_ack_packet.account_buff_point	= p_ret_user_update.dataValues.ACCOUNT_BUFF_POINT;

					p_ack_packet.buff_id			= p_recv_buff_id;
					p_ack_packet.buff_level			= p_ret_buff_update.dataValues.ACCOUNT_BUFF_LEVEL;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SetAccountBuff - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SetAccountBuff - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 계정 버프 레벨 업
	inst.ReqAccountBuffLevelup = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqAccountBuffLevelup -',p_user.uuid, p_recv);

		var recv_buff_id = parseInt(p_recv.account_buff_id);

		// GT_USER select - 골드 확인
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// 계정버프 포인트 확인
			if ( user_data.ACCOUNT_BUFF_POINT <= 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughAccountBuffPoint(), 'Account Buff Point', user_data.ACCOUNT_BUFF_POINT);
				return;
			}

			// GT_ACCOUNT_BUFF select
			GTMgr.inst.GetGTAccountBuff().find({
				where : { UUID : p_user.uuid, ACCOUNT_BUFF_ID : recv_buff_id, EXIST_YN : true }
			})
			.then(function (p_ret_buff) {
				var buff_data = ( p_ret_buff == null ) ? null : p_ret_buff.dataValues;
				var target_level = ( buff_data == null ) ? 1 : buff_data.ACCOUNT_BUFF_LEVEL + 1;

				var buff_base = BaseAccountBuffRe.inst.GetAccountBuff(recv_buff_id);
				console.log('buff_base:', buff_base);
				if ( typeof buff_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Account Buff Info in Base Buff ID', recv_buff_id);
					return;
				}

				if ( buff_data != null ) {
					// 최고 레벨 확인
					if ( buff_base.max_level == buff_data.ACCOUNT_BUFF_LEVEL ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyMaxLevel(), 'Account Buff Level', buff_data.ACCOUNT_BUFF_LEVEL);
						return;
					}

					// 1. 계정 레벨 확인
					if ( user_data.USER_LEVEL < buff_base.need_account_level ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughUserLevel(), 'Need Level', buff_base.need_account_level, 'Current Level', user_data.USER_LEVEL);
						return;
					}
				}

				// 골드 확인
				var need_gold = Math.pow(buff_base.skill_tire, 3) * 100;
				if ( user_data.GOLD < need_gold ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'Need Gold', need_gold, 'Current Gold', user_data.GOLD);
					return;
				}

				// 버프 레벨업 조건 확인			
				// 필요 아이템 확인
				if ( buff_base.need_item_id != 0 ) {
					// GT_INVENTORY select - 가방 확인
					GTMgr.inst.GetGTInventory.find({
						where : { UUID : p_user.uuid, ITEM_ID : buff_base.need_item_id, EXIST_YN : true }
					})
					.then(function (p_ret_inventory) {
						var need_item_data = p_ret_inventory.dataValues;
						if ( need_item_data == null ) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistItemInInven(), 'need_item_id', buff_base.need_item_id);
							return;
						}

						var ret_item_count = need_item_data.ITEM_COUNT - need_item_count;

						// GT_INVENTORY update
						p_ret_inventory['ITEM_COUNT'] = ret_item_count;
						if ( ret_item_count <= 0 )
							p_ret_inventory['EXIST_YN'] = false;

						p_ret_inventory.save()
						.then(function (p_ret_inventory_update) {
							console.log('Inventory Update IUID : %d, ITEM_ID : %d, ITEM_COUNT : %d', p_ret_inventory_update.dataValues.IUID, p_ret_inventory_update.dataValues.ITEM_ID, p_ret_inventory_update.dataValues.ITEM_COUNT);

							// packet
							p_ack_packet.result_item = new PacketCommonData.Item();

							p_ack_packet.result_item.iuid		= need_item_data.IUID;
							p_ack_packet.result_item.item_id	= buff_base.need_item_id;
							p_ack_packet.result_item.item_count	= ret_item_count;							

							SetAccountBuff(p_user, p_ack_cmd, p_ack_packet, p_ret_user, p_ret_buff, recv_buff_id, need_gold);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountBuffLevelup - 4');
						});
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountBuffLevelup - 3');
					});
				} else {
					p_ack_packet.result_item = null;

					SetAccountBuff(p_user, p_ack_cmd, p_ack_packet, p_ret_user, p_ret_buff, recv_buff_id, need_gold);
				}
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountBuffLevelup - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountBuffLevelup - 1');
		});	
	}

	

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;