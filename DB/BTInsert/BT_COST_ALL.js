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

	inst.BT_COST_ALL = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_COST_ALL', {
			COST_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			PROCEED_COUNT_MIN: { type: sequelize_module.INTEGER, allowNull: false },
			PROCEED_COUNT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			RENEWAL_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			ROUND_ADD_CASH: { type: sequelize_module.INTEGER, allowNull: false },
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
							COST_GROUP_ID: read.Rows[i].Cost_GroupID,
						},
						{
							COST_GROUP_ID: read.Rows[i].Cost_GroupID,
							PROCEED_COUNT_MIN: read.Rows[i].ProceedCount_MIN,
							PROCEED_COUNT_MAX: read.Rows[i].ProceedCount_MAX,
							RENEWAL_CASH: read.Rows[i].RenewalCash,
							ROUND_ADD_CASH: read.Rows[i].RoundAddCash,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_COST_ALL');
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