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

    inst.BT_INFINITY_TOWER_SECRET = function (sequelize, path, callback) {
        base_table = sequelize.define('BT_INFINITY_TOWER_SECRET', {
            SECRET_MAZE_BATTLE_ID: { type: sequelize_module.INTEGER, allowNull: false },
            HERO_CLASS: { type: sequelize_module.INTEGER, allowNull: false },
            LIMIT_VALUE: { type: sequelize_module.INTEGER, allowNull: false },
            PROBABILITY: { type: sequelize_module.INTEGER, allowNull: false },
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
                            SECRET_MAZE_BATTLE_ID: read.Rows[i].SecretMazeBattleID,
                            HERO_CLASS: read.Rows[i].HeroClass,
                            LIMIT_VALUE: read.Rows[i].LimitValue,
                            PROBABILITY: read.Rows[i].PROBABILITY,
                        })
                        .success(function (anotherTask) {
                            // console.log('anotherTask - ', anotherTask);
                            if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_INFINITY_TOWER_SECRET');
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