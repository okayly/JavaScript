/********************************************************************
Title : BaseLevelUnlock
Date : 2017.02.10
Update : 2017.02.10
Desc : BT 정보 - 레벨이 바뀔때마다 해줘야 하는 것들
writer : jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseLevelUnlock = function() {
		this.target_level;
		this.max_stamina;
		this.recovery_stamina;
		this.castle_step;
		this.open_shop;
		this.open_eventdungeon_gold;
		this.open_eventdungeon_exp;
		this.open_eventdungeon_daily1;
		this.open_eventdungeon_daily2;
		this.open_eventdungeon_daily3;
		this.open_imprinting;
		this.open_accountbuff;
		this.open_infinity;
		this.open_pvp;
		this.open_guild;
		this.open_chat;
	}

	// Level up Gold 계산 => lv_up_gold + (현재 레벨 * lv_up_gold_lv) It's simple.

	var level_unlock_map = new HashMap();
		
	inst.AddLevelUnlock = function(p_target_level, p_level_unlock) {
		// console.log('AddLevelUnlock %d', p_target_level);
		level_unlock_map.set(p_target_level, p_level_unlock);
	}
	inst.GetLevelUnlock = function(p_target_level) { return (level_unlock_map.has(p_target_level) == true) ? level_unlock_map.get(p_target_level) : undefined; }

	inst.GetPvPUnlockLevel = function() {
		let unlock_level ;
		level_unlock_map.forEach(function (value, key) {
			if ( value.open_pvp == true )
			{
				if ( typeof unlock_level === 'undefined' ||  unlock_level > value.target_level )
				{
					unlock_level = value.target_level;
				}
			}
		})
		console.log('확인용 - pvp unlock level : %d', unlock_level);
		return unlock_level;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;