/********************************************************************
Title : DuckHero
Date : 2016.06.01
Update : 2016.11.22
Desc : 테스트 패킷을 관리 - 모든 영웅
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var BaseExpRe = require('../../Data/Base/BaseExpRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var moment = require('moment');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SetHeroLevelInfo = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet, p_level, p_exp) {
		// call ad-hoc update query
		mkDB.inst.GetSequelize().query('update GT_HEROes set HERO_LEVEL = ?, EXP = ? where UUID = ? and EXIST_YN = true;',
			null,
			{ raw : true, type : 'UPDATE' },
			[ p_level, p_exp, p_uuid ]
		)
		.then(function (p_ret_hero_update) {
			// call ad-hoc query select - p_ret_hero_update is 0
			mkDB.inst.GetSequelize().query('select * from GT_HEROes where UUID = ? and EXIST_YN = true;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid ]
			)
			.then(function (p_ret_hero) {
				if ( Object.keys(p_ret_hero).length > 0 ) {
					for ( var cnt in p_ret_hero ) {
						var hero_level_info = new PacketCommonData.HeroLevelInfo();
						hero_level_info.hero_id		= p_ret_hero[cnt].HERO_ID;
						hero_level_info.hero_level	= p_ret_hero[cnt].HERO_LEVEL;
						hero_level_info.hero_exp	= p_ret_hero[cnt].EXP;
						
						p_ack_packet.hero_level_info_list.push(hero_level_info);

						p_evt_packet.hero_level	= p_ret_hero[cnt].HERO_LEVEL;						
						p_evt_packet.hero_exp	= p_ret_hero[cnt].EXP;
					}
				} else {
					p_ack_packet.hero_level_info_list = null;
					p_evt_packet.hero_level	= 0;
					p_evt_packet.hero_exp	= 0;
				}

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error SetHeroLevelInfo - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error SetHeroLevelInfo - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 레벨 
	inst.ReqHeroLevel = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.debug('UUID : %d, recv - ReqHeroLevel -', p_uuid, p_recv);

		var hero_level = parseInt(p_recv.hero_level);

		var exp_base = BaseExpRe.inst.GetHeroExp(hero_level);
		if ( typeof exp_base === 'undefined' ) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Exp In Base Hero Level', hero_level);
			return;
		}

		// var exp_percent = 0;
		// var sub_exp = exp_base.total_exp - exp_base.need_exp;
		// var ret_percent = (exp_percent != 0) ? exp_percent / 100 : 0;
		// var hero_exp = exp_base.need_exp + Math.floor(sub_exp * ret_percent);
		// console.log('need_exp: %d, sub_exp: %d, ret_exp: %d, ret_percent: %d', exp_base.need_exp, sub_exp, hero_exp, ret_percent);

		SetHeroLevelInfo(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet, hero_level, exp_base.total_exp);
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 경험치
	inst.ReqHeroExp = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqHeroExp -', p_uuid, p_recv);

		var hero_exp = parseInt(p_recv.hero_exp);

		// query
		mkDB.inst.GetSequelize().query('select * from BT_EXPs where HERO_TOTAL_EXP <= ? order by TARGET_LEVEL desc limit 1;',
			null,
			{ raw : true, type : 'SELECT' },
			[ hero_exp ]
		)
		.then(function (p_ret_exp) {
			if ( Object.keys(p_ret_exp).length > 0 ) {
				var hero_level = p_ret_exp[0].TARGET_LEVEL;
				SetHeroLevelInfo(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet, hero_level, hero_exp);
			} else {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Exp In Base Hero Exp', hero_exp);
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqHeroExp');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 스킬 레벨 
	inst.ReqHeroSkill = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqHeroSkill -', p_uuid, p_recv);

		var skill_level = parseInt(p_recv.skill_level);

		// call update
		mkDB.inst.GetSequelize().query('update GT_HERO_SKILLs set SKILL_LEVEL = ? where UUID = ? and EXIST_YN = true;',
			null,
			{ raw : true, type : 'UPDATE' },
			[ skill_level, p_uuid ]
		)
		.then(function (p_ret_hero_skill_update) {
			// call select - order by 꼭 해줘야 packet을 제대로 만든다.
			mkDB.inst.GetSequelize().query('select * from GT_HERO_SKILLs where UUID = ? and EXIST_YN = true order by HERO_ID, SKILL_ID;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid ]
			)
			.then(function (p_ret_hero_skill_level) {
				if ( Object.keys(p_ret_hero_skill_level).length > 0 ) {
					var temp_hero_id= 0;
					var skill_info	= undefined;
					
					for ( var cnt in p_ret_hero_skill_level ) {
						var ret_skill_data = p_ret_hero_skill_level[cnt];
						if ( temp_hero_id != ret_skill_data.HERO_ID ) {
							skill_info = new PacketCommonData.HeroSkillInfo();
							skill_info.hero_id = ret_skill_data.HERO_ID;

							p_ack_packet.hero_skill_info_list.push(skill_info);

							temp_hero_id = ret_skill_data.HERO_ID;
						}

						if ( typeof skill_info != 'undefined' ) {
							var skill = new PacketCommonData.Skill();
							skill.skill_id = ret_skill_data.SKILL_ID;
							skill.skill_level = ret_skill_data.SKILL_LEVEL;
							skill_info.skill_list.push(skill);
						}
					}
					p_evt_packet.hero_skill_level = skill_level;
				} else {
					p_ack_packet.hero_skill_info_list = null;
					p_evt_packet.hero_skill_level = 0;
				}

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqHeroSkill - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqHeroSkill - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 진화
	inst.ReqHeroEvolution = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.debug('UUID : %d, recv - ReqHeroEvolution -', p_uuid, p_recv);

		var evolution_step = parseInt(p_recv.evolution_step);

		// call update
		mkDB.inst.GetSequelize().query('update GT_HEROes set EVOLUTION_STEP = ? where UUID = ? and EXIST_YN = true;',
			null,
			{ raw : true, type : 'UPDATE' },
			[ evolution_step, p_uuid ]
		)
		.then(function (p_ret_hero_evolution_update) {
			// GT_HERO select
			mkDB.inst.GetSequelize().query('select * from GT_HEROes where UUID = ? and EXIST_YN = true order by HERO_ID;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid ]
			)
			.then(function (p_ret_hero) {
				if ( Object.keys(p_ret_hero).length > 0 ) {
					for (var cnt in p_ret_hero) {
						var hero_data = p_ret_hero[cnt];

						var evolution = new PacketCommonData.HeroEvolutionInfo();
						evolution.hero_id		= hero_data.HERO_ID;
						evolution.evolution_step= hero_data.EVOLUTION_STEP;
						
						p_ack_packet.hero_evolution_list.push(evolution);

						p_evt_packet.hero_evolution_step = evolution_step;
					}
				} else {
					p_ack_packet.hero_evolution_list = null;
					p_evt_packet.hero_evolution_step = 0;
				}

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqHeroEvolution - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqHeroEvolution - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 강화
	inst.ReqHeroReinforce = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.debug('UUID : %d, recv - ReqHeroReinforce -', p_uuid, p_recv);

		var reinforce_step = parseInt(p_recv.reinforce_step);

		// call update
		mkDB.inst.GetSequelize().query('update GT_HEROes set REINFORCE_STEP = ? where UUID = ? and EXIST_YN = true;',
			null,
			{ raw : true, type : 'UPDATE' },
			[ reinforce_step, p_uuid ]
		)
		.then(function (p_ret_hero_promotion_update) {
			// GT_HERO select
			mkDB.inst.GetSequelize().query('select * from GT_HEROes where UUID = ? and EXIST_YN = true order by HERO_ID;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid ]
			)
			.then(function (p_ret_hero) {
				if ( Object.keys(p_ret_hero).length > 0 ) {
					let HeroReinforce = function() {
						this.hero_id;
						this.reinforce_step;
					}

					for (let cnt in p_ret_hero) {
						let hero_data = p_ret_hero[cnt];

						let reinforce = new HeroReinforce();
						reinforce.hero_id = hero_data.HERO_ID;
						reinforce.reinforce_step = hero_data.REINFORCE_STEP;
						
						p_ack_packet.hero_reinforce_list.push(reinforce);
					}

					p_evt_packet.hero_reinforce_step = reinforce_step;
				} else {
					p_ack_packet.hero_reinforce_list = null;
					p_evt_packet.hero_reinforce_step = 0;
				}

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqHeroPromotion - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqHeroPromotion - 1');
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;