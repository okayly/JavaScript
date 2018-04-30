/********************************************************************
Title : BaseWeeklyDungeon
Date : 2016.11.28
Update : 2017.02.23
Desc : BT_ 정보 - 요일 스테이지
writer: dongsu
********************************************************************/
var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var DefineValues = require('../../Common/DefineValues.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.BaseWeeklyDungeon = function() {
		this.BattleRewardItem = function() {
			this.item_id;
			this.item_count;
			this.item_category1;	// 장비아이템 구분을 위해서 category1이 필요하다.
			this.equip_status_id;
		}

		this.dungeon_id;	// bt stage_id 와 대응. 
		this.open_week;
		this.account_limit_open_level;
		this.need_stamina;
		this.reward_account_exp;
		this.reward_hero_exp;
		this.reward_gold;

		this.reward_item_map = new HashMap();

		// Promise 에서 사용하기 위함
		this.reward_item_list = new Array();

		this.AddRewardItem = function(p_item_id, p_item_count) {
			if ( p_item_id == 0 )
				return;

			// 2017.02.23 수정 - Promise에서 loop를 사용하기 위해서 Array로 만든다.
			// filter 메서드(Array)(JavaScript) 사용 - https://msdn.microsoft.com/ko-kr/library/ff679973(v=vs.94).aspx
			let find_item_list = this.reward_item_list.filter(function (value) {
				return ( value.item_id == p_item_id );
			});

			// 보상 아이템이 없는 경우
			if ( find_item_list.length == 0 ) {
				let reward_item = new this.BattleRewardItem();
				reward_item.item_id		= p_item_id;
				reward_item.item_count	= p_item_count;

				let base_item = BaseItemRe.inst.GetItem(p_item_id);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_item_id ]);

				reward_item.item_category1 = base_item.category1;
				reward_item.equip_status_id = base_item.equip_status_id;

				this.reward_item_list.push(reward_item);
			} else {
				// 리턴이 [] 이지만 처리는 한개처럼(이거 바꾸자)
				if ( find_item_list[0].item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
					let reward_item				= new this.BattleRewardItem();
					reward_item.item_id			= p_item_id;
					reward_item.item_count		= p_item_count;
					reward_item.item_category1	= find_item_list[0].item_category1;
					reward_item.equip_status_id	= find_item_list[0].equip_status_id;

					this.reward_item_list.push(reward_item);
				} else {
					// 보상 아이템이 장비가 아닌 경우					
					find_item_list[0].item_count = find_item_list[0].item_count + p_item_count;
				}
			}
		}
		this.GetRewardAllItemList = function() { return this.reward_item_list; }
	}

	var stage_map = new HashMap();	// key : stage_id, value : BaseChallengeStage

	inst.AddBaseWeeklyDungeon = function(p_stage_id, p_dungeon) {
		// console.log('AddBaseWeeklyDungeon', p_stage_id, p_dungeon);
		stage_map.set(p_stage_id, p_dungeon);
	}
	inst.GetBaseWeeklyDungeon = function(p_dungeon_id) { 
		return (stage_map.has(p_dungeon_id) == true) ? stage_map.get(p_dungeon_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;