/********************************************************************
Title : ShopBuy
Date : 2016.01.18
Update : 2017.04.07
Desc : 상점 - 구매
	   Packet은 RewardBox로 구성 하자.
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseShopRe	= require('../../Data/Base/BaseShopRe.js')
var BaseItemRe	= require('../../Data/Base/BaseItemRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqShopBuy = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqShopBuy -', p_user.uuid, p_recv);

		var shop_type = parseInt(p_recv.shop_type);
		var shop_id   = parseInt(p_recv.shop_id);
		var item_slot = parseInt(p_recv.item_slot);

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

			// GT_SHOP select
			GTMgr.inst.GetGTShop().find({
				where: { UUID : user_data.UUID, EXIST_YN : true }
			})
			.then(function (p_ret_shop) {
				if ( p_ret_shop == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Shop in GT_SHOP');
					return;
				}
				var shop_data = p_ret_shop.dataValues;

				// 랜덤 상점이면 오픈 상태 확인
				var close_time = moment(shop_data.RANDOM_SHOP_OPEN_TIME).add(1, 'hours');
				if ( shop_type == DefineValues.inst.RandomShop && shop_data.RANDOM_SHOP_OPEN_TIME != null ) {
					if ( moment().ifAfter(close_time) ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retRandomShopClosed());
						return;
					}
				}

				// 판매 상점 정보
				var shop_base = BaseShopRe.inst.GetShop(shop_type, shop_id);
				if ( typeof shop_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Shop In Base');
					return;
				}

				var buy_item = shop_base.GetShopItem(item_slot - 1);
				console.log('buy_item -', buy_item);
				if ( typeof buy_item === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Item In Shop Base');
					return;
				}
				
				// 아이템 BT 정보
				var item_base = BaseItemRe.inst.GetItem(buy_item.item_id);
				// console.log('item_base', item_base);
				if (typeof item_base === 'undefined') {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Item In Base');
					return;
				}

				var diff_gold			= user_data.GOLD;
				var diff_cash			= user_data.CASH;
				var diff_point_honor	= user_data.POINT_HONOR;
				var diff_point_alliance	= user_data.POINT_ALLIANCE;
				var diff_point_challenge= user_data.POINT_CHALLENGE;

				var need_gold			= 0;
				var need_cash			= 0;
				var need_point_honor	= 0;
				var need_point_alliance	= 0;
				var need_point_challenge= 0;
				
				// 1. 필요 재화 차감
				switch ( buy_item.buy_cost_type ) {
					case DefineValues.inst.GoldReward : {
							need_gold = item_base.buy_cost_gold * buy_item.item_count;
							user_data.GOLD = user_data.GOLD - need_gold;

							if ( user_data.GOLD < 0 ) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'use_gold', user_data.GOLD, 'need_gold', need_gold);
								return;
							}
						}
						break;

					case DefineValues.inst.CashReward : {
							need_cash = item_base.buy_cost_cash * buy_item.item_count;
							user_data.CASH = user_data.CASH - need_cash;

							if ( user_data.CASH < 0 ) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'user_cash', user_data.CASH, 'need_cash', need_cash);
								return;
							}
						}
						break;

					case DefineValues.inst.HonorPointReward : {
							need_point_honor = item_base.buy_cost_point * buy_item.item_count;
							user_data.POINT_HONOR = user_data.POINT_HONOR - need_point_honor;

							if ( user_data.POINT_HONOR < 0 ) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughPvPPoint(), 'user_point_honor', user_data.POINT_HONOR, 'need_point_honor', need_point_honor);
								return;
							}
						}
						break;

					case DefineValues.inst.AlliancePointReward : {
							need_point_alliance = item_base.buy_cost_point * buy_item.item_count;
							user_data.POINT_ALLIANCE = user_data.POINT_ALLIANCE - need_point_alliance;

							if ( user_data.POINT_ALLIANCE < 0 ) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGuildPoint(), 'user_point_alliance', user_data.POINT_ALLIANCE, 'need_point_alliance', need_point_alliance);
								return;
							}
						}
						break;

					case DefineValues.inst.ChallengePointReward : {
							need_point_challenge = item_base.buy_cost_point * buy_item.item_count;
							user_data.POINT_CHALLENGE = user_data.POINT_CHALLENGE - need_point_challenge;

							if ( user_data.POINT_CHALLENGE < 0 ) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughChallengePoint(), 'user_point_challenge', user_data.POINT_CHALLENGE, 'need_point_challenge', need_point_challenge);
								return;
							}
						}
						break;
				}

				console.log('need_gold: %d, need_cash: %d, need_point_honor: %d, need_point_alliance: %d, need_point_challenge: %d', need_gold, need_cash, need_point_honor, need_point_alliance, need_point_challenge);

				if ( need_gold == 0 && need_cash == 0 && need_point_honor == 0 && need_point_alliance == 0 && need_point_challenge  == 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'need_gold == 0 && need_cash == 0 && need_point_honor == 0 && need_point_alliance == 0 && need_point_challenge  == 0');
					return;
				}

				var ret_stamina = 0;
				// Packet 설정
				p_ack_packet.reward_box = new PacketCommonData.RewardBox();

				// 2. 소비 재화 아이템 구매 - Category1 : 소비(1), Category2 : 재화아이템(5)				
				var isConsumeItem = ( item_base.category1 == DefineValues.inst.FirstCategoryConsumption && item_base.category2 == DefineValues.inst.SecondCategoryMoneyByConsumption );
				if ( isConsumeItem ) {
					switch ( item_base.effect1_id ) {
						case DefineValues.inst.GoldReward :
							user_data.GOLD = user_data.GOLD + (item_base.effect1_value1 * buy_item.item_count);
							break;

						case DefineValues.inst.CashReward :
							user_data.CASH = user_data.CASH + (item_base.effect1_value1 * buy_item.item_count);
							break;

						case DefineValues.inst.HonorPointReward :
							user_data.POINT_HONOR = user_data.POINT_HONOR + (item_base.effect1_value1 * buy_item.item_count);
							break;

						case DefineValues.inst.AlliancePointReward :
							user_data.POINT_ALLIANCE = user_data.POINT_ALLIANCE + (item_base.effect1_value1 * buy_item.item_count);
							break;

						case DefineValues.inst.ChallengePointReward :
							user_data.POINT_CHALLENGE = user_data.POINT_CHALLENGE + (item_base.effect1_value1 * buy_item.item_count);
							break;

						case DefineValues.inst.StaminaReward : {
								ret_stamina = user_data.STAMINA + (item_base.effect1_value1 * buy_item.item_count);
								
								p_ret_user['STAMINA'] = ret_stamina;
								p_ret_user['LAST_STAMINA_CHANGE_DATE'] = ( ret_stamina < user_data.MAX_STAMINA ) ? Timer.inst.GetNowByStrDate() : null;
							}
							break;

						default:
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Effect');
							return;
					}
				}

				p_ret_user['GOLD']				= user_data.GOLD;
				p_ret_user['CASH']				= user_data.CASH;
				p_ret_user['POINT_HONOR']		= user_data.POINT_HONOR;
				p_ret_user['POINT_ALLIANCE']	= user_data.POINT_ALLIANCE;
				p_ret_user['POINT_CHALLENGE']	= user_data.POINT_CHALLENGE;

				// GT_USER update
				p_ret_user.save()
				.then(function (p_ret_user_update) {
					var update_data = p_ret_user_update.dataValues;
					// console.log('update_data', update_data);

					// Send Packet - 보상 내용이 있으면 패킷을 만든다.
					if ( diff_gold != update_data.GOLD ) {
						p_ack_packet.reward_box.gold = new PacketCommonData.Gold();
						p_ack_packet.reward_box.gold.total = update_data.GOLD;
					}

					if ( diff_cash != update_data.CASH ) {
						p_ack_packet.reward_box.cash = new PacketCommonData.Cash();
						p_ack_packet.reward_box.cash.total = update_data.CASH;
					}

					if ( diff_point_honor != update_data.POINT_HONOR ) {
						p_ack_packet.reward_box.honor_point = new PacketCommonData.HonorPoint();
						p_ack_packet.reward_box.honor_point.total = update_data.POINT_HONOR;
					}

					if ( diff_point_alliance != update_data.POINT_ALLIANCE ) {
						p_ack_packet.reward_box.alliance_point = new PacketCommonData.AlliancePoint();
						p_ack_packet.reward_box.alliance_point.total = update_data.POINT_ALLIANCE;
					}

					if ( diff_point_challenge != update_data.POINT_CHALLENGE ) {
						p_ack_packet.reward_box.challenge_point = new PacketCommonData.ChallengePoint();
						p_ack_packet.reward_box.challenge_point.total = update_data.POINT_CHALLENGE;
					}

					if ( ret_stamina != 0 ) {
						p_ack_packet.reward_box.stamina	= new PacketCommonData.Stamina();
						p_ack_packet.reward_box.stamina.total = update_data.STAMINA;
						p_ack_packet.reward_box.stamina.max_stamina	= update_data.MAX_STAMINA;

						// 스태미너 Full 까지 남은 시간
						p_ack_packet.reward_box.stamina.stamina_remain_time = Timer.inst.GetStaminaFullRemainTime(update_data.STAMINA, update_data.MAX_STAMINA, update_data.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);
					}

					// 소비 재화 아이템
					if ( isConsumeItem == true ) {
						p_ack_packet.reward_box.result_item_list = null;
						
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					} else {
						// 가방에 들어가는 아이템
						BuyItemProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, item_base.item_id, buy_item.item_count);
					}
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopBuy - 3');
				});
			})
			.catch(function(p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopBuy - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopBuy - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var BuyItemProcess = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_item_id, p_item_count) {
		// GT_INVENTORY select - 아이템 구매
		GTMgr.inst.GetGTInventory().find({
			where : { UUID : p_user.uuid, ITEM_ID : p_item_id, EXIST_YN : true }
		})
		.then(function (p_ret_inventory) {
			if ( p_ret_inventory == null ) {
				// GT_INVENTORY insert
				GTMgr.inst.GetGTInventory().create({
					UUID : p_user.uuid, ITEM_ID : p_item_id, ITEM_COUNT : p_item_count
				})
				.then(function (p_ret_inventory_create) {
					var inventory_data = p_ret_inventory_create.dataValues;
					// console.log('create item', inventory_data);
					// Send Packet
					var item		= new PacketCommonData.Item();
					item.iuid		= inventory_data.IUID;
					item.item_id	= inventory_data.ITEM_ID;
					item.item_count	= inventory_data.ITEM_COUNT;
					p_ack_packet.reward_box.result_item_list.push(item);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_ret_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error BuyItemProcess - 3');
				});
			} else {
				// GT_INVENTORY update
				p_ret_inventory.updateAttributes({
					ITEM_COUNT : p_ret_inventory.dataValues.ITEM_COUNT + p_item_count
				})
				.then(function (p_ret_inventory_update) {
					var inventory_data = p_ret_inventory_update.dataValues;
					// console.log('update item', inventory_data);
					// Send Packet
					var item		= new PacketCommonData.Item();
					item.iuid		= inventory_data.IUID;
					item.item_id	= inventory_data.ITEM_ID;
					item.item_count	= inventory_data.ITEM_COUNT;
					p_ack_packet.reward_box.result_item_list.push(item);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error BuyItemProcess - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error BuyItemProcess - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;