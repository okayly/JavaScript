/********************************************************************
Title : HeroSummon
Date : 2015.09.24
Update : 2017.04.19
Desc : 영웅 소환 - 진화별 스킬 습득
		장비아이템 설정(2017.04.18 장비는 차로 착용해야 함.)
writer: dongsu -> jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var RewardMgr = require('../RewardMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTInventory = require('../../DB/GTLoad/LoadGTInventory.js');
var LoadGTHero = require('../../DB/GTLoad/LoadGTHero.js');

var SetGTInventory = require('../../DB/GTSet/SetGTInventory.js');

var BaseHeroRe = require('../../Data/Base/BaseHeroRe.js');
var BaseHeroEvolutionRe = require('../../Data/Base/BaseHeroEvolutionRe.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_ret_stone_count, p_base_hero) {
		return new Promise(function (resolve, reject) {
			let ret_inventory = p_values[1];

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTInventory.inst.UpdateItemCount(t, ret_inventory, p_ret_stone_count),
					RewardMgr.inst.HeroSummon(t, ret_inventory.dataValues.UUID, p_base_hero.hero_id, p_base_hero.evolution_step, p_base_hero.army_id, p_base_hero.skill_list)
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
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 소환 정보 요청. 
	inst.ReqHeroSummon = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqHeroSummon -', p_user.uuid, p_recv);

		var recv_hero_id = parseInt(p_recv.hero_id);
		var recv_iuid = parseInt(p_recv.iuid);

		// Promise.all GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTInventory.inst.SelectItemFromIUID(p_user.uuid, recv_iuid),
			LoadGTHero.inst.SelectHero(p_user.uuid, recv_hero_id)			
		])
		.then(values => {
			let ret_user = values[0];
			let ret_inventory = values[1];
			let ret_hero = values[2];

			if ( ret_user == null || ret_inventory == null )
				throw ([ PacketRet.inst.retFail(), 'User or inventory is null' ]);

			if ( ret_hero != null )
				throw ([ PacketRet.inst.retAlreadyExistHero(), 'Already exist hero' ]);

			let base_hero = BaseHeroRe.inst.GetHero(recv_hero_id);			
			if (typeof base_hero === 'undefined')
				throw ([ PacketRet.inst.retFail(), 'Error No Hero in BT_HERO_BASE hero_id', recv_hero_id ]);

			// 영웅석 확인
			if ( base_hero.stone_id != ret_inventory.dataValues.ITEM_ID )
				throw ([ PacketRet.inst.retIncorrectItem(), 'need_hero_stone', base_hero.stone_id, 'curr_hero_stone', ret_inventory.dataValues.ITEM_ID ]);

			let need_stone_count = BaseHeroEvolutionRe.inst.GetNeedStoneCountByEvolutionStep(base_hero.evolution_step);
			if ( ret_inventory.dataValues.ITEM_COUNT < need_stone_count )
				throw([ PacketRet.inst.retNotEnoughNeedItem(), 'need_stone_count', need_stone_count, 'curr_stone_count', ret_inventory.dataValues.ITEM_COUNT ]);

			let ret_stone_count = ret_inventory.dataValues.ITEM_COUNT - need_stone_count;

			return ProcessTransaction(values, ret_stone_count, base_hero);
		})
		.then(values => {
			let ret_inventory = values[0];
			let ret_hero = values[1][0];
			let ret_hero_skill_list = values[1][1];

			p_ack_packet.result_item.iuid		= ret_inventory.dataValues.IUID;
			p_ack_packet.result_item.item_id	= ret_inventory.dataValues.ITEM_ID;
			p_ack_packet.result_item.item_count	= ret_inventory.dataValues.ITEM_COUNT;

			p_ack_packet.hero_id = ret_hero.dataValues.HERO_ID;
			p_ack_packet.army_id_list.push(ret_hero.dataValues.ARMY_SKILL_ID);

			for ( let cnt = 0; cnt < ret_hero_skill_list.length; ++cnt )
				p_ack_packet.skill_ids.push(ret_hero_skill_list[cnt].dataValues.SKILL_ID);

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