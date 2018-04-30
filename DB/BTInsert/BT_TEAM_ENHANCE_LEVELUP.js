//----------------------------------------------
//    Google2u: Google Doc Unity integration
//         Copyright © 2015 Litteratus
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

    inst.BT_TEAM_ENHANCE_LEVELUP = function (sequelize, path, callback) {
        base_table = sequelize.define('BT_TEAM_ENHANCE_LEVELUP', {
            TARGET_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
            NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
            ACCUM_NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
            NEED_RESOURCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
            NEED_RESOURCE_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
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
                            NEED_GOLD: read.Rows[i].NeedGold,
                            ACCUM_NEED_GOLD: read.Rows[i].AccumNeedGold,
                            NEED_RESOURCE_ID: read.Rows[i].NeedResourceID,
                            NEED_RESOURCE_COUNT: read.Rows[i].NeedResourceCount,
                        })
                        .success(function (anotherTask) {
                            // console.log('anotherTask - ', anotherTask);
                            if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_TEAM_ENHANCE_LEVELUP');
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