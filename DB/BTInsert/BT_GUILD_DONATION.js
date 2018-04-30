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

	inst.BT_GUILD_DONATION = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_GUILD_DONATION', {
			DONATION_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			GUILD_POINT: { type: sequelize_module.INTEGER, allowNull: false },
			ALLIANCE_POINT: { type: sequelize_module.INTEGER, allowNull: false },
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
							DONATION_ID: read.Rows[i].DonationID,
						},
						{
							DONATION_ID: read.Rows[i].DonationID,
							NEED_GOLD: read.Rows[i].NeedGold,
							NEED_CASH: read.Rows[i].NeedCash,
							GUILD_POINT: read.Rows[i].GuildPoint,
							ALLIANCE_POINT: read.Rows[i].AlliancePoint,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_GUILD_DONATION');
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