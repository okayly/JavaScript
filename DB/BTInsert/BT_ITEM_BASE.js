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

	inst.BT_ITEM_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ITEM_BASE', {
			ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			CATEGORY1: { type: sequelize_module.INTEGER, allowNull: false },
			CATEGORY2: { type: sequelize_module.INTEGER, allowNull: false },
			INDEX: { type: sequelize_module.INTEGER, allowNull: false },
			BUY_COST_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			BUY_COST_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			BUY_COST_POINT: { type: sequelize_module.INTEGER, allowNull: false },
			SELL_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			EQUIP_STATUS_ID: { type: sequelize_module.INTEGER, allowNull: false },
			LV_RATING_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EVOLUTION_STATUS_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REINFORCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT1_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT1_VALUE1: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT1_VALUE2: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT2_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT2_VALUE1: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT2_VALUE2: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT3_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT3_VALUE1: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT3_VALUE2: { type: sequelize_module.INTEGER, allowNull: false },
			RUNE_RECIPE_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
							ITEM_ID: read.Rows[i].ItemID,
						},
						{
							ITEM_ID: read.Rows[i].ItemID,
							CATEGORY1: read.Rows[i].Category1,
							CATEGORY2: read.Rows[i].Category2,
							INDEX: read.Rows[i].Index,
							BUY_COST_GOLD: read.Rows[i].BuyCostGold,
							BUY_COST_CASH: read.Rows[i].BuyCostCash,
							BUY_COST_POINT: read.Rows[i].BuyCostPoint,
							SELL_GOLD: read.Rows[i].SellGold,
							EQUIP_STATUS_ID: read.Rows[i].EquipStatusID,
							LV_RATING_ID: read.Rows[i].LvRatingID,
							EVOLUTION_STATUS_ID: read.Rows[i].EvolutionStatusID,
							REINFORCE_ID: read.Rows[i].ReinforceID,
							HERO_ID: read.Rows[i].HeroID,
							EFFECT1_ID: read.Rows[i].Effect1_ID,
							EFFECT1_VALUE1: read.Rows[i].Effect1_Value1,
							EFFECT1_VALUE2: read.Rows[i].Effect1_Value2,
							EFFECT2_ID: read.Rows[i].Effect2_ID,
							EFFECT2_VALUE1: read.Rows[i].Effect2_Value1,
							EFFECT2_VALUE2: read.Rows[i].Effect2_Value2,
							EFFECT3_ID: read.Rows[i].Effect3_ID,
							EFFECT3_VALUE1: read.Rows[i].Effect3_Value1,
							EFFECT3_VALUE2: read.Rows[i].Effect3_Value2,
							RUNE_RECIPE_ID: read.Rows[i].RuneRecipeID,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ITEM_BASE');
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