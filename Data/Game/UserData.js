/********************************************************************
Title : UserData
Date : 2015.12.01
Update : 2016.08.18
Desc : 필수 유저 정보
writer: dongsu
********************************************************************/
var Timer = require('../../Utils/Timer.js');
var RankData		= require('./RankData.js');

exports.User = function() {

	// private
	this.PacketBuf = function() {
		this.packet_srl;
		this.packet_cmd;
		this.packet_data;
	}

	this.SetPacketBuf = function(p_cmd, p_data) {
		this.packet_buf.packet_srl	= p_data.packet_srl;
		this.packet_buf.packet_cmd	= p_cmd;
		this.packet_buf.packet_data	= p_data;
	}
	
	this.packet_buf;
	this.GetPacketBuf = function() { return this.packet_buf; }
	
	this.socket;
	this.GetSocket	= function() { return this.socket; }
	this.InitSocket	= function() { this.socket = 0; }
	this.SetSocket	= function(p_socket) { this.socket = p_socket; }

	this.logout_time;
	this.SetLogoutTime	= function() { this.logout_time = Timer.inst.GetNowByStrDate(); }
	this.InitLogoutTime	= function() { this.logout_time = null; }
	this.GetDeltaTime	= function() { return Timer.inst.GetDeltaTime(this.logout_time); }

	this.uuid;
	this.nick;
	this.account;
	this.last_login_unix_time;	// 로그인 시간
	
	this.rank;

	// public member function
	this.InitUserInfo = function (p_socket, p_uuid, p_account, p_gold, p_cash, p_point_honor, p_point_alliance, p_point_challenge) {	// 유저 정보 세팅.
		console.log('InitUserInfo - uuid: %d, account: %s, gold: %d, cash: %d, point_honor: %d, point_alliance: %d, point_challenge: %d',  p_uuid, p_account, p_gold, p_cash, p_point_honor, p_point_alliance, p_point_challenge);
		this.socket		= p_socket;
		this.uuid		= p_uuid;
		this.account	= p_account;
		this.nick		= p_account;
				
		this.packet_buf	= new this.PacketBuf();
	}
	//------------------------------------------------------------------------------------------------------------------
	// for test
	this.CreateUser = function (p_socket, p_uuid, p_account) {
		this.SetSocket(p_socket);

		this.packet_buf	= new this.PacketBuf();
		this.uuid = p_uuid;
		this.account = p_account;
		
		this.rank = new RankData.Rank();
	}
	
	// RankMatch
	this.GetRank = function() { return this.rank; }
}
