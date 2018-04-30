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

    inst.BT_INFINITY_TOWER_CASH = function (sequelize, path, callback) {
        base_table = sequelize.define('BT_INFINITY_TOWER_CASH', {
            BUY_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
            NEED_CASH: { type: sequelize_module.INTEGER, allowNull: false },
            RANDOMBOX_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
                            BUY_COUNT: read.Rows[i].BuyCount,
                        },
                        {
                            BUY_COUNT: read.Rows[i].BuyCount,
                            NEED_CASH: read.Rows[i].NeedCash,
                            RANDOMBOX_ITEM_ID: read.Rows[i].RandomboxItemID,
                        })
                        .success(function (anotherTask) {
                            // console.log('anotherTask - ', anotherTask);
                            if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_INFINITY_TOWER_CASH');
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