/********************************************************************
Title : Packet
Date : 2016.08.09
Update : 2016.11.25
Desd : 패킷 정의 파일 로드
writer : dongsu
********************************************************************/
global.PacketRet = require('./PacketResult.js');

var PacketDuck			= require('./PacketDuck/PacketDuck.js');
var PacketLoginServer	= require('./PacketLoginServer/PacketLoginServer.js');
var PacketVersion		= require('./PacketVersion/PacketVersion.js');
var PacketAccount		= require('./PacketAccount/PacketAccount.js');
var PacketAccountBuff	= require('./PacketAccountBuff/PacketAccountBuff.js');
var PacketHero			= require('./PacketHero/PacketHero.js');
var PacketBattle		= require('./PacketBattle/PacketBattle.js');
var PacketTeam			= require('./PacketTeam/PacketTeam.js');
var PacketEquipItem		= require('./PacketEquipItem/PacketEquipItem.js');
var PacketBuy			= require('./PacketBuy/PacketBuy.js');
var PacketShop			= require('./PacketShop/PacketShop.js');
var PacketGacha			= require('./PacketGacha/PacketGacha.js');
var PacketCommon		= require('./PacketCommon/PacketCommon.js');
var PacketInventory		= require('./PacketInventory/PacketInventory.js');
var PacketWeeklyDungeon	= require('./PacketWeeklyDungeon/PacketWeeklyDungeon.js');
var PacketMail			= require('./PacketMail/PacketMail.js');
var PacketAttend		= require('./PacketAttend/PacketAttend.js');
var PacketRank			= require('./PacketRank/PacketRank.js');
var PacketNotice		= require('./PacketNotice/PacketNotice.js');
var PacketMission		= require('./PacketMission/PacketMission.js');
var PacketGuild			= require('./PacketGuild/PacketGuild.js');
var PacketInfinityTower	= require('./PacketInfinityTower/PacketInfinityTower.js');
var PacketFriend		= require('./PacketFriend/PacketFriend.js');
var PacketDarkDungeon	= require('./PacketDarkDungeon/PacketDarkDungeon.js');
var PacketPVP 		= require('./PacketPVP/PacketPVP.js');

var fp = require('fs');

(function (exports) {
	// public 변수.
	var inst = {};

	//-----------------------------------------------------------------------------------------------------------
	inst.InitPacket = function() {
		PacketDuck.inst.LoadPacketCommand();
		PacketLoginServer.inst.LoadPacketCommand();
		PacketVersion.inst.LoadPacketCommand();
		PacketAccount.inst.LoadPacketCommand();
		PacketAccountBuff.inst.LoadPacketCommand();
		PacketHero.inst.LoadPacketCommand();
		PacketBattle.inst.LoadPacketCommand();
		PacketTeam.inst.LoadPacketCommand();
		PacketEquipItem.inst.LoadPacketCommand();
		PacketBuy.inst.LoadPacketCommand();
		PacketShop.inst.LoadPacketCommand();
		PacketGacha.inst.LoadPacketCommand();
		PacketCommon.inst.LoadPacketCommand();
		PacketInventory.inst.LoadPacketCommand();
		PacketWeeklyDungeon.inst.LoadPacketCommand();
		PacketMail.inst.LoadPacketCommand();
		PacketAttend.inst.LoadPacketCommand();
		PacketRank.inst.LoadPacketCommand();
		PacketNotice.inst.LoadPacketCommand();
		PacketMission.inst.LoadPacketCommand();
		PacketGuild.inst.LoadPacketCommand();
		PacketInfinityTower.inst.LoadPacketCommand();
		PacketFriend.inst.LoadPacketCommand();
		PacketDarkDungeon.inst.LoadPacketCommand();
		PacketPVP.inst.LoadPacketCommand();

		PacketRet.inst.LoadPacketResult();
	}	

	//-----------------------------------------------------------------------------------------------------------
	// TODO : 사용하는 곳 없음
	inst.CheckPacketObject = function(packet) {
		if ( packet == null )
			return false;

		var count = 0;
		var keys = Object.keys(packet);

		for ( var i in keys ) {
			if ( typeof packet[keys[i]] !== 'undefined' && packet[keys[i]] !== null )
				count++;
		}

		return count === keys.length;
	}

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;