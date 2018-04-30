/********************************************************************
Title : BattleMgr
Date : 2015.09.24
Update : 2017.03.14
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
	var Item = function() {
		this.item_id;
		this.item_count;
		this.item_category1;	// 장비아이템 구분을 위해서 category1이 필요하다.
		this.equip_status_id;
	}

	//------------------------------------------------------------------------------------------------------------------
	var RewardItem = function() {
		this.item_list = new Array();

		this.findItem = function(p_item_id) {
			for ( let cnt = 0; cnt < this.item_list.length; ++ cnt ) {
				if ( this.item_list[cnt].item_id == p_item_id )
					return this.item_list[cnt];
			}
			return undefined;
		}

		this.AddItem = function(p_item_id, p_item_count) {
			let find_item = this.findItem(p_item_id);

			// 보상 아이템이 없는 경우
			if ( typeof find_item === 'undefined' ) {
				let item = new Item();
				item.item_id	= p_item_id;
				item.item_count	= p_item_count;

				let base_item = BaseItemRe.inst.GetItem(p_item_id);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_item_id ]);

				item.item_category1 = base_item.category1;
				item.equip_status_id = base_item.equip_status_id;

				this.item_list.push(item);
			} else {
				// 장비 아이템이면 새로 만든다.
				if ( find_item.item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
					let item			= new Item();
					item.item_id		= p_item_id;
					item.item_count		= p_item_count;
					item.item_category1	= find_item.item_category1;
					item.equip_status_id= find_item.equip_status_id;

					this.item_list.push(item);
				} else {
					// 보상 아이템이 장비가 아닌 경우
					find_item.item_count = find_item.item_count + p_item_count;
				}
			}
		}

		this.GetItemList = function() { return this.item_list; }
	}

	//------------------------------------------------------------------------------------------------------------------
	var BattleInfo = function() {
		this.uuid;
		this.chapter_id;
		this.chapter_type;
		this.stage_id;
		this.need_stamina;
		this.first_enter_chapter;
		this.first_enter_stage;
		
		this.reward_account_exp;
		this.reward_hero_exp;
		this.reward_gold;

		this.reward_item = new RewardItem();	// RewardItemGroup
	}

	var battle_info_map = new HashMap();	// key : uuid, value : BattleData.BattleInfo

	//-------------------------------------------------------------------------------------------------------------------------
	// private function
	var MakeRandomItem = function(p_drop_item_group_id, p_item_group) {
		var drop_group = BaseStageDropGroup.inst.GetStageDropItemGroup(p_drop_item_group_id);
		if ( drop_group == undefined ) {
			throw ([ 'Not Find Drop Group - Drop Group : %d ', p_drop_item_group_id ]);
		}

		// console.log('group_id : %d, drop_group', p_drop_item_group_id, drop_group);
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
						let item_count = 1;
						p_item_group.AddItem(drop_item.item_id, item_count);
						console.log('%d - %d drop_item', gl, dil, drop_item);
						break;
					}
				}
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	// public 
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.CreateBattle = function(p_uuid, p_chapter_id, p_chapter_type, p_stage_id, p_first_enter_chapter, p_first_enter_stage) { 
		if ( battle_info_map.has(p_uuid) == true ) {
			battle_info_map.remove(p_uuid);
		}

		let base_stage = BaseStage.inst.GetBaseStage(p_stage_id);
		if ( typeof base_stage === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist Stage Info In Base StageID', p_stage_id ]);

		let battle_info = new BattleInfo();
		battle_info.uuid				= p_uuid;
		battle_info.chapter_id			= p_chapter_id;
		battle_info.chapter_type		= p_chapter_type;
		battle_info.stage_id			= p_stage_id;
		battle_info.first_enter_chapter	= p_first_enter_chapter;
		battle_info.first_enter_stage	= p_first_enter_stage;

		battle_info.need_stamina		= base_stage.need_stamina;
		battle_info.reward_account_exp	= base_stage.reward_account_exp;
		battle_info.reward_hero_exp		= base_stage.reward_hero_exp;
		battle_info.reward_gold			= base_stage.reward_gold;
		
		logger.info('배틀 기본 정보 - acc exp : %d, set exp : %d, first_enter_stage :', base_stage.reward_account_exp, battle_info.reward_account_exp, p_first_enter_stage);

		// console.log('base_stage', base_stage);
		if( p_first_enter_stage == true ) {
			// 스테이지 최초 클리어 보상
			base_stage.GetFristClearRewardAllItem().forEach(function (value, key) {
				battle_info.reward_item.AddItem(value.item_id, value.item_count);
			});
		}

		// 일반 배틀 보상 그룹은 한개.
		let group_cnt = 0;
		MakeRandomItem(base_stage.drop_item_group_id, battle_info.reward_item, group_cnt);

		// map 에 세팅...
		logger.info('배틀 정보 만들기 UUID %d, chapter ID : %d, stage id : %d',  battle_info.uuid, battle_info.chapter_id, battle_info.stage_id);
		logger.info('배틀 정보 보상 정보 acc exp : %d, hero exp : %d, gold : %d', battle_info.reward_account_exp, battle_info.reward_hero_exp, battle_info.reward_gold);

		battle_info.reward_item.GetItemList().map( item => {
			logger.info('배틀 보상. 아이템 item id : %d, item count : %d', item.item_id, item.item_count);
		});
		
		battle_info_map.set(battle_info.uuid, battle_info); 
	}
	inst.GetBattle = function(p_uuid) { return ( battle_info_map.has(p_uuid) == true ) ? battle_info_map.get(p_uuid) : undefined; }
	inst.DelBattle = function(p_uuid) { battle_info_map.remove(p_uuid); }
	inst.CheckExistBattleInfo = function(p_uuid) { return battle_info_map.has(p_uuid); }

	//-------------------------------------------------------------------------------------------------------------------------
	var SweepInfo = function() {
		// 소탕 전용 아이템 보상
		this.sweep_reward_item = new RewardItem();

		// 그룹 보상
		this.reward_item_list = new Array();

		this.AddSweepItem = function(p_item_id, p_item_count) {
			this.sweep_reward_item.AddItem(p_item_id, p_item_count);
		}

		this.GetSweepRewardItem = function() { return this.sweep_reward_item; }
		this.GetRewardItemGroup = function() { return this.reward_item_list; }
	}

	//-------------------------------------------------------------------------------------------------------------------------
	// 소탕 보상 아이템 추가 후 일반 보상 아이템을 추가 한다.
	// 일반 보상 아이템이 소탕 횟수 만큼 그룹으로 추가 된다.
	inst.SweepReward = function(p_chapter_id, p_stage_id, p_sweep_count) {
		let base_stage = BaseStage.inst.GetBaseStage(p_stage_id);
		if ( typeof base_stage === 'undefined' )
			return undefined;

		let sweep_info = new SweepInfo();

		// 1. 소탕 횟수 만큼 소탕 아이템 더해준다.
		// 2. 소탕 횟수 만큼 클리어 보상 만든다.
		for ( let group_cnt = 0; group_cnt < p_sweep_count; ++group_cnt ) {
			// 소탕 전용 - 소탕 횟수 만큼 카운트를 더한다.
			base_stage.GetSweepRewardAllItem().forEach(function (value, key) {
				// console.log('SweepItem item_id : %d, item_count : %d', value.item_id, value.item_count);
				sweep_info.AddSweepItem(value.item_id, value.item_count);
			});

			// 그룹 보상
			let reward_item = new RewardItem();
			sweep_info.reward_item_list.push(reward_item);

			MakeRandomItem(base_stage.drop_item_group_id, reward_item);
		}

		return sweep_info;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;