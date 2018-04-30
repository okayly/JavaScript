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

	inst.BT_BUY_CASH = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_BUY_CASH', {
			CASH_ID: { type: sequelize_module.INTEGER, allowNull: false },
			GAIN_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			DAILY_VALUE: { type: sequelize_module.INTEGER, allowNull: false },
			DAILY_PERIOD: { type: sequelize_module.INTEGER, allowNull: false },
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
							CASH_ID: read.Rows[i].CashID,
						},
						{
							CASH_ID: read.Rows[i].CashID,
							GAIN_CASH: read.Rows[i].GainCash,
							DAILY_VALUE: read.Rows[i].DailyValue,
							DAILY_PERIOD: read.Rows[i].DailyPeriod,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_BUY_CASH');
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