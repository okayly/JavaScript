/********************************************************************
Title : RewardMgr
Date : 2016.07.21
Update : 2017.04.17
Desc : 보상 매니저
	   각 컨텐츠에서 받는 보상을 일관성 있게 만든다.
writer: dongsu -> jongwook
********************************************************************/
var mkDB	= require('../DB/mkDB.js');
var GTMgr	= require('../DB/GTMgr.js');

var LoadGTUser = require('../DB/GTLoad/LoadGTUser.js');
var LoadGTHero = require('../DB/GTLoad/LoadGTHero.js');

var SetGTUser = require('../DB/GTSet/SetGTUser.js');
var SetGTInventory = require('../DB/GTSet/SetGTInventory.js');

var BaseItemRe = require('../Data/Base/BaseItemRe.js');

var DefineValues = require('../Common/DefineValues.js');

var PacketCommonData= require('../Packets/PacketCommonData.js');

var Sender	= require('../App/Sender.js');
var Timer	= require('../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 아이템 설정 - 일반 아이템과 장비 아이템으로 분리
	let Item = function() {
		this.item_id		= 0;
		this.item_count		= 0;
		this.item_category1	= 0;	// 장비아이템 구분을 위해서 category1이 필요하다.
		this.equip_status_id= 0;
	}

	//------------------------------------------------------------------------------------------------------------------
	var FindItem = function(p_item_array, p_item_id) {
		if ( Array.isArray(p_item_array) == false)
			return undefined;

		let find_item = undefined;

		for (let cnt = 0; cnt < p_item_array.length; ++ cnt ) {
			if ( p_item_array[cnt].item_id == p_item_id ) {
				find_item = p_item_array[cnt];
				break;
			}
		}

		return find_item;
	}

	//------------------------------------------------------------------------------------------------------------------
	var AddItem = function(p_item_array, p_item_id, p_item_count, p_category1, p_equip_status_id) {
		let item = new Item();
		item.item_id = p_item_id;
		item.item_count	= p_item_count;
		item.item_category1 = p_category1;
		item.equip_status_id = p_equip_status_id;

		p_item_array.push(item);
	}

	//------------------------------------------------------------------------------------------------------------------
	var MakeItemList = function(p_item_array, p_item_id, p_item_count) {
		let find_item = FindItem(p_item_array, p_item_id);

		// 보상 아이템이 없는 경우
		if ( typeof find_item === 'undefined' ) {
			let base_item = BaseItemRe.inst.GetItem(p_item_id);
			if ( typeof base_item === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', p_item_id ]);

			if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
				// 장비 아이템
				for ( let cnt = 0; cnt < p_item_count; ++cnt ) {
					AddItem(p_item_array, p_item_id, 1, base_item.category1, base_item.equip_status_id);
				}
			} else {
				// 일반 아이템
				AddItem(p_item_array, p_item_id, p_item_count, base_item.category1, base_item.equip_status_id);
			}
		} else {
			if ( find_item.item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
				// 장비 아이템
				for ( let cnt = 0; cnt < p_item_count; ++cnt ) {
					AddItem(p_item_array, p_item_id, 1, base_item.category1, base_item.equip_status_id);
				}
			} else {
				// 일반 아이템
				find_item.item_count = find_item.item_count + p_item_count;
			}
		}
	}
	
	//------------------------------------------------------------------------------------------------------------------
	let Reward = function() {
		this.gold			= 0;
		this.cash			= 0;
		this.honor_point	= 0;
		this.alliance_point	= 0;
		this.challenge_point= 0;
		this.account_exp	= 0;
		this.stamina		= 0;
		this.item_list		= [];	// Item Array
	}

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

	// 꼭! reward_list는 type, id, count 3가지 형태여야 한다.
	inst.GetReward = function(p_reward_list) {
		let reward = new Reward();

		for ( let cnt = 0; cnt < p_reward_list.length; ++cnt ) {
			// console.log('reward_list[%d] :', cnt, p_reward_list[cnt]);

			let value = p_reward_list[cnt];
			let prop_name_list = Object.getOwnPropertyNames(value);

			let reward_type;
			let reward_id;
			let reward_value;

			// 보상 형태가 item_id, item_count 일때 - 이건 jongwook이가 만든 규칙.훗
			if ( prop_name_list.length == 2 ) {
				reward_type = DefineValues.inst.ItemReward;
				reward_id	= value[prop_name_list[0]];
				reward_value= value[prop_name_list[1]];
			} else {
				// 보상 형태가 reward_type, reward_id, value_count 일때
				reward_type	= value[prop_name_list[0]];
				reward_id	= value[prop_name_list[1]];
				reward_value= value[prop_name_list[2]];
			}

			if ( typeof reward_type === 'undefined' || typeof reward_id === 'undefined' || typeof reward_value === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'reward_list is undefined' ]);

			if ( isNaN(reward_type) || isNaN(reward_id) || isNaN(reward_value) )
				throw ([ PacketRet.inst.retFail(), 'reward_list is NaN' ]);

			// console.log('id : %d, count : %d, prop_name_list', reward_id, reward_value, prop_name_list);

			switch ( reward_type ) {
				case DefineValues.inst.ItemReward:
					MakeItemList(reward.item_list, reward_id, reward_value);
					break;

				case DefineValues.inst.GoldReward :
					reward.gold = reward.gold + reward_value;
					break;

				case DefineValues.inst.CashReward :
					reward.cash = reward.cash + reward_value;
					break;

				case DefineValues.inst.HonorPointReward :
					reward.honor_point = reward.honor_point + reward_value;
					break;

				case DefineValues.inst.AlliancePointReward :
					reward.alliance_point = reward.alliance_point + reward_value;
					break;

				case DefineValues.inst.ChallengePointReward :
					reward.challenge_point = reward.challenge_point + reward_value;
					break;

				case DefineValues.inst.AccountExpReward :
					reward.account_exp = reward.account_exp + reward_value;
					break;

				case DefineValues.inst.StaminaReward :
					reward.stamina = reward.stamina + reward_value;
					break;
			}
		}

		return reward;
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransactionReward = function(p_ret_user, p_reward) {
		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTUser.inst.SetReward(p_ret_user, p_reward.gold, p_reward.cash, p_reward.honor_point, p_reward.alliance_point, p_reward.challenge_point, p_reward.stamina, p_reward.account_exp, t),
					SetGTInventory.inst.SetRewardItemList(p_ret_user.dataValues.UUID, p_reward.item_list, t)
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
	// 2016.06.21 RewardBox 타입으로 변경
	// 2017.03.16 Promise로 수정
	inst.RewardBox = function(p_user, p_ack_cmd, p_ack_packet, p_reward_list) {
		// console.log('p_user.uuid', p_user.uuid);
		let reward;
		let old_user_level;	// 계정 경험치 보상에서 사용

		LoadGTUser.inst.SelectUser(p_user.uuid)
		.then(p_ret_user => {
			if ( p_ret_user == null )
				throw ([ PacketRet.inst.retFail(), 'User is null' ]);

			reward = inst.GetReward(p_reward_list);
			old_user_level = p_ret_user.dataValues.USER_LEVEL;
			
			console.log('account_exp : %d, stamina : %d, gold : %d, cash : %d, honor_point : %d, alliance_point : %d, challenge_point : %d',
					reward.account_exp, reward.stamina, reward.gold, reward.cash, reward.honor_point, reward.alliance_point, reward.challenge_point);
			console.log('결과 아이템 -', reward.item_list);

			return ProcessTransactionReward(p_ret_user, reward);
		})
		.then(values => {
			// console.log('values');
			if ( typeof reward === 'undefined' || typeof old_user_level === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'reward or old_user_level is undefined' ]);

			let user_data = values[0].dataValues;
			let ret_inventory = values[1];

			p_ack_packet.reward_box = new PacketCommonData.RewardBox();

			// 보상 내용이 있으면 패킷을 만든다.			
			if ( reward.gold != 0 ) {
				p_ack_packet.reward_box.gold = new PacketCommonData.Gold();
				p_ack_packet.reward_box.gold.total = user_data.GOLD;
			}

			if ( reward.cash != 0 ) {
				p_ack_packet.reward_box.cash = new PacketCommonData.Cash();
				p_ack_packet.reward_box.cash.total = user_data.CASH;
			}

			if ( reward.honor_point != 0 ) {
				p_ack_packet.reward_box.honor_point = new PacketCommonData.HonorPoint();
				p_ack_packet.reward_box.honor_point.total = user_data.POINT_HONOR;
			}

			if ( reward.alliance_point != 0 ) {
				p_ack_packet.reward_box.alliance_point = new PacketCommonData.AlliancePoint();
				p_ack_packet.reward_box.alliance_point.total = user_data.POINT_ALLIANCE;
			}

			if ( reward.challenge_point != 0 ) {
				p_ack_packet.reward_box.challenge_point = new PacketCommonData.ChallengePoint();
				p_ack_packet.reward_box.challenge_point.total = user_data.POINT_CHALLENGE;
			}

			if ( reward.account_exp != 0 ) {
				p_ack_packet.reward_box.account_exp = new PacketCommonData.AccountExp();
				p_ack_packet.reward_box.account_exp.exp = user_data.USER_EXP;

				if ( old_user_level != user_data.USER_LEVEL ) {
					p_ack_packet.reward_box.account_exp.levelup = new PacketCommonData.Levelup();
					p_ack_packet.reward_box.account_exp.levelup.level = user_data.USER_LEVEL;
					p_ack_packet.reward_box.account_exp.levelup.stamina = user_data.STAMINA;

					// 스태미너 Full 까지 남은 시간
					p_ack_packet.reward_box.account_exp.levelup.full_remain_time = Timer.inst.GetStaminaFullRemainTime(user_data.STAMINA, user_data.MAX_STAMINA, user_data.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);
				}
			}

			if ( reward.stamina != 0 ) {
				p_ack_packet.reward_box.stamina	= new PacketCommonData.Stamina();
				p_ack_packet.reward_box.stamina.total		= user_data.STAMINA;
				p_ack_packet.reward_box.stamina.max_stamina	= user_data.MAX_STAMINA;

				// 스태미너 Full 까지 남은 시간
				p_ack_packet.reward_box.stamina.stamina_remain_time = Timer.inst.GetStaminaFullRemainTime(user_data.STAMINA, user_data.MAX_STAMINA, user_data.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);
			}
			

			// 획득 아이템
			// console.log('p_ack_packet.reward_box', p_ack_packet.reward_box);
			ret_inventory.map(item => {
				let item_id = item.dataValues.ITEM_ID;

				let base_item = BaseItemRe.inst.GetItem(item_id);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_id ]);

				if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
					let equipment = new PacketCommonData.Equipment();

					equipment.iuid			= item.dataValues.IUID;
					equipment.item_id		= item.dataValues.ITEM_ID;

					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_1);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_2);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_3);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_4);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_5);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_6);

					p_ack_packet.reward_box.result_equipment_list.push(equipment);
				} else {
					let result_item	= new PacketCommonData.Item();
					result_item.iuid		= item.dataValues.IUID;
					result_item.item_id		= item.dataValues.ITEM_ID;
					result_item.item_count	= item.dataValues.ITEM_COUNT;

					p_ack_packet.reward_box.result_item_list.push(result_item);
				}
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
	var InsertHeroBase = function(p_t, p_uuid, p_hero_id, p_evolution_step, p_army_id) {
		return new Promise(function (resolve, reject) {
			// GT_HERO insert
			GTMgr.inst.GetGTHero().create({
				UUID : p_uuid,
				HERO_ID : p_hero_id,
				EVOLUTION_STEP : p_evolution_step,
				ARMY_SKILL_ID : p_army_id,
				REG_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_hero_insert => { resolve(p_ret_hero_insert); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectHeroSkill = function(p_t, p_uuid, p_hero_id, p_skill_id) {
		return new Promise(function (resolve, reject) {
			// GT_HERO_SKILL select
			GTMgr.inst.GetGTHeroSkill().find({
				where : { UUID : p_uuid, HERO_ID : p_hero_id, SKILL_ID : p_skill_id, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_hero_skill => { resolve(p_ret_hero_skill); })
			.catch(p_error => { reject(p_error); });
		});
	}


	//------------------------------------------------------------------------------------------------------------------
	var InsertHeroSkill = function(p_t, p_uuid, p_hero_id, p_skill_list) {
		// Promise.all GO!
		return new Promise(function (resolve, reject) {
			Promise.all(p_skill_list.map(skill_id => {
				return new Promise(function (resolve, reject) {
					SelectHeroSkill(p_t, p_uuid, p_hero_id, skill_id)
					.then(p_ret_hero_skill => {
						if ( p_ret_hero_skill == null ) {
							// GT_HERO_SKILL insert
							GTMgr.inst.GetGTHeroSkill().create({
								UUID : p_uuid,
								HERO_ID : p_hero_id,
								SKILL_ID : skill_id,
								REG_DATE : Timer.inst.GetNowByStrDate()
							}, { transaction : p_t })
							.then(p_ret_skill_insert => { resolve(p_ret_skill_insert); })
							.catch(p_error => { reject(p_error); });
						} else {
							resolve(p_ret_hero_skill);
						}
					})
					.catch(p_error => { reject(p_error); });
				});
			}))
			.then(values => { resolve(values); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.HeroSummon = function(p_t, p_uuid, p_hero_id, p_evolution_step, p_army_id, p_skill_list) {
		return new Promise(function (resolve, reject) {
			LoadGTHero.inst.SelectHero(p_uuid, p_hero_id)
			.then(p_ret_hero => {
				if ( p_ret_hero != null )
					throw([ PacketRet.inst.retAlreadyExistHero(), 'hero_id', p_hero_id ]);

				// Promise.all GO!
				Promise.all([
					InsertHeroBase(p_t, p_uuid, p_hero_id, p_evolution_step, p_army_id),
					InsertHeroSkill(p_t, p_uuid, p_hero_id, p_skill_list)
				])
				.then(values => { resolve(values); })
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;