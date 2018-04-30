배틀 매니저.

하는 일

배틀 보상 정보 만들기

유저 경험치
영웅 경험치
보상 아이템
소비 스테미너


일반(시나리오) 배틀에서 배틀 시작 할때 사용
배틀 중에 획득 아이템 연출 때문에 보상 아이템을 만들어 둔다.
배늘 종료 할때 사용해서 보상을 준다.


일반(시나리오) 배틀 소탕에서 배틀 시작 할때 사용
소탕 전용 보상이 있고
소탕 횟수 만큼 보상아이템을 그룹으로 만든다.


어떻게 보면 일반 배틀은 보상 그룹을 한개로 해도 되잔아 !!!!!!!!!!!

/********************************************************************
Title : BattleMgr
Date : 2015.09.24
Update : 2017.02.16
Desc : 배틀 정보, 보상 생성
writer: dongsu
********************************************************************/
var BaseItemRe			= require('../../Data/Base/BaseItemRe.js');
var BaseStage			= require('../../Data/Base/BaseStage.js');
var BaseStageDropGroup	= require('../../Data/Base/BaseStageDropGroup.js');

var DefineValues = require('../../Common/DefineValues.js');

(function (exports) {
	// private 변수
	//------------------------------------------------------------------------------------------------------------------
	var BattleInfo = function() {
		this.uuid;
		this.chapter_id;
		this.chapter_type;
		this.stage_id;
		this.need_stamina;
		this.first_enter_chapter;
		this.first_enter_stage;
		this.reward_info = new BattleRewardInfo();	// BaseRewardGroup
	}

	var battle_info_map = new HashMap();	// key : uuid, value : BattleData.BattleInfo

	//------------------------------------------------------------------------------------------------------------------
	var BattleRewardInfo = function() {
		this.BattleRewardItem = function() {
			this.item_id;
			this.item_count;
			this.item_category1;
			this.equip_status_id;
		}

		this.reward_account_exp;
		this.reward_hero_exp;
		this.reward_gold;
		this.reward_item_list = new Array();

		this.AddItem = function(p_item_id, p_item_count, p_group_id) { // not use group id
			// 2017.02.14 수정 - Promise에서 loop를 사용하기 위해서 Array로 만든다.
			// filter 메서드(Array)(JavaScript) 사용 - https://msdn.microsoft.com/ko-kr/library/ff679973(v=vs.94).aspx
			let find_item = this.reward_item_list.filter(function (value) {
				return ( value.item_id == p_item_id );
			});

			// 보상 아이템이 없는 경우
			if ( find_item.length == 0 ) {
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
				// 보상 아이템이 정비 아이템일 경우(장비는 겹칠 수 없다.)
				if ( find_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
					let reward_item				= new this.BattleRewardItem();
					reward_item.item_id			= p_item_id;
					reward_item.item_count		= p_item_count;
					reward_item.item_category1	= DefineValues.inst.FirstCategoryEquipment;

					this.reward_item_list.push(reward_item);
				} else {
					// 보상 아이템이 장비가 아닌 경우
					for ( let cnt in find_item )
						find_item[cnt].item_count = find_item[cnt].item_count + p_item_count;
				}
			}
		}

		this.GetRewardAllItemList = function() { return this.reward_item_list; }
	}

	// public 
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.CreateBattle = function(p_uuid, p_chapter_id, p_chapter_type, p_stage_id, p_first_enter_chapter, p_first_enter_stage) { 
		if ( battle_info_map.has(p_uuid) == true ) {
			battle_info_map.remove(p_uuid);
		}

		let battle_info			= new BattleInfo();
		battle_info.uuid		= p_uuid;
		battle_info.chapter_id	= p_chapter_id;
		battle_info.chapter_type= p_chapter_type;
		battle_info.stage_id	= p_stage_id;

		let stage_base = BaseStage.inst.GetBaseStage(p_stage_id);

		// console.log('stage_base', stage_base);
		if ( stage_base != undefined ) {
			battle_info.need_stamina					= stage_base.need_stamina;
			battle_info.reward_info.reward_account_exp	= stage_base.reward_account_exp;
			battle_info.reward_info.reward_hero_exp		= stage_base.reward_hero_exp;
			battle_info.reward_info.reward_gold			= stage_base.reward_gold;
			logger.info('배틀 기본 정보 - acc exp : %d, set exp : %d, first_enter_stage :', stage_base.reward_account_exp, battle_info.reward_info.reward_account_exp, p_first_enter_stage);

			if( p_first_enter_stage == true ) {
				stage_base.GetFristClearRewardAllItem().forEach(function (value, key) {
					battle_info.reward_info.AddItem(value.item_id, value.item_count);
				});
			} else {
				// 일반 배틀 보상은 그룹이 한개.
				let group_id = 0;
				MakeRandomItem(stage_base, battle_info.reward_info, group_id);
			}

			battle_info.first_enter_chapter	= p_first_enter_chapter;
			battle_info.first_enter_stage	= p_first_enter_stage;
		}

		// map 에 세팅...
		logger.info('배틀 정보 만들기 UUID %d, chapter ID : %d, stage id : %d',  battle_info.uuid, battle_info.chapter_id, battle_info.stage_id);
		logger.info('배틀 정보 보상 정보 acc exp : %d, hero exp : %d, gold : %d', battle_info.reward_info.reward_account_exp, battle_info.reward_info.reward_hero_exp, battle_info.reward_info.reward_gold);

		battle_info.reward_info.GetRewardAllItemList().map( item => {
			logger.info('배틀 보상. 아이템 item id : %d, item count : %d', item.item_id, item.item_count);
		});
		
		battle_info_map.set(battle_info.uuid, battle_info); 
	}
	inst.GetBattle = function(p_uuid) { return ( battle_info_map.has(p_uuid) == true ) ? battle_info_map.get(p_uuid) : undefined; }
	inst.DelBattle = function(p_uuid) { battle_info_map.remove(p_uuid); }
	inst.CheckExistBattleInfo = function(p_uuid) { return battle_info_map.has(p_uuid); }

	//-------------------------------------------------------------------------------------------------------------------------
	var SweepInfo = function() {
		this.RewardGroup = function() {
			this.Item = function() {
				this.sweep_exclusive;
				this.item_id;
				this.item_count;
			}

			this.reward_item_list = new HashMap();

			this.AddItem = function(p_item_id, p_item_count, p_sweep_exclusive) {
				if ( this.reward_item_list.has(p_item_id) == true ) {
					var reward_item = this.reward_item_list.get(p_item_id);
					reward_item.item_count = reward_item.item_count + p_item_count;
				} else {
					var reward_item = new this.Item();
					reward_item.item_id			= p_item_id;
					reward_item.item_count		= p_item_count;
					reward_item.sweep_exclusive	= p_sweep_exclusive;

					this.reward_item_list.set(p_item_id, reward_item);
				}
			}
			this.GetAllItem = function() { return this.reward_item_list; }
		}

		this.need_stamina;
		this.reward_account_exp;
		this.reward_gold;

		this.reward_group = new HashMap();

		this.AddItem = function(p_item_id, p_item_count, p_group_id, p_sweep_exclusive) {
			if ( this.reward_group.has(p_group_id) == false ) {
				var temp_group = new this.RewardGroup();
				temp_group.AddItem(p_item_id, p_item_count, p_sweep_exclusive);
				this.reward_group.set(p_group_id, temp_group);
			} else {
				var temp_group = this.reward_group.get(p_group_id);
				temp_group.AddItem(p_item_id, p_item_count, p_sweep_exclusive);
			}
		}
		this.GetAllRewardGroup = function() { return this.reward_group; }
	}

	// 소탕 보상 아이템 추가 후 일반 보상 아이템을 추가 한다.
	inst.SweepReward = function(p_chapter_id, p_stage_id, p_sweep_count) {
		var stage_base = BaseStage.inst.GetBaseStage(p_stage_id);
		if ( stage_base != undefined ) {
			var sweep_info = new SweepInfo();

			sweep_info.need_stamina		= stage_base.need_stamina * p_sweep_count;
			sweep_info.reward_account_exp	= stage_base.reward_account_exp * p_sweep_count;
			sweep_info.reward_gold			= stage_base.reward_gold * p_sweep_count;
			
			for ( var cnt = 0; cnt < p_sweep_count; cnt++ ) {
				stage_base.GetSweepRewardAllItem().forEach(function (value, key) {
					sweep_info.AddItem(value.item_id, value.item_count, cnt, true);
				});

				MakeRandomItem(stage_base, sweep_info, cnt, false);
			}
			return sweep_info;
		}

		return undefined;
	}
	// private function
	var MakeRandomItem = function(p_stage_base, p_obj, p_group_id, p_sweep_exclusive) {
		var drop_group = BaseStageDropGroup.inst.GetStageDropItemGroup(p_stage_base.drop_item_group_id);
		if ( drop_group == undefined )
		{
			logger.info('Not Find Drop Group - Drop Group : %d ', p_group_id);
			return;
		}

		// console.log('group_id : %d, drop_group', p_stage_base.drop_item_group_id, drop_group);
		var loop_count = Rand.inst.RandomRange(drop_group.drop_count_range_min, drop_group.drop_count_range_max);
		// console.log('MakeRandomItem loop_count : %d', loop_count);

		for ( var gl = 1; gl <= loop_count; gl++ ) {
			// console.log('drop group total range', drop_group.total_range);
			var random = Rand.inst.RandomRange(1, drop_group.total_range);
			var temp = 0;
			for ( var dil = 1; dil <= drop_group.drop_item_map.count(); dil++ ) {
				var drop_item = drop_group.GetDropItem(dil);
				// console.log('%d - %d drop_item', gl, dil, drop_item);
				if ( drop_item != undefined ) {
					temp = temp + drop_item.item_range;
					// console.log('%d - %d MakeRandomItem temp : %d, random : %d', gl, dil, temp, random);
					if ( temp > random ) {
						p_obj.AddItem(drop_item.item_id, 1, p_group_id, p_sweep_exclusive);
						break;
					}
				}
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;