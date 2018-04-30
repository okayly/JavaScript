/********************************************************************
Title : PacketRankData
Date : 2016.03.04
Desc : 패킷 정의 - 랭킹전
writer : dongsu
********************************************************************/
var PacketCommonData = require('../PacketCommonData.js');

exports.ReqFindMatchPlayer = function() {
	this.packet_srl;
}
exports.AckFindMatchPlayer = function() {
	this.packet_srl;
	this.result;
	this.match_player_list = []; //PacketCommonData.MatchPlayer Array
}

exports.ReqPlayerDetailInfo = function() { 
	this.packet_srl;
	this.target_uuid;
}
exports.AckPlayerDetailInfo = function() {
	this.packet_srl;
	this.result;
	this.slot_hero_list 	 = []; 	// PacketCommonData.MatchHero Array
	this.tag_slot_hero_list = []; 	// PacketCommonData.MatchHero Array
	this.alliance_name;
}

exports.ReqRankMatchStart = function() {
	this.packet_srl;
	this.target_uuid;
}
exports.AckRankMatchStart = function() {
	this.packet_srl;
	this.result;
	this.slot_hero_list 		= []; 	// PacketCommonData.MatchHero Array
	this.tag_slot_hero_list 	= []; 	// PacketCommonData.MatchHero Array
	this.match_hero_equip_list 	= []; 	// PacketCommonData.MatchHeroEquipInfo Array
	this.match_hero_skill_list 	= []; 	// PacketCommonData.MatchHeroSkillInfo Array
	this.summon_list = [];				// PacketCommonData.Summon
	this.summon_trait_list = [];		// PacketCommonData.SummonTrait
	this.account_buff_list = [];		// PacketCommonData.AccountBuff
}

exports.ReqRankMatchFinish = function() {
	this.packet_srl;
	this.battle_result;
}
exports.AckRankMatchFinish = function() {
	this.packet_srl;
	this.result;
	this.current_rank;
	this.battle_result;
	this.top_rank;
	this.current_winning_streak;
	this.rank_match_play_count;
	this.free_match_remain_time;
}

exports.ReqPlayCountReward = function() {
	this.packet_srl;
	this.reward_id;
}
exports.AckPlayCountReward = function() {
	this.packet_srl;
	this.result;
	this.wallet 	= new PacketCommonData.Wallet();
	this.item_list 	= []; 	// PacketCommonData.Item Array
}

exports.ReqWinningStreakReward = function() {
	this.packet_srl;
	this.reward_id;
}
exports.AckWinningStreakReward = function() {
	this.packet_srl;
	this.result;
	this.wallet 	= new PacketCommonData.Wallet();
	this.item_list 	= []; 	// PacketCommonData.Item Array
}

exports.ReqRankAchievementReward = function() {
	this.packet_srl;
	this.reward_id;
}
exports.AckRankAchievementReward = function() {
	this.packet_srl;
	this.result;
	this.reward_id;
	this.wallet 	= new PacketCommonData.Wallet();
	this.item_list 	= []; 	// PacketCommonData.Item Array	
}

// 공통.
exports.AckReward = function() {
	this.packet_srl;
	this.result;
	this.wallet 	= new PacketCommonData.Wallet();
	this.item_list 	= []; 	// PacketCommonData.Item Array	
}

exports.ReqBuyRankMatchCount = function() {
	this.packet_srl;
}
exports.AckBuyRankMatchCount = function() {
	this.packet_srl;
	this.result;
	this.result_cash;
	this.daily_buy_play_count;
}

exports.ReqBuyReplaceMatchPlayer = function() {
	this.packet_srl;
}
exports.AckBuyReplaceMatchPlayer = function() {
	this.packet_srl;
	this.result;
	this.match_player_list = []; 	// PacketCommonData.MatchPlayer Array
	this.result_cash;
	this.daily_replace_target_count;
}

exports.ReqInitMatchRemainTime = function() {
	this.packet_srl;
}
exports.AckInitMatchRemainTime = function() {
	this.packet_srl;
	this.result;
	this.result_cash;
}

exports.ReqRankList = function() {
	this.packet_srl;
	this.page_num;
}
exports.AckRankList = function() {
	this.packet_srl;
	this.result;
	this.rank_user_list = []; 	// PacketCommonData.RankUser Array
}

exports.ReqRankMatchRecord = function() {
	this.packet_srl;
}
exports.AckRankMatchRecord = function() {
	this.packet_srl;
	this.result;
	this.rank_match_record_list = []; // PacketCommonData.RankMatchRecord Array
}

exports.ReqRankMatchRecordDetailInfo = function() {
	this.packet_srl;
	this.battle_date;
}
exports.AckRankMatchRecordDetailInfo = function() {
	this.packet_srl;
	this.result;
	this.target_rank;
	this.slot_hero_list = []; 	// PacketCommonData.MatchHero Array
	this.tag_slot_hero_list = []; 	// PacketCommonData.MatchHero Array
}