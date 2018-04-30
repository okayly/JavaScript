/********************************************************************
Title : BT_Heroes
Date : 2015.11.06
Update : 2017.04.06
Desc : BT 로드 - 영웅 정보
writer: jong wook
********************************************************************/
var DefineValues = require('../../Common/DefineValues.js');

var BaseHeroRe			= require('../../Data/Base/BaseHeroRe.js');
var BaseHeroEvolutionRe	= require('../../Data/Base/BaseHeroEvolutionRe.js');
var BaseHeroPromotionRe	= require('../../Data/Base/BaseHeroPromotionRe.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadHero = function (p_bt_hero) {
		logger.debug('*** Start LoadBTHero ***');

		// BT_HERO select
		p_bt_hero.findAll()
		.then( function (p_ret_hero) {
			for ( var cnt in p_ret_hero ) {
				(function (cnt) {
					var hero_data = p_ret_hero[cnt].dataValues;
					// console.log('hero_data', hero_data);
					let base_hero = new BaseHeroRe.inst.BaseHero();

					base_hero.hero_id			= hero_data.HERO_ID;
					base_hero.stone_id			= hero_data.HERO_STONE_ID;
					base_hero.evolution_step	= hero_data.EVOLUTION_STEP;
					base_hero.reinforce_id		= hero_data.REINFORCE_ID;

					base_hero.AddSkillID(hero_data.SKILL_ID1);
					base_hero.AddSkillID(hero_data.SKILL_ID2);
					base_hero.AddSkillID(hero_data.SKILL_ID3);
					base_hero.AddSkillID(hero_data.CARD_ACTIVE_SKILL_ID);
					base_hero.AddSkillID(hero_data.CARD_PASSIVE_ID1);
					base_hero.AddSkillID(hero_data.CARD_PASSIVE_ID2);
					base_hero.AddSkillID(hero_data.PASSIVE_ID1);
					base_hero.AddSkillID(hero_data.PASSIVE_ID2);
					base_hero.AddSkillID(hero_data.PASSIVE_ID3);
					base_hero.AddSkillID(hero_data.PASSIVE_ID4);
					base_hero.AddSkillID(hero_data.PASSIVE_ID5);
					base_hero.AddSkillID(hero_data.PASSIVE_ID6);
					
					base_hero.SetArmyID(hero_data.ARMY_ID);

					BaseHeroRe.inst.AddHero(hero_data.HERO_ID, base_hero);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTHero!!!!', p_error);
		});
	}

	inst.LoadHeroReinforce = function(bt_hero_reinforce) {
		logger.debug('*** Start LoadHeroReinforce ***');

		// BT_HERO_PROMOTION select
		bt_hero_reinforce.findAll()
		.then( function (p_ret_reinforce) {
			for ( var cnt in p_ret_reinforce ) {
				(function (cnt) {
					var promotion_data = p_ret_reinforce[cnt];

					var base_promotion				= new BaseHeroPromotionRe.inst.BaseHeroPromotion();
					base_promotion.promotion_id		= promotion_data.REINFORCE_ID;
					base_promotion.promotion_step	= promotion_data.STEP;
					base_promotion.need_gold		= promotion_data.NEED_GOLD;

					if ( promotion_data.NEED_RESOURCE1_ID != 0 ) 
						base_promotion.AddNeedItem(promotion_data.NEED_RESOURCE1_ID, promotion_data.NEED_RESOURCE1_COUNT);

					if ( promotion_data.NEED_RESOURCE2_ID != 0 ) 
						base_promotion.AddNeedItem(promotion_data.NEED_RESOURCE2_ID, promotion_data.NEED_RESOURCE2_COUNT);

					if ( promotion_data.NEED_RESOURCE3_ID != 0 ) 
						base_promotion.AddNeedItem(promotion_data.NEED_RESOURCE3_ID, promotion_data.NEED_RESOURCE3_COUNT);

					if ( promotion_data.NEED_RESOURCE4_ID != 0 ) 
						base_promotion.AddNeedItem(promotion_data.NEED_RESOURCE4_ID, promotion_data.NEED_RESOURCE4_COUNT);

					if ( promotion_data.NEED_RESOURCE5_ID != 0 ) 
						base_promotion.AddNeedItem(promotion_data.NEED_RESOURCE5_ID, promotion_data.NEED_RESOURCE5_COUNT);

					if ( promotion_data.NEED_RESOURCE6_ID != 0 ) 
						base_promotion.AddNeedItem(promotion_data.NEED_RESOURCE6_ID, promotion_data.NEED_RESOURCE6_COUNT);

					var promotion_group = BaseHeroPromotionRe.inst.GetHeroPromotionGroup(promotion_data.REINFORCE_ID);
					if ( typeof promotion_group === 'undefined' ) {
						var promotion_group			= new BaseHeroPromotionRe.inst.BaseHeroPromotionGroup();
						promotion_group.grouip_id	= promotion_data.REINFORCE_ID;
						promotion_group.AddHeroPromotion(promotion_data.STEP, base_promotion);

						BaseHeroPromotionRe.inst.AddHeroPromotionGroup(promotion_data.REINFORCE_ID, promotion_group);
					} else {
						promotion_group.AddHeroPromotion(promotion_data.STEP, base_promotion);
					}
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTHeroPromotion!!!!', p_error);
		});	
	}

	inst.LoadHeroEvolution = function(bt_hero_evolution) {
		logger.debug('*** Start LoadBTHeroEvolution ***');

		// BT_HERO_EVOLUTION select
		bt_hero_evolution.findAll()
		.then(function (p_ret_evolution) {
			for ( var cnt in p_ret_evolution ) {
				(function (cnt) {
					var evolution_data = p_ret_evolution[cnt];

					var base_evolution					= new BaseHeroEvolutionRe.inst.BaseHeroEvolution();
					base_evolution.evolution_step		= evolution_data.STEP;
					base_evolution.need_gold			= evolution_data.NEED_GOLD;
					base_evolution.need_hero_stone_count= evolution_data.HERO_STONE_COUNT;
					base_evolution.hero_stone_exchange	= evolution_data.HERO_STONE_EXCHANGE

					BaseHeroEvolutionRe.inst.AddHeroEvolution(evolution_data.STEP, base_evolution);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTHeroEvolution!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
