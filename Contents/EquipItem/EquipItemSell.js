/********************************************************************
Title : EquipItemSell
Date : 2017.02.08
Update : 2017.02.08
Desc : 장비 아이템 판매
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 장비 장착
	inst.ReqEquipItemSell = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipItemSell -', p_user.uuid, p_recv);

		let recv_iuid_list = p_recv.iuid_list;
		let sell_iuid_list = [];
		
		// console.log('Array.isArray(recv_iuid_list)', Array.isArray(recv_iuid_list));
		if ( Array.isArray(recv_iuid_list) == false || recv_iuid_list.length == 0) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'recv_iuid_list', recv_iuid_list);
			return;
		}

		// 유저 얻기
		var getUser = function() {
			return new Promise(function (resolve, reject) {
				console.log('1. getUser');

				// GT_USER select
				GTMgr.inst.GetGTUser().find({
					where : { UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(p_ret_user => { resolve(p_ret_user)})
				.catch(p_error => { reject(p_error); });
			});
		}

		// 장비 얻기
		var getItemList = function() {
			return new Promise(function (resolve, reject) {
				console.log('2. getItemList');

				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().findAll({
					where : { UUID : p_user.uuid, IUID : { in : recv_iuid_list }, EXIST_YN : true }
				})
				.then(p_item_list => {
					if ( p_item_list.length == 0 )
						throw ([ PacketRet.inst.retIncorrectItem(), 'No Item', p_item_list ]);

					resolve(p_item_list);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		// 장비 판매
		var sellItem = function(p_ret_user, p_item_list) {
			console.log('3. sellItem');

			let tot_gold = 0;
			let user_data = p_ret_user.dataValues;

			for ( let cnt in p_item_list ) {
				let item_data = p_item_list[cnt].dataValues;

				if ( item_data.IS_LOCK == true ) {
					throw ([ PacketRet.inst.retIncorrectItem(), 'Lock Item', item_data.IUID ]);
				}

				let base_item = BaseItemRe.inst.GetItem(item_data.ITEM_ID);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_data.ITEM_ID ]);

				tot_gold = tot_gold + base_item.sell_gold;

				sell_iuid_list.push(item_data.IUID);
			}
			console.log('user_gold : %d, tot_gold : %d', user_data.GOLD, tot_gold);

			let ret_gold = user_data.GOLD + tot_gold;

			return new Promise(function (resolve, resject) {
				return Promise.all(p_item_list.map(row => {
					return new Promise(function (resolve, reject) {
						// GT_INVENTORY update
						row.updateAttributes({ EXIST_YN : false })
						.then(p_equip_item => { resolve(p_equip_item); })
						.catch(p_error => { reject(p_error); });					
					});
				}))
				.then(values => {
					resolve([ p_ret_user, ret_gold ]);
				})
				.catch(p_error => {
					reject (p_error);
				});
			});
		}		

		// 골드 설정
		var setGold = function(p_ret_user, p_ret_gold) {			
			console.log('4. setGold', p_ret_gold);

			return new Promise(function (resolve, reject) {
				// GT_USER update
				p_ret_user.updateAttributes({ GOLD : p_ret_gold })
				.then(p_ret_user_update => { resolve(p_ret_user_update); })
				.catch(p_error => { reject(p_error); });
			});
		}
		
		// Promise GO!
		Promise.all([getUser(), getItemList()])
		.then(p_values => { return sellItem(p_values[0], p_values[1]); })
		.then(p_values => { return setGold(p_values[0], p_values[1]); })
		.then(p_user_update => {
			p_ack_packet.GOLD = p_user_update.dataValues.GOLD;
			p_ack_packet.iuid_list = sell_iuid_list;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			console.log('Promise Error', p_error);

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