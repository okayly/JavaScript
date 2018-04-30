/********************************************************************
Title : BTMgr
Date : 2015.10.15
Update : 2017.04.07
Desc : Base Data Controller
// sequelize options
 - type : data type
 - allowNull : is allow null. if allow is ture, then false.
 - unique : Unique value is true, then false
 - primaryKey : if use key 'true'
 - autoIncrement : auto filed value increment

writer: dongsu
********************************************************************/
var BT_Commons			= require('./BTLoad/BT_Commons.js');
var BT_Heroes			= require('./BTLoad/BT_Heroes.js');
var BT_Exp				= require('./BTLoad/BT_Exp.js');
var BT_Stages			= require('./BTLoad/BT_Stages.js');
var BT_Items			= require('./BTLoad/BT_Items.js');
var BT_ItemEquip		= require('./BTLoad/BT_ItemEquip.js');
var BT_ItemReinforceCost= require('./BTLoad/BT_ItemReinforceCost.js');
var BT_TownDrop			= require('./BTLoad/BT_TownDrop.js');
var BT_Vip				= require('./BTLoad/BT_Vip.js');
var BT_Buy				= require('./BTLoad/BT_Buy.js');
var BT_BuyCount			= require('./BTLoad/BT_BuyCount.js');
var BT_Shop				= require('./BTLoad/BT_Shop.js');
var BT_Gacha			= require('./BTLoad/BT_Gacha.js');
var BT_RandomBox		= require('./BTLoad/BT_RandomBox.js');
var BT_WeeklyDungeon 	= require('./BTLoad/BT_WeeklyDungeon.js');
var BT_Attend			= require('./BTLoad/BT_Attend.js');
var BT_AccountBuff		= require('./BTLoad/BT_AccountBuff.js');
var BT_Mission			= require('./BTLoad/BT_Mission.js');
var BT_Guild			= require('./BTLoad/BT_Guild.js');
var BT_Tower			= require('./BTLoad/BT_Tower.js');
var BT_DailyContents	= require('./BTLoad/BT_DailyContents.js');
var BT_DarkDungeon		= require('./BTLoad/BT_DarkDungeon.js');
var BT_Army				= require('./BTLoad/BT_Army.js');
var BT_LevelUnlock		= require('./BTLoad/BT_LevelUnlock.js');
var BT_Skill			= require('./BTLoad/BT_Skill.js');
var BT_PVP				= require('./BTLoad/BT_PVP.js');

var fp = require('fs');

(function(exports) {

	// private 변수
	var current_async_num = 0;

	var bt_objs = {}
	  , bt_count = 0;

	// public - instance
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Initialize = function(sequelize) {
		var path = './DB/BTInsert/';
		fp.readdir(path, function (err, files) {
			if (err) {
				console.log(err);
			} else {
				var number = 1, bt_temp = {};

				bt_count = files.length / 2;

				for ( var i in files ) {
					var file = files[i];
					var bt_name = file.substring(0, file.indexOf('.'));
					var key = bt_name.toLowerCase();

					if ( !(key in bt_temp) ) {
						(function (key) {
							logger.debug('*** %s Initialize - %d ****', bt_name, number);

							var js_path = '../DB/BTInsert/' + bt_name + '.js';
							var json_path = './DB/BTInsert/' + bt_name + '.json';

							// console.log('js_path -', js_path);

							bt_objs[key] = require(js_path);
							bt_objs[key].inst[bt_name](sequelize, json_path, inst.CheckAsyncComplate);

							bt_temp[key] = bt_name;
							number++;
						})(key);
					}
				}
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.CheckAsyncComplate = function(bt_name) {
		// console.log('CheckAsyncComplate !! %d - %d: %s', bt_count, current_async_num + 1, bt_name);

		current_async_num = current_async_num + 1;
		if ( bt_count == current_async_num ) {
			console.log('bt_count : %d == current_async_num : %d', bt_count, current_async_num);
			inst.LoadBTInfo();
		}
	}	

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadBTInfo = function() {
		// load .. 순서 중요.
		LoadBTCommon()
		.then(function () {
			logger.debug('=== Finish LoadBTCommon ===');

			return LoadBTItem();
		})
		.then(function () {
			// LoadBTItemEquip();
			// LoadBTItemReinforceCost();
			// LoadBTHero();
			// LoadBTExp();
			// LoadBTSenarioChapter();
			// LoadBTHeroReinforce();
			// LoadBTHeroEvolution();
			// LoadBTTownDropGroup();
			// LoadBTVip();
			// LoadBTBuy();
			// LoadBTBuyCount();
			// LoadBTShop();
			// LoadBTGacha();
			// LoadBTRandomBox();
			// LoadBTAttend();
			// LoadBTMission();
			// LoadBTAccountBuff();
			// LoadBTGuild();
			// LoadBTInfinityTower();
			// LoadBTDailyContents();
			// LoadBTWeeklyDungeon();
			// LoadBTDarkDungeon();
			// LoadBTArmy();
			// LoadBTLevelUnlock();
			// LoadBTSkill();
			// LoadBTPVP();
		})
		.catch(p_error =>{
			logger.error('Error LoadBTInfo', p_error);
		});		
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTCommon = function() {
		return BT_Commons.inst.LoadBTCommon(bt_objs['bt_common'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTHero = function() {
		BT_Heroes.inst.LoadHero(bt_objs['bt_hero_base'].inst.GetBT());
	}

	var LoadBTHeroReinforce = function() {
		BT_Heroes.inst.LoadHeroReinforce(bt_objs['bt_hero_reinforce'].inst.GetBT());
	}

	var LoadBTHeroEvolution = function() {
		BT_Heroes.inst.LoadHeroEvolution(bt_objs['bt_hero_evolution'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTExp = function() {
		BT_Exp.inst.LoadExp(bt_objs['bt_exp'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTSenarioChapter = function() {
		BT_Stages.inst.LoadSenarioChapter(bt_objs['bt_chapter_base'].inst.GetBT(), bt_objs['bt_stage_base'].inst.GetBT());
		BT_Guild.inst.LoadGuildRaidChapter(bt_objs['bt_chapter_base'].inst.GetBT(), bt_objs['bt_stage_base'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTWeeklyDungeon = function() {
		BT_WeeklyDungeon.inst.LoadWeeklyDungeon(bt_objs['bt_weekly_dungeon'].inst.GetBT(), bt_objs['bt_weekly_dungeon'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTItem = function() {
		return Promise.all([
			BT_Items.inst.LoadItem(bt_objs['bt_item_base'].inst.GetBT()),
			BT_Items.inst.LoadItemEvolution(bt_objs['bt_item_evolution'].inst.GetBT())
		]);
	}
	
	//------------------------------------------------------------------------------------------------------------------
	var LoadBTItemEquip = function() {
		// 장착아이템 스테이터스
		BT_ItemEquip.inst.LoadItemEquipStatus(bt_objs['bt_item_equip_status'].inst.GetBT());

		// 장착 아이템 옵션
		BT_ItemEquip.inst.LoadItemEquipOption(bt_objs['bt_item_equip_option'].inst.GetBT());
	}

	var LoadBTItemReinforceCost = function() {
		BT_ItemReinforceCost.inst.LoadItemReinforceCost(bt_objs['bt_item_reinforce_cost'].inst.GetBT());		
	}
	
	//------------------------------------------------------------------------------------------------------------------
	var LoadBTTownDropGroup = function() {
		BT_TownDrop.inst.LoadStageDropGroup(bt_objs["bt_stage_dropgroup_base"].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTVip = function() {
		BT_Vip.inst.LoadVip(bt_objs['bt_vip'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTBuy = function() {
		BT_Buy.inst.LoadBuyGold(bt_objs['bt_buy_gold'].inst.GetBT());
		BT_Buy.inst.LoadBuyStamina(bt_objs['bt_buy_stamina'].inst.GetBT());
		BT_Buy.inst.LoadBuyCash(bt_objs['bt_buy_cash'].inst.GetBT());
	}

	var LoadBTBuyCount = function() {
		BT_BuyCount.inst.LoadBuyCount(bt_objs['bt_buy_count'].inst.GetBT());		
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTShop = function() {
		BT_Shop.inst.LoadShop(bt_objs['bt_shop_normal'].inst.GetBT()
			, bt_objs['bt_shop_guild'].inst.GetBT()
			, bt_objs['bt_shop_pvp'].inst.GetBT()
			, bt_objs['bt_shop_random'].inst.GetBT()
			, bt_objs['bt_shop_challenge'].inst.GetBT()
			, bt_objs['bt_shop_time'].inst.GetBT()
			, bt_objs['bt_shop_hero_exp'].inst.GetBT()
			, bt_objs['bt_shop_reset_cost'].inst.GetBT()
		);
	}
	
	//------------------------------------------------------------------------------------------------------------------
	var LoadBTGacha = function() {
		BT_Gacha.inst.LoadGacha(bt_objs['bt_gacha_info'].inst.GetBT()
			, bt_objs['bt_gacha_normal'].inst.GetBT()
			, bt_objs['bt_gacha_premium'].inst.GetBT()
			, bt_objs['bt_gacha_premium_first'].inst.GetBT()
			, bt_objs['bt_gacha_vip'].inst.GetBT()
		);
	}
	
	//------------------------------------------------------------------------------------------------------------------
	var LoadBTRandomBox = function() {
		BT_RandomBox.inst.LoadRandomBox(bt_objs['bt_randombox'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTAttend = function() {
		BT_Attend.inst.LoadAttendDaily(bt_objs['bt_attend_daily_reward'].inst.GetBT());
		BT_Attend.inst.LoadAddAttendCost(bt_objs['bt_attend_add_cost'].inst.GetBT());
		BT_Attend.inst.LoadAttendAccum(bt_objs['bt_attend_accum_reward'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTPVP = function() {
		var bt_pvp_league	= bt_objs['bt_pvp_league'].inst.GetBT();
		var bt_pvp_reward 	= bt_objs['bt_reward_ranking'].inst.GetBT();

		BT_PVP.inst.LoadBTPVP(bt_pvp_league, bt_pvp_reward);
	}
	
	//------------------------------------------------------------------------------------------------------------------
	var LoadBTMission = function() {
		BT_Mission.inst.LoadBTMission(bt_objs['bt_mission'].inst.GetBT());
	}

	// for test
	inst.GetBTMission = function() { 
		// console.log('GetBTMission', bt_objs['bt_mission'].inst.GetBT());
		return bt_objs['bt_mission'].inst.GetBT();
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTAccountBuff = function() {
		BT_AccountBuff.inst.LoadAccountBuff(bt_objs['bt_account_buff_base'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTGuild = function() {
		BT_Guild.inst.LoadGuild(bt_objs['bt_guild'].inst.GetBT());
		BT_Guild.inst.LoadGuildDonation(bt_objs['bt_guild_donation'].inst.GetBT());
		BT_Guild.inst.LoadGuildRaidRankReward(bt_objs['bt_guild_contents_reward'].inst.GetBT());
		BT_Guild.inst.LoadGuildDonationReward(bt_objs['bt_guild_donation_reward'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTInfinityTower = function() {
		BT_Tower.inst.LoadTower(bt_objs['bt_infinity_tower_base'].inst.GetBT());
		BT_Tower.inst.LoadTowerBuffList(bt_objs['bt_infinity_tower_buff'].inst.GetBT());
		BT_Tower.inst.LoadTowerCashRewardBox(bt_objs['bt_infinity_tower_cash'].inst.GetBT());
		BT_Tower.inst.LoadTowerBattleSkip(bt_objs['bt_infinity_tower_skip'].inst.GetBT());
		BT_Tower.inst.LoadTowerAccumScoreReward(bt_objs['bt_infinity_tower_score'].inst.GetBT());
		BT_Tower.inst.LoadTowerRankReward(bt_objs['bt_reward_infinity_tower'].inst.GetBT());
		BT_Tower.inst.LoadTowerBotRanker(bt_objs['bt_infinity_tower_bot_ranker'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTDailyContents = function() {
		BT_DailyContents.inst.LoadRewardInfinityTower(bt_objs['bt_reward_infinity_tower'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTDarkDungeon = function() {
		BT_DarkDungeon.inst.LoadDarkDungeonChapter(bt_objs['bt_dark_chapter_base'].inst.GetBT(), bt_objs['bt_dark_stage_base'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTArmy = function() {
		BT_Army.inst.LoadArmySkill(bt_objs['bt_army'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTLevelUnlock = function() {
		BT_LevelUnlock.inst.LoadLevelUnlock(bt_objs['bt_level_unlock'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTSkill = function() {
		BT_Skill.inst.LoadSkill(bt_objs['bt_hero_skill'].inst.GetBT(), bt_objs['bt_hero_skill_effect'].inst.GetBT());
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;