/********************************************************************
Title : SetGTTower
Date : 2017.03.21
Update : 2017.04.03
Writer : jongwook
Desc : Promise Set - 무한탑
********************************************************************/
var GTMgr = require('../GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var Timer = require('../../Utils/Timer.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 리스트 내용 삭제
	var DeleteList = function(p_ret_list, p_t) {
		return new Promise(function (resolve, reject) {
			Promise.all(p_ret_list.map(row => {
				// GT_INFINITY_TOWER_BATTLE_BOT update
				return row.updateAttributes({ EXIST_YN : false }, { transaction : p_t });
			}))
			.then(vlaues => {
				console.log('DeleteList');
				resolve();
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.UpdateTowerBattleFinish = function(p_t, p_ret_tower, p_battle_type, p_clear_grade) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_tower.dataValues.BATTLE_TYPE != p_battle_type )
				p_ret_tower['BATTLE_TYPE'] = p_battle_type;

			if ( p_ret_tower.dataValues.BATTLE_CLEAR_GRADE != p_clear_grade )
				p_ret_tower['BATTLE_CLEAR_GRADE'] = p_clear_grade;

			p_ret_tower['LAST_DATE'] = Timer.inst.GetNowByStrDate();

			// GT_INFINITY_TOWER_FLOOR update
			p_ret_tower.save({ transaction : p_t })
			.then(p_ret_tower_update => {
				console.log('SetTowerBattleFinish update', p_ret_tower_update.dataValues.UUID);
				resolve(p_ret_tower_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SetTowerBuffList = function(p_ret_tower, p_uuid, p_floor, p_floor_type, p_buff_list, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_tower == null ) {
				// GT_INFINITY_TOWER_FLOOR insert
				GTMgr.inst.GetGTInfinityTowerFloor().create({
					UUID		: p_uuid,
					FLOOR		: p_floor,
					FLOOR_TYPE	: p_floor_type,
					BUFF_ID_1	: ( typeof p_buff_list[0] !== 'undefined' ) ? parseInt(p_buff_list[0]) : 0,
					BUFF_ID_2	: ( typeof p_buff_list[1] !== 'undefined' ) ? parseInt(p_buff_list[1]) : 0,
					BUFF_ID_3	: ( typeof p_buff_list[2] !== 'undefined' ) ? parseInt(p_buff_list[2]) : 0,
					LAST_DATE	: Timer.inst.GetNowByStrDate(),
					REG_DATE	: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_insert => {
					console.log('SetTowerBuffList insert', p_uuid);
					resolve(p_ret_tower_insert);
				})
				.catch(p_error => { reject(p_error); });
			} else {
				// GT_INFINITY_TOWER_FLOOR update
				p_ret_tower.updateAttributes({
					BUFF_ID_1 : ( typeof p_buff_list[0] !== 'undefined' ) ? p_buff_list[0] : 0,
					BUFF_ID_2 : ( typeof p_buff_list[1] !== 'undefined' ) ? p_buff_list[1] : 0,
					BUFF_ID_3 : ( typeof p_buff_list[2] !== 'undefined' ) ? p_buff_list[2] : 0,
					LAST_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_update => {
					console.log('SetTowerBuffList update', p_uuid);
					resolve(p_ret_tower_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SetTowerBuyBuff = function(p_ret_tower, p_buff_slot_id, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_FLOOR update
			p_ret_tower.updateAttributes({
				BUY_BUFF_ID_1 : ( p_buff_slot_id == 1 ) ? p_ret_tower.dataValues.BUFF_ID_1 : p_ret_tower.dataValues.BUY_BUFF_ID_1,
				BUY_BUFF_ID_2 : ( p_buff_slot_id == 2 ) ? p_ret_tower.dataValues.BUFF_ID_2 : p_ret_tower.dataValues.BUY_BUFF_ID_2,
				BUY_BUFF_ID_3 : ( p_buff_slot_id == 3 ) ? p_ret_tower.dataValues.BUFF_ID_3 : p_ret_tower.dataValues.BUY_BUFF_ID_3,
				LAST_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_tower_update => {
				console.log('SetTowerBuyBuff update', p_ret_tower_update.dataValues.UUID);
				resolve(p_ret_tower_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SetTowerReward = function(p_ret_tower, p_uuid, p_floor, p_floor_type, p_reward_list, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_tower == null ) {
				// GT_INFINITY_TOWER_FLOOR insert
				GTMgr.inst.GetGTInfinityTowerFloor().create({
					UUID				: p_uuid,
					FLOOR				: p_floor,
					FLOOR_TYPE			: p_floor_type,
					REWARD_TYPE_1		: ( typeof p_reward_list[0] === 'undefined' ) ? 0 : p_reward_list[0].reward_type,
					REWARD_ITEM_ID_1	: ( typeof p_reward_list[0] === 'undefined' ) ? 0 : p_reward_list[0].reward_item_id,
					REWARD_COUNT_1		: ( typeof p_reward_list[0] === 'undefined' ) ? 0 : p_reward_list[0].reward_count,
					REWARD_TYPE_2		: ( typeof p_reward_list[1] === 'undefined' ) ? 0 : p_reward_list[1].reward_type,
					REWARD_ITEM_ID_2	: ( typeof p_reward_list[1] === 'undefined' ) ? 0 : p_reward_list[1].reward_item_id,
					REWARD_COUNT_2		: ( typeof p_reward_list[1] === 'undefined' ) ? 0 : p_reward_list[1].reward_count,
					REWARD_TYPE_3		: ( typeof p_reward_list[2] === 'undefined' ) ? 0 : p_reward_list[2].reward_type,
					REWARD_ITEM_ID_3	: ( typeof p_reward_list[2] === 'undefined' ) ? 0 : p_reward_list[2].reward_item_id,
					REWARD_COUNT_3		: ( typeof p_reward_list[2] === 'undefined' ) ? 0 : p_reward_list[2].reward_count,
					IS_REWARD_BOX_OPEN	: true,
					LAST_DATE			: Timer.inst.GetNowByStrDate(),
					REG_DATE			: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_insert => {
					console.log('SetTowerReward insert', p_ret_tower_insert.dataValues.UUID);
					resolve(p_ret_tower_insert);
				})
				.catch(p_error => { reject(p_error); });
			} else {
				// GT_INFINITY_TOWER_FLOOR update
				p_ret_tower.updateAttributes({
					REWARD_TYPE_1		: ( typeof p_reward_list[0] === 'undefined' ) ? 0 : p_reward_list[0].reward_type,
					REWARD_ITEM_ID_1	: ( typeof p_reward_list[0] === 'undefined' ) ? 0 : p_reward_list[0].reward_item_id,
					REWARD_COUNT_1		: ( typeof p_reward_list[0] === 'undefined' ) ? 0 : p_reward_list[0].reward_count,
					REWARD_TYPE_2		: ( typeof p_reward_list[1] === 'undefined' ) ? 0 : p_reward_list[1].reward_type,
					REWARD_ITEM_ID_2	: ( typeof p_reward_list[1] === 'undefined' ) ? 0 : p_reward_list[1].reward_item_id,
					REWARD_COUNT_2		: ( typeof p_reward_list[1] === 'undefined' ) ? 0 : p_reward_list[1].reward_count,
					REWARD_TYPE_3		: ( typeof p_reward_list[2] === 'undefined' ) ? 0 : p_reward_list[2].reward_type,
					REWARD_ITEM_ID_3	: ( typeof p_reward_list[2] === 'undefined' ) ? 0 : p_reward_list[2].reward_item_id,
					REWARD_COUNT_3		: ( typeof p_reward_list[2] === 'undefined' ) ? 0 : p_reward_list[2].reward_count,
					IS_REWARD_BOX_OPEN	: true,
					LAST_DATE			: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_update => {
					console.log('SetTowerReward update', p_ret_tower_update.dataValues.UUID);
					resolve(p_ret_tower_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SetTowerCashReward = function(p_ret_tower, p_buy_count, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_FLOOR update
			p_ret_tower.updateAttributes({
				CASH_REWARD_BOX_COUNT	: p_buy_count,
				LAST_DATE				: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_tower_update => {
				console.log('SetTowerCashReward update', p_ret_tower_update.dataValues.UUID);
				resolve(p_ret_tower_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.InsertOrUpdateTowerMaze = function(p_t, p_uuid, p_ret_tower, p_floor, p_floor_type, p_battle_type, p_ticket, p_score, p_secret_maze_buff_id_list, p_maze_type, p_battle_id) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_tower == null ) {
				// GT_INFINITY_TOWER_FLOOR insert
				GTMgr.inst.GetGTInfinityTowerFloor().create({
					UUID				: p_uuid,
					FLOOR				: p_floor,
					FLOOR_TYPE			: p_floor_type,
					BATTLE_TYPE			: p_battle_type,
					REWARD_TICKET		: p_ticket,
					REWARD_SCORE		: p_score,
					BUFF_ID_1			: ( typeof p_secret_maze_buff_id_list[0] !== 'undefined' ) ? parseInt(p_secret_maze_buff_id_list[0]) : 0,
					BUFF_ID_2			: ( typeof p_secret_maze_buff_id_list[1] !== 'undefined' ) ? parseInt(p_secret_maze_buff_id_list[1]) : 0,
					BUFF_ID_3			: ( typeof p_secret_maze_buff_id_list[2] !== 'undefined' ) ? parseInt(p_secret_maze_buff_id_list[2]) : 0,
					SECRET_MAZE_TYPE	: p_maze_type,
					SECRET_MAZE_BATTLE_ID: p_battle_id,
					LAST_DATE			: Timer.inst.GetNowByStrDate(),
					REG_DATE			: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_insert => {
					console.log('SetTowerMaze insert', p_ret_tower_insert.dataValues.UUID);
					resolve(p_ret_tower_insert);
				})
				.catch(p_error => { reject(p_error); });
			} else {
				// GT_INFINITY_TOWER_FLOOR update
				p_ret_tower.updateAttributes({
					SECRET_MAZE_TYPE	: p_maze_type,
					SECRET_MAZE_BATTLE_ID: p_battle_id,
					LAST_DATE			: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_update => {
					console.log('SetTowerMaze update', p_ret_tower_update.dataValues.UUID);
					resolve(p_ret_tower_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 LAST_DATE 갱신
	inst.InsertOrUpdateTowerUser = function(p_t, p_uuid, p_ret_tower_user, p_floor) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_tower_user == null ) {
				// GT_INFINITY_TOWER_USER insert
				GTMgr.inst.GetGTInfinityTowerUser().create({
					UUID		: p_uuid,
					TODAY_FLOOR	: p_floor,
					LAST_FLOOR	: 0,
					BEST_FLOOR	: 0,
					LAST_DATE	: Timer.inst.GetNowByStrDate(),
					REG_DATE	: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_user_create => {
					console.log('InsertOrUpdateTowerUser - insert');
					resolve(p_ret_user_create);
				})
				.catch(p_error => { reject(p_error); });
			} else {
				if ( p_ret_tower_user.dataValues.TODAY_FLOOR != p_floor )
					p_ret_tower_user['TODAY_FLOOR'] = p_floor;

				p_ret_tower_user['LAST_DATE'] = Timer.inst.GetNowByStrDate();

				// GT_INFINITY_TOWER_USER update
				p_ret_tower_user.save({ transaction : p_t })
				.then(p_ret_user_update => {
					console.log('InsertOrUpdateTowerUser - update');
					resolve(p_ret_user_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectBattleBot = function(p_uuid, p_bot_icon, p_bot_rank, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_BATTLE_BOT select
			GTMgr.inst.GetGTInfinityTowerBattleBot().find({
				where : { UUID : p_uuid, ICON_ID : p_bot_icon, BOT_RANK : p_bot_rank }
			}, { transaction : p_t })
			.then(p_ret_battle_bot => {
				console.log('SelectBattleBot bot_rank', p_bot_rank);
				resolve(p_ret_battle_bot);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertBattleBot = function(p_uuid, p_bot_icon, p_bot_name, p_bot_rank, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_BATTLE_BOT insert
			GTMgr.inst.GetGTInfinityTowerBattleBot().create({ 
				UUID		: p_uuid,
				ICON_ID		: p_bot_icon,
				BOT_NAME	: p_bot_name,
				BOT_RANK	: p_bot_rank,
				LAST_DATE	: Timer.inst.GetNowByStrDate(),
				REG_DATE	: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_battle_bot_insert => {
				console.log('InsertBattleBot bot_rank', p_bot_rank);
				resolve(p_ret_battle_bot_insert);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.InsertOrUpdateTowerBattleBot = function(p_ret_bot_list, p_uuid, p_battle_bot_list, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_battle_bot_list == null ) {
				resolve();
			} else {
				// 1. 모든 봇 정보 delete
				// 2. 봇 리스트 돌면서 있으면 update, 없으면 insert
				DeleteList(p_ret_bot_list, p_t)
				.then(function() {
					return Promise.all(p_battle_bot_list.map(bot => {
						return SelectBattleBot(p_uuid, bot.icon_id, bot.bot_rank, p_t)
						.then(p_ret_battle_bot => {
							if ( p_ret_battle_bot == null ) {
								return InsertBattleBot(p_uuid, bot.icon_id, bot.bot_name, bot.bot_rank, p_t);
							} else {
								console.log('InsertOrUpdateTowerBattleBot update bot_rank', bot.bot_rank);
								return p_ret_battle_bot.updateAttributes({ EXIST_YN : true, LAST_DATE : Timer.inst.GetNowByStrDate() }, { transaction : p_t });
							}
						})
						.catch(p_error => { reject(p_error); });
					}))
					.then(values => { resolve(values); })
					.catch(p_error => { reject(p_error); });
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectBattleBotHero = function(p_uuid, p_hero_id, p_hero_level, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_BATTLE_BOT_HERO select
			GTMgr.inst.GetGTInfinityTowerBattleBotHero().find({
				where : { UUID : p_uuid, HERO_ID : p_hero_id, HERO_LEVEL : p_hero_level }
			}, { transaction : p_t })
			.then(p_ret_battle_bot_hero => {
				// console.log('SelectBattleBotHero hero_id', p_hero_id);
				resolve(p_ret_battle_bot_hero);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertBattleBotHero = function(p_uuid, p_bot_hero, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_BATTLE_BOT_HERO insert
			GTMgr.inst.GetGTInfinityTowerBattleBotHero().create({ 
				UUID			: p_uuid,
				HERO_TYPE		: 'BASE',
				HERO_ID			: p_bot_hero.hero_id,
				HERO_HP			: p_bot_hero.hero_hp,
				HERO_LEVEL		: p_bot_hero.hero_level,
				REINFORCE_STEP	: p_bot_hero.promotion_step,
				EVOLUTION_STEP	: p_bot_hero.evolution_step,
				SLOT_NUM		: p_bot_hero.slot_num,
				LAST_DATE		: Timer.inst.GetNowByStrDate(),
				REG_DATE		: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_battle_bot_hero_insert => {
				// console.log('InsertBattleBotHero hero_id', p_ret_battle_bot_hero_insert.dataValues.HERO_ID);
				resolve(p_ret_battle_bot_hero_insert);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateBattleBotHero = function(p_ret_bot_hero, p_bot_hero, p_t) {
		return new Promise(function (resolve, reject) {
			return p_ret_bot_hero.updateAttributes({
				EXIST_YN 	: true,
				HERO_HP		: p_bot_hero.hero_hp,
				SLOT_NUM	: p_bot_hero.slot_num,
				LAST_DATE	: Timer.inst.GetNowByStrDate(),
			}, { transaction : p_t })
			.then(p_ret_bot_hero_update => {
				// console.log('UpdateBattleBotHero hero_id', p_ret_bot_hero_update.dataValues.HERO_ID);
				resolve(p_ret_bot_hero_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.InsertOrUpdateTowerBattleBotHero = function(p_t, p_ret_bot_hero_list, p_uuid, p_bot_hero_list) {
		return new Promise(function (resolve, reject) {
			if ( p_bot_hero_list == null ) {
				resolve();
			} else {
				// 1. 모든 봇 정보 delete
				// 2. 봇 리스트 돌면서 있으면 update, 없으면 insert
				DeleteList(p_ret_bot_hero_list, p_t)
				.then(function() {
					return Promise.all(p_bot_hero_list.map(bot_hero => {
						return SelectBattleBotHero(p_uuid, bot_hero.hero_id, bot_hero.hero_level, p_t)
						.then(p_ret_battle_bot_hero => {
							if ( p_ret_battle_bot_hero == null ) {
								return InsertBattleBotHero(p_uuid, bot_hero, p_t);
							} else {
								return UpdateBattleBotHero(p_ret_battle_bot_hero, bot_hero, p_t);
							}
						})
						.catch(p_error => { reject(p_error); });
					}))
					.then(values => { resolve(values); })
					.catch(p_error => { reject(p_error); });
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.UpdateTowerUserBattleFinish = function(p_t, p_ret_tower_user, p_today_ticket, p_today_score, p_accum_score, p_rank_score) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_USER update
			p_ret_tower_user.updateAttributes({
				TODAY_TICKET		: p_today_ticket,
				TODAY_SCORE			: p_today_score,
				ACCUM_SCORE			: p_accum_score,
				TODAY_RANK_SCORE	: p_rank_score,
				LAST_DATE	: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_user_update => {
				console.log('SetTowerUserBattleFinish - update');
				resolve(p_ret_user_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅의 EVOLUSTION_STEP이 필요
	var SelectUserHero = function(p_uuid, p_hero_id, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_HERO select
			GTMgr.inst.GetGTHero().find({
				where : { UUID : p_uuid, HERO_ID : p_hero_id, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_hero => {
				// console.log('SelectUserHero hero_id', p_hero_id);
				resolve(p_ret_hero);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	var SelectTowerHero = function(p_uuid, p_hero_id, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_BATTLE_BOT_HERO select
			GTMgr.inst.GetGTInfinityTowerHero().find({
				where : { UUID : p_uuid, HERO_ID : p_hero_id }
			}, { transaction : p_t })
			.then(p_ret_tower_hero => {
				// console.log('SelectTowerHero hero_id', p_hero_id);
				resolve(p_ret_tower_hero);
			})
			.catch(p_error => { reject(p_error); });
		});
	}
	
	var InsertTowerHero = function(p_uuid, p_hero, p_evolution_step, p_promotion_step, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_BATTLE_BOT_HERO insert
			GTMgr.inst.GetGTInfinityTowerHero().create({ 
				UUID			: p_uuid,
				HERO_ID			: p_hero.hero_id,
				REINFORCE_STEP	: p_promotion_step,
				EVOLUTION_STEP	: p_evolution_step,
				HP				: p_hero.hero_hp,
				LAST_DATE		: Timer.inst.GetNowByStrDate(),
				REG_DATE		: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_tower_hero_insert => {
				// console.log('InsertTowerHero hero_id', p_ret_tower_hero_insert.dataValues.HERO_ID);
				resolve(p_ret_tower_hero_insert);
			})
			.catch(p_error => { reject(p_error); });
		})
		.catch(p_error => { throw (p_error); });
	}

	var UpdateTowerHero = function(p_ret_hero, p_hero, p_evolution_step, p_promotion_step, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_BATTLE_BOT_HERO update
			return p_ret_hero.updateAttributes({
				REINFORCE_STEP	: p_promotion_step,
				EVOLUTION_STEP	: p_evolution_step,
				HP				: p_hero.hero_hp,
				LAST_DATE		: Timer.inst.GetNowByStrDate(),
				EXIST_YN 		: true
			}, { transaction : p_t })
			.then(p_ret_bot_hero_update => {
				// console.log('UpdateTowerHero hero_id', p_ret_bot_hero_update.dataValues.HERO_ID);
				resolve(p_ret_bot_hero_update);
			})
			.catch(p_error => { reject(p_error); });
		})
		.catch(p_error => {
			throw (p_error);
		});
	}

	inst.SetTowerBattleHero = function(p_uuid, p_hero_list, p_t) {
		return new Promise(function (resolve, reject) {
			// Promise.all GO!
			return Promise.all(p_hero_list.map(hero => {
				return new Promise(function (resolve, reject) {
					// Promise.all GO!
					return Promise.all([
						SelectTowerHero(p_uuid, hero.hero_id, p_t),
						SelectUserHero(p_uuid, hero.hero_id, p_t)
					])
					.then(values => {
						let ret_tower_hero = values[0];
						let ret_user_hero = values[1];

						// console.log('ret_user_hero', ret_user_hero);
						if ( ret_user_hero == null ) {
							reject([ PacketRet.inst.retNotExistHeroInUser(), 'Not hero in GT_HERO' ]);
						} else {
							let evolution_step = ret_user_hero.dataValues.EVOLUTION_STEP;
							let promotion_step = ret_user_hero.dataValues.REINFORCE_STEP;

							if ( ret_tower_hero == null ) {
								resolve(InsertTowerHero(p_uuid, hero, evolution_step, promotion_step, p_t));
							} else {
								resolve(UpdateTowerHero(ret_tower_hero, hero, evolution_step, promotion_step, p_t));
							}
						}
					})
					.catch(p_error => { reject(p_error); });
				});
			}))
			.then(values => {
				resolve(values);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;