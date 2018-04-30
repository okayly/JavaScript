/********************************************************************
Title : BaseDarkDungeon
Date : 2016.12.06
Update : 2016.12.06
Desc : BT 정보 - 어둠의 던전
writer: jongwook
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// Stage
	inst.DarkDungeonStage = function() {
		this.chapter_id				= 0;
		this.stage_id				= 0;
		this.need_stamina			= 0;
		this.reward_account_exp		= 0;
		this.reward_hero_exp		= 0;
		this.reward_gold			= 0;
		this.main_item_drop_group_id= 0;
		this.sub_item_drop_group_id	= 0;
	}

	var stage_map = new HashMap();

	inst.AddDarkDungeonStage = function(p_stage_id, p_stage) {
		// console.log('AddDarkDungeonStage stage_id : %d, stage : ', p_stage_id, p_stage);
		stage_map.set(p_stage_id, p_stage);
	}
	inst.GetDarkDungeonStage = function(p_stage_id) { return (stage_map.has(p_stage_id) == true) ? stage_map.get(p_stage_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	// Chapter
	inst.DarkDungeonChapter = function() {
		this.chapter_id		= 0;
		this.reset_time		= 0;
		this.limit_level	= 0;	// 입장 제한 계정 레벨
		this.stage_array	= [];	// 스테이지 ID 배열
	}

	var chapter_map = new HashMap();

	inst.AddDarkDungeonChapter = function(p_chapter_id, p_chapter) {
		// console.log('AddDarkDungeonChapter chapter_id : %d, chapter : ', p_chapter_id, p_chapter);
		chapter_map.set(p_chapter_id, p_chapter);
	}
	inst.GetDarkDungeonChapter = function(p_chapter_id) { return (chapter_map.has(p_chapter_id) == true) ? chapter_map.get(p_chapter_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;