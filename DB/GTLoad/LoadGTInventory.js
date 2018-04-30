/********************************************************************
Title : LoadGTInventory
Date : 2017.02.17
Update : 2017.04.19
Writer : jongwook
Desc : Promise 로드 - 가방
********************************************************************/
var GTMgr = require('../GTMgr.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};	

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectItemFromIUID = function(p_uuid, p_iuid) {
		return new Promise(function (resolve, reject) {
			// GT_INVENTORY select
			GTMgr.inst.GetGTInventory().find({
				where : { UUID : p_uuid, IUID : p_iuid, EXIST_YN : true }
			})
			.then(p_ret_item => { resolve(p_ret_item); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectItemFromID = function(p_uuid, p_item_id) {
		return new Promise(function (resolve, reject) {
			// GT_INVENTORY select
			GTMgr.inst.GetGTInventory().find({
				where : { UUID : p_uuid, ITEM_ID : p_item_id, EXIST_YN : true }
			})
			.then(p_ret_item => { resolve(p_ret_item); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;