/********************************************************************
Title : CreatItem
Date : 2015.12.11
Update : 2016.08.01
Desc : 아이템 생성 - 어디서 사용하지 출처 불명
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqCreateItem = function (p_socket, p_packet) {
		var json = JSON.parse(p_packet);
		if ( json == null ) {
			logger.error("json ReqCreateItem : " + p_packet);
			return;
		}

		// console.log('ReqCreateItem - ', p_packet);
		var uuid		= parseInt(json.uuid)
		var item_id		= parseInt(json.item_id)
		var item_count	= parseInt(json.item_count);

		// GT_INVENTORY find or create - 이미 있는 ITEM_ID 이면 갯수를 증가 시킨다.
		GTMgr.inst.GetGTInventory().findOrCreate({
			UUID: uuid, ITEM_ID: item_id
		}, {
			UUID: uuid, ITEM_ID: item_id, ITEM_COUNT: item_count
		})
		.success(function (ret_item) {
			// DB insert
			if ( ret_item.options.isNewRecord === true ) {
				return;
			
			// DB update
			ret_item.updateAttributes({
				ITEM_COUNT: item_count
			})
			.success(function (anotherTask) {
			})
			.error(function (p_error) {
				console.log(p_error);
			});			
		})
		.error(function (p_error) {
			console.log(p_error);
		});
	}

	exports.inst = inst;

})(exports || global);
(exports || global).inst;