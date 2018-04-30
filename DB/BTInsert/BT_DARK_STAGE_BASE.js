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

	inst.BT_DARK_STAGE_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_DARK_STAGE_BASE', {
			CHAPTER_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_NAME: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_DESC: { type: sequelize_module.INTEGER, allowNull: false },
			STAGE_ICON: { type: sequelize_module.INTEGER, allowNull: false },
			BACKGROUND_FADE: { type: sequelize_module.FLOAT, allowNull: false },
			STAGE_BATTLE_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			BATTLE_LIMIT_TURN: { type: sequelize_module.INTEGER, allowNull: false },
			STAMINA: { type: sequelize_module.INTEGER, allowNull: false },
			ACCOUNT_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			MAIN_ITEM_DROP_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			SUB_ITEM_DROP_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
							CHAPTER_ID: read.Rows[i].ChapterID,
							STAGE_ID: read.Rows[i].StageID,
							STAGE_NAME: read.Rows[i].StageName,
							STAGE_DESC: read.Rows[i].StageDesc,
							STAGE_ICON: read.Rows[i].StageIcon,
							BACKGROUND_FADE: read.Rows[i].BackgroundFade,
							STAGE_BATTLE_GROUP_ID: read.Rows[i].StageBattleGroupID,
							BATTLE_LIMIT_TURN: read.Rows[i].BattleLimitTurn,
							STAMINA: read.Rows[i].Stamina,
							ACCOUNT_EXP: read.Rows[i].AccountExp,
							HERO_EXP: read.Rows[i].HeroExp,
							GOLD: read.Rows[i].Gold,
							MAIN_ITEM_DROP_GROUP_ID: read.Rows[i].MainItemDropGroupID,
							SUB_ITEM_DROP_GROUP_ID: read.Rows[i].SubItemDropGroupID,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_DARK_STAGE_BASE');
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