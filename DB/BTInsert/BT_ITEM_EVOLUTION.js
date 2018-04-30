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

	inst.BT_ITEM_EVOLUTION = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ITEM_EVOLUTION', {
			STEP: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
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
							STEP: read.Rows[i].Step,
						},
						{
							STEP: read.Rows[i].Step,
							NEED_RESOURCE_ID: read.Rows[i].NeedResource_ID,
							NEED_RESOURCE_COUNT: read.Rows[i].NeedResource_Count,
							NEED_GOLD: read.Rows[i].NeedGold,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ITEM_EVOLUTION');
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