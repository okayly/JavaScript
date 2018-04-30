/********************************************************************
Title : BattleFinish
Date : 2015.09.24
Update : 2017.04.03
Desc : 배틀 종료
writer: jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var BattleMgr	= require('./BattleMgr.js');

var LoadGTUser		= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTHero		= require('../../DB/GTLoad/LoadGTHero.js');
var LoadGTBattle	= require('../../DB/GTLoad/LoadGTBattle.js');

var SetGTUser		= require('../../DB/GTSet/SetGTUser.js');
var SetGTHero		= require('../../DB/GTSet/SetGTHero.js');
var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');

var DefineValues= require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var InsertChapter = function(p_t, p_uuid, p_ret_chapter, p_chapter_id) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_chapter == null ) {
				// GT_CHAPTER insert
				return GTMgr.inst.GetGTChapter().create({
					UUID		: p_uuid,
					CHAPTER_ID	: p_chapter_id,
					REG_DATE	: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_chapter_create => { resolve(p_ret_chapter_create); })
				.catch(p_error => { reject(p_error); });
			} else {
				resolve(p_ret_chapter);
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetStage = function(p_t, p_uuid, p_ret_stage, p_chapter_id, p_stage_id, p_clear_grade, p_chapter_type) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_stage == null ) {
				let able_count = ( p_chapter_type == 6 ) ? 2 : 0;

				// GT_STAGE insert
				return GTMgr.inst.GetGTStage().create({
					UUID		: p_uuid,
					CHAPTER_ID	: p_chapter_id,
					STAGE_ID	: p_stage_id,
					CHAPTER_TYPE: p_chapter_type,
					CLEAR_GRADE	: p_clear_grade,
					ABLE_COUNT	: able_count,
					REG_DATE	: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_stage_create => { resolve(p_ret_stage_create); })
				.catch(p_error => { reject(p_error); });
			} else {
				// 예언의 샘이면 참여 횟수 감소
				if ( p_chapter_type == 6 )
					p_ret_stage['ABLE_COUNT'] = p_ret_stage.dataValues.ABLE_COUNT - 1;

				if ( p_ret_stage.dataValues.CLEAR_GRADE < p_clear_grade || p_chapter_type == 6 ) {
					// 클리어 별 갯수 설정
					p_ret_stage['CLEAR_GRADE'] = p_clear_grade;

					// GT_STAGE update
					return p_ret_stage.save({ transaction : p_t })
					.then( p_ret_stage_update => { resolve(p_ret_stage_update); })
					.catch(p_error => { reject(p_error); });
				} else {
					resolve(p_ret_stage);
				}
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_uuid, p_clear_grade, p_battle_info) {
		return new Promise(function (resolve, reject) {
			let ret_user		= p_values[0];
			// let team_data	= p_values[1]; team은 사용하지 않는다.
			let ret_chapter		= p_values[2];
			let ret_stage		= p_values[3];
			let ret_hero_list	= p_values[4];

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				// console.log('ProcessTransaction');
				let t = transaction;
				let reward_item_list = p_battle_info.reward_item.GetItemList();

				// Promise.all GO!
				Promise.all([
					InsertChapter(t, p_uuid, ret_chapter, p_battle_info.chapter_id),
					SetStage(t, p_uuid, ret_stage, p_battle_info.chapter_id, p_battle_info.stage_id, p_clear_grade, p_battle_info.chapter_type),
					SetGTUser.inst.SetBattleReward(ret_user, p_battle_info.need_stamina, p_battle_info.reward_account_exp, p_battle_info.reward_gold, t),
					SetGTInventory.inst.SetRewardItemList(p_uuid, reward_item_list, t)
				])
				.then(values => {
					// SetHero()도 Promise.all 에 추가 하고 싶지만 영웅 레벨이 계정 레벨에 영향을 받기 때문에
					// SetUser() 다음에 처리 한다.
					return new Promise(function (resolve, reject) {
						SetGTHero.inst.SetHero(ret_user.dataValues.UUID, ret_hero_list, ret_user.dataValues.USER_LEVEL, p_battle_info.reward_hero_exp, t)
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

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBattleFinish = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqBattleFinish -', p_user.uuid, p_recv);

		let recv_clear_grade = parseInt(p_recv.clear_grade);

		let battle_info = BattleMgr.inst.GetBattle(p_user.uuid);
		// console.log('battle_info', battle_info);
		if ( battle_info == undefined ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Get User Battle Info');
			return;
		}

		// 배틀 실패 - 배틀 정보 삭제
		if ( recv_clear_grade == 0 ) {
			BattleMgr.inst.DelBattle(p_user.uuid);
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTBattle.inst.SelectTeam(p_user.uuid, DefineValues.inst.GameModeNormal),
			LoadGTBattle.inst.SelectChapter(p_user.uuid, battle_info.chapter_id),
			LoadGTBattle.inst.SelectStage(p_user.uuid, battle_info.chapter_id, battle_info.stage_id)
		])
		.then(values => {
			return new Promise(function (resolve, reject) {
				let ret_user = values[0];
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
			return ProcessTransaction(values, p_user.uuid, recv_clear_grade, battle_info);
		})
		.then(values => {
			// console.log('All done SendPacket');

			// Make Packet
			let ret_chapter		= values[0];
			let ret_stage		= values[1];
			let ret_user		= values[2];
			let ret_inventory	= values[3];
			let ret_hero_list	= values[4];

			// User - full stamina remain_time
			let ret_remain_time = Timer.inst.GetStaminaFullRemainTime(ret_user.dataValues.STAMINA, ret_user.dataValues.MAX_STAMINA, ret_user.dataValues.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);

			p_ack_packet.chapter_id	= ret_chapter.dataValues.CHAPTER_ID;
			p_ack_packet.stage_id	= ret_stage.dataValues.STAGE_ID;
			p_ack_packet.first_enter= battle_info.first_enter_stage;

			p_ack_packet.result_gold		= ret_user.dataValues.GOLD;
			p_ack_packet.result_user_level	= ret_user.dataValues.USER_LEVEL;
			p_ack_packet.result_user_exp	= ret_user.dataValues.USER_EXP;
			p_ack_packet.account_buff_point = ret_user.dataValues.ACCOUNT_BUFF_POINT;

			p_ack_packet.stamina			= ret_user.STAMINA;
			p_ack_packet.max_stamina		= ret_user.MAX_STAMINA;
			p_ack_packet.stamina_remain_time= ret_remain_time;

			// 영웅 레벨 업 카운트
			if ( typeof ret_hero_list !== 'undefined' ) {
				ret_hero_list.map(hero => {
					console.log('after  hero_level : %d, hero_exp : %d', hero.dataValues.HERO_LEVEL, hero.dataValues.EXP);

					let result_hero	= new PacketCommonData.HeroLevelInfo();
					result_hero.hero_id		= hero.dataValues.HERO_ID;
					result_hero.hero_exp	= hero.dataValues.EXP;
					result_hero.hero_level	= hero.dataValues.HERO_LEVEL;

					p_ack_packet.result_hero_list.push(result_hero);
				});
			}

			// Item - 보상
			ret_inventory.map(item => {
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

			// 배틀 정보 지우기
			BattleMgr.inst.DelBattle(p_user.uuid);
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