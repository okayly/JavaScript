/********************************************************************
Title : EquipItemReinforce
Date : 2017.02.07
Update : 2017.04.03
Desc : 장착 아이템 강화
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseItemRe = require('../../Data/Base/BaseItemRe.js');
var BaseEquipItem	= require('../../Data/Base/BaseEquipItem.js');
var BaseItemReinforce = require('../../Data/Base/BaseItemReinforce.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqEquipItemReinforce = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipItemReinforce -', p_user.uuid, p_recv);

		var recv_iuid = parseInt(p_recv.iuid);

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

		var checkNeedItemCount = function(p_need_item_id, p_need_item_count) {
			return new Promise(function (resolve, reject) {
				console.log('4. checkNeedItemCount');

				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().find({
					where : { UUID : p_user.uuid, ITEM_ID : p_need_item_id, EXIST_YN : true }
				})
				.then(p_ret_item => {
					if ( p_ret_item == null )
						throw ([ PacketRet.inst.retFail(), 'Not Exist Need Item In GT_INVENTORY ItemID', p_need_item_id ]);

					let data_item = p_ret_item.dataValues;

					if ( data_item.ITEM_COUNT < p_need_item_count )
						throw ([ PacketRet.inst.retNotEnoughNeedItem(), 'Not Exist Need Item In GT_INVENTORY ItemID', p_need_item_id ]);

					resolve(p_ret_item);
				})
				.catch(p_error => { reject(p_error); })
			});
		}

		var checkEnchant = function(p_ret_user, p_ret_item) {
			return new Promise(function (resolve, reject) {
				console.log('3. checkEnchant');

				if ( p_ret_user == null || p_ret_item == null )
					throw ([ PacketRet.inst.retFail(), 'user == null || item == null' ]);

				let user_data = p_ret_user.dataValues;
				let item_data = p_ret_item.dataValues;

				// 최고 레벨
				if ( item_data.REINFORCE_STEP >= DefineValues.inst.EquipItemMaxEnchant )
					throw ([ PacketRet.inst.retAlreadyMaxEnchantStep(), 'Max EnchantStep', item_data.ITEM_LEVEL ]);

				let base_item = BaseItemRe.inst.GetItem(item_data.ITEM_ID);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_data.ITEM_ID ]);

				let base_status = BaseEquipItem.inst.GetEquipItemStatus(base_item.equip_status_id);
				if ( typeof base_status === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Equip Status Info In Base ItemID', item_data.ITEM_ID ]);

				let enchant_id = (base_status.evolution_step * 10000) + (base_item.category2 * 1000) + ( item_data.REINFORCE_STEP + 1 );

				let base_enchant = BaseItemReinforce.inst.GetItemEnchantCost(enchant_id);
				if ( typeof base_enchant === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist EnchantCost Info In Base enchant_id', enchant_id ]);

				// 필요 골드
				let need_gold = base_enchant.need_gold;

				if ( user_data.GOLD < need_gold )
					throw ([ PacketRet.inst.retNotEnoughGold(), 'Not Enough Gold need_gold', need_gold, 'user_gold', user_data.GOLD ]);
				
				let need_item_count = base_enchant.need_material_count_1;

				// Promise 아이템 수 확인
				checkNeedItemCount(base_enchant.need_material_id_1, need_item_count)
				.then(p_ret_need_item => {
					var enchant_rate = Rand.inst.RandomRange(1, 100);

					let ret_rate = ( enchant_rate <= base_enchant.rate );
					let ret_gold = user_data.GOLD - need_gold;
					let ret_item_count = p_ret_need_item.dataValues.ITEM_COUNT - need_item_count;

					resolve([p_ret_user, ret_gold, p_ret_need_item, ret_item_count, p_ret_item, ret_rate]);
				})
				.catch(p_error => { reject(p_error); });
			});			
		}

		var UpdateUserGold = function(p_ret_user, p_gold) {
			return new Promise(function (resolve, reject) {
				console.log('UpdateUserGold');

				// GT_USER update
				p_ret_user.updateAttributes({ GOLD : p_gold })
				.then(p_ret_user_update => { resolve(p_ret_user_update); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var setItemCount = function(p_ret_item, p_ret_item_count) {
			return new Promise(function (resolve, reject) {
				console.log('setItemCount');

				// GT_USER update
				p_ret_item['ITEM_COUNT'] = p_ret_item_count;

				if ( p_ret_item_count <= 0 )
					p_ret_item['EXIST_YN'] = false;

				p_ret_item.save()
				.then(p_ret_item_update => { resolve(p_ret_item_update); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var setEnchantStep = function(p_ret_item, p_ret_enchant) {
			return new Promise(function (resolve, reject) {
				console.log('setEnchantStep', p_ret_enchant);
				
				if ( p_ret_enchant == true ) {
					let ret_step = p_ret_item.dataValues.REINFORCE_STEP + 1;

					// GT_USER update
					p_ret_item.updateAttributes({ REINFORCE_STEP : ret_step })
					.then(p_ret_item_update => { resolve([ p_ret_enchant, p_ret_item_update ]); })
					.catch(p_error => { reject(p_error); });
				} else {
					resolve([ p_ret_enchant, p_ret_item ]);
				}
			});			
		}

		// Promise GO!
		Promise.all([
			getUser(),
			getItem()
		])
		.then(values => {
			return checkEnchant(values[0], values[1]);
		})
		.then(values => {
			return Promise.all([
				UpdateUserGold(values[0], values[1])
				, setItemCount(values[2], values[3])
				, setEnchantStep(values[4], values[5])
			]);
		})
		.then(values => {
			let user_data		= values[0].dataValues;
			let need_item_data	= values[1].dataValues;
			let equip_item_data	= values[2][1].dataValues;

			p_ack_packet.result_reinforce = values[2][0];
			p_ack_packet.iuid			= equip_item_data.IUID;
			p_ack_packet.reinforce_step	= equip_item_data.REINFORCE_STEP;
			p_ack_packet.gold			= user_data.GOLD;

			p_ack_packet.result_item			= new PacketCommonData.Item();
			p_ack_packet.result_item.iuid		= need_item_data.IUID;
			p_ack_packet.result_item.item_id	= need_item_data.ITEM_ID;
			p_ack_packet.result_item.item_count	= need_item_data.ITEM_COUNT;

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