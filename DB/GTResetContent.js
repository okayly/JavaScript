/********************************************************************
Title : 
Date : 
Update :
Desc : 
writer: dongsu
********************************************************************/
var GTMgr	= require('./GTMgr.js');

var BaseGuild	= require('../Data/Base/BaseGuild.js');

var Timer	= require('../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 주간 컨텐츠 리셋.
	inst.InitWeeklyContent = function() {

		logger.info('----------------------- Init Weekly Content Time Check -------------------');

		// 1. 기준 시간 확인. 
		var now = moment();
		var next_mon = now.weekday(7);

		// 2. 남은 시간 구하기. 
		var remain_today_sec = moment().hours('24').minutes('00').seconds('00').diff(moment(), 'seconds');
		var remain_sec = next_mon.diff(moment(), 'seconds') + (60 * 60 * 5) + remain_today_sec * 1000;
		
		logger.info('--- 오늘 남은 시간(초) : ', remain_today_sec);
		logger.info('--- 다음 정리 까지 남은 시간(초) : ', remain_sec);
		
		// 3. 타이머 설정. 
		setTimeout(CallInitFuncs, remain_sec);
	}

	//------------------------------------------------------------------------------------------------------------------
	var CallInitFuncs = function() {
		logger.info('----------------------- Init Weekly Content -------------------');
		ResetGuildDonationbyMember();
		ResetGuildDonationbyGuild();
		ResetGuildDonationbyTakeReward();

		inst.InitWeeklyContent();
	}
	var ResetGuildDonationbyMember = function() {
		logger.info('----------------------- Init Weekly Content ResetGuildDonationbyMember -------------------');
		GTMgr.inst.GetGTGuildMember().findAll({
			where : { EXIST_YN : true }
		})
		.then(function (p_ret_member) {
			for ( var member_cnt in p_ret_member ) {

				(function (member_cnt) {
					var sum = p_ret_member[member_cnt].WEEKLY_ACCUM_DONATION_POINT + p_ret_member[member_cnt].TOTAL_ACCUM_DONATION_POINT;
					p_ret_member[member_cnt].updateAttributes({
						WEEKLY_ACCUM_DONATION_POINT : 0,
						TOTAL_ACCUM_DONATION_POINT : sum
					})
					.then(function (p_ret_member_update) {
					})
					.catch(function (p_error) {
						logger.error('UUID : %d, error Init Guild Member Donation Info!!!!', p_ret_member[member_cnt].UUID, p_error.stack);
					});	
				})(member_cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('ResetGuildDonationbyMember!!!', p_error.stack);
		})
	}
	var ResetGuildDonationbyGuild = function() {
		logger.info('----------------------- Init Weekly Content ResetGuildDonationbyGuild -------------------');
		GTMgr.inst.GetGTGuild().findAll({
			where : { EXIST_YN : true }
		})
		.then(function (p_ret_guild) {
			// console.log('ResetGuildDonationbyGuild p_ret_guild - ', p_ret_guild);

			for ( var guild_cnt in p_ret_guild ) {
				(function (guild_cnt) {
					var weekly_accum_point 		= p_ret_guild[guild_cnt].dataValues.WEEKLY_ACCUM_GUILD_POINT;
					var ret_guild_point 			= p_ret_guild[guild_cnt].dataValues.GUILD_POINT;
					var donation_reward_base 		= BaseGuild.inst.GetWeeklyDonationReward(weekly_accum_point);
					if ( donation_reward_base != undefined ) {
						ret_guild_point = donation_reward_base.guild_reward_point + p_ret_guild[guild_cnt].dataValues.GUILD_POINT;
					}

					p_ret_guild[guild_cnt].updateAttributes({
						GUILD_POINT : ret_guild_point,
						PREV_WEEKLY_ACCUM_GUILD_POINT : weekly_accum_point,
						WEEKLY_ACCUM_GUILD_POINT : 0
					})
					.then(function (p_ret_guild_update) {
					})
					.catch(function (p_error) {
						logger.error('GUILD_ID : %d, error Init Guild Member Donation Info!!!!', p_ret_guild[guild_cnt].GUILD_ID, p_error.stack);
					});

				})(guild_cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('ResetGuildDonationbyGuild!!!', p_error.stack);
		})
	}
	var ResetGuildDonationbyTakeReward = function() {
		logger.info('----------------------- Init Weekly Content ResetGuildDonationbyTakeReward -------------------');
		GTMgr.inst.GetGTWeeklyContents().findAll({
			where : { EXIST_YN : true }
		})
		.then(function (p_ret_reward) {
			for ( var reward_cnt in p_ret_reward ) {
				(function (reward_cnt) {
					p_ret_reward[reward_cnt].updateAttributes({
						TAKE_DONATION_REWARD : false
					})
					.then(function (p_ret_reward_update) {
					})
					.catch(function (p_error) {
						logger.error('GUILD_ID : %d, error Init Guild Member Donation Info!!!!', p_ret_guild[guild_cnt].GUILD_ID, p_error.stack);
					});
				})(reward_cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('ResetGuildDonationbyTakeReward!!!', p_error.stack);
		})
	}
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;