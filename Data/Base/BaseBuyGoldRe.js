/********************************************************************
Title : BaseBuyGoldRe
Date : 2016.07.18
Desc : BT 정보 - 골드 구매
writer: jongwook
********************************************************************/
(function (exports) {
	// private 변수
	
	// public	
	var inst = {};
	
	inst.BuyGold = function() {
		this.count;
		this.need_cash;
		this.gain_gold;

		// 1x, 2x, 5, 10x
		this.gamble_rate = [];
		this.gamble_accum_rate = [];

		this.AddGambleRate = function(p_rate) { 
			this.gamble_rate.push(p_rate);

			var arrcum_rate = (this.gamble_accum_rate.length == 0) ? p_rate : this.gamble_accum_rate[this.gamble_accum_rate.length - 1] + p_rate;
			this.gamble_accum_rate.push(arrcum_rate);

			// console.log('gamble_rate:', this.gamble_rate);
			// console.log('gamble_accum_rate:', this.gamble_accum_rate);
		}

		this.GetGambleAccumRate = function() { return this.gamble_accum_rate; }
		this.GetMaxGambleRate = function() {
			var array_len = this.gamble_accum_rate.length;
			return (array_len > 0) ? this.gamble_accum_rate[array_len - 1] : 'undefined';
		}

		this.GetGoldGamble = function() {
			var multiple = 1;
			var gamble_values = [ 1, 2, 5, 10 ];

			var max_accum_rate = this.gamble_accum_rate[this.gamble_accum_rate.length - 1];
			var ret_rand = Rand.inst.RandomRange(1, max_accum_rate);

			for (var cnt = 0; cnt < this.gamble_accum_rate.length; ++cnt) {
				// console.log('ret_rand: %d this.gamble_accum_rate[%d]: %d', ret_rand, cnt, this.gamble_accum_rate[cnt]);
				if (ret_rand <= this.gamble_accum_rate[cnt]) {
					multiple = gamble_values[cnt];
					break;
				}
			}
			return multiple;
		}
	}

	var buy_gold_map = new HashMap();	// key : count step, value : BuyGold

	inst.AddBuyGold = function(p_count, p_buy_gold) {
		// console.log('count : %d, buy_gold :', p_count, p_buy_gold);
		buy_gold_map.set(p_count, p_buy_gold);
	}
	inst.GetBuyGold = function(p_count) { return ( buy_gold_map.has(p_count) == true ) ? buy_gold_map.get(p_count) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;