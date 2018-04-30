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

	inst.BT_STAGE_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_STAGE_BASE', {
			STAGE_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			CHAPTER_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEXT_STAGE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_NAME: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_DESC: { type: sequelize_module.INTEGER, allowNull: false },
			BATTLE_RESOURCE: { type: sequelize_module.STRING, allowNull: false },
			BACKGROUND_FADE: { type: sequelize_module.FLOAT, allowNull: false },
			STAGE_BATTLE_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_DROP_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_ATTACK_POWER: { type: sequelize_module.INTEGER, allowNull: false },
			BOSS_HP: { type: sequelize_module.INTEGER, allowNull: false },
			STAMINA: { type: sequelize_module.INTEGER, allowNull: false },
			ACCOUNT_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM1: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM1COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM2: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM2COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM3: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM3COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM4: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM4COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM5: { type: sequelize_module.INTEGER, allowNull: false },
			FIRST_CLEAR_ITEM5COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_REWARD_ITEM1: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_ITEM1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_REWARD_ITEM2: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_ITEM2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_REWARD_ITEM3: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_ITEM3_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_REWARD_ITEM4: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_ITEM4_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_REWARD_ITEM5: { type: sequelize_module.INTEGER, allowNull: false },
			SWEEP_ITEM5_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_ICON_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_POS: { type: sequelize_module.INTEGER, allowNull: false },
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
							CHAPTER_ID: read.Rows[i].ChapterID,
						},
						{
							STAGE_TYPE: read.Rows[i].StageType,
							CHAPTER_ID: read.Rows[i].ChapterID,
							STAGE_ID: read.Rows[i].StageID,
							NEXT_STAGE_ID: read.Rows[i].NextStageID,
							STAGE_NAME: read.Rows[i].StageName,
							STAGE_DESC: read.Rows[i].StageDesc,
							BATTLE_RESOURCE: read.Rows[i].BattleResource,
							BACKGROUND_FADE: read.Rows[i].BackgroundFade,
							STAGE_BATTLE_GROUP_ID: read.Rows[i].StageBattleGroupID,
							STAGE_DROP_GROUP_ID: read.Rows[i].StageDropGroupID,
							STAGE_ATTACK_POWER: read.Rows[i].StageAttackPower,
							BOSS_HP: read.Rows[i].BossHP,
							STAMINA: read.Rows[i].Stamina,
							ACCOUNT_EXP: read.Rows[i].AccountExp,
							HERO_EXP: read.Rows[i].HeroExp,
							GOLD: read.Rows[i].Gold,
							FIRST_CLEAR_ITEM1: read.Rows[i].FirstClearItem1,
							FIRST_CLEAR_ITEM1COUNT: read.Rows[i].FirstClearItem1count,
							FIRST_CLEAR_ITEM2: read.Rows[i].FirstClearItem2,
							FIRST_CLEAR_ITEM2COUNT: read.Rows[i].FirstClearItem2count,
							FIRST_CLEAR_ITEM3: read.Rows[i].FirstClearItem3,
							FIRST_CLEAR_ITEM3COUNT: read.Rows[i].FirstClearItem3count,
							FIRST_CLEAR_ITEM4: read.Rows[i].FirstClearItem4,
							FIRST_CLEAR_ITEM4COUNT: read.Rows[i].FirstClearItem4count,
							FIRST_CLEAR_ITEM5: read.Rows[i].FirstClearItem5,
							FIRST_CLEAR_ITEM5COUNT: read.Rows[i].FirstClearItem5count,
							SWEEP_REWARD_ITEM1: read.Rows[i].SweepRewardItem1,
							SWEEP_ITEM1_COUNT: read.Rows[i].SweepItem1Count,
							SWEEP_REWARD_ITEM2: read.Rows[i].SweepRewardItem2,
							SWEEP_ITEM2_COUNT: read.Rows[i].SweepItem2Count,
							SWEEP_REWARD_ITEM3: read.Rows[i].SweepRewardItem3,
							SWEEP_ITEM3_COUNT: read.Rows[i].SweepItem3Count,
							SWEEP_REWARD_ITEM4: read.Rows[i].SweepRewardItem4,
							SWEEP_ITEM4_COUNT: read.Rows[i].SweepItem4Count,
							SWEEP_REWARD_ITEM5: read.Rows[i].SweepRewardItem5,
							SWEEP_ITEM5_COUNT: read.Rows[i].SweepItem5Count,
							STAGE_ICON_ID: read.Rows[i].StageIconID,
							STAGE_POS: read.Rows[i].StagePos,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_STAGE_BASE');
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