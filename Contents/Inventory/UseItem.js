/********************************************************************
Title : UseItem
Date : 2016.02.03
Update : 2017.04.07
Desc : 아이템 사용
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var LoadGTUser		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTInventory	= require('../../DB/GTLoad/LoadGTInventory.js');

var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var DefineValues= require('../../Common/DefineValues.js');
var BaseItemRe	= require('../../Data/Base/BaseItemRe.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetReward = function(p_ret_user, p_type, p_value, p_t) {
		let user_data = p_ret_user.dataValues;

		return new Promise(function (resolve, reject) {
			switch ( p_type ) {
				case DefineValues.inst.GoldReward :
					p_ret_user['GOLD'] = user_data.GOLD + p_value;
					break;

				case DefineValues.inst.CashReward :
					p_ret_user['CASH'] = user_data.CASH + p_value;
					break;

				case DefineValues.inst.HonorPointReward :
					p_ret_user['POINT_HONOR'] = user_data.POINT_HONOR + p_value;
					break;

				case DefineValues.inst.AlliancePointReward :
					p_ret_user['POINT_ALLIANCE'] = user_data.POINT_ALLIANCE + p_value;
					break;

				case DefineValues.inst.ChallengePointReward :
					p_ret_user['POINT_CHALLENGE'] = user_data.POINT_CHALLENGE + p_value;
					break;

				case DefineValues.inst.StaminaReward :
					p_ret_user['STAMINA'] = user_data.STAMINA + p_value;
					break;

				default:
					throw ([ PacketRet.inst.retFail(), 'Not Match Item Effect' ]);
					return;
			}

			// GT_USER update
			p_ret_user.save({ transaction : p_t })
			.then(p_ret_user_update => {
				console.log('SetReward uuid : %d', p_ret_user_update.dataValues.UUID);
				resolve(p_ret_user_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetTransaction = function(p_values, p_type, p_value) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_inventory = p_values[1];

			let ret_item_count = ret_inventory.dataValues.ITEM_COUNT - 1;

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				// console.log('SetTransaction');
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetReward(ret_user, p_type, p_value, t),
					SetGTInventory.inst.UpdateItemCount(t, ret_inventory, ret_item_count)
				])
				.then(values => {
					// console.log('values', values);
					t.commit();

					resolve(values);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				})
			});
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	inst.ReqUseItem = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqUseItem -', p_user.uuid, p_recv);

		let recv_iuid = parseInt(p_recv.iuid);

		// Promise.all GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTInventory.inst.SelectItemFromIUID(p_user.uuid, recv_iuid)
		])
		.then(values =>{
			// console.log('ReqUseItem values', values);
			let ret_user = values[0];
			let ret_inventory = values[1];
			
			if ( ret_inventory.dataValues.ITEM_COUNT <= 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount(), 'IUID', recv_iuid, 'Use ItemID', ret_inventory.dataValues.ITEM_ID);
				return;
			}

			let base_item = BaseItemRe.inst.GetItem(ret_inventory.dataValues.ITEM_ID);
			if ( typeof base_item === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item In Base');
				return;
			}

			// Category1 확인 - 소비(DefineValues : 1)
			if ( base_item.category1 != DefineValues.inst.FirstCategoryConsumption ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Type cate 1 Need Category', DefineValues.inst.FirstCategoryConsumption, 'Item Category', base_item.category1);
				return;
			}

			// Category2 확인 - 재화아이템(DefineValues : 5)
			if ( base_item.category2 != DefineValues.inst.SecondCategoryMoneyByConsumption ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Type cate 2 Need Category', DefineValues.inst.SecondCategoryMoneyByConsumption, 'Item Category', base_item.category2);
				return;
			}

			return SetTransaction(values, base_item.effect1_id, base_item.effect1_value1);
		})
		.then(values => {
			// console.log('values', values);
			let ret_user = values[0];
			let ret_inventory = values[1];

			p_ack_packet.use_item			= new PacketCommonData.Item();
			p_ack_packet.use_item.iuid		= ret_inventory.dataValues.IUID;
			p_ack_packet.use_item.item_id	= ret_inventory.dataValues.ITEM_ID;
			p_ack_packet.use_item.item_count= ret_inventory.dataValues.ITEM_COUNT;

			p_ack_packet.gold				= ret_user.dataValues.GOLD;
			p_ack_packet.cash				= ret_user.dataValues.CASH;
			p_ack_packet.point_honor		= ret_user.dataValues.POINT_HONOR;
			p_ack_packet.point_alliance		= ret_user.dataValues.POINT_ALLIANCE;
			p_ack_packet.point_challenge	= ret_user.dataValues.POINT_CHALLENGE;
			p_ack_packet.stamina			= ret_user.dataValues.STAMINA;
			p_ack_packet.stamina_remain_time= Timer.inst.GetStaminaFullRemainTime(ret_user.dataValues.STAMINA, ret_user.dataValues.MAX_STAMINA, ret_user.dataValues.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;