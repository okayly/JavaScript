/********************************************************************
Title : BT_Stage
Date : 2015.11.06
Update : 2016.07.21
Desc : BT 로더 - Stage
writer: jong wook
********************************************************************/
var BaseChapter	= require('../../Data/Base/BaseChapter.js'); 
var BaseStage	= require('../../Data/Base/BaseStage.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadSenarioChapter = function (p_bt_chapter, p_bt_stage) {
		logger.debug('*** Start LoadSenarioChapter ***');

		// BT_CHAPTER select
		p_bt_chapter.findAll({
			order : 'CHAPTER_ID asc'
		})
		.then(function (p_ret_chapter) {
			for ( var cnt in p_ret_chapter ) {
				(function (cnt) {
					var chapter_data = p_ret_chapter[cnt];

					var base_chapter = new BaseChapter.inst.BaseChapter();
					base_chapter.chapter_id	= chapter_data.CHAPTER_ID;
					base_chapter.chapter_type	= chapter_data.CHAPTER_TYPE;
					base_chapter.open_cost 	= chapter_data.CHAPTER_OPEN_COST;

					for ( var box_index = 1; box_index <=3; ++box_index ) {
						(function (box_index) {
							var reward_box = new BaseChapter.inst.RewardBox();
							reward_box.cash = chapter_data['CR' + box_index + '_CASH'];
							reward_box.gold = chapter_data['CR' + box_index + '_GOLD'];
							// 아이고 컬럼이름이 START다...STAR 가 맞다..
							reward_box.need_star = chapter_data['NEED_START_COUNT' + box_index];

							for ( var item_index = 1; item_index <= 2; ++item_index ) {
								(function (item_index) {
									reward_box.AddItem(item_index, chapter_data['CR' + box_index + '_ITEM' + item_index], chapter_data['CR' + box_index + '_ITEM' + item_index + '_COUNT'] );
								})(item_index);
							}

							base_chapter.AddRewardBox(box_index, reward_box);
						})(box_index);
					}

					BaseChapter.inst.AddBaseChapter(chapter_data.CHAPTER_ID, base_chapter);

					// Load Stage
					LoadBTStage(p_bt_stage, base_chapter);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadSenarioChapter!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTStage = function (p_bt_stage, p_base_chapter) {
		// logger.debug('*** Start LoadBTStage ***');

		// BT_STAGE select
		p_bt_stage.findAll({
			where : { CHAPTER_ID : p_base_chapter.chapter_id }, order : 'STAGE_ID asc'
		})
		.then( function (p_ret_stage) {
			for (var cnt_stage in p_ret_stage) {
				(function (cnt_stage) {
					var stage_data = p_ret_stage[cnt_stage];
					// console.log('stage_data', stage_data.STAGE_ID);
					var chapter_id = stage_data.CHAPTER_ID;

					var stage = new BaseStage.inst.BaseStage();
					stage.stage_id				= stage_data.STAGE_ID;
					stage.next_stage_id			= stage_data.NEXT_STAGE_ID;
					stage.boss_hp				= stage_data.BOSS_HP;
					stage.drop_item_group_id	= stage_data.STAGE_DROP_GROUP_ID;
					stage.need_stamina			= stage_data.STAMINA;
					stage.reward_account_exp	= stage_data.ACCOUNT_EXP;
					stage.reward_hero_exp		= stage_data.HERO_EXP;
					stage.reward_gold			= stage_data.GOLD;

					stage.AddFristClearRewardItem(1, stage_data.FIRST_CLEAR_ITEM1, stage_data.FIRST_CLEAR_ITEM1COUNT);
					stage.AddFristClearRewardItem(2, stage_data.FIRST_CLEAR_ITEM2, stage_data.FIRST_CLEAR_ITEM2COUNT);
					stage.AddFristClearRewardItem(3, stage_data.FIRST_CLEAR_ITEM3, stage_data.FIRST_CLEAR_ITEM3COUNT);
					stage.AddFristClearRewardItem(4, stage_data.FIRST_CLEAR_ITEM4, stage_data.FIRST_CLEAR_ITEM4COUNT);
					stage.AddFristClearRewardItem(5, stage_data.FIRST_CLEAR_ITEM5, stage_data.FIRST_CLEAR_ITEM5COUNT);
					
					stage.AddSweepRewardItem(1, stage_data.SWEEP_REWARD_ITEM1, stage_data.SWEEP_ITEM1_COUNT);
					stage.AddSweepRewardItem(2, stage_data.SWEEP_REWARD_ITEM2, stage_data.SWEEP_ITEM2_COUNT);
					stage.AddSweepRewardItem(3, stage_data.SWEEP_REWARD_ITEM3, stage_data.SWEEP_ITEM3_COUNT);
					stage.AddSweepRewardItem(4, stage_data.SWEEP_REWARD_ITEM4, stage_data.SWEEP_ITEM4_COUNT);
					stage.AddSweepRewardItem(5, stage_data.SWEEP_REWARD_ITEM5, stage_data.SWEEP_ITEM5_COUNT);

					if ( p_base_chapter.first_stage_id == 0 || typeof p_base_chapter.first_stage_id === 'undefined' ) {
						p_base_chapter.first_stage_id = stage_data.STAGE_ID;
						// console.log('chapter_id : %d, first_stage_id : %d', p_base_chapter.chapter_id, p_base_chapter.first_stage_id);
					} else {
						if ( p_base_chapter.first_stage_id > stage_data.STAGE_ID ) {
							p_base_chapter.first_stage_id = stage_data.STAGE_ID;
							// console.log('chapter_id : %d, first_stage_id : %d', p_base_chapter.chapter_id, p_base_chapter.first_stage_id);
						}
					}
					
					BaseStage.inst.AddBaseStage(stage_data.STAGE_ID, stage);
				})(cnt_stage);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTStage!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
	
})(exports || global);
(exports || global).inst;