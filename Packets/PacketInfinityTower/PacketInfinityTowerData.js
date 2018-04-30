/********************************************************************
Title : PacketInfinityTowerData
Date : 2016.04.01
Updsate : 2017.03.23
Desc : 패킷 정의 - 탑
writer : jongwook
********************************************************************/
exports.InfinityTowerHero = function() {	
	this.hero_id;
	this.hero_hp;
	this.hero_skill_gauge;
	this.hero_tag_gauge;
	this.hero_support_gauge;
}
exports.InfinityTowerBuff = function() {
	this.floor;
	this.buff_list = [];		// int array
	this.buy_buff_list = [];	// int array
}
exports.InfinityTowerBattleClear = function() {
	this.floor;
	this.battle_type;
	this.clear_grade;
}
exports.InfinityTowerBattleBot = function() {
	this.icon_id;
	this.bot_name;
	this.bot_rank;
}
exports.InfinityTowerBattleBotHero = function() {
	this.hero_id;
	this.hero_level;
	this.promotion_step;
	this.evolution_step;
	this.hero_hp;
	this.hero_skill_gauge;
	this.hero_tag_gauge;
	this.hero_support_gauge;
	this.slot_num;
}
exports.InfinityTowerUser = function() {
	this.uuid;
	this.bot_rank_id;
	this.user_level;
	this.user_nick;
	this.user_rank;
	this.user_icon;
	this.alliance_name;
	this.max_floor;	
	this.battle_score;	
}


exports.ReqInfinityTowerUser = function() {
	this.packet_srl;
}
exports.AckInfinityTowerUser = function() {
	this.packet_srl;
	this.result;
	this.floor;
	this.rank;
	this.ticket;
	this.daily_score;
	this.accum_score;
	this.accum_score_reward_id_list = [];
	this.past_floor;
	this.past_score;
	this.past_rank;
	this.max_skip_floor;
}

exports.ReqInfinityTowerHero = function() {
	this.packet_srl;
}
exports.AckInfinityTowerHero = function() {
	this.packet_srl;
	this.result;
	this.hero_list = [];
}

exports.ReqInfinityTowerBot = function() {
	this.packet_srl;
}
exports.AckInfinityTowerBot = function() {	
	this.packet_srl;
	this.result;
	this.battle_bot_list = [];
	this.battle_bot_hero_list = [];
}

exports.ReqInfinityTowerClear = function() {
	this.packet_srl;
}
exports.AckInfinityTowerClear = function() {
	this.packet_srl;
	this.result;
	this.past_battle_clear_list = [];
}

exports.ReqInfinityTowerProcess = function() {
	this.packet_srl;
}
exports.AckInfinityTowerProcess = function() {
	this.packet_srl;
	this.result;
	this.floor;
	this.battle_type;
	this.battle_clear_grade;
	this.is_reward_box_open;
	this.cash_reward_box_count;
	this.is_secret_maze_entrance;
	this.secret_maze_type;
	this.is_secret_maze_reset;
	this.buff_list = [];
	this.awake_buff;
	this.all_clear;
}

exports.ReqInfinityTowerScoreRankList = function() {
	this.packet_srl;
	this.page_num;
}
exports.AckInfinityTowerScoreRankList = function() {
	this.packet_srl;
	this.result;
	this.page_num;
	this.score_rank_list = [];
}

exports.ReqInfinityTowerRankerDetailInfo = function() {
	this.packet_srl;
	this.uuid;
}
exports.AckInfinityTowerRankerDetailInfo = function() {
	this.packet_srl;
	this.result;
	this.slot_hero_list = [];
	this.tag_slot_hero_list = [];
}

exports.ReqInfinityTowerBattleFloorEntrance = function() {
	this.packet_srl;
	this.floor;
	this.battle_type;
	this.battle_bot_list = [];
}
exports.AckInfinityTowerBattleFloorEntrance = function() {
	this.packet_srl;
	this.result;
}

exports.ReqInfinityTowerBattleSelect = function() {
	this.packet_srl;
	this.floor;
	this.battle_type;
}
exports.AckInfinityTowerBattleSelect = function() {
	this.packet_srl;
	this.result;
}

exports.ReqInfinityTowerBattleFinish = function() {
	this.packet_srl;
	this.clear_grade;
	this.battle_type;
	this.hero_list = [];
	this.battle_bot_hero_list = [];
}
exports.AckInfinityTowerBattleFinish = function() {
	this.packet_srl;
	this.result;
	this.ticket;
	this.daily_score;
	this.accum_score;
	this.challenge_point;	// 도전 포인트??
}

