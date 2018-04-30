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

	inst.BT_ATTEND_ADD_COST = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ATTEND_ADD_COST', {
			COST_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ATTEND_ADD_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_CASH: { type: sequelize_module.INTEGER, allowNull: false },
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
							COST_ID: read.Rows[i].Cost_ID,
						},
						{
							COST_ID: read.Rows[i].Cost_ID,
							ATTEND_ADD_COUNT: read.Rows[i].AttendAddCount,
							NEED_CASH: read.Rows[i].NeedCash,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ATTEND_ADD_COST');
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