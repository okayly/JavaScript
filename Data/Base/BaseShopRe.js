/********************************************************************
Title : BaseShopRe
Date : 2016.04.15
Update : 2016.08.01
Desc : BT 정보 - 모든 Shop 정보
writer: jongwook
********************************************************************/
var DefineValues = require('../../Common/DefineValues.js');

var moment = require('moment');

(function(exports) {
	// private 변수
	var ShopItem = function() {
		this.item_id;
		this.buy_cost_type;
		this.item_count;
	}

	// public
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	// Shop
	inst.Shop = function() {
		this.shop_id;
		this.level_min;
		this.level_max;
		this.items = [];

		this.AddShopItem = function(p_id, p_buy_cost_type, p_count) {
			var item			= new ShopItem();
			item.item_id		= p_id;
			item.buy_cost_type	= p_buy_cost_type;
			item.item_count		= p_count;

			this.items.push(item);
		}
		this.GetShopItems = function() { return this.items; }
		this.GetShopItem = function(p_slot) {
			return ( p_slot < 0 || p_slot >= this.items.length ) ? undefined : this.items[p_slot];
		}
	}

	// Shop map
	var normal_shop_map		= new HashMap();
	var pvp_shop_map		= new HashMap();
	var guild_shop_map		= new HashMap();
	var random_shop_map		= new HashMap();
	var challenge_shop_map	= new HashMap();

	// Shop
	inst.AddShop = function(p_shop_type, p_shop_id, p_shop) {
		var shop_map = undefined;
		switch ( p_shop_type ) {
			case DefineValues.inst.NormalShop		: shop_map = normal_shop_map;	break;
			case DefineValues.inst.PvpShop		: shop_map = pvp_shop_map;		break;
			case DefineValues.inst.GuildShop		: shop_map = guild_shop_map;	break;
			case DefineValues.inst.RandomShop		: shop_map = random_shop_map;	break;
			case DefineValues.inst.ChallengeShop	: shop_map = challenge_shop_map;break;
		}

		if ( typeof shop_map !== 'undefined' ) {
			if ( shop_map.has(p_shop_id) == false ) {
				shop_map.set(p_shop_id, p_shop);
			} else {
				logger.error('error AddShop already shop_id', p_shop_id);
			}
		} else {
			logger.error('error shop_type', p_shop_type);
		}
	}

	inst.GetShop = function(p_shop_type, p_shop_id) {
		switch ( p_shop_type ) {
			case DefineValues.inst.NormalShop		: return ( normal_shop_map.has(p_shop_id) == true )		? normal_shop_map.get(p_shop_id)	: undefined;
			case DefineValues.inst.RandomShop		: return ( random_shop_map.has(p_shop_id) == true )		? random_shop_map.get(p_shop_id)	: undefined;
			case DefineValues.inst.PvpShop		: return ( pvp_shop_map.has(p_shop_id) == true )		? pvp_shop_map.get(p_shop_id)		: undefined;
			case DefineValues.inst.GuildShop		: return ( guild_shop_map.has(p_shop_id) == true )		? guild_shop_map.get(p_shop_id)		: undefined;
			case DefineValues.inst.ChallengeShop	: return ( challenge_shop_map.has(p_shop_id) == true )	? challenge_shop_map.get(p_shop_id)	: undefined;
		}

		logger.error('error shop_type', p_shop_type);
		return undefined;
	}

	inst.GetShopMap = function(p_shop_type) {
		switch ( p_shop_type ) {
			case DefineValues.inst.NormalShop		: return normal_shop_map;
			case DefineValues.inst.RandomShop		: return random_shop_map;
			case DefineValues.inst.PvpShop		: return pvp_shop_map;
			case DefineValues.inst.GuildShop		: return guild_shop_map;
			case DefineValues.inst.ChallengeShop	: return challenge_shop_map;
		}
	}

	inst.GetShopID = function(p_user_level, p_shop_type, p_old_id) {
		console.log('GetShopID user_level: %d, shop_type: %d, old_id: %d', p_user_level, p_shop_type, p_old_id);
		var shop_map = inst.GetShopMap(p_shop_type);
		if ( typeof shop_map === 'undefined' ) {
			logger.error('error GetShopID shop_type', p_shop_type);
			return undefined;
		}

		var new_shop_ids = [];
		shop_map.forEach(function (value, key) {
			// console.log('shop_id: %d, old_id: %d, level_min: %d, level_max: %d',key, p_old_id, value.level_min, p_user_level, value.level_max);
			if ( (key != p_old_id) && (value.level_min <= p_user_level) && (value.level_max >= p_user_level) ) {
				new_shop_ids.push(key);
			}
		});

		// console.log('new_shop_ids -', new_shop_ids);
		var ret_rand= Rand.inst.RandomRange(0, new_shop_ids.length - 1);
		var new_id	= ( ret_rand >= new_shop_ids.length ) ? undefined : new_shop_ids[ret_rand];
		new_shop_ids= null;

		return new_id;
	}

	//------------------------------------------------------------------------------------------------------------------
	// ShopTime
	inst.ShopTime = function() {
		this.time_id;
		this.reset_time;		
	}

	// ShopTime map
	var reset_time_map = new HashMap();

	// ShopTime
	inst.AddShopTime = function(p_time_id, p_time) {
		if ( reset_time_map.has(p_time_id) == false ) {
			reset_time_map.set(p_time_id, p_time);
		} else {
			logger.error('error AddShopTime already time_id', p_time_id);
		}
	}
	inst.GetShopTimeMap = function() { return reset_time_map; }

	// 현재 시간의 상점 ResetTime ID얻기
	inst.GetResetTimeID = function() {
		var before	= undefined;		// 현재 reset_time
		var after	= undefined;		// 다음 reset_time
		var time_id	= 0;

		var now = moment();

		reset_time_map.forEach(function (value, key) {
			var hm_array = value.reset_time.split(':');	// time string to time array [hour][minutes]
			var src_time = moment().hours(hm_array[0]).minutes(hm_array[1]).seconds('00');	// 오늘 날짜에 시:분:초 가 된다.

			// 현재 시간을 기준으로 바로 이전 시간을 찾는다.
			if ( src_time.isBefore(now) || src_time.isSame(now) ) {
				if ( typeof before === 'undefined' ) {
					before = src_time
					time_id = key;
					// console.log('before === undefined key: %d', this.reset_time_id);
				} else {
					if ( src_time.isAfter(before) ) {
						before = src_time;
						time_id = key;
						// console.log('before !== undefined key: %d', this.reset_time_id);
					}
				}
			}
		});

		return time_id;
	}

	// 상점 다음 리셋까지 남은 시간
	inst.GetResetRemainTime = function(p_time_id) {
		// console.log('p_time_id', p_time_id);
		var next_time_id = p_time_id + 1;

		if ( next_time_id > reset_time_map.count() )
			next_time_id = 1;

		var next_hm = reset_time_map.get(next_time_id);
		if ( typeof next_hm === 'undefined' ) {
			logger.error('error GetResetRemainTime next_time_id', next_time_id);
			return 60*60*3;
		}
		// console.log('next_hm', next_hm);

		var hm_array = next_hm.reset_time.split(':');	// time string to time array [hour][minutes]
		var next_time = moment().hours(hm_array[0]).minutes(hm_array[1]).seconds('00');	// 오늘 날짜에 시:분:초 가 된다.

		// 다음 날
		if (next_time_id == 1)
			next_time.add(1, 'days');

		return next_time.diff(moment(), 'seconds');
	}

	//------------------------------------------------------------------------------------------------------------------
	// ShopHeroExp : 영웅 경험치 스크롤 판매 - 영웅 레벨 업 관리 창에서 사용한다.
	inst.ShopHeroExp = function() {
		this.item_id;
		this.need_cash;
		this.limit_level;
	}

	// HeroExp
	var hero_exp_map = new HashMap();

	// ShopHeroExp
	inst.AddShopHeroExp = function(p_item_id, p_shop_hero_exp) {
		if ( hero_exp_map.has(p_item_id) == false ) {
			hero_exp_map.set(p_item_id, p_shop_hero_exp);
		} else {
			logger.error('error AddShopHeroExp already item_id', p_item_id);
		}
	}
	inst.GetShopHeroExp = function(p_item_id) {
		return ( hero_exp_map.has(p_item_id) == true ) ? hero_exp_map.get(p_item_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// ShopResetCash
	inst.ShopResetCost = function() {
		this.reset_count;
		this.need_cash;
	}

	// ResetCost
	var reset_cost_map = new HashMap();

	// ResetCost
	inst.AddShopResetCost = function(p_reset_count, p_reset_cost) {
		if ( reset_cost_map.has(p_reset_count) == false ) {
			reset_cost_map.set(p_reset_count, p_reset_cost);
			// console.log('AddShopResetCost reset_count: %d, reset_cost:', p_reset_count, p_reset_cost);
		} else {
			logger.error('error AddShopResetCost already reset_count', p_reset_count);
		}
	}
	inst.GetShopResetCost = function(p_reset_count) {
		if ( p_reset_count > reset_cost_map.count() )
			p_reset_count = reset_cost_map.count();

		return ( reset_cost_map.has(p_reset_count) != false ) ? reset_cost_map.get(p_reset_count) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;