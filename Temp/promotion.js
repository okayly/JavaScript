/********************************************************************
Title : EquipItemEnchant
Date : 2017.02.07
Desc : 아이템 강화
writer: jongwook
********************************************************************/
var GTMgr		= require('../../DB/GTMgr.js');
var MissionMgr	= require('../Mission/MissionMgr.js');

var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqEquipItemEnchant = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipItemEnchant -', p_user.uuid, p_recv);

		// 클라가 주는 재료템 검사 하지 말고 서버에서 처리 하자
		var hero_id = parseInt(p_recv.hero_id);
		var item_id = parseInt(p_recv.item_id);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// GT_EQUIPMENT_ITEM
			GTMgr.inst.GetGTEquipmentItem().find({
				where : { UUID : p_user.uuid, HERO_ID : hero_id, ITEM_ID : item_id, EXIST_YN : true }
			})
			.then(function (p_ret_equipment_item) {
				if ( p_ret_equipment_item == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find EquipmentItem in GT_EQUIPMENT_ITEM ItemID', item_id);
					return;
				}
				var equip_item_data = p_ret_equipment_item.dataValues;

				// 아이템 BT
				var base_item = BaseItemRe.inst.GetItem(equip_item_data.ITEM_ID);
				// console.log('base_item', base_item);
				if ( typeof base_item === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_id);
					return;
				}
				
				var curr_promotion_step = equip_item_data.REINFORCE_STEP;
				var curr_item_promotion = base_item.GetPromotionInfo(curr_promotion_step);
				console.log('ItemID : %d, promotion_step : %d, curr_item_promotion', item_id, curr_promotion_step, curr_item_promotion);
				if ( typeof curr_item_promotion === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item Promotion Info In Base', curr_promotion_step);
					return;
				}

				// 최대 승급 단계 확인
				if ( curr_promotion_step >= base_item.max_promotion_step ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyMaxPromotionStep(), 'Current Step', curr_promotion_step, 'Max Step', base_item.max_promotion_step);
					return;
				}

				var next_promotion_step = curr_promotion_step + 1;
				var next_item_promotion = base_item.GetPromotionInfo(next_promotion_step);
				console.log('ItemID : %d, promotion_step : %d, next_item_promotion', item_id, next_promotion_step, next_item_promotion);
				if ( typeof next_item_promotion === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item Promotion Info In Base', next_promotion_step);
					return;
				}

				// 장착 아이템이 승급 가능한 레벨인지 확인
				var curr_level = equip_item_data.ITEM_LEVEL;
				if ( curr_level < next_item_promotion.limit_item_level ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughItemLevel(), 'Limit Level', next_item_promotion.limit_item_level, 'Current Level', curr_level);
					return;
				}

				var need_item_map = next_item_promotion.need_item_map;

				// GT_INVENTORY select - 재료 확인
				GTMgr.inst.GetGTInventory().findAll({
					where : { UUID : p_user.uuid, ITEM_ID : need_item_map.keys(), EXIST_YN : true }
				})
				.then(function (p_ret_inventory) {
					// console.log('p_ret_inventory', p_ret_inventory.dataValues);
					if ( p_ret_inventory == null || p_ret_inventory.length != need_item_map.count() ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistItemInInven(), 'p_ret_inventory.length', ( p_ret_inventory != null ) ? p_ret_inventory.length : p_ret_inventory, 'Need Item Count', need_item_map.count());
						return;
					}

					// 재료 아이템 수 확인
					for ( var cnt in p_ret_inventory ) {
						if ( need_item_map.has(p_ret_inventory[cnt].dataValues.ITEM_ID) == true ) {
							var need_item_count = need_item_map.get(p_ret_inventory[cnt].dataValues.ITEM_ID);
							if ( p_ret_inventory[cnt].dataValues.ITEM_COUNT < need_item_count ) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistItemInInven(), 'Need ItemCount', need_item_count, 'Current ItemCount', p_ret_inventory[cnt].ITEM_COUNT);
								return;
							}
						}
					}

					// 재료 아이템 설정
					for ( var cnt in p_ret_inventory ) {
						(function (cnt) {
							// console.log('p_ret_inventory[%d]', cnt, p_ret_inventory[cnt]);
							var item_id = p_ret_inventory[cnt].dataValues.ITEM_ID;
							var need_item_count = need_item_map.get(item_id);
							var ret_item_count = p_ret_inventory[cnt].dataValues.ITEM_COUNT - need_item_count;

							console.log('ItemID : %d, ret_item_count : %d', p_ret_inventory[cnt].dataValues.ITEM_ID, ret_item_count);

							// GT_INVENTORY update
							p_ret_inventory[cnt]['ITEM_COUNT'] = ret_item_count;
							if ( ret_item_count <= 0 )
								p_ret_inventory[cnt]['EXIST_YN'] = false;

							p_ret_inventory[cnt].save()
							.then(function (p_ret_inventory_update) {
								console.log('Inventory Update IUID : %d, ITEM_ID : %d, ITEM_COUNT : %d', p_ret_inventory_update.dataValues.IUID, p_ret_inventory_update.dataValues.ITEM_ID, p_ret_inventory_update.dataValues.ITEM_COUNT);
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error Inventory update ItemID', item_id);
							});

							// packet
							var packet_item			= new PacketCommonData.Item();
							packet_item.iuid		= p_ret_inventory[cnt].dataValues.IUID;
							packet_item.item_id		= item_id;
							packet_item.item_count	= ret_item_count;
							p_ack_packet.result_items.push(packet_item);
						})(cnt);
					}

					// 골드 확인
					var curr_gold = user_data.GOLD;
					var need_gold = next_item_promotion.need_gold;
					if ( need_gold == 0 || curr_gold < need_gold ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'Need Gold', need_gold, 'Current Gold', curr_gold);
						return;
					}

					// logger.info('target_level: %d, need_gold: %d', target_level, need_gold);
					// 장착 아이템 레벨, 소유 골드 update
					var ret_gold = curr_gold - need_gold;

					// GT_USER update
					p_ret_user.updateAttributes({
						GOLD : ret_gold
					})
					.then(function (p_ret_user_update) {
						// GT_EQUIPMENT_ITEM update
						p_ret_equipment_item.updateAttributes({
							REINFORCE_STEP : next_promotion_step
						})
						.then(function (p_ret_equipment_item_update) {
							p_ack_packet.hero_id		= p_ret_equipment_item_update.dataValues.HERO_ID;
							p_ack_packet.item_id		= p_ret_equipment_item_update.dataValues.ITEM_ID;
							p_ack_packet.promotion_step	= p_ret_equipment_item_update.dataValues.REINFORCE_STEP;
							p_ack_packet.gold			= p_ret_user_update.dataValues.GOLD;
							
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

							// Mission - IsPromotionEquipItem
							MissionMgr.inst.MissionIsPromotionEquipItem(p_user);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemEnchant - 5');
						});
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemEnchant - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemEnchant - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemEnchant - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemEnchant - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;