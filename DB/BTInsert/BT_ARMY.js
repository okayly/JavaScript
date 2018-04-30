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

	inst.BT_ARMY = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ARMY', {
			ARMY_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NAME: { type: sequelize_module.INTEGER, allowNull: false },
			DESC: { type: sequelize_module.INTEGER, allowNull: false },
			ICON_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ELEMENT_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
							ARMY_ID: read.Rows[i].ArmyID,
						},
						{
							ARMY_ID: read.Rows[i].ArmyID,
							NAME: read.Rows[i].Name,
							DESC: read.Rows[i].Desc,
							ICON_ID: read.Rows[i].IconID,
							ELEMENT_TYPE: read.Rows[i].ElementType,
							SKILL_ID: read.Rows[i].SkillID,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ARMY');
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