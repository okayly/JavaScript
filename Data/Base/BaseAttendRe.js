/********************************************************************
Title : BaseAttendRe
Date : 2016.03.03
Update : 2016.07.25
Desc : BT 정보 - 출석 보상
writer: jongwook
********************************************************************/
(function(exports) {
	// private 변수
	// TODO : 이 형식의 Reward는 공통으로 빼자.
	var Reward = function() {
		this.reward_type;
		this.reward_id;
		this.reward_count;
	}
	
	// public	
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.BaseAttendDaily = function() {
		this.reward_key;
		this.reward_2x_vip_step;

		this.reward_list = [];

		// RewardMgr 형식으로 만듬
		this.AddReward = function(p_index, p_type, p_item_id, p_count) {
			var reward = new Reward();
			reward.reward_type	= p_type;
			reward.reward_id	= p_item_id;
			reward.reward_count	= p_count;

			this.reward_list.push(reward);
		}
	}

	var attend_daily_map = new HashMap();	// key : Maked key, value : BaseAttendDaily

	var MakeHashMapKey = function (p_month, p_date) {
		// 4자릿수(digit)으로 만든다. 1, 1 => 0101 | 10, 3 => 1003
		// console.log('month : %d, day : %d, make key :', p_month, p_date, (((p_month < 10 ? '0' : '') + p_month) + ((p_date < 10 ? '0' : '') + p_date)));
		return (((p_month < 10 ? '0' : '') + p_month) + ((p_date < 10 ? '0' : '') + p_date));
	}

	inst.AddAttendDailyReward = function(p_month, p_date, p_reward) { 
		var key = MakeHashMapKey(p_month, p_date);
		p_reward.reward_key = key;
		attend_daily_map.set(key, p_reward);
	}
	inst.GetAttendDailyReward = function(p_month, p_date) { 
		var key = MakeHashMapKey(p_month, p_date);
		return ( attend_daily_map.has(key) == true ) ? attend_daily_map.get(key) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	var add_attend_cost_map = new HashMap();	// key : add_count, value : need_cash

	inst.AddAddAttendNeedCash = function (p_add_count, p_need_cash) { add_attend_cost_map.set(p_add_count, p_need_cash); }
	inst.GetAddAttendNeedCash = function (p_add_count) { return ( add_attend_cost_map.has(p_add_count) == true ) ? add_attend_cost_map.get(p_add_count) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	inst.BaseAccumAttendReward = function () {
		this.AccumDate = function() {
			this.accum_date;
			// RewardMgr에서 보상을 HashMap 형식으로 받기 때문에 이렇게 설정한다.
			this.reward_list = [];

			this.AddReward = function(p_index, p_type, p_item_id, p_count) {
				var reward = new Reward();
				reward.reward_type	= p_type;
				reward.reward_id	= p_item_id;
				reward.reward_count	= p_count;

				this.reward_list.push(reward);
			}
		}

		this.attend_accum_date_list = [];		// 누적 보상일
		this.accum_date_map = new HashMap();	// key : accum_date, value : RewardDate

		this.AddAccumDate = function(p_accum_date, p_type, p_item_id, p_count) {
			var index = 1;
			var accum_date = new this.AccumDate();
			accum_date.accum_date = p_accum_date;
			accum_date.AddReward(index, p_type, p_item_id, p_count);

			this.accum_date_map.set(p_accum_date, accum_date);

			if ( this.attend_accum_date_list.indexOf(p_accum_date) == -1 ) {
				this.attend_accum_date_list.push(p_accum_date);
				// console.log('accum_date', this.attend_accum_date_list);
			}
		}
		this.GetAccumDate = function(p_accum_date) { return ( this.accum_date_map.has(p_accum_date) == true ) ? this.accum_date_map.get(p_accum_date) : undefined; }
	}

	var attend_accum_map = new HashMap();	// key : month, value : BaseAccumAttendReward

	inst.AddBaseAccumAttendReward = function(p_month, p_accum_reward) { attend_accum_map.set(p_month, p_accum_reward); }
	inst.GetBaseAccumAttendReward = function(p_month) { return ( attend_accum_map.has(p_month) == true ) ? attend_accum_map.get(p_month) : undefined; }
	inst.GetAccumDate = function(p_month, p_accum_date) { return ( attend_accum_map.has(p_month) == true ) ? attend_accum_map.get(p_month).GetAccumDate(p_accum_date) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;