/********************************************************************
Title : BT_TownDrop
Date : 2015.11.06
Update : 2016.07.21
Desc : BT 로더 - 스테이지 드랍아이템
writer: dongsu
********************************************************************/
var BaseStageDropGroup = require('../../Data/Base/BaseStageDropGroup.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadStageDropGroup = function (p_bt_stage_drop_group) {
		logger.debug('*** Start LoadBTTown Drop Group Info ***');

		// BT_STAGE_DROPGROUP_BASE select
		p_bt_stage_drop_group.findAll()
		.then( function (p_ret_group) {
			for (var cnt in p_ret_group) {

				var data = p_ret_group[cnt].dataValues;

				var stage_drop_group					= new BaseStageDropGroup.inst.BaseStageDropGroup();
				stage_drop_group.stage_drop_group_id	= data.STAGE_DROP_GROUP_ID;
				stage_drop_group.drop_count_range_min	= data.DROP_COUNT_RANGE_START;
				stage_drop_group.drop_count_range_max	= data.DROP_COUNT_RANGE_END;

				stage_drop_group.AddDropItem(1, data.DROP_ITEM1, data.ITEM_RANGE1);
				stage_drop_group.AddDropItem(2, data.DROP_ITEM2, data.ITEM_RANGE2);
				stage_drop_group.AddDropItem(3, data.DROP_ITEM3, data.ITEM_RANGE3);
				stage_drop_group.AddDropItem(4, data.DROP_ITEM4, data.ITEM_RANGE4);
				stage_drop_group.AddDropItem(5, data.DROP_ITEM5, data.ITEM_RANGE5);
				stage_drop_group.AddDropItem(6, data.DROP_ITEM6, data.ITEM_RANGE6);
				stage_drop_group.AddDropItem(7, data.DROP_ITEM7, data.ITEM_RANGE7);
				stage_drop_group.AddDropItem(8, data.DROP_ITEM8, data.ITEM_RANGE8);
				stage_drop_group.AddDropItem(9, data.DROP_ITEM9, data.ITEM_RANGE9);
				stage_drop_group.AddDropItem(10, data.DROP_ITEM10, data.ITEM_RANGE10);

				BaseStageDropGroup.inst.AddStageDropItemGroup(data.STAGE_DROP_GROUP_ID, stage_drop_group);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTEffect!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
