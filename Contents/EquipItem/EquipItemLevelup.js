/********************************************************************
Title : EquipItemLevelup
Date : 2015.12.11
Update : 2017.03.15
Desc : 아이템 레벨업
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');
var BaseEquipItem	= require('../../Data/Base/BaseEquipItem.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqEquipItemLevelup = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipItemLevelup -', p_user.uuid, p_recv);
		
		let recv_iuid = parseInt(p_recv.iuid);

		var getUser = function() {
			return new Promise(function (resolve, reject) {
				console.log('1. getUser');

				// GT_USER select
				GTMgr.inst.GetGTUser().find({
					where : { UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(p_ret_user => { resolve(p_ret_user); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var getItem = function(p_ret_user) {			
			return new Promise(function (resolve, reject) {
				console.log('2. getItem');

				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().find({
					where : { UUID : p_user.uuid, IUID : recv_iuid, EXIST_YN : true }
				})
				.then(p_ret_item => { resolve(p_ret_item); })
				.catch(p_error => { reject(p_error); })
			});
		}

		var checkLevelup = function(p_ret_user, p_ret_item) {
			return new Promise(function (resolve, reject) {
				console.log('3. checkLevelup');

				if ( p_ret_user == null || p_ret_item == null )
					throw ([ PacketRet.inst.retFail(), 'user == null || item == null' ]);

				let user_data = p_ret_user.dataValues;
				let item_data = p_ret_item.dataValues;

				let base_item = BaseItemRe.inst.GetItem(item_data.ITEM_ID);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_data.ITEM_ID ]);

				// 최고 레벨
				if ( item_data.ITEM_LEVEL >= DefineValues.inst.EquipItemMaxLv )
					throw ([ PacketRet.inst.retAlreadyMaxLevel(), 'Max Level', item_data.ITEM_LEVEL ]);

				let base_status = BaseEquipItem.inst.GetEquipItemStatus(base_item.equip_status_id);
				if ( typeof base_status === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Equip Status Info In Base ItemID', item_data.ITEM_ID ]);

				// 필요 골드
				let need_gold = base_status.lv_up_gold + ( (item_data.ITEM_LEVEL - 1) * base_status.lv_up_gold_lv);
				console.log('need_gold : %d, lv_up_gold : %d, item_level : %d, lv_up_gold_lv : %d', need_gold, base_status.lv_up_gold, item_data.ITEM_LEVEL, base_status.lv_up_gold_lv);

				if ( user_data.GOLD < need_gold )
					throw ([ PacketRet.inst.retNotEnoughGold(), 'Not Enough Gold need_gold', need_gold, 'user_gold', user_data.GOLD ]);

				let ret_gold = user_data.GOLD - need_gold;
				let item_level = item_data.ITEM_LEVEL + 1;

				resolve([p_ret_user, ret_gold, p_ret_item, item_level]);
			});
		}

		var setGold = function(p_ret_user, p_gold) {
			return new Promise(function (resolve, reject) {
				console.log('setGold');

				// GT_USER update
				p_ret_user.updateAttributes({ GOLD : p_gold })
				.then(p_ret_user_update => { resolve(p_ret_user_update); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var setLevel = function(p_ret_item, p_level) {
			return new Promise(function (resolve, reject) {
				console.log('setLevel');

				// GT_INVENTORY update
				p_ret_item.updateAttributes({ ITEM_LEVEL : p_level })
				.then(p_ret_item_update => { resolve(p_ret_item_update); })
				.catch(p_error => { reject(p_error); });
			});
		}

		// Promise GO!
		// 배열 리턴이 순서가 보장 되는거 같다.
		// 참고 링크 https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
		Promise.all([getUser(), getItem()])
		.then(values => {
			return checkLevelup(values[0], values[1]);
		})
		.then(values => {
			return Promise.all([ setGold(values[0], values[1]), setLevel(values[2], values[3]) ]);
		})
		.then(values => {
			let user_data = values[0].dataValues;
			let item_data = values[1].dataValues;

			p_ack_packet.gold		= user_data.GOLD;
			p_ack_packet.iuid		= item_data.IUID;
			p_ack_packet.item_level	= item_data.ITEM_LEVEL;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			console.log('error Promise.all', p_error);

			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;