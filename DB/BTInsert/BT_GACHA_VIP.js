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

	inst.BT_GACHA_VIP = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_GACHA_VIP', {
			ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			VALUE_MIN: { type: sequelize_module.INTEGER, allowNull: false },
			VALUE_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			PERCENT: { type: sequelize_module.INTEGER, allowNull: false },
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
							ITEM_TYPE: read.Rows[i].ItemType,
							VALUE_MIN: read.Rows[i].ValueMin,
							VALUE_MAX: read.Rows[i].ValueMax,
							PERCENT: read.Rows[i].Percent,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_GACHA_VIP');
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