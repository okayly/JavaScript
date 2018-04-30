/********************************************************************
Title : PacketInfinityTower
Date : 2016.04.01
Update : 2016.11.22
Desc : 패킷 정의 - 탑
writer: jongwook
********************************************************************/
var PacketInfinityTowerData = require('./PacketInfinityTowerData.js');

var fp = require('fs');

(function(exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function() {
		logger.debug('**** InfinityTower packet command init ****');

		fp.readFile('./Packets/PacketInfinityTower/PacketInfinityTowerCmd.json', 'utf8', function(err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};

	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqInfinityTowerUser = function() { return packet_cmd.Req.InfinityTowerUser; }
	inst.cmdAckInfinityTowerUser = function() { return packet_cmd.Ack.InfinityTowerUser; }

	inst.cmdReqInfinityTowerHero = function() { return packet_cmd.Req.InfinityTowerHero; }
	inst.cmdAckInfinityTowerHero = function() { return packet_cmd.Ack.InfinityTowerHero; }

	inst.cmdReqInfinityTowerBot = function() { return packet_cmd.Req.InfinityTowerBot; }
	inst.cmdAckInfinityTowerBot = function() { return packet_cmd.Ack.InfinityTowerBot; }

	inst.cmdReqInfinityTowerClear = function() { return packet_cmd.Req.InfinityTowerClear; }
	inst.cmdAckInfinityTowerClear = function() { return packet_cmd.Ack.InfinityTowerClear; }

	inst.cmdReqInfinityTowerProcess = function() { return packet_cmd.Req.InfinityTowerProcess; }
	inst.cmdAckInfinityTowerProcess = function() { return packet_cmd.Ack.InfinityTowerProcess; }

	inst.cmdReqInfinityTowerScoreRankList = function() { return packet_cmd.Req.InfinityTowerScoreRankList; }
	inst.cmdAckInfinityTowerScoreRankList = function() { return packet_cmd.Ack.InfinityTowerScoreRankList; }

	inst.cmdReqInfinityTowerRankerDetailInfo = function() { return packet_cmd.Req.InfinityTowerRankerDetailInfo; }
	inst.cmdAckInfinityTowerRankerDetailInfo = function() { return packet_cmd.Ack.InfinityTowerRankerDetailInfo; }

	inst.cmdReqInfinityTowerBattleFloorEntrance = function() { return packet_cmd.Req.InfinityTowerBattleFloorEntrance; }
	inst.cmdAckInfinityTowerBattleFloorEntrance = function() { return packet_cmd.Ack.InfinityTowerBattleFloorEntrance; }
	
	inst.cmdReqInfinityTowerBattleSelect = function() { return packet_cmd.Req.InfinityTowerBattleSelect; }
	inst.cmdAckInfinityTowerBattleSelect = function() { return packet_cmd.Ack.InfinityTowerBattleSelect; }
	
	inst.cmdReqInfinityTowerBattleFinish = function() { return packet_cmd.Req.InfinityTowerBattleFinish; }
	inst.cmdAckInfinityTowerBattleFinish = function() { return packet_cmd.Ack.InfinityTowerBattleFinish; }
	
	inst.cmdReqInfinityTowerBuyBuff = function() { return packet_cmd.Req.InfinityTowerBuyBuff; }
	inst.cmdAckInfinityTowerBuyBuff = function() { return packet_cmd.Ack.InfinityTowerBuyBuff; }
	
	inst.cmdReqInfinityTowerBuffList = function() { return packet_cmd.Req.InfinityTowerBuffList; }
	inst.cmdAckInfinityTowerBuffList = function() { return packet_cmd.Ack.InfinityTowerBuffList; }
	
	inst.cmdReqInfinityTowerBuyAwakeBuff = function() { return packet_cmd.Req.InfinityTowerBuyAwakeBuff; }
	inst.cmdAckInfinityTowerBuyAwakeBuff = function() { return packet_cmd.Ack.InfinityTowerBuyAwakeBuff; }
	
	inst.cmdReqInfinityTowerAwakeBuffList = function() { return packet_cmd.Req.InfinityTowerAwakeBuffList; }
	inst.cmdAckInfinityTowerAwakeBuffList = function() { return packet_cmd.Ack.InfinityTowerAwakeBuffList; }
	
	inst.cmdReqInfinityTowerRewardBox = function() { return packet_cmd.Req.InfinityTowerRewardBox; }
	inst.cmdAckInfinityTowerRewardBox = function() { return packet_cmd.Ack.InfinityTowerRewardBox; }
	
	inst.cmdReqInfinityTowerCashRewardBox = function() { return packet_cmd.Req.InfinityTowerCashRewardBox; }
	inst.cmdAckInfinityTowerCashRewardBox = function() { return packet_cmd.Ack.InfinityTowerCashRewardBox; }
	
	inst.cmdReqInfinityTowerSecretMazeType = function() { return packet_cmd.Req.InfinityTowerSecretMazeType; }
	inst.cmdAckInfinityTowerSecretMazeType = function() { return packet_cmd.Ack.InfinityTowerSecretMazeType; }
	
	inst.cmdReqInfinityTowerSecretMazeReset = function() { return packet_cmd.Req.InfinityTowerSecretMazeReset; }
	inst.cmdAckInfinityTowerSecretMazeReset = function() { return packet_cmd.Ack.InfinityTowerSecretMazeReset; }
	
	inst.cmdReqInfinityTowerSecretMazeEntrance = function() { return packet_cmd.Req.InfinityTowerSecretMazeEntrance; }
	inst.cmdAckInfinityTowerSecretMazeEntrance = function() { return packet_cmd.Ack.InfinityTowerSecretMazeEntrance; }
	
	inst.cmdReqInfinityTowerBattleSkip = function() { return packet_cmd.Req.InfinityTowerBattleSkip; }
	inst.cmdAckInfinityTowerBattleSkip = function() { return packet_cmd.Ack.InfinityTowerBattleSkip; }
	
	inst.cmdReqInfinityTowerAllSkip = function() { return packet_cmd.Req.InfinityTowerAllSkip; }
	inst.cmdAckInfinityTowerAllSkip = function() { return packet_cmd.Ack.InfinityTowerAllSkip; }

	inst.cmdReqInfinityTowerAccumScoreReward = function() { return packet_cmd.Req.InfinityTowerAccumScoreReward; }
	inst.cmdAckInfinityTowerAccumScoreReward = function() { return packet_cmd.Ack.InfinityTowerAccumScoreReward; }

	inst.cmdReqInfinityTowerAllClear = function() { return packet_cmd.Req.InfinityTowerAllClear; }
	inst.cmdAckInfinityTowerAllClear = function() { return packet_cmd.Ack.InfinityTowerAllClear; }
	
	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketInfinityTowerHero				= function() { return new PacketInfinityTowerData.InfinityTowerHero(); }
	inst.GetPacketInfinityTowerBuff				= function() { return new PacketInfinityTowerData.InfinityTowerBuff(); }
	inst.GetPacketInfinityTowerBattleClear		= function() { return new PacketInfinityTowerData.InfinityTowerBattleClear(); }
	inst.GetPacketInfinityTowerBattleBot		= function() { return new PacketInfinityTowerData.InfinityTowerBattleBot(); }
	inst.GetPacketInfinityTowerBattleBotHero	= function() { return new PacketInfinityTowerData.InfinityTowerBattleBotHero(); }
	inst.GetPacketInfinityTowerUser				= function() { return new PacketInfinityTowerData.InfinityTowerUser(); }

	inst.GetPacketAckInfinityTowerUser					= function() { return new PacketInfinityTowerData.AckInfinityTowerUser(); }
	inst.GetPacketAckInfinityTowerHero					= function() { return new PacketInfinityTowerData.AckInfinityTowerHero(); }
	inst.GetPacketAckInfinityTowerBot					= function() { return new PacketInfinityTowerData.AckInfinityTowerBot(); }
	inst.GetPacketAckInfinityTowerClear					= function() { return new PacketInfinityTowerData.AckInfinityTowerClear(); }
	inst.GetPacketAckInfinityTowerProcess				= function() { return new PacketInfinityTowerData.AckInfinityTowerProcess(); }
	inst.GetPacketAckInfinityTowerScoreRankList			= function() { return new PacketInfinityTowerData.AckInfinityTowerScoreRankList(); }
	inst.GetPacketAckInfinityTowerRankerDetailInfo		= function() { return new PacketInfinityTowerData.AckInfinityTowerRankerDetailInfo(); }
	inst.GetPacketAckInfinityTowerBattleFloorEntrance	= function() { return new PacketInfinityTowerData.AckInfinityTowerBattleFloorEntrance(); }
	inst.GetPacketAckInfinityTowerBattleSelect			= function() { return new PacketInfinityTowerData.AckInfinityTowerBattleSelect(); }
	inst.GetPacketAckInfinityTowerBattleFinish			= function() { return new PacketInfinityTowerData.AckInfinityTowerBattleFinish(); }
	inst.GetPacketAckInfinityTowerBuffList				= function() { return new PacketInfinityTowerData.AckInfinityTowerBuffList(); }
	inst.GetPacketAckInfinityTowerBuyBuff				= function() { return new PacketInfinityTowerData.AckInfinityTowerBuyBuff(); }
	inst.GetPacketAckInfinityTowerAwakeBuffList			= function() { return new PacketInfinityTowerData.AckInfinityTowerAwakeBuffList(); }
	inst.GetPacketAckInfinityTowerBuyAwakeBuff			= function() { return new PacketInfinityTowerData.AckInfinityTowerBuyAwakeBuff(); }
	inst.GetPacketAckInfinityTowerRewardBox				= function() { return new PacketInfinityTowerData.AckInfinityTowerRewardBox(); }
	inst.GetPacketAckInfinityTowerCashRewardBox			= function() { return new PacketInfinityTowerData.AckInfinityTowerCashRewardBox(); }
	inst.GetPacketAckInfinityTowerSecretMazeType		= function() { return new PacketInfinityTowerData.AckInfinityTowerSecretMazeType(); }
	inst.GetPacketAckInfinityTowerSecretMazeReset		= function() { return new PacketInfinityTowerData.AckInfinityTowerSecretMazeReset(); }
	inst.GetPacketAckInfinityTowerSecretMazeEntrance	= function() { return new PacketInfinityTowerData.AckInfinityTowerSecretMazeEntrance(); }
	inst.GetPacketAckInfinityTowerBattleSkip			= function() { return new PacketInfinityTowerData.AckInfinityTowerBattleSkip(); }
	inst.GetPacketAckInfinityTowerAllSkip				= function() { return new PacketInfinityTowerData.AckInfinityTowerAllSkip(); }
	inst.GetPacketAckInfinityTowerAccumScoreReward		= function() { return new PacketInfinityTowerData.AckInfinityTowerAccumScoreReward(); }
	inst.GetPacketAckInfinityTowerAllClear				= function() { return new PacketInfinityTowerData.AckInfinityTowerAllClear(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;