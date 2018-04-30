/********************************************************************
Title : BattleSweep
Date : 2016.06.09
Update : 2017.04.03
Desc : 배틀 소탕 1번 ~ 10번
writer: jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var BattleMgr	= require('./BattleMgr.js');

var LoadGTUser		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTBattle	= require('../../DB/GTLoad/LoadGTBattle.js');

var SetGTUser		= require('../../DB/GTSet/SetGTUser.js');
var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var BaseChapter 	= require('../../Data/Base/BaseChapter.js');
var BaseStage 	= require('../../Data/Base/BaseStage.js');
var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	UpdateStageAbleCount = function(p_t, p_ret_stage, p_able_count) {
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
	var SetGroupRewardItem = function(p_uuid, p_group_reward_item) {
		return new Promise(function (resolve, reject) {
			return Promise.all(p_group_reward_item.map(group => {
				// start transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					return SetGTInventory.inst.SetRewardItemList(p_uuid, group.item_list, t)
					.then(values => {
						t.commit();
					})
					.catch(p_error => {
						if (t)
							t.rollback();
					});
				});
			}))
			.then(values => { resolve(values); })
			.catch(p_error => { reject(p_error);
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetBattleSweep = function(p_values, p_uuid, p_need_stamina, p_reward_account_exp, p_reward_gold, p_able_count, p_result_reward_list) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_stage = p_values[1];

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				return Promise.all([
					SetGTUser.inst.SetBattleReward(ret_user, p_need_stamina, p_reward_account_exp, p_reward_gold, t),
					UpdateStageAbleCount(t, ret_stage, p_able_count),
					SetGTInventory.inst.SetRewardItemList(p_uuid, p_result_reward_list, t)
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
	var SetResultRewardList = function(p_array, p_item) {
		let find_item = undefined;
		
		for ( let cnt = 0; cnt < p_array.length; ++ cnt ) {
			if ( p_array[cnt].item_id == p_item.item_id ) {
				find_item = p_array[cnt];
				break;
			}
		}

		if ( typeof find_item === 'undefined' ) {
			p_array.push(p_item);
		} else {
			if ( find_item.item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
				p_array.push(p_item);
			} else {
				find_item.item_count = find_item.item_count + p_item.item_count;
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetPacketRewardUI = function(p_reward_ui_packet, p_item) {
		// console.log('p_reward_ui_packet', p_reward_ui_packet);
		let base_item = BaseItemRe.inst.GetItem(p_item.item_id);
		if ( typeof base_item === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_item.item_id ]);

		let reward_item = new PacketCommonData.RewardItem();

		if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
			reward_item.item_id = p_item.item_id;
			reward_item.item_count = 1;

			p_reward_ui_packet.equipment_list.push(reward_item);
		} else {
			reward_item.item_id	= p_item.item_id;
			reward_item.item_count	= p_item.item_count;

			p_reward_ui_packet.item_list.push(reward_item);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetPacketRewardResult = function(p_reward_packet, p_ret_item) {
		// console.log('p_reward_packet', p_reward_packet);
		let base_item = BaseItemRe.inst.GetItem(p_ret_item.dataValues.ITEM_ID);
		if ( typeof base_item === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_ret_item.dataValues.ITEM_ID ]);

		if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
			let equipment			= new PacketCommonData.Equipment();

			equipment.iuid			= p_ret_item.dataValues.IUID;
			equipment.item_id		= p_ret_item.dataValues.ITEM_ID;

			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_1);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_2);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_3);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_4);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_5);
			equipment.sub_option_id_list.push(p_ret_item.dataValues.SUB_OPTION_ID_6);
			
			p_reward_packet.equipment_list.push(equipment);
		} else {
			let item		= new PacketCommonData.Item();
			item.iuid		= p_ret_item.dataValues.IUID;
			item.item_id	= p_ret_item.dataValues.ITEM_ID;
			item.item_count	= p_ret_item.dataValues.ITEM_COUNT;

			p_reward_packet.item_list.push(item);
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

			let ret_able_count = stage_data.ABLE_COUNT;
			if ( chapter_base.chapter_type == DefineValues.inst.ScenarioHard )
				ret_able_count = stage_data.ABLE_COUNT - recv_sweep_count;

			// DB용
			let result_reward_list = new Array();

			// 소탕 전용
			p_ack_packet.sweep_reward_ui = new PacketCommonData.SweepRewardItemUI();

			sweep_reward_item.item_list.map(item => {
				// console.log('sweep_reward item_id : %d, item_count : %d', item.item_id, item.item_count);
				SetPacketRewardUI(p_ack_packet.sweep_reward_ui, item);
				SetResultRewardList(result_reward_list, item);
			});

			// 스테이지
			reward_item_group.map(group => {
				// console.log('Group');
				let sweep_reward_ui = new PacketCommonData.SweepRewardItemUI();
				p_ack_packet.stage_reward_list_ui.push(sweep_reward_ui);

				group.item_list.map(item => {
					// console.log('group_reward item_id : %d, item_count : %d', item.item_id, item.item_count);
					SetPacketRewardUI(sweep_reward_ui, item);
					SetResultRewardList(result_reward_list, item);
				});
			});

			// 보상 아이템 갯수 확인
			// result_reward_list.map(item => {
			// 	console.log('Reward item_id : %d, item_count : %d', item.item_id, item.item_count);
			// });

			return SetBattleSweep(values, p_user.uuid, need_stamina, reward_account_exp, reward_gold, ret_able_count, result_reward_list);
		})
		.then(values => {
			// console.log('values', values);
			let ret_user = values[0];
			let ret_stage = values[1];
			let ret_sweep_reward = values[2];

			p_ack_packet.result_gold		= ret_user.dataValues.GOLD;
			p_ack_packet.result_user_level	= ret_user.dataValues.USER_LEVEL;
			p_ack_packet.result_user_exp	= ret_user.dataValues.USER_EXP;
			p_ack_packet.account_buff_point = ret_user.dataValues.ACCOUNT_BUFF_POINT;

			// User - stamina
			p_ack_packet.stamina			= ret_user.dataValues.STAMINA;
			p_ack_packet.max_stamina		= ret_user.dataValues.MAX_STAMINA;
			p_ack_packet.stamina_remain_time = Timer.inst.GetStaminaFullRemainTime(ret_user.dataValues.STAMINA, ret_user.dataValues.MAX_STAMINA, ret_user.dataValues.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);
			
			// Result Item Packet
			p_ack_packet.sweep_reward = new PacketCommonData.SweepRewardItem();

			ret_sweep_reward.map(row => {
				// console.log('Sweep reward');
				SetPacketRewardResult(p_ack_packet.sweep_reward, row);
			});

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;