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

    inst.BT_INFINITY_TOWER_SKIP = function (sequelize, path, callback) {
        base_table = sequelize.define('BT_INFINITY_TOWER_SKIP', {
            BATTLE_SKIP_ID: { type: sequelize_module.INTEGER, allowNull: false },
            BATTLE_SKIP_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
            MAX_BATTLE_SKIP_FLOOR: { type: sequelize_module.INTEGER, allowNull: false },
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
                            BATTLE_SKIP_ID: read.Rows[i].BattleSkipID,
                            BATTLE_SKIP_COUNT: read.Rows[i].BattleSkipCount,
                            MAX_BATTLE_SKIP_FLOOR: read.Rows[i].MaxBattleSkipFloor,
                        })
                        .success(function (anotherTask) {
                            // console.log('anotherTask - ', anotherTask);
                            if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_INFINITY_TOWER_SKIP');
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