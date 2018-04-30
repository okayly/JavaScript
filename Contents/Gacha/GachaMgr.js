/********************************************************************
Title : GachaMgr
Date : 2016.08.02
Update : 2017.04.14
Desc : 가챠 아이템 생성 리스트
writer: dongsu -> jongwook
********************************************************************/
var DefineValues = require('../../Common/DefineValues.js');

var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public 
	var inst = {};

	//-------------------------------------------------------------------------------------------------------------------------
	var GachaInfo = function() {
		this.Item = function() {
			this.item_type;
			this.item_id;
			this.item_count;
		}

		this.gacha_id;
		this.need_gold;
		this.need_cash;
		this.exec_count;
		this.now_date;

		// 가챠 전체 목록
		this.gacha_list = new Array();
		this.hero_summon_id_list = new Array();	// 영웅 소환권 영웅 ID 리스트

		this.AddItem = function(p_item_id, p_item_count) {
			// console.log('가챠 인포 삽입 중. index : %d, item_id : %d, item_count : %d, category1 : %d', p_index, p_item_id, p_item_count, p_item_category1);
			let item = new this.Item();
			item.item_type	= DefineValues.inst.ItemReward;
			item.item_id	= p_item_id;
			item.item_count	= p_item_count;

			this.gacha_list.push(item);
		}
		this.AddHeroSummonID = function(p_hero_summon_id) {
			// console.log('AddHeroSummonID', p_hero_summon_id, this.hero_summon_id_list.indexOf(p_hero_summon_id));
			if ( this.hero_summon_id_list.indexOf(p_hero_summon_id) == -1 )
				this.hero_summon_id_list.push(p_hero_summon_id);

			// console.log('this.hero_summon_id_list', this.hero_summon_id_list);
		}

		this.GetAllHero = function() { return this.hero_list; }
		this.GetAllItem = function() { return this.item_list; }

		this.GetGachaList = function() { return this.gacha_list; }
	}

	//-------------------------------------------------------------------------------------------------------------------------
	var MakeRandomItem = function(p_gacha_id, p_target_group, p_index, p_result_obj) {
		let temp_value = 0;	// 확율 비교 용. 
		let rand_value = Rand.inst.RandomRange(1, p_target_group.total_percent);
		// console.log('보상 함수 시작 gacha id ' + p_gacha_id + ' Max 범위 ' + p_target_group.total_percent + ' 결과 값은 ', rand_value );

		for ( let cnt = 0; cnt < p_target_group.GetAllGachaItem().values().length; ++cnt ) {
			let value = p_target_group.GetAllGachaItem().values()[cnt];
			temp_value = temp_value + value.percent;

			if ( temp_value >= rand_value ) {
				// console.log('아이템 개별 확률 ' + value.percent + ' 현재 확율 ' + temp_value+ ' 아이템 ID : ' + value.item_id);				
				let base_item = BaseItemRe.inst.GetItem(value.item_id);
				if ( typeof base_item === 'undefined' ) {
					logger.error('GachaReward - gacha id : %d, item id : %d, not find base item!!!', p_gacha_id, value.item_id );
					break;
				}

				// 획득 아이템 수
				let give_count = 1;
				if ( base_item.category1 == DefineValues.inst.FirstCategoryHero && base_item.category2 == DefineValues.inst.SecondCategorySummonHero ) {
					p_result_obj.AddHeroSummonID(base_item.hero_id);
					console.log('%d : @영웅 소환권 획득. ID : %d, Count : %d', p_index, value.item_id, give_count);
				} else {
					give_count = Rand.inst.RandomRange(value.count_range_min, value.count_range_max);
					console.log('%d : 아이템 획득. ID : %d, Count : %d', p_index, value.item_id, give_count);
				}

				p_result_obj.AddItem(value.item_id, give_count);
				break;
			}
		}
	}

	//-------------------------------------------------------------------------------------------------------------------------
	inst.GachaReward = function(p_base_gacha, p_total_gacha_count, p_free) {
		console.log('GachaReward - total_gacha_count : %d, free : %d', p_total_gacha_count, p_free);

		if ( typeof p_base_gacha === 'undefined' )
			return undefined;

		let ret_obj = new GachaInfo();
		ret_obj.now_date = Timer.inst.GetNowByStrDate();
		ret_obj.exec_count = p_base_gacha.exec_count;

		if ( p_free == true ) {
			ret_obj.need_gold = 0;
			ret_obj.need_cash = 0;
		} else {
			ret_obj.need_gold = ( p_base_gacha.price_type == DefineValues.inst.GachaPriceTypeGold ) ? p_base_gacha.price : 0;
			ret_obj.need_cash = ( p_base_gacha.price_type == DefineValues.inst.GachaPriceTypeCash ) ? p_base_gacha.price : 0;
		}
		
		let comp_value	= parseInt(p_base_gacha.exec_count * p_base_gacha.chance_count);	// 확정 가챠 비교 용.
		let total_count	= parseInt(p_total_gacha_count); // 확정 가챠 비교 용.
		
		console.log('가챠 만들기 시작 total count : %d, comp value : %d', total_count, comp_value);

		for ( let count = 1; count <= p_base_gacha.exec_count; count++ ) {
			total_count++;
			
			let check_value = total_count % comp_value;
			// console.log('수행 가챠 확인 total_count : %d, check_value : %d', total_count, check_value);

			let target_group = undefined;
			if ( comp_value != 0 && check_value == 0 ) {
				console.log('%d 확정 가챠', count);
				target_group = p_base_gacha.GetChanceGachaItemGroup(p_base_gacha.chance_item_type);
			} else {
				console.log('%d 일반 가챠', count);
				target_group = p_base_gacha.GetNormalGachaItemGroup();
			}

			if ( typeof target_group !== 'undefined' ) {
				MakeRandomItem(p_base_gacha.gacha_id, target_group, count, ret_obj);
			} else {
				console.log('가챠 아이템 만들기 실패.');
			}
		}
		return ret_obj;	
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;