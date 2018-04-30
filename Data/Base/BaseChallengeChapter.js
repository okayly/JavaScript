/********************************************************************
Title : BaseChallengeChapter
Date : 2016.02.02
Update : 2016.08.08
Desc : BT 정보 - 도전모드 챕터
writer: dongsu
********************************************************************/
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.BaseChallengeChapter = function() {
		this.challenge_chapter_id;
		this.daily_play_count;
		this.open_day_of_week_map	= new HashMap();
		this.challenge_stage_map	= new HashMap();

		this.AddOpenDayOfWeek = function(p_day, p_open) { this.open_day_of_week_map.set(p_day, p_open); }
		this.CheckOpenChallengeChapter = function (p_day) { 
			return ( this.open_day_of_week_map.has(p_day) == true ) ? this.open_day_of_week_map.get(p_day) : false;
		}
	}

	var chapter_map = new HashMap();	// key : stage_id, value : ChallengeStage

	inst.AddBaseChallengeChapter = function(p_chapter_id, p_chapter) { chapter_map.set(p_chapter_id, p_chapter); }
	inst.GetBaseChallengeChapter = function(p_chapter_id) { return (chapter_map.has(p_chapter_id) == true) ? chapter_map.get(p_chapter_id) : undefined; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;