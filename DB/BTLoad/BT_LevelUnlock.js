/********************************************************************
Title : BT_LevelUnlock
Date : 2017.02.10
Update : 2017.02.10
Desc : BT 로드 - 레벨별 컨텐츠 
writer: jong wook
********************************************************************/
var BaseLevelUnlock = require('../../Data/Base/BaseLevelUnlock.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadLevelUnlock = function (p_bt_level_unlock) {
		logger.debug('*** Start LoadLevelUnlock ***');

		var getLevelUnlock = function() {
			return new Promise(function (resolve, reject) {
				// BT_LEVEL_UNLOCK select
				p_bt_level_unlock.findAll()
				.then(p_level_unlock_list => { resolve(p_level_unlock_list); })
				.catch(p_error => { reject(p_error); });
			});
		}

		// Promise GO!
		getLevelUnlock()
		.then(p_level_unlock_list => {
			for ( let cnt in p_level_unlock_list ) {
				(function (cnt) {
					// console.log('p_level_unlock_list[cnt] -', p_level_unlock_list[cnt].dataValues.ITEM_ID);
					let data_unlock = p_level_unlock_list[cnt].dataValues;

					let base_unlock = new BaseLevelUnlock.inst.BaseLevelUnlock();

					base_unlock.target_level			= data_unlock.TARGET_LEVEL;
					base_unlock.max_stamina				= data_unlock.MAX_STAMINA;
					base_unlock.recovery_stamina		= data_unlock.RECOVERY_STAMINA;
					base_unlock.castle_step				= data_unlock.CASTLE_STEP;
					base_unlock.open_shop				= data_unlock.OPEN_SHOP;
					base_unlock.open_eventdungeon_gold	= data_unlock.OPEN_EVENTDUNGEON_GOLD;
					base_unlock.open_eventdungeon_exp	= data_unlock.OPEN_EVENTDUNGEON_EXP;
					base_unlock.open_eventdungeon_daily1= data_unlock.OPEN_EVENTDUNGEON_DAILY1;
					base_unlock.open_eventdungeon_daily2= data_unlock.OPEN_EVENTDUNGEON_DAILY2;
					base_unlock.open_eventdungeon_daily3= data_unlock.OPEN_EVENTDUNGEON_DAILY3;
					base_unlock.open_imprinting			= data_unlock.OPEN_IMPRINTING;
					base_unlock.open_accountbuff		= data_unlock.OPEN_ACCOUNTBUFF;
					base_unlock.open_infinity			= data_unlock.OPEN_INFINITY;
					base_unlock.open_pvp				= data_unlock.OPEN_PVP;
					base_unlock.open_guild				= data_unlock.OPEN_GUILD;
					base_unlock.open_chat				= data_unlock.OPEN_CHAT;

					BaseLevelUnlock.inst.AddLevelUnlock(data_unlock.TARGET_LEVEL, base_unlock);
				})(cnt);
			}
		})
		.catch(p_error => {
			console.log('Error Promise', p_error);
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
