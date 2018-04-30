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

	inst.BT_STAGE_DROPGROUP_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_STAGE_DROPGROUP_BASE', {
			STAGE_DROP_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_COUNT_RANGE_START: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_COUNT_RANGE_END: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM1: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE1: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM2: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE2: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM3: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE3: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM4: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE4: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM5: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE5: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM6: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE6: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM7: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE7: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM8: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE8: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM9: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE9: { type: sequelize_module.INTEGER, allowNull: false },
			DROP_ITEM10: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_RANGE10: { type: sequelize_module.INTEGER, allowNull: false },
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
							STAGE_DROP_GROUP_ID: read.Rows[i].StageDropGroupID,
						},
						{
							STAGE_DROP_GROUP_ID: read.Rows[i].StageDropGroupID,
							DROP_COUNT_RANGE_START: read.Rows[i].DropCountRangeStart,
							DROP_COUNT_RANGE_END: read.Rows[i].DropCountRangeEnd,
							DROP_ITEM1: read.Rows[i].DropItem1,
							ITEM_RANGE1: read.Rows[i].ItemRange1,
							DROP_ITEM2: read.Rows[i].DropItem2,
							ITEM_RANGE2: read.Rows[i].ItemRange2,
							DROP_ITEM3: read.Rows[i].DropItem3,
							ITEM_RANGE3: read.Rows[i].ItemRange3,
							DROP_ITEM4: read.Rows[i].DropItem4,
							ITEM_RANGE4: read.Rows[i].ItemRange4,
							DROP_ITEM5: read.Rows[i].DropItem5,
							ITEM_RANGE5: read.Rows[i].ItemRange5,
							DROP_ITEM6: read.Rows[i].DropItem6,
							ITEM_RANGE6: read.Rows[i].ItemRange6,
							DROP_ITEM7: read.Rows[i].DropItem7,
							ITEM_RANGE7: read.Rows[i].ItemRange7,
							DROP_ITEM8: read.Rows[i].DropItem8,
							ITEM_RANGE8: read.Rows[i].ItemRange8,
							DROP_ITEM9: read.Rows[i].DropItem9,
							ITEM_RANGE9: read.Rows[i].ItemRange9,
							DROP_ITEM10: read.Rows[i].DropItem10,
							ITEM_RANGE10: read.Rows[i].ItemRange10,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_STAGE_DROPGROUP_BASE');
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