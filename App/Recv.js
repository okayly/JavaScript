/********************************************************************
Title : Recv
Date : 2015.09.23
Update : 2017.04.19
Desc : 패킷 호출 - 클라이언트
writer: jong wook
********************************************************************/
// 커다란 컨텐츠 별로 require 분류
var PacketVersion		= require('../Packets/PacketVersion/PacketVersion.js');
var PacketAccount		= require('../Packets/PacketAccount/PacketAccount.js');
var PacketAccountBuff	= require('../Packets/PacketAccountBuff/PacketAccountBuff.js');
var PacketHero		= require('../Packets/PacketHero/PacketHero.js');
var PacketBattle		= require('../Packets/PacketBattle/PacketBattle.js');
var PacketTeam		= require('../Packets/PacketTeam/PacketTeam.js');
var PacketEquipItem		= require('../Packets/PacketEquipItem/PacketEquipItem.js');
var PacketBuy		= require('../Packets/PacketBuy/PacketBuy.js');
var PacketGacha		= require('../Packets/PacketGacha/PacketGacha.js');
var PacketShop		= require('../Packets/PacketShop/PacketShop.js');
var PacketCommon		= require('../Packets/PacketCommon/PacketCommon.js');
var PacketInventory		= require('../Packets/PacketInventory/PacketInventory.js');
var PacketWeeklyDungeon	= require('../Packets/PacketWeeklyDungeon/PacketWeeklyDungeon.js');
var PacketMail		= require('../Packets/PacketMail/PacketMail.js');
var PacketAttend		= require('../Packets/PacketAttend/PacketAttend.js');
var PacketMission		= require('../Packets/PacketMission/PacketMission.js');
var PacketGuild		= require('../Packets/PacketGuild/PacketGuild.js');
var PacketInfinityTower	= require('../Packets/PacketInfinityTower/PacketInfinityTower.js');
var PacketFriend		= require('../Packets/PacketFriend/PacketFriend.js');
var PacketDarkDungeon	= require('../Packets/PacketDarkDungeon/PacketDarkDungeon.js');
var PacketPVP 		= require('../Packets/PacketPVP/PacketPVP.js');

// for Distribute(컨텐츠별 분배)
var PacketDist_Version		= require('./PacketDist/PacketDist_Version.js');
var PacketDist_AccountBuff		= require('./PacketDist/PacketDist_AccountBuff.js');
var PacketDist_Guild			= require('./PacketDist/PacketDist_Guild.js');
var PacketDist_User			= require('./PacketDist/PacketDist_User.js');
var PacketDist_Mission		= require('./PacketDist/PacketDist_Mission.js');
var PacketDist_Hero			= require('./PacketDist/PacketDist_Hero.js');
var PacketDist_EquipItem		= require('./PacketDist/PacketDist_EquipItem.js');
var PacketDist_Battle			= require('./PacketDist/PacketDist_Battle.js');
var PacketDist_Team			= require('./PacketDist/PacketDist_Team.js');
var PacketDist_Buy			= require('./PacketDist/PacketDist_Buy.js');
var PacketDist_Shop			= require('./PacketDist/PacketDist_Shop.js');
var PacketDist_Gacha		= require('./PacketDist/PacketDist_Gacha.js');
var PacketDist_Common		= require('./PacketDist/PacketDist_Common.js');
var PacketDist_Inventory		= require('./PacketDist/PacketDist_Inventory.js');
var PacketDist_WeeklyDungeon 	= require('./PacketDist/PacketDist_WeeklyDungeon.js');
var PacketDist_Mail			= require('./PacketDist/PacketDist_Mail.js');
var PacketDist_Attend		= require('./PacketDist/PacketDist_Attend.js');
var PacketDist_InfinityTower 	= require('./PacketDist/PacketDist_InfinityTower.js');
var PacketDist_Friend		= require('./PacketDist/PacketDist_Friend.js');
var PacketDist_DarkDungeon	= require('./PacketDist/PacketDist_DarkDungeon.js');
var PacketDist_PVP 			= require('./PacketDist/PacketDist_PVP.js');

// Duck - 서버 테스트
var PacketDuck = require('../Packets/PacketDuck/PacketDuck.js');
var PacketDist_DuckDesign = require('./PacketDist/PacketDist_DuckDesign.js');

