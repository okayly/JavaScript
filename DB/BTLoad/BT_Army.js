/********************************************************************
Title : BT_Army
Date : 2016.12.13
Update : 2016.12.13
Desc : BT 로더 - Army(부대)
writer: jong wook
********************************************************************/
var BaseArmy	= require('../../Data/Base/BaseArmy.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadArmySkill = function (p_bt_army) {
		logger.debug('*** Start LoadArmySkill ***');

		// BT_STAGE select
		p_bt_army.findAll({
			order : 'ARMY_ID asc'
		})
		.then(function (p_ret_army) {
			for ( var cnt_army in p_ret_army ) {
				(function (cnt_army) {
					var army_data = p_ret_army[cnt_army];
					
					BaseArmy.inst.AddArmySkill(army_data.ARMY_ID, army_data.SKILL_ID);
				})(cnt_army);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadArmySkill!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
	
})(exports || global);
(exports || global).inst;