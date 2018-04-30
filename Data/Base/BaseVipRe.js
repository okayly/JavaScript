/********************************************************************
Title : BaseVipRe
Date : 2016.04.19
Update : 2016.07.21
Desc : 정보 - VIP
writer: jongwook
********************************************************************/
(function(exports) {
	// private 변수
	
	// public	
	var inst = {};

	inst.RewardItem = function() {
		this.reward_type;
		this.reward_id;
		this.reward_count;
	}

	inst.Vip = function() {
		this.vip_id;
		this.vip_step;					// VIP 단계
		this.accum_cash;				// 누적 구매 캐쉬
		this.max_buy_stamina_count; 	// 스태미너 구매 최대 수
		this.max_buy_gold_count;		// 골드 구매 최대 수
		this.max_buy_add_attend_count;	// 일일 출석 보상 최대 수
		this.skill_point_charge_time;	// 스킬 포인트 1 충전 시간
		this.skill_point_charge_count;	// 스킬 포인트 1일 충천 횟수
		this.vip_gacha;					// bool
		this.reward_item_list = [];		// VIP 보상

		this.infinity_tower_all_skip_bonus_percent;
		this.infinity_tower_skip_limit;
		this.infinity_tower_skip_vip_bonus_point;

		this.AddRewardItem = function(p_item) { this.reward_item_list.push(p_item); }
		this.GetRewardItemList = function() { return this.reward_item_list; }
	}

	var vip_map = new HashMap();	// key : vip step, value : Vip

	inst.AddVip = function(p_vip_step, p_vip) {
		// console.log('vip step : %d, vip : ', p_vip_step, p_vip);
		vip_map.set(p_vip_step, p_vip);
	}
	inst.GetVip = function(p_vip_step) { return ( vip_map.has(p_vip_step) == true ) ? vip_map.get(p_vip_step) : undefined; }

	// 누적 캐쉬양으로 VIP 얻기
	inst.GetVipFromAccumCash = function(p_accum_cash) {
		var find_vip = undefined;
		var vip_keys = vip_map.keys();
		
		for (var cnt = 0; cnt < vip_keys.length; ++cnt) {
			find_vip = vip_map.get(vip_keys[cnt]);
			// console.log('p_accum_cash: %d, find_vip.accum_cash: %d', p_accum_cash, find_vip.accum_cash)
			if (p_accum_cash <= find_vip.accum_cash) {
				if (p_accum_cash != find_vip.accum_cash) {
					find_vip = vip_map.get(vip_keys[cnt - 1]);
				}
				break;
			}
		}

		return find_vip;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;