// LoginServer
var PacketLoginServer = require('../Packets/PacketLoginServer/PacketLoginServer.js');
var PacketDist_LoginServer = require('./PacketDist/PacketDist_LoginServer.js');

(function (exports) {
	var inst = {};

	inst.Distribute = function(socket) {
		//------------------------------------------------------------------------------------------------------------------
		// mkTest
		socket.on('ReqTest', function (p_json_packet) {
			try {
				var mkTest = require('../Contents/mkTest.js');				
				mkTest.inst.ReqTest(socket, p_json_packet);
			} catch (p_error) {
				var str_log = 'ReqTest -' + p_error.stack;
				err_report.inst.SendReport(str_log);
			}
		});

		//------------------------------------------------------------------------------------------------------------------
		// Version
		socket.on(PacketVersion.inst.cmdReqVersion(), function (p_json_packet) { PacketDist_Version.inst.Dist(PacketVersion.inst.cmdReqVersion(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Duck - Client
		socket.on(PacketDuck.inst.cmdReqAccountLevelSet(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqAccountLevelSet(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqHeroLevelSet(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqHeroLevelSet(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqMakeInventoryItem(),	function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqMakeInventoryItem(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqInfinityTowerReset(),	function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqInfinityTowerReset(), socket, p_json_packet); });

		// Duck - Design
		socket.on(PacketDuck.inst.cmdReqConfirmAccount(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqConfirmAccount(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqAccountLevel(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqAccountLevel(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqAccountBuff(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqAccountBuff(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqVip(),					function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqVip(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqCash(),					function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqCash(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqGold(),					function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqGold(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqHonorPoint(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqHonorPoint(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqAlliancePoint(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqAlliancePoint(), socket, p_json_packet); });
		
		socket.on(PacketDuck.inst.cmdReqChallengePoint(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqChallengePoint(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdAckChallengePoint(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdAckChallengePoint(), socket, p_json_packet); });

		socket.on(PacketDuck.inst.cmdReqStamina(),				function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqStamina(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqSkillPoint(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqSkillPoint(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqHeroLevel(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqHeroLevel(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqHeroExp(),				function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqHeroExp(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqHeroSkill(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqHeroSkill(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqHeroEvolution(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqHeroEvolution(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqHeroReinforce(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqHeroReinforce(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqItemLevel(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqItemLevel(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqItemEvolution(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqItemEvolution(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqItemReinforce(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqItemReinforce(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqCreateItemOne(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqCreateItemOne(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqCreateItemCategory(),	function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqCreateItemCategory(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqCreateItemAll(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqCreateItemAll(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqDailyContents(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqDailyContents(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqStageClear(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqStageClear(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqSendMail(),				function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqSendMail(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqMailReservation(),		function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqMailReservation(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqSendReservationMail(),	function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqSendReservationMail(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqServerMsg(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqServerMsg(), socket, p_json_packet); });
		socket.on(PacketDuck.inst.cmdReqGuildPoint(),			function (p_json_packet) { PacketDist_DuckDesign.inst.Dist(PacketDuck.inst.cmdReqGuildPoint(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Account
		socket.on(PacketAccount.inst.cmdReqLogon(),				function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqLogon(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqUser(),				function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqUser(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqInventory(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqInventory(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqHeroBases(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqHeroBases(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqTeam(),				function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqTeam(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqStageInfo(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqStageInfo(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqVip(),				function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqVip(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqGachaInfo(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqGachaInfo(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqWeeklyDungeonExecCount(),	function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqWeeklyDungeonExecCount(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqAttendInfo(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqAttendInfo(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqGuildInfo(),				function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqGuildInfo(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqMissionInfo(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqMissionInfo(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqReConnect(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqReConnect(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqChapterReward(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqChapterReward(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqVipReward(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqVipReward(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqChangeNick(),			function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqChangeNick(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqChangeUserIcon(),		function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqChangeUserIcon(), socket, p_json_packet); });
		socket.on(PacketAccount.inst.cmdReqPvpInfo(),				function (p_json_packet) { PacketDist_User.inst.Dist(PacketAccount.inst.cmdReqPvpInfo(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// AccountBuff
		socket.on(PacketAccountBuff.inst.cmdReqAccountBuffInfo(),	function (p_json_packet) { PacketDist_AccountBuff.inst.Dist(PacketAccountBuff.inst.cmdReqAccountBuffInfo(), socket, p_json_packet); });
		socket.on(PacketAccountBuff.inst.cmdReqAccountBuffLevelup(),function (p_json_packet) { PacketDist_AccountBuff.inst.Dist(PacketAccountBuff.inst.cmdReqAccountBuffLevelup(), socket, p_json_packet); });
		socket.on(PacketAccountBuff.inst.cmdReqAccountBuffReset(),	function (p_json_packet) { PacketDist_AccountBuff.inst.Dist(PacketAccountBuff.inst.cmdReqAccountBuffReset(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Hero
		socket.on(PacketHero.inst.cmdReqHeroEvolution(),	function (p_json_packet) { PacketDist_Hero.inst.Dist(PacketHero.inst.cmdReqHeroEvolution(), socket, p_json_packet); });
		socket.on(PacketHero.inst.cmdReqHeroSkills(),		function (p_json_packet) { PacketDist_Hero.inst.Dist(PacketHero.inst.cmdReqHeroSkills(), socket, p_json_packet); });
		socket.on(PacketHero.inst.cmdReqHeroLevelup(),		function (p_json_packet) { PacketDist_Hero.inst.Dist(PacketHero.inst.cmdReqHeroLevelup(), socket, p_json_packet); });
		socket.on(PacketHero.inst.cmdReqHeroSummon(),		function (p_json_packet) { PacketDist_Hero.inst.Dist(PacketHero.inst.cmdReqHeroSummon(), socket, p_json_packet); });
		socket.on(PacketHero.inst.cmdReqHeroReinforce(),	function (p_json_packet) { PacketDist_Hero.inst.Dist(PacketHero.inst.cmdReqHeroReinforce(), socket, p_json_packet); });
		socket.on(PacketHero.inst.cmdReqHeroSkillLevelup(),	function (p_json_packet) { PacketDist_Hero.inst.Dist(PacketHero.inst.cmdReqHeroSkillLevelup(), socket, p_json_packet); });
		socket.on(PacketHero.inst.cmdReqHeroArmySkill(),	function (p_json_packet) { PacketDist_Hero.inst.Dist(PacketHero.inst.cmdReqHeroArmySkill(), socket, p_json_packet); });
		socket.on(PacketHero.inst.cmdReqHeroCombiBuff(),	function (p_json_packet) { PacketDist_Hero.inst.Dist(PacketHero.inst.cmdReqHeroCombiBuff(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// EquipItem
		socket.on(PacketEquipItem.inst.cmdReqEquipment(),		function (p_json_packet) { PacketDist_EquipItem.inst.Dist(PacketEquipItem.inst.cmdReqEquipment(), socket, p_json_packet); });
		socket.on(PacketEquipItem.inst.cmdReqEquipItem(),		function (p_json_packet) { PacketDist_EquipItem.inst.Dist(PacketEquipItem.inst.cmdReqEquipItem(), socket, p_json_packet); });
		socket.on(PacketEquipItem.inst.cmdReqEquipItemOne(),	function (p_json_packet) { PacketDist_EquipItem.inst.Dist(PacketEquipItem.inst.cmdReqEquipItemOne(), socket, p_json_packet); });
		socket.on(PacketEquipItem.inst.cmdReqEquipItemLevelup(),	function (p_json_packet) { PacketDist_EquipItem.inst.Dist(PacketEquipItem.inst.cmdReqEquipItemLevelup(), socket, p_json_packet); });
		socket.on(PacketEquipItem.inst.cmdReqEquipItemReinforce(),	function (p_json_packet) { PacketDist_EquipItem.inst.Dist(PacketEquipItem.inst.cmdReqEquipItemReinforce(), socket, p_json_packet); });
		socket.on(PacketEquipItem.inst.cmdReqEquipItemLock(),	function (p_json_packet) { PacketDist_EquipItem.inst.Dist(PacketEquipItem.inst.cmdReqEquipItemLock(), socket, p_json_packet); });
		socket.on(PacketEquipItem.inst.cmdReqEquipItemSell(),	function (p_json_packet) { PacketDist_EquipItem.inst.Dist(PacketEquipItem.inst.cmdReqEquipItemSell(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Battle
		socket.on(PacketBattle.inst.cmdReqBattleStart(), function (p_json_packet) { PacketDist_Battle.inst.Dist(PacketBattle.inst.cmdReqBattleStart(), socket, p_json_packet); });
		socket.on(PacketBattle.inst.cmdReqBattleFinish(), function (p_json_packet) { PacketDist_Battle.inst.Dist(PacketBattle.inst.cmdReqBattleFinish(), socket, p_json_packet); });
		socket.on(PacketBattle.inst.cmdReqBattleSweep(), function (p_json_packet) { PacketDist_Battle.inst.Dist(PacketBattle.inst.cmdReqBattleSweep(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Team
		socket.on(PacketTeam.inst.cmdReqChangeTeam(), function (p_json_packet) { PacketDist_Team.inst.Dist(PacketTeam.inst.cmdReqChangeTeam(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Buy
		socket.on(PacketBuy.inst.cmdReqBuyGold(),			function (p_json_packet) { PacketDist_Buy.inst.Dist(PacketBuy.inst.cmdReqBuyGold(), socket, p_json_packet); });
		socket.on(PacketBuy.inst.cmdReqBuyStamina(),			function (p_json_packet) { PacketDist_Buy.inst.Dist(PacketBuy.inst.cmdReqBuyStamina(), socket, p_json_packet); });
		socket.on(PacketBuy.inst.cmdReqBuyCash(),			function (p_json_packet) { PacketDist_Buy.inst.Dist(PacketBuy.inst.cmdReqBuyCash(), socket, p_json_packet); });
		socket.on(PacketBuy.inst.cmdReqBuySkillPoint(),			function (p_json_packet) { PacketDist_Buy.inst.Dist(PacketBuy.inst.cmdReqBuySkillPoint(), socket, p_json_packet); });
		socket.on(PacketBuy.inst.cmdReqProphecySpringAbleCount(),	function (p_json_packet) { PacketDist_Buy.inst.Dist(PacketBuy.inst.cmdReqProphecySpringAbleCount(), socket, p_json_packet); });
		socket.on(PacketBuy.inst.cmdReqBuyEquipItemInventorySlot(),	function (p_json_packet) { PacketDist_Buy.inst.Dist(PacketBuy.inst.cmdReqBuyEquipItemInventorySlot(), socket, p_json_packet); });
		socket.on(PacketBuy.inst.cmdReqBuyPvpAbleCount(),		function (p_json_packet) { PacketDist_Buy.inst.Dist(PacketBuy.inst.cmdReqBuyPvpAbleCount(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Shop
		socket.on(PacketShop.inst.cmdReqShopIDs(),			function (p_json_packet) { PacketDist_Shop.inst.Dist(PacketShop.inst.cmdReqShopIDs(), socket, p_json_packet); });
		socket.on(PacketShop.inst.cmdReqShopBuy(),			function (p_json_packet) { PacketDist_Shop.inst.Dist(PacketShop.inst.cmdReqShopBuy(), socket, p_json_packet); });
		socket.on(PacketShop.inst.cmdReqShopReset(),		function (p_json_packet) { PacketDist_Shop.inst.Dist(PacketShop.inst.cmdReqShopReset(), socket, p_json_packet); });
		socket.on(PacketShop.inst.cmdReqShopResetCount(),	function (p_json_packet) { PacketDist_Shop.inst.Dist(PacketShop.inst.cmdReqShopResetCount(), socket, p_json_packet); });
		socket.on(PacketShop.inst.cmdReqRandomShopIsOpen(),	function (p_json_packet) { PacketDist_Shop.inst.Dist(PacketShop.inst.cmdReqRandomShopIsOpen(), socket, p_json_packet); });
		socket.on(PacketShop.inst.cmdReqRandomShopOpen(),	function (p_json_packet) { PacketDist_Shop.inst.Dist(PacketShop.inst.cmdReqRandomShopOpen(), socket, p_json_packet); });
		socket.on(PacketShop.inst.cmdReqShopBuyHeroExp(),	function (p_json_packet) { PacketDist_Shop.inst.Dist(PacketShop.inst.cmdReqShopBuyHeroExp(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Gacha
		socket.on(PacketGacha.inst.cmdReqGacha(), function (p_json_packet) { PacketDist_Gacha.inst.Dist(PacketGacha.inst.cmdReqGacha(), socket, p_json_packet); });
		
		//------------------------------------------------------------------------------------------------------------------
		// Common
		socket.on(PacketCommon.inst.cmdReqChargeStamina(), function (p_json_packet) { PacketDist_Common.inst.Dist(PacketCommon.inst.cmdReqChargeStamina(), socket, p_json_packet); });
		socket.on(PacketCommon.inst.cmdReqChargeSkillPoint(), function (p_json_packet) { PacketDist_Common.inst.Dist(PacketCommon.inst.cmdReqChargeSkillPoint(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Inventory
		socket.on(PacketInventory.inst.cmdReqUseItem(),			function (p_json_packet) { PacketDist_Inventory.inst.Dist(PacketInventory.inst.cmdReqUseItem(), socket, p_json_packet); });
		socket.on(PacketInventory.inst.cmdReqSellItem(),		function (p_json_packet) { PacketDist_Inventory.inst.Dist(PacketInventory.inst.cmdReqSellItem(), socket, p_json_packet); });
		socket.on(PacketInventory.inst.cmdReqUseRandomBox(),	function (p_json_packet) { PacketDist_Inventory.inst.Dist(PacketInventory.inst.cmdReqUseRandomBox(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// WeeklyDungeon
		socket.on(PacketWeeklyDungeon.inst.cmdReqWeeklyDungeonStart(),	function (p_json_packet) { PacketDist_WeeklyDungeon.inst.Dist(PacketWeeklyDungeon.inst.cmdReqWeeklyDungeonStart(), socket, p_json_packet); });
		socket.on(PacketWeeklyDungeon.inst.cmdReqWeeklyDungeonFinish(),	function (p_json_packet) { PacketDist_WeeklyDungeon.inst.Dist(PacketWeeklyDungeon.inst.cmdReqWeeklyDungeonFinish(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Mail
		socket.on(PacketMail.inst.cmdReqMailSend(),			function (p_json_packet) { PacketDist_Mail.inst.Dist(PacketMail.inst.cmdReqMailSend(), socket, p_json_packet); });
		socket.on(PacketMail.inst.cmdReqMailReadInfo(),		function (p_json_packet) { PacketDist_Mail.inst.Dist(PacketMail.inst.cmdReqMailReadInfo(), socket, p_json_packet); });
		socket.on(PacketMail.inst.cmdReqMailList(),			function (p_json_packet) { PacketDist_Mail.inst.Dist(PacketMail.inst.cmdReqMailList(), socket, p_json_packet); });
		socket.on(PacketMail.inst.cmdReqMailRead(),			function (p_json_packet) { PacketDist_Mail.inst.Dist(PacketMail.inst.cmdReqMailRead(), socket, p_json_packet); });
		socket.on(PacketMail.inst.cmdReqMailReward(),		function (p_json_packet) { PacketDist_Mail.inst.Dist(PacketMail.inst.cmdReqMailReward(), socket, p_json_packet); });
		socket.on(PacketMail.inst.cmdReqMailRewardAll(),	function (p_json_packet) { PacketDist_Mail.inst.Dist(PacketMail.inst.cmdReqMailRewardAll(), socket, p_json_packet); });	

		//------------------------------------------------------------------------------------------------------------------
		// Attend
		socket.on(PacketAttend.inst.cmdReqAttendDailyReward(), function (p_json_packet) { PacketDist_Attend.inst.Dist(PacketAttend.inst.cmdReqAttendDailyReward(), socket, p_json_packet); });
		socket.on(PacketAttend.inst.cmdReqAddAttendDailyReward(), function (p_json_packet) { PacketDist_Attend.inst.Dist(PacketAttend.inst.cmdReqAddAttendDailyReward(), socket, p_json_packet); });
		socket.on(PacketAttend.inst.cmdReqAttendAccumReward(), function (p_json_packet) { PacketDist_Attend.inst.Dist(PacketAttend.inst.cmdReqAttendAccumReward(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// PVP
		socket.on(PacketPVP.inst.cmdReqPVPInfoUpdate(),		function (p_json_packet) { PacketDist_PVP.inst.Dist(PacketPVP.inst.cmdReqPVPInfoUpdate(), socket, p_json_packet); });
		socket.on(PacketPVP.inst.cmdReqFindMatchPlayer(),		function (p_json_packet) { PacketDist_PVP.inst.Dist(PacketPVP.inst.cmdReqFindMatchPlayer(), socket, p_json_packet); });
		socket.on(PacketPVP.inst.cmdReqPvpStart(),			function (p_json_packet) { PacketDist_PVP.inst.Dist(PacketPVP.inst.cmdReqPvpStart(), socket, p_json_packet); });
		socket.on(PacketPVP.inst.cmdReqPvpFinish(),			function (p_json_packet) { PacketDist_PVP.inst.Dist(PacketPVP.inst.cmdReqPvpFinish(), socket, p_json_packet); });
		socket.on(PacketPVP.inst.cmdReqPvpAchievementReward(),	function (p_json_packet) { PacketDist_PVP.inst.Dist(PacketPVP.inst.cmdReqPvpAchievementReward(), socket, p_json_packet); });
		socket.on(PacketPVP.inst.cmdReqPvpLeagueRankList(),		function (p_json_packet) { PacketDist_PVP.inst.Dist(PacketPVP.inst.cmdReqPvpLeagueRankList(), socket, p_json_packet); });
		socket.on(PacketPVP.inst.cmdReqPvpGroupRankList(),		function (p_json_packet) { PacketDist_PVP.inst.Dist(PacketPVP.inst.cmdReqPvpGroupRankList(), socket, p_json_packet); });
		socket.on(PacketPVP.inst.cmdReqPvpRecord(),			function (p_json_packet) { PacketDist_PVP.inst.Dist(PacketPVP.inst.cmdReqPvpRecord(), socket, p_json_packet); });
		
		

		//------------------------------------------------------------------------------------------------------------------
		// Mission
		socket.on(PacketMission.inst.cmdReqMissionReward(),		function (p_json_packet) { PacketDist_Mission.inst.Dist(PacketMission.inst.cmdReqMissionReward(), socket, p_json_packet); });
		socket.on(PacketMission.inst.cmdReqMissionProgress(),	function (p_json_packet) { PacketDist_Mission.inst.Dist(PacketMission.inst.cmdReqMissionProgress(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Guild
		socket.on(PacketGuild.inst.cmdReqCreateGuild(),				function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqCreateGuild(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqRecommandGuild(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqRecommandGuild(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildDetailInfo(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildDetailInfo(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildJoin(),				function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildJoin(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildPendingApprovalList(),	function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildPendingApprovalList(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildPendingApprovalProcess(),	function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildPendingApprovalProcess(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildMemberBan(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildMemberBan(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqFindGuild(),				function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqFindGuild(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqLeaveGuild(),				function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqLeaveGuild(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqChangeGuildInfo(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqChangeGuildInfo(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildInvitation(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildInvitation(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildInvitationList(),		function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildInvitationList(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildInvitationProcess(),	function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildInvitationProcess(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqChangeAuth(),				function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqChangeAuth(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqChangeAuthConfirm(),		function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqChangeAuthConfirm(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildPointDonation(),		function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildPointDonation(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildLevelup(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildLevelup(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildRaidInfo(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildRaidInfo(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildRaidOpen(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildRaidOpen(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildRaidBattleStart(),	function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildRaidBattleStart(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildRaidBattleFinish(),	function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildRaidBattleFinish(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildRaidRank(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildRaidRank(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqWeeklyDonationReward(),	function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqWeeklyDonationReward(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqDonationRank(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqDonationRank(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqGuildSkillLevelUp(),		function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqGuildSkillLevelUp(), socket, p_json_packet); });
		socket.on(PacketGuild.inst.cmdReqForceChangeAuth(),			function (p_json_packet) { PacketDist_Guild.inst.Dist(PacketGuild.inst.cmdReqForceChangeAuth(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// InfinityTower
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerUser(),					function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerUser(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerHero(),					function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerHero(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerBot(),					function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerBot(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerClear(),					function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerClear(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerProcess(),				function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerProcess(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerScoreRankList(),			function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerScoreRankList(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerRankerDetailInfo(),		function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerRankerDetailInfo(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerBattleFloorEntrance(),	function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerBattleFloorEntrance(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerBattleSelect(),			function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerBattleSelect(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerBattleFinish(),			function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerBattleFinish(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerBuffList(),				function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerBuffList(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerBuyBuff(),				function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerBuyBuff(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerRewardBox(),				function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerRewardBox(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerCashRewardBox(),			function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerCashRewardBox(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeType(),			function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeType(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeReset(),		function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeReset(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeEntrance(),		function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeEntrance(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerBattleSkip(),				function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerBattleSkip(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerAllSkip(),				function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerAllSkip(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerAccumScoreReward(),		function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerAccumScoreReward(), socket, p_json_packet); });
		socket.on(PacketInfinityTower.inst.cmdReqInfinityTowerAllClear(),				function (p_json_packet) { PacketDist_InfinityTower.inst.Dist(PacketInfinityTower.inst.cmdReqInfinityTowerAllClear(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// Friend
		socket.on(PacketFriend.inst.cmdReqFriendInfo(),				function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendInfo(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFindFriend(),				function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFindFriend(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRecommandList(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRecommandList(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequestSendList(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequestSendList(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequestRecvList(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequestRecvList(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequest(),			function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequest(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequestAccept(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequestAccept(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequestCancel(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequestCancel(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequestRefuse(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequestRefuse(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendSendStamina(),		function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendSendStamina(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendTakeStamina(),		function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendTakeStamina(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendDelete(),			function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendDelete(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendSendMemo(),			function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendSendMemo(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequestAcceptAll(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequestAcceptAll(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequestCancelAll(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequestCancelAll(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendRequestRefuseAll(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendRequestRefuseAll(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendSendStaminaAll(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendSendStaminaAll(), socket, p_json_packet); });
		socket.on(PacketFriend.inst.cmdReqFriendTakeStaminaAll(),	function (p_json_packet) { PacketDist_Friend.inst.Dist(PacketFriend.inst.cmdReqFriendTakeStaminaAll(), socket, p_json_packet); });

		//------------------------------------------------------------------------------------------------------------------
		// DarkDungeon
		socket.on(PacketDarkDungeon.inst.cmdReqDarkDungeon(),				function (p_json_packet) { PacketDist_DarkDungeon.inst.Dist(PacketDarkDungeon.inst.cmdReqDarkDungeon(), socket, p_json_packet); });
		socket.on(PacketDarkDungeon.inst.cmdReqDarkDungeonCreate(),			function (p_json_packet) { PacketDist_DarkDungeon.inst.Dist(PacketDarkDungeon.inst.cmdReqDarkDungeonCreate(), socket, p_json_packet); });
		socket.on(PacketDarkDungeon.inst.cmdReqDarkDungeonChapter(),		function (p_json_packet) { PacketDist_DarkDungeon.inst.Dist(PacketDarkDungeon.inst.cmdReqDarkDungeonChapter(), socket, p_json_packet); });
		socket.on(PacketDarkDungeon.inst.cmdReqDarkDungeonBattleStart(),	function (p_json_packet) { PacketDist_DarkDungeon.inst.Dist(PacketDarkDungeon.inst.cmdReqDarkDungeonBattleStart(), socket, p_json_packet); });
		socket.on(PacketDarkDungeon.inst.cmdReqDarkDungeonBattleFinish(),	function (p_json_packet) { PacketDist_DarkDungeon.inst.Dist(PacketDarkDungeon.inst.cmdReqDarkDungeonBattleFinish(), socket, p_json_packet); });
		socket.on(PacketDarkDungeon.inst.cmdReqDarkDungeonChapterReset(),	function (p_json_packet) { PacketDist_DarkDungeon.inst.Dist(PacketDarkDungeon.inst.cmdReqDarkDungeonChapterReset(), socket, p_json_packet); });
		socket.on(PacketDarkDungeon.inst.cmdReqDarkDungeonReward(),			function (p_json_packet) { PacketDist_DarkDungeon.inst.Dist(PacketDarkDungeon.inst.cmdReqDarkDungeonReward(), socket, p_json_packet); });
		socket.on(PacketDarkDungeon.inst.cmdReqDarkDungeonNextStage(),		function (p_json_packet) { PacketDist_DarkDungeon.inst.Dist(PacketDarkDungeon.inst.cmdReqDarkDungeonNextStage(), socket, p_json_packet); });
	}

	inst.LoginDistribute = function(p_socket) {
		console.log('!!!! LoginDistribute !!!!');

		//------------------------------------------------------------------------------------------------------------------
		// UserCount
		p_socket.on(PacketLoginServer.inst.cmdReqUserCount(), function (p_json_packet) {
			PacketDist_LoginServer.inst.Dist(PacketLoginServer.inst.cmdReqUserCount(), p_socket, p_json_packet);
		});

		// SendReservationMail - for test
		p_socket.on(PacketLoginServer.inst.cmdReqSendReservationMail(), function (p_json_packet) {
			PacketDist_LoginServer.inst.Dist(PacketLoginServer.inst.cmdReqSendReservationMail(), p_socket, p_json_packet);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;