exports.ReqInfinityTowerBuffList = function() {
	this.packet_srl;
	this.floor;
	this.buff_id_list = [];	// 클라가 버프 목록을 준다. 서버는 저장해서 사용
}
exports.AckInfinityTowerBuffList = function() {
	this.packet_srl;
	this.result;
}

exports.ReqInfinityTowerBuyBuff = function() {
	this.packet_srl;
	this.floor;
	this.slot_id;
	this.recovery_hero_list = [];	// 체력이 회복된 영웅들 정보 Update 또는 Insert
}
exports.AckInfinityTowerBuyBuff = function() {
	this.packet_srl;
	this.result;
	this.ticket;
	this.slot_id;	
}

exports.ReqInfinityTowerAwakeBuffList = function() {
	this.packet_srl;
	this.floor;
	this.buff_id_list = [];	// 클라가 각성배틀때 버프 목록을 준다. 서버는 저장해서 사용
}
exports.AckInfinityTowerAwakeBuffList = function() {
	this.packet_srl;
	this.result;
}

exports.ReqInfinityTowerBuyAwakeBuff = function() {
	this.packet_srl;
	this.floor;
	this.buy_buff_id;
	thsi.recovery_hero_list = [];
}
exports.AckInfinityTowerBuyAwakeBuff = function() {
	this.packet_srl;
	this.result;
	this.buy_buff_id;
	this.ticket;
}

exports.ReqInfinityTowerRewardBox = function() {
	this.packet_srl;
	this.floor;
}
exports.AckInfinityTowerRewardBox = function() {
	this.packet_srl;
	this.result;
	this.reward_box;		// PacketCommonData.RewardBox()
}

exports.ReqInfinityTowerCashRewardBox = function() {
	this.packet_srl;
	this.floor;
	this.buy_count;
}
exports.AckInfinityTowerCashRewardBox = function() {
	this.packet_srl;
	this.result;
	this.cash;
	this.buy_count;
	this.reward_box;		// PacketCommonData.RewardBox()
}

exports.ReqInfinityTowerSecretMazeType = function() {
	this.packet_srl;
	this.floor;
	this.secret_maze_type;	// 클라가 비밀미로 타입을 정해서 준다.
	this.secret_maze_battle_id;
	this.battle_bot_list = [];
}
exports.AckInfinityTowerSecretMazeType = function() {
	this.packet_srl;
	this.result;
}

exports.ReqInfinityTowerSecretMazeReset = function() {
	this.packet_srl;
	this.floor;
	this.secret_maze_type;	// 클라가 비밀미로 타입을 정해서 준다.
	this.secret_maze_battle_id;
	this.battle_bot_list = [];
}
exports.AckInfinityTowerSecretMazeReset = function() {
	this.packet_srl;
	this.result;
	this.cash;
	this.maze_type;
}

exports.ReqInfinityTowerSecretMazeEntrance = function() {
	this.packet_srl;
	// 비밀미로 입장만 저장
}
exports.AckInfinityTowerSecretMazeEntrance = function() {
	this.packet_srl;
	this.result;
}

exports.ReqInfinityTowerBattleSkip = function() {
	this.packet_srl;
	this.floor;
}
exports.AckInfinityTowerBattleSkip = function() {
	this.packet_srl;
	this.result;
	this.floor;
	this.ticket;
	this.daily_score;
	this.accum_score;
}

exports.ReqInfinityTowerAllSkip = function() {
	this.packet_srl;
}
exports.AckInfinityTowerAllSkip = function() {	// 이전의 무한탑 클리어 정보를 이용해서 보상을 결정 한다.
	this.packet_srl;
	this.result;
	this.max_all_skip_floor;
	this.total_skip_ticket;
	this.total_skip_score;
	this.accum_score;
	this.wallet;
	this.reward_item_list = [];
}

exports.ReqInfinityTowerAccumScoreReward = function() {
	this.packet_srl;
	this.reward_id;
}
exports.AckInfinityTowerAccumScoreReward = function() {
	this.packet_srl;
	this.result;
	this.reward_id;
	this.wallet;
	this.reward_item_list = [];
}

exports.ReqInfinityTowerAllClear = function() {
	this.packet_srl;
}
exports.AckInfinityTowerAllClear = function() {
	this.packet_srl;
	this.result;
}