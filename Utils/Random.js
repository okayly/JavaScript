/********************************************************************
Title : Stored Procedure - User
Date : 2015.09.23
Desc : 유틸 - 랜덤
writer : dongsu
********************************************************************/
(function (exports) {
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	inst.RandomRange = function(min, max) {
		// console.log('min : %d, max : %d, (max - main + 1) : %d', min, max, (max - min + 1));
		return Math.floor( (Math.random() * (max - min + 1)) + min ); 
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.RandomRangeExcept = function(p_min, p_max, p_execpt) {
		var rand_value = 0;
		
		do {
			rand_value = Math.floor( (Math.random() * (p_max - p_min + 1)) + p_min );
			if ( rand_value != p_execpt && rand_value != 0 ) {
				break;
			}

		} while(true)

		return rand_value;
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;