/********************************************************************
Title : HeroLevelup
Date : 2015.09.24
Update : 2017.03.15
Desc : 경험치 아이템을 사용해서 영웅 레벨 업
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseExpRe = require('../../Data/Base/BaseExpRe.js');
var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수
	// var battle_map = new HashMap();

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqHeroLevelUp = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqHeroLevelUp -', p_user.uuid, p_recv);

		var recv_hero_id		= parseInt(p_recv.hero_id);
		var recv_iuid			= parseInt(p_recv.iuid);
		var recv_use_item_count	= parseInt(p_recv.use_item_count);

		// GT_USER select - 1. 유저 검사
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// GT_HERO select
			GTMgr.inst.GetGTHero().find({
				where : { UUID : p_user.uuid, HERO_ID : recv_hero_id, EXIST_YN : true }
			})
			.then(function (p_ret_hero) {
				if ( p_ret_hero == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistHeroInUser(), 'Hero ID', recv_hero_id);
					return;
				}
				var hero_data = p_ret_hero.dataValues;
				var old_level = hero_data.HERO_LEVEL;

				// 계정 레벨 도달이면 현재 경험치의 100% 확인.
				console.log('USER_LEVEL : %d, HERO_LEVEL : %d', user_data.USER_LEVEL, hero_data.HERO_LEVEL);
				if ( user_data.USER_LEVEL == hero_data.HERO_LEVEL ) {
					var target_level = hero_data.HERO_LEVEL + 1;
					if ( target_level > BaseExpRe.inst.GetMaxHeroLevel() ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyMaxLevel(), 'Max HeroLevel', hero_data.HERO_LEVEL);
						return;
					}

					var base_hero_exp = BaseExpRe.inst.GetHeroExp(target_level);
					if ( typeof base_hero_exp === 'undefined' ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error No HeroExp in BT_EXP Hero ID', recv_hero_id, 'Target Hero Level', target_level);
						return;
					}

					if ( hero_data.EXP == base_hero_exp.total_exp ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughUserLevel(), 'Hero Exp', hero_data.EXP, 'Base Total Exp', base_hero_exp.total_exp);
						return;
					}
				}

				// 1-1. 인벤에 존재 여부.
				// 1-2. 인벤에 카운트 확인.
				GTMgr.inst.GetGTInventory().find({
					where : { UUID: p_user.uuid, IUID : recv_iuid, EXIST_YN : true }
				})
				.then(function (p_ret_inventory) {
					// console.log('p_ret_inventory', p_ret_inventory);
					if ( p_ret_inventory == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistItemInInven(), 'IUID', recv_iuid);
						return;
					}

					// 1-3. 아이템 타입 확인.
					var base_item = BaseItemRe.inst.GetItem(p_ret_inventory.dataValues.ITEM_ID);
					// console.log('base_item', base_item);
					if ( base_item.category1 != DefineValues.inst.FirstCategoryConsumption ||
						base_item.category2 != DefineValues.inst.SecondCategoryExpScrollByConsumption ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Type');
						return;
					}

					if ( p_ret_inventory.dataValues.ITEM_COUNT < recv_use_item_count ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughNeedItem(), 'Need Count', recv_use_item_count, 'Item Count', p_ret_inventory.dataValues.ITEM_COUNT);
						return;
					}

					var ret_item_count = p_ret_inventory.dataValues.ITEM_COUNT - recv_use_item_count;

					// GT_INVENTORY update - TODO : 중복 코드 한군데로 뺄수 있을거 같다.
					p_ret_inventory['ITEM_COUNT'] = ret_item_count;
					if ( ret_item_count <= 0 ) {
						p_ret_inventory['EXIST_YN'] = false;
					}

					p_ret_inventory.save()
					.then(function (p_ret_inventory_update) {
						// console.log('p_ret_inventory_update', p_ret_inventory_update.dataValues);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
					});

					// packet
					p_ack_packet.result_item.iuid		= p_ret_inventory.dataValues.IUID;
					p_ack_packet.result_item.item_id	= p_ret_inventory.dataValues.ITEM_ID;
					p_ack_packet.result_item.item_count	= ret_item_count;

					// 획득 경험치
					var sum_exp		= hero_data.EXP + (base_item.effect1_value1 * recv_use_item_count);
					var ret_level	= 0;
					var ret_exp		= 0;
					let limit_level = DefineValues.inst.MinLevel + ( hero_data.EVOLUTION_STEP - 1 ) * 5;

					console.log('hero_data.EXP : %d, effect_value1 : %d, item_count : %d, sum_exp : %d, limit_level : %d', hero_data.EXP, base_item.effect1_value1, recv_use_item_count, sum_exp, limit_level);

					var levelup_exp = BaseExpRe.inst.GetLevelupHeroExp(limit_level, sum_exp);
					console.log('levelup_exp', levelup_exp);
					if ( typeof levelup_exp === 'undefined' ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error Levelup exp User Level', user_data.USER_LEVEL, 'Sum Exp', sum_exp);
						return;
					}
					
					if ( levelup_exp.level >= limit_level ) {
						ret_level = limit_level;
						ret_exp = levelup_exp.total_exp;
					} else {
						ret_level = levelup_exp.level;
						ret_exp = sum_exp;
					}

					console.log('ret_level : %d, ret_exp : %d', ret_level, ret_exp);

					if ( ret_level == 0 || ret_exp == 0 ) {
						logger.error('(ret_level == 0 || ret_exp == 0)', 'ret_level', ret_level, 'ret_exp', ret_exp);
						return;
					}

					// GT_HERO update
					p_ret_hero.updateAttributes({
						HERO_LEVEL : ret_level, EXP : ret_exp
					})
					.then(function (p_ret_hero_update) {
						// console.log('p_ret_hero_update', p_ret_hero_update.dataValues);
						var update_data = p_ret_hero_update.dataValues;
						// packet
						p_ack_packet.hero_id 	= hero_data.HERO_ID;
						p_ack_packet.hero_level = update_data.HERO_LEVEL;
						p_ack_packet.hero_exp 	= ret_exp;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroLevelUpRe - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroLevelUpRe - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroLevelUpRe - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroLevelUpRe - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;