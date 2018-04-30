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

	inst.BT_DARK_CHAPTER_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_DARK_CHAPTER_BASE', {
			CHAPTER_ID: { type: sequelize_module.INTEGER, allowNull: false },
			LIMIT_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			RESET_TIME: { type: sequelize_module.INTEGER, allowNull: false },
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
							CHAPTER_ID: read.Rows[i].ChapterID,
						},
						{
							CHAPTER_ID: read.Rows[i].ChapterID,
							LIMIT_LEVEL: read.Rows[i].LimitLevel,
							RESET_TIME: read.Rows[i].ResetTime,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_DARK_CHAPTER_BASE');
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