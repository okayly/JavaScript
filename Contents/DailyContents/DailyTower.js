/********************************************************************
Title : DailyContentsMgr
Date : 2017.03.28
update : 2017.03.28
Desc : 일일 컨텐츠 메니저 - 무한탑 일일 보상
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');
var MailMgr = require('../Mail/MailMgr.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseVipRe = require('../../Data/Base/BaseVipRe.js');
var BaseTower = require('../../Data/Base/BaseTower.js');

var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};	

	//------------------------------------------------------------------------------------------------------------------
	var GetTowerRank = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// call ad-hoc query
			mkDB.inst.GetSequelize().query('call sp_select_infinity_tower_rank(?);',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid ]
			)
			.then(p_ret_rank => { resolve(p_ret_rank[0][0].ORDER_RANK); })
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetTowerUserReset = function(p_ret_tower_user, p_rank, P_last_rank_score, p_today_floor, p_best_floor, p_skip_point, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_USER update
			p_ret_tower_user.updateAttributes({
				TODAY_TICKET		: 0,
				TODAY_SCORE			: 0,
				TODAY_RANK_SCORE	: 0,
				LAST_RANK			: p_rank,
				LAST_RANK_SCORE		: P_last_rank_score,
				TODAY_FLOOR			: 0,
				LAST_FLOOR			: p_today_floor,
				BEST_FLOOR			: p_best_floor,
				LAST_BATTLE_SCORE_DATE : Timer.inst.GetNowByStrDate(),
				SKIP_POINT			: p_skip_point,
				ALL_CLEAR			: false,
				LAST_DATE			: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_tower_user_update => {
				console.log('SetTowerUserReset uuid', p_ret_tower_user_update.dataValues.UUID);
				resolve(p_ret_tower_user_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetTowerReset = function(p_uuid, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_FLOOR select
			GTMgr.inst.GetGTInfinityTowerFloor().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_floor_list => {
				// Promise.all GO!
				return Promise.all(p_ret_floor_list.map(row => {
					return row.updateAttributes({ IS_REWARD_BOX_OPEN : false }, { transaction : p_t });
				}))
				.then(values => { resolve(values); })
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	var RemoveTowerHero = function(p_uuid, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_HERO select
			GTMgr.inst.GetGTInfinityTowerHero().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_hero_list => {
				// Promise.all GO!
				return Promise.all(p_ret_hero_list.map(row => {
					return row.updateAttributes({
						EXIST_YN : false,
						LAST_DATE : Timer.inst.GetNowByStrDate()
					}, { transaction : p_t });
				}))
				.then(values => { resolve(values); })
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetTransactionTower = function(p_values, p_uuid, p_vip_step) {
		return new Promise(function (resolve, reject) {
			let ret_tower_user = p_values[0];
			let ret_tower_floor = p_values[1];
			let tower_rank = p_values[2];

			// 무한탑 유저 정보가 없으면 안한다.
			if ( ret_tower_user == null ) {
				return;
			}
				
			let today_floor = ret_tower_user.dataValues.TODAY_FLOOR;
			let best_floor = ret_tower_user.dataValues.BEST_FLOOR;
			let today_score = ret_tower_user.dataValues.TODAY_SCORE;
			let accum_score = ret_tower_user.dataValues.ACCUM_SCORE;
			let user_skip_point = ret_tower_user.dataValues.SKIP_POINT;
			let ret_skip_point = 0;

			let last_rank_score = today_score + ( accum_score * DefineValues.inst.InfinityTowerRankScorePlusPercent );
			
			if ( today_floor > best_floor ) {
				best_floor = today_floor;
			}

			let base_vip = BaseVipRe.inst.GetVip(p_vip_step);
			if ( typeof base_vip === 'undefined' )
				throw ('Error SetTransactionTower - Not Find Vip In Base', p_vip_step);

			if ( ret_tower_floor != null ) {
				let battle_clear_grade = ret_tower_floor.dataValues.BATTLE_CLEAR_GRADE;

				if ( today_floor == 0 || ( today_floor == 1 && battle_clear_grade == 0 )) {
					ret_skip_point = user_skip_point - DefineValues.inst.InfinityTowerSkipPointMinus;
				} else {
					// console.log('today_floor / 2', today_floor / 2);
					ret_skip_point = ( battle_clear_grade != 0 ) ? ( today_floor / 2 ) : (( today_floor - 1 ) / 2 );
					ret_skip_point = ret_skip_point + base_vip.infinity_tower_skip_vip_bonus_point;
				}
			} else {
				// 무한탑을 하지 않은 날 하루씩 7층 감소(TODAY_FLOOR 가 0)
				ret_skip_point = user_skip_point - DefineValues.inst.InfinityTowerSkipPointMinus;
			}

			if ( ret_skip_point < 0 ) {
				ret_skip_point = 0;
			}

			// VIP 단계에 따라서 최소층이 고정 된다.
			if ( ret_skip_point < base_vip.infinity_tower_skip_limit ) {
				ret_skip_point = base_vip.infinity_tower_skip_limit;
			}
			
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetTowerUserReset(ret_tower_user, tower_rank, last_rank_score, today_floor, best_floor, ret_skip_point, t),
					SetTowerReset(p_uuid, t),
					RemoveTowerHero(p_uuid, t)
				])
				.then(values => {
					t.commit();

					resolve([ p_uuid, tower_rank ]);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 정보 갱신
	inst.NewDayInfinityTower = function(p_uuid, p_vip_step) {
		// logger.info('Start NewDayInfinityTower !!');
		LoadGTTower.inst.SelectTowerUser(p_uuid)
		.then(value => {
			let ret_tower_user = value;

			if ( ret_tower_user != null ) {
				return new Promise(function (resolve, reject) {
					return Promise.all([
						LoadGTTower.inst.SelectTowerFloor(p_uuid, ret_tower_user.dataValues.TODAY_FLOOR),
						GetTowerRank(p_uuid)
					])
					.then(values => {
						let ret_tower_floor = values[0];
						let tower_rank = values[1];	// 결과 값 int

						resolve([ ret_tower_user, ret_tower_floor, tower_rank ]);
					})
					.catch(p_error => { reject(p_error); });
				});
			} else {
				resolve([ null, null, null ]);
			}
		})
		.then(values => {
			return SetTransactionTower(values, p_uuid, p_vip_step);
		})
		.then(values => {
			console.log('NewDayInfinityTower');
			SendInfinityTowerRankReward(values);
		})
		.catch(p_error =>{
			logger.error('NewDayInfinityTower', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 일일 랭킹 보상 보내기
	var SendInfinityTowerRankReward = function(p_values) {
		let uuid = p_values[0];
		let rank = p_values[1];

		let reward_base = BaseTower.inst.GetRankReward(rank);
		console.log('SendInfinityTowerRankReward uuid : %d, rank : %d, reward_id : %d', uuid, rank, reward_base.reward_id);
		if ( typeof reward_base === 'undefined' ) {
			logger.error('Error SendInfinityTowerRankReward - 2', rank);
			return;
		}

		let value_list = [];
		if ( reward_base.mail_string_id == DefineValues.inst.MailStringInfinityTowerRankReward1 ) {
			value_list.push(rank);
		}
		else if ( reward_base.mail_string_id == DefineValues.inst.MailStringInfinityTowerRankReward2 ) {
			value_list.push(rank);
			value_list.push(reward_base.rank_min);
			value_list.push(reward_base.rank_max);
		} else {
			logger.error('SendInfinityTowerRankReward - 1', reward_base.mail_string_id);
			return;
		}

		let make_value_list = null;
		for ( let cnt in value_list ) {
			make_value_list = (cnt == 0) ? value_list[cnt] : make_value_list + ',' + value_list[cnt];
		}

		// 우편 보상
		let mail_type = 'SYSTEM';
		let sender = '';

		MailMgr.inst.SendMail(uuid, sender, mail_type, reward_base.mail_string_id, make_value_list, '', '', reward_base.reward_list);
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;