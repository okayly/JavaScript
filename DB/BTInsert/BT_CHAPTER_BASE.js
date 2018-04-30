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

	inst.BT_CHAPTER_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_CHAPTER_BASE', {
			CHAPTER_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			CHAPTER_ID: { type: sequelize_module.INTEGER, allowNull: false },
			CHAPTER_OPEN_COST: { type: sequelize_module.INTEGER, allowNull: false },
			CHAPTER_ICON_LIST_RESOURCE: { type: sequelize_module.STRING, allowNull: false },
			NEED_START_COUNT1: { type: sequelize_module.INTEGER, allowNull: false },
			CR1_ITEM1: { type: sequelize_module.INTEGER, allowNull: false },
			CR1_ITEM1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			CR1_ITEM2: { type: sequelize_module.INTEGER, allowNull: false },
			CR1_ITEM2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			CR1_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			CR1_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_START_COUNT2: { type: sequelize_module.INTEGER, allowNull: false },
			CR2_ITEM1: { type: sequelize_module.INTEGER, allowNull: false },
			CR2_ITEM1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			CR2_ITEM2: { type: sequelize_module.INTEGER, allowNull: false },
			CR2_ITEM2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			CR2_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			CR2_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_START_COUNT3: { type: sequelize_module.INTEGER, allowNull: false },
			CR3_ITEM1: { type: sequelize_module.INTEGER, allowNull: false },
			CR3_ITEM1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			CR3_ITEM2: { type: sequelize_module.INTEGER, allowNull: false },
			CR3_ITEM2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			CR3_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			CR3_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			CHAPTER_OPEN_STAGE: { type: sequelize_module.INTEGER, allowNull: false },
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
							CHAPTER_TYPE: read.Rows[i].ChapterType,
							CHAPTER_ID: read.Rows[i].ChapterID,
							CHAPTER_OPEN_COST: read.Rows[i].ChapterOpenCost,
							CHAPTER_ICON_LIST_RESOURCE: read.Rows[i].ChapterIconListResource,
							NEED_START_COUNT1: read.Rows[i].NeedStartCount1,
							CR1_ITEM1: read.Rows[i].CR1Item1,
							CR1_ITEM1_COUNT: read.Rows[i].CR1Item1Count,
							CR1_ITEM2: read.Rows[i].CR1Item2,
							CR1_ITEM2_COUNT: read.Rows[i].CR1Item2Count,
							CR1_CASH: read.Rows[i].CR1Cash,
							CR1_GOLD: read.Rows[i].CR1Gold,
							NEED_START_COUNT2: read.Rows[i].NeedStartCount2,
							CR2_ITEM1: read.Rows[i].CR2Item1,
							CR2_ITEM1_COUNT: read.Rows[i].CR2Item1Count,
							CR2_ITEM2: read.Rows[i].CR2Item2,
							CR2_ITEM2_COUNT: read.Rows[i].CR2Item2Count,
							CR2_CASH: read.Rows[i].CR2Cash,
							CR2_GOLD: read.Rows[i].CR2Gold,
							NEED_START_COUNT3: read.Rows[i].NeedStartCount3,
							CR3_ITEM1: read.Rows[i].CR3Item1,
							CR3_ITEM1_COUNT: read.Rows[i].CR3Item1Count,
							CR3_ITEM2: read.Rows[i].CR3Item2,
							CR3_ITEM2_COUNT: read.Rows[i].CR3Item2Count,
							CR3_CASH: read.Rows[i].CR3Cash,
							CR3_GOLD: read.Rows[i].CR3Gold,
							CHAPTER_OPEN_STAGE: read.Rows[i].ChapterOpenStage,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_CHAPTER_BASE');
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