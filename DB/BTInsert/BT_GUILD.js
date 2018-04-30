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

	inst.BT_GUILD = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_GUILD', {
			GUILD_LV: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_GUILD_POINT: { type: sequelize_module.INTEGER, allowNull: false },
			MAX_MEMBER_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			OPEN_GUILD_CONTENTS: { type: sequelize_module.STRING, allowNull: false },
			OPEN_GUILD_RAID: { type: sequelize_module.INTEGER, allowNull: false },
			OPEN_GUILD_SKILL: { type: sequelize_module.INTEGER, allowNull: false },
			OPEN_COST: { type: sequelize_module.INTEGER, allowNull: false },
			COST_LV: { type: sequelize_module.INTEGER, allowNull: false },
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
							GUILD_LV: read.Rows[i].GuildLv,
						},
						{
							GUILD_LV: read.Rows[i].GuildLv,
							NEED_GUILD_POINT: read.Rows[i].NeedGuildPoint,
							MAX_MEMBER_COUNT: read.Rows[i].MaxMemberCount,
							OPEN_GUILD_CONTENTS: read.Rows[i].OpenGuildContents,
							OPEN_GUILD_RAID: read.Rows[i].OpenGuildRaid,
							OPEN_GUILD_SKILL: read.Rows[i].OpenGuildSkill,
							OPEN_COST: read.Rows[i].OpenCost,
							COST_LV: read.Rows[i].CostLv,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_GUILD');
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