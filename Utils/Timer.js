/********************************************************************
Title : Timer
Date : 2016.07.21
Update : 2017.03.28
Desc : 유틸 - 시간
writer: dongsu -> jongwook
********************************************************************/
var moment = require('moment');

(function (exports) {
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	// 현재 시간과 기준 시간 간의 차를 반올림된 second로 돌려준다. 
	inst.GetDeltaTime = function(p_standard_time) { return moment().diff(moment(p_standard_time), 'seconds'); }

	//------------------------------------------------------------------------------------------------------------------
	inst.GetDeltaTimeByBetweenDate = function(p_standard_date, p_comp_date) {
		console.log('GetDeltaTimeByBetweenDate p_standard_date : %s, p_comp_date : %s', p_standard_date.format('YYYY-MM-DD HH:mm:ss'), moment(p_comp_date).format('YYYY-MM-DD HH:mm:ss'));
		return p_standard_date.diff(moment(p_comp_date), 'seconds');
	}
	
	//------------------------------------------------------------------------------------------------------------------
	inst.GetNowByStrDate = function() { return moment().format("YYYY-MM-DD HH:mm:ss"); }

	//------------------------------------------------------------------------------------------------------------------
	inst.GetStrDate = function(p_date) { return moment(p_date).format("YYYY-MM-DD HH:mm:ss"); }

	//------------------------------------------------------------------------------------------------------------------
	inst.GetNowByStrDateToDay = function() { return moment().format("YYYY-MM-DD"); }

	//------------------------------------------------------------------------------------------------------------------
	inst.GetNowDayByInt = function() {
		var now = moment();
		return now.day();
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetNowDBTime = function() { return moment().utc().format("YYYY-MM-DD HH:mm:ss"); }

	//------------------------------------------------------------------------------------------------------------------
	inst.ReplaceDBTime = function(p_date) { return moment(p_date).utc().format("YYYY-MM-DD HH:mm:ss"); }
	
	//------------------------------------------------------------------------------------------------------------------
	inst.CalcRemainTime = function(p_standard_charge_time, p_current_point, p_max_point, p_delta_time) {
		if ( p_current_point >= p_max_point ) {
			return 0;
		}

		console.log('---------------------------------------------------------------------------------------------------------------------------');
		console.log('(p_max_point(%d) - p_current_point(%d)) * p_standard_charge_time(%d)', p_max_point, p_current_point, p_standard_charge_time, (p_max_point - p_current_point) * p_standard_charge_time);
		console.log('(p_delta_time(%d) % p_standard_charge_time(%d)', p_delta_time, p_standard_charge_time, (p_delta_time % p_standard_charge_time));
		console.log('---------------------------------------------------------------------------------------------------------------------------');

		return ((p_max_point - p_current_point) * p_standard_charge_time) - (p_delta_time % p_standard_charge_time);
	}
	
	//------------------------------------------------------------------------------------------------------------------
	inst.GetUnixTime = function(p_date) {
		let unix_time = 0;

		if ( p_date != null ) {
			// UTC + 9 로 바꿔준다.
			let utc_offset = moment().utcOffset();
			unix_time = moment(p_date).add(utc_offset, 'minute').unix();
		}
		return unix_time;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 매일 05:00 기준 시간 체크
	inst.IsNewDay = function(p_last_date) {
		if ( p_last_date == undefined || p_last_date == null )
			return false;

		var base_time = moment().hours('05').minutes('00').seconds('00');
		var last_time = moment(p_last_date);
		
		// 현재 시간이 기준 시간 이전이면 하루를 빼준다.
		if ( moment().isBefore(base_time) ) {
			base_time.subtract(1, 'days');
		}
		
		if ( last_time.isAfter(base_time) ) {
			console.log('---------------- IsOldDay ----------------');
			return false;
		} else {
			console.log('---------------- IsNewDay ----------------');
			return true;
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	// 매주 월요일 05:00 기준 시간 체크
	inst.IsNewWeek = function(p_last_date) {
		if ( p_last_date == undefined || p_last_date == null )
			return false;

		// 0 : Sunday ~ 6 : Saturday
		var base_time = moment().day(1).hours('05').minutes('00').seconds('00');
		var last_time = moment(p_last_date);

		if ( last_time.isAfter(base_time) ) {
			console.log('---------------- IsOldWeek ----------------');
			return false;
		} else {
			console.log('---------------- IsNewWeek ----------------');
			return true;
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetStaminaFullRemainTime = function(p_stamina, p_max_stamina, p_last_stamina_change_date, p_charge_time) {
		let now_date = moment();
		let diff_sec = ( p_last_stamina_change_date != null ) ? inst.GetDeltaTimeByBetweenDate(now_date, p_last_stamina_change_date) : 0;
		return inst.CalcRemainTime(p_charge_time, p_stamina, p_max_stamina, diff_sec);
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;