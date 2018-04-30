/********************************************************************
Title : PacketTeamData
Date : 2016.03.14
Update : 2016.11.23
Desc : 패킷 정의 - 팀
writer: jongwook
********************************************************************/
exports.ReqChangeTeam = function() {
	this.packet_srl;
	this.team_id;
	this.hero_id_list = [];
	this.battle_power;
} 
exports.AckChangeTeam = function() {
	this.packet_srl;
	this.result;
	this.team_id;
	this.hero_id_list = [];
	this.battle_power;
}
