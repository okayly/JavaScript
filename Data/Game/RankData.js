/********************************************************************
Title : RankData
Date : 2016.04.08
Udpate : 2016.08.18
writer: dongsu
********************************************************************/
exports.Rank = function() {
	this.RankMatchInfo = function() {
		this.target_rank;
		this.target_uuid;
	}

	this.rank_match_info = new this.RankMatchInfo();
	this.SetRankMatch = function(p_target_rank, p_target_uuid) {
		this.rank_match_info.target_rank = p_target_rank;
		this.rank_match_info.target_uuid = p_target_uuid;
	}
	this.GetRankMatch = function() { return this.rank_match_info; }
	this.InitRankMatch = function() {
		this.rank_match_info.target_rank = 0;
		this.rank_match_info.target_uuid = 0;
	}
}