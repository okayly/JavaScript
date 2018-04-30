/********************************************************************
Title : BaseAccountBuff
Date : 2016.03.14
Update : 2017.01.03
Desc : BT 정보 - 계정 버프(팀 강화)
Writer: jongwook
********************************************************************/
(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseAccountBuff = function() {
		this.account_buff_id;
		this.account_buff_type;
		this.skill_id;
		this.need_item_id;
		this.skill_tire;
		this.max_level;
		this.need_account_level;
		this.need_account_buff_id_list = [];
		this.need_account_buff_level;
	}

	var account_buff_map = new HashMap();

	inst.AddAccountBuff = function (p_account_buff_id, p_account_buff) { account_buff_map.set(p_account_buff_id, p_account_buff); }
	inst.GetAccountBuff = function (p_account_buff_id) { return account_buff_map.has(p_account_buff_id) ? account_buff_map.get(p_account_buff_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;