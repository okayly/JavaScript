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

	inst.BT_ACCOUNT_BUFF_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ACCOUNT_BUFF_BASE', {
			ACCOUNT_BUFF_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ACCOUNT_BUFF_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_TIRE: { type: sequelize_module.INTEGER, allowNull: false },
			MAX_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_ACCOUNT_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_ACCOUNT_BUFF_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_ACCOUNT_BUFF_ID2: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_ACCOUNT_BUFF_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
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
							ACCOUNT_BUFF_ID: read.Rows[i].AccountBuffID,
						},
						{
							ACCOUNT_BUFF_ID: read.Rows[i].AccountBuffID,
							ACCOUNT_BUFF_TYPE: read.Rows[i].AccountBuffType,
							NEED_RESOURCE_ID: read.Rows[i].NeedResourceID,
							SKILL_TIRE: read.Rows[i].SkillTire,
							MAX_LEVEL: read.Rows[i].MaxLevel,
							NEED_ACCOUNT_LEVEL: read.Rows[i].NeedAccountLevel,
							NEED_ACCOUNT_BUFF_ID1: read.Rows[i].NeedAccountBuffID1,
							NEED_ACCOUNT_BUFF_ID2: read.Rows[i].NeedAccountBuffID2,
							NEED_ACCOUNT_BUFF_LEVEL: read.Rows[i].NeedAccountBuffLevel,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ACCOUNT_BUFF_BASE');
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