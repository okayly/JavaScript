/********************************************************************
Title : DarkDungeonBattleFinish
Date : 2016.12.13
Udpate : 2017.04.03
Desc : 어둠의 던전 - 배틀 종료
	   BattleFinish.js 와 매우 비슷하다.
writer: jongwook
********************************************************************/
var mkDB			= require('../../DB/mkDB.js');
var GTMgr			= require('../../DB/GTMgr.js');
var DarkDungeonMgr	= require('./DarkDungeonMgr.js');

var LoadGTUser		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTHero		= require('../../DB/GTLoad/LoadGTHero.js');
var LoadGTBattle	= require('../../DB/GTLoad/LoadGTBattle.js');
var LoadGTInventory	= require('../../DB/GTLoad/LoadGTInventory.js');

var SetGTUser		= require('../../DB/GTSet/SetGTUser.js');
var SetGTHero		= require('../../DB/GTSet/SetGTHero.js');
var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');
var BaseDarkDungeon	= require('../../Data/Base/BaseDarkDungeon.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SendPacket = function(p_user, p_ack_cmd, p_ack_packet, p_values, p_old_user_level, p_old_hero_map, p_stage_id) {
		// Make Packet
		let dark_dungeon_data	= p_values[0];
		let user_data			= p_values[1];
		let item_data_list		= p_values[2];
		let hero_data_list		= p_values[3];

		// full stamina remain_time
		let ret_remain_time = Timer.inst.GetStaminaFullRemainTime(user_data.dataValues.STAMINA, user_data.dataValues.MAX_STAMINA, user_data.dataValues.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);

		p_ack_packet.chapter_id	= dark_dungeon_data.dataValues.CHAPTER_ID;
		p_ack_packet.stage_id	= dark_dungeon_data.dataValues.CURR_STAGE_ID;

		p_ack_packet.result_gold		= user_data.dataValues.GOLD;
		p_ack_packet.result_user_level	= user_data.dataValues.USER_LEVEL;
		p_ack_packet.result_user_exp	= user_data.dataValues.USER_EXP;
		p_ack_packet.account_buff_point = user_data.dataValues.ACCOUNT_BUFF_POINT;

		p_ack_packet.stamina			= user_data.STAMINA;
		p_ack_packet.max_stamina		= user_data.MAX_STAMINA;
		p_ack_packet.stamina_remain_time= ret_remain_time;

		// 영웅 레벨 업 카운트
		if ( typeof hero_data_list !== 'undefined' ) {
			hero_data_list.map(hero => {
				console.log('after  hero_level : %d, hero_exp : %d', hero.dataValues.HERO_LEVEL, hero.dataValues.EXP);

				let result_hero	= new PacketCommonData.HeroLevelInfo();
				result_hero.hero_id		= hero.dataValues.HERO_ID;
				result_hero.hero_exp	= hero.dataValues.EXP;
				result_hero.hero_level	= hero.dataValues.HERO_LEVEL;

				p_ack_packet.result_hero_list.push(result_hero);
			});
		}
		
		// 보상 아이템
		if ( typeof item_data_list !== 'undefined' ) {
			item_data_list.map(item => {
				let item_id = item.dataValues.ITEM_ID;

				let base_item = BaseItemRe.inst.GetItem(item_id);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_id ]);

				if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
					let equipment			= new PacketCommonData.Equipment();

					equipment.iuid			= item.dataValues.IUID;
					equipment.item_id		= item.dataValues.ITEM_ID;

					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_1);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_2);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_3);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_4);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_5);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_6);

					p_ack_packet.result_equipment_list.push(equipment);
				} else {
					let result_item			= new PacketCommonData.Item();
					result_item.iuid		= item.dataValues.IUID;
					result_item.item_id		= item.dataValues.ITEM_ID;
					result_item.item_count	= item.dataValues.ITEM_COUNT;

					p_ack_packet.result_item_list.push(result_item);
				}
			});
		}

		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetHeroExp = function(p_uuid, p_hero_data_list, p_user_level, p_reward_hero_exp, p_t) {
		return new Promise(function (resolve, reject) {
			SetGTHero.inst.SetHero(p_uuid, p_hero_data_list, p_user_level, p_reward_hero_exp, p_t)
			.then(p_ret_hero_list => { resolve(p_ret_hero_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateDarkDungeonState = function(p_t, p_ret_dark_dunegon, p_state) {
		return new Promise(function (resolve, reject) {
			// GT_DARK_DUNGEON update
			p_ret_dark_dunegon.updateAttributes({
				STATE : p_state,
				UPDATE_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_stage_update => { resolve(p_ret_stage_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransactionBattleSuccess = function(p_values, p_base_stage) {
		let user_data			= p_values[0];
		let hero_data_list		= p_values[1];
		let dark_dungeon_data	= p_values[2];

		let dark_dungeon_state = DefineValues.inst.DarkDungoneBattleSuccess;
		let reward_item_list = DarkDungeonMgr.inst.GetRewardStageSubItemList(p_base_stage.sub_item_drop_group_id);

		if ( dark_dungeon_data == null )
			throw([ PacketRet.inst.retFail(), 'Not Exist GT_DARK_DUNGEON dark_dugeon' ]);
		
		return new Promise(function (resolve, reject) {
			// Start Sequelize Transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// DB update
				Promise.all([
					UpdateDarkDungeonState(t, dark_dungeon_data, dark_dungeon_state),
					SetGTUser.inst.SetBattleReward(user_data, p_base_stage.need_stamina, p_base_stage.reward_account_exp, p_base_stage.reward_gold, t),
					SetGTInventory.inst.SetRewardItemList(user_data.dataValues.UUID, reward_item_list, t)
				])
				.then(values => {
					// SetHero()도 Promise.all 에 추가 하고 싶지만 영웅 레벨이 계정 레벨에 영향을 받기 때문에 SetUser() 다음에 처리 한다.
					SetHeroExp(user_data.dataValues.UUID, hero_data_list, user_data.dataValues.USER_LEVEL, p_base_stage.reward_hero_exp, t)
					.then(ret_hero_list => {
						t.commit();

						values.push(ret_hero_list);
						resolve(values);
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
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
	var ProcessTransactionBattleFailed = function(p_values, p_base_stage) {
		let user_data			= p_values[0];
		let dark_dungeon_data	= p_values[1];

		let dark_dungeon_state = DefineValues.inst.DarkDungoneBattleFailed;

		if ( dark_dungeon_data == null )
			throw ([ PacketRet.inst.retFail(), 'Not Exist GT_DARK_DUNGEON dark_dugeon' ]);
		
		return new Promise(function (resolve, reject) {
			// Start Sequelize Transaction
			return mkDB.inst.GetSequelize().transaction(function (transaction) {
				let reward_exp = 0;
				let reward_gold = 0;
				let t = transaction;

				// DB update
				Promise.all([
					UpdateDarkDungeonState(t, dark_dungeon_data, dark_dungeon_state),
					SetGTUser.inst.SetBattleReward(user_data, p_base_stage.need_stamina, reward_exp, reward_gold, t)
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
	inst.ReqDarkDungeonBattleFinish = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeonBattleFinish', p_recv);

		var recv_stage_id		= parseInt(p_recv.stage_id);
		var recv_clear_grade	= parseInt(p_recv.clear_grade);
		var recv_hero_id_list	= p_recv.hero_id_list;

		// 챕터, 스테이지 확인
		var base_stage = BaseDarkDungeon.inst.GetDarkDungeonStage(recv_stage_id);
		// console.log('base_stage', base_stage);
		if ( typeof base_stage === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Stage in Base DarkDungeon Stage', recv_stage_id);
			return;
		}

		var base_chapter = BaseDarkDungeon.inst.GetDarkDungeonChapter(base_stage.chapter_id);
		if ( typeof base_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter in Base DarkDungeon Chapter', recv_chapter_id);
			return;
		}

		// declare
		let old_user_level;
		let old_hero_map = new HashMap();
		
		if ( recv_clear_grade > 0 ) {
			// Promise.all GO! 배틀 성공
			Promise.all([
				LoadGTUser.inst.SelectUser(p_user.uuid),
				LoadGTHero.inst.SelectHeroList(p_user.uuid, recv_hero_id_list),
				LoadGTBattle.inst.SelectDarkDungeon(p_user.uuid, base_stage.chapter_id, recv_stage_id)
			])
			.then(values => {
				console.log('Load GT values');

				let user_data		= values[0];
				let hero_data_list	= values[1];

				old_user_level = user_data.dataValues.USER_LEVEL;
				for ( let cnt in hero_data_list )
					old_hero_map.set(hero_data_list[cnt].dataValues.HERO_ID, hero_data_list[cnt].dataValues.HERO_LEVEL);

				return ProcessTransactionBattleSuccess(values, base_stage);
			})
			.then(values => {
				SendPacket(p_user, p_ack_cmd, p_ack_packet, values, old_user_level, old_hero_map, recv_stage_id);
			})
			.catch(p_error => {
				console.log('Errror Battle Success Promise.all', p_error);
				if ( Array.isArray(p_error) )
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
				else
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
			});
		} else {
			// Promise.all GO! - 배틀 실패
			Promise.all([
				LoadGTUser.inst.SelectUser(p_user.uuid),
				LoadGTBattle.inst.SelectDarkDungeon(p_user.uuid, base_chapter.chapter_id, recv_stage_id)
			])
			.then(values => {
				return ProcessTransactionBattleFailed(values, base_stage);
			})
			.then(values => {
				console.log('All done Battle Failed SendPacket');
				SendPacket(p_user, p_ack_cmd, p_ack_packet, values);
			})
			.catch(p_error => {
				console.log('Errror Battle Failed Promise.all', p_error);
				if ( Array.isArray(p_error) )
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
				else
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
			});
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;