/********************************************************************
Title : BaseStageDrop
Date : 2016.07.21
Desc : BT 정보 - 스테이지 드랍 정보
writer: jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.BaseStageDropGroup = function() {
		this.DropItem = function() {
			this.item_id;
			this.item_range;
		}

		this.stage_drop_group_id = 0;
		this.drop_count_range_min = 0;
		this.drop_count_range_max = 0;
		this.total_range = 0;
		this.drop_item_map = new HashMap();	// key : index, value : DropItem

		this.AddDropItem = function(p_index, p_item_id, p_range) {
			if ( typeof p_item_id !== 'undefined' && p_item_id != 0 ) {
				var drop_item		= new this.DropItem();
				drop_item.item_id	= p_item_id;
				drop_item.item_range= p_range;

				this.total_range += parseInt(p_range);
				this.drop_item_map.set(p_index, drop_item);
			}
		}
		this.GetDropItem = function(p_index) {
			return (this.drop_item_map.has(p_index) == true) ? this.drop_item_map.get(p_index) : undefined;
		}
	}

	var stage_drop_group_map = new HashMap();

	inst.AddStageDropItemGroup = function(p_group_id, p_group) { stage_drop_group_map.set(p_group_id, p_group); }
	inst.GetStageDropItemGroup = function(p_group_id) { return (stage_drop_group_map.has(p_group_id) == true) ? stage_drop_group_map.get(p_group_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;