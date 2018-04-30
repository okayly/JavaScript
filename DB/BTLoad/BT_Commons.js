/********************************************************************
Title : BT_Common
Date : 2016.06.23
Update : 2017.04.07
Desc : BT 로드 - Common
writer: jong wook
********************************************************************/
var DefineValues = require('../../Common/DefineValues.js');

var fs = require('fs');

(function(exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadBTCommon = function(p_bt_common) {
		logger.debug('*** Start LoadBTCommon ***');
		return new Promise(function (resolve, reject) {
			// BT_COMMON select
			return p_bt_common.findAll()
			.then(p_ret_define => {
				return Promise.all(p_ret_define.map(row => {
					let data = row.dataValues;
					let convert_value = undefined;

					switch(data.TYPE) {
						case 'float': convert_value = parseFloat(data.VALUE);	break;
						case 'int'	: convert_value = parseInt(data.VALUE); 	break;
						default		: convert_value = data.VALUE; 				break;	// string
					}

					// 테이블 VARIABLE이 변수 이름, VALUE가 값.
					DefineValues.inst[data.VARIABLE] = convert_value;
				}))
				.then(function () {
					// console.log('DefineValues', DefineValues);
					resolve();
				})
				.catch(p_error =>{ 
					reject(p_error);
				});
				// console.log('DefineValues', DefineValues);
			})
			.catch(p_error => {
				logger.error('Error LoadBTCommon!!!!');
				reject(p_error);
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;
