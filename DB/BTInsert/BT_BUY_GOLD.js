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

	inst.BT_BUY_GOLD = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_BUY_GOLD', {
			COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			GAIN_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			GAIN_GOLD_X1_RATE: { type: sequelize_module.INTEGER, allowNull: false },
			GAIN_GOLD_X2_RATE: { type: sequelize_module.INTEGER, allowNull: false },
			GAIN_GOLD_X5_RATE: { type: sequelize_module.INTEGER, allowNull: false },
			GAIN_GOLD_X10_RATE: { type: sequelize_module.INTEGER, allowNull: false },
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
							COUNT: read.Rows[i].Count,
						},
						{
							COUNT: read.Rows[i].Count,
							NEED_CASH: read.Rows[i].NeedCash,
							GAIN_GOLD: read.Rows[i].GainGold,
							GAIN_GOLD_X1_RATE: read.Rows[i].GainGold_X1_Rate,
							GAIN_GOLD_X2_RATE: read.Rows[i].GainGold_X2_Rate,
							GAIN_GOLD_X5_RATE: read.Rows[i].GainGold_X5_Rate,
							GAIN_GOLD_X10_RATE: read.Rows[i].GainGold_X10_Rate,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_BUY_GOLD');
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