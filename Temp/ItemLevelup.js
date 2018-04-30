/********************************************************************
Title : EquipItemLevelup
Date : 2015.12.11
Update : 2016.11.22
Desc : 아이템 레벨업(강화)
writer: jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var MissionMgr	= require('../Mission/MissionMgr.js');

var BaseItemRe	= require('../../Data/Base/BaseItemRe.js');
var BaseExpRe	= require('../../Data/Base/BaseExpRe.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqEquipItemLevelup = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipItemLevelup -', p_user.uuid, p_recv);

		var hero_id = parseInt(p_recv.hero_id);
		var item_id = parseInt(p_recv.item_id);

		// GT_HERO select
		GTMgr.inst.GetGTHero().find({
			where : { UUID : p_user.uuid, HERO_ID : hero_id, EXIST_YN : true }
		})
		.then(function (p_ret_hero) {
			if ( p_ret_hero == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Hero in GT_HERO HeroID', hero_id);
				return;
			}
			var hero_data = p_ret_hero.dataValues;

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

				// 레벨 제한 확인 - 영웅 현재 레벨을 넘지 못한다.
				var curr_level = equip_item_data.ITEM_LEVEL;
				var hero_level = hero_data.HERO_LEVEL;
				if ( hero_level <= curr_level ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughHeroLevel(), 'Hero Level', hero_level, 'EquipmentItem Level', curr_level);
					return;
				}

				// 아이템 BT
				var base_item = BaseItemRe.inst.GetItem(item_id);
				// console.log('base_item', base_item);
				if ( typeof base_item === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_id);
					return;
				}

				var target_promotion_step = equip_item_data.PROMOTION_STEP + 1;
				var item_promotion = base_item.GetPromotionInfo(target_promotion_step);
				console.log('ItemID : %d, target_promotion_step : %d, item_promotion', item_id, target_promotion_step, item_promotion);
				if ( typeof item_promotion === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item Promotion Info In Base target_promotion_step', target_promotion_step);
					return;
				}

				if ( curr_level >= item_promotion.limit_item_level ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughItemPromotionStep(), 'Promotion Step', target_promotion_step, 'Item Level', curr_level, 'Limit Level', item_promotion.limit_item_level);
					return;
				}

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

					// 아이템 레벨 누적 골드
					var curr_gold = user_data.GOLD;

					var target_level = curr_level + 1;
					var need_gold = BaseExpRe.inst.GetEquipItemNeedGold(target_level);
					if ( typeof need_gold === 'undefined' ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Equipment Item Levelup Need Gold In Base ItemID', item_id, 'Target Level', target_level);
						return;
					}

					// logger.info('curr_gold: %d, need_gold: %d', curr_gold, need_gold);
					// 골드 부족
					if ( need_gold == 0 || (curr_gold < need_gold) ) {
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
							ITEM_LEVEL : target_level
						})
						.then(function (p_ret_equipment_item_update) {
							p_ack_packet.hero_id	= p_ret_equipment_item_update.dataValues.HERO_ID;
							p_ack_packet.item_id	= p_ret_equipment_item_update.dataValues.ITEM_ID;
							p_ack_packet.item_level	= p_ret_equipment_item_update.dataValues.ITEM_LEVEL;
							p_ack_packet.gold		= p_ret_user_update.dataValues.GOLD;
							
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

							// Mission - AchieveEquipItemLV, IsLevelUpEquipItem
							MissionMgr.inst.MissionAchieveEquipItemLV(p_user, p_ack_packet.item_level);
							MissionMgr.inst.MissionIsLevelUpEquipItem(p_user, 1);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemLevelup - 5');
						});
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemLevelup - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemLevelup - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemLevelup - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipItemLevelup - 1');
		});
	}	

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;