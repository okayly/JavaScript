/********************************************************************
Title : Gacha
Date : 2016.07.19
Update : 2017.04.18
Desc : 가챠
writer: dongsu -> jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var GachaMgr	= require('./GachaMgr.js');
var RewardMgr	= require('../RewardMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');

var SetGTUser = require('../../DB/GTSet/SetGTUser.js');
var SetGTInventory = require('../../DB/GTSet/SetGTInventory.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseGachaRe			= require('../../Data/Base/BaseGachaRe.js');
var BaseItemRe			= require('../../Data/Base/BaseItemRe.js');
var BaseVipRe			= require('../../Data/Base/BaseVipRe.js');
var BaseHeroRe			= require('../../Data/Base/BaseHeroRe.js');
var BaseHeroEvolutionRe	= require('../../Data/Base/BaseHeroEvolutionRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var IsOwnedHero = function(p_hero_id, p_ret_hero_list) {
		for ( let cnt = 0; cnt < p_ret_hero_list.length; ++ cnt ) {
			if ( p_hero_id == p_ret_hero_list[cnt].dataValues.HERO_ID ) {
				return true;
			}
		}
		return false;
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectGacha = function(p_uuid, p_gacha_id) {
		return new Promise(function (resolve, reject) {
			// GT_GACHA select
			GTMgr.inst.GetGTGacha().find({
				where : { UUID : p_uuid, GACHA_ID : p_gacha_id, EXIST_YN : true }
			})
			.then(p_ret_gacha => { resolve(p_ret_gacha); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateGachaExecCount = function(p_t, p_ret_gacha, p_exec_count, p_now) {
		return new Promise(function (resolve, reject) {
			// GT_GACHA update
			p_ret_gacha.updateAttributes({
				DAILY_GACHA_COUNT : p_ret_gacha.dataValues.DAILY_GACHA_COUNT + p_exec_count,
				TOTAL_GACHA_COUNT : p_ret_gacha.dataValues.TOTAL_GACHA_COUNT + p_exec_count,
				LAST_GACHA_DATE : p_now
			})
			.then(p_ret_gacha_update => { resolve(p_ret_gacha_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var GetHeroList = function(p_values, p_uuid, p_hero_id_list) {
		return new Promise(function (resolve, reject) {
			// GT_HERO select
			GTMgr.inst.GetGTHero().findAll({
				where : { UUID : p_uuid, HERO_ID : { in : p_hero_id_list }, EXIST_YN : true }
			})
			.then(p_ret_hero_list => {
				p_values.push(p_ret_hero_list);

				resolve(p_values);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 가챠 장비 획득
	var ProcessTransaction = function(p_values, p_gacha_info, p_item_list, p_hero_summon_list) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_gacha = p_values[1];

			// console.log('ProcessTransaction', p_values);

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				// console.log('ProcessTransaction');
				let t = transaction;

				let ret_gold = ret_user.dataValues.GOLD - p_gacha_info.need_gold;
				let ret_cash = ret_user.dataValues.CASH - p_gacha_info.need_cash;

				console.log('ret_gold : %d = %d - %d', ret_gold, ret_user.dataValues.GOLD, p_gacha_info.need_gold);
				console.log('ret_cash : %d = %d - %d', ret_cash, ret_user.dataValues.CASH, p_gacha_info.need_cash);

				// Promise.all GO!
				Promise.all([
					SetGTUser.inst.UpdateGoldAndCash(t, ret_user, ret_gold, ret_cash),
					UpdateGachaExecCount(t, ret_gacha, p_gacha_info.exec_count, p_gacha_info.now_date),
					SetGTInventory.inst.SetRewardItemList(ret_user.dataValues.UUID, p_item_list, t)
				])
				.then(return_values => {
					// 소환왼 영웅 ID 추가.(패킷에서 사용)
					return_values.push(p_hero_summon_list);

					// 소환할 영웅이 없으면 끝
					if ( p_hero_summon_list.length == 0 ) {
						t.commit();
						resolve(return_values);
					} else {
						// Promise.all GO! - 영웅 하나씩 소환
						Promise.all(p_hero_summon_list.map(hero_id => {
							let base_hero = BaseHeroRe.inst.GetHero(hero_id);
							if ( typeof base_hero === 'undefined')
								throw ([ PacketRet.inst.retFail(), 'Error BaseHero', hero_id ]);

							return new Promise(function (resolve, reject) {
								return RewardMgr.inst.HeroSummon(t, ret_user.dataValues.UUID, hero_id, base_hero.evolution_step, base_hero.army_id, base_hero.skill_list)
								.then(values => { resolve(values); })
								.catch(p_error => { reject(p_error); });
							});
						}))
						.then(values => {
							t.commit();
							resolve(return_values);
						})
						.catch(p_error => {
							if (t)
								t.rollback();

							reject(p_error);
						});
					}
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				})
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var IsFreePass = function(p_values, p_base_gacha) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_gacha = p_values[1];

			if ( ret_user == null || ret_gacha == null )
				reject ([ PacketRet.inst.retFail(), 'ret_user or ret_gaha is null' ]);

			// VIP 확인			
			if ( p_base_gacha.vip_gacha == true ) {
				let base_vip = BaseVipRe.inst.GetVip(ret_user.dataValues.VIP_STEP);

				if ( typeof base_vip === 'undefined' )
					reject ([ PacketRet.inst.retFail(), 'Not Exist Vip Info In Base Current VIP Step', p_ret_vip.dataValues.STEP ]);

				if ( base_vip.vip_gacha == false )
					reject ([ PacketRet.inst.retNotEnoughVipStep(), 'GachaID', recv_gacha_id ]);
			}

			// 무료 확인
			let free_pass = false;
			
			if ( p_base_gacha.daily_free_exec_count != 0 ) {
				let calc_free_count = p_base_gacha.daily_free_exec_count - ret_gacha.dataValues.DAILY_GACHA_COUNT;

				if ( calc_free_count > 0 ) {
					let delta_time = Timer.inst.GetDeltaTime(ret_gacha.dataValues.LAST_GACHA_DATE);

					if ( delta_time >= p_base_gacha.free_exec_delay_time_for_sec || calc_free_count == p_base_gacha.daily_free_exec_count ) {
						free_pass = true;
						console.log('무료 뽑기 수행 중');
					}
				}
			}

			// 재화 확인
			if ( free_pass == false ) {
				if ( p_base_gacha.price_type == DefineValues.inst.GachaPriceTypeGold ) {
					// 골드 부족
					if ( p_base_gacha.price > ret_user.dataValues.GOLD )
						reject([ PacketRet.inst.retNotEnoughGold(), 'Need gold', p_base_gacha.price, 'Current gold', ret_user.dataValues.GOLD ]);
				} else if ( p_base_gacha.price_type == DefineValues.inst.GachaPriceTypeCash ) {
					// 캐쉬 부족.
					if ( p_base_gacha.price > ret_user.dataValues.CASH )
						reject([ PacketRet.inst.retNotEnoughCash(), 'Need cash', p_base_gacha.price, 'Current cash', ret_user.dataValues.CASH ]);
				} else {
					reject([ PacketRet.inst.retFail(), 'Error gacha price type', p_base_gacha.price_type ]);
				}
			}

			resolve(free_pass);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var MakeGachaList = function(p_gacha_list, p_ret_hero_list, p_hero_summon_list, p_ack_packet) {
		return new Promise(function (resolve, reject) {
			let gacha_cnt = p_gacha_list.length;	// 배열에서 영웅소환권은 제외 한다.(소환은 따로 처리)

			console.log('Before gacha list');
			for ( let cnt = 0; cnt < p_gacha_list.length; ++cnt ) {
				console.log('%d item_id : %d, item_count : %d', cnt, p_gacha_list[cnt].item_id, p_gacha_list[cnt].item_count);
			}

			// 1. 가챠 목록 루프 - p_gacha_list.splice 를 사용하기 위해서 이렇게 처리 한다.
			while (gacha_cnt--) {
				console.log("%d ", gacha_cnt, p_gacha_list[gacha_cnt]);

				let base_item = BaseItemRe.inst.GetItem(p_gacha_list[gacha_cnt].item_id);
				if ( typeof base_item === 'undefined')
					reject ([ PacketRet.inst.retFail(), 'Error BaseItem', value.item_id ]);

				// 1-1. 영웅소환권 일때.
				if ( base_item.category1 == DefineValues.inst.FirstCategoryHero && base_item.category2 == DefineValues.inst.SecondCategorySummonHero ) {
					let is_owned = IsOwnedHero(base_item.hero_id, p_ret_hero_list);

					// 1-1. 보유 영웅 아니고, 소환 리스트에도 없다.
					if ( is_owned == false && p_hero_summon_list.indexOf(base_item.hero_id) == -1 ) {
						console.log('%d : %d 영웅소환권 유지 영웅 ID : %d', gacha_cnt, p_gacha_list[gacha_cnt].item_id, base_item.hero_id);
						// 영웅 소환 리스트에 등록
						p_hero_summon_list.push(base_item.hero_id);

						// 가챠 목록에서 삭제.(영웅 소환은 따로 만들어야 한다. RewardMgr.inst.GetReward에서는 영웅소환 처리 않함)
						p_gacha_list.splice(gacha_cnt, 1);
					} else {
						// 1-2. 나머지 경우는 영혼석으로 변경.
						let base_hero = BaseHeroRe.inst.GetHero(base_item.hero_id);
						if ( typeof base_hero === 'undefined')
							reject ([ PacketRet.inst.retFail(), 'Error BaseHero', base_item.hero_id ])

						let base_hero_evolution = BaseHeroEvolutionRe.inst.GetHeroEvolution(base_hero.evolution_step);
						if ( typeof base_hero_evolution === 'undefined' )
							reject ([ PacketRet.inst.retFail(), 'Error BaseHeroEvolution', base_hero.evolution_step ]);						

						p_gacha_list[gacha_cnt].item_id = base_hero.stone_id;
						p_gacha_list[gacha_cnt].item_count = base_hero_evolution.hero_stone_exchange;

						if ( is_owned == true )
							console.log('%d : %d 영웅석으로 변경(보유 영웅)', gacha_cnt, base_hero.stone_id);
						else
							console.log('%d : %d 영웅석으로 변경(소환목록)', gacha_cnt, base_hero.stone_id);
					}

					// packet - view hero summon
					p_ack_packet.gacha_view_info.hero_list.push(base_item.hero_id);
				} else {
					// 1-2. 일반 or 장비 아이템.
					let gacha_item = new PacketCommonData.RewardItem();
					gacha_item.item_id	= p_gacha_list[gacha_cnt].item_id;
					gacha_item.item_count= p_gacha_list[gacha_cnt].item_count;

					// packet - view item
					p_ack_packet.gacha_view_info.item_list.push(gacha_item);
				}
			}

			resolve();
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGacha = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGacha -', p_user.uuid, p_recv);

		let recv_gacha_id = parseInt(p_recv.gacha_id);

		// 1. 가챠 확인. 
		let base_gacha = BaseGachaRe.inst.GetBaseGacha(recv_gacha_id);
		if ( base_gacha == undefined ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Gacha Info In Base Gacha ID', recv_gacha_id);
			return;
		}

		let gacha_info;

		// Promise.all
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			SelectGacha(p_user.uuid, recv_gacha_id)
		])		
		.then(values => {
			// 1. 가챠 확인
			return IsFreePass(values, base_gacha)
			.then(p_free_pass => {
				let ret_gacha = values[1];

				// 2. 가챠 리스트 만들기
				gacha_info = GachaMgr.inst.GachaReward(base_gacha, ret_gacha.dataValues.TOTAL_GACHA_COUNT, p_free_pass);
				if ( typeof gacha_info === 'undefined' )
					throw([ PacketRet.inst.retFail(), 'Failed Make Gacha Info GachaID', recv_gacha_id ]);

				// 3. 가챠 리스트에 영웅소환권이 포함되어 있다면 보유 영웅을 확인 한다.(영혼석으로 변경해야 하기 때문에.)
				let hero_id_list = gacha_info.hero_summon_id_list;
				if ( hero_id_list.length > 0 ) {
					// console.log('hero_id_list', hero_id_list);
					return GetHeroList(values, p_user.uuid, hero_id_list);
				} else {
					return values;
				}
			})
			.catch(p_error => { throw (p_error); });
		})
		.then(values => {
			// console.log('values', values);
			let ret_hero_list = ( typeof values[2] === 'undefined') ? null : values[2];

			// console.log('ret_hero_list', ret_hero_list);
			let gacha_list = gacha_info.GetGachaList();
			let hero_summon_list = [];

			return MakeGachaList(gacha_list, ret_hero_list, hero_summon_list, p_ack_packet)
			.then(function() {
				console.log('After gacha list : %d', gacha_list.length);
				for ( let cnt = 0; cnt < gacha_list.length; ++cnt ) {
					console.log('%d item_id : %d, item_count : %d', cnt, gacha_list[cnt].item_id, gacha_list[cnt].item_count);
				}

				// 중복되는 보상 아이템을 처리 한다.(DB에서는 한 종류씩 처리 해야 한다.)
				let reward = RewardMgr.inst.GetReward(gacha_list);

				console.log('Reward list %d', reward.item_list.length);
				for ( let cnt = 0; cnt < reward.item_list.length; ++cnt ) {
					console.log('%d item_id : %d, item_count : %d', cnt, reward.item_list[cnt].item_id, reward.item_list[cnt].item_count);
				}

				console.log('After summon list %s', ( hero_summon_list.length == 0 ) ? 'is empty' : '' );
				for ( let cnt = 0; cnt < hero_summon_list.length; ++cnt ) {
					console.log('%d hero_id %d', cnt, hero_summon_list[cnt]);
				}

				return ProcessTransaction(values, gacha_info, reward.item_list, hero_summon_list);
			})
			.catch(p_error => { throw (p_error); });
		})
		.then(values => {
			// console.log('values', values);
			let ret_user = values[0];
			let ret_gacha = values[1];
			let ret_inventory = values[2];
			let ret_hero_id_list = values[3];

			// 1. 재화
			p_ack_packet.result_gold = ret_user.dataValues.GOLD;
			p_ack_packet.result_cash = ret_user.dataValues.CASH;

			// 2. 가챠 정보
			p_ack_packet.gacha_info.gacha_id = ret_gacha.dataValues.GACHA_ID;
			p_ack_packet.gacha_info.daily_gacha_count = ret_gacha.dataValues.DAILY_GACHA_COUNT;
			p_ack_packet.gacha_info.total_gacha_count = ret_gacha.dataValues.TOTAL_GACHA_COUNT;
			p_ack_packet.gacha_info.free_gacha_remain_time = 0;

			if ( base_gacha.daily_free_exec_count != 0 && ( base_gacha.daily_free_exec_count - ret_gacha.dataValues.DAILY_GACHA_COUNT > 0 )) {
				let temp_time = Timer.inst.GetDeltaTime(ret_gacha.dataValues.LAST_GACHA_DATE);
				if ( temp_time <= base_gacha.free_exec_delay_time_for_sec ) {
					p_ack_packet.gacha_info.free_gacha_remain_time = base_gacha.free_exec_delay_time_for_sec - temp_time;
				}
			}

			for ( let cnt = 0; cnt < ret_inventory.length; ++cnt ) {
				let result_item	= new PacketCommonData.Item();
				result_item.iuid		= ret_inventory[cnt].dataValues.IUID;
				result_item.item_id		= ret_inventory[cnt].dataValues.ITEM_ID;
				result_item.item_count	= ret_inventory[cnt].dataValues.ITEM_COUNT;

				// packet - item_list
				p_ack_packet.result_item_info.item_list.push(result_item);
			}

			for ( let cnt = 0; cnt < ret_hero_id_list.length; ++cnt ) {
				p_ack_packet.result_item_info.hero_list.push(ret_hero_id_list[cnt]);
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;