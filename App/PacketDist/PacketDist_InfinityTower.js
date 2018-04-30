/********************************************************************
Title : PacketDist_InfinityTower
Date : 2016.03.24
Update : 2017.03.24
Desc : 패킷 연결 - 무한탑
writer: jongwook
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketInfinityTower = require('../../Packets/PacketInfinityTower/PacketInfinityTower.js');

var TowerUserInfo		= require('../../Contents/InfinityTower/TowerUserInfo.js');
var TowerHeroInfo		= require('../../Contents/InfinityTower/TowerHeroInfo.js');
var TowerBotInfo		= require('../../Contents/InfinityTower/TowerBotInfo.js');
var TowerClearInfo		= require('../../Contents/InfinityTower/TowerClearInfo.js');
var TowerProcessInfo	= require('../../Contents/InfinityTower/TowerProcessInfo.js');
var TowerScoreRankInfo	= require('../../Contents/InfinityTower/TowerScoreRankInfo.js');
var TowerAllClear		= require('../../Contents/InfinityTower/TowerAllClear.js');

var TowerBattleEntrance	= require('../../Contents/InfinityTower/TowerBattleEntrance.js');
var TowerBattleSelect	= require('../../Contents/InfinityTower/TowerBattleSelect.js');
var TowerBattleFinish	= require('../../Contents/InfinityTower/TowerBattleFinish.js');
var TowerBuffList		= require('../../Contents/InfinityTower/TowerBuffList.js');
var TowerBuffBuy		= require('../../Contents/InfinityTower/TowerBuffBuy.js');
var TowerRewardFloor	= require('../../Contents/InfinityTower/TowerRewardFloor.js');
var TowerSecretMaze		= require('../../Contents/InfinityTower/TowerSecretMaze.js');
var TowerScoreReward	= require('../../Contents/InfinityTower/TowerScoreReward.js');

var TowerBattleSkip	= require('../../Contents/InfinityTower/TowerBattleSkip.js');
var TowerAllSkip	= require('../../Contents/InfinityTower/TowerAllSkip.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if (recv == null) {
			logger.error('Error Packet Convert - cmd is:', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if (user == undefined) {
			logger.error('Error Packet Not Find: %s, User Socket ID:', p_cmd, p_socket.id);
			return;
		}

		if ( recv.packet_srl == user.GetPacketBuf().packet_srl ) {
			logger.info('UUID : %d, PacketSrl : %d Already Recv Packet Request', user.uuid, recv.packet_srl);
			p_socket.emit(user.GetPacketBuf().packet_cmd, JSON.stringify(user.GetPacketBuf().packet_data));
			return;
		}
			
		// 분배.
		var ack_cmd = undefined;
		var ack_packet = undefined;

		try {
			switch(p_cmd) {
				// 무한탑 정보 - 유저
				case PacketInfinityTower.inst.cmdReqInfinityTowerUser() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerUser();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerUser();
					ack_packet.packet_srl = recv.packet_srl;

					TowerUserInfo.inst.ReqTowerUserInfo(user, recv, ack_cmd, ack_packet);
					break;

				// 무한탑 정보 - 영웅
				case PacketInfinityTower.inst.cmdReqInfinityTowerHero() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerHero();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerHero();
					ack_packet.packet_srl = recv.packet_srl;

					TowerHeroInfo.inst.ReqTowerHeroInfo(user, recv, ack_cmd, ack_packet);
					break;

				// 무한탑 정보 - 봇
				case PacketInfinityTower.inst.cmdReqInfinityTowerBot() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerBot();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerBot();
					ack_packet.packet_srl = recv.packet_srl;

					TowerBotInfo.inst.ReqTowerBotInfo(user, recv, ack_cmd, ack_packet);
					break;

				// 무한탑 정보 - 전날 클리어 탑
				case PacketInfinityTower.inst.cmdReqInfinityTowerClear() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerClear();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerClear();
					ack_packet.packet_srl = recv.packet_srl;

					TowerClearInfo.inst.ReqTowerClearInfo(user, recv, ack_cmd, ack_packet);
					break;

				// 무한탑 정보 - 진행중인 층
				case PacketInfinityTower.inst.cmdReqInfinityTowerProcess() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerProcess();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerProcess();
					ack_packet.packet_srl = recv.packet_srl;

					TowerProcessInfo.inst.ReqTowerProcessInfo(user, recv, ack_cmd, ack_packet);
					break;

				// 무한탑 정보 - 배틀 점수 랭크 리스트
				case PacketInfinityTower.inst.cmdReqInfinityTowerScoreRankList() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerScoreRankList();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerScoreRankList();
					ack_packet.packet_srl = recv.packet_srl;

					TowerScoreRankInfo.inst.ReqTowerScoreRankList(user, recv, ack_cmd, ack_packet);
					break;

				// 무한탑 정보 - 랭커 상세 정보
				case PacketInfinityTower.inst.cmdReqInfinityTowerRankerDetailInfo() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerRankerDetailInfo();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerRankerDetailInfo();
					ack_packet.packet_srl = recv.packet_srl;

					TowerScoreRankInfo.inst.ReqTowerRankerDetailInfo(user, recv, ack_cmd, ack_packet);
					break;

				// 배틀 층 입장
				case PacketInfinityTower.inst.cmdReqInfinityTowerBattleFloorEntrance() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerBattleFloorEntrance();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerBattleFloorEntrance();
					ack_packet.packet_srl = recv.packet_srl;

					TowerBattleEntrance.inst.ReqTowerBattleEntrance(user, recv, ack_cmd, ack_packet);
					break;

				// 배틀 층 : 배틀 상대 선택
				case PacketInfinityTower.inst.cmdReqInfinityTowerBattleSelect() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerBattleSelect();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerBattleSelect();
					ack_packet.packet_srl = recv.packet_srl;

					TowerBattleSelect.inst.ReqTowerBattleSelect(user, recv, ack_cmd, ack_packet);
					break;

				// 배틀 층 : 배틀 종료
				case PacketInfinityTower.inst.cmdReqInfinityTowerBattleFinish() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerBattleFinish();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerBattleFinish();
					ack_packet.packet_srl = recv.packet_srl;

					TowerBattleFinish.inst.ReqTowerBattleFinish(user, recv, ack_cmd, ack_packet);
					break;

				// 버프상점 층 : 버프 저장
				case PacketInfinityTower.inst.cmdReqInfinityTowerBuffList() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerBuffList();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerBuffList();
					ack_packet.packet_srl = recv.packet_srl;

					TowerBuffList.inst.ReqTowerBuffList(user, recv, ack_cmd, ack_packet);
					break;

				// 버프상점 층 : 버프 구매
				case PacketInfinityTower.inst.cmdReqInfinityTowerBuyBuff() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerBuyBuff();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerBuyBuff();
					ack_packet.packet_srl = recv.packet_srl;

					TowerBuffBuy.inst.ReqBuyTowerBuff(user, recv, ack_cmd, ack_packet);
					break;

				// 보물상자 층 : 보상 획득
				case PacketInfinityTower.inst.cmdReqInfinityTowerRewardBox() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerRewardBox();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerRewardBox();
					ack_packet.packet_srl = recv.packet_srl;

					TowerRewardFloor.inst.ReqTowerRewardBox(user, recv, ack_cmd, ack_packet);
					break;

				// 보물상자 층 : 캐쉬 보상 획득
				case PacketInfinityTower.inst.cmdReqInfinityTowerCashRewardBox() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerCashRewardBox();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerCashRewardBox();
					ack_packet.packet_srl = recv.packet_srl;

					TowerRewardFloor.inst.ReqTowerRewardBoxByCash(user, recv, ack_cmd, ack_packet);
					break;

				// 비밀미로 층 : 층 정보 저장
				case PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeType() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerSecretMazeType();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerSecretMazeType();
					ack_packet.packet_srl = recv.packet_srl;

					TowerSecretMaze.inst.ReqTowerSecretMazeType(user, recv, ack_cmd, ack_packet);
					break;

				// 비밀미로 층 : 층 정보 리셋
				case PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeReset() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerSecretMazeReset();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerSecretMazeReset();
					ack_packet.packet_srl = recv.packet_srl;

					TowerSecretMaze.inst.ReqTowerSecretMazeReset(user, recv, ack_cmd, ack_packet);
					break;

				// 비밀미로 층 : 층 입장
				case PacketInfinityTower.inst.cmdReqInfinityTowerSecretMazeEntrance() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerSecretMazeEntrance();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerSecretMazeEntrance();
					ack_packet.packet_srl = recv.packet_srl;

					TowerSecretMaze.inst.ReqTowerSecretMazeEntrance(user, recv, ack_cmd, ack_packet);
					break;

				// 배틀 스킵
				case PacketInfinityTower.inst.cmdReqInfinityTowerBattleSkip() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerBattleSkip();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerBattleSkip();
					ack_packet.packet_srl = recv.packet_srl;

					TowerBattleSkip.inst.ReqTowerBattleSkip(user, recv, ack_cmd, ack_packet);
					break;

				// 배틀 스킵 - 전체
				case PacketInfinityTower.inst.cmdReqInfinityTowerAllSkip() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerAllSkip();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerAllSkip();
					ack_packet.packet_srl = recv.packet_srl;

					TowerAllSkip.inst.ReqTowerAllSkip(user, recv, ack_cmd, ack_packet);
					break;

				// 배틀 스킵 - 누적 점수 보상
				case PacketInfinityTower.inst.cmdReqInfinityTowerAccumScoreReward() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerAccumScoreReward();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerAccumScoreReward();
					ack_packet.packet_srl = recv.packet_srl;

					TowerScoreReward.inst.ReqTowerScoreReward(user, recv, ack_cmd, ack_packet);
					break;

				// 무한탑 완료
				case PacketInfinityTower.inst.cmdReqInfinityTowerAllClear() :
					ack_cmd		= PacketInfinityTower.inst.cmdAckInfinityTowerAllClear();
					ack_packet	= PacketInfinityTower.inst.GetPacketAckInfinityTowerAllClear();
					ack_packet.packet_srl = recv.packet_srl;

					TowerAllClear.inst.ReqTowerAllClear(user, recv, ack_cmd, ack_packet);
					break;

				default :
					logger.error('Error Packet Dist! cmd:', p_cmd);
					break;
			}
		} catch (p_error) {
			err_report.inst.SendReportExecption(user.uuid, user.account, ack_cmd, p_error.stack);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;