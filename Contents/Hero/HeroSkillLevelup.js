/********************************************************************
Title : HeroSkillLevelup
Date : 2015.12.10
Update : 2017.03.15
Desc :영웅 스킬 레벨업(강화)
writer: jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');

var BaseExpRe = require('../../Data/Base/BaseExpRe.js');
var BaseVipRe = require('../../Data/Base/BaseVipRe.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 스킬 정보
	inst.ReqHeroSkillLevelup = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqHeroSkillLevelup -', p_user.uuid, p_recv);

		var hero_id = parseInt(p_recv.hero_id);
		var skill_id = parseInt(p_recv.skill_id);

		// GT_USER select - 스킬 포인트 확인
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			// console.log('p_ret_user', p_ret_user);
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}

			var user_data = p_ret_user.dataValues;
			
			var ret_skill_point = user_data.SKILL_POINT - 1;
			if ( ret_skill_point < 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughSkillPoint(), 'Result SkillPoint', ret_skill_point);
				return;
			}

			// call ad-hoc query
			mkDB.inst.GetSequelize().query('select A.UUID, A.HERO_ID, A.HERO_LEVEL, B.SKILL_ID, B.SKILL_LEVEL from GT_HEROes A \
											left join GT_HERO_SKILLs B on A.HERO_ID = B.HERO_ID and A.UUID = B.UUID \
											where A.UUID = ? and A.HERO_ID = ? and B.SKILL_ID = ?;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_user.uuid, hero_id, skill_id ]
			)
			.then(function (p_ret_hero) {
				// console.log('p_ret_hero', p_ret_hero);
				if ( Object.keys(p_ret_hero).length <= 0 || Object.keys(p_ret_hero).length > 1) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_HERO, GT_HERO_SKILL', 'p_ret_hero', p_ret_hero);
					return;
				}

				var hero_level	= p_ret_hero[0].HERO_LEVEL;
				var skill_level	= p_ret_hero[0].SKILL_LEVEL;

				// 골드 확인
				var ret_skill_level = skill_level + 1;
				
				// 영웅 레벨과 비교
				// console.log('hero_level : %d, ret_skill_level : %d', hero_level, ret_skill_level, hero_level < ret_skill_level);
				if ( hero_level < ret_skill_level ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughHeroLevel(), 'Hero Level', hero_level, 'Skill Level', ret_skill_level);
					return;
				}

				var need_gold = BaseExpRe.inst.GetHeroSkillNeedGold(ret_skill_level);
				if ( user_data.GOLD < need_gold ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'Need Gold', need_gold, 'Current Gold', user_data.GOLD);
					return;
				}

				var ret_gold = user_data.GOLD - need_gold;
				if ( ret_gold < 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Sub Gold', ret_gold);
					return;
				}

				// 시간 계산
				var vip_base = BaseVipRe.inst.GetVip(user_data.VIP_STEP);
				if ( typeof vip_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Vip Info In Base');
					return;
				}

				console.log('user_data.LAST_SKILL_POINT_CHANGE_DATE', user_data.LAST_SKILL_POINT_CHANGE_DATE);

				var charge_time = vip_base.skill_point_charge_time;
				var now_date = moment();
				var diff_sec = (user_data.LAST_SKILL_POINT_CHANGE_DATE != null) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, user_data.LAST_SKILL_POINT_CHANGE_DATE) : 0;

				// 이게 잘생각 해야 하는게...레벨업 시점에 스킬포인트를 사용
				// 스킬포인트가 충전되는 시간 안에 사용되면 스킬포인트 감소가 없는 경우가되는건가?? 아. 이거 어떻게 생각 해야해...
				// 지금 문제는 스킬 레벨업을 계속 하면 충전 시간이 리셋된다. 리셋되는 타이밍을 잡아야 한다.

				// 1-1. 경과 시간에 따른 충전량 계산.
				// var ret_remain_time = Timer.inst.CalcRemainTime(charge_time, ret_skill_point, user_data.MAX_SKILL_POINT, diff_sec);
				// console.log('charge_time : %d, diff_sec : %d, ret_remain_time : %d', vip_base.skill_point_charge_time, diff_sec, ret_remain_time);
				
				// 스킬 레벨과 골드 차감 sp 호출
				mkDB.inst.GetSequelize().query('call sp_update_hero_skill_levelup(?, ?, ?, ?, ?, ?, ?);'
					, null, { raw: true, type: 'SELECT' }
					, [ p_user.uuid,
						hero_id,
						ret_gold,
						skill_id,
						ret_skill_level,
						ret_skill_point,
						now_date.utc().format('YYYY-MM-DD HH:mm:ss')
					]
				)
				.then(function (p_ret_levelup) {
					p_ack_packet.hero_id = hero_id;
					p_ack_packet.gold = p_ret_levelup[0][0].GOLD;
					p_ack_packet.skill_id = p_ret_levelup[0][0].SKILL_ID;
					p_ack_packet.skill_level = p_ret_levelup[0][0].SKILL_LEVEL;
					p_ack_packet.skill_point = p_ret_levelup[0][0].SKILL_POINT;
					p_ack_packet.skill_point_remain_time = Timer.inst.CalcRemainTime(charge_time, ret_skill_point, p_ret_levelup[0][0].MAX_SKILL_POINT, diff_sec);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroSkillLevelup - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroSkillLevelup - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroSkillLevelup - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;