/********************************************************************
Title : PacketCommonData
Date : 2016.07.26
Update : 2017.04.07
Desc : 패킷 데이타 정의 - 공통
writer: jongwook
********************************************************************/
exports.UserInfo = function() {
	this.uuid;
	this.nick;
	this.user_level;
	this.user_icon;
	this.last_login_unix_time;
}

exports.Friend = function() {
	this.user_info;				// UserInfo
	this.is_take_stamina;
	this.send_stamina_unix_time;
	this.recv_stamina_unix_time;
}

exports.Item = function() {
	this.iuid;
	this.item_id;
	this.item_count;
}
exports.Gold = function() {
	this.total;
}
exports.Cash = function() {
	this.total;
}
exports.HonorPoint = function() {
	this.total;
}
exports.ChallengePoint = function() {
	this.total;
}
exports.AlliancePoint = function() {
	this.total;
}
exports.AccountExp = function() {
	this.account_exp;
	this.levelup;
}
exports.Levelup = function() {
	this.level;
	this.stamina;
	this.full_remain_time;
}
exports.Stamina = function() {
	this.stamina;
	this.full_remain_time;
}

exports.RewardBox = function() {
	this.gold;				// PacketCommonData.Gold
	this.cash;				// PacketCommonData.Cash
	this.honor_point;		// PacketCommonData.HonorPoint
	this.challenge_point;	// PacketCommonData.ChallengePoint
	this.alliance_point;	// PacketCommonData.AlliancePoint
	this.account_exp;		// PacketCommonData.AccountExp
	this.stamina;			// PacketCommonData.Stamina
	this.result_item_list = [];			// PacketCommonData.Item Array
	this.result_equipment_list = [];	// PacketCommonData.Equipment Array
}

exports.Wallet = function() {
	this.gold;
	this.cash;
	this.point_honor;
	this.point_challenge;
	this.point_alliance;
}

exports.TeamInfo = function() {
	this.team_id;
	this.hero_id_list = [];		// int array	
}

exports.RewardItem = function() {
	this.item_id;
	this.item_count;
}

exports.HeroBase = function () {
	this.hero_id;
	this.hero_level;
	this.hero_exp;
	this.reinforce_step;
	this.evolution_step;
	this.equip_set_count;
	this.battle_power;
}

exports.HeroLevelInfo = function() {
	this.hero_id;
	this.hero_exp;
	this.hero_level;
}

exports.HeroSkillInfo = function() {
	this.hero_id;
	this.skill_list = [];	// PacketCommonData.Skill
}

exports.HeroEvolutionInfo = function() {
	this.hero_id;
	this.evolution_step;
}

exports.HeroCombiBuff = function() {
	this.buff_id;
	this.buff_level;
}


exports.ChapterInfo = function() {
	this.chapter_id;
	this.take_reward_box_count;
}

exports.StageInfo = function() {
	this.chapter_id;
	this.stage_id;
	this.clear_grade;
	this.able_count;
}

exports.SweepRewardItemUI = function() {
	this.item_list = [];			// PacketCommomData.RewardItem
	this.equipment_list = [];		// PacketCommomData.RewardItem
}

exports.SweepRewardItem = function() {
	this.item_list = [];			// PacketCommomData.Item
	this.equipment_list = [];		// PacketCommonData.Equipment
}

exports.GachaResultInfo = function() {
	this.item_list = [];	// Item array
	this.hero_list = []; 	// int array
}

exports.GachaViewInfo = function() {
	this.item_list = []; 	// default item array
	this.hero_list = []; 	// int array
}

exports.GachaInfo = function() {
	this.gacha_id;
	this.daily_gacha_count;
	this.total_gacha_count;
	this.free_gacha_remain_time;
}

exports.DungeonGroupInfo = function() {
	this.dungeon_group_id;
	this.daily_remain_exec_count;
}
	
exports.DungeonInfo	= function() {
	this.dungeon_group_id;
	this.dungeon_id;
	this.clear_grade;
}
	
exports.ChallengeInfo = function() {
	this.dungeon_group_list = []; // DungeonGroupInfo
	this.dungeon_list = []; 	 // DungeonInfo
}

exports.MailReward = function() {
	this.reward_type;		// 0: ¾øA½, 1: ¾ÆAIAU, 2: Gold, 3: Cash, 4: HonorPoint, 5: AlliancePoint, 6: ChallengePoint
	this.reward_item_id;
	this.reward_count;
}

exports.MailReadInfo = function() {
	this.mail_id;
	this.read_yn;
}

exports.MailListInfo = function() {
	this.sender;
	this.mail_id;
	this.mail_string_id;
	this.mail_type;			// Text: AØ½ºÆ® ¿iÆi, Item: ¾ÆAIAU ¿iÆi, GM: GM ¿iÆi, System: ½A½ºAU ¿iÆi
	this.mail_icon_type;
	this.mail_icon_value;
	this.mail_icon_count;
	this.subject;
	this.reg_date;
	this.read_yn;
}

exports.AttendReward = function() {
	this.attend_accum_day;
	this.attend_day;
	this.gold;
	this.cash;
	this.point_honor;
	this.point_alliance;
	this.point_challenge;
	this.get_item;		// Item
}

