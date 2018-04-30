/********************************************************************
Title : WeeklyDungeonFinish
Date : 2016.08.09
Update : 2016.11.25
Desc : 요일 던전 종료
writer : dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseWeeklyDungeon= require('../../Data/Base/BaseWeeklyDungeon.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender= require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');
var moment=	require('moment');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var GerStaminaFullRemainTime = function(p_now_date, p_stamina, p_max_stamina, p_last_stamina_change_date) {
		var diff_sec = ( p_last_stamina_change_date != null ) ? Timer.inst.GetDeltaTimeByBetweenDate(p_now_date, p_last_stamina_change_date) : 0;
		return Timer.inst.CalcRemainTime(DefineValues.inst.StaminaRecoverTime, p_stamina, p_max_stamina, diff_sec);
	}
	
	//------------------------------------------------------------------------------------------------------------------
	inst.ReqWeeklyDungeonFinish = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d recv - ReqWeeklyDungeonFinish -', p_user.uuid, p_recv);
		
		var recv_stage_id = parseInt(p_recv.stage_id);
		var recv_team_id = parseInt(p_recv.team_id);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			var base_stage = BaseWeeklyDungeon.inst.GetBaseWeeklyDungeon(recv_stage_id);
			// console.log('base_stage', base_stage);
			if ( typeof base_stage === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist WeeklyDungeonStage Info In Base WeeklyDungeon Stage ID', recv_stage_id);
				return;
			}

			// 스태미너 감소
			var now_date = moment();
			var ret_stamina = user_data.STAMINA - base_stage.need_stamina;
			// Max 까지 남은 시간 계산.
			var ret_remain_time = GerStaminaFullRemainTime(now_date, ret_stamina, user_data.MAX_STAMINA, user_data.LAST_STAMINA_CHANGE_DATE);

			// 보상 쿼리 만들기
			var str_query = 'call sp_weekly_reward (' + p_user.uuid + ',' + 
									ret_stamina + ',' + 
									base_stage.reward_account_exp + ',' + 
									base_stage.reward_hero_exp + ',' + 
									base_stage.reward_gold + ',' +
									recv_team_id;
			var count = 0;
			var reward_item_map = base_stage.GetRewardItemMap();
				
			reward_item_map.forEach(function (value, key) {
				str_query = str_query + ' ,' + value.item_id + ',' + value.item_count;
				count++;
			});

			var reward_count = 3;
			for ( var temp_count = count; temp_count < reward_count; temp_count++ ) {
				str_query = str_query + ' ,' + 0 + ',' + 0;
			}

			str_query = str_query + ');';

			console.log('sp query is - ' + str_query);

			// call ad-hoc query
			mkDB.inst.GetSequelize().query(str_query,
				null,
				{ raw: true, type: 'SELECT' }
			)
			.then(function (p_ret_reward) {
			 	// console.log('p_ret_reward:', p_ret_reward);
				// User reward
				if ( Object.keys(p_ret_reward[0]).length > 0 ) {
					p_ack_packet.ret_gold		= p_ret_reward[0][0].GOLD;
					p_ack_packet.ret_user_level	= p_ret_reward[0][0].USER_LEVEL;
					p_ack_packet.ret_user_exp	= p_ret_reward[0][0].USER_EXP;

					p_ack_packet.stamina			= p_ret_reward[0][0].STAMINA;
					p_ack_packet.max_stamina		= p_ret_reward[0][0].MAX_STAMINA;
					p_ack_packet.stamina_remain_time= ret_remain_time;
				}

				// hero reward
				if (Object.keys(p_ret_reward[1]).length > 0) {
					for ( var hero_cnt in p_ret_reward[1]) {
						var result_hero			= new PacketCommonData.HeroLevelInfo();
						result_hero.hero_id		= p_ret_reward[1][hero_cnt].hero_id;
						result_hero.hero_exp	= p_ret_reward[1][hero_cnt].hero_exp;
						result_hero.hero_level	= p_ret_reward[1][hero_cnt].hero_level;

						p_ack_packet.ret_hero_list.push(result_hero);
					}
				}
				
				// item reward
				if (Object.keys(p_ret_reward[2]).length > 0) {
					for ( var item_cnt in p_ret_reward[2] ) {
						var result_item			= new PacketCommonData.Item();
						result_item.iuid		= p_ret_reward[2][item_cnt].iuid;
						result_item.item_id		= p_ret_reward[2][item_cnt].item_id;
						result_item.item_count	= p_ret_reward[2][item_cnt].item_count;

						p_ack_packet.ret_item_list.push(result_item);
					}
				}

				// 요일 던전 플레이 횟수
				if (Object.keys(p_ret_reward[3]).length > 0) {				
					p_ack_packet.exec_count	= p_ret_reward[3][0].EXEC_WEEKLY_DUNGEON_PLAY_COUNT;
				}
				
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDungeonFinish - 1');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDungeonFinish - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;