/********************************************************************
Title : HeroEvolution
Date : 2015.09.24
Update : 2015.03.15
Desc : 영웅 진화(별 상승.) - 진화 단계별로 스킬이 생긴다.
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseHeroRe = require('../../Data/Base/BaseHeroRe.js');
var BaseHeroEvolutionRe = require('../../Data/Base/BaseHeroEvolutionRe.js');

var Sender 	= require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqHeroEvolution = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqHeroEvolutionRe - ', p_user.uuid, p_recv);

		var recv_hero_id= parseInt(p_recv.hero_id);

		// GT_USER select - 1. 영웅 보유 확인.
		GTMgr.inst.GetGTUser().find({
			where : { UUID: p_user.uuid, EXIST_YN: true }
		})
		.then(function (p_ret_user) {
			// GT_HERO select
			GTMgr.inst.GetGTHero().find({
				where : { UUID : p_user.uuid, HERO_ID : recv_hero_id, EXIST_YN : true }
			})
			.then(function (p_ret_hero) {
				if ( p_ret_hero == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistHeroInUser(), 'hero_id', recv_hero_id);
					return;
				}

				var ret_evolution_step = p_ret_hero.dataValues.EVOLUTION_STEP + 1;
				var base_evolution = BaseHeroEvolutionRe.inst.GetHeroEvolution(ret_evolution_step);
				if ( typeof base_evolution === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error No BaseHeroEvolution hero_id', recv_hero_id, 'ret_evolution_step', ret_evolution_step);
					return;
				}

				// 골드 확인
				if ( p_ret_user.dataValues.GOLD < base_evolution.need_gold ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'need_gold', base_evolution.need_gold, 'curr_gold', p_ret_user.dataValues.GOLD);
					return;
				}

				var base_hero = BaseHeroRe.inst.GetHero(recv_hero_id);
				if ( typeof base_hero === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Hero In Base hero_id', recv_hero_id);
					return;
				}

				GTMgr.inst.GetGTInventory().find({
					where : { UUID : p_user.uuid, ITEM_ID : base_hero.stone_id, EXIST_YN : true }
				})
				.then(function (p_ret_inven) {
					if ( p_ret_inven == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistItemInInven(), 'ITEM_ID', base_hero.stone_id);
						return;
					}

					// 영웅석 갯수 확인
					if ( p_ret_inven.dataValues.ITEM_COUNT < base_evolution.need_hero_stone_count ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughNeedItem(), 'need_item_count', base_evolution.need_hero_stone_count, 'curr_item_count', p_ret_inven.dataValues.ITEM_COUNT);
						return;
					}

					// GT_HERO update
					p_ret_hero.updateAttributes({
						EVOLUTION_STEP: ret_evolution_step
					})
					.then(function (p_ret_hero_update) {

						var ret_gold		= p_ret_user.dataValues.GOLD - base_evolution.need_gold;
						var ret_item_count	= p_ret_inven.dataValues.ITEM_COUNT - base_evolution.need_hero_stone_count;

						// GT_USER update - TODO : 골드 설정 중복 코드 한곳으로 모아 보자.
						p_ret_user.updateAttributes({
							GOLD : ret_gold
						})
						.then(function (p_ret_user_update) {
							console.log('GOLD', p_ret_user_update.dataValues.GOLD);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroEvolutionRe - 6');
						});

						// GT_INVENTORY update - TODO : 아이템 설정 중복 코드 한곳으로 모아 보자.
						p_ret_inven['ITEM_COUNT'] = ret_item_count;
						if ( ret_item_count <= 0 )
							p_ret_inven['EXIST_YN'] = false;

						p_ret_inven.save()
						.then(function (p_ret_inven_update) {
							// console.log('p_ret_inven_update', p_ret_inven_update.dataValues);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroEvolutionRe - 5');
						});

						// packet
						p_ack_packet.hero_id		= p_ret_hero.dataValues.HERO_ID;
						p_ack_packet.evolution_step	= p_ret_hero.dataValues.EVOLUTION_STEP;
						p_ack_packet.gold			= ret_gold;
						p_ack_packet.result_item.iuid		= p_ret_inven.dataValues.IUID;
						p_ack_packet.result_item.item_id	= p_ret_inven.dataValues.ITEM_ID;
						p_ack_packet.result_item.item_count	= ret_item_count;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroEvolutionRe - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroEvolutionRe - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroEvolutionRe - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroEvolutionRe - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;