exports.MatchPlayer = function() {
	this.uuid;
	this.user_level;
	this.user_nick;
	this.battle_power;
	this.user_icon;
	this.pvp_point;
	this.hero_list = []; 		// MatchHero Array
}

exports.MatchHero = function() {
	this.hero_id;
	this.hero_level;
	this.reinforce_step;
	this.evolution_step;
	this.slot_num;
}

exports.Skill = function() {
	this.skill_id;
	this.skill_level;
}

exports.MatchHeroEquipInfo = function() {
	this.hero_id;
	this.equip_item_list = [];	// PacketCommonData.EquipItem Array
}

exports.MatchHeroSkillInfo = function() {
	this.hero_id;
	this.skill_list = [];	// PacketCommonData.Skill Array
}

exports.RankUser = function() {
	this.uuid;
	this.user_level;
	this.user_nick;
	this.user_icon;
	this.pvp_point;
	this.battle_power;
	this.alliance_name;
}

exports.RankMatchRecord = function() {
	this.delta_rank;
	this.uuid;
	this.user_level;
	this.user_icon;
	this.user_nick;
	this.battle_date;
	this.battle_power;
	this.alliance_name;
}

exports.Summon = function() {
	this.summon_id;
	this.summon_level;
}

exports.SummonTrait = function() {
	this.trait_skill_id;
	this.trait_level;
	this.trait_exp;
}

exports.AccountBuff = function() {
	this.account_buff_id;
	this.account_buff_level;
}

exports.Mission = function() {
	this.mission_id;
	this.progress_count;
	this.is_rewarded;		// 보상 받은 상태(받았으면 true)
}

exports.Guild = function() {
	this.guild_id;
	this.guild_mark;
	this.guild_name;
	this.guild_level;
	this.guild_master_nick;
	this.guild_master_level;
	this.guild_limit_member;
	this.guild_current_member;
	this.guild_join_option;
}

exports.GuildDetailInfo = function() {
	this.guild_id;
	this.guild_mark;
	this.guild_name;
	this.guild_level;
	this.guild_notice;
	this.guild_limit_member;
	this.guild_current_member;
	this.guild_total_point;
	this.guild_create_date;
	this.guild_join_option;
	this.auto_master_change;
	this.elder_raid_open;
	this.prev_weekly_accum_guild_point;
	this.weekly_accum_guild_point;
}

exports.GuildMember = function() {
	this.uuid;
	this.user_icon;
	this.user_nick;
	this.user_last_connection_date;
	this.user_level;
	this.guild_member_auth;
	this.weekly_accum_donation_point;
	this.total_accum_donation_point;
}

exports.GuildJoinPendingApprovalUser = function() {
	this.uuid;
	this.user_icon;
	this.user_nick;
	this.user_level;
	this.vip_step;
	this.last_login_date;
}

exports.GuildRaidStageDamage = function() {
	this.nick_name;
	this.guild_raid_stage_id;
	this.attack_damage;
	this.damage_rank;
}

exports.GuildRaidChapterDamage = function() {
	this.nick_name;
	this.guild_raid_chapter_id;
	this.attack_damage;
	this.damage_rank;
}

exports.GuildRaidRank = function() {
	this.user_nick;
	this.user_level;
	this.user_icon;
	this.damage;
}

exports.GuildRaidChapterClearTime = function() {
	this.guild_id;
	this.guild_name;
	this.guild_mark;
	this.guild_level;
	this.clear_time;
	this.time_rank;
}

exports.GuildRaidStage = function() {
	this.stage_id;
	this.damage_recevied;
	this.chapter_id;
	this.clear_date;
}

exports.GuildRaidChapter = function() {
	this.chapter_id;
	this.open_date;
	this.clear_date;
	this.chapter_state;
	this.clear_stage_count;
}

exports.DonationRankUserInfo = function() {
	this.level;
	this.nick;
	this.weekly_accum_guild_point;
	this.total_accum_guild_point;
}

exports.GuildSkillInfo = function() {
	this.skill_id;
	this.skill_level;
}

exports.Equipment = function() {
	this.iuid;
	this.item_id;
	this.sub_option_id_list = [];	// int array	
	this.bind_hero_id;		// 보상일때는 안준다.
	this.item_level;		// 보상일때는 안준다.
	this.reinforce_step;	// 보상일때는 안준다.
	this.is_lock;			// 보상일때는 안준다.
}

exports.EquipSlot = function() {
	this.slot_id;	// 장착 슬롯 ID(0:None, 1:Weapon, 2:Body, 3:Pants, 4:Acc)
	this.iuid;		// 장착 장비 IUID
}

exports.EquipSet = function() {
	this.hero_id;
	this.equip_set_id;
	this.equip_slot_list = [];	// EquipSlot Array
}

exports.PvpRecord = function() {
	this.battle_result;
	this.user_level;
	this.user_icon;
	this.user_nick;
	this.battle_power;
	this.battle_date;
	this.earn_pvp_point;
	this.slot_info = [];
}