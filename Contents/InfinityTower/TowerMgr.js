/********************************************************************
Title : TowerMgr
Date : 2016.04.08
Update : 2016.11.28
Desc : 무한탑 매니저
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');
var MailMgr = require('../Mail/MailMgr.js');
var DailyContentsMgr = require('../DailyContents/DailyContentsMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender	= require('../../App/Sender.js');
var Timer 	= require('../../Utils/Timer.js');

var moment = require('moment');

(function (exports) {
	// private 변수
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 UPDATE_DATE 갱신
	inst.UpdateTowerUser = function(p_user, p_floor) {
		// GT_INFINITY_TOWER_USER select
		GTMgr.inst.GetGTInfinityTowerUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_tower_user) {
			var str_now = Timer.inst.GetNowByStrDate();

			if ( p_ret_tower_user == null ) {
				// GT_INFINITY_TOWER_USER insert
				GTMgr.inst.GetGTInfinityTowerUser().create({
					UUID		: p_user.uuid,
					TODAY_FLOOR	: p_floor,
					LAST_FLOOR	: 0,
					BEST_FLOOR	: 0,
					UPDATE_DATE	: str_now,
					REG_DATE	: str_now
				})
				.then(function (p_ret_create) { 
					logger.info('UpdateTowerUser - Create Tower User', p_ret_create.UUID, 'floor', p_ret_create.dataValues.TODAY_FLOOR, 'last_date', p_ret_create.dataValues.UPDATE_DATE);
				})
				.catch(function (p_error) {
					logger.error(p_error, 'Error UpdateTowerUser - 3');
				});
			} else {
				// GT_INFINITY_TOWER_USER update
				p_ret_tower_user.updateAttributes({
					TODAY_FLOOR	: p_floor,
					UPDATE_DATE	: str_now
				})
				.then(function (p_ret_update) {
					logger.info('UpdateTowerUser - Update Tower User', p_ret_update.dataValues.UUID, 'last_date', p_ret_update.dataValues.UPDATE_DATE);
				})
				.catch(function (p_error) {
					logger.error(p_error, 'Error UpdateTowerUser - 2');
				});
			}
		})
		.catch(function (p_error) {
			logger.error(p_error, 'Error UpdateTowerUser - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 정보 저장
	inst.SaveTowerHero = function(p_uuid, p_hero_list) {
		for ( var cnt = 0; cnt < p_hero_list.length; ++cnt ) {
			(function (cnt) {
				if ( typeof p_hero_list[cnt] !== 'undefined' ) {
					var hero_id				= p_hero_list[cnt].hero_id;
					var hero_hp				= p_hero_list[cnt].hero_hp;
					var hero_skill_gauge	= p_hero_list[cnt].hero_skill_gauge;
					var hero_tag_gauge		= p_hero_list[cnt].hero_tag_gauge;
					var hero_support_gauge	= p_hero_list[cnt].hero_support_gauge;

					// GT_INFINITY_TOWER_HERO select
					GTMgr.inst.GetGTInfinityTowerHero().find({
						where : { UUID : p_uuid, HERO_ID : hero_id }
					})
					.then(function (p_ret_find_hero) {
						var str_now = Timer.inst.GetNowByStrDate();

						if ( p_ret_find_hero == null ) {
							// GT_INFINITY_TOWER_HERO insert
							GTMgr.inst.GetGTInfinityTowerHero().create({ 
								UUID				: p_uuid,
								HERO_ID				: hero_id,
								HERO_HP				: hero_hp,
								HERO_SKILL_GAUGE	: hero_skill_gauge,
								HERO_TAG_GAUGE		: hero_tag_gauge,
								HERO_SUPPORT_GAUGE	: hero_support_gauge,
								UPDATE_DATE			: str_now,
								REG_DATE			: str_now
							})
							.then(function (p_ret_create_hero) {
								// console.log('p_ret_create_hero', p_ret_create_hero);
								console.log('SaveTowerHero - Create Tower Hero. Hero ID', p_ret_create_hero.dataValues.HERO_ID);
							})
							.catch(function (p_error) {
								logger.error(p_error, 'Error SaveTowerHero - 3');
							});
						} else {
							// GT_INFINITY_TOWER_HERO insert
							p_ret_find_hero.updateAttributes({
								HERO_HP				: hero_hp,
								HERO_SKILL_GAUGE	: hero_skill_gauge,
								HERO_TAG_GAUGE		: hero_tag_gauge,
								HERO_SUPPORT_GAUGE	: hero_support_gauge,
								UPDATE_DATE			: str_now
							})
							.then(function (p_ret_update_hero) {
								console.log('SaveTowerHero - Update Tower Hero. Hero ID', p_ret_find_hero.dataValues.HERO_ID);
								// console.log('p_ret_update_hero', p_ret_update_hero);
							})
							.catch(function (p_error) {
								logger.error(p_error, 'Error SaveTowerHero - 2');
							});
						}
					})
					.catch(function (p_error) {
						logger.error(p_error, 'Error SaveTowerHero - 1');
					});
				}
			})(cnt);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	// 배틀 봇 영웅 정보
	inst.SaveTowerBattleBotHero = function(p_user, p_battle_bot_hero_list, p_battle_bot_tag_hero_list) {
		// GT_INFINITY_TOWER_BATTLE_BOT_HERO select
		GTMgr.inst.GetGTInfinityTowerBattleBotHero().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_battle_bot) {
			// console.log('p_ret_battle_bot', p_ret_battle_bot);
			if ( Object.keys(p_ret_battle_bot).length <= 0 ) {
				if ( p_battle_bot_hero_list != null && p_battle_bot_tag_hero_list != null ) {
					CreateBattleBotHero(p_user, p_battle_bot_hero_list, p_battle_bot_tag_hero_list);
				}
			} else {
				// GT_INFINITY_TOWER_BATTLE_BOT_HERO delete
				GTMgr.inst.GetGTInfinityTowerBattleBotHero().destroy({ 
					UUID : p_user.uuid, EXIST_YN : true
				})
				.then(function (p_ret_delete) {
					if ( p_battle_bot_hero_list != null && p_battle_bot_tag_hero_list != null ) {
						CreateBattleBotHero(p_user, p_battle_bot_hero_list, p_battle_bot_tag_hero_list);
					}
				})
				.catch(function (p_error) {
					logger.error(p_error, 'Error SaveTowerBattleBotHero - 2');
				});
			}
		})
		.catch(function (p_error) {
			logger.error(p_error, 'Error SaveTowerBattleBotHero - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 배틀 봇 생성 - 태그 영웅은 안만들어도 되나?
	var CreateBattleBotHero = function(p_user, p_battle_bot_hero_list, p_battle_bot_tag_hero_list) {
		var str_now = Timer.inst.GetNowByStrDate();

		// Base slot
		for ( var cnt = 0; cnt < p_battle_bot_hero_list.length; ++cnt ) {
			if ( typeof p_battle_bot_hero_list[cnt] !== 'undefined' ) {
				// GT_INFINITY_TOWER_BATTLE_BOT_HERO insert
				GTMgr.inst.GetGTInfinityTowerBattleBotHero().create({ 
					UUID				: p_user.uuid,
					HERO_TYPE			: 'BASE',
					HERO_ID				: p_battle_bot_hero_list[cnt].hero_id,
					HERO_HP				: p_battle_bot_hero_list[cnt].hero_hp,
					HERO_LEVEL			: p_battle_bot_hero_list[cnt].hero_level,
					REINFORCE_STEP		: p_battle_bot_hero_list[cnt].promotion_step,
					EVOLUTION_STEP		: p_battle_bot_hero_list[cnt].evolution_step,
					HERO_SKILL_GAUGE	: p_battle_bot_hero_list[cnt].hero_skill_gauge,
					HERO_TAG_GAUGE		: p_battle_bot_hero_list[cnt].hero_tag_gauge,
					HERO_SUPPORT_GAUGE	: p_battle_bot_hero_list[cnt].hero_support_gauge,
					SLOT_NUM			: p_battle_bot_hero_list[cnt].slot_num,
					UPDATE_DATE			: str_now,
					REG_DATE			: str_now
				})
				.then(function (p_ret_create_bot_hero) {
					// console.log('p_ret_create_bot_hero', p_ret_create_bot_hero);
					console.log('UUID : %d, CreateBattleBotHero - Create Battle Hero Bot. Hero ID', p_user.uuid, p_ret_create_bot_hero.dataValues.HERO_ID);
				})
				.catch(function (p_error) {
					logger.error(p_error, 'Error CreateBattleBotHero');
				});
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	// 배틀 봇 정보
	inst.SaveTowerBattleBot = function(p_user, p_bot_list) {
		// GT_INFINITY_TOWER_BATTLE_BOT select
		GTMgr.inst.GetGTInfinityTowerBattleBot().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_battle_bot) {
			// console.log('p_ret_battle_bot', p_ret_battle_bot);
			if ( p_ret_battle_bot.length == 0 ) {
				CreateTowerBattleBot(p_user, p_bot_list);
			} else {
				// GT_INFINITY_TOWER_BATTLE_BOT delete
				GTMgr.inst.GetGTInfinityTowerBattleBot().destroy(
					{ UUID : p_user.uuid, EXIST_YN : true }
				)
				.then(function (p_ret_delete) {
					CreateTowerBattleBot(p_user, p_bot_list);
				})
				.catch(function (p_error) {
					logger.error(p_error, 'Error SaveTowerBattleBot - 2');
				})
			}
		})
		.catch(function (p_error) {
			logger.error(p_error, 'Error SaveTowerBattleBot - 1');
		});
	}

	// 배틀 봇 생성
	var CreateTowerBattleBot = function(p_user, p_bot_list) {
		var str_now = Timer.inst.GetNowByStrDate();

		for ( var cnt = 0; cnt < p_bot_list.length; ++cnt ) {
			if ( typeof p_bot_list[cnt] !== 'undefined' ) {
				// GT_INFINITY_TOWER_BATTLE_BOT insert
				GTMgr.inst.GetGTInfinityTowerBattleBot().create({ 
					UUID		: p_user.uuid,
					ICON_ID		: p_bot_list[cnt].icon_id,
					BOT_NAME	: p_bot_list[cnt].bot_name,
					BOT_RANK	: p_bot_list[cnt].bot_rank,
					UPDATE_DATE	: str_now,
					REG_DATE	: str_now
				})
				.then(function (p_ret_create_bot) {
					// console.log('p_ret_create_bot', p_ret_create_bot);
					console.log('UUID : %d, Create Tower Battle Bot', p_user.uuid, p_ret_create_bot.dataValues.ICON_ID);
				})
				.catch(function (p_error) {
					logger.error('error GTMgr.inst.GetGTInfinityTowerBattleBot().create', p_error);
				});
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 배틀 후 팀 저장
	inst.SaveTeam = function(p_uuid, p_floor, p_rank_score) {
		// GT_INFINITY_TOWER_RECORD select
		GTMgr.inst.GetGTInfinityTowerTeam().find({
			where : { UUID : p_uuid, EXIST_YN : true }
		})
		.then(function (p_ret_tower_team) {
			// console.log('p_ret_tower_team', p_ret_tower_team);			
			if ( p_ret_tower_team == null ) {
				var str_now = Timer.inst.GetNowByStrDate();

				// GT_INFINITY_TOWER_RECORD insert
				GTMgr.inst.GetGTInfinityTowerTeam().create({
					UUID : p_uuid,
					REG_DATE : str_now
				})
				.then(function (p_ret_tower_team_create) {
					// logger.info('CreateSaveTeam', p_ret_tower_team_create.dataValues);
					UpdateTeamProcess(p_uuid, p_ret_tower_team_create);
				})
				.catch(function (p_error) {
					logger.error(p_error, 'Error SaveTeam - 2');
				});
			} else {
				UpdateTeamProcess(p_uuid, p_ret_tower_team);
			}
		})
		.catch(function (p_error) {
			logger.error(p_error, 'Error SaveTeam - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 배틀 후 팀 영웅 정보 갱신
	var UpdateTeamProcess = function(p_uuid, p_ret_tower_team) {
		// GT_TEAM select
		 GTMgr.inst.GetGTTeam().find({
			where : { UUID : p_uuid, TEAM_ID : DefineValues.inst.GameModeInfinityTower, EXIST_YN : true }
		})
		.then(function (p_ret_team) {
			// console.log('p_ret_team', p_ret_team.dataValues);
			for ( var cnt = 0; cnt < DefineValues.inst.MaxTeamSlot; ++cnt ) {
				(function (cnt) {
					var column	= 'SLOT' + (cnt + 1);

					// GT_HERO select
					GTMgr.inst.GetGTHero().find({
						where : { UUID : p_uuid, HERO_ID : p_ret_team.dataValues[column] }
					})
					.then(function (p_ret_hero) {
						// console.log('p_ret_hero', (p_ret_hero != null) ? p_ret_hero.dataValues : null);
						p_ret_tower_team[column + '_HERO_ID']		= ( p_ret_hero != null ) ? p_ret_hero.dataValues.HERO_ID : 0;
						p_ret_tower_team[column + '_HERO_LEVEL']	= ( p_ret_hero != null ) ? p_ret_hero.dataValues.HERO_LEVEL : 0;
						p_ret_tower_team[column + '_REINFORCE_STEP']= ( p_ret_hero != null ) ? p_ret_hero.dataValues.REINFORCE_STEP : 0;
						p_ret_tower_team[column + '_EVOLUTION_STEP']= ( p_ret_hero != null ) ? p_ret_hero.dataValues.EVOLUTION_STEP : 0;

						// 마지막에 update
						if ( cnt == DefineValues.inst.MaxTeamSlot - 1 ) {
							// GT_INFINITY_TOWER_RECORD update
							p_ret_tower_team.save()
							.then(function (p_ret_update) {
								// console.log('p_ret_update', p_ret_update.dataValues);
							})
							.catch(function (p_error) {
								logger.error(p_error, 'Error UpdateTeamProcess - 3');
							});
						}
					})
					.catch(function (p_error) {
						logger.error(p_error, 'Error UpdateTeamProcess - 2');
					});
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error(p_error, 'Error UpdateTeamProcess - 1');
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;