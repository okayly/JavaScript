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

	inst.BT_ITEM_EQUIP_OPTION = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ITEM_EQUIP_OPTION', {
			EQUIP_OPTION_ID: { type: sequelize_module.INTEGER, allowNull: false },
			GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			OPTION_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STATE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			IS_PERCENT: { type: sequelize_module.BOOLEAN, allowNull: false },
			OPTION_VALUE: { type: sequelize_module.FLOAT, allowNull: false },
			OPTION_VALUE_LV: { type: sequelize_module.FLOAT, allowNull: false },
			OPTION_RATE: { type: sequelize_module.INTEGER, allowNull: false },
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
							EQUIP_OPTION_ID: read.Rows[i].EquipOptionID,
						},
						{
							EQUIP_OPTION_ID: read.Rows[i].EquipOptionID,
							GROUP_ID: read.Rows[i].GroupID,
							OPTION_ID: read.Rows[i].OptionID,
							STATE_ID: read.Rows[i].StateID,
							IS_PERCENT: read.Rows[i].IsPercent,
							OPTION_VALUE: read.Rows[i].OptionValue,
							OPTION_VALUE_LV: read.Rows[i].OptionValueLv,
							OPTION_RATE: read.Rows[i].OptionRate,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ITEM_EQUIP_OPTION');
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