/********************************************************************
Title : WeeklyDungeonFinish
Date : 2016.08.09
Update : 2017.04.03
Desc : 요일 던전 종료
writer : dongsu -> jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTUser		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTHero		= require('../../DB/GTLoad/LoadGTHero.js');
var LoadGTBattle	= require('../../DB/GTLoad/LoadGTBattle.js');

var SetGTUser		= require('../../DB/GTSet/SetGTUser.js');
var SetGTHero		= require('../../DB/GTSet/SetGTHero.js');
var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');
var BaseWeeklyDungeon= require('../../Data/Base/BaseWeeklyDungeon.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender= require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

//------------------------------------------------------------------------------------------------------------------
(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SelectDailyContents = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_daily => { resolve(p_ret_daily); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateDailyContents = function(p_t, p_ret_daily) {
		return new Promise(function (resolve, reject) {
			let ret_exec_count = p_ret_daily.dataValues.EXEC_WEEKLY_DUNGEON_PLAY_COUNT + 1;

			// GT_DAILY_CONTENTS update
			p_ret_daily.updateAttributes({
				EXEC_WEEKLY_DUNGEON_PLAY_COUNT : ret_exec_count
			}, { transaction : p_t })
			.then(p_ret_daily_update => { resolve(p_ret_daily_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqWeeklyDungeonFinish = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d recv - ReqWeeklyDungeonFinish -', p_user.uuid, p_recv);
		
		var recv_stage_id = parseInt(p_recv.stage_id);
		var recv_team_id = parseInt(p_recv.team_id);

		// Start sequelize transaction
		var SetTransaction = function(values) {
			return new Promise(function (resolve, reject) {
				let user_data		= values[0];
				// let team_data	= values[1]; team은 사용하지 않는다.
				let daily_data		= values[2];
				let hero_data_list	= values[3];

				var base_stage = BaseWeeklyDungeon.inst.GetBaseWeeklyDungeon(recv_stage_id);
				// console.log('base_stage', base_stage);
				if ( typeof base_stage === 'undefined' ) {
					reject([ PacketRet.inst.retFail(), 'Not Exist WeeklyDungeonStage Info In Base WeeklyDungeon Stage ID', recv_stage_id ]);
				}

				// start transaction
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					// console.log('SetTransaction');

					let t = transaction;
					let reward_item_list = base_stage.GetRewardAllItemList();
					// console.log('reward_item_list', reward_item_list);

					Promise.all([
						SetGTUser.inst.SetBattleReward(user_data, base_stage.need_stamina, base_stage.reward_account_exp, base_stage.reward_gold, t),
						SetGTInventory.inst.SetRewardItemList(p_user.uuid, reward_item_list, t),
						UpdateDailyContents(t, daily_data)
					])
					.then(values => {
						// SetHero()도 Promise.all 에 추가 하고 싶지만 영웅 레벨이 계정 레벨에 영향을 받기 때문에
						// SetUser() 다음에 처리 한다.
						return new Promise(function (resolve, reject) {
							SetGTHero.inst.SetHero(user_data.dataValues.UUID, hero_data_list, user_data.dataValues.USER_LEVEL, base_stage.reward_hero_exp, t)
							.then(ret_hero_data_list => {
								values.push(ret_hero_data_list);

								resolve(values);
							})
							.catch(p_error => { reject(p_error); });
						});
					})
					.then(values => {
						// console.log('values', values);
						console.log('Commit');
						t.commit();

						resolve(values);
					})
					.catch(p_error => {
						console.log('Rollback');
						if (t)
							t.rollback();

						reject(p_error);
					})
				});
			});
		}

		// Promise GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTBattle.inst.SelectTeam(p_user.uuid, recv_team_id),
			SelectDailyContents(p_user.uuid)
		])
		.then(values => {
			return new Promise(function (resolve, reject) {
				let user_data = values[0];
				let team_data = values[1];

				let hero_id_list = [];

				if ( team_data.dataValues.SLOT1 != 0 ) hero_id_list.push(team_data.dataValues.SLOT1);
				if ( team_data.dataValues.SLOT2 != 0 ) hero_id_list.push(team_data.dataValues.SLOT2);
				if ( team_data.dataValues.SLOT3 != 0 ) hero_id_list.push(team_data.dataValues.SLOT3);
				if ( team_data.dataValues.SLOT4 != 0 ) hero_id_list.push(team_data.dataValues.SLOT4);

				LoadGTHero.inst.SelectHeroList(p_user.uuid, hero_id_list)
				.then(p_ret_hero_list => {
					values.push(p_ret_hero_list);
					resolve(values);
				})
				.catch(p_error => reject(p_error));
			});
		})
		.then(values => {
			// console.log('values', values);
			return SetTransaction(values);
		})
		.then(values => {
			console.log('All done SendPacket');

			// Make Packet
			let user_data		= values[0];
			let item_data_list	= values[1];
			let daily_data		= values[2];
			let hero_data_list	= values[3];

			// User - full stamina remain_time
			let ret_remain_time = Timer.inst.GetStaminaFullRemainTime(user_data.dataValues.STAMINA, user_data.dataValues.MAX_STAMINA, user_data.dataValues.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);

			p_ack_packet.result_gold		= user_data.dataValues.GOLD;
			p_ack_packet.result_user_level	= user_data.dataValues.USER_LEVEL;
			p_ack_packet.result_user_exp	= user_data.dataValues.USER_EXP;
			p_ack_packet.account_buff_point = user_data.dataValues.ACCOUNT_BUFF_POINT;

			p_ack_packet.stamina			= user_data.STAMINA;
			p_ack_packet.max_stamina		= user_data.MAX_STAMINA;
			p_ack_packet.stamina_remain_time= ret_remain_time;

			// DailyContents - 참여 횟수
			p_ack_packet.exec_count	= daily_data.dataValues.EXEC_WEEKLY_DUNGEON_PLAY_COUNT;

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

			// Item - 보상
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

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			console.log('Errror Promise.all', p_error);
			if ( Array.isArray(p_error) ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			} else {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;