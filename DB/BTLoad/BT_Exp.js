/********************************************************************
Title : BT_Exp
Date : 2016.06.23
Update : 2016.08.09
Desc : BT 로드 - 경험치, 레벨업에 필요한 골드
writer: jong wook
********************************************************************/
var BaseExpRe = require('../../Data/Base/BaseExpRe.js');

(function(exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadExp = function(p_bt_exp) {
		logger.debug('*** Start LoadExp ***');

		// BT_EXP select
		p_bt_exp.findAll()
		.then(function (p_ret_exp) {
			for ( var cnt in p_ret_exp ) {
				// AccountExp
				var account_exp			= new BaseExpRe.inst.BaseExp();
				account_exp.level		= p_ret_exp[cnt].TARGET_LEVEL;
				account_exp.need_exp	= p_ret_exp[cnt].ACCOUNT_NEED_EXP;
				account_exp.total_exp	= p_ret_exp[cnt].ACCOUNT_TOTAL_EXP;

				BaseExpRe.inst.AddAccountExp(p_ret_exp[cnt].TARGET_LEVEL, account_exp);

				// HeroExp
				var herp_exp		= new BaseExpRe.inst.BaseExp();
				herp_exp.level		= p_ret_exp[cnt].TARGET_LEVEL;
				herp_exp.need_exp	= p_ret_exp[cnt].HERO_NEED_EXP;
				herp_exp.total_exp	= p_ret_exp[cnt].HERO_TOTAL_EXP;

				BaseExpRe.inst.AddHeroExp(p_ret_exp[cnt].TARGET_LEVEL, herp_exp);

				// HeroSkill levelup need gold
				BaseExpRe.inst.AddHeroSkillNeedGold(p_ret_exp[cnt].TARGET_LEVEL, p_ret_exp[cnt].SKILL_NEED_GOLD);

				// EquipItem levelup need gold
				BaseExpRe.inst.AddEquipItemNeedGold(p_ret_exp[cnt].TARGET_LEVEL, p_ret_exp[cnt].ITEM_NEED_GOLD);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTExp!!!!', p_error);
		});
	}

	exports.inst = inst;

})(exports || global);
(exports || global).inst;
