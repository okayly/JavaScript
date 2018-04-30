/********************************************************************
Title : BaseGuild
Date : 2016.06.13
Writer : dongsu
Desc : BT 정보 - Guild
		길드 정보, 기부
********************************************************************/

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 길드 정보
	inst.GuildInfo = function() {
		this.guild_level;
		this.need_guild_point; // 레업 필요 길드 포인트
		this.max_member_count;
		this.open_guild_contents;
		this.open_guild_raid;
		this.open_guild_skill;
		this.open_cost;
		this.cost_level; 
	}

	var GuildSkillCostInfo = function() {
		this.open_cost;
		this.cost_level;
	}

	var max_guild_level = 0;
	var guild_info_map = new HashMap(); // key : level, value : GuildInfo()
	var guild_skill_map = new HashMap(); // key : skill_id, open_cost

	inst.AddGuildInfo = function(p_guild_level, p_guild) {
		if (guild_info_map.has(p_guild_level) == false) {
			guild_info_map.set(p_guild_level, p_guild);
			// console.log('guild_level: %d, guild_info:', p_guild_level, p_guild);

			if (p_guild_level > max_guild_level)
				max_guild_level = p_guild_level;

			// skill info
			if ( p_guild.open_guild_skill != 0 ) {
				var temp_skill_cost = new GuildSkillCostInfo();
				temp_skill_cost.open_cost = p_guild.open_cost;
				temp_skill_cost.cost_level = p_guild.cost_level;

				guild_skill_map.set(p_guild.open_guild_skill, temp_skill_cost);
			}
		}
	}

	inst.GetGuildInfo = function(p_guild_level) {
		return guild_info_map.has(p_guild_level) ? guild_info_map.get(p_guild_level) : undefined;
	}

	inst.GetSkillCost = function(p_guild_id) {
		return guild_skill_map.has(p_guild_id) ? guild_skill_map.get(p_guild_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 포인트 기부
	inst.GuildDonation = function() {
		this.donation_id;
		this.need_gold;
		this.need_cash;
		this.guild_point;
		this.alliance_point;
	}

	var guild_donation_map = new HashMap();

	inst.AddGuildDonation = function(p_donation_id, p_donation) {
		if (guild_donation_map.has(p_donation_id) == false) {
			guild_donation_map.set(p_donation_id, p_donation);
			// console.log('donation_id: %d, donation:', p_donation_id, p_donation);
		}
	}

	inst.GetGuildDonation = function(p_donation_id) {
		return (guild_donation_map.has(p_donation_id) == true) ? guild_donation_map.get(p_donation_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레이드 챕터, 스테이지
	inst.GuildRaidChapter = function() {
		this.chapter_id;
		this.chapter_open_cost;

		this.stage_list = [];
	}

	var last_stage_id;
	var guild_raid_chapter_map = new HashMap();

	inst.AddGuildRaidChapter = function(p_chapter_id, p_chapter) {
		if (guild_raid_chapter_map.has(p_chapter_id) == false) {
			guild_raid_chapter_map.set(p_chapter_id, p_chapter);
			// console.log('chapter_id: %d, chapter:', p_chapter_id, p_chapter);
		}
	}
	inst.GetGuildRaidChapter = function(p_chapter_id) {
		return (guild_raid_chapter_map.has(p_chapter_id) == true) ? guild_raid_chapter_map.get(p_chapter_id) : undefined;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레이드 스테이지 보상
	var Reward = function() {
		this.reward_type;
		this.reward_item_id;
		this.reward_count;
	}

	inst.RankReward = function() {
		this.reward_id;
		this.mail_string_id;
		this.reward_group_id;
		this.rank_min;
		this.rank_max;
		this.reward_list = [];

		this.AddReward = function(p_reward_type, p_reward_item_id, p_reward_count) {
			var reward = new Reward();
			reward.reward_type = p_reward_type;
			reward.reward_item_id = p_reward_item_id;
			reward.reward_count = p_reward_count;

			this.reward_list.push(reward);
		}
	}

	var guild_raid_stage_rank_reward = new HashMap();
	var guild_raid_chapter_rank_reward = new HashMap();

	inst.AddStageRankReward = function(p_reward_id, p_rank_reward) {
		if (guild_raid_stage_rank_reward.has(p_reward_id) == false) {
			guild_raid_stage_rank_reward.set(p_reward_id, p_rank_reward);
			// console.log('AddStageRankReward %d', p_reward_id, p_rank_reward);
		}
	}
	inst.GetStageRankReward = function(p_group_id, p_rank) {
		var rank_reward = undefined;
		guild_raid_stage_rank_reward.forEach(function(value, key) {
			if (value.reward_group_id == p_group_id && value.rank_min <= p_rank && value.rank_max >= p_rank)
				rank_reward = value;
		});

		return rank_reward;
	}
	inst.AddChapterRankReward = function(p_reward_id, p_rank_reward) {
		if (guild_raid_chapter_rank_reward.has(p_reward_id) == false) {
			guild_raid_chapter_rank_reward.set(p_reward_id, p_rank_reward);
			// console.log('reward_id: %d, rank_reward:', p_reward_id, p_rank_reward);
		}
	}
	inst.GetChapterRankReward = function(p_group_id, p_rank) {
		var rank_reward = undefined;
		guild_raid_chapter_rank_reward.forEach(function(value, key) {
			if (value.reward_group_id == p_group_id && value.rank_min <= p_rank && value.rank_max >= p_rank)
				rank_reward = value;
		});
		return rank_reward;
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 기부 보상.
	inst.DonationRewardInfo = function () {
		this.donation_reward_id;
		this.donation_standard_point;
		this.guild_reward_point;
		this.reward_list = [];

		this.AddReward = function(p_reward_type, p_reward_item_id, p_reward_count) {
			var reward = new Reward();
			reward.reward_type = p_reward_type;
			reward.reward_item_id = p_reward_item_id;
			reward.reward_count = p_reward_count;

			this.reward_list.push(reward);
		}
	}

	var weekly_donation_reward = new HashMap();
	inst.AddWeeklyDonationReward = function(p_donation_reward_id, p_reward) {
		if (weekly_donation_reward.has(p_donation_reward_id) == false) {
			weekly_donation_reward.set(p_donation_reward_id, p_reward);
			// console.log('AddWeeklyDonationReward %d', p_donation_reward_id, p_reward);
		}
	}
	inst.GetWeeklyDonationReward = function(p_accum_point) {
		var reward_info = undefined;
		weekly_donation_reward.forEach(function(value, key) {
			if ( value.donation_standard_point < p_accum_point ) {
				reward_info = value;
			}
		});

		return reward_info;
	}
	//------------------------------------------------------------------------------------------------------------------

	exports.inst = inst;

})(exports || global);
(exports || global).inst;