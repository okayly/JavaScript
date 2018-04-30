/********************************************************************
Title : pvp info
Date : 2017.02.27
Update : 2017.04.07
Desc : PVP 시작 - 상대 저보
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');
var PVPMatchMgr = require('./PVPMatchMgr.js');

var LoadPVP = require('../../DB/GTLoad/LoadGTPVP.js');
var LoadHero = require('../../DB/GTLoad/LoadGTHero.js');
var LoadGuild = require('../../DB/GTLoad/LoadGTGuild.js');
var LoadUser = require('../../DB/GTLoad/LoadGTUser.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	var GetEquipMentInfo = function(p_uuid, p_slot_info, p_ack_packet) {

		let hero_equip_map = new Map();

		return new Promise((resolve, reject) => {
			LoadHero.inst.GetEquipMentByTeamHero(p_uuid, p_slot_info)
			.then(p_rets => {
				p_rets.map(row => {

					let equip_data = new PacketCommonData.Equipment();
					equip_data.iuid 		= row.IUID;
					equip_data.item_id 		= row.ITEM_ID;
					equip_data.bind_hero_id = row.HERO_ID;
					equip_data.item_level 	= row.ITEM_LEVEL;
					equip_data.reinforce_step = row.REINFORCE_STEP;
					equip_data.is_lock 		= row.IS_LOCK;
					equip_data.sub_option_id_list.push(row.SUB_OPTION_ID_1);
					equip_data.sub_option_id_list.push(row.SUB_OPTION_ID_2);
					equip_data.sub_option_id_list.push(row.SUB_OPTION_ID_3);
					equip_data.sub_option_id_list.push(row.SUB_OPTION_ID_4);
					equip_data.sub_option_id_list.push(row.SUB_OPTION_ID_5);
					equip_data.sub_option_id_list.push(row.SUB_OPTION_ID_6);

					if ( hero_equip_map.has(row.HERO_ID) == false ) {
						let hero_equip = new PacketCommonData.MatchHeroEquipInfo();
						hero_equip.hero_id = row.HERO_ID;
						hero_equip.equip_item_list.push(equip_data);
					}
					else {
						let hero_equip = hero_equip_map.get(row.HERO_ID);
						hero_equip_map.push(equip_data);
					}
				});
				
				// 패킷에 적용. 
				hero_equip_map.forEach(function (values, key) {
					p_ack_packet.pvp_hero_equip_list.push(values);
				})

				resolve(null);

			})
			.catch(p_error => { reject([p_error, 'GetEquipMentInfo']); })
		});
	}

	var GetHeroSkillInfo = function(p_uuid, p_slot_info, p_ack_packet) {

		let hero_skill_map = new Map();

		return new Promise((resolve, reject) => {
			LoadHero.inst.GetSkillByTeamHero(p_uuid, p_slot_info)
			.then(p_rets => {
				p_rets.map(row => {

					let skill_data = row.dataValues;
					let skill_info = new PacketCommonData.Skill();
					skill_info.skill_id 	= skill_data.SKILL_ID;
					skill_info.skill_level 	= skill_data.SKILL_LEVEL;

					if ( hero_skill_map.has(skill_data.HERO_ID) == false ) {
						let hero_info = new PacketCommonData.MatchHeroSkillInfo();
						hero_info.skill_list.push(skill_info);
						hero_skill_map.set(skill_data.HERO_ID, hero_info);
					}
					else {
						let hero_info = hero_skill_map.get(skill_data.HERO_ID);
						hero_info.skill_list.push(skill_info);
					}
				})

				// 패킷에 적용. 
				hero_skill_map.forEach(function (values, key) {
					p_ack_packet.pvp_hero_skill_list.push(values);
				})

				resolve(null);
			})
			.catch(p_error => { reject([p_error, 'GetEquipMentInfo']); })
		});
	}

	var GetGuildBuff = function(p_uuid, p_ack_packet) {
		return new Promise((resolve, reject) => {
			LoadGuild.inst.GetGuildByUUID(p_uuid)
			.then(p_ret_skills => {
				if ( p_ret_skills != null ) {
					p_ret_skills.map(row => {

						let guild_skill 		= new PacketCommonData.GuildSkillInfo();
						guild_skill.skill_id 	= row.dataValues.SKILL_ID;
						guild_skill.skill_level 	= row.dataValues.SKILL_LEVEL;

						p_ack_packet.guild_buff_list.push(guild_skill);
					})
				}

				resolve(null);
			})
			.catch(p_error => { reject([p_error, 'GetGuildBuff']); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectAccountBuffList = function(p_uuid) {
		return new Promise((resolve, reject) => {
			GTMgr.inst.GetGTAccountBuff().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_buff_list => {
				// 없을 수 있다. 
				resolve(p_ret_buff_list);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	var GetAccountBuff = function(p_uuid, p_ack_packet) {
		return new Promise((resolve, reject) => {
			SelectAccountBuffList(p_uuid)
			.then( p_rets => {
				if ( p_rets != null ) {
					p_rets.map(row => {
						let acc_buf = new PacketCommonData.AccountBuff();
						acc_buf.account_buff_id 	= row.dataValues.ACCOUNT_BUFF_ID;
						acc_buf.account_buff_level 	= row.dataValues.ACCOUNT_BUFF_LEVEL;

						p_ack_packet.account_buff_list.push(acc_buf);
					})
				}

				resolve(null);
			})
			.catch(p_error => { reject([p_error, 'GetAccountBuff']); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var GetHeroCombiBuff = function(p_uuid, p_ack_packet) {
		return new Promise(function (resolve, reject) {
			// GT_HERO_COMBI_BUFF select
			GTMgr.inst.GetGTHeroCombiBuff().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_combi_list => {
				// console.log('p_ret_combi_list', p_ret_combi_list);
				for (let cnt = 0; cnt < p_ret_combi_list.length; ++cnt ) {
					let combi_buff = new PacketCommonData.HeroCombiBuff();
					combi_buff.buff_id = p_ret_combi_list[cnt].dataValues.BUFF_ID;
					combi_buff.buff_level = p_ret_combi_list[cnt].dataValues.BUFF_LEVEL;

					p_ack_packet.hero_combi_buff_list.push(combi_buff);
				}

				resolve(null);
			})
			.catch(p_error => { reject([ p_error, 'GetHeroCombiBuff' ]); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqPvpStart = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqPvpStart -', p_user.uuid, p_recv);

		var recv_target_uuid = parseInt(p_recv.target_uuid);
		var slot_info;

		Promise.all([	LoadPVP.inst.GetPVP(p_user.uuid),
				LoadHero.inst.SelectTeam(recv_target_uuid, 7)])
		.then(values => {
			p_ack_packet.target_uuid =  recv_target_uuid;
			
			logger.info('TEST 스킬. -');
			if ( values[1] == null ) {
				throw ([PacketRet.inst.retFail(), 'Not Find PVP Team']);
			}

			let pvp_data	= values[0].dataValues;
			let slot_data 	= values[1].dataValues;
			logger.info('TEST - pvp_data', pvp_data);
			logger.info('TEST - slot_data', slot_data);

			if ( pvp_data.ABLE_PLAY_COUNT <= 0 ) {
				throw ([PacketRet.inst.retNotEnoughExecCount(), 'retNotEnoughExecCount']);
			}

			slot_info = [slot_data.SLOT1, slot_data.SLOT2, slot_data.SLOT3, slot_data.SLOT4];
			// 스킬 정보. 
			return GetHeroSkillInfo(recv_target_uuid, slot_info, p_ack_packet);
		})
		.then(values => {
			logger.info('TEST 길드 버프 -');
			// 길드 버프. 
			return GetGuildBuff(recv_target_uuid, p_ack_packet);
		})
		.then(values => {
			logger.info('TEST 계정 버프 -');
			// 계정 버프.
			return GetAccountBuff(recv_target_uuid, p_ack_packet);
		})
		.then(values => {
			logger.info('TEST 장착 아이템 -');
			// 장착 아이템.
			return GetEquipMentInfo(recv_target_uuid, slot_info, p_ack_packet);
		})
		.then(values => {
			logger.info('TEST 영웅 수집 버프 -');

			return GetHeroCombiBuff(recv_target_uuid, p_ack_packet);
		})
		.then(values => {
			return Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		})
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;