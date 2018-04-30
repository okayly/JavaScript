/********************************************************************
Title : HeroReinforce
Date : 2015.12.10
Update : 2017.04.07
Desc : 영웅 승급 아이템
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseHeroRe			= require('../../Data/Base/BaseHeroRe.js');
var BaseHeroPromotionRe	= require('../../Data/Base/BaseHeroPromotionRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 장착 아이템 요청
	inst.ReqHeroReinforce = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqHeroReinforce -', p_user.uuid, p_recv);

		var recv_hero_id = parseInt(p_recv.hero_id);
		var recv_iuid_list = p_recv.need_item_iuids;

		// GT_USER select - 1. 영웅 보유 확인.
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}

			// GT_HERO select
			GTMgr.inst.GetGTHero().find({
				where : { UUID : p_user.uuid, HERO_ID : recv_hero_id, EXIST_YN : true }
			})
			.then(function (p_ret_hero) {
				if ( p_ret_hero == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Hero in GT_HERO HeroID', hero_id);
					return;
				}

				var hero_base = BaseHeroRe.inst.GetHero(recv_hero_id);
				if ( typeof hero_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Hero In Base hero_id', recv_hero_id);
					return;
				}

				var ret_promotion_step = p_ret_hero.dataValues.REINFORCE_STEP + 1;
				var promotion_base = BaseHeroPromotionRe.inst.GetHeroPromotion(hero_base.reinforce_id, ret_promotion_step);
				if ( typeof promotion_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error No BaseHeroPromotion hero_id', recv_hero_id, 'ret_promotion_step', ret_promotion_step);
					return;
				}

				// 골드 확인
				if ( p_ret_user.dataValues.GOLD < promotion_base.need_gold ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'need_gold', promotion_base.need_gold, 'curr_gold', p_ret_user.dataValues.GOLD);
					return;
				}

				var need_item_map = promotion_base.GetNeedItemMap();
				// console.log('need_item_map', need_item_map);
				// need_item_map.forEach(function (value, key) {
				// 	console.log('key : %d, value', key, value);
				// });

				// GT_INVENTORY select - 재료 아이템 확인
				GTMgr.inst.GetGTInventory().findAndCountAll({
					where : { UUID : p_user.uuid, ITEM_ID : need_item_map.keys(), EXIST_YN : true }
				})
				.then(function (p_ret_inventory) {
					// console.log('p_ret_inventory', p_ret_inventory.dataValues);
					if ( p_ret_inventory.count < need_item_map.count() ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughNeedItem(), 'p_ret_inventory.length', (p_ret_inventory != null) ? p_ret_inventory.length : p_ret_inventory, 'need_item_map.count()', need_item_map.count());
						return;
					}
					
					for ( var row_check in p_ret_inventory.rows ) {
						var item_data = p_ret_inventory.rows[row_check].dataValues;
						var need_item = need_item_map.get(item_data.ITEM_ID);

						if ( item_data.ITEM_COUNT < need_item.item_count ) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughNeedItem(), 'need_count', need_item.item_count, 'curr_count', item_data.ITEM_COUNT);
							return;
						}
					}
					
					// 재료 아이템 설정
					for ( var row in p_ret_inventory.rows ) {
						(function (row) {
							// console.log('p_ret_inventory.rows[%d]', row, p_ret_inventory.rows[row]);
							var need_item = need_item_map.get(p_ret_inventory.rows[row].dataValues.ITEM_ID);
							var ret_item_count = p_ret_inventory.rows[row].dataValues.ITEM_COUNT - need_item.item_count;

							// console.log('need_item', need_item);

							// GT_INVENTORY update
							p_ret_inventory.rows[row]['ITEM_COUNT'] = ret_item_count;
							if ( ret_item_count <= 0 )
								p_ret_inventory.rows[row]['EXIST_YN'] = false;

							p_ret_inventory.rows[row].save()
							.then(function (p_ret_inventory_update) {
								// console.log('ITEM_COUNT', p_ret_inventory.rows_update.dataValues.ITEM_COUNT);
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error Inventory update row', row, 'item_id', p_ret_inventory.rows[row].ITEM_ID);
							});

							// packet
							var packet_item			= new PacketCommonData.Item();
							packet_item.iuid		= p_ret_inventory.rows[row].dataValues.IUID;
							packet_item.item_id		= p_ret_inventory.rows[row].dataValues.ITEM_ID;
							packet_item.item_count	= ret_item_count;
							p_ack_packet.result_items.push(packet_item);
						})(row);
					}

					var ret_gold = p_ret_user.dataValues.GOLD - promotion_base.need_gold;

					// GT_USER update - TODO : 골드 설정 중복 코드 한곳으로 모아 보자.
					p_ret_user.updateAttributes({
						GOLD : ret_gold
					})
					.then(function (p_ret_user_update) {
						console.log('GOLD', p_ret_user_update.dataValues.GOLD);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroEvolutionRe - gold');
					});

					// GT_HERO update
					p_ret_hero.updateAttributes({
						REINFORCE_STEP: ret_promotion_step
					})
					.then(function (p_ret_hero_update) {
						p_ack_packet.hero_id		=  p_ret_hero.dataValues.HERO_ID;
						p_ack_packet.reinforce_step	=  p_ret_hero_update.dataValues.REINFORCE_STEP;
						p_ack_packet.gold			=  ret_gold;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroPromotionRe - 4');
					});					
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroPromotionRe - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroPromotionRe - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroPromotionRe - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;