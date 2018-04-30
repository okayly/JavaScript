/********************************************************************
Title : BT_AccountBuff
Date : 2016.03.14
Update : 2017.01.03
Desc : BT 로드 - AccountBuff
writer: jong wook
********************************************************************/
var BaseAccountBuffRe = require('../../Data/Base/BaseAccountBuffRe.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadAccountBuff = function (p_bt_account_buff) {
		logger.debug('*** Start Load AccountBuff ***');

		// BT_ACCOUNT_BUFF select
		p_bt_account_buff.findAll({
			order: 'ACCOUNT_BUFF_ID asc'
		})
		.then(function (p_ret_base) {
			for ( var cnt in p_ret_base ) {
				(function (cnt) {
					// console.log('p_ret_base[cnt] -', p_ret_base[cnt].dataValues); 
					var data = p_ret_base[cnt].dataValues;

					var account_buff 					= new BaseAccountBuffRe.inst.BaseAccountBuff();
					account_buff.account_buff_id		= data.ACCOUNT_BUFF_ID;
					account_buff.account_buff_type		= data.ACCOUNT_BUFF_TYPE;
					account_buff.skill_id				= data.SKILL_ID;
					account_buff.need_item_id			= data.NEED_RESOURCE_ID;
					account_buff.skill_tire				= data.SKILL_TIRE;
					account_buff.max_level				= data.MAX_LEVEL;
					account_buff.need_account_level		= data.NEED_ACCOUNT_LEVEL;					
					account_buff.need_account_buff_level= data.NEED_ACCOUNT_BUFF_LEVEL;

					if (data.NEED_ACCOUNT_BUFF_ID1 != 0)
						account_buff.need_account_buff_id_list.push(data.NEED_ACCOUNT_BUFF_ID1);

					if (data.NEED_ACCOUNT_BUFF_ID2 != 0)
						account_buff.need_account_buff_id_list.push(data.NEED_ACCOUNT_BUFF_ID2);

					BaseAccountBuffRe.inst.AddAccountBuff(data.ACCOUNT_BUFF_ID, account_buff);

					// console.log('buff_id: %d, account_buff:', data.ACCOUNT_BUFF_ID, account_buff);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error Load AccountBuff!!!!:', p_error);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
