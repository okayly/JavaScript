/********************************************************************
Title : mkTest
Date : 2015.10.06
Update : 2017.04.04
Desc : 테스트 파일
writer: jongwook
********************************************************************/
var mkDB	= require('../DB/mkDB.js');
var GTMgr	= require('../DB/GTMgr.js');
var UserMgr	= require('../Data/Game/UserMgr.js');

var DefineValues = require('../Common/DefineValues.js');

var Sender	= require('../App/Sender.js');
var Timer	= require('../Utils/Timer.js');

var fs		= require('fs');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqTest = function (p_socket, json_packet) {
		console.log('---- ReqTest ----', json_packet);
		let recv = JSON.parse(json_packet);

		GachaPromise();
		// ForDeleteElement();
		// HeroSummonPromise();
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.04.18 영웅 소환 Promise
	var HeroSummonPromise = function() {
		let RewardMgr = require('./RewardMgr.js');
		let BaseHeroRe = require('../Data/Base/BaseHeroRe.js');

		// start transaction
		mkDB.inst.GetSequelize().transaction(function (transaction) {
			// console.log('ProcessTransaction');
			let t = transaction;

			let uuid = 1;
			let hero_id_list = [3, 14];

			Promise.all(hero_id_list.map(hero_id => {
				let base_hero = BaseHeroRe.inst.GetHero(hero_id);
				if ( typeof base_hero === 'undefined')
					throw ([ PacketRet.inst.retFail(), 'Error BaseHero', hero_id ])

				return new Promise(function (resolve, reject) {
					return RewardMgr.inst.GachaHeroSummon(t, uuid, hero_id, base_hero.evolution_step, base_hero.army_id, base_hero.skill_list)
					.then(values => { resolve(values); })
					.catch(p_error => { reject(p_error); });
				});
			}))
			.then(values => {
				console.log('values', values);
				t.commit();
			})
			.catch(p_error => {
				if (t)
					t.rollback();

				console.log('Error', p_error);
			});
			
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.04.17 for문 에서 객체 삭제
	var ForDeleteElement = function() {
		let temp = [ 17, 2, 14, 15, 20, 8, 7, 1, 9, 19, 3, 18, 5, 4, 6, 16 ];

		console.log('Before', temp);

		let len = temp.length;

		// 이렇게 하면 안되고 뒤에서 부터
		// 이유 : https://coderwall.com/p/prvrnw/remove-items-from-array-while-iterating-over-it		
		// for ( let cnt = 0; cnt < len; ++cnt ) {
		// 	if ( temp[cnt] % 2 === 0 )
		// 		temp.splice(cnt, 1);
		// }
		// console.log('After', temp);
		// output
		// Before [ 17, 2, 14, 15, 20, 8, 7, 1, 9, 19, 3, 18, 5, 4, 6, 16 ]
		// After [ 17, 14, 15, 8, 7, 1, 9, 19, 3, 5, 6 ]

		while (len--) {
			if ( temp[len] % 2 === 0 )
				temp.splice(len, 1);
		}

		console.log('After', temp);
		// output
		// Before [ 17, 2, 14, 15, 20, 8, 7, 1, 9, 19, 3, 18, 5, 4, 6, 16 ]
		// After [ 17, 15, 7, 1, 9, 19, 3, 5 ]
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.04.14 가챠 Promise 적용.
	var GachaPromise = function() {
		var PacketGacha = require('../Packets/PacketGacha/PacketGacha.js');
		var Gacha = require('../Contents/Gacha/Gacha.js');

		let user = UserMgr.inst.GetUser(1);

		let ack_cmd 	= PacketGacha.inst.cmdAckGacha();
		let ack_packet	= PacketGacha.inst.GetPacketAckGacha();
		ack_packet.packet_srl = 1;

		let temp_recv = function() {
			let gacha_id;
		}

		let recv = new temp_recv;
		recv.gacha_id = 2;

		Gacha.inst.ReqGacha(user, recv, ack_cmd, ack_packet);
	}	

	//------------------------------------------------------------------------------------------------------------------
	// 2017.04.04 동적 변수 선언 사용.
	var DynamicValue = function() {
		let myVariables = {};
		let variableName = 'foo';
		myVariables[variableName] = 100;
		console.log('ret', myVariables.foo);

		console.log('DefineValues.inst.NotReward', DefineValues.inst.NotReward);
		console.log('DefineValues.inst.ItemReward', DefineValues.inst.ItemReward);
     	console.log('DefineValues.inst.GoldReward', DefineValues.inst.GoldReward);
     	console.log('DefineValues.inst.CashReward', DefineValues.inst.CashReward);
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.03.30 매주 월요일 체크
	var WeeklyMonday = function() {
		// 매일 05:00 확인
		// var base_time = moment('2017-03-16').hours('05').minutes('00').seconds('00');
		// var last_time = moment('2017-03-16').hours('05').minutes('00').seconds('01');

		// console.log('base_time', base_time.format('YYYY-MM-DD HH:mm:ss'));
		// console.log('last_time', last_time.format('YYYY-MM-DD HH:mm:ss'));

		// console.log('isAfter', last_time.isAfter(base_time));

		// let sunday = moment().day(0);
		// let monday = moment().day(1);
		// let tuseday = moment().day(2);
		// let wendsday = moment().day(3);
		// let thurseday = moment().day(4);
		// let friday = moment().day(5);
		// let saturday = moment().day(6);

		// console.log('sunday', sunday.format('YYYY-MM-DD HH:mm:ss'));
		// console.log('monday', monday.format('YYYY-MM-DD HH:mm:ss'));
		// console.log('tuseday', tuseday.format('YYYY-MM-DD HH:mm:ss'));
		// console.log('wendsday', wendsday.format('YYYY-MM-DD HH:mm:ss'));
		// console.log('thurseday', thurseday.format('YYYY-MM-DD HH:mm:ss'));
		// console.log('friday', friday.format('YYYY-MM-DD HH:mm:ss'));
		// console.log('saturday', saturday.format('YYYY-MM-DD HH:mm:ss'));

		// 그 주 월요일 05:00
		let base_time = moment().day(1).hours('05').minutes('00').seconds('00');
		console.log('base_time', base_time.format('YYYY-MM-DD HH:mm:ss'));

		let last_time = moment('2017-03-13').hours('05').minutes('00').seconds('01');
		console.log('last_time', last_time.format('YYYY-MM-DD HH:mm:ss'));

		console.log('isAfter', last_time.isAfter(base_time));

		let next_mon = moment().day(8).hours('05').minutes('00').seconds('00');
		let remain_sec = next_mon.diff(moment(), 'seconds');
		let reamin_hours = next_mon.diff(moment(), 'hours');
		let reamin_day = next_mon.diff(moment(), 'days');

		console.log('next_mon', next_mon.format('YYYY-MM-DD HH:mm:ss'));
		console.log('remain_sec', remain_sec);
		console.log('reamin_hors', reamin_hors);
		console.log('reamin_day', reamin_day);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2017.03.30 스킬 포인트 사용
	var UserSkillPoint = function () {
		var curr_point = 19;
		var max_point = 20;
		var add_time = 180;

		var now = moment();
		// var last_date = null;
		var last_date = moment('2017-03-30 15:27:00');
		// var last_date = moment('0000-00-00 00:00:00');

		console.log('---------------------------------------------------------------------------------');
		console.log('now: %s', now.format('YYYY-MM-DD HH:mm:ss'));
		console.log('last_date: %s', (last_date != null) ? last_date.format('YYYY-MM-DD HH:mm:ss') : last_date);		

		var ret_point = (curr_point - 1) < 0 ? 0 : (curr_point - 1);
		var remain_time = 0;

		// 처음 사용이면 남은 시간은 180
		if (last_date == null) {
			remain_time = add_time;
		} else if (last_date.isSame(moment('0000-00-00 00:00:00'))) {
			remain_time = add_time;
		} else {
			if (ret_point >= max_point)
				return 0;

			// 남은 포인트의 충전 시간
			remain_time = (max_point - ret_point) * add_time;
			console.log('1. remain_time: %d', remain_time);

			var diff_sec = now.diff(last_date, 'seconds');
			remain_time = remain_time - (diff_sec % add_time);
			console.log('2. diff_sec: %d, diff_sec % add_time:',diff_sec, (diff_sec % add_time));
		}

		console.log('result remain_time:', remain_time);
		var zero_time = moment('0000-00-00 00:00:00');
		console.log('zero_time:', zero_time);
		console.log('isSame:', zero_time.isSame(moment('0000-00-00 00:00:00')));
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.07.28 미션 보상
	// 2017.03.29 수정
	var MissionProcessReward1 = function() {
		let RewardMgr = require('./RewardMgr.js');
		let PacketMission = require('../Packets/PacketMission/PacketMission.js');

		let ack_cmd = PacketMission.inst.cmdAckMissionReward();
		let ack_packet = PacketMission.inst.GetPacketAckMissionReward();

		console.log('ack_packet', ack_packet);

		let RewardInfo = function() {
			this.reward_type = 0;
			this.reward_id = 0;
			this.reward_count = 0;
		}

		let user = UserMgr.inst.GetUser(1);
		
		// BT_COMMON의 보상 타입
		// NotReward			0	보상 없음
		// ItemReward			1	아이템 보상
		// GoldReward			2	골드 보상
		// CashReward			3	캐쉬 보상
		// HonorPointReward		4	명예 포인트 보상
		// AlliancePointReward	5	길드 포인트 보상
		// ChallengePointReward	6	PVP 포인트 보상
		// StaminaReward		7	스테미너 보상
		// AccountExpReward		8	계정 경험치 보상
		
		// 1. reward_type, reward_id, reward_value 형태
		// 아이템, 골드, 계정 경험치, 스테미너
		let reward_type_list = [ 1, 1, 1, 2, 3, 4, 5, 6, 7, 8 ];
		let reward_id_list = [ 1030002, 2010104, 1030002, 0, 0, 0, 0, 0, 0, 0 ];
		let reward_value_list = [ 10, 1, 4, 100, 200, 300, 400, 500, 600, 700 ];

		// 명예 포인트, 스테미너
		// let reward_type_list = [3, 7];
		// let reward_id_list = [0, 0];
		// let reward_value_list = [2000, 10];

		// 아이템
		// let reward_type_list = [2];
		// let reward_id_list = [0];
		// let reward_value_list = [2000];

		let reward_list = [];
		for (let cnt = 0; cnt < reward_type_list.length; ++cnt) {
			let reward_info = new RewardInfo();
			reward_info.reward_type = reward_type_list[cnt];
			reward_info.reward_id = reward_id_list[cnt];
			reward_info.reward_count = reward_value_list[cnt];
			reward_list.push(reward_info);
		}		

		logger.info('UUID : %d, 보상 정보 -', user.uuid, reward_list);

		ack_packet.mission_id = 1;
		RewardMgr.inst.RewardBox(user, ack_cmd, ack_packet, reward_list);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.07.28 미션 보상
	// 2017.03.29 수정
	var MissionProcessReward2 = function() {
		let RewardMgr = require('./RewardMgr.js');
		let PacketMission = require('../Packets/PacketMission/PacketMission.js');

		let ack_cmd = PacketMission.inst.cmdAckMissionReward();
		let ack_packet = PacketMission.inst.GetPacketAckMissionReward();

		console.log('ack_packet', ack_packet);

		let RewardInfo = function() {
			this.reward_id = 0;
			this.reward_count = 0;
		}

		let uuid = 1;
		let user = UserMgr.inst.SelectUser(uuid);
		
		// BT_COMMON의 보상 타입
		// NotReward			0	보상 없음
		// ItemReward			1	아이템 보상
		// GoldReward			2	골드 보상
		// CashReward			3	캐쉬 보상
		// HonorPointReward		4	명예 포인트 보상
		// AlliancePointReward	5	길드 포인트 보상
		// ChallengePointReward	6	PVP 포인트 보상
		// StaminaReward		7	스테미너 보상
		// AccountExpReward		8	계정 경험치 보상

		// 2. item_id, item_count 형태
		let item_id_list = [ 1030002, 2010104 ];
		let item_count_list = [ 2, 1 ];

		let reward_list = [];
		for (let cnt = 0; cnt < item_id_list.length; ++cnt) {
			let reward_info = new RewardInfo();
			reward_info.reward_id = item_id_list[cnt];
			reward_info.reward_count = item_count_list[cnt];
			reward_list.push(reward_info);
		}

		logger.info('UUID : %d, 보상 정보 -', user.uuid, reward_list);

		ack_packet.mission_id = 1;
		RewardMgr.inst.RewardBox(user, ack_cmd, ack_packet, reward_list);
	}

	//--------------------------------------------------------------------------------------------------------------
	var StaminaFullRemainTime = function() {
		let stamina = 10;
		let max_stamina = 30;
		let date = '2017-03-28 17:30';

		let remain_time = Timer.inst.GetStaminaFullRemainTime(stamina, max_stamina, date, DefineValues.inst.StaminaRecoverTime);
		console.log('remain_time', remain_time);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.05.04 무한탑 유저 정보 일일 갱신 확인
	var ConfirmUpdateInfinityTowerUser = function() {		
		let DailyContentsMgr = require('./DailyContents/DailyContentsMgr.js');
		let LoadGTUser = require('../DB/GTLoad/LoadGTUser.js');

		let uuid = 1;
		LoadGTUser.inst.SelectUser(uuid)
		.then(p_ret_user => {
			DailyContentsMgr.inst.NewDay(p_ret_user);
		})
		.catch(p_error =>{
			console.log('error', p_error);
		});
	}


	//------------------------------------------------------------------------------------------------------------------
	// 2017.03.22 Promise.all test
	var PromiseAllTest = function() {
		let Promise1 = function() {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(1);
				}, 0);
			});
		}

		let Promise2 = function() {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(2);
					// reject(2);
				}, 0);
			});
		}

		// Promise.all([ Promise1(), Promise2() ]).then(function (data){
		// 	console.log("First handler", data);
		// 	return data.map(entry => entry * 10);
		// }).then(function (data){
		// 	console.log("Second handler", data);
		// })
		// .catch(p_error => { console.log('error', p_error); });

		let num_list = [ 1, 2, 3, 4, 5 ];
		
		Promise.all(num_list.map(num => {
			console.log('num', num);
			if ( num / 2 == 0 )
				return Promise1();
			else
				return Promise2();
		}))
		.then(values => {
			console.log('values', values);
		})
		.catch(p_error => {
			console.log('error', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.03.16 Array 값 테스트
	var ArrayValues = function() {
		let temp_item = function() {
			this.reward_id;
			this.reward_count;
		}

		let temp_list = [];

		for ( let cnt = 0; cnt < 3; ++cnt ) {
			let temp = new temp_item();
			temp.reward_id = cnt;
			temp.reward_count = (cnt + 1) * 10;

			temp_list.push(temp);
		}

		temp_list.map(reward => {
			let property_name_list = Object.getOwnPropertyNames(reward);

			console.log('reward_id : %d, reward_count : %d', reward.reward_id, reward.reward_count);
			console.log('reward_id : %d, reward_count : %d', reward[property_name_list[0]], reward[property_name_list[1]]);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.03.13 BattleMgr 테스트
	var SweepBattle = function() {
		let BattleMgr = require('../Contents/Battle/BattleMgr.js');

		let chapter_id = 101;
		let stage_id = 10101;
		let sweep_count = 2;

		let sweep_info = BattleMgr.inst.SweepReward(chapter_id, stage_id, sweep_count);
		let sweep_reward_item = sweep_info.GetSweepRewardItem();
		let reward_item_group = sweep_info.GetRewardItemGroup();

		// console.log('GetSweepRewardItem', sweep_reward_item);
		// console.log('GetRewardItemGroup', reward_item_group);

		console.log('sweep item_list', sweep_reward_item.item_list);
		reward_item_group.map(row => {
			console.log('group item_list', row.reward_item.item_list);
		});

		let find_item_id = 1030001;

		function findItem(p_item_id, p_array) {
			if ( Array.isArray(p_array) == false || p_array.length == 0 )
				return undefined;

			for ( let cnt = 0; cnt < p_array.length; ++ cnt ) {
				if ( p_array[cnt].item_id == p_item_id )
					return p_array[cnt];
			}
			return undefined;
		}

		// console.log('result', findItem(find_item_id, sweep_reward_item.item_list));

		let ret_item_list = new Array();

		sweep_reward_item.item_list.map(item => {
			ret_item_list.push(item);
		});

		reward_item_group.map(group => {
			group.reward_item.item_list.map(item => {
				let find_item = findItem(item.item_id, ret_item_list);
				if ( typeof find_item === 'undefined' ) {
					console.log('Not find item', item.item_id);
					ret_item_list.push(item);
				} else {
					console.log('find item', item.item_id);
					if ( item.item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
						console.log('Equipment Item', item.item_id);
						ret_item_list.push(item);
					} else {
						console.log('Not equipment Item', item.item_id);
						find_item.item_count = find_item.item_count + item.item_count;
					}
				}
			});
		});

		console.log('ret_item_list', ret_item_list);
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.03.07 sequelizer transaction + Promise.all
	var PromiseAllTransactionUseFunction = function() {
		// console.log('PromiseAllTransaction');
		var LoadGTUser = require('../DB/GTLoad/LoadGTUser.js');

		let uuid = 1;
		let hero_id = 3;
		let item_id = 2010011;
		let gold = 1;

		var UpdateUserGold = function(p_ret_user, p_gold, p_t) {
			return new Promise(function (resolve, reject) {
				// GT_USER update
				p_ret_user.updateAttributes({
					GOLD : p_gold
				}, { transaction : p_t })
				.then(p_ret_user_update => {
					console.log('UpdateUserGold');
					resolve(p_ret_user_update);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		var InsertItem = function(p_uuid, p_item_id, p_t) {
			return new Promise(function (resolve, reject) {
				// GT_INVENTORY insert
				GTMgr.inst.GetGTInventory().create({
					UUID : p_uuid, ITEM_ID : p_item_id, ITEM_COUNT : 1
				}, { transaction : p_t })
				.then(p_ret_item => {
					console.log('InsertItem');
					resolve(p_ret_item);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		var InsertItem2 = function(p_uuid, p_item_id, p_t) {
			return new Promise(function (resolve, reject) {
				// GT_INVENTORY insert
				GTMgr.inst.GetGTInventory().create({
					UUID : p_uuid, ITEM_ID : p_item_id, ITEM_COUNT : 1
				}, { transaction : p_t })
				.then(p_ret_item => {
					// throw 'force error InsertItem';
					console.log('InsertItem');
					resolve(p_ret_item);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		var SetTransaction = function(p_ret_user) {
			return new Promise(function (resolve, reject) {
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					Promise.all([
						UpdateUserGold(p_ret_user, gold, t),
						InsertItem(uuid, item_id, t)
					])
					.then(values=> {
						console.log('Promise.all - 1 done', values[0].dataValues);
						gold = 100;

						Promise.all([
							UpdateUserGold(values[0], gold, t),
							InsertItem2(uuid, item_id, t)
						])
						.then(values => {
							console.log('Promise.all - 2 done : commit')
							t.commit();
							resolve(values);
						})
						.catch(p_error => {
							console.log('error - 4 : rollback', p_error);

							if (t)
								t.rollback();
							reject(p_error);
						});
					})
					.catch(p_error => {
						console.log('error - 3 : rollback', p_error);

						if (t)
							t.rollback();
						reject(p_error);
					});
				});
			});
		}

		return new Promise(function (resolve, reject) {
			console.log('Go Promise');

			LoadGTUser.inst.SelectUser(uuid)
			.then(value => {
				console.log('GetUser');
				let ret_user = value;

				return SetTransaction(ret_user);
			})
			.then(values => {
				console.log('values - 2', values);
				resolve(values);
			})
			.catch(p_error => {				
				console.log('error - 2', p_error);
				reject(p_error);
			});
		})
		.then(values => {
			console.log('values - 1', values);
		})
		.catch(p_error => {
			console.log('error - 1', p_error);
		});;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.03.07 sequelizer transaction + Promise.all
	var PromiseAllTransaction = function() {
		// console.log('PromiseAllTransaction');
		var LoadGTUser = require('../DB/GTLoad/LoadGTUser.js');

		let uuid = 1;
		let hero_id = 3;
		let item_id = 2010011;
		let gold = 1;

		var UpdateUserGold = function(p_ret_user, p_gold, p_t) {
			return new Promise(function (resolve, reject) {
				// GT_USER update
				p_ret_user.updateAttributes({
					GOLD : p_gold
				}, { transaction : p_t })
				.then(p_ret_user_update => {
					console.log('UpdateUserGold');
					resolve(p_ret_user_update);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		var InsertItem = function(p_uuid, p_item_id, p_t) {
			return new Promise(function (resolve, reject) {
				// GT_INVENTORY insert
				GTMgr.inst.GetGTInventory().create({
					UUID : p_uuid, ITEM_ID : p_item_id, ITEM_COUNT : 1
				}, { transaction : p_t })
				.then(p_ret_item => {
					console.log('InsertItem');
					resolve(p_ret_item);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		var InsertItem2 = function(p_uuid, p_item_id, p_t) {
			return new Promise(function (resolve, reject) {
				// GT_INVENTORY insert
				GTMgr.inst.GetGTInventory().create({
					UUID : p_uuid, ITEM_ID : p_item_id, ITEM_COUNT : 1
				}, { transaction : p_t })
				.then(p_ret_item => {
					// throw 'force error InsertItem';

					console.log('InsertItem');
					resolve(p_ret_item);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		return new Promise(function (resolve, reject) {
			console.log('Go Promise');

			LoadGTUser.inst.SelectUser(uuid)
			.then(value => {
				console.log('GetUser');
				let ret_user = value;

				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					Promise.all([
						UpdateUserGold(ret_user, gold, t),
						InsertItem(uuid, item_id, t)
					])
					.then(values=> {
						console.log('Promise.all - 1 done', values[0].dataValues);
						gold = 100;

						Promise.all([
							UpdateUserGold(values[0], gold, t),
							InsertItem2(uuid, item_id, t)
						])
						.then(values => {
							console.log('Promise.all - 2 done : commit')
							t.commit();
							resolve(values);
						})
						.catch(p_error => {
							console.log('error - 4 : rollback', p_error);

							if (t)
								t.rollback();
							reject(p_error);
						});
					})
					.catch(p_error => {
						console.log('error - 3 : rollback', p_error);

						if (t)
							t.rollback();
						reject(p_error);
					});
				});
			})
			.catch(p_error => {
				console.log('error - 2', p_error);
			});
		})
		.then(values => {
			console.log('values - 1', values);
		})
		.catch(p_error => {
			console.log('error - 1', p_error);
		});;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.27 skill_effect 값 계산
	var SetGTUserEffect = function(p_level) {
		let SetGTUser = require('../DB/GTSet/SetGTUser.js');

		let uuid = 1;
		let skill_id = 50004;	// 골드 : 50003, 영웅 경험치 : 50004
		let skill_level = parseInt(p_level);
		let effect_call = 'GUILD';

		return new Promise(function (resolve, reject) {
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				SetGTUser.inst.AddUserEffect(uuid, effect_call, skill_id, skill_level, t)
				.then(p_ret_effect => {
					console.log('p_ret_effect', p_ret_effect);
					t.commit();

					resolve(p_ret_effect);
				})
				.catch(p_error => {
					console.log('p_error', p_error);
					if (t)
						t.rollback();

					reject(p_error);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.27 skill_effect 값 계산
	var SkillEffectValue = function() {
		let BaseSkill = require('../Data/Base/BaseSkill.js');

		let skill_id = 50004;	// 골드 : 50003, 영웅 경험치 : 50004
		let skill_level = 1;

		let base_skill = BaseSkill.inst.GetSkill(skill_id);

		// console.log('skill_map', BaseSkill.inst.GetSkillMap());
		console.log('base_skill', base_skill);

		// Clear Gold * Value1 + Value2
		// hero get exp * value1 + value2
		// 계산 방법		
		// 1. BT_HERO_SKILL_EFFECT 테이블로 스킬 레벨별 값 계산
		// Effect1_Value1 + ( Effect1_Value1_per_LV * (SkillLv - 1) ) => 계산된 결과 값이 value1
		// Effect1_Value2 + ( Effect1_Value2_per_LV * (SkillLv - 1) ) => 계산된 결과 값이 value2
		// Effect1_Value3 + ( Effect1_Value3_per_LV * (SkillLv - 1) ) => 계산된 결과 값이 value3

		// 2. Effect 결과 값(value1 ~ 3) 를 이용 해서 최종 값 계산
		// ClearGold + (ClearGold * value1) + value2
		// ClearExp + (ClearExp * value1) + value2		

		// BT_HERO_SKILL_EFFECT 에 value1, value2, value3 에 어떤 스킬이 들어와도 저장 가능하게 하기 위한 방법
		let effect_list = base_skill.skill_effect.GetGuildSkillValues(skill_level);
		effect_list.map(effect => {
			console.log('effect_type : %s, value :', effect.effect_type, effect.values);
		});

		// result
		// effect_type : Passive_HeroExpUp, value1 : [ 0, 20, 0 ]
		// effect_type : Passive_ClearGoldUp, value1 : [ 0, 5, 0 ]
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.27 UTC + 9 로 만들어서
	var ConvertUTC_9 = function() {
		// UTC를 기준으로한 상대적인 차이
		// 한국은 UCT + 9(540 minute)

		let utc_offset = moment().utcOffset();		
		console.log('utc_offset', utc_offset);	// 540(분 = 9시간)
		console.log('now', moment().format('YYYY-MM-DD HH:mm:ss'));
		console.log('now', moment().format('YYYY-MM-DD HH:mm:ss').add(utc_offset, 'minute'));		
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.22 Promise.all 빈배열 : [] 리턴 확인
	// [] 리턴하면 된다.
	var PromiseAllEmptyReturn = function() {
		var uuid = 1;
		var hero_id = 1;

		var getUser = function() {
			return new Promise(function (resolve, reject) {
				// GT_USER select
				GTMgr.inst.GetGTUser().find({
					where : { UUID : 1, EXIST_YN : true }
				})
				.then(p_ret_user => { resolve(p_ret_user); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var getHero = function() {
			return new Promise(function (resolve, reject) {
				// GT_HERO select
				GTMgr.inst.GetGTHero().find({
					where : { UUID : uuid, HERO_ID : hero_id, EXIST_YN : true }
				})
				.then(p_ret_hero => { resolve(p_ret_hero); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var setTransaction = function() {
			Promise.all([ getUser(), [] ])
			.then(values => {
				console.log('values', values);
			})
			.catch(p_error => { console.log('Error', p_error); });
		}

		setTransaction();
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.21 BT load
	var LoadBT = function() {
		var BTMgr	= require('../DB/BTMgr.js');

		BTMgr.inst.LoadBTInfo();
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.17 ObjectType 테스트
	var ObjectTypeTest = function() {
		var Class_1 = function() {
			this.Object_1 = function() {
				this.object_id;
				this.object_count;
			}

			this.object_list = new Array();

			this.AddItem = function(p_id, p_count) {
				let object_1 = new this.Object_1();
				object_1.object_id = p_id;
				object_1.object_count = p_count;

				this.object_list.push(object_1);
			}
			this.GetList = function() { return this.object_list; }
		}

		var Class_2 = function() {
			this.Object_2 = function() {
				this.object_id;
				this.object_count;
				this.object_type;
			}

			this.object_list = new Array();

			this.AddItem = function(p_id, p_count, p_type) {
				let object_2 = new this.Object_2();

				object_2.object_id = p_id;
				object_2.object_count = p_count;
				object_2.object_type = p_type;

				this.object_list.push(object_2);
			}
			this.GetList = function() { return this.object_list; }
		}

		var MakePush = function(p_object, p_id, p_count, p_type) {
			console.log('object name', p_object);

			p_object.AddItem(p_id, p_count, p_type);
		}

		let class_1 = new Class_1();
		let class_2 = new Class_2();

		MakePush(class_1, 1, 1);
		MakePush(class_2, 1, 1, 1);

		console.log('class_1', class_1.GetList());
		console.log('class_2', class_2.GetList());
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.17 DarkDungeon 챕텨의 스테이지 서브 아이템 리스트
	var DarkDungeonRewardStageSubItemList = function() {
		var DarkDungeonMgr = require('../Contents/DarkDungeon/DarkDungeonMgr.js');

		var drop_item_group = 71101;
		var reward_sub_item_array = DarkDungeonMgr.inst.GetRewardStageSubItemList(drop_item_group);
		console.log(reward_sub_item_array);
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.16 아이템 생성
	var RewardItemTest = function() {
		var BaseEquipItem = require('../Data/Base/BaseEquipItem.js');

		let uuid = 1;		
		let reward_item_list = new Array();

		reward_item_list.push({ item_id: 1020001, item_count: 3, equip_status_id: 0, item_category1: 1 });
		reward_item_list.push({ item_id: 1021001, item_count: 3, equip_status_id: 0, item_category1: 1 });
		reward_item_list.push({ item_id: 1030001, item_count: 5, equip_status_id: 0, item_category1: 1 });
		reward_item_list.push({ item_id: 2010011, item_count: 1, equip_status_id: 2010011, item_category1: 2 });
		reward_item_list.push({ item_id: 2010012, item_count: 1, equip_status_id: 2010012, item_category1: 2 });
		reward_item_list.push({ item_id: 2010013, item_count: 1, equip_status_id: 2010013, item_category1: 2 });
		reward_item_list.push({ item_id: 2010014, item_count: 1, equip_status_id: 2010014, item_category1: 2 });

		var findItem = function(p_uuid, p_item_id, p_t) {
			return new Promise(function (resolve, reject) {
				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().find({
					where : { UUID : p_uuid, ITEM_ID : p_item_id, EXIST_YN : true }
				}, { transaction : p_t })
				.then(p_ret_item => { resolve(p_ret_item); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var insertItem = function(p_uuid, p_item_id, p_item_count, p_t) {
			return new Promise(function (resolve, reject) {
				console.log('insertItem', p_item_id, p_item_count);

				// GT_INVENTORY insert
				GTMgr.inst.GetGTInventory().create({
					UUID : p_uuid, ITEM_ID : p_item_id, ITEM_COUNT : p_item_count, REG_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_item => { resolve(p_ret_item); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var insertEquipment = function(p_uuid, p_item_id, p_equip_status_id, p_t) {
			return new Promise(function (resolve, reject) {
				console.log('insertEquipment', p_item_id, p_equip_status_id);

				let random_option_list;

				let base_equip_status = BaseEquipItem.inst.GetEquipItemStatus(p_equip_status_id);
				// console.log('base_equip_status', base_equip_status);
				if ( typeof base_equip_status !== 'undefined' ) {
					let rand_count = Rand.inst.RandomRange(base_equip_status.option_count_min, base_equip_status.option_count_max);
					random_option_list = BaseEquipItem.inst.GetEquipItemRandomOptionList(base_equip_status.option_group, rand_count);
				}

				console.log('random_option_list', random_option_list);

				// GT_INVENTORY insert
				GTMgr.inst.GetGTInventory().create({
					UUID			: p_uuid,
					ITEM_ID			: p_item_id,
					ITEM_COUNT		: 1,
					SUB_OPTION_ID_1 : ( typeof random_option_list === 'undefined' || typeof random_option_list[0] === 'undefined' ) ? 0 : random_option_list[0],
					SUB_OPTION_ID_2 : ( typeof random_option_list === 'undefined' || typeof random_option_list[1] === 'undefined' ) ? 0 : random_option_list[1],
					SUB_OPTION_ID_3 : ( typeof random_option_list === 'undefined' || typeof random_option_list[2] === 'undefined' ) ? 0 : random_option_list[2],
					SUB_OPTION_ID_4 : ( typeof random_option_list === 'undefined' || typeof random_option_list[3] === 'undefined' ) ? 0 : random_option_list[3],
					SUB_OPTION_ID_5 : ( typeof random_option_list === 'undefined' || typeof random_option_list[4] === 'undefined' ) ? 0 : random_option_list[4],
					SUB_OPTION_ID_6 : ( typeof random_option_list === 'undefined' || typeof random_option_list[5] === 'undefined' ) ? 0 : random_option_list[5],
					REG_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_item => { resolve(p_ret_item); })
				.catch(p_error => { reject(p_error); });
			});
		};

		var setTransaction = function() {
			return mkDB.inst.GetSequelize().transaction(function (transaction) {
				console.log('setTransaction');

				let t = transaction;

				return new Promise(function (resolve, reject) {
					return Promise.all(reward_item_list.map(item => {
						// console.log('item.item_category1', item.item_category1);
						if ( item.item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
							return insertEquipment(uuid, item.item_id, item.equip_status_id, t);
						} else {
							return findItem(uuid, item.item_id, t)
							.then(p_ret_item => {
								if ( p_ret_item == null ) {
									return insertItem(uuid, item.item_id, 1, t);
								} else {
									console.log('updateItem', item.item_id, item.item_count);

									let item_count = p_ret_item.dataValues.ITEM_COUNT;
									// GT_INVENTORY update
									return p_ret_item.updateAttributes({ ITEM_COUNT : item_count + item.item_count }, { transaction : t });
								}
							});
						}
					}))
					.then(values => {
						console.log('All done Commit');
						t.commit();

						resolve(values);

						for ( let cnt in values ) {
							console.log('item', ( values[cnt] != null ) ? values[cnt].dataValues : values[cnt]);
						}
					})
					.catch(p_error => {
						console.log('Rollback');
						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		}

		setTransaction();
	}
	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.10
	var HashMapPromise = function() {
		let vector = function() {
			this.first;
			this.second;
		}

		let vec_map = new HashMap();
		vec_map.set(1, 100);
		vec_map.set(2, 200);
		vec_map.set(3, 300);

		let vec_list = new Array( 1, 2, 3 );

		// console.log('vector_map', vec_map);

		var return_all = function() {
			return Promise.all(vec_list.map(row => {
				return row;
			}));

			// return Promise.all(vec_map.forEach(function (value, key) {
			// 	return new Promise(function (resolve, rejct) {
			// 		// console.log('key : %d, value : %d', key, value);
			// 		return resolve(key);
			// 	});
			// }));
		}

		return_all()
		.then(values => {
			console.log('values', values);
		})
		.catch(p_error => { console.log('Error Promise', p_error); });

		// return Promise.all(p_item_list.map(row => {
		// 	console.log('row IUID : %d, BIND_HERO_ID : %d', row.dataValues.IUID, row.dataValues.BIND_HERO_ID);
		// 	// GT_INVENTORY update
		// 	if ( row.dataValues.BIND_HERO_ID == 0 ) {
		// 		return row.updateAttributes({ ITEM_LEVEL : 1 });
		// 	} else {
		// 		return row;
		// 	}
		// }))
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2017.02.09
	var SequelizeTransactionAnother = function() {
		let t;
		let user_data;

		var getGold = function() {
			console.log('1. getGold');

			let uuid = 1;
			return new GTMgr.inst.GetGTUser().find({ where : { UUID : 1, EXIST_YN : true }});
		}

		var setGold = function(p_ret_user) {
			console.log('2. setGold');

			let uuid = 1;
			let gold = 0;
			// console.log('transaction', t);

			// Start transaction
			return new Promise(function (resolve, reject) {
				return mkDB.inst.GetSequelize().transaction(function (transaction) {
					console.log('1. select GOLD', p_ret_user.dataValues.GOLD);

					t = transaction;

					// 1. updateAttributes
					// return p_ret_user.updateAttributes({ GOLD : gold }, { transaction : t })

					// 2. save
					p_ret_user['GOLD'] = gold;

					return p_ret_user.save({ transaction : t })
					.then(p_ret_user_update => {
						console.log('2. update GOLD', p_ret_user_update.dataValues.GOLD);
						user_data = p_ret_user_update.dataValues;

						// 강제 오류
						// throw ('Force Error');

						t.commit();
						resolve(p_ret_user_update);
					})
					.catch(p_error => {
						console.log('Error update', p_error);
						if (t)
							t.rollback();

						reject(p_error);
					});
				});
			});
		}
		
		// Promise GO!
		getGold()
		.then(p_ret_user => { return setGold(p_ret_user); })
		.then(p_ret_user => {
			console.log('Done Promise', p_ret_user.dataValues.GOLD);
		})
		.catch(p_error => {
			console.log('Error Promise', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SequelizeTransaction = function() {
		let t;
		let user_data;

		var setGold = function() {
			console.log('2. setGold');

			return mkDB.inst.GetSequelize().transaction(function (transaction) {
				t = transaction;

				let uuid = 1;
				let gold = 0;
				// console.log('transaction', t);

				return GTMgr.inst.GetGTUser().find({ where : { UUID : 1, EXIST_YN : true }}, { transaction : t})
				.then(p_ret_user => {
					console.log('1. select GOLD', p_ret_user.dataValues.GOLD);
					return p_ret_user.updateAttributes({ GOLD : gold }, { transaction : t })
					.then(p_ret_user => {
						console.log('2. update GOLD', p_ret_user.dataValues.GOLD);
						user_data = p_ret_user.dataValues;

						t.commit();
					})
					.catch(p_error => {
						console.log('Error update', p_error);
						if (t)
							t.rollback();
					});
				});
			})
			.then(function () {
				console.log('Commited GOLD ', user_data.GOLD);
			})
			.catch(p_error => {
				console.log('Error Rolled back', p_error);
			});
		}
		
		setGold();
	}

	//------------------------------------------------------------------------------------------------------------------
	var EquipItemRandomOption = function() {
		var BaseEquipItem = require('../Data/Base/BaseEquipItem.js');

		let group_id = 10;
		let count = 2;

		let random_option = BaseEquipItem.inst.GetEquipItemRandomOptionList(group_id, count);

		console.log('random_option', random_option);
	}

	//------------------------------------------------------------------------------------------------------------------
	// subGold : 유저 골드 확인 하고 update
	// levelup : 장비 레벨업
	var PromiseSample = function() {
		var uuid = 1;
		var iuid = 101;
		var gold = 0;

		// 1. 유저 - 골드 차감
		var subGold = function() {
			return new Promise(function (resolve, reject) {
				// GT_USER select
				GTMgr.inst.GetGTUser().find({
					where : { UUID : uuid, EXIST_YN : true }
				})
				.then(p_user => {
					console.log('GT_USER select UUID : %d, GOLD : %d', p_user.dataValues.UUID, p_user.dataValues.GOLD);
					if ( p_user.dataValues.GOLD < gold ) {
						reject(p_user);
					} else {
						var ret_gold = p_user.dataValues.GOLD - gold;

						// GT_USER update
						resolve(p_user.updateAttributes({ GOLD : ret_gold }));
					}
				})
				.catch(p_error => {
					console.log('error GT_USER select', p_error);
				});
			});
		}

		// 2. 장비 - 레벨 업
		var levelup = function() {
			return new Promise(function (resolve, reject) {
				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().find({
					where : { UUID : uuid, IUID : iuid, EXIST_YN : true }
				})
				.then(p_item => {
					console.log('GT_INVENTORY select ITEM_LEVEL : %d', p_item.dataValues.ITEM_LEVEL);

					if ( p_item == null ) {
						reject(p_item);
					} else {
						// GT_INVENTORY update
						resolve(p_item.updateAttributes({ ITEM_LEVEL : 100 }));
					}
				})
				.catch(p_error => {
					console.log('error GT_INVENTORY select', p_error);
				});
			});
		}

		// call Promise
		subGold()
		.then(p_user => {
			console.log('subGold().then UUID : %d, GOLD : %d', p_user.dataValues.UUID, p_user.dataValues.GOLD);
			return levelup();
		})
		.then(p_item => {
			console.log('levelup().then IUID : %d, ITEM_LEVEL : %d', p_item.dataValues.IUID, p_item.dataValues.ITEM_LEVEL);
		})
		.catch(p_error => {
			console.log('SendPacket Error');
		});
	}

		//------------------------------------------------------------------------------------------------------------------
	var PromiseAllSample = function() {
		var uuid = 1;
		var iuid = 101;
		var gold = 0;

		var user = null;
		var item = null;

		// 1. 유저 확인
		var findUser = function() {
			return new Promise((resolve, reject) => {
				// GT_USER select
				GTMgr.inst.GetGTUser().find({
					where : { UUID : uuid, EXIST_YN : true }
				})
				.then(p_user => {
					console.log('GT_USER select UUID : %d, GOLD : %d', p_user.dataValues.UUID, p_user.dataValues.GOLD);
					resolve(p_user);
				})
				.catch(p_error => {
					console.log('error GT_USER select', p_error);
					reject(p_error);
				});
			});
		}

		// 2. 장비 - 레벨 업
		var findEquipment = function() {
			return new Promise(function (resolve, reject) {
				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().find({
					where : { UUID : uuid, IUID : iuid, EXIST_YN : true }
				})
				.then(p_item => {
					console.log('GT_INVENTORY select ITEM_LEVEL : %d', p_item.dataValues.ITEM_LEVEL);
					resolve(p_item);
				})
				.catch(p_error => {
					console.log('error GT_INVENTORY select', p_error);
					reject(p_error);
				});
			});
		}

		Promise.all([findUser(), findEquipment()])
		.then(values => {
			console.log('values', values);

			// values 에서 GT_USER 와 GT_INVENTORY 구분을 어떻게 해야 하나..
		})
		.catch(p_error => {
			console.log('error Promise.all', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var PromiseMultiRow = function() {
		// 장비 레벨업 - 
		// select 한 row 가 여러개 일때 row 별로 Promise 생성
		var iuid_list = [101, 102, 103, 104, 105];

		// GT_INVENTORY select
		GTMgr.inst.GetGTInventory().findAll({
			where : { UUID : 1, IUID : { in : iuid_list }, EXIST_YN : true }
		})
		.then(p_item_list => {
			console.log('p_item_list', p_item_list);

			return Promise.all(p_item_list.map(row => {
				console.log('row IUID : %d, BIND_HERO_ID : %d', row.dataValues.IUID, row.dataValues.BIND_HERO_ID);
				// GT_INVENTORY update
				if ( row.dataValues.BIND_HERO_ID == 0 ) {
					return row.updateAttributes({ ITEM_LEVEL : 1 });
				} else {
					return row;
				}
			}))
			.then(p_update_list => {
				console.log('All done');
				for ( var cnt = 0; cnt < p_update_list.length; ++cnt ) {
					console.log('%d IUID : %d ITEM_LEVEL : %d', cnt, p_update_list[cnt].dataValues.IUID, p_update_list[cnt].dataValues.ITEM_LEVEL);
				}
			})
			.catch(p_error => {
				console.log('Promise.all error', p_error);
			});
		})
		.catch(p_error => {
			console.log('error', p_error);
		});		
	}

	//------------------------------------------------------------------------------------------------------------------
	var PromiseSequelize1 = function() {
		// 내부 Promise를 함수로 사용할때
		// var fn = function asyncUpdate(v) {
		// 	return new Promise(resolve => resolve( v.updateAttributes({ HERO_LEVEL : 1 })));
		// }

		// GT_HERO select
		GTMgr.inst.GetGTHero().findAll({
			where : { UUID : 1 }
		})
		.then(p_hero_list => {
			for ( var cnt = 0; cnt < p_hero_list.length; ++cnt ) {
				console.log('first p_hero_list', p_hero_list[cnt].dataValues.HERO_ID);
			}

			return Promise.all(p_hero_list.map( function (row) {
				return new Promise( function (resolve, reject) {
					if ( row.HERO_LEVEL != 1 ) {
						return resolve(row.updateAttributes({ HERO_LEVEL : 1 }));
					} else {
						return reject(['force reject', '1111', '333']);
					}
				})
				.catch(function (error) {
					console.log('map error', error);
				});
			}));

			// ES6 형식 : 적응하기 전까지는 한번에 파악 하기 어렵다.
			// return Promise.all(p_hero_list.map(v => {
			// 	return new Promise( function (resolve, reject) {
			// 		return resolve( v.updateAttributes({ HERO_LEVEL : 1 }) );
			// 	});
			// }));
		})
		.then(p_hero_list => {
			console.log('All done');

			for ( var cnt = 0; cnt < p_hero_list.length; ++cnt ) {
				console.log('p_hero_list', p_hero_list[cnt].dataValues);
			}
		})
		.catch(p_error => {
			console.log('first error', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var PromiseChaining = function() {
		console.log('PromiseChaining');

		// 내가 하고 싶은건 select 하고 update
		var promiseFind = new Promise(function (resolve, reject) {
			// GT_HERO select
			GTMgr.inst.GetGTHero().findAll({
				where : { UUID : 1 }
			})
			.then(p_hero_list => {
				console.log('first done');
				resolve(p_hero_list);
			})
			.catch(p_error => {
				console.log('firse error');
				reject(p_error);
			});
		});

		var promiseUpdate = function(p_hero) {

		}
		
		promiseFind.then(p_hero_list => {
			console.log('second done hero count:', p_hero_list.length);

			var temp = 0;

			for ( var cnt = 0; cnt < p_hero_list.length; ++cnt ) {

			}
		})
		.then(function () {
			console.log('third done');
		})
		.catch(p_error => {
			console.log('promise error', p_error);
		});


		// Sample
		// var promise = new Promise(function (resolve, reject) {
		// 	resolve(1);
		// });

		// promise.then(function (p_user_select) {
		// 	console.log(p_user_select);
		// 	return p_user_select + 1;
		// })
		// .then(function (p_user_update){
		// 	console.log(p_user_update);
		// 	return p_user_update + 2;
		// })
		// .then(function (val) {
		// 	console.log(val);
		// });
	}

	//------------------------------------------------------------------------------------------------------------------
	var PromiseTest1 = function() {
		console.log('PromiseTest1');

		//Promise 선언
		var promise_user = function () {
			return new Promise(function (resolve, reject) {
				// GT_USER select
				GTMgr.inst.GetGTUser().find({
					where : { UUID : 1}
				})
				.then(p_ret_user => {
					var temp = false;
					if ( temp == true ) {
						resolve(['user', p_ret_user]);
					} else {
						reject('Error');
					}
				})
				.catch(p_error => {
					reject(p_error);
				});
			});
		}

		var promise_hero = function() {
			return new Promise(function (resolve, reject) {
				// GT_INVENTORY select
				GTMgr.inst.GetGTHero().findAll({
					where : { UUID : 1 }
				})
				.then(function (p_ret_hero_list) {
					resolve(['hero', p_ret_hero_list]);
				})
				.catch(function (p_error) {
					reject(p_error);
				});
			});
		}

		//Promise 실행
		Promise.all([promise_user(), promise_hero()])
		.then(function (values) {
			// console.log('All complete', values);
			for ( var cnt = 0; cnt < values.length; ++cnt ) {
				console.log('cnt:', cnt, 'values:', values[cnt]);
				// console.log('isArray: ', Array.isArray(values[cnt]);
			}
		})
		.catch(function (p_error) {
			console.log('p_error', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var PromiseTest = function() {
		console.log('PromiseTest');

		var promise_user = function () {
			return new Promise(function (resolve, reject) {
				// GT_USER select
				GTMgr.inst.GetGTUser().findAll()
				.then(p_ret_user => {
					console.log('p_ret_user', p_ret_user[0].dataValues);
				})
				.catch(p_error => {
					console.log('p_error', p_error.stack);
				});
			});
		}

		promise_user()
		.then(function (p_ret_user) {
			// 성공시
			console.log(p_ret_user);
			// console.log(num);
		}, function (error) {
			// 실패시 
			console.error(error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 남은 시간 확인
	var TimeTest = function() {
		var now = moment();
		var next_mon = now.weekday(7 + 1);

		var remain_day = next_mon.diff(moment(), 'days');
		var remain_sec = next_mon.diff(moment(), 'seconds');

		console.log('now', moment().format('YYYY-MM-DD HH:mm:ss'));
		console.log('next_mon', next_mon.format('YYYY-MM-DD HH:mm:ss'));
		console.log('remain_day', remain_day);
		console.log('remain_sec', remain_sec);
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2016.12.20 Array에서 다음 값 찾기
	var ArrayFindNextItem = function() {
		var stage_id_array = [ 1, 2, 3, 4, 5];

		function FindNextStage(stage_id, find_id) {
			return stage_id === find_id;
		}

		console.log(stage_id_array.find(FindNextStage));
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2016.12.19 DarkDungeon 챕텨의 스테이비별 아이템
	var DarkDungeonRewardStageMainItemList = function() {
		var DarkDungeonMgr = require('../Contents/DarkDungeon/DarkDungeonMgr.js');

		var chapter_id = 101;
		var reward_main_item_array = DarkDungeonMgr.inst.GetRewardStageMainItemArray(chapter_id);
		console.log('reward_main_item_array', reward_main_item_array);
		console.log('reward_main_item_array', 
			( reward_main_item_array[0] == undefined ) ? 0 : reward_main_item_array[0],
			( reward_main_item_array[1] == undefined ) ? 0 : reward_main_item_array[1],
			( reward_main_item_array[2] == undefined ) ? 0 : reward_main_item_array[2],
			( reward_main_item_array[3] == undefined ) ? 0 : reward_main_item_array[3],
			( reward_main_item_array[4] == undefined ) ? 0 : reward_main_item_array[4]
		);
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2016.12.16 DarkDungeon 리셋 남은 시간 계산
	var DarkDungeonResetRemainTime = function() {
		var start_data = '2016-12-16 16:18:00';
		var reset_time = 600;
		
		var diff_seconds = moment().diff(moment(start_data), 'seconds');
		var remain_time = reset_time - diff_seconds;

		console.log('diff_seconds : %d, remain_time : %d', diff_seconds, remain_time);

		if ( diff_seconds < reset_time ) {
			console.log('diff_seconds < %d', reset_time);
		} else {
			console.log('diff_seconds > %d', reset_time);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2016.12.14 DarkDungeon 배틀 보상 테스트
	var MakeRandomItem = function() {
		var BaseStageDropGroup	= require('../Data/Base/BaseStageDropGroup.js');

		var p_drop_item_group_id = 10101;

		this.reward_item_map = new HashMap();

		var drop_group = BaseStageDropGroup.inst.GetStageDropItemGroup(p_drop_item_group_id);
		var loop_count = Rand.inst.RandomRange(drop_group.drop_count_range_min, drop_group.drop_count_range_max);
		
		console.log('loop_count : %d drop_group : ', loop_count, drop_group);

		for ( var gl = 1; gl <= loop_count; gl++ ) {
			var random = Rand.inst.RandomRange(1, drop_group.total_range);
			// console.log('gl : %d random : %d', gl, random);

			var sum_range = 0;
			for ( var dil = 1; dil <= drop_group.drop_item_map.count(); dil++ ) {
				var drop_item = drop_group.GetDropItem(dil);
				console.log('%d - %d drop_item_id', gl, dil, drop_item.item_id);

				if ( drop_item != undefined ) {
					sum_range = sum_range + drop_item.item_range;
					console.log('%d - %d sum_range : %d, random : %d', gl, dil, sum_range, random);
					if ( sum_range > random ) {
						// 아이템 보상 - 같은 종류면 수를 늘려야 한다.
						if ( reward_item_map.has(drop_item.item_id) == false ) {
							reward_item_map.set(drop_item.item_id, 1);
						} else {
							var find_item_count = reward_item_map.get(drop_item.item_id);
							var sum_item_count = find_item_count + 1;

							reward_item_map.set(drop_item.item_id, sum_item_count);
						}
						break;
					}
				}
			}
		}

		console.log('this.reward_item_map', this.reward_item_map);

		return this.reward_item_map;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2016.11.14 mysql stored procedure의 temporary 테이블 테스트 
	var TemporaryTable = function(p_recv) {
		for (var cnt = 0; cnt < 1000; ++cnt) {
			mkDB.inst.GetSequelize().query('call sp_temporary_table(?, ?);',
				null,
				{ raw : true, type : 'SELECT' },
				[ cnt + 1, (cnt + 1) * 10 ]
			)
			.then(function (p_ret_temporary) {
				console.log('p_ret_temporary:', p_ret_temporary);
				
			})
			.catch(function (p_error) {
				console.log('Error ' + (cnt + 1), p_error);
			});
		}		

		// mkDB.inst.GetSequelize().query('call sp_temporary_table(?, ?);',
		// 	null,
		// 	{ raw : true, type : 'SELECT' },
		// 	[ 2, 20 ]
		// )
		// .then(function (p_ret_temporary) {
		// 	console.log('p_ret_temporary:', p_ret_temporary);
			
		// })
		// .catch(function (p_error) {
		// 	console.log('Error 2', p_error);
		// });
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2016.11.11 fcm-push 서버 테스트(Node.js 버전 때문에 문법 오류 생김)
	var SendPush = function() {
		var FCM = require('fcm-push');

		var serverkey = 'AIzaSyADbHCEDLCfZgue8_G_kbfgfL8_1Sh4Po0';
		var fcm = FCM(serverkey);

		var message = {  
		    to : 'dpQdF0jiXyA:APA91bFfC28_P1-g6SG3KdnA0GakuKQ9xpmEyfDJ9XTZdoWIdWfxAG1mtj4W5oVV7PSBmF24udsfC_OphK9s3OVDkPhROmW83CSy6LwiF7sJ5jpOMM-SCI2PbqD35_rBpYRYc6GHPSV6',
		    collapse_key : '<insert-collapse-key>',
		    // data : {
		    //     <random-data-key1> : '<random-data-value1>',
		    //     <random-data-key2> : '<random-data-value2>'
		    // },
		    notification : {
		        title : 'Title of the notification',
		        body : 'Body of the notification'
		    }
		};

		fcm.send(message, function(err,response){  
		    if(err) {
		        console.log("Something has gone wrong !");
		    } else {
		        console.log("Successfully sent with resposne :",response);
		    }
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ResetTowerBot = function() {
		var uuid = 157;

		// GT_INFINITY_TOWER_HERO select
		GTMgr.inst.GetGTInfinityTowerHero().findAll({
			where : { UUID : uuid, EXIST_YN : true }
		})
		.then(function (p_ret_hero_list) {
			// console.log('p_ret_hero_list', p_ret_hero_list);

			for ( var cnt_hero in p_ret_hero_list ) {
				// GT_INFINITY_TOWER_HERO insert
				p_ret_hero_list[cnt_hero].updateAttributes({
					HERO_HP				: 1,
					HERO_SKILL_GAUGE	: 0,
					HERO_TAG_GAUGE		: 0,
					HERO_SUPPORT_GAUGE	: 0,
					UPDATE_DATE			: Timer.inst.GetNowByStrDate()
				})
				.then(function (p_ret_update_hero) {
					console.log('ResetTowerHero - Update Tower Hero. Hero ID', p_ret_hero_list[cnt_hero].dataValues.HERO_ID);
					// console.log('p_ret_update_hero', p_ret_update_hero);
				})
				.catch(function (p_error) {
					logger.error(p_error, 'Error ResetTowerHero - 2');
				});
			}
		})
		.catch(function (p_error) {
			logger.error(p_error, 'Error ResetTowerHero - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var MakeReservationDate = function() {
		var date = "2016-09-22";
		var ret_date = moment(date).hours('00').minutes('00').seconds('00');

		console.log('ret_date', ret_date.format('YYYY-MM-DD HH:mm:ss'));
	}

	//------------------------------------------------------------------------------------------------------------------
	var GetHeroLevelMap = function() {
		var uuid = 1;
		var hero_id_array = [];
		var hero_level_map = new HashMap();

		// GT_TEAM select - 영웅 레벨업 미션 때문에 영웅 레벨을 가져 온다.
		GTMgr.inst.GetGTTeam().find({
			where: { UUID : uuid, GAME_MODE : DefineValues.inst.GameModeNormal, EXIST_YN : true }
		})
		.then(function (p_ret_team) {
			var team_data = p_ret_team.dataValues;

			if ( team_data.SLOT1 != 0 ) hero_id_array.push(team_data.SLOT1);
			if ( team_data.SLOT2 != 0 ) hero_id_array.push(team_data.SLOT2);
			if ( team_data.SLOT3 != 0 ) hero_id_array.push(team_data.SLOT3);
			if ( team_data.SLOT4 != 0 ) hero_id_array.push(team_data.SLOT4);
			if ( team_data.SLOT5 != 0 ) hero_id_array.push(team_data.SLOT5);
			if ( team_data.SLOT6 != 0 ) hero_id_array.push(team_data.SLOT6);
			if ( team_data.TAG_SLOT1 != 0 ) hero_id_array.push(team_data.TAG_SLOT1);
			if ( team_data.TAG_SLOT2 != 0 ) hero_id_array.push(team_data.TAG_SLOT2);
			if ( team_data.TAG_SLOT3 != 0 ) hero_id_array.push(team_data.TAG_SLOT3);

			// GT_HERO select
			GTMgr.inst.GetGTHero().findAll({
				where : { UUID : uuid, EXIST_YN : true, HERO_ID : hero_id_array }
			})
			.then(function (p_ret_hero_list) {
				for ( var hero_cnt in p_ret_hero_list ) {
					var hero_data = p_ret_hero_list[hero_cnt].dataValues;

					hero_level_map.set(hero_data.HERO_ID, hero_data.HERO_LEVEL);
				}

				console.log('hero_level_map', hero_level_map);

				var mission_id = 5;
				var gold_value = 5;
				var delta_value = 1;

				// 내 생각대로라면 GT_DAILY_MISSION의 PROGRESS_COUNT 가 증가 해야 한다.
				for ( var cnt in p_ret_hero_list ) {
					(function (cnt) {
						// call ad-hoc query
						mkDB.inst.GetSequelize().query('select PROGRESS_COUNT, PROGRESS_TYPE, REG_DATE from GT_DAILY_MISSIONs \
														where UUID = ? and PROGRESS_TYPE != 2 and MISSION_ID = ? and DATE(REG_DATE) = DATE(now());',
							null,
							{ raw : true, type : 'SELECT' },
							[ uuid, mission_id ]
						)
						.then(function (p_ret) {
							// console.log('p_ret', p_ret);
							// 해당 미션이 존재. 
							if ( Object.keys(p_ret).length > 0 ) {
								var data = p_ret[0];

								console.log('before PROGRESS_COUNT : %d', data.PROGRESS_COUNT);
								
								var result_value = data.PROGRESS_COUNT + delta_value;
								if ( result_value > data.PROGRESS_COUNT ) {
									logger.info('UUID : %d, MissionID : %d Update Value : %d 일일 미션이 존재한다. 처리 시작. ', uuid, mission_id, result_value);

									// call ad-hoc query
									mkDB.inst.GetSequelize().query('update GT_DAILY_MISSIONs set PROGRESS_COUNT = ? \
																	where UUID = ? and MISSION_ID = ? and DATE(REG_DATE) = DATE(now());',
										null,
										{ raw : false, type : 'UPDATE' },
										[ result_value, uuid, mission_id ]
									)
									.then(function (p_ret_update) {
										console.log('p_ret_update', p_ret_update);
										// console.log('after PROGRESS_COUNT : %d', p_ret_update[0].PROGRESS_COUNT);
										// logger.info('UUID : %d, MissionID : %d Count : %d 일일 미션 갱신 성공. - ', uuid, mission_id, result_value);
									})
									.catch(function (p_error) {
										logger.error('UUID : %d, MissionID : %d 일일 미션 정보 갱신 실패 - ', uuid, mission_id, p_error);
									})	
								} else {
									logger.info('UUID : %d, MissionID : %d value : %d 일일 미션이 기존 값과 동일 처리 안함.', uuid, mission_id, result_value);
								}
							} else {
								// 해당 미션이 존재하지 않는다. 
								// logger.info('UUID : %d, MissionID : %d 해당 일일 미션이 미발급 혹은 이미 완료.', uuid, mission_id);
							}
						})
						.catch(function (p_error) {
							logger.error('UUID : %d, Error EachDailyMissionProcess', uuid, p_error);
						});
					})(cnt);
				}
			})
			.catch(function (p_error) {
				console.log('error - 2', p_error);
			});
		})
		.catch(function (p_error) {
			console.log('error - 1', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.08.19 Switch string
	var SwitchString = function() {
		var temp = 'Hello';

		switch (temp) {
			case 'Hello' : console.log('Hello'); break;
			case 'Hello1' : console.log('Hello1'); break;
			case 'Hello2' : console.log('Hello2'); break;
			default : console.log('!!!!'); break;
		}
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.08.19 Mission call
	var MissionCall = function() {
		var MissionMgr = require('./Mission/MissionMgr.js');

		var User = function() {
			this.uuid;
		}

		var p_user = new User();
		uuid = 1;

		MissionMgr.inst.MissionCollectHeroEvolution(p_user, 0, true);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.08.19 Sequelize Date 비교
	var SequelizeGroupBy = function() {
		var sequelize = mkDB.inst.GetSequelize();

		var uuid = 1;

		// GT_HERO select
		GTMgr.inst.GetGTHero().findAndCountAll({
			where : { UUID : uuid, EXIST_YN : true },
			order : "EVOLUTION_STEP"
		})
		.then(function (p_ret_hero) {
			console.log('Hero Count', p_ret_hero.count);

			for ( var row in p_ret_hero.rows ) {
				var hero_data = p_ret_hero.rows[row].dataValues;
				console.log('HERO_ID : %d, EVOLUTION_STEP : %d', hero_data.HERO_ID, hero_data.EVOLUTION_STEP);
			}
		})
		.catch(function (p_error) {
			logger.error('Error SequelizeGroupBy', p_error);
		});

		// call ad-hoc queyr
		sequelize.query('select EVOLUTION_STEP, count(EVOLUTION_STEP) as COUNT from GT_HEROes where UUID = ? group by EVOLUTION_STEP;',
				null,
				{ raw : true, type : 'SELECT' },
				[ uuid ]
		)
		.then(function (p_ret_evolution) {
			console.log('p_ret_evolution', p_ret_evolution);
		})
		.catch(function (p_error) {
			logger.error('Error call ad-hoc query', p_error);
		});

		var step_count2 = 0;
		var step_count3 = 0;
		var step_count4 = 0;
		var step_count5 = 0;
		var step_count6 = 0;

		// Group by
		GTMgr.inst.GetGTHero().findAll({
			attributes : [
				'EVOLUTION_STEP',
				[sequelize.fn('count', sequelize.col('EVOLUTION_STEP')), 'COUNT']
			],
			group : ["EVOLUTION_STEP"],
			where : { UUID : uuid, EXIST_YN : true }
		})
		.then(function (p_ret_group) {
			for ( var cnt in p_ret_group ) {
				console.log('%d, p_ret_group', cnt, p_ret_group[cnt].dataValues);
			}
		})
		.catch(function (p_error) {
			logger.error('Error group by', p_error);
		});		
	}


	//--------------------------------------------------------------------------------------------------------------
	// 2016.08.04 Sequelize Date 비교
	var SequelizeDateCompare = function() {
		var now = moment();
		var uuid = 3;

		// console.log(now.subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss'));
		// var str_now		= now.format('YYYY-MM-DD HH:mm:ss');

		// GT_FRIEND select
		// GTMgr.inst.GetGTFriend().findAndCountAll({
		// 	where : { UUID : uuid,
		// 		     IS_RECV_STAMINA : false,
		// 		     EXIST_YN : true }
		// })
		// .then(function (p_find_list) {
		// 	// console.log('p_find_list', p_find_list);
		// 	for ( var row in p_find_list.rows ) {
		// 		var find_data = p_find_list.rows[row].dataValues;
		// 		console.log('now : %s, RECV_STAMINA_DATE : %s, sub : %s, result :'
		// 			, now.format('YYYY-MM-DD HH:mm:ss')
		// 			, moment(find_data.RECV_STAMINA_DATE).format('YYYY-MM-DD HH:mm:ss')
		// 			, now.subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss')
		// 			, (moment(find_data.RECV_STAMINA_DATE).format('YYYY-MM-DD HH:mm:ss') >= now.subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss')));
		// 	}
		// })
		// .catch(function (p_error) {
		// 	logger.error('Error', p_error);
		// });

		var sequelize = mkDB.inst.GetSequelize();

		// GT_FRIEND select
		GTMgr.inst.GetGTFriend().findAndCountAll({
			// where : { UPDATE_DATE : { lte : now.subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss') } }
			// { gte : now.subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss') }
				// where : { $or : [ { RECV_STAMINA_DATE : null }, { RECV_STAMINA_DATE : 1 } ] }
			where : sequelize.and({ EXIST_YN : true }, sequelize.or({ RECV_STAMINA_DATE : null }, { RECV_STAMINA_DATE : { lte : now.subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss') } }))
		})
		.then(function (p_find_list) {
			// console.log('p_find_list', p_find_list);
			for ( var row in p_find_list.rows ) {
				console.log(p_find_list.rows[row].dataValues);
			}
		})
		.catch(function (p_error) {
			logger.error('Error', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.08.04 for 문법 테스트
	var Testfor = function () {
		var cur = 3;
		var max = 5;
		var temp_list = [1, 2, 3, 4, 5, 6];
		var ret_list = [];

		for ( var cnt in temp_list ) {
			var sum = (cur + parseInt(cnt, 10));
			console.log('cur : %d, cnt : %d, sum : %d, value :', cur, cnt, sum, temp_list[cnt]);

			ret_list.push(temp_list[cnt]);

			if ( sum >= (max - 1) )
				break;
		}

		console.log('ret_list', ret_list);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.08.04
	var SequelizeOrAnd = function() {
		var uuid = 5;
		var accept_uid_list = [];

		// GT_FRIEND_REQUEST select
		GTMgr.inst.GetGTFriendRequest().findAll({
			where : { REQUEST_UUID : uuid, UUID : { in : accept_uid_list } }
		})
		.then(function (p_ret_request_list) {
			console.log('p_ret_request_list', p_ret_request_list);
		})
		.catch(function (p_error) {
			logger.error('Error', p_error)
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.08.03 parseInt 변환 확인
	var ParseInt = function () {
		var temp = parseInt(1, 10);
		var temp1 = parseInt(null, 10);

		console.log('temp:', temp);
		console.log('temp1:', temp1);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.08.03 Sequelize Count
	var SequelizeCount = function() {
		var uuid = 1;
		GTMgr.inst.GetGTFriend().count({
			where : { UUID : uuid, EXIST_YN : true }
		})
		.then(function (p_ret_count) {
			console.log('count', p_ret_count);
			// result
			// count 0
		})
		.catch(function (p_error) {
			logger.error('error', p_error);
		});

		GTMgr.inst.GetGTFriend().findAndCountAll({
			where : { UUID : uuid, EXIST_YN : true }
		})
		.then(function (p_ret_count) {
			console.log('p_ret_count', p_ret_count);
			// console.log('count :', p_ret_count.count);
			for ( var cnt = 0; cnt < p_ret_count.count; ++cnt ) {
				console.log('%d :', cnt, p_ret_count.rows[cnt].dataValues);
			}
			// result
			// p_ret_count { count: 0, rows: [] }
		})
		.catch(function (p_error) {
			logger.error('error', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.07.26 Sequelize select
	var SequelizeOr = function() {
		var accept_uuid = 2;
		var uuid = 1;
		var sequelize = mkDB.inst.GetSequelize();

		// GT_FRIEND_REQUEST select
		// GTMgr.inst.GetGTFriendRequest().findAll({
		// 	where : sequelize.or( sequelize.and({ UUID : accept_uuid, REQUEST_UUID : uuid }), sequelize.and({ UUID : uuid, REQUEST_UUID : accept_uuid }))
		// })
		sequelize.query('select * from GT_FRIEND_REQUESTs where (UUID = ? and REQUEST_UUID = ?) or (UUID = ? and REQUEST_UUID = ?)',
				null,
				{ raw : true, type : 'SELECT' },
				[ accept_uuid, uuid, uuid, accept_uuid ]
		)
		.then(function (p_ret_request_list) {
			console.log('p_ret_request_list', p_ret_request_list);
			for ( var cnt in p_ret_request_list ) {
				console.log('%d p_ret_request_list', cnt, p_ret_request_list[cnt]);
			}			
		})
		.catch(function (p_error) {
			console.log('error', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.07.25 bit shift
	var BitShift = function() {
		var key_list = [ 5, 10, 15, 20, 25 ];

		var a = 5;
		var b = 10;
		var c = 15;

		var ret = ( 1 << a | 1 << b | 1 << c );
		var ret_list = [];

		for ( var cnt in key_list ) {
			// console.log('value : %d, ret :', key_list[cnt], (ret & (1 << key_list[cnt])));
			if ( (ret & (1 << key_list[cnt])) ) {
				// console.log('key :', key_list[cnt]);
				ret_list.push(key_list[cnt]);
			}
		}

		console.log('ret_list :', ret_list);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2017.07.25 moment year, month, day 얻기 호가인
	var MomentYearMonthDay = function () {
		var month = 2;
		var day = 4;

		// DB 컬럼도 varchar(2)로 하자. month()의 기준은 0부터
		console.log('year : %d, Month : %d, day : %d', moment().year(), moment().month() + 1, moment().date());
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.03.03 월 + 일로 HashMap 키 만들기
	var MakeMonthDayKey = function () {
		var month = 2;
		var day = 4;

		// DB 컬럼도 varchar(2)로 하자. month()의 기준은 0부터
		console.log('MM: %s, M: %s', moment().format('MM'), moment().month() + 1);
		console.log('HashMap key:', moment().format('MM') + moment().format('DD'));
		console.log('toFixed:', (month < 10 ? '0' : '') + month);
		console.log('today:', moment().date());
	}	

	//--------------------------------------------------------------------------------------------------------------
	// 2016.07.11 sequelize sum
	var SequelizeSum = function() {
		var uuid = 1, chapter_id = 101;
		var sequelize = mkDB.inst.GetSequelize();

		// GT_STAGE select
		GTMgr.inst.GetGTStage().findAll({
			attributes : [ [sequelize.fn('sum', sequelize.col('CLEAR_GRADE')), 'STAR'] ]
			
		})
		.then(function (p_ret_stage) {
			console.log('p_ret_stage', p_ret_stage);
			// for (var cnt in p_ret_stage) {
			// 	console.log('%d p_ret_stage', cnt, p_ret_stage[cnt].dataValues)
			// }
		})
		.catch(function (p_error) {
			logger.error('Error', p_error);
		});
		// mkDB.inst.GetSequelize()
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.07.08 Cycle Team
	var TeamCycle = function() {
		for (var tot = 0; tot < 8; ++tot) {
			// console.log('tot : %d', tot);
			if (tot < 5) {
				console.log('team %d', tot);
			} else {
				console.log('tag %d', tot - 5);
			}
		}
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.07.07 GachaMgr
	var HashMapSelect = function() {
		var temp_map = new HashMap();
		temp_map.set(1001, 1);
		temp_map.set(1, 2);

		console.log('temp_map', temp_map);
		console.log('temp_map.values()[0]', temp_map.values()[0]);
		console.log('temp_map.values()[1]', temp_map.values()[1]);
		console.log('temp_map.values()[2]', temp_map.values()[2]);
		console.log('temp_map.keys()[0]', temp_map.keys()[0]);
		console.log('temp_map.keys()[1]', temp_map.keys()[1]);
		console.log('temp_map.keys()[2]', temp_map.keys()[2]);

		console.log('DefineValues.inst.FirstCategoryHero', DefineValues.inst.FirstCategoryHero);
		console.log('DefineValues.inst.SecondCategorySummonHero', DefineValues.inst.SecondCategorySummonHero);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.07.04 GachaMgr
	var GachaMgr = function() {
		var BaseGachaRe = require('../Data/Base/BaseGachaRe.js');
		var GachaMgr = require('../Contents/Gacha/GachaMgr.js');

		var gacha_id = 1;
		var base_gacha = BaseGachaRe.inst.GetBaseGacha(gacha_id);
		if (base_gacha == undefined) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Gacha Info In Base');
			return;
		}

		// console.log('base_gacha', base_gacha);
		var target_group = base_gacha.GetNormalGachaItemGroup();
		console.log('target_group', target_group);

		var rand_value = Rand.inst.RandomRange(1, target_group.total_percent);
		console.log('gacha id ' + gacha_id + ' Max 범위 ' + target_group.total_percent + ' 결과 값은 ', rand_value );
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.06.28 Sequelize multi row insert
	var SequelizeBulkCreate = function() {
		var HeroSkill = function () {
			this.HERO_ID;
			this.SKILL_ID;
			this.SKILL_LEVEL;
		}

		var temp_skill = [];
		for (var cnt = 0; cnt < 3; ++cnt) {
			var skill = new HeroSkill();
			skill.HERO_ID = 1;
			skill.SKILL_ID = cnt + 1;
			skill.SKILL_LEVEL = 1;

			temp_skill.push(skill);
		}

		var insert_array = [];
		for (var cnt = 0; cnt < temp_skill.length; ++cnt) {
			insert_array.push({ 
				UUID: 1
				, HERO_ID: temp_skill[cnt].HERO_ID
				, SKILL_ID: temp_skill[cnt].SKILL_ID
				, SKILL_LEVEL: temp_skill[cnt].SKILL_LEVEL
				, REG_DATE: Timer.inst.GetNowByStrDate() 
			});
		}

		// insert_array.push({ UUID: 1, HERO_ID: 1, SKILL_ID: 1, SKILL_LEVEL: 1, REG_DATE: Timer.inst.GetNowByStrDate() });
		// insert_array.push({ UUID: 1, HERO_ID: 1, SKILL_ID: 2, SKILL_LEVEL: 1, REG_DATE: Timer.inst.GetNowByStrDate() });
		// insert_array.push({ UUID: 1, HERO_ID: 1, SKILL_ID: 3, SKILL_LEVEL: 1, REG_DATE: Timer.inst.GetNowByStrDate() });

		console.log('insert_array', insert_array);

		GTMgr.inst.GetGTHeroSkill().bulkCreate(
			insert_array
		)
		.then(function (p_ret_bulk) {
			for (var cnt in p_ret_bulk)
				console.log('%d p_ret_bulk', cnt, p_ret_bulk[cnt].dataValues);
		})
		.catch(function (p_error) {
			console.log('SequelizeBulkCreate', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.06.24 계정 경험치
	var AccountExp = function() {
		// select A.TARGET_LEVEL, A.HERO_TOTAL_EXP into m_target_level, m_target_exp
		// from (select TARGET_LEVEL, HERO_TOTAL_EXP from BT_EXPs where HERO_TOTAL_EXP <= m_sum_exp ) as A 
		// where A.TARGET_LEVEL <= m_user_level + 1
		// and A.TARGET_LEVEL <= (select TARGET_LEVEL from BT_EXPs order by TARGET_LEVEL desc limit 1)
		// order by A.TARGET_LEVEL desc limit 1;

		var BaseExpRe = require('../Data/Base/BaseExpRe.js');

		var account_level = 3;
		var sum_exp = 3000;

		var find_exp = BaseExpRe.inst.GetLevelupHeroExp(account_level, sum_exp);
		console.log('find_exp', find_exp);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.06.21 우편 보상
	var MailReward = function() {
		var PacketMail = require('../Packets/PacketMail/PacketMail.js');

		var Mail = require('./Mail/Mail.js');

		var ack_cmd = PacketMail.inst.cmdAckMailReward();
		var ack_packet = PacketMail.inst.GetPacketAckMailReward();

		console.log('ack_packet', ack_packet);

		var recv_packet = function () {
			this.mail_id;
		}

		var recv = new recv_packet();
		recv.mail_id = 1;

		var user = UserMgr.inst.SelectUser(1);

		Mail.inst.ReqMailRewardRe(user, recv, ack_cmd, ack_packet);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.06.21 보상
	var TestRewardPacket = function() {
		var Gold = function() {
			this.gold;
		}
		var Cash = function() {
			this.cash;
		}
		var Item = function() {
			this.iuid;
			this.item_id;
			this.item_count;
		}
		var Account = function() {
			this.account_exp;
			this.account_level;
			this.stamina;
			this.stamina_remain_time;
		}

		var RewardBox = function() {
			this.gold;
			this.cash;
			this.item;
			this.account;
		}

		var send_packet = new RewardBox();

		send_packet.gold = new Gold();
		// send_packet.cash = new Cash();
		send_packet.item = new Item();
		send_packet.account = new Account();

		send_packet.gold.total = 1000;
		// send_packet.cash.cash = 100;
		send_packet.item.iuid = 1;
		send_packet.item.item_id = 1010110;
		send_packet.item.item_count = 100;

		send_packet.account.account_exp = -100;
		send_packet.account.account_level = 1;
		send_packet.account.stamina = 1000;
		send_packet.account.stamina_remain_time = 100;

		console.log('result', JSON.stringify(send_packet));

		// {"gold":{"gold":1000}
		// ,"item":{"iuid":1,"item_id":1010110,"item_count":100}
		// ,"account":{"account_exp":-100,"account_level":1,"stamina":1000,"stamina_remain_time":100}}

		// gold 700
		// gold reward 150  event * 2 = 300

		// stamina 700
		// account level up 300

		// ret 1000

		// {
		//  	"gold":{"total":1000},
		// 	"cash":{"total":100},
		// 	"item":[{"iuid":1,"id":1010110,"count":100}],
		// 	"account":{"exp":2000, "levelup":{"level":2,"stamina":1000,"remain":100}},
		// 	"stamina":{"total":1000,"remain":100},
		// }

		// {
		// 	"reward_box_list":[
		// 		"gold":{"gold":1504},
		// 		"cash":{"cash":200},
		// 		"item":{"iuid":1504,"item_id":1010001,"item_count":1},
		// 		"account":{"account_exp":100, "account_level":10,"stamina:",10, "stamina_remain_time":60}
		// 	]
		// }
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.06.13 길드 레이드 챕터 랭킹 보상 메일 확인
	var SendRaidChapterClearReward = function() {
		var BaseGuild = require('../Data/Base/BaseGuild.js');
		var MailMgr = require('../Contents/Mail/MailMgr.js');

		var p_guild_id = 1;
		var p_chapter_id = 301;
		var p_stage_id = 30101;

		// GT_GUILD_RAID_CHAPTER_DAMAGE select
		GTMgr.inst.GetGTGuildRaidChapterDamage().findAll({
			where: { GUILD_ID: p_guild_id, CHAPTER_ID: p_chapter_id, EXIST_YN: true }
			, order: "ACCUM_DAMAGE desc"
		})
		.then(function (p_ret_guild_raid_chapter_damage) {
			for (var cnt in p_ret_guild_raid_chapter_damage) {
				(function (cnt) {
					var data_member = p_ret_guild_raid_chapter_damage[cnt].dataValues;

					var rank = parseInt(cnt) + 1;
					var rank_reward = BaseGuild.inst.GetChapterRankReward(p_chapter_id, rank);
					console.log('chapter_id: %d, rank: %d, rank_reward', p_chapter_id, rank, rank_reward);
					if (typeof rank_reward !== 'undefined') {
						var value_list = [];
						if (rank_reward.mail_string_id == DefineValues.inst.MailStringGuildRaidChapterRankReward1) {
							// 축하합니다! 레이드 {0}챕터를 모두 클리어 하셨습니다. \n총 누적 데미지량 : {1}\n누적 기여도 등수 : {2}\n {0}챕터를 모두 클리어 하여, 챕터 기여도 등수인 {3}위의 보상이 지급되었습니다.
							// {0}  챕터이름 {1} 누적데미지량  {2} 누적데미지 등수 {3}보상 등수
							value_list.push(p_chapter_id);
							value_list.push(data_member.ACCUM_DAMAGE);
							value_list.push(rank_reward.rank_min);
							value_list.push(rank);
						}
						else if (rank_reward.mail_string_id == DefineValues.inst.MailStringGuildRaidChapterRankReward2) {
							// 축하합니다! 레이드 {0}챕터를 모두 클리어 하셨습니다. \n총 누적 데미지량 : {1}\n누적 기여도 등수 : {2}\n {0}챕터를 모두 클리어 하여, 챕터 기여도 등수인 ({3}위~{4}위)위의 보상이 지급되었습니다.
							// {0}  챕터이름 {1} 누적데미지량  {2} 누적데미지 등수 {3}~{4}속해있는 보상 등수 
							value_list.push(p_chapter_id);
							value_list.push(data_member.ACCUM_DAMAGE);
							value_list.push(rank);
							value_list.push(rank_reward.rank_min);
							value_list.push(rank_reward.rank_max);
						}

						var make_value_list = null;
						for (var value_cnt in value_list) {
							make_value_list = (value_cnt == 0) ? value_list[value_cnt] : make_value_list + ',' + value_list[value_cnt];
						}

						console.log('make_value_list', make_value_list);

						// 우편 보상
						var mail_type = 'SYSTEM';
						MailMgr.inst.SendMail(data_member.UUID, mail_type, rank_reward.mail_string_id, make_value_list, '', '', rank_reward.reward_list);
					}

					// GT_GUILD_RAID_MEMBER update
					mkDB.inst.GetSequelize().query('update GT_GUILD_RAID_MEMBERs set IS_REWARD_CHAPTER = ? \
										where UUID = ? and GUILD_ID = ? and CHAPTER_ID = ?;'
					, null
					, { raw: false, type: 'UPDATE' }
					, [ true, data_member.UUID, p_guild_id, p_chapter_id ]
					)
					.then(function (p_ret_guild_raid_member_update) {
						logger.info('SendRaidChapterClearReward', p_ret_guild_raid_member_update.dataValues.IS_REWARD_CHAPTER);
					})
					.catch(function (p_error) {
						console.log('GTMgr.inst.GetGTGuildRaidMember() update', p_error);
					});
				})(cnt);
			}
		})
		.catch(function (p_error) {
			console.log('GTMgr.inst.GetGTGuildRaidMember().findAll', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.06.10 길드 레이드 스테이지 랭킹 보상 메일 확인
	var SendGuildRaidStageRankReward = function() {
		var BaseGuild = require('../Data/Base/BaseGuild.js');
		var MailMgr = require('../Contents/Mail/MailMgr.js');

		var p_guild_id = 1;
		var p_chapter_id = 301;
		var p_stage_id = 30101;

		// GT_GUILD_RAID_MEMBER select
		GTMgr.inst.GetGTGuildRaidMember().findAll({
			where: { GUILD_ID: p_guild_id, CHAPTER_ID: p_chapter_id, STAGE_ID: p_stage_id, EXIST_YN: true }
			, order: "ACCUM_DAMAGE desc"
		})
		.then(function (p_ret_guild_member) {
			for (var cnt in p_ret_guild_member) {
				var data_member = p_ret_guild_member[cnt].dataValues;
				var rank = parseInt(cnt) + 1;
				// console.log('rank type -', Object.prototype.toString.call(rank));
				var rank_reward = BaseGuild.inst.GetStageRankReward(p_stage_id, rank);
				// console.log('%d rank_reward', rank, rank_reward);
				if (typeof rank_reward !== 'undefined') {
					var value_list = [];
					if (rank_reward.mail_string_id == DefineValues.inst.MailStringGuildRaidStageRankReward1) {
						// "축하합니다! {0}의 Boss {1}를 무찔르셨습니다. \\n총 누적 데미지량 : {2}\\n누적 데미지 등수 : {3}\\n레이드Boss를 클리어 하여, 누적 데미지 등수인 {4}위의 보상이 지급되었습니다."
						// {0} 스테이지이름 {1} 보스이름  {2} 누적데미지량  {3} 누적데미지 등수 {4}보상 등수
						value_list.push(p_chapter_id);
						value_list.push(p_stage_id);
						value_list.push(data_member.ACCUM_DAMAGE);
						value_list.push(rank_reward.rank_min);
						value_list.push(rank);
					}
					else if (rank_reward.mail_string_id == DefineValues.inst.MailStringGuildRaidStageRankReward2) {
						// "축하합니다! {0}의 Boss {1}를 무찔르셨습니다. \\n총 누적 데미지량 : {2}\\n누적 데미지 등수 : {3}\\n레이드Boss를 클리어 하여, 누적 데미지 등수인 ({4}위~{5}위)위의 보상이 지급되었습니다."
						// {0} 스테이지이름 {1} 보스이름  {2} 누적데미지량  {3} 누적데미지 등수 {4}~{5}속해있는 보상등수
						value_list.push(p_chapter_id);
						value_list.push(p_stage_id);
						value_list.push(data_member.ACCUM_DAMAGE);
						value_list.push(rank);
						value_list.push(rank_reward.rank_min);
						value_list.push(rank_reward.rank_max);
					}

					var make_value_list = null;
					for (var cnt in value_list) {
						make_value_list = (cnt == 0) ? value_list[cnt] : make_value_list + ',' + value_list[cnt];
					}

					console.log('value_list', value_list);

					// 우편 보상
					var mail_type = 'SYSTEM';
					MailMgr.inst.SendMail(data_member.UUID, mail_type, rank_reward.mail_string_id, make_value_list, '', '', rank_reward.reward_list);
				}
			}
		})
		.catch(function (p_error) {
			// Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'GTMgr.inst.GetGTGuildRaidMember().findAll');
			console.log('Error', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.05.25 무한탑 랭킹 보상 메일 확인
	var SendInfinityTowerRankReward = function() {
		var BaseInfinityTower = require('../Data/Base/BaseInfinityTower.js');
		var MailMgr = require('../Contents/Mail/MailMgr.js');

		var p_uuid = 1;
		var p_rank = 1;

		var rank_reward = BaseInfinityTower.inst.GetRankReward(p_rank);
		console.log('rank_reward', rank_reward);
		if (typeof rank_reward === 'undefined') {
			logger.error('NoBaseInfinityTowerRankReward', p_rank);
			return;
		}

		var value_list = [];
		if (rank_reward.mail_string_id == DefineValues.inst.MailStringInfinityTowerRankReward1) {
			value_list.push(p_rank);
		}
		else if (rank_reward.mail_string_id == DefineValues.inst.MailStringInfinityTowerRankReward2) {
			value_list.push(rank_reward.rank_min);
			value_list.push(rank_reward.rank_max);
		}
		console.log('value_list', value_list);

		var make_value_list = null;
		for (var cnt in value_list) {
			make_value_list = (cnt == 0) ? value_list[cnt] : make_value_list + ',' + value_list[cnt];
		}
		console.log('make_value_list', make_value_list);

		// 우편 보상
		var mail_type = 'SYSTEM';
		var sender = '';
		MailMgr.inst.SendMail(p_uuid, sender, mail_type, rank_reward.mail_string_id, make_value_list, '', '', rank_reward.reward_list);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.05.23 DefinValues 값 확인
	var CheckDefineValues = function() {
		console.log('Guild', DefineValues.inst.GuildRaidChapterClear());
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.05.20 폴더 명
	var GetFolderName = function() {
		console.log("dirname", __dirname);
		console.log("finename", __filename);

		var path_list = __dirname.split("/");
		console.log('path_list', path_list);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.05.19 sequelize select where in 조건
	var SequelizeWhereIn2 = function() {
		var packet = function() {
			this.game_mode;
			this.battle_power;
		}

		var battle_power_list = [];

		for (var cnt = 0; cnt < 3; ++cnt) {
			var temp = new packet();
			temp.game_mode = cnt + 1;
			temp.battle_power = (cnt + 1) * 1000;

			battle_power_list.push(temp);
		}

		var uuid = 1;
		var game_mode = [];

		for (var cnt in battle_power_list) {
			game_mode.push(battle_power_list[cnt].game_mode);			
		}

		// GT_TEAM select
		GTMgr.inst.GetGTTeam().findAll({
			where: { UUID: uuid, EXIST_YN: true, GAME_MODE: game_mode }
		})
		.then(function(p_ret_team) {
			// console.log('p_ret_team', p_ret_team);
			for (var cnt in p_ret_team) {
				console.log('p_ret_team[%d]', cnt, p_ret_team[cnt].dataValues.GAME_MODE, p_ret_team[cnt].dataValues.BATTLE_POWER);

				p_ret_team[cnt].updateAttributes({
					BATTLE_POWER: battle_power_list[cnt].battle_power
				})
				.then(function(p_ret_battle_power_update) {
					console.log('game_mode: %d, battle_power: %d', p_ret_battle_power_update.dataValues.GAME_MODE, p_ret_battle_power_update.dataValues.BATTLE_POWER);
				})
				.catch(function(p_error) {
					console.log('p_ret_team[%d].updateAttributes', cnt, p_error);
				});
			}
		})
		.catch(function(p_error) {
			logger.error('GTMgr.inst.GetGTTeam().findAll', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.05.12 날짜 빼기
	var MomentSubtract = function() {
		var days = moment().diff(moment('2016-05-12 06:45:51'), 'days');
		console.log('days', days);

		var seconds = moment().diff(moment('2016-05-23 14:25:00'), 'seconds');
		console.log('seconds', seconds);
	}
	
	//--------------------------------------------------------------------------------------------------------------
	// 2016.04.26
	var CronTab = function() {
		var crontab = require('node-crontab');

		var jobId = crontab.scheduleJob("*/1 * * * *", function() {
			console.log('Hello World');
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.04.25
	var SendInfinityTowerMail = function() {
		var BaseInfinityTower = require('../Data/Base/BaseInfinityTower.js');

		var rank = 15;

		var rank_reward = BaseInfinityTower.inst.GetRankReward(rank);
		if (typeof rank_reward === 'undefined') {
			Sender.inst.toPeerError(p_user, p_packet_cmd, 'retCode', PacketInfinityTower.inst.retNoBaseInfinityTowerRankReward(), 'rank', p_rank);
			return;
		}

		console.log('rank_reward', rank_reward);

		var p_uuid = 1;
		var sequelize = mkDB.inst.GetSequelize();
		var max_save_count = 10;

		// GT_MAIL select
		GTMgr.inst.GetGTMail().findAll({
			where: { UUID: p_uuid, EXIST_YN: true }
			, order: [[ 'REG_DATE', 'desc' ]]
		})
		.then(function(p_ret_mail) {
			// console.log('p_ret_mail', p_ret_mail.count);
			for (var cnt in p_ret_mail) {
				if (cnt >= (max_save_count - 1)) {
					p_ret_mail[cnt].updateAttributes({
						EXIST_YN: false
					})
					.then(function(p_ret_mail_update) {
						logger.info('Mail delete', cnt, 'mail_id', p_ret_mail_update.dataValues.MAIL_ID);
					})
					.catch(function(p_error) {
						logger.error('error p_ret_mail[cnt].updateAttributes', cnt, p_error)
					});
				}
			}
		})
		.catch(function(p_error) {
			logger.error('error GTMgr.inst.GetGTMail().findAll', p_error);
		});

		// GT_MAIL create
		GTMgr.inst.GetGTMail().create({
			UUID: p_uuid
			, MAIL_SENDER: 0
			, MAIL_TYPE: 'SYSTEM'
			, MAIL_ICON_TYPE: (typeof rank_reward.reward_list[0] === 'undefined') ? 0 : rank_reward.reward_list[0].reward_type
			, MAIL_ICON_ITEM_ID: (typeof rank_reward.reward_list[0] === 'undefined') ? 0 : rank_reward.reward_list[0].reward_item_id
			, MAIL_ICON_COUNT: (typeof rank_reward.reward_list[0] === 'undefined') ? 0 : rank_reward.reward_list[0].reward_count
			, MAIL_SUBJECT: '1'
			, MAIL_CONTENT: '2'
			, REWARD1_TYPE: (typeof rank_reward.reward_list[0] === 'undefined') ? 0 : rank_reward.reward_list[0].reward_type
			, REWARD1_ITEM_ID: (typeof rank_reward.reward_list[0] === 'undefined') ? 0 : rank_reward.reward_list[0].reward_item_id
			, REWARD1_COUNT: (typeof rank_reward.reward_list[0] === 'undefined') ? 0 : rank_reward.reward_list[0].reward_count
			, REWARD2_TYPE: (typeof rank_reward.reward_list[1] === 'undefined') ? 0 : rank_reward.reward_list[1].reward_type
			, REWARD2_ITEM_ID: (typeof rank_reward.reward_list[1] === 'undefined') ? 0 : rank_reward.reward_list[1].reward_item_id
			, REWARD2_COUNT: (typeof rank_reward.reward_list[1] === 'undefined') ? 0 : rank_reward.reward_list[1].reward_count
			, REWARD3_TYPE: (typeof rank_reward.reward_list[2] === 'undefined') ? 0 : rank_reward.reward_list[2].reward_type
			, REWARD3_ITEM_ID: (typeof rank_reward.reward_list[2] === 'undefined') ? 0 : rank_reward.reward_list[2].reward_item_id
			, REWARD3_COUNT: (typeof rank_reward.reward_list[2] === 'undefined') ? 0 : rank_reward.reward_list[2].reward_count
			, REWARD4_TYPE: 0, REWARD4_ITEM_ID: 0, REWARD4_COUNT: 0
			, REWARD5_TYPE: 0, REWARD5_ITEM_ID: 0, REWARD5_COUNT: 0
			, REG_DATE: moment().format('YYYY-MM-DD HH:mm:ss')
		})
		.then(function(p_ret_mail) {
			console.log('mail insert', p_ret_mail);
		})
		.catch(function(p_error) {
			logger.error('error GTMgr.inst.GetGTMail().create', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.04.22 Sequelize find 테스트
	var SequelizeFind = function() {
		var p_uuid = 1;
		GTMgr.inst.GetGTInfinityTowerTeam().find({
			where: { UUID: p_uuid, EXIST_YN: true}
		})
		.then(function(p_ret_record) {
			GTMgr.inst.GetGTTeam().find({
				where: { UUID: p_uuid, GAME_MODE: DefineValues.inst.GameModeInfinityTower, EXIST_YN: true }
			})
			.then(function(p_ret_team) {
				// console.log('p_ret_team', p_ret_team.dataValues);
				for (var cnt = 0; cnt < DefineValues.inst.MaxTeamSlot; ++ cnt) {
					(function(cnt) {
						var slot_index = ((cnt < DefineValues.inst.MaxBaseTeamSlotCount()) ? cnt : cnt - DefineValues.inst.MaxBaseTeamSlotCount()) + 1;
						var column = ((cnt < DefineValues.inst.MaxBaseTeamSlotCount()) ? 'SLOT' : 'TAG_SLOT') + slot_index;

						GTMgr.inst.GetGTHero().find({
							where: { UUID: p_uuid
									, HERO_ID: p_ret_team.dataValues[column] }
						})
						.then(function(p_ret_hero) {
							var hero_id = 0;
							var hero_level = 0;
							var promotion_step = 0;
							var evolution_step = 0;

							if (p_ret_hero != null) {
								hero_id = p_ret_hero.dataValues.HERO_ID;
								hero_level = p_ret_hero.dataValues.HERO_LEVEL;
								promotion_step = p_ret_hero.dataValues.REINFORCE_STEP;
								evolution_step = p_ret_hero.dataValues.EVOLUTION_STEP;
							}

							p_ret_record[column + '_HERO_ID'] = hero_id;
							p_ret_record[column + '_HERO_LEVEL'] = hero_level;
							p_ret_record[column + '_REINFORCE_STEP'] = promotion_step;
							p_ret_record[column + '_EVOLUTION_STEP'] = evolution_step;

							if (cnt == DefineValues.inst.MaxTeamSlot - 1)
								p_ret_record.save().then(function(p_ret_update) {
									console.log('p_ret_update', p_ret_update);
								})
								.catch(function(p_error) {
									logger.error('error p_ret_record.update', p_error);
								});
						})
						.catch(function(p_error) {
							logger.error('error GTMgr.inst.GetGTHero().find', p_error);
						});
					})(cnt);
				}
			})
			.catch(function(p_error) {
				logger.error('error GTMgr.inst.GetGTTeam().find', p_error);
			});
		})
		.catch(function(p_error) {
			logger.error('error GTMgr.inst.GetGTInfinityTowerTeam().find', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.04.20 Sequelize update 문 <= 확인
	var SequelizeUpdate2 = function() {
		// TODO : GT_VIP 없어짐
		GTMgr.inst.GetGTVip().update(
			{ 'BUY_STAMINA_COUNT': 100, BUY_GOLD_COUNT: 0, BUY_ADD_ATTEND_COUNT: 0}, { UUID: 5, EXIST_YN: true }
		)
		.then(function(p_ret_vip) {
			console.log('p_ret_vip', p_ret_vip);
		})
		.catch(function(p_error) {
			console.log('p_error', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.04.20 Sequelize where in 문 <= 확인
	var SequelizeWhereIn = function() {
		GTMgr.inst.GetGTTeam().find({
			where: { UUID: 1, GAME_MODE: DefineValues.inst.GameModeInfinityTower, EXIST_YN: true }
		})
		.then(function(p_ret_team) {
			console.log('p_ret_team', p_ret_team);

			GTMgr.inst.GetGTHero().findAll({
				where: { UUID: 1, HERO_ID: { in: [ p_ret_team.SLOT1, p_ret_team.SLOT2, p_ret_team.SLOT3, p_ret_team.SLOT4, p_ret_team.SLOT5, p_ret_team.SLOT6 ]}}
			})
			.then(function(p_ret_hero) {
				console.log('p_ret_hero', p_ret_hero);
			})
			.catch(function(p_error) {
				logger.error('error GTMgr.inst.GetGTHero().findAll', p_error);
			});
		})
		.catch(function(p_error) {
			console.log('error GTMgr.inst.GetGTTeam()', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.04.18 Sequelize update 문 <= 확인
	var SequelizeUpdate = function() {
		// TODO : GT_VIP 없어짐
		GTMgr.inst.GetGTVip().update(
			{ BUY_STAMINA_COUNT: 0, BUY_GOLD_COUNT: 0, BUY_ADD_ATTEND_COUNT: 0}, { UUID: 1, EXIST_YN: true }
		)
		.then(function(p_ret_vip) {
			console.log('p_ret_vip', p_ret_vip);
		})
		.catch(function(p_error) {
			console.log('p_error', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.04.06 Sequelize where 문 <= 확인
	var SequelizeWhere = function() {
		GTMgr.inst.GetGTInfinityTowerFloor().findAll({
			where: { UUID: 1, EXIST_YN: true, FLOOR: { lte: 2} }
		})
		.then(function(p_ret_floor) {
			// console.log('p_ret_floor', p_ret_floor);
			for(var cnt in p_ret_floor) {
				console.log('p_ret_floor[cnt].dataValues', p_ret_floor[cnt].dataValues);
			}
		})
		.catch(function(p_error) {
			console.log('p_error', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.04.07 시간비교로 초기화 하는 방법
	var TimeDiff = function() {

		var last_time = moment('2016-04-07 06:00:00');
		var base_time = moment().hours('04').minutes('00').seconds('00');
		var now = moment().format('YYYY-MM-DD HH:mm:ss');
	
		console.log('base', base_time.format('YYYY-MM-DD HH:mm:ss'));
		console.log('now', now);

		// console.log('isBefore', moment().isBefore(base_time));
		// console.log('isAfter', moment().isAfter(base_time));

		if (moment().isBefore(base_time)) {
			base_time.subtract(1, 'days');
			console.log('base_time -1 days');
		} else {
			console.log('base_time');
		}

		console.log('base_time', base_time.format('YYYY-MM-DD HH:mm:ss'));
		console.log('last_time', last_time.format('YYYY-MM-DD HH:mm:ss'));

		if (last_time.isAfter(base_time)) {
			console.log('Old');
		} else {
			console.log('New');
		}
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.03.18 winston - logger 테스트
	var WinstonLogger = function () {
		var SendPacket = function () {
			this.first;
			this.sencond;
			this.third = [];
		}

		var dummy = function () {
			this.temp1;
			this.temp2;
		}

		var packet = new SendPacket();
		packet.first = 'hello';
		packet.sencond = 'hahaha';

		for (var cnt = 0; cnt < 4; ++cnt) {
			var temp = new dummy();
			temp.temp1 = cnt;
			temp.temp2 = 'two' + cnt;

			packet.third.push(temp);
		}

		logger.info('1 - packet:', packet, 11);
		console.log('2 - packet:', packet);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.03.17 Sequelize 테스트
	var SequelizeDefine = function () {
		var temp = mkDB.inst.GetSequelize().define('GT_TEMP', {
			TEMP_ID: { type: sequelize_module.INTEGER, allowNull: false },
            TEMP_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
            TEMP_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
		});

		// console.log('temp:', temp);
		temp.sync({force:true});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.03.11 HashMap get
	var HashMapGet = function () {
		var hash = new HashMap();
		hash.set(3, 30);
		hash.set(1, 10);
		hash.set(2, 20);

		console.log('hash.get(1):', hash.get(1));
		console.log('hash.get(3):', hash.get(3));
		console.log('hash.get(0):', hash.get(0));
		console.log('hash.get(4):', hash.get(4));
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.03.08 BaseSummon 확인
	var CheckBaseSummon = function () {

		console.log(BaseMgr.inst.GetSummonMap());

		BaseMgr.inst.GetSummonMap().forEach(function (value, key) {
			console.log('----- Summons Map -----');
			console.log('key:', key);
		});

		BaseMgr.inst.GetSummonTraitExpMap().forEach(function (value, key) {
			console.log('----- Summons Trait Map -----');
			console.log('key:', key);
			console.log('value:', value);

			value.exp_map.forEach(function (value, key) {
				console.log('value:', value);				
			});
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.03.08 javascrtip slice
	var StringSlice = function () {
		var temp = '0311';
		console.log('day:', parseInt(temp.slice(2, 4)));
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.03.07 array find 테스트
	var ArrayFind = function () {
		var temp_array = [ 5, 10, 15 ];
		console.log('find:', temp_array.indexOf(5));
		console.log('find:', temp_array.indexOf(11));
		// result
		// find: 0
		// find: -1
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.03.04 array pop 함수
	var ArrayPop = function () {
		var temp = [2, 3];
		console.log('pop:', temp.pop());
		console.log('temp:', temp);

		console.log('pop:', temp.pop());
		console.log('temp:', temp);

		console.log('pop:', temp.pop());
		console.log('temp:', temp);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.02.23 HashMap key sorting??
	var HashMapKeySort = function () {
		var test_map = new HashMap();
		test_map.set('3', 'three');
		test_map.set('1', 'one');
		test_map.set('5', 'five');
		test_map.set('2', 'two');

		test_map.forEach(function (value, key) {
			console.log('key: %d, value:', key, value);
		});

		var test_array = [];
		test_array.push('three');
		test_array.push('one');
		test_array.push('five');
		test_array.push('two');

		for (var cnt in test_array) {
			// console.log('test_array:', test_array[cnt]);

			if (test_array[cnt] == 'five')
				delete test_array[cnt];
		}

		for (var cnt in test_array) {
			console.log('test_array:', test_array[cnt]);
		}
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.02.19 유저 정보얻기
	var GetUserInfo = function () {
		var temp = [1, 2, 3];
		GTMgr.inst.GetGTUser().findAll({
				where: { UUID: temp }
			})
			.success(function (p_ret) {
				console.log('p_ret:', p_ret[0]);

			})
			.error(function (p_error) {
				logger.error('GetGTShop().find p_error -', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.02.19 로그인 시간 테스트 YYYY-MM-DD HH:mm:ss 를 초로 변환
	var ConvertDataTimeToSeconds = function () {
		// unix time milliseonds
		var today_unix = moment().unix();
		console.log('today_unix:', today_unix);

		var today = moment(today_unix * 1000).format('YYYY-MM-DD HH:mm:ss');
		console.log('today:', today);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.02.1 랜덤상자 IDs 만들기
	var MakeRandomBoxIDs = function () {
		var box_ids = [1, 1, 2, 3, 4];

		var ids = '';
		for (var i = 0; i < box_ids.length; ++i) {
			console.log(box_ids[i].toString());
			ids = (i == 0) ? box_ids[i].toString() : ids + ',' + box_ids[i].toString();
		}

		console.log('ids', ids);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.02.04 random box 테스트
	var UseRandomBox = function () {


		var group_id = 1040001;
		var randombox_group = BaseMgr.inst.GetRandomBoxGroup(group_id);

		// console.log('randombox_group:', randombox_group);

		var randomBox = randombox_group.SelectBox();
		console.log('randomBox:', randomBox);

		// BaseMgr.inst.GetRandomBoxGroupMap().forEach(function (value, key) {
		// 	console.log('key: %d, RandomBox ID: %d, accum_rate: %d', key, value.GetRandomBoxGroupID(), value.GetAccumRate());

		// 	value.GetBoxMap().forEach(function (value, key) {
		// 		console.log('key: %d, box:', key, value);
		// 	});
		// });
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.02.03 undefined 에 숫자를 더하면?? undefined 일껄??
	var UndefinedAdd = function () {
		var temp;
		temp = (typeof temp === 'undefined') ? 0 : temp + 10;

		console.log('temp:', temp);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.26 랜덤 상점 오픈
	var RandomShopOpen = function () {
		var Shop = require('./Shop/Shop.js');

		var uuid = 1;
		var user = UserMgr.inst.SelectUser(uuid);
		Shop.inst.RandomShopOpen(user);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.22 sequelize DB insert 때 입력 값 대로 시간 적용
	// 하아....sp 로 실행하는건 그냥 들어가고 sequelize 함수를 이용하는건 UTC로 들어가고..
	// 그리고 MySQL WorkBench에서 SP 실행하면 또 시간이 달라지고
	var sequelizeTimeStoredProcedure = function () {
		var uuid = 1;

		// 현재 시간을 UTC로 설정
		var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');		
		console.log('date', date);

		mkDB.inst.GetSequelize().query('call sp_insert_time(?, ?);', null, { raw: true, type: 'SELECT' }
			, [ uuid,  date ]
		)
		.success(function (p_ret) {
			console.log('p_ret -', p_ret);
		})
		.error(function (p_reason) {
			console.log('p_reason -', p_reason);
		});
	}
	
	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.14 sequelize DB insert 때 UTC 시간 적용
	var sequelizeTime = function () {
		var uuid = 7;

		var gt_time = GTMgr.inst.GetGTTime();
		console.log('now -', moment().format('YYYY-MM-DD HH:mm:ss'));

		// 이건 UTC 로 DB에 들어 간다.
		gt_time.build({
			UUID : uuid
			, REG_DATE : moment().format('YYYY-MM-DD HH:mm:ss')
		})
		.save()
		.then(function (p_anotherTask) {
			console.log('p_anotherTask -', p_anotherTask);
		}).catch(function (p_error) {
			console.log('p_error -', p_error);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.22 moment time.add
	var momentAdd = function () {
		var last_date = moment('2016-01-22 17:15:42');
		var add_point = 2;
		var add_time = 180;

		var now = last_date.add(add_point * add_time, 'seconds');
		console.log('now:', now);
	}	

	//--------------------------------------------------------------------------------------------------------------
	// 2015.12.29 Skill cool time charge - 스킬 포인트는 3분당 1씩 충전
	var SkillPoint = function () {
		var point = 10;
		var max_point = 20;
		var charge_sec = 180;

		// var now = moment();
		var now = moment();
		var last = moment('2016-01-22 14:03:00');

		console.log('now: %s', now.format('YYYY-MM-DD HH:mm:ss'));
		console.log('last: %s', last.format('YYYY-MM-DD HH:mm:ss'));

		var diff_sec = now.diff(last, 'seconds');
		console.log('point: %d, max_point: %d, diff_sec: %d', point, max_point, diff_sec);

		// 스킬포인트가 full 이면 갱신하지 않는다.
		if (max_point > point) {
			var diff_sec = now.diff(last, 'seconds');
			var add_point = Math.round(diff_sec / charge_sec);

			console.log('Charge - diff_sec: %d, diff_min: %d, add_point: %d', diff_sec, Math.round(diff_sec / 60), add_point);

			point = point + add_point;

			var remain_time = 0;
			if (point > max_point) {
				point = max_point;
			} else {
				remain_time = (max_point - point) * charge_sec;
				remain_time = remain_time - (diff_sec % charge_sec);

				now = last.add(add_point * charge_sec, 's');
			}

			console.log('result point: %d, remain_sec: %d, remain_min: %d, now: %s', point, remain_time, Math.round(remain_time / 60), now.format('YYYY-MM-DD HH:mm:ss'));
		} else {
			console.log('Not charge');
		}
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.22 moment 에 DB 시간 대입 테스트
	var momentDBTime = function () {
		var date_time = '2016-01-22 11:49:00';

		console.log('moment()', moment());
		console.log('moment(date_time): ', moment(date_time));

		console.log('close time:', moment())
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.21 ShopResetTime 테스트
	var ShopReamainResetTime = function () {		
		var time_map = new HashMap();
		// time_map.set(5, '00:00');
		time_map.set(4, '06:00');
		time_map.set(3, '09:00');
		time_map.set(2, '12:00');
		time_map.set(1, '18:00');
		time_map.set(6, '20:00');
		time_map.set(7, '21:00');

		var now = moment(now).hours('22').minutes('00').seconds('00');
		// var now = moment(now);

		var time_before = undefined;
		var time_after = undefined;
		var before = undefined;
		var after = undefined;
		var temp = undefined;
		var min_time = undefined;

		time_map.forEach(function (value, key) {
			// console.log('key:', key);
			temp = key + ', ' + value;
			
			var src_time = moment(now).hours(value.split(':')[0]).minutes(value.split(':')[1]).seconds('00');
			// console.log('index: %d - now: %s, src_time: %s, isAfter:', time_map[cnt][0], now.format('HH:mm:ss'), src_time.format('HH:mm:ss'), now.isAfter(src_time));
			
			// 현재 시간을 기준으로 바로 이전 시간을 찾는다.
			if (src_time.isBefore(now) || src_time.isSame(now)) {
				// var temp = (typeof before === 'undefined') ? src_time : src_time.isAfter(before) ? src_time : before;
				if (typeof before === 'undefined') {
					before = src_time;
					time_before = temp;
					// console.log('undefined before: %s, time_before:', (typeof before !== 'undefined') ? before.format('HH:mm:ss') : undefined, time_before);
				} else {
					if (src_time.isAfter(before)) {
						before = src_time;
						time_before = temp;
						// console.log('before: %s, time_before:', (typeof before !== 'undefined') ? before.format('HH:mm:ss') : undefined, time_before);
					}
				}
			}

			// 현재 시간을 기준으로 바로 다음 시간을 찾는다.
			if (src_time.isAfter(now)) {
				if (typeof after === 'undefined') {
					after = src_time;
					time_after = temp;
					// console.log('undefined after: %s, time_after:', (typeof after !== 'undefined') ? after.format('HH:mm:ss') : undefined, time_after);
				} else {
					if (src_time.isBefore(after)) {
						after = src_time;
						time_after = temp;
						// console.log('after: %s, time_after:', (typeof after !== 'undefined') ? after.format('HH:mm:ss') : undefined, time_after);
					}
				}
			}

			// 다음 날 첫 시간을 위해서 저장
			// ex) 하루 중 마지막 충전 시간이 21:00 이고 현재 시간이 22:00 이면 다음 충전까지 남은 시간은 오늘이 아닌 다음 날 첫번째 시간 까지 이다.
			// 다음날 첫 번째 시간을 만들기 위해서 충전 시간 중 최초 충전 시간을 저장 한다.
			if (src_time.isBefore(min_time))
				min_time = src_time;
		});

		console.log('result time_before:', time_before);
		console.log('result time_after:', time_after);

		if (typeof time_after !== 'undefined') {
			var diff = after.diff(now);
			var diff_s = after.diff(now, 'seconds');
			var diff_m = after.diff(now, 'minutes');
			var diff_h = after.diff(now, 'hours');

			console.log('now: %s, after: %s, diff: %d', now.format('HH:mm:ss'), after.format('HH:mm:ss'), diff);
			console.log('diff: %d, diff_s: %d, diff_m: %d, diff_h: %d', diff, diff_s, diff_m, diff_h);
		} else {			
			var tomorrow = min_time.add(1, 'days');
			console.log('now: %s, tomorrow: %s', now.format('YYYY-MM-DD HH:mm:ss'), tomorrow.format('YYYY-MM-DD HH:mm:ss'))
			var diff = tomorrow.diff(now);
			var diff_s = tomorrow.diff(now, 'seconds');
			var diff_m = tomorrow.diff(now, 'minutes');
			var diff_h = tomorrow.diff(now, 'hours');

			console.log('diff: %d, diff_s: %d, diff_m: %d, diff_h: %d', diff, diff_s, diff_m, diff_h);
		}

		// 다음 날 첫번째 시간
		console.log('min_time:', min_time.format('HH:mm:ss'));
	}	

	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.18 Shop 테이블 로드 확인
	var LoadShop = function () {


		var shops = [ BaseMgr.inst.GetShopNormalMap(), BaseMgr.inst.GetShopPvpMap(), BaseMgr.inst.GetShopGuildMap(), BaseMgr.inst.GetShopRandomMap() ];
		
		var shop = shops[0];
		shop.forEach(function (value, key) {
			console.log('shop_id: %d, level_min: %d, level_max: %d', value.GetShopID(), value.GetLevelMin(), value.GetLevelMax());
			var items = value.GetItems();
			for (var cnt = 0; cnt < items.length; ++cnt) {
				var item_id = items[cnt].item_id;
				var buy_cost_type = items[cnt].buy_cost_type;
				var item_count = items[cnt].item_count;
				console.log('item_id: %d, buy_cost_type: %d, item_count: %d', item_id, buy_cost_type, item_count);
			}
		});

		// 배열 일때
		// for (var i = 0; i < shop.count(); i++) {
		// 	var info = shop[i];
		// 	console.log('shop_id: %d, level_min: %d, level_max: %d', info.GetShopID(), info.GetLevelMin(), info.GetLevelMax());
		// 	var items = shop[i].GetItems();
		// 	for (var j = 0; j < items.length; ++j) {
		// 		var item_id = items[j].item_id;
		// 		var buy_cost_type = items[j].buy_cost_type;
		// 		var item_count = items[j].item_count;
		// 		console.log('item_id: %d, buy_cost_type: %d, item_count: %d', item_id, buy_cost_type, item_count);
		// 	}
		// }
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.15 Buy cash 누적 보석 갯수 테스트
	var BuyCash = function () {
		var diff_values = [0, 60, 300, 600, 1000, 3000, 5000, 8000, 12000, 20000, 30000, 50000, 80000, 120000, 200000, 500000];
		var value = 400000;
		var result = 0;

		for (var cnt = 0; cnt < diff_values.length; ++cnt) {
			result = diff_values[cnt];
			if (value <= diff_values[cnt]) {
				console.log('value: %d <= diff_values[%d]: %d', value, cnt, result);

				if (value == result) {
					console.log('value == result: %d', result);
				} else {
					result = diff_values[cnt - 1];
					console.log('value != result: %d', result);
				}
				break;
			} else {
				console.log('value: %d > diff_values[%d]: %d', value, cnt, result);
			}
		}

		console.log('result: %d', result);
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2015.12.30 문법
	var test = function () {
		var temp = 3;
		var ret = (temp - 1) < 0 ? 0 : temp;

		console.log('ret -', ret);
	}
	//--------------------------------------------------------------------------------------------------------------
	// 2016.01.06 Create material - 재료 아이템 생성
	var ReqCreateMaterial = function (p_socket, json_packet) {
		var json = JSON.parse(p_packet);
		if (json == null) {
			logger.error("json ReqCreateItem : " + p_packet);
			return;
		}

		// console.log('ReqCreateItem - ', p_packet);

		var uuid = parseInt(json.uuid)
			, item_id = parseInt(json.item_id)
			, item_count = parseInt(json.item_count);

		var user = UserMgr.inst.SelectUser(uuid);

		// 이미 있는 ITEM_ID 이면 갯수를 증가 시킨다.
		GTMgr.inst.GetGTInventory().findOrCreate({
			UUID: uuid, ITEM_ID: item_id
		}, {
			UUID: uuid, ITEM_ID: item_id, ITEM_COUNT: item_count
		})
		.success(function (ret_item) {
			// console.log('ret_item -', ret_item);

			// DB insert
			if (ret_item.options.isNewRecord === true) {
				if (typeof user !== 'undefined')
					user.GetInven().UpdateItemInfo(ret_item.dataValues.IUID. ret_item.dataValues.ITEM_ID, ret_item.dataValues.ITEM_COUNT);
			} else {
				// DB update
				ret_item.updateAttributes({
					ITEM_COUNT: item_count
				})
				.success(function (anotherTask) {
					// console.log('anotherTask -', anotherTask);
					// console.log('anotherTask.dataValues -', anotherTask.dataValues);
					if (typeof user !== 'undefined')
						user.GetInven().UpdateItemInfo(anotherTask.dataValues.IUID. anotherTask.dataValues.ITEM_ID, anotherTask.dataValues.ITEM_COUNT);
				})
				.error(function (err) {
					console.log(err);
				});
			}
			
		})
		.error(function (err) {
			console.log(err);
		});
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2015.12.15 Hero summon set GT skill info test
	var SkillInfo = function () {


		var hero_id = 1;
		var promotion_step = 1;

		var base_hero = BaseMgr.inst.GetBaseHero(hero_id);
		var skill_ids = base_hero.GetSkillIDs(promotion_step);
		console.log('skill_ids -', skill_ids);

		for (var cnt_skill in skill_ids) {
			var skill_level = 1;
			console.log('skill_id -', skill_ids[cnt_skill]);
		}
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2015.12.10 javascript time to mysql datetime
	var Stringformat = function () {
		var dt = new Date();
		console.log('dt.toISOString()', dt.toISOString());
		console.log('dt -', moment().format("YYYY-MM-DD HH:mm:ss"));
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2015.11.25 BTMgr BTLoad test
	var BTLoad = function () {
		BtMgr.inst.LoadBTInfo();
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2015.11.24 json parameter check
	var ParameterCheck = function () {
		var json = JSON.parse(json_packet);
		if (json == null) {
			logger.error("json ReqCreateItem : " + json_packet);
			return;
		}

		ReqTemp = function () {
			this.uuid;
			this.hero_id;
			this.item_id;
			this.item_count;
		}

		var temp = new ReqTemp();
		temp.uuid = json.uuid;
		temp.hero_id = json.hero_id;
		temp.item_id = json.item_id;
		temp.item_count = json.item_count;

		var keys = Object.keys(temp);
		var count = 0;

		for (var i in keys) {
			if (temp[keys[i]])
				count ++;
		}

		console.log('ret -', count === keys.length);		
	}

	//--------------------------------------------------------------------------------------------------------------
	// 2015.11.16 Exeption test
	var Exption = function () {
		throw new Error('WOW!');
	}

	//------------------------------------------------------------------------------------------------------------------
	// 2015.10.28 - ItemBaseTalbe.json 읽기
	var eadJsonTest = function() {
		fs.readFile('./TableJson/ItemLevelupTable.json', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			var read_json = JSON.parse(data);
			console.log('obj - %o', read_json.Rows);

			for (var i in read_json.Rows) {
				// console.log('i: %d - ', i, read_json.Rows[i]);
				// SequelizeCreate(read_json.Rows[i]);
			}
		});		
	}

	//------------------------------------------------------------------------------------------------------------------
	var SequelizeCreate = function (row) {
		BtMgr.inst.GetBTItemBase().build({
			  ID: row.ID
			, BUY_COST_TYPE: row.BuyCostType
			, BUY_COST: row.BuyCost
			, SELL_GOLD: row.SellGold
			, STACK_YN: row.StackYN
			, LEVEL_UP_ID: row.LevelupID
			, EVOLUTION_ID: row.EvolutionID
			, ENCHANT_ID: row.EnchantID
			, LEGEND_ITEM_RESOURCE_ID: row.LegendItemResourceID
			, HERO_ID: row.HeroID
			, LEGEND_ITEM_ID: row.LegendItemID
			, EFFECT1_ID: row.Effect1_ID
			, EFFECT2_ID: row.Effect2_ID
			, EFFECT3_ID: row.Effect3_ID
			, EFFECT4_ID: row.Effect4_ID
			, EFFECT5_ID: row.Effect5_ID
		})
		.save()
		.then(function (anotherTask) {
			console.log('anotherTask - ', anotherTask);
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;