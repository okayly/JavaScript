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

	inst.BT_SHOP_RANDOM = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_SHOP_RANDOM', {
			SHOP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			USER_LEVEL_MIN: { type: sequelize_module.INTEGER, allowNull: false },
			USER_LEVEL_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM1_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM1_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM2_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM2_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM3_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM3_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM3_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM4_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM4_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM4_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM5_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM5_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM5_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM6_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM6_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM6_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM7_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM7_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM7_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM8_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM8_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM8_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM9_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM9_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM9_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM10_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM10_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM10_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM11_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM11_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM11_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM12_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM12_BUY_COST_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM12_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
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
						},
						{
							SHOP_ID: read.Rows[i].ShopID,
							USER_LEVEL_MIN: read.Rows[i].UserLevelMin,
							USER_LEVEL_MAX: read.Rows[i].UserLevelMax,
							ITEM1_ID: read.Rows[i].Item1_ID,
							ITEM1_BUY_COST_TYPE: read.Rows[i].Item1_BuyCostType,
							ITEM1_COUNT: read.Rows[i].Item1_Count,
							ITEM2_ID: read.Rows[i].Item2_ID,
							ITEM2_BUY_COST_TYPE: read.Rows[i].Item2_BuyCostType,
							ITEM2_COUNT: read.Rows[i].Item2_Count,
							ITEM3_ID: read.Rows[i].Item3_ID,
							ITEM3_BUY_COST_TYPE: read.Rows[i].Item3_BuyCostType,
							ITEM3_COUNT: read.Rows[i].Item3_Count,
							ITEM4_ID: read.Rows[i].Item4_ID,
							ITEM4_BUY_COST_TYPE: read.Rows[i].Item4_BuyCostType,
							ITEM4_COUNT: read.Rows[i].Item4_Count,
							ITEM5_ID: read.Rows[i].Item5_ID,
							ITEM5_BUY_COST_TYPE: read.Rows[i].Item5_BuyCostType,
							ITEM5_COUNT: read.Rows[i].Item5_Count,
							ITEM6_ID: read.Rows[i].Item6_ID,
							ITEM6_BUY_COST_TYPE: read.Rows[i].Item6_BuyCostType,
							ITEM6_COUNT: read.Rows[i].Item6_Count,
							ITEM7_ID: read.Rows[i].Item7_ID,
							ITEM7_BUY_COST_TYPE: read.Rows[i].Item7_BuyCostType,
							ITEM7_COUNT: read.Rows[i].Item7_Count,
							ITEM8_ID: read.Rows[i].Item8_ID,
							ITEM8_BUY_COST_TYPE: read.Rows[i].Item8_BuyCostType,
							ITEM8_COUNT: read.Rows[i].Item8_Count,
							ITEM9_ID: read.Rows[i].Item9_ID,
							ITEM9_BUY_COST_TYPE: read.Rows[i].Item9_BuyCostType,
							ITEM9_COUNT: read.Rows[i].Item9_Count,
							ITEM10_ID: read.Rows[i].Item10_ID,
							ITEM10_BUY_COST_TYPE: read.Rows[i].Item10_BuyCostType,
							ITEM10_COUNT: read.Rows[i].Item10_Count,
							ITEM11_ID: read.Rows[i].Item11_ID,
							ITEM11_BUY_COST_TYPE: read.Rows[i].Item11_BuyCostType,
							ITEM11_COUNT: read.Rows[i].Item11_Count,
							ITEM12_ID: read.Rows[i].Item12_ID,
							ITEM12_BUY_COST_TYPE: read.Rows[i].Item12_BuyCostType,
							ITEM12_COUNT: read.Rows[i].Item12_Count,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_SHOP_RANDOM');
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