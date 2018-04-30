/********************************************************************
Title : BaseRandomBox
Date : 2016.02.03
Update : 2017.03.28
Desc : BT 정보 - 랜덤박스
writer : jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Box = function() {
		this.box_id;
		this.rate;
		this.accum_rate;
		this.reward_type;
		this.item_id;
		this.effect_id;
		this.min_value;
		this.max_value;
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.RandomBoxGroup = function() {
		let Reward = function() {
			this.item_type = 0;
			this.item_id = 0;
			this.item_count = 0;
		}

		this.box_group_id;
		this.max_rate;

		this.box_map = new HashMap();

		this.AddBox = function (p_box_id, p_rate, p_box) {
			// console.log('AddBox box_id: %d, box:', p_box_id, p_box);
			this.max_rate = ( typeof this.max_rate === 'undefined' ) ? p_rate : this.max_rate + p_rate;
			p_box.accum_rate = this.max_rate;

			this.box_map.set(p_box_id, p_box);
		}

		// 박스에서 하나 가져오기.
		this.SelectBox = function () {
			let box_array = this.box_map.keys();
			// console.log('box_array:', box_array);

 			let cutting_value = 10;			
			let rand = Rand.inst.RandomRange(0, this.max_rate);

			let reward;
			
			for ( let cnt = 0; cnt < box_array.length; ++cnt ) {
				let box = this.box_map.get(box_array[cnt]);
				// console.log('cnt: %d, rand: %d, box.accum_rate: %d', cnt, rand, box.accum_rate);
				if ( box.accum_rate > rand ) {
					reward = new Reward();
					reward.item_type	= box.reward_type;
					reward.item_id		= box.item_id;
					reward.item_count	= Rand.inst.RandomRange(box.min_value, box.max_value);

					if ( reward.item_count > cutting_value )
						reward.item_count = Math.floor(reward.item_count / cutting_value ) * cutting_value;
					break;
				}
			}
			return reward;
		}
	}

	var random_box_map = new HashMap();

	inst.AddRandomBoxGroup = function(p_group_id, p_box_group) { random_box_map.set(p_group_id, p_box_group); }
	inst.GetRandomBoxGroup = function(p_group_id) { return (random_box_map.has(p_group_id) == true) ? random_box_map.get(p_group_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;