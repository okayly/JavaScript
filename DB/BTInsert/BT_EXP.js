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

	inst.BT_EXP = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_EXP', {
			TARGET_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_NEED_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_TOTAL_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			ACCOUNT_NEED_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			ACCOUNT_TOTAL_EXP: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
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
							TARGET_LEVEL: read.Rows[i].TargetLevel,
						},
						{
							TARGET_LEVEL: read.Rows[i].TargetLevel,
							HERO_NEED_EXP: read.Rows[i].HeroNeedExp,
							HERO_TOTAL_EXP: read.Rows[i].HeroTotalExp,
							ACCOUNT_NEED_EXP: read.Rows[i].AccountNeedExp,
							ACCOUNT_TOTAL_EXP: read.Rows[i].AccountTotalExp,
							SKILL_NEED_GOLD: read.Rows[i].SkillNeedGold,
							ITEM_NEED_GOLD: read.Rows[i].ItemNeedGold,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_EXP');
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