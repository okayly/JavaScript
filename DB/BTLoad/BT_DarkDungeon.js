/********************************************************************
Title : BT_DarkDungeon
Date : 2016.12.06
Update : 2016.12.19
Desc : BT 로더 - DarkDungeon
writer: jong wook
********************************************************************/
var BaseDarkDungeon	= require('../../Data/Base/BaseDarkDungeon.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadDarkDungeonChapter = function (p_bt_chapter, p_bt_stage) {
		logger.debug('*** Start LoadDarkDungeonChapter ***');

		// BT_CHAPTER select
		p_bt_chapter.findAll({
			order : 'CHAPTER_ID asc'
		})
		.then(function (p_ret_chapter) {
			for ( var cnt in p_ret_chapter ) {
				(function (cnt) {
					var chapter_data = p_ret_chapter[cnt];

					var base_chapter = new BaseDarkDungeon.inst.DarkDungeonChapter();
					// console.log('base_chapter', base_chapter);

					base_chapter.chapter_id		= chapter_data.CHAPTER_ID;
					base_chapter.limit_level	= chapter_data.LIMIT_LEVEL;
					base_chapter.reset_time		= chapter_data.RESET_TIME;
					
					BaseDarkDungeon.inst.AddDarkDungeonChapter(chapter_data.CHAPTER_ID, base_chapter);

					// Load DarkDungeon Stage
					LoadDarkDungeonStage(p_bt_stage, base_chapter);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadDarkDungeonChapter!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadDarkDungeonStage = function (p_bt_stage, p_base_chapter) {
		// logger.debug('*** Start LoadDarkDungeonStage ***');

		var stage_id = 0;

		// BT_STAGE select
		p_bt_stage.findAll({
			where : { CHAPTER_ID : p_base_chapter.chapter_id }, order : 'STAGE_ID asc'
		})
		.then(function (p_ret_stage) {
			for ( var cnt_stage in p_ret_stage ) {
				(function (cnt_stage) {
					var stage_data = p_ret_stage[cnt_stage];

					var stage						= new BaseDarkDungeon.inst.DarkDungeonStage();
					stage.chapter_id				= stage_data.CHAPTER_ID;
					stage.stage_id					= stage_data.STAGE_ID;
					stage.need_stamina				= stage_data.STAMINA;
					stage.reward_account_exp		= stage_data.ACCOUNT_EXP;
					stage.reward_hero_exp			= stage_data.HERO_EXP;
					stage.reward_gold				= stage_data.GOLD;
					stage.main_item_drop_group_id	= stage_data.MAIN_ITEM_DROP_GROUP_ID;
					stage.sub_item_drop_group_id	= stage_data.SUB_ITEM_DROP_GROUP_ID;

					BaseDarkDungeon.inst.AddDarkDungeonStage(stage_data.STAGE_ID, stage);

					// Chapter에 Stage ID 설정
					p_base_chapter.stage_array.push(stage_data.STAGE_ID);
					// console.log('chapter_id', p_base_chapter.chapter_id, 'p_base_chapter.stage_array', p_base_chapter.stage_array);
				})(cnt_stage);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadDarkDungeonStage!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
	
})(exports || global);
(exports || global).inst;