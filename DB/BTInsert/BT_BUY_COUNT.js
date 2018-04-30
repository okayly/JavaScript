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

	inst.BT_BUY_COUNT = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_BUY_COUNT', {
			COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			INVENTORY_SLOT_CNT: { type: sequelize_module.INTEGER, allowNull: false },
			INVENTORY_SLOT_COST: { type: sequelize_module.INTEGER, allowNull: false },
			PROPHCY_SPRING_JOIN_COST: { type: sequelize_module.INTEGER, allowNull: false },
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
							INVENTORY_SLOT_CNT: read.Rows[i].InventorySlot_Cnt,
							INVENTORY_SLOT_COST: read.Rows[i].InventorySlot_Cost,
							PROPHCY_SPRING_JOIN_COST: read.Rows[i].ProphcySpring_Join_Cost,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_BUY_COUNT');
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