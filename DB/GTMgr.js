/********************************************************************
Title : GTMgr
Date : 2015.09.15
Update : 2016.08.03
Desc : GT 테이블정의

// sequelize options
 - type : data type
 - allowNull : is allow null. if allow is ture, then false.
 - unique : Unique value is true, then false
 - primaryKey : if use key 'true'
 - autoIncrement : auto filed value increment

writer: dongsu
********************************************************************/
var DefineValues = require('../Common/DefineValues.js');

(function(exports) {

	// private 변수
	var gt_version,
		gt_user,
	 	gt_hero,
	 	gt_hero_skill,
	 	gt_hero_combi_buff,
	 	gt_team,

	 	gt_senario_chapter,
	 	gt_senario_stage,

	 	gt_mail,
	 	gt_mail_reservation,
	 	gt_mail_reservation_user,

	 	gt_equipment_item,
	 	gt_inventory,
	 	gt_shop,
	 	gt_gacha,
		gt_attend,

	 	gt_daily_contents,
	 	gt_weekly_contents,
	 	gt_check_content,
	 	gt_mission,

	 	gt_account_buff,
	 	gt_guild,
	 	gt_guild_member,
	 	gt_guild_join_pending_approval,
	 	gt_guild_invitation,
	 	gt_guild_skill,

	 	gt_guild_raid,
	 	gt_guild_raid_participant,

		gt_pvp,
		gt_pvp_record, 	
	 	
	 	gt_infinity_tower_user,
	 	gt_infinity_tower_hero,
	 	gt_infinity_tower_battle_bot,
	 	gt_infinity_tower_battle_bot_hero,
	 	gt_infinity_tower_team,

	 	gt_friend,
	 	gt_friend_request,
	 	gt_dark_dungeon,
	 	gt_user_effect;

	// 외부에 공개할 public 객체. instance
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// writer : jongwook
	inst.DefineGameDataTable = function(sequelize) {
		logger.debug('============================ DefineGameDataTable ============================');
		
		gt_version = sequelize.define('GT_VERSION', {
			APP_VERSION	: { type: sequelize_module.STRING, allowNull: false, unique: true },
			DATA_VERSION: { type: sequelize_module.STRING, allowNull: false, unique: true },
			EXIST_YN	: { type:sequelize_module.BOOLEAN, allowNull: false, defaultValue: true },
			REG_DATE	: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// USER
		gt_user = sequelize.define('GT_USER', {
			UUID							: { type: sequelize_module.BIGINT, allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
			ACCOUNT							: { type: sequelize_module.STRING, allowNull: false, unique: true },
			NICK							: { type: sequelize_module.STRING, allowNull: true },
			ICON							: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 1 },
			USER_LEVEL						: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 1 },
			USER_EXP						: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			GOLD							: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			CASH							: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			POINT_HONOR						: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			POINT_ALLIANCE					: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			POINT_CHALLENGE					: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			SKILL_POINT						: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 20 },
			MAX_SKILL_POINT					: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 20 },
			LAST_SKILL_POINT_CHANGE_DATE	: { type: sequelize_module.DATE, allowNull: true, defaultValue: null },
			STAMINA							: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 20 },
			MAX_STAMINA						: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 20 },
			LAST_STAMINA_CHANGE_DATE		: { type: sequelize_module.DATE, allowNull: true, defaultValue: null },
			SUMMON_GAGE						: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 100 },
			LAST_LOGIN_DATE					: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') },
			VIP_STEP						: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			VIP_STEP_REWARD_LIST			: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			ACCUM_BUY_CASH					: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			ACCOUNT_BUFF_POINT				: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			MAX_EQUIP_ITEM_INVENTORY_SLOT	: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 100 },
			BUY_EQUIP_ITEM_INVENTORY_SLOT	: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			EXIST_YN						: { type:sequelize_module.BOOLEAN, allowNull: false, defaultValue: true },
			REG_DATE						: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// HERO
		gt_hero = sequelize.define('GT_HERO', {
			UUID			: { type: sequelize_module.BIGINT, allowNull: false },
			HERO_ID			: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_LEVEL		: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 1 },
			REINFORCE_STEP	: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 1 },
			EVOLUTION_STEP	: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 1 },
			EXP				: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			ARMY_SKILL_ID	: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			ARMY_SKILL_LEVEL: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 1 },
			ARMY_SKILL_SLOT	: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			EQUIP_SET_COUNT	: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 2 },
			EXIST_YN		: { type:sequelize_module.BOOLEAN, allowNull: false, defaultValue: true },
			REG_DATE		: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_hero_skill = sequelize.define('GT_HERO_SKILL', {
			UUID		: { type: sequelize_module.BIGINT, allowNull: false },
			HERO_ID		: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID	: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 1 },
			SKILL_LEVEL	: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 1 },
			EXIST_YN	: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true },
			REG_DATE	: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_hero_combi_buff = sequelize.define('GT_HERO_COMBI_BUFF', {
			UUID		: { type: sequelize_module.BIGINT, allowNull: false },
			BUFF_ID		: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			BUFF_LEVEL	: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			EXIST_YN	: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true },
			REG_DATE	: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// TEAM
		gt_team = sequelize.define('GT_TEAM', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, TEAM_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 1 }
			, SLOT1: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SLOT2: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SLOT3: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SLOT4: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, BATTLE_POWER: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// SENARIO CHAPTER, STAGE
		gt_senario_chapter = sequelize.define('GT_CHAPTER', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, CHAPTER_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, TAKE_REWARD_BOX_COUNT : { type: sequelize_module.INTEGER, allowNull: false, defaultValue : 0 }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_senario_stage = sequelize.define('GT_STAGE', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, CHAPTER_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, CHAPTER_TYPE: { type: sequelize_module.INTEGER, allowNull: false }
			, STAGE_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, CLEAR_GRADE : { type: sequelize_module.INTEGER, allowNull: false, defaultValue : 1 }
			, ABLE_COUNT : { type: sequelize_module.INTEGER, allowNull: false, defaultValue : 3 }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// MAIL
		gt_mail = sequelize.define('GT_MAIL', {
			  MAIL_ID:					{ type: sequelize_module.BIGINT, allowNull:false, unique:true, primaryKey:true, autoIncrement:true }
			, UUID:						{ type: sequelize_module.BIGINT, allowNull: false }
			, MAIL_SENDER:				{ type: sequelize_module.BIGINT, allowNull: false, defaultValue: 0 }
			, MAIL_TYPE:				{ type: sequelize_module.STRING, allowNull: false, defaultValue: 'Text' }
			, MAIL_ICON_TYPE:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, MAIL_ICON_ITEM_ID:		{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, MAIL_ICON_COUNT:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, MAIL_STRING_ID:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, MAIL_STRING_VALUE_LIST:	{ type: sequelize_module.STRING, allowNull: true, defaultValue: null }
			, MAIL_SUBJECT:				{ type: sequelize_module.STRING, allowNull: true, defaultValue: null }
			, MAIL_CONTENTS:			{ type: sequelize_module.STRING(1024), allowNull: true, defaultValue: null }
			, MAIL_READ_YN:				{ type: sequelize_module.BOOLEAN, allowNull: false, defaultValue: false }
			, MAIL_READ_DATE:			{ type: sequelize_module.DATE, allowNull: true, defaultValue: null }
			, REWARD1_TYPE:				{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD1_ITEM_ID:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD1_COUNT:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD2_TYPE:				{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD2_ITEM_ID:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD2_COUNT:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD3_TYPE:				{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD3_ITEM_ID:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD3_COUNT:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD4_TYPE:				{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD4_ITEM_ID:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD4_COUNT:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD5_TYPE:				{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD5_ITEM_ID:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD5_COUNT:			{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, EXIST_YN:					{ type: sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE:					{ type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_mail_reservation = sequelize.define('GT_MAIL_RESERVATION', {
			  RESERVATION_ID:	{ type: sequelize_module.BIGINT, allowNull:false, unique:true, primaryKey:true, autoIncrement:true }
			, MAIL_SEND_YN:		{ type: sequelize_module.BOOLEAN, allowNull: false, defaultValue: false }
			, RESERVATION_DATE: { type: sequelize_module.DATE, allowNull: true, defaultValue: null }
			, RECV_TYPE:		{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }	// 0 : 전체, 1 : 특정유저
			, MAIL_SENDER:		{ type: sequelize_module.BIGINT, allowNull: false, defaultValue: 0 }
			, MAIL_TYPE:		{ type: sequelize_module.STRING, allowNull: false, defaultValue: 'Text' }
			, MAIL_SUBJECT:		{ type: sequelize_module.STRING, allowNull: true, defaultValue: null }
			, MAIL_CONTENTS:	{ type: sequelize_module.STRING(1024), allowNull: true, defaultValue: null }
			, REWARD1_TYPE:		{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD1_ITEM_ID:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD1_COUNT:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD2_TYPE:		{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD2_ITEM_ID:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD2_COUNT:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD3_TYPE:		{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD3_ITEM_ID:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD3_COUNT:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD4_TYPE:		{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD4_ITEM_ID:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD4_COUNT:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD5_TYPE:		{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD5_ITEM_ID:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD5_COUNT:	{ type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, EXIST_YN:			{ type: sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE:			{ type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

	 	gt_mail_reservation_user = sequelize.define('GT_MAIL_RESERVATION_USER', {
			  RESERVATION_ID: { type: sequelize_module.BIGINT, allowNull: false }
			, UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// ITEM - EQUIPMENT
		gt_equipment_item = sequelize.define('GT_EQUIPMENT_ITEM', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, HERO_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SLOT_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, IUID_1: { type: sequelize_module.BIGINT, allowNull: false, defaultValue: 0 }
			, IUID_2: { type: sequelize_module.BIGINT, allowNull: false, defaultValue: 0 }
			, IUID_3: { type: sequelize_module.BIGINT, allowNull: false, defaultValue: 0 }
			, IUID_4: { type: sequelize_module.BIGINT, allowNull: false, defaultValue: 0 }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		// INVENTORY
		gt_inventory = sequelize.define('GT_INVENTORY', {
			IUID: { type: sequelize_module.BIGINT, allowNull:false, unique:true, primaryKey:true, autoIncrement:true }
			, UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, ITEM_ID: { type: sequelize_module.BIGINT, allowNull:false }
			, ITEM_COUNT: { type: sequelize_module.INTEGER, allowNull: false }
			// Begin - Equipment
			, CATEGORY1: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, BIND_HERO_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, ITEM_LEVEL: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 1 }
			, REINFORCE_STEP: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SUB_OPTION_ID_1: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SUB_OPTION_ID_2: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SUB_OPTION_ID_3: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SUB_OPTION_ID_4: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SUB_OPTION_ID_5: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SUB_OPTION_ID_6: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, IS_LOCK: { type: sequelize_module.BOOLEAN, allowNull: true, defaultValue: false }
			// End - Equipment
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// SHOP
		gt_shop = sequelize.define('GT_SHOP', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false, unique: true, primaryKey: true }
			, SHOP_NORMAL_ID: { type: sequelize_module.BIGINT, allowNull:false, defaultValue: 0 }
			, SHOP_PVP_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SHOP_GUILD_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SHOP_CHALLENGE_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SHOP_RANDOM_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, SHOP_RESET_TIME_ID : { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, RANDOM_SHOP_OPEN_TIME: { type: sequelize_module.DATE, allowNull: true, defaultValue: null }
			, EXIST_YN:{ type: sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });
		
		//------------------------------------------------------------------------------------------------------------------
		// VIP
		gt_gacha = sequelize.define('GT_GACHA', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, GACHA_ID: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, DAILY_GACHA_COUNT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, TOTAL_GACHA_COUNT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, LAST_GACHA_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, EXIST_YN:{ type: sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// ATTEND
		gt_attend = sequelize.define('GT_ATTEND', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, YEAR: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, MONTH: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, ACCUM_ATTEND_DATE: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, ADD_ATTEND_DATE: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, LAST_ATTEND_DATE: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, ACCUM_ATTEND_REWARD_LIST: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// PVP
		gt_pvp = sequelize.define('GT_PVP', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, PVP_ELO: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 1000 }
			, ATTACK_ELL: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 1000 }
			, DEPENSE_ELL: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 1000 }
			, MAX_LEAGUE_ID: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 1 } // 기본 리그 브론즈는 1
			, GAIN_ACHIEVEMENT_REWARD: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 1 } // 리그 달성 보상. - 기본 리그 브론즈는 1
			, LEAGUE_ID: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 1 } // 기본 리그 브론즈는 1
			, GROUP_ID: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, ABLE_PLAY_COUNT: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 10 }
			, LATELY_PLAY_COUNT_CHARGE_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, WEEK_PVP_WIN_COUNT			: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, WEEK_PVP_LOSE_COUNT			: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_pvp_record = sequelize.define('GT_PVP_RECORD', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, BATTLE_RESULT: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, DELTA_POINT: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_NICK: { type: sequelize_module.STRING, allowNull: true }
			, TARGET_USER_LEVEL: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_ICON: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_BATTLE_POWER: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT1_HERO_ID: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT1_HERO_LEVEL: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT1_HERO_REINFORCE_STEP: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT1_HERO_EVOLUTION_STEP: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT2_HERO_ID: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT2_HERO_LEVEL: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT2_HERO_REINFORCE_STEP: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT2_HERO_EVOLUTION_STEP: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT3_HERO_ID: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT3_HERO_LEVEL: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT3_HERO_REINFORCE_STEP: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT3_HERO_EVOLUTION_STEP: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT4_HERO_ID: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT4_HERO_LEVEL: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT4_HERO_REINFORCE_STEP: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, TARGET_HERO_SLOT4_HERO_EVOLUTION_STEP: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// DAILY - TODO : 모두 차감방식으로 변경 해야 한다.
		gt_daily_contents = sequelize.define('GT_DAILY_CONTENTS', {
			UUID								: { type: sequelize_module.BIGINT, allowNull: false },
			BUY_STAMINA_COUNT					: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			BUY_GOLD_COUNT						: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			BUY_ADD_ATTEND_COUNT				: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			EXEC_WEEKLY_DUNGEON_PLAY_COUNT		: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			SHOP_RESET_COUNT					: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			GUILD_POINT_DONATION_COUNT			: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 2 },
			LATELY_FREE_DONATION_TIME 				: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') },
			GUILD_RAID_BATTLE_COUNT				: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 2 },
			FRIEND_REQUEST_COUNT				: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: DefineValues.inst.FriendOneDayRequestCount },
			FRIEND_DELETE_COUNT					: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: DefineValues.inst.Friend_DeleteMax },
			PVP_GAIN_HONOR_POINT					: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			PVP_PLAY_COUNT						: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			EXIST_YN							: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true },
			REG_DATE							: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_weekly_contents = sequelize.define('GT_WEEKLY_CONTENTS', {
			UUID					: { type: sequelize_module.BIGINT, allowNull: false },
			TAKE_DONATION_REWARD 	: { type: sequelize_module.BOOLEAN, allowNull: false, defaultValue : false },
			EXIST_YN				: { type: sequelize_module.BOOLEAN, allowNull: true, defaultValue: true },
			REG_DATE				: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });
		
		gt_check_content = sequelize.define('GT_CHECK_CONTENT', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// ACCOUNT BUFF
		gt_account_buff = sequelize.define('GT_ACCOUNT_BUFF', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, ACCOUNT_BUFF_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, ACCOUNT_BUFF_LEVEL: { type: sequelize_module.INTEGER, allowNull: true, defaultValue: 0 }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });
	
		//------------------------------------------------------------------------------------------------------------------
		//  MISSION
		gt_mission = sequelize.define('GT_MISSION', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, MISSION_ID: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, MISSION_TYPE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, MISSION_GROUP_ID: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, START_MISSION_ID: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_MISSION_ID: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, PROGRESS_COUNT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, LAST_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		//  GUILD
		gt_guild = sequelize.define('GT_GUILD', {
			  GUILD_ID: { type: sequelize_module.INTEGER, allowNull: false, unique: true, primaryKey: true, autoIncrement: true }
			, GUILD_NAME: { type: sequelize_module.STRING, allowNull: false }
			, GUILD_MARK: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, GUILD_NOTICE: { type: sequelize_module.STRING, allowNull:true }
			, GUILD_LEVEL: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 1 }
			, JOIN_OPTION: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 1 } // 1 : 자유가입, 2 : 승인가입, 3 : 가입불가.
			, GUILD_POINT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, AUTO_MASTER_CHANGE: { type:sequelize_module.BOOLEAN, allowNull: false, defaultValue: true }
			, ELDER_RAID_OPEN: { type:sequelize_module.BOOLEAN, allowNull: false, defaultValue: true }
			, PREV_WEEKLY_ACCUM_GUILD_POINT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, WEEKLY_ACCUM_GUILD_POINT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, GUILD_STATES: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, MAX_CLEAR_RAID_CHAPTER: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, MAX_CLEAR_RAID_DATE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 } // Delta Unix Time
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_guild_member = sequelize.define('GT_GUILD_MEMBER', {
			  UUID							: { type: sequelize_module.BIGINT, allowNull: false }
			, GUILD_ID						: { type: sequelize_module.INTEGER, allowNull: false }
			, PREV_GUILD_AUTH				: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 } // 0 : 기본 값, 1 : 길드장, 2 : 장로, 3 : 일반.
			, GUILD_AUTH					: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 3 } // 1 : 길드장, 2 : 장로, 3 : 일반.			
			, JOIN_STATES					: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, WEEKLY_ACCUM_DONATION_POINT	: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 } // 주간 누적 기부 포인트
			, TOTAL_ACCUM_DONATION_POINT	: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 } // 총 누적 기부 포인트
			, CONTRIBUTION					: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 } // 기여도.
			, JOIN_DATE						: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, EXIST_YN						: { type: sequelize_module.BOOLEAN, allowNull: false, defaultValue: true }
			, REG_DATE						: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_guild_join_pending_approval = sequelize.define('GT_GUILD_JOIN_PENDING_APPROVAL', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, GUILD_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, APPROVAL_STATES: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0} // 0 : 승인 대기. 1 : 승인, 2 : 거부.
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_guild_invitation = sequelize.define('GT_GUILD_INVITATION', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, GUILD_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, INVITE_STATES: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true } // true : 응답 대기, false : 응답 완료.
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_guild_raid = sequelize.define('GT_GUILD_RAID', {
			  GUILD_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, CHAPTER_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, PROGRESS_STAGE_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, PROGRESS_STAGE_BOSS_HP: { type: sequelize_module.INTEGER, allowNull: false }
			, OPEN_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, RAID_STATE: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });
	 	
	 	gt_guild_raid_participant = sequelize.define('GT_GUILD_RAID_PARTICIPANT', {
			  GUILD_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, CHAPTER_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, STAGE_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, UUID: { type: sequelize_module.INTEGER, allowNull: false }
			, DAMAGE: { type: sequelize_module.INTEGER, allowNull: false }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_guild_skill = sequelize.define('GT_GUILD_SKILL', {
			  GUILD_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, SKILL_ID: { type: sequelize_module.INTEGER, allowNull: false }
			, SKILL_LEVEL: { type: sequelize_module.INTEGER, allowNull: false }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		//  INFINITY TOWER
		gt_infinity_tower_user = sequelize.define('GT_INFINITY_TOWER_USER', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false, defaultValue: 0 }
			, BOT_RANK_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, TODAY_TICKET: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, TODAY_SCORE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, ACCUM_SCORE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, LAST_RANK: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 30000 }
			, TODAY_RANK_SCORE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, LAST_RANK_SCORE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, TODAY_FLOOR: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, LAST_FLOOR: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, BEST_FLOOR: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, LAST_BATTLE_SCORE_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, SCORE_REWARD_ID_LIST: { type: sequelize_module.STRING, allowNull:true, defaultValue: null }
			, SKIP_POINT: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, ALL_CLEAR: { type: sequelize_module.BOOLEAN, allowNull: false, defaultValue: false }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, LAST_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_infinity_tower_floor = sequelize.define('GT_INFINITY_TOWER_FLOOR', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, FLOOR: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, FLOOR_TYPE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, BATTLE_TYPE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, BATTLE_CLEAR_GRADE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_TICKET: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_SCORE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, CHALLENGE_POINT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, BUFF_ID_1: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, BUFF_ID_2: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, BUFF_ID_3: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, BUY_BUFF_ID_1: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, BUY_BUFF_ID_2: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, BUY_BUFF_ID_3: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_TYPE_1: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_ITEM_ID_1: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_COUNT_1: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REWARD_TYPE_2: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_ITEM_ID_2: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_COUNT_2: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_TYPE_3: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_ITEM_ID_3: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REWARD_COUNT_3: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, IS_REWARD_BOX_OPEN: { type: sequelize_module.BOOLEAN, allowNull: false, defaultValue: false }
			, CASH_REWARD_BOX_COUNT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, MAX_CASH_REWARD_BOX_COUNT: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 10 }
			, SECRET_MAZE_TYPE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, SECRET_MAZE_BATTLE_ID: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, IS_SECRET_MAZE_ENTRANCE: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: false }
			, IS_SECRET_MAZE_RESET: { type: sequelize_module.BOOLEAN, allowNull: false, defaultValue: false }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull: false, defaultValue: true }
			, LAST_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_infinity_tower_hero = sequelize.define('GT_INFINITY_TOWER_HERO', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, HERO_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, REINFORCE_STEP: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 1 }
			, EVOLUTION_STEP: { type:sequelize_module.INTEGER, allowNull: false, defaultValue: 1 }
			, HP: { type: sequelize_module.FLOAT, allowNull:false, defaultValue: 0 }
			// , SKILL_GAUGE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			// , TAG_GAUGE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			// , SUPPORT_GAUGE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, LAST_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });
		
		gt_infinity_tower_battle_bot = sequelize.define('GT_INFINITY_TOWER_BATTLE_BOT', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, ICON_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, BOT_NAME: { type: sequelize_module.STRING, allowNull:true, defaultValue: null }
			, BOT_RANK: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, LAST_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_infinity_tower_battle_bot_hero = sequelize.define('GT_INFINITY_TOWER_BATTLE_BOT_HERO', {
			  UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, HERO_TYPE: { type: sequelize_module.ENUM('BASE', 'TAG'), allowNull: false, defaultValue: 'BASE' }
			, HERO_ID: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 }
			, HERO_LEVEL: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, REINFORCE_STEP: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, EVOLUTION_STEP: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, HP: { type: sequelize_module.FLOAT, allowNull:false, defaultValue: 0 }
			// , SKILL_GAUGE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			// , TAG_GAUGE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			// , SUPPORT_GAUGE: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, SLOT_NUM: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, EXIST_YN: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: true }
			, LAST_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_infinity_tower_team = sequelize.define('GT_INFINITY_TOWER_TEAM', {
			UUID: { type: sequelize_module.BIGINT, allowNull: false }
			, HERO_ID1: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, HERO_ID2: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, HERO_ID3: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, HERO_ID4: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 }
			, EXIST_YN: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
			, REG_DATE: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// FRIEND
		gt_friend = sequelize.define('GT_FRIEND', {
			UUID				: { type: sequelize_module.BIGINT, allowNull: false },
			FRIEND_UUID			: { type: sequelize_module.BIGINT, allowNull: false },
			SEND_STAMINA_DATE	: { type: sequelize_module.DATE, allowNull: true, defaultValue: null },
			RECV_STAMINA_DATE	: { type: sequelize_module.DATE, allowNull: true, defaultValue: null },
			IS_TAKE_STAMINA		: { type: sequelize_module.BOOLEAN, allowNull:false, defaultValue: false },
			UPDATE_DATE			: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') },
			EXIST_YN			: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true },
			REG_DATE			: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		gt_friend_request = sequelize.define('GT_FRIEND_REQUEST', {
			UUID			: { type: sequelize_module.BIGINT, allowNull: false },
			REQUEST_UUID	: { type: sequelize_module.BIGINT, allowNull: false },
			UPDATE_DATE		: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') },
			EXIST_YN		: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true },
			REG_DATE		: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// DARD DUNGEON
		gt_dark_dungeon = sequelize.define('GT_DARK_DUNGEON', {
			UUID				: { type: sequelize_module.BIGINT, allowNull: false },
			CHAPTER_ID			: { type: sequelize_module.BIGINT, allowNull: false },
			CURR_STAGE_ID		: { type: sequelize_module.BIGINT, allowNull: false },
			STATE				: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			START_TIME			: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') },
			STAGE_DROP_ITEM_ID1	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID2	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID3	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID4	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID5	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID6	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID7	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID8	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID9	: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			STAGE_DROP_ITEM_ID10: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			UPDATE_DATE			: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') },
			REG_DATE			: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') },
			EXIST_YN			: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
		}, { timestamps: false });

		//------------------------------------------------------------------------------------------------------------------
		// DARD DUNGEON
		gt_user_effect = sequelize.define('GT_USER_EFFECT', {
			UUID				: { type: sequelize_module.BIGINT, allowNull: false },
			EFFECT_ID			: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			EFFECT_LEVEL		: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			EFFECT_CALL			: { type: sequelize_module.ENUM('GUILD', 'ACCOUNT'), allowNull: false, defaultValue: 'GUILD' },
			EFFECT_TYPE			: { type: sequelize_module.STRING(256), allowNull: true, defaultValue: null },
			VALUE1				: { type: sequelize_module.INTEGER, allowNull: false, defaultValue: 0 },
			VALUE2				: { type: sequelize_module.INTEGER, allowNull:false, defaultValue: 0 },
			START_TIME			: { type: sequelize_module.DATE, allowNull: true, defaultValue: null },
			END_TIME			: { type: sequelize_module.DATE, allowNull: true, defaultValue: null },
			REG_DATE			: { type: sequelize_module.DATE, allowNull: false, defaultValue: sequelize_module.fn('now') },
			EXIST_YN			: { type:sequelize_module.BOOLEAN, allowNull: true, defaultValue: true }
		}, { timestamps: false });
	}
	//------------------------------------------------------------------------------------------------------------------
	inst.AsyncGameDataTable = function(sequelize) {
		logger.debug('***** GTMgr AsyncGameDataTable *****');

		SequelizeAsync(sequelize, gt_version, null);
		SequelizeAsync(sequelize, gt_hero, null);
		SequelizeAsync(sequelize, gt_hero_skill, null);
		SequelizeAsync(sequelize, gt_hero_combi_buff, null);
		
		SequelizeAsync(sequelize, gt_team, null);
		SequelizeAsync(sequelize, gt_senario_chapter, null);
		SequelizeAsync(sequelize, gt_senario_stage, null);
		SequelizeAsync(sequelize, gt_user, null);
		SequelizeAsync(sequelize, gt_equipment_item, null);
		SequelizeAsync(sequelize, gt_inventory, null);
		SequelizeAsync(sequelize, gt_shop, null);
		SequelizeAsync(sequelize, gt_gacha, null);
		SequelizeAsync(sequelize, gt_mail, null);
		SequelizeAsync(sequelize, gt_mail_reservation, null);
		SequelizeAsync(sequelize, gt_mail_reservation_user, null);
		SequelizeAsync(sequelize, gt_mail, null);
		SequelizeAsync(sequelize, gt_attend, null);

		SequelizeAsync(sequelize, gt_pvp, null);
		SequelizeAsync(sequelize, gt_pvp_record, null);
		
		SequelizeAsync(sequelize, gt_account_buff, null);
		SequelizeAsync(sequelize, gt_mission, null); 
		SequelizeAsync(sequelize, gt_check_content, null); 
		SequelizeAsync(sequelize, gt_guild, null);
		SequelizeAsync(sequelize, gt_guild_member, null);
		SequelizeAsync(sequelize, gt_guild_join_pending_approval, null);
		SequelizeAsync(sequelize, gt_guild_invitation, null);
		SequelizeAsync(sequelize, gt_guild_skill, null);

		SequelizeAsync(sequelize, gt_guild_raid, null);
		SequelizeAsync(sequelize, gt_guild_raid_participant, null);

		SequelizeAsync(sequelize, gt_infinity_tower_user, null);
		SequelizeAsync(sequelize, gt_infinity_tower_floor, null);
		SequelizeAsync(sequelize, gt_infinity_tower_hero, null);
		SequelizeAsync(sequelize, gt_infinity_tower_battle_bot_hero, null);
		SequelizeAsync(sequelize, gt_infinity_tower_battle_bot, null);
		SequelizeAsync(sequelize, gt_infinity_tower_team , null);
		SequelizeAsync(sequelize, gt_daily_contents, null);
		SequelizeAsync(sequelize, gt_weekly_contents, null);

		SequelizeAsync(sequelize, gt_friend, null);
		SequelizeAsync(sequelize, gt_friend_request, null);

		SequelizeAsync(sequelize, gt_dark_dungeon, null);

		SequelizeAsync(sequelize, gt_user_effect, null);
	}

	//------------------------------------------------------------------------------------------------------------------
	SequelizeAsync = function(sequelize, obj, callback) {
		logger.debug('***** GTMgr SequelizeAsync - %s *****', obj.name);
		// console.log('obj - ', obj.name);
		obj.count()
		.error(function (error) {
			// logger.debug(error.code);
			if ( error.code == 'ER_NO_SUCH_TABLE' ) {
				obj.sync({ froce: false })
				.success(function() {
					if (callback !== null)
						callback();
				});
			}
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	inst.GetGTVersion			= function() { return gt_version; }
	inst.GetGTUser			= function() { return gt_user; }
	inst.GetGTHero			= function() { return gt_hero; }
	inst.GetGTTeam			= function() { return gt_team; }

	inst.GetGTEquipmentItem		= function() { return gt_equipment_item; }
	inst.GetGTInventory			= function() { return gt_inventory; }
	inst.GetGTShop			= function() { return gt_shop; }
	inst.GetGTHeroSkill			= function() { return gt_hero_skill; }
	inst.GetGTHeroCombiBuff		= function() { return gt_hero_combi_buff; }
	
	inst.GetGTChapter			= function() { return gt_senario_chapter; }
	inst.GetGTStage			= function() { return gt_senario_stage; }

	inst.GetGTMail			= function() { return gt_mail; }
	inst.GetGTMailReservation		= function() { return gt_mail_reservation; }
	inst.GetGTMailReservationUser	= function() { return gt_mail_reservation_user; }

	inst.GetGTAttend			= function() { return gt_attend; }
	
	inst.GetGTDailyContents		= function() { return gt_daily_contents; }
	inst.GetGTWeeklyContents		= function() { return gt_weekly_contents; }
	inst.GetGTCheckContent		= function() { return gt_check_content; }

	inst.GetGTPVP 			= function() { return gt_pvp; }
	inst.GetGTPVPRecord		= function() { return gt_pvp_record; }
	
	inst.GetGTAccountBuff		= function() { return gt_account_buff; }
	inst.GetGTMission			= function() { return gt_mission; }
	
	inst.GetGTGuild			= function() { return gt_guild; }
	inst.GetGTGuildMember		= function() { return gt_guild_member; }
	inst.GetGTGuildSkill 			= function() { return gt_guild_skill; }

	inst.GetGTGuildRaid 			= function() { return gt_guild_raid; }
	inst.GetGTGuildRaidParicipant	= function() { return gt_guild_raid_participant; }

	inst.GetGTGuildJoinPendingApproval	= function() { return gt_guild_join_pending_approval; }
	inst.GetGTGuildInvitation			= function() { return gt_guild_invitation; }
	inst.GetGTInfinityTowerUser			= function() { return gt_infinity_tower_user; }
	inst.GetGTInfinityTowerFloor			= function() { return gt_infinity_tower_floor; }
	inst.GetGTInfinityTowerHero			= function() { return gt_infinity_tower_hero; }
	inst.GetGTInfinityTowerBattleBotHero 	= function() { return gt_infinity_tower_battle_bot_hero; }
	inst.GetGTInfinityTowerBattleBot		= function() { return gt_infinity_tower_battle_bot; }
	inst.GetGTInfinityTowerTeam		= function() { return gt_infinity_tower_team ; }

	inst.GetGTGacha = function() { return gt_gacha; }

	inst.GetGTFriend = function() { return gt_friend; }
	inst.GetGTFriendRequest = function() { return gt_friend_request; }

	inst.GetGTDarkDungeon = function() { return gt_dark_dungeon; }
	
	inst.GetGTUserEffect = function() { return gt_user_effect; }	

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;