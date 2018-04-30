/********************************************************************
Title : BT_Challenge
Date : 2015.11.06
Update : 2016.08.08
Desc : BT 로더 - Challenge
writer: jong wook
********************************************************************/
var BaseChallengeChapter= require('../../Data/Base/BaseChallengeChapter.js');
var BaseChallengeStage	= require('../../Data/Base/BaseChallengeStage.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadChallengeChapter = function (p_bt_challenge_chapter, p_bt_challenge_stage) {
		logger.debug('*** Start LoadChallengeChapter ***');

		// BT_CHALLENGE_CHAPTER select
		p_bt_challenge_chapter.findAll()
		.then(function (p_ret_chapter) {
			for ( var cnt in p_ret_chapter ) {
				var chapter_data = p_ret_chapter[cnt];
				var challenge_chapter = new BaseChallengeChapter.inst.BaseChallengeChapter();

				var chapter_id = chapter_data.CHALLENGE_CHAPTER_ID;

				challenge_chapter.challenge_chapter_id	= chapter_id;
				challenge_chapter.daily_play_count		= chapter_data.PLAY_COUNT;

				challenge_chapter.AddOpenDayOfWeek(1, chapter_data.MONDAY_OPEN);
				challenge_chapter.AddOpenDayOfWeek(2, chapter_data.TUESDAY_OPEN);
				challenge_chapter.AddOpenDayOfWeek(3, chapter_data.WEDNESDAY_OPEN);
				challenge_chapter.AddOpenDayOfWeek(4, chapter_data.THURSDAY_OPEN);
				challenge_chapter.AddOpenDayOfWeek(5, chapter_data.FRIDAY_OPEN);
				challenge_chapter.AddOpenDayOfWeek(6, chapter_data.SATURDAY_OPEN);
				challenge_chapter.AddOpenDayOfWeek(0, chapter_data.SUNDAY_OPEN);

				BaseChallengeChapter.inst.AddBaseChallengeChapter(chapter_id, challenge_chapter);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadChallengeChapter!!!!', p_error);
		});

		// Challenge Stage Load
		LoadBTChallengeStage(p_bt_challenge_stage);
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadBTChallengeStage = function(p_bt_challenge_stage) {
		logger.debug('*** Start LoadBTChallengeStage ***');
		
		// BT_CHALLENGE_STAGE select
		p_bt_challenge_stage.findAll({
			order : 'CHALLENGE_STAGE_ID asc'
		})
		.then(function (p_ret_stage) {
			for ( var cnt in p_ret_stage ) {
				var stage_data = p_ret_stage[cnt].dataValues;

				var challenge_stage	= new BaseChallengeStage.inst.BaseChallengeStage();
				var chapter_id		= stage_data.CHALLENGE_CHAPTER_ID;
				var stage_id		= stage_data.CHALLENGE_STAGE_ID;

				challenge_stage.challenge_stage_id		= stage_data.CHALLENGE_STAGE_ID;
				challenge_stage.account_limit_open_level= stage_data.OPEN_LV;
				challenge_stage.need_stamina			= stage_data.STAMINA;
				challenge_stage.reward_account_exp		= stage_data.REWARD_ACCOUNT_EXP;
				challenge_stage.reward_hero_exp			= stage_data.REWARD_HERO_EXP;
				challenge_stage.reward_gold				= stage_data.REWARD_GOLD;
				
				challenge_stage.AddRewardItem(stage_data.REWARD_ITEM1, stage_data.REWARD_ITEM1_COUNT);
				challenge_stage.AddRewardItem(stage_data.REWARD_ITEM2, stage_data.REWARD_ITEM2_COUNT);
				challenge_stage.AddRewardItem(stage_data.REWARD_ITEM3, stage_data.REWARD_ITEM3_COUNT);
				challenge_stage.AddRewardItem(stage_data.REWARD_ITEM4, stage_data.REWARD_ITEM4_COUNT);
				challenge_stage.AddRewardItem(stage_data.REWARD_ITEM5, stage_data.REWARD_ITEM5_COUNT);

				challenge_stage.AddLimitHeroType(stage_data.PROHIBITION_HERO_TYPE1);
				challenge_stage.AddLimitHeroType(stage_data.PROHIBITION_HERO_TYPE2);

				challenge_stage.AddLimitHeroID(stage_data.PROHIBITION_HERO_ID1);
				challenge_stage.AddLimitHeroID(stage_data.PROHIBITION_HERO_ID2);
				challenge_stage.AddLimitHeroID(stage_data.PROHIBITION_HERO_ID3);

				BaseChallengeStage.inst.AddBaseChallengeStage(stage_id, challenge_stage);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTChallengeStage!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
