/********************************************************************
Title : BT_GACHA 
Date : 2015.12.08
Update : 2016.08.26
Desc : BT 정보 - 가챠
	   BT_GATCH_INFO
	   BT_GACHA_NORMAL
	   BT_GACHA_PREMIUM
	   BT_GACHA_PREMIUM_FIRST
	   BT_GACHA_VIP	   
writer: dongsu
********************************************************************/
(function (exports) {
	// privat 변수
	
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.GachaItem = function() {
		this.item_id;
		this.item_type;	// 0 : 미분류, 1 : 영웅, 2 : 영웅석
		this.count_range_min;	// 지급 최소 수.
		this.count_range_max; 	// 지급 최대 수.
		this.percent;
	}

	var ItemGroup = function() {
		this.total_percent = 0;
		this.gacha_item_map = new HashMap();	// key : item_id, value : GachaItem

		this.AddGachaItem = function(p_item_id, p_gacha_item) {
			// console.log('AddGachaItem %d, ', p_item_id, p_gacha_item);
			this.total_percent = this.total_percent + p_gacha_item.percent;
			this.gacha_item_map.set(p_item_id, p_gacha_item);
			// console.log('%d - total_percent', p_gacha_item.item_type, this.total_percent);
		}
		this.GetGachaItem = function(p_item_id) { return (this.gacha_item_map.has(p_item_id) == true) ? this.gacha_item_map.get(p_item_id) : undefined; }
		this.GetAllGachaItem = function() { return this.gacha_item_map; }
	}

	inst.BaseGacha = function() {
		this.gacha_id;
		this.gacha_type; // 1 : normal, 2 : premium, 3 : vip
		this.price_type;
		this.price;
		this.vip_gacha;

		this.exec_count;
		this.daily_free_exec_count;
		this.free_exec_delay_time_for_sec;

		this.chance_count;		// 확정 가차가 발동 하는 번째.
		this.chance_value;		// 확정 가차시 주는 보상 수.
		this.chance_item_type;	// 확정 가차시 주는 아이템 타입. 

		// 보상 리스트를 가져야 한다. 타입 별로....
		this.chance_gacha_item_group_map = new HashMap(); // key : 지급 아이템 타입. value : 그룹(타입별)
		this.normal_gacha_item_group = new ItemGroup();

		// 일반 가챠 아이템 그룹
		this.AddNormalGachaItemGroup = function(p_item_id, p_gacha_item) {
			// console.log('AddNormalGachaItemGroup', p_item_id);
			this.normal_gacha_item_group.AddGachaItem(p_item_id, p_gacha_item);
		}
		this.GetNormalGachaItemGroup = function() { return this.normal_gacha_item_group; }
		
		// 확정 가챠 아이템 그룹
		this.AddChanceGachaItemGroup = function(p_item_type, p_item_id, p_gacha_item) {
			// console.log('AddChanceGachaItemGroup item_type : %d, item_id : %d, percent :', p_item_type, p_item_id, p_gacha_item.percent);
			let item_group = this.GetChanceGachaItemGroup(p_item_type);
			if ( typeof item_group === 'undefined' ) {
				item_group = new ItemGroup();
				this.chance_gacha_item_group_map.set(p_item_type, item_group);
			}
			
			item_group.AddGachaItem(p_item_id, p_gacha_item);
		}
		this.GetChanceGachaItemGroup = function(p_item_type) {
			return ( this.chance_gacha_item_group_map.has(p_item_type) == true ) ? this.chance_gacha_item_group_map.get(p_item_type) : undefined;
		}
	}

	var gacha_map = new HashMap();

	inst.AddBaseGacha = function(p_gacha_id, p_gacha) {
		// console.log('AddBaseGacha gacha_id : %d, gacha :', p_gacha_id, p_gacha);
		gacha_map.set(p_gacha_id, p_gacha);
	}
	inst.GetBaseGacha = function(p_gacha_id) {
		return ( gacha_map.has(p_gacha_id) == true ) ? gacha_map.get(p_gacha_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;