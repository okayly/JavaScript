/********************************************************************
Title : BaseEquipItem
Date : 2017.02.07
Update : 2017.02.16
Desc : BT 정보 - 아이템 정보
writer : dongsu
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseEquipStatus = function() {
		this.status_id;
		this.evolution_step;	// 아이템 성급(별 갯수)
		this.option_count_min;
		this.option_count_max;
		this.option_group;
		this.lv_up_gold;
		this.lv_up_gold_lv;
	}

	// Level up Gold 계산 => lv_up_gold + (현재 레벨 * lv_up_gold_lv) It's simple.

	var item_equip_status_map = new HashMap();
		
	inst.AddEquipItemStatus = function(p_status_id, p_equip_status) {
		// console.log('AddEquipItemStatus %d', p_status_id);
		item_equip_status_map.set(p_status_id, p_equip_status);
	}
	inst.GetEquipItemStatus = function(p_status_id) { return (item_equip_status_map.has(p_status_id) == true) ? item_equip_status_map.get(p_status_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	var Option = function() {
		this.option_id;
		this.rate;
	}

	var BaseOptionGroup = function() {
		this.group_id;
		this.max_rate = 0;

		this.option_list = [];

		this.AddOptionGroup = function(p_option_id, p_rate) {
			this.max_rate = this.max_rate + p_rate;

			let option = new Option();
			option.option_id	= p_option_id;
			option.rate			= this.max_rate;

			this.option_list.push(option);
			// console.log('AddOptionGroup option_id : %d, rate : %d, max_rate : %d', p_option_id, option.rate, this.max_rate);
		}
	}

	var option_group_map = new HashMap();

	inst.AddEquipItemOptionGroup = function(p_option_id, p_group_id, p_rate) {
		// console.log('AddEquipItemOptionGroup group_id : %d', p_group_id);
		let option_group = undefined;

		if ( option_group_map.has(p_group_id) == false ) {
			option_group = new BaseOptionGroup();
		} else {
			option_group = option_group_map.get(p_group_id);
		}

		option_group.AddOptionGroup(p_option_id, p_rate);
		
		option_group_map.set(p_group_id, option_group);
	}
	inst.GetEquipItemRandomOptionList = function(p_group_id, p_count) {
		if ( option_group_map.has(p_group_id) == false ) {
			return undefined;
		}

		let option_list = [];
		let group = option_group_map.get(p_group_id);

		for ( let loop_cnt = 0; loop_cnt < p_count; ++loop_cnt ) {
			let rand = Rand.inst.RandomRange(1, group.max_rate);

			for ( let option_cnt = 0; option_cnt < group.option_list.length; ++option_cnt ) {
				if ( rand < group.option_list[option_cnt].rate ) {
					option_list.push(group.option_list[option_cnt].option_id);
					break;
				}
			}
		}

		return option_list;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;