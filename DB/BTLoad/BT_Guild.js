/********************************************************************
Title : BT_Guild
Date : 2016.03.23
Update : 2017.04.07
Desc : BT 로드 - 길드 기본 정보 읽기. 
writer : Dongsu
********************************************************************/
var DefineValues = require('../../Common/DefineValues.js');

var BaseGuild = require('../../Data/Base/BaseGuild.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadGuild = function (p_bt_guild) {
		logger.debug('*** Start LoadGuild ***');

		p_bt_guild.findAll()
		.then(function (p_ret_guild) {
			for (var cnt in p_ret_guild) {
				(function (cnt) {
					var data = p_ret_guild[cnt].dataValues;

					var guild = new BaseGuild.inst.GuildInfo();
					guild.guild_level = data.GUILD_LV;
					guild.need_guild_point = data.NEED_GUILD_POINT;
					guild.max_member_count = data.MAX_MEMBER_COUNT;
					guild.open_guild_contents = data.OPEN_GUILD_CONTENTS;
					guild.open_guild_raid = data.OPEN_GUILD_RAID;
					guild.open_guild_skill = data.OPEN_GUILD_SKILL;
					guild.open_cost = data.OPEN_COST;
					guild.cost_level = data.COST_LV;
					
					BaseGuild.inst.AddGuildInfo(data.GUILD_LV, guild);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadGuild!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadGuildDonation = function (p_bt_doantion) {
		logger.debug('*** Start LoadGuildDonation ***');

		p_bt_doantion.findAll()
		.then(function (p_ret_donation) {
			for (var cnt in p_ret_donation) {
				(function (cnt) {
					var data = p_ret_donation[cnt].dataValues;

					var donation = new BaseGuild.inst.GuildDonation();
					donation.donation_id = data.DONATION_ID;
					donation.need_gold = data.NEED_GOLD;
					donation.need_cash = data.NEED_CASH;
					donation.guild_point = data.GUILD_POINT;
					donation.alliance_point = data.ALLIANCE_POINT;
					
					BaseGuild.inst.AddGuildDonation(data.DONATION_ID, donation);					
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadGuildDonation!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadGuildRaidChapter = function (p_bt_guild_raid_chapter, p_bt_guild_raid_stage) {
		logger.debug('*** Start LoadGuildRaidChapter ***');

		// BT_CHAPTER_BASE select
		p_bt_guild_raid_chapter.findAll({ order: 'CHAPTER_ID asc' })
		.then(function (p_ret_chapter) {
			for (var cnt in p_ret_chapter) {
				(function (cnt) {
					var data = p_ret_chapter[cnt].dataValues;

					if (data.CHAPTER_TYPE == DefineValues.inst.GuildRaidChapter) {
						var raid_chapter = new BaseGuild.inst.GuildRaidChapter;
						raid_chapter.chapter_id = data.CHAPTER_ID;
						raid_chapter.chapter_open_cost = data.CHAPTER_OPEN_COST;

						// BT_STAGE_BASE select
						p_bt_guild_raid_stage.findAll({
							where: { CHAPTER_ID: data.CHAPTER_ID }, order: 'STAGE_ID asc' 
						})
						.then(function(p_ret_stages) {
							for(var stage in p_ret_stages) {								
								var data_stage = p_ret_stages[stage];								
								raid_chapter.stage_list.push(data_stage.STAGE_ID);

								// 챕터의 마지막 스테이지 ID저장
								if (stage == (p_ret_stages.length -1)) {
									raid_chapter.last_stage_id = data_stage.STAGE_ID;
									// console.log('Chapter last stage_id', raid_chapter.last_stage_id);
								}
								// console.log('CHAPTER_ID: %d, STAGE_ID: %d', data.CHAPTER_ID, data_stage.STAGE_ID);
							}
						})
						.catch(function(p_error) {
							logger.error('error p_bt_guild_raid_stage.findAll!!!!', p_error);
						});
						
						BaseGuild.inst.AddGuildRaidChapter(data.CHAPTER_ID, raid_chapter);
					}
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadGuildRaidChapter!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadGuildRaidRankReward = function (p_bt_guild_raid_rank_reward) {
		logger.debug('*** Start LoadGuildRaidRankReward ***');

		p_bt_guild_raid_rank_reward.findAll()
		.then(function (p_ret_reward) {
			for (var cnt in p_ret_reward) {
				(function(cnt) {
					// console.log('p_ret_reward[cnt] -', p_ret_reward[cnt].dataValues);
					var data = p_ret_reward[cnt].dataValues;

					var rank_reward = new BaseGuild.inst.RankReward();
					rank_reward.reward_id = data.GUILD_REWARD_ID;
					rank_reward.reward_group_id = data.GUILD_RAID_REWARD_GROUP_ID;
					rank_reward.mail_string_id = data.MAIL_STRING_ID;
					rank_reward.rank_min = data.REWARD_RANK_START;
					rank_reward.rank_max = data.REWARD_RANK_END;
					
					// RewardBox
					if (data.REWARD1_TYPE != DefineValues.inst.NotReward) rank_reward.AddReward(data.REWARD1_TYPE, data.REWARD1_ID, data.REWARD1_COUNT);
					if (data.REWARD2_TYPE != DefineValues.inst.NotReward) rank_reward.AddReward(data.REWARD2_TYPE, data.REWARD2_ID, data.REWARD2_COUNT);
					if (data.REWARD3_TYPE != DefineValues.inst.NotReward) rank_reward.AddReward(data.REWARD3_TYPE, data.REWARD3_ID, data.REWARD3_COUNT);
					if (data.REWARD4_TYPE != DefineValues.inst.NotReward) rank_reward.AddReward(data.REWARD4_TYPE, data.REWARD4_ID, data.REWARD4_COUNT);
					if (data.REWARD5_TYPE != DefineValues.inst.NotReward) rank_reward.AddReward(data.REWARD5_TYPE, data.REWARD5_ID, data.REWARD5_COUNT);
					
					// console.log('data.GUILD_REWARD_TYPE == DefineValues.inst.GuildRaidRankStageReward()', data.GUILD_REWARD_TYPE == DefineValues.inst.GuildRaidRankStageReward());
					if (data.GUILD_REWARD_TYPE == DefineValues.inst.GuildRaidRankStageReward)
						BaseGuild.inst.AddStageRankReward(data.GUILD_REWARD_ID, rank_reward);
					else
						BaseGuild.inst.AddChapterRankReward(data.GUILD_REWARD_ID, rank_reward);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadGuildRaidRankReward!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadGuildDonationReward = function (p_bt_doantion_reward) {
		logger.debug('*** Start LoadGuildDonationReward ***');

		p_bt_doantion_reward.findAll()
		.then(function (p_ret_donation_reward) {
			for (var cnt in p_ret_donation_reward) {
				(function (cnt) {
					var data = p_ret_donation_reward[cnt].dataValues;

					var donation_reward = new BaseGuild.inst.DonationRewardInfo();
					donation_reward.donation_reward_id 	= data.DONATION_REWARD_ID;
					donation_reward.donation_standard_point 	= data.DONATION_POINT;
					donation_reward.guild_reward_point 	= data.GUILD_POINT_REWARD;

					if (data.REWARD1_TYPE != 0) donation_reward.AddReward(data.REWARD1_TYPE, data.REWARD1_ID, data.REWARD1_COUNT);
					if (data.REWARD2_TYPE != 0) donation_reward.AddReward(data.REWARD2_TYPE, data.REWARD2_ID, data.REWARD2_COUNT);
					if (data.REWARD3_TYPE != 0) donation_reward.AddReward(data.REWARD3_TYPE, data.REWARD3_ID, data.REWARD3_COUNT);
					
					BaseGuild.inst.AddWeeklyDonationReward(data.DONATION_REWARD_ID, donation_reward);					
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadGuildDonationReward!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;
