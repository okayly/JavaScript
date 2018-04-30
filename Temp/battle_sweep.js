/********************************************************************
Title : BattleSweep
Date : 2016.06.09
Update : 2017.04.03
Desc : 배틀 소탕 1번, 10번
writer: jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var MissionMgr	= require('../Mission/MissionMgr.js');
var BattleMgr	= require('./BattleMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseChapter 	= require('../../Data/Base/BaseChapter.js');
var BaseStage 	= require('../../Data/Base/BaseStage.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var GerStaminaFullRemainTime = function(p_stamina, p_max_stamina, p_last_stamina_change_date) {
		var now_date = moment();
		var diff_sec = ( p_last_stamina_change_date != null ) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, p_last_stamina_change_date) : 0;
		return Timer.inst.CalcRemainTime(DefineValues.inst.StaminaRecoverTime, p_stamina, p_max_stamina, diff_sec);
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBattleSweep = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {		
		logger.debug('UUID : %d recv - ReqBattleSweep', p_user.uuid, p_recv);

		var recv_chapter_id		= parseInt(p_recv.chapter_id);
		var recv_stage_id		= parseInt(p_recv.stage_id);
		var recv_sweep_count	= parseInt(p_recv.sweep_count);

		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;
			console.log('user_data', user_data);

			// GT_STAGE select - 스테이지 설정
			GTMgr.inst.GetGTStage().find({
				where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id, STAGE_ID : recv_stage_id, EXIST_YN : true }
			})
			.then(function (p_ret_stage) {
				if ( p_ret_stage == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistStageInUser(), 'Not Find Stage in GT_STAGE');
					return;
				}
				var stage_data = p_ret_stage.dataValues;

				// 3성으로 클리어 확인
				if( stage_data.CLEAR_GRADE < DefineValues.inst.MaxStageClearGrade ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughClearGrade(), 'Need Grade', DefineValues.inst.MaxStageClearGrade, 'Current Grade', stage_data.CLEAR_GRADE);
					return;
				}

				var chapter_base = BaseChapter.inst.GetBaseChapter(recv_chapter_id);
				if ( chapter_base == undefined ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter Info In Base');
					return;
				}

				// todo : 상수는 외부로 빠져야 한다. dongsu
				if ( chapter_base.chapter_type == 6 ) {
					if ( stage_data.ABLE_COUNT <= 0 ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughExecCount());
						return;
					}
				}

				var stage_base = BaseStage.inst.GetBaseStage(recv_stage_id);
				if ( typeof stage_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Stage in Base');					
					return;
				}

				if ( recv_sweep_count <= 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount(), 'Sweep Count', recv_sweep_count);
					return;
				}

				// 필요 스태미너
				var need_stamina = stage_base.need_stamina * recv_sweep_count;
				if ( need_stamina > user_data.STAMINA ) {			
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughStamina(), 'Need Stamina', need_stamina, 'Current Stamina', user_data.STAMINA);
					return;
				}

				var sweep_reward_info = BattleMgr.inst.SweepReward(recv_chapter_id, recv_stage_id, recv_sweep_count);
				if ( typeof sweep_reward_info === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Sweep Reward Info in BattleMgr');
					return;
				}

				// DB 저장용 리스트와 소탕 보상 아이템 그룹 패킷 만들기
				var temp_list = new HashMap();	// key : item_id, value : item_count;
				// 보상 아이템 그룹
				sweep_reward_info.GetAllRewardGroup().forEach(function (value, key) {
					var temp_reward_list = [];

					// 아이템 목록
					value.GetAllItem().forEach(function (e_value, e_key) {
						if ( temp_list.has(e_value.item_id) == true ) {
							var current_count	= temp_list.get(e_value.item_id);
							var temp_count		= current_count + e_value.item_count;
							temp_list.set(e_value.item_id, temp_count);
						} else {
							temp_list.set(e_value.item_id, e_value.item_count);
						}

						var sweep_item				= new PacketCommonData.SweepRewardItem();
						sweep_item.item_id			= e_value.item_id;
						sweep_item.item_count		= e_value.item_count;
						sweep_item.sweep_exclusive	= e_value.sweep_exclusive;

						temp_reward_list.push(sweep_item);
					});

					var temp_info						= new PacketCommonData.SweepRewardInfo();
					temp_info.reward_item_list			= temp_reward_list;
					p_ack_packet.sweep_reward_list[key]	= temp_info;
				});

				// temp_list.forEach(function(value, key) {
				// 	console.log('DB용 확인  - value ' + value + ' Key ' + key);
				// });

				var ret_stamina = user_data.STAMINA - need_stamina;
				var str_query = 'call sp_sweep_reward (' + p_user.uuid + ',' + 
										ret_stamina + ',' + 
										sweep_reward_info.reward_account_exp + ',' + 
										sweep_reward_info.reward_gold;
				var check_count = 0;
				if ( temp_list.count() > 0 ) {
					temp_list.forEach(function (value, key) {
						str_query = str_query + ',' + key + ',' + value;
						check_count++;
					});

					for( var temp_count = check_count; temp_count < 15; temp_count++ ) {
						str_query = str_query + ',' + 0 + ',' + 0;
					}

					str_query = str_query + ');';
				}
				
				console.log('sp query is - ' + str_query);

				// call sp
				mkDB.inst.GetSequelize().query(str_query,
					null,
					{ raw: true, type: 'SELECT' }
				)
				.then(function (ret_reward) {
				 	// console.log('ret_reward', ret_reward);
					// User reward
					if (Object.keys(ret_reward[0]).length > 0) {
						var ret_user_level	= ret_reward[0][0].USER_LEVEL;
						var ret_user_exp	= ret_reward[0][0].USER_EXP;
						var ret_gold		= ret_reward[0][0].GOLD;

						p_ack_packet.result_gold		= ret_gold;
						p_ack_packet.result_user_level	= ret_user_level;
						p_ack_packet.result_user_exp	= ret_user_exp;

						// for mission
						if ( user_data.USER_LEVEL != ret_user_level ) {
							// Account Buff Point - 계정 레벨 24 부터 3포인트 씩 받는다.
							if ( ret_user_level >= DefineValues.inst.NeedAccountBuffLevel() ) {
								// console.log('user_data.ACCOUNT_BUFF_POINT', user_data.ACCOUNT_BUFF_POINT, 'ret_user_level', ret_user_level, 'user_data.USER_LEVEL', user_data.USER_LEVEL, 'DefineValues.inst.AccountBuffPoint', DefineValues.inst.AccountBuffPoint);
								var ret_account_buff_point = user_data.ACCOUNT_BUFF_POINT + ( ret_user_level - user_data.USER_LEVEL ) * DefineValues.inst.AccountBuffPoint;

								p_ack_packet.account_buff_point	= ret_account_buff_point;
								
								// GT_USER update - 계정 포인트
								p_ret_user.updateAttributes({
									ACCOUNT_BUFF_POINT : ret_account_buff_point
								})
								.then(function (p_ret_user_update) {
									console.log('ACCOUNT_BUFF_POINT', p_ret_user_update.dataValues.ACCOUNT_BUFF_POINT);
								})
								.catch(function (p_error) {
									Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleFinish - 5');
								});
							}

							// Mission - User levelup	
		  					MissionMgr.inst.MissionAchieveUserLV(p_user, ret_user_level, true);
		  				}
					}
					
					// item reward
					if (Object.keys(ret_reward[1]).length > 0) {
						for ( var item_cnt in ret_reward[1] ) {
							var result_item		= new PacketCommonData.Item();
							result_item.iuid		= ret_reward[1][item_cnt].iuid;
							result_item.item_id		= ret_reward[1][item_cnt].item_id;
							result_item.item_count	= ret_reward[1][item_cnt].item_count;

							p_ack_packet.sweep_result_item_list.push(result_item);							
						}
					}
					
					p_ack_packet.stamina		= ret_reward[0][0].STAMINA;
					p_ack_packet.max_stamina		= ret_reward[0][0].MAX_STAMINA;
					p_ack_packet.stamina_remain_time= GerStaminaFullRemainTime(ret_reward[0][0].STAMINA, ret_reward[0][0].MAX_STAMINA, ret_reward[0][0].LAST_STAMINA_CHANGE_DATE);
					p_ack_packet.account_buff_point	= ret_reward[0][0].ACCOUNT_BUFF_POINT;

					// TODO : 프로미스를 사용하여 추후 모든 콜백이 완료 된 상태에서 결과를 전송 하도록 수정한다.
					// for 예언의 샘. 
					var ret_able_count = stage_data.ABLE_COUNT - recv_sweep_count;
					p_ret_stage.updateAttributes({
						ABLE_COUNT : ret_able_count
					})
					.then(function (p_ret_stage_update) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

						// Mission - DungeonClearNormal
						MissionMgr.inst.MissionDungeonClearNormal(p_user, recv_stage_id, recv_sweep_count);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleSweep - 4');
					})
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleSweep - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleSweep - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleSweep - 1');
		});
	};	

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;










/********************************************************************
Title : BattleSweep
Date : 2016.06.09
Update : 2017.03.13
Desc : 배틀 소탕 1번 ~ 10번
writer: jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var MissionMgr	= require('../Mission/MissionMgr.js');
var BattleMgr	= require('./BattleMgr.js');

var LoadGTUser		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTBattle	= require('../../DB/GTLoad/LoadGTBattle.js');

var SetGTUser		= require('../../DB/GTSet/SetGTUser.js');
var SetGTBattle		= require('../../DB/GTSet/SetGTBattle.js');
var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var BaseChapter 	= require('../../Data/Base/BaseChapter.js');
var BaseStage 	= require('../../Data/Base/BaseStage.js');
var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var GerStaminaFullRemainTime = function(p_stamina, p_max_stamina, p_last_stamina_change_date) {
		let now_date = moment();
		let diff_sec = ( p_last_stamina_change_date != null ) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, p_last_stamina_change_date) : 0;
		return Timer.inst.CalcRemainTime(DefineValues.inst.StaminaRecoverTime, p_stamina, p_max_stamina, diff_sec);
	}

	//------------------------------------------------------------------------------------------------------------------
	var findItem = function(p_item_id, p_array) {
		if ( Array.isArray(p_array) == false || p_array.length == 0 )
			return undefined;

		for ( let cnt = 0; cnt < p_array.length; ++ cnt ) {
			if ( p_array[cnt].item_id == p_item_id )
				return p_array[cnt];
		}
		return undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetStageAbleCount = function(p_ret_stage, p_able_count, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_stage.dataValues.ABLE_COUNT == p_able_count ) {
				resolve(p_ret_stage);
			} else {
				// GT_STAGE update
				p_ret_stage.updateAttributes({
					ABLE_COUNT : p_able_count
				}, { transaction : p_t })
				.then(p_ret_stage_update => { resolve(p_ret_stage_update); })
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetGroupRewardItem = function(p_uuid, p_group_reward_item, p_t) {
		return new Promise(function (resolve, reject) {
			return Promise.all(p_group_reward_item.map(group => {
				return SetGTInventory.inst.SetRewardItemList(p_uuid, group.reward_item.item_list, p_t);
			}))
			.then(values => { resolve(values); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetBattleSweep = function(p_values, p_uuid, p_need_stamina, p_reward_account_exp, p_reward_gold, p_able_count, p_sweep_reward_item, p_group_reward_item) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_stage = p_values[1];

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTUser.inst.SetBattleReward(ret_user, p_need_stamina, p_reward_account_exp, p_reward_gold, t),
					SetStageAbleCount(ret_stage, p_able_count),
					SetGTInventory.inst.SetRewardItemList(p_uuid, p_sweep_reward_item.item_list, t),
					SetGroupRewardItem(p_uuid, p_group_reward_item, t)
				])
				.then(values => {
					t.commit();

					resolve(values);
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
	var SetPacketUIReward = function(p_packet_ui_reward, p_item) {
		// console.log('p_packet_ui_reward', p_packet_ui_reward);
		let base_item = BaseItemRe.inst.GetItem(p_item.item_id);
		if ( typeof base_item === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_item.item_id ]);

		if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
			let equipment = new PacketCommonData.RewardItem();
			equipment.item_id = p_item.item_id;
			equipment.item_count = p_item.item_count;
			
			p_packet_ui_reward.equipment_list.push(equipment);
		} else {
			let item		= new PacketCommonData.RewardItem();
			item.item_id	= p_item.item_id;
			item.item_count	= p_item.item_count;

			p_packet_ui_reward.item_list.push(item);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetPacketResultReward = function(p_packet_result_reward, p_ret_item) {
		// console.log('p_packet_result_reward', p_packet_result_reward);
		let base_item = BaseItemRe.inst.GetItem(p_ret_item.dataValues.ITEM_ID);
		if ( typeof base_item === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_ret_item.dataValues.ITEM_ID ]);

		if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
			let equipment			= new PacketCommonData.Equipment();

			equipment.iuid			= p_ret_item.dataValues.IUID;
			equipment.item_id		= p_ret_item.dataValues.ITEM_ID;
			equipment.bind_hero_id	= p_ret_item.dataValues.BIND_HERO_ID;
			equipment.item_level	= p_ret_item.dataValues.ITEM_LEVEL;
			equipment.enchant_step	= p_ret_item.dataValues.REINFORCE_STEP;
			equipment.is_lock		= p_ret_item.dataValues.IS_LOCK;

			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_1);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_2);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_3);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_4);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_5);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_6);
			
			p_packet_result_reward.equipment_list.push(equipment);
		} else {
			let item		= new PacketCommonData.Item();
			item.iuid		= p_ret_item.dataValues.IUID;
			item.item_id	= p_ret_item.dataValues.ITEM_ID;
			item.item_count	= p_ret_item.dataValues.ITEM_COUNT;

			p_packet_result_reward.item_list.push(item);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBattleSweep = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBattleSweep', p_user.uuid, p_recv);

		var recv_chapter_id		= parseInt(p_recv.chapter_id);
		var recv_stage_id		= parseInt(p_recv.stage_id);
		var recv_sweep_count	= parseInt(p_recv.sweep_count);

		if ( recv_sweep_count <= 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount(), 'Sweep Count', recv_sweep_count);
			return;
		}

		let old_user_level = 0;

		// Promise GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTBattle.inst.SelectStage(p_user.uuid, recv_chapter_id, recv_stage_id)
		])
		.then(values => {
			let ret_user = values[0];
			let ret_stage = values[1];

			if ( ret_user == null || ret_stage == null )
				throw ([ PacketRet.inst.retFail(), 'User or Stage is null' ]);

			let user_data = ret_user.dataValues;
			let stage_data = ret_stage.dataValues;

			// 3성으로 클리어 확인
			if( stage_data.CLEAR_GRADE < DefineValues.inst.MaxStageClearGrade )
				throw ([ PacketRet.inst.retNotEnoughClearGrade(), 'Need Grade', DefineValues.inst.MaxStageClearGrade, 'Current Grade', stage_data.CLEAR_GRADE ]);

			let chapter_base = BaseChapter.inst.GetBaseChapter(recv_chapter_id);
			if ( chapter_base == undefined )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Chapter Info In Base' ]);

			// 예언의 샘 하루 플레이 가능 횟수
			if ( chapter_base.chapter_type == DefineValues.inst.ScenarioHard && stage_data.ABLE_COUNT <= 0 )
				throw ([ PacketRet.inst.retNotEnoughExecCount(), 'Not enough ableCount' ]);

			let stage_base = BaseStage.inst.GetBaseStage(recv_stage_id);
			if ( typeof stage_base === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Find Stage in Base' ]);

			// 필요 스태미너
			let need_stamina = stage_base.need_stamina * recv_sweep_count;
			if ( need_stamina > user_data.STAMINA )
				throw ([ PacketRet.inst.retNotEnoughStamina(), 'Need Stamina', need_stamina, 'Current Stamina', user_data.STAMINA ]);

			let sweep_info = BattleMgr.inst.SweepReward(recv_chapter_id, recv_stage_id, recv_sweep_count);
			if ( typeof sweep_info === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Find Sweep Reward Info in BattleMgr' ]);

			let reward_account_exp	= stage_base.reward_account_exp * recv_sweep_count;
			let reward_gold			= stage_base.reward_gold * recv_sweep_count;

			let sweep_reward_item = sweep_info.GetSweepRewardItem();
			let reward_item_group = sweep_info.GetRewardItemGroup();

			// console.log('ret_item_list', ret_item_list);

			// UI Packet
			p_ack_packet.sweep_reward_item_ui = new PacketCommonData.SweepRewardItemUI();

			// 1. 소탕 전용 보상
			p_ack_packet.sweep_reward_item_ui.sweep_reward = new PacketCommonData.SweepReward();

			sweep_reward_item.item_list.map(item => {
				SetPacketUIReward(p_ack_packet.sweep_reward_item_ui.sweep_reward, item);
			});

			// 2. 그룹 보상
			reward_item_group.map(group => {
				let sweep_reward = new PacketCommonData.SweepReward();
				p_ack_packet.sweep_reward_item_ui.group_sweep_reward_list.push(sweep_reward);

				group.reward_item.item_list.map(item => {
					SetPacketUIReward(sweep_reward, item);
				});
			});

			let ret_able_count = stage_data.ABLE_COUNT - 1;

			return SetBattleSweep(values, p_user.uuid, need_stamina, reward_account_exp, reward_gold, ret_able_count, sweep_reward_item, reward_item_group);
		})
		.then(values => {
			// console.log('values', values);
			let ret_user = values[0];
			let ret_stage = values[1];
			let ret_sweep_reward = values[2];
			let ret_group_reward = values[3];

			p_ack_packet.result_gold		= ret_user.dataValues.GOLD;
			p_ack_packet.result_user_level	= ret_user.dataValues.USER_LEVEL;
			p_ack_packet.result_user_exp	= ret_user.dataValues.USER_EXP;
			p_ack_packet.account_buff_point = ret_user.dataValues.ACCOUNT_BUFF_POINT;

			// User - full stamina remain_time
			p_ack_packet.stamina_remain_time = GerStaminaFullRemainTime(ret_user.dataValues.STAMINA, ret_user.dataValues.MAX_STAMINA, ret_user.dataValues.LAST_STAMINA_CHANGE_DATE);

			if ( ret_user.dataValues.USER_LEVEL != old_user_level ) {
				// Mission - User levelup
				MissionMgr.inst.MissionAchieveUserLV(p_user, ret_user.dataValues.USER_LEVEL, true);
			}

			// Result Item Packet
			p_ack_packet.sweep_reward_item_result = new PacketCommonData.SweepRewardItemResult();

			// 1. 소탕 전용 보상 결과
			p_ack_packet.sweep_reward_item_result.sweep_reward = new PacketCommonData.SweepRewardResult();

			ret_sweep_reward.map(row => {
				SetPacketResultReward(p_ack_packet.sweep_reward_item_result.sweep_reward, row);
			});

			// 2. 그룹 보상 결과
			// console.log('ret_group_reward', ret_group_reward);
			ret_group_reward.map(group => {
				// console.log('group', group);
				let sweep_reward_result = new PacketCommonData.SweepRewardResult();
				p_ack_packet.sweep_reward_item_result.group_sweep_reward_list.push(sweep_reward_result);

				group.map(item => {
					SetPacketResultReward(sweep_reward_result, item);
				});
			});

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;




/********************************************************************
Title : BattleSweep
Date : 2016.06.09
Update : 2017.03.13
Desc : 배틀 소탕 1번 ~ 10번
writer: jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var MissionMgr	= require('../Mission/MissionMgr.js');
var BattleMgr	= require('./BattleMgr.js');

var LoadGTUser		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTBattle	= require('../../DB/GTLoad/LoadGTBattle.js');

var SetGTUser		= require('../../DB/GTSet/SetGTUser.js');
var SetGTBattle		= require('../../DB/GTSet/SetGTBattle.js');
var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var BaseChapter 	= require('../../Data/Base/BaseChapter.js');
var BaseStage 	= require('../../Data/Base/BaseStage.js');
var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var GerStaminaFullRemainTime = function(p_stamina, p_max_stamina, p_last_stamina_change_date) {
		let now_date = moment();
		let diff_sec = ( p_last_stamina_change_date != null ) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, p_last_stamina_change_date) : 0;
		return Timer.inst.CalcRemainTime(DefineValues.inst.StaminaRecoverTime, p_stamina, p_max_stamina, diff_sec);
	}

	//------------------------------------------------------------------------------------------------------------------
	var findItem = function(p_item_id, p_array) {
		if ( Array.isArray(p_array) == false || p_array.length == 0 )
			return undefined;

		for ( let cnt = 0; cnt < p_array.length; ++ cnt ) {
			if ( p_array[cnt].item_id == p_item_id )
				return p_array[cnt];
		}
		return undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetStageAbleCount = function(p_ret_stage, p_able_count, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_stage.dataValues.ABLE_COUNT == p_able_count ) {
				resolve(p_ret_stage);
			} else {
				// GT_STAGE update
				p_ret_stage.updateAttributes({
					ABLE_COUNT : p_able_count
				}, { transaction : p_t })
				.then(p_ret_stage_update => { resolve(p_ret_stage_update); })
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetGroupRewardItem = function(p_uuid, p_group_reward_item, p_t) {
		return new Promise(function (resolve, reject) {
			return Promise.all(p_group_reward_item.map(group => {
				return SetGTInventory.inst.SetRewardItemList(p_uuid, group.reward_item.item_list, p_t);
			}))
			.then(values => { resolve(values); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetBattleSweep = function(p_values, p_uuid, p_need_stamina, p_reward_account_exp, p_reward_gold, p_able_count, p_sweep_reward_item, p_group_reward_item) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_stage = p_values[1];

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTUser.inst.SetBattleReward(ret_user, p_need_stamina, p_reward_account_exp, p_reward_gold, t),
					SetStageAbleCount(ret_stage, p_able_count),
					SetGTInventory.inst.SetRewardItemList(p_uuid, p_sweep_reward_item.item_list, t),
					SetGTInventory.inst.SetRewardItemList(p_uuid, p_group_reward_item, t)
					// SetGroupRewardItem(p_uuid, p_group_reward_item, t)
				])
				.then(values => {
					t.commit();

					resolve(values);
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
	var SetPacketUIReward = function(p_packet_ui_reward, p_item) {
		// console.log('p_packet_ui_reward', p_packet_ui_reward);
		let base_item = BaseItemRe.inst.GetItem(p_item.item_id);
		if ( typeof base_item === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_item.item_id ]);

		if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
			let equipment = new PacketCommonData.RewardItem();
			equipment.item_id = p_item.item_id;
			equipment.item_count = p_item.item_count;
			
			p_packet_ui_reward.equipment_list.push(equipment);
		} else {
			let item		= new PacketCommonData.RewardItem();
			item.item_id	= p_item.item_id;
			item.item_count	= p_item.item_count;

			p_packet_ui_reward.item_list.push(item);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetPacketResultReward = function(p_packet_result_reward, p_ret_item) {
		// console.log('p_packet_result_reward', p_packet_result_reward);
		let base_item = BaseItemRe.inst.GetItem(p_ret_item.dataValues.ITEM_ID);
		if ( typeof base_item === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_ret_item.dataValues.ITEM_ID ]);

		if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
			let equipment			= new PacketCommonData.Equipment();

			equipment.iuid			= p_ret_item.dataValues.IUID;
			equipment.item_id		= p_ret_item.dataValues.ITEM_ID;
			equipment.bind_hero_id	= p_ret_item.dataValues.BIND_HERO_ID;
			equipment.item_level	= p_ret_item.dataValues.ITEM_LEVEL;
			equipment.enchant_step	= p_ret_item.dataValues.REINFORCE_STEP;
			equipment.is_lock		= p_ret_item.dataValues.IS_LOCK;

			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_1);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_2);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_3);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_4);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_5);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_6);
			
			p_packet_result_reward.equipment_list.push(equipment);
		} else {
			let item		= new PacketCommonData.Item();
			item.iuid		= p_ret_item.dataValues.IUID;
			item.item_id	= p_ret_item.dataValues.ITEM_ID;
			item.item_count	= p_ret_item.dataValues.ITEM_COUNT;

			p_packet_result_reward.item_list.push(item);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBattleSweep = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBattleSweep', p_user.uuid, p_recv);

		var recv_chapter_id		= parseInt(p_recv.chapter_id);
		var recv_stage_id		= parseInt(p_recv.stage_id);
		var recv_sweep_count	= parseInt(p_recv.sweep_count);

		if ( recv_sweep_count <= 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount(), 'Sweep Count', recv_sweep_count);
			return;
		}

		let old_user_level = 0;

		// Promise GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTBattle.inst.SelectStage(p_user.uuid, recv_chapter_id, recv_stage_id)
		])
		.then(values => {
			let ret_user = values[0];
			let ret_stage = values[1];

			if ( ret_user == null || ret_stage == null )
				throw ([ PacketRet.inst.retFail(), 'User or Stage is null' ]);

			let user_data = ret_user.dataValues;
			let stage_data = ret_stage.dataValues;

			// 3성으로 클리어 확인
			if( stage_data.CLEAR_GRADE < DefineValues.inst.MaxStageClearGrade )
				throw ([ PacketRet.inst.retNotEnoughClearGrade(), 'Need Grade', DefineValues.inst.MaxStageClearGrade, 'Current Grade', stage_data.CLEAR_GRADE ]);

			let chapter_base = BaseChapter.inst.GetBaseChapter(recv_chapter_id);
			if ( chapter_base == undefined )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Chapter Info In Base' ]);

			// 예언의 샘 하루 플레이 가능 횟수
			if ( chapter_base.chapter_type == DefineValues.inst.ScenarioHard && stage_data.ABLE_COUNT <= 0 )
				throw ([ PacketRet.inst.retNotEnoughExecCount(), 'Not enough ableCount' ]);

			let stage_base = BaseStage.inst.GetBaseStage(recv_stage_id);
			if ( typeof stage_base === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Find Stage in Base' ]);

			// 필요 스태미너
			let need_stamina = stage_base.need_stamina * recv_sweep_count;
			if ( need_stamina > user_data.STAMINA )
				throw ([ PacketRet.inst.retNotEnoughStamina(), 'Need Stamina', need_stamina, 'Current Stamina', user_data.STAMINA ]);

			let sweep_info = BattleMgr.inst.SweepReward(recv_chapter_id, recv_stage_id, recv_sweep_count);
			if ( typeof sweep_info === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Find Sweep Reward Info in BattleMgr' ]);

			let reward_account_exp	= stage_base.reward_account_exp * recv_sweep_count;
			let reward_gold			= stage_base.reward_gold * recv_sweep_count;
			
			let sweep_reward_item = sweep_info.GetSweepRewardItem();
			let reward_item_group = sweep_info.GetRewardItemGroup();

			// console.log('ret_item_list', ret_item_list);

			// UI Packet
			p_ack_packet.sweep_reward_item_ui = new PacketCommonData.SweepRewardItemUI();

			// 1. 소탕 전용 보상
			p_ack_packet.sweep_reward_item_ui.sweep_reward = new PacketCommonData.SweepReward();

			sweep_reward_item.item_list.map(item => {
				SetPacketUIReward(p_ack_packet.sweep_reward_item_ui.sweep_reward, item);
			});

			// 2. 그룹 보상
			let ret_group_item_list = new Array();

			reward_item_group.map(group => {
				let sweep_reward = new PacketCommonData.SweepReward();
				p_ack_packet.sweep_reward_item_ui.group_sweep_reward_list.push(sweep_reward);

				// console.log('group.reward_item.item_list', group.reward_item.item_list);
				group.reward_item.item_list.map(item => {
					SetPacketUIReward(sweep_reward, item);

					let find_item = findItem(item.item_id, ret_group_item_list);
					if ( typeof find_item === 'undefined' ) {
						ret_group_item_list.push(item);
					} else {
						if ( find_item.item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
							ret_group_item_list.push(find_item);
						} else {
							find_item.item_count = find_item.item_count + item.item_count;
						}
					}
				});
			});

			let ret_able_count = stage_data.ABLE_COUNT - 1;

			return SetBattleSweep(values, p_user.uuid, need_stamina, reward_account_exp, reward_gold, ret_able_count, sweep_reward_item, ret_group_item_list);
		})
		.then(values => {
			// console.log('values', values);
			let ret_user = values[0];
			let ret_stage = values[1];
			let ret_sweep_reward = values[2];
			let ret_group_reward = values[3];

			p_ack_packet.result_gold		= ret_user.dataValues.GOLD;
			p_ack_packet.result_user_level	= ret_user.dataValues.USER_LEVEL;
			p_ack_packet.result_user_exp	= ret_user.dataValues.USER_EXP;
			p_ack_packet.account_buff_point = ret_user.dataValues.ACCOUNT_BUFF_POINT;

			// User - full stamina remain_time
			p_ack_packet.stamina_remain_time = GerStaminaFullRemainTime(ret_user.dataValues.STAMINA, ret_user.dataValues.MAX_STAMINA, ret_user.dataValues.LAST_STAMINA_CHANGE_DATE);

			if ( ret_user.dataValues.USER_LEVEL != old_user_level ) {
				// Mission - User levelup
				MissionMgr.inst.MissionAchieveUserLV(p_user, ret_user.dataValues.USER_LEVEL, true);
			}

			// Result Item Packet
			p_ack_packet.sweep_reward_item_result = new PacketCommonData.SweepRewardItemResult();

			// 1. 소탕 전용 보상 결과
			p_ack_packet.sweep_reward_item_result.sweep_reward = new PacketCommonData.SweepRewardResult();
			ret_sweep_reward.map(row => {
				SetPacketResultReward(p_ack_packet.sweep_reward_item_result.sweep_reward, row);
			});

			// 2. 그룹 보상 결과
			p_ack_packet.sweep_reward_item_result.group_reward = new PacketCommonData.SweepRewardResult();
			ret_group_reward.map(row => {			
				SetPacketResultReward(p_ack_packet.sweep_reward_item_result.group_reward, row);
			});

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;