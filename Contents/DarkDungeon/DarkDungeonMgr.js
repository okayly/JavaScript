/********************************************************************
Title : DarkDungeonMgr
Date : 2016.12.19
Update : 2017.03.28
Desc : 어둠의 던전 매니저
writer: jongwook
********************************************************************/
var BaseItemRe = require('../../Data/Base/BaseItemRe.js');
var BaseDarkDungeon	= require('../../Data/Base/BaseDarkDungeon.js');
var BaseStageDropGroup	= require('../../Data/Base/BaseStageDropGroup.js');

var DefineValues = require('../../Common/DefineValues.js');

(function (exports) {
	// private
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 사용하는 곳 없다. 클라이언트가 계산
	inst.DarkDungeonResetRemainTime = function() {
		var start_data = '2016-12-16 16:18:00';
		var reset_time = 600;
		
		var diff_seconds = moment().diff(moment(start_data), 'seconds');
		var remain_time = reset_time - diff_seconds;

		console.log('diff_seconds : %d, remain_time : %d', diff_seconds, remain_time);

		if ( diff_seconds < reset_time ) {
			console.log('diff_seconds < %d', reset_time);
		} else {
			console.log('diff_seconds > %d', reset_time);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetRewardStageMainItemArray = function(p_chapter_id) {
		var base_chapter = BaseDarkDungeon.inst.GetDarkDungeonChapter(p_chapter_id);
		if ( typeof base_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter in Base DarkDungeon Chapter', recv_chapter_id);
			return;
		}

		var reward_item_list = [];

		for ( var cnt_stage = 0; cnt_stage < base_chapter.stage_array.length; ++cnt_stage ) {
			var stage_id = base_chapter.stage_array[cnt_stage];
			var base_stage = BaseDarkDungeon.inst.GetDarkDungeonStage(stage_id);

			if ( base_stage != undefined ) {
				// 스테이지 별 메인 보상은 장비 1개
				var reward_item_id = 0;
				var drop_group = BaseStageDropGroup.inst.GetStageDropItemGroup(base_stage.main_item_drop_group_id);				
				var random = Rand.inst.RandomRange(1, drop_group.total_range);

				// console.log('gl : %d random : %d', gl, random);
				var sum_range = 0;
				for ( var dil = 1; dil <= drop_group.drop_item_map.count(); dil++ ) {
					var drop_item = drop_group.GetDropItem(dil);
					// console.log('%d - %d drop_item_id', gl, dil, drop_item.item_id);

					if ( drop_item != undefined ) {
						sum_range = sum_range + drop_item.item_range;
						// console.log('%d - %d sum_range : %d, random : %d', gl, dil, sum_range, random);
						if ( sum_range > random ) {
							reward_item_list.push(drop_item.item_id);
							break;
						}
					}
				}
			}
		}

		return reward_item_list;
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetRewardStageSubItemList = function(p_drop_item_group_id) {
		let RewardItem = function() {
			this.item_id;
			this.item_count;
			this.item_category1;
			this.equip_status_id;
		}

		// 2017.02.17 - Promise에서 loop callback을 위해서 Array로 만든다.
		let reward_item_list = new Array();

		var AddItem = function(p_item_id, p_item_count) {
			// console.log('AddItem', p_item_id, p_item_count);
			// filter 메서드(Array)(JavaScript) 사용 - https://msdn.microsoft.com/ko-kr/library/ff679973(v=vs.94).aspx
			let find_item_list = reward_item_list.filter(function (value) {
				return ( value.item_id == p_item_id );
			});
			// console.log('find_item_list', find_item_list);

			// 보상 아이템이 없는 경우
			if ( find_item_list.length == 0 ) {
				let reward_item = new RewardItem();
				reward_item.item_id		= p_item_id;
				reward_item.item_count	= p_item_count;

				let base_item = BaseItemRe.inst.GetItem(p_item_id);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_item_id ]);

				reward_item.item_category1 = base_item.category1;
				reward_item.equip_status_id = base_item.equip_status_id;

				// console.log('New Item', reward_item);
				reward_item_list.push(reward_item);
			} else {
				// 리턴이 [] 이지만 처리는 한개처럼(이거 바꾸자)
				if ( find_item_list[0].item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
					let reward_item				= new RewardItem();
					reward_item.item_id			= p_item_id;
					reward_item.item_count		= p_item_count;
					reward_item.item_category1	= find_item_list[0].item_category1;
					reward_item.equip_status_id = find_item_list[0].equip_status_id;

					reward_item_list.push(reward_item);
					// console.log('New Equip Item', reward_item);
				} else {
					find_item_list[0].item_count = find_item_list[0].item_count + p_item_count;
					// console.log('Update Item', find_item_list[0]);
				}
			}
		}

		let drop_group = BaseStageDropGroup.inst.GetStageDropItemGroup(p_drop_item_group_id);
		// console.log('drop_group', drop_group);
		let loop_count = Rand.inst.RandomRange(drop_group.drop_count_range_min, drop_group.drop_count_range_max);
		
		// console.log('loop_count : %d drop_group : ', loop_count, drop_group);
		for ( let gl = 1; gl <= loop_count; gl++ ) {
			let random = Rand.inst.RandomRange(1, drop_group.total_range);
			// console.log('gl : %d random : %d', gl, random);
			let sum_range = 0;
			for ( let dil = 1; dil <= drop_group.drop_item_map.count(); dil++ ) {
				let drop_item = drop_group.GetDropItem(dil);
				// console.log('%d - %d drop_item_id', gl, dil, drop_item.item_id);
				if ( drop_item != undefined ) {
					sum_range = sum_range + drop_item.item_range;					
					// console.log('%d - %d sum_range : %d, random : %d', gl, dil, sum_range, random);
					if ( sum_range > random ) {
						AddItem(drop_item.item_id, 1);
						break;
					}
				}
			}
		}

		return reward_item_list;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;