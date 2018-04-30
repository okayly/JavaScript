//----------------------------------------------
//         Excel2Json Unity integration
//         Copyright (C) 2016 Pocatcom
//
//        This file has been auto-generated
//              Do not manually edit
//----------------------------------------------

var fp = require('fs');

(function (exports) {
	// private instance
	var base_table;
	// public instance
	var inst = {};

	inst.BT_WEEKLY_DUNGEON = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_WEEKLY_DUNGEON', {
			DUNGEON_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			DUNGEON_NAME: { type: sequelize_module.INTEGER, allowNull: false },
			DUNGEON_DEC: { type: sequelize_module.INTEGER, allowNull: false },
			OPEN_WEEK: { type: sequelize_module.INTEGER, allowNull: false },
			OPEN_LV: { type: sequelize_module.INTEGER, allowNull: false },
			BATTLE_RESOURCE: { type: sequelize_module.STRING, allowNull: false },
			BACKGROUND_FADE: { type: sequelize_module.FLOAT, allowNull: false },
			BATTLE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			BATTLE_LIMIT_TURN: { type: sequelize_module.INTEGER, allowNull: false },
			STAMINA: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ACCOUNT_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_HERO_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ITEM1: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ITEM1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ITEM2: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ITEM2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ITEM3: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ITEM3_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
		}, { timestamps: false });

		base_table.sync({ force: true })
		.success(function () {
			fp.readFile(path, 'utf8', function (err, data) {
				if (err) {
					logger.error(err);
					throw err;
				}

				var read = JSON.parse(data);
				for (var i in read.Rows) {
					(function (i) {
						base_table.findOrCreate({
							STAGE_ID: read.Rows[i].StageID,
						},
						{
							DUNGEON_ID: read.Rows[i].DungeonID,
							STAGE_ID: read.Rows[i].StageID,
							DUNGEON_NAME: read.Rows[i].DungeonName,
							DUNGEON_DEC: read.Rows[i].DungeonDec,
							OPEN_WEEK: read.Rows[i].OpenWeek,
							OPEN_LV: read.Rows[i].OpenLv,
							BATTLE_RESOURCE: read.Rows[i].BattleResource,
							BACKGROUND_FADE: read.Rows[i].BackgroundFade,
							BATTLE_ID: read.Rows[i].BattleID,
							BATTLE_LIMIT_TURN: read.Rows[i].BattleLimitTurn,
							STAMINA: read.Rows[i].Stamina,
							REWARD_ACCOUNT_EXP: read.Rows[i].RewardAccountExp,
							REWARD_HERO_EXP: read.Rows[i].RewardHeroExp,
							REWARD_GOLD: read.Rows[i].RewardGold,
							REWARD_ITEM1: read.Rows[i].RewardItem1,
							REWARD_ITEM1_COUNT: read.Rows[i].RewardItem1Count,
							REWARD_ITEM2: read.Rows[i].RewardItem2,
							REWARD_ITEM2_COUNT: read.Rows[i].RewardItem2Count,
							REWARD_ITEM3: read.Rows[i].RewardItem3,
							REWARD_ITEM3_COUNT: read.Rows[i].RewardItem3Count,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_WEEKLY_DUNGEON');
						})
						.error(function (err) {
							console.log(err);
						});
					})(i);
				}
			});
		})
		.error(function (err) {
			console.log(err);
		});
	}

	inst.GetBT = function() { return base_table; }

	exports.inst = inst;
})(exports || global);
(exports || global).inst;