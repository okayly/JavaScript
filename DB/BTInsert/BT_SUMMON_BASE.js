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

	inst.BT_SUMMON_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_SUMMON_BASE', {
			SUMMON_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_ACCOUNT_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_SUMMONS: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_HERO_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			TRAIT1_PASSIVE_SKILL: { type: sequelize_module.INTEGER, allowNull: false },
			TRAIT2_PASSIVE_SKILL: { type: sequelize_module.INTEGER, allowNull: false },
			TRAIT1_EXP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			TRAIT2_EXP_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
						},
						{
							SUMMON_ID: read.Rows[i].SummonID,
							NEED_ACCOUNT_LEVEL: read.Rows[i].NeedAccountLevel,
							NEED_SUMMONS: read.Rows[i].NeedSummons,
							NEED_HERO_COUNT: read.Rows[i].NeedHeroCount,
							NEED_GOLD: read.Rows[i].NeedGold,
							NEED_CASH: read.Rows[i].NeedCash,
							TRAIT1_PASSIVE_SKILL: read.Rows[i].Trait1_PassiveSkill,
							TRAIT2_PASSIVE_SKILL: read.Rows[i].Trait2_PassiveSkill,
							TRAIT1_EXP_ID: read.Rows[i].Trait1_ExpID,
							TRAIT2_EXP_ID: read.Rows[i].Trait2_ExpID,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_SUMMON_BASE');
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