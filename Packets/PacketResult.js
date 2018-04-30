/********************************************************************
Title : PacketResult
Date : 2016.07.27
Update : 2017.04.13
Desc : 패킷 정의 - 실패 원인
writer : dongsu -> jongwook
********************************************************************/
var fp = require('fs');

(function (exports) {
	// private 변수

	// public 변수.
	var inst = {};
	inst.LoadPacketResult = function() {
		logger.debug('**** Packet result code init ****');

		fp.readFile('./Packets/PacketResultCode.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			ret_code = JSON.parse(data);
		});
	}	

	//------------------------------------------------------------------------------------------------------------------
	inst.retSuccess = function() { return ret_code.Success; }
	inst.retFail	= function() { return ret_code.Fail; }

	inst.retSuccessGuildPendingApproval		= function() { return ret_code.SuccessGuildPendingApproval; }
	inst.retAlreadyGuildJoinPendingApproval	= function() { return ret_code.AlreadyGuildJoinPendingApproval; }
	inst.retFailMailRewardAll				= function() { return ret_code.FailMailRewardAll; }

	inst.retNotExistItemInInven				= function() { return ret_code.NotExistItemInInven; }
	inst.retNotExistStageInUser				= function() { return ret_code.NotExistStageInUser; }
	inst.retNotExistHeroInUser				= function() { return ret_code.NotExistHeroInUser; }
	inst.retNotExistGuild					= function() { return ret_code.NotExistGuild; }
	inst.retNotExistMailInUser				= function() { return ret_code.NotExistMailInUser; }
	inst.retNotExistRecvStaminaTimeOver		= function() { return ret_code.NotExistRecvStaminaTimeOver; }
	inst.retNotExistUser					= function() { return ret_code.NotExistUser; }
	inst.retNotExistNeedAccountBuff			= function() { return ret_code.NotExistNeedAccountBuff; }
	inst.retNotExistEquipRune				= function() { return ret_code.NotExistEquipRune; }
 
	inst.retNotEnoughUserLevel				= function() { return ret_code.NotEnoughUserLevel; }
	inst.retNotEnoughHeroLevel				= function() { return ret_code.NotEnoughHeroLevel; }
	inst.retNotEnoughLevel					= function() { return ret_code.NotEnoughLevel; }
	inst.retNotEnoughStar					= function() { return ret_code.NotEnoughStar; }
	inst.retNotEnoughAccountBuffLevel		= function() { return ret_code.NotEnoughAccountBuffLevel; }
	inst.retNotEnoughNeedItem				= function() { return ret_code.NotEnoughNeedItem; }
	inst.retNotEnoughGold					= function() { return ret_code.NotEnoughGold; }
	inst.retNotEnoughCash					= function() { return ret_code.NotEnoughCash; }
	inst.retNotEnoughStamina				= function() { return ret_code.NotEnoughStamina; }
	inst.retNotEnoughClearGrade				= function() { return ret_code.NotEnoughClearGrade; }
	inst.retNotEnoughBuyCount				= function() { return ret_code.NotEnoughBuyCount; }
	inst.retNotEnoughExecCount				= function() { return ret_code.NotEnoughExecCount; }
	inst.retNotEnoughItemLevel				= function() { return ret_code.NotEnoughItemLevel; }
	inst.retNotEnoughVipStep				= function() { return ret_code.NotEnoughVipStep; }
	inst.retNotEnoughAuth					= function() { return ret_code.NotEnoughAuth; }
	inst.retNotEnoughSkillPoint				= function() { return ret_code.NotEnoughSkillPoint; }
	inst.retNotEnoughCondition				= function() { return ret_code.NotEnoughCondition; }
	inst.retNotEnoughPvPPoint				= function() { return ret_code.NotEnoughPvPPoint; }
	inst.retNotEnoughGuildPoint				= function() { return ret_code.NotEnoughGuildPoint; }
	inst.retNotEnoughChallengePoint			= function() { return ret_code.NotEnoughChallengePoint; }
	inst.retNotEnoughRuneCraftPoint			= function() { return ret_code.NotEnoughRuneCraftPoint; }
	inst.retNotEnoughHeroCount				= function() { return ret_code.NotEnoughHeroCount; }
	inst.retNotEnoughTowerCashRewardBoxCount= function() { return ret_code.NotEnoughTowerCashRewardBoxCount; }
	inst.retNotEnoughTowerTicket			= function() { return ret_code.NotEnoughTowerTicket; }
	inst.retNotEnoughTowerSkipPoint			= function() { return ret_code.NotEnoughTowerSkipPoint; }
	inst.retNotEnoughGuildPointDonationCount= function() { return ret_code.NotEnoughGuildPointDonationCount; }
	inst.retNotEnoughGuildRaidBattleCount	= function() { return ret_code.NotEnoughGuildRaidBattleCount; }
	inst.retNotEnoughItemPromotionStep		= function() { return ret_code.NotEnoughItemPromotionStep; }
	inst.retNotNotEnoughAccumAttendDate		= function() { return ret_code.NotNotEnoughAccumAttendDate; }
	inst.retNotEnoughOneDayHours			= function() { return ret_code.NotEnoughOneDayHours; }
	inst.retNotEnoughNeedItemKind			= function() { return ret_code.NotEnoughNeedItemKind; }
	inst.retNotEnoughRewardMail				= function() { return ret_code.NotEnoughRewardMail; }
	inst.retNotEnoughAccountBuffPoint		= function() { return ret_code.NotEnoughAccountBuffPoint; }

	inst.retAlreadyMaxLevel				= function() { return ret_code.AlreadyMaxLevel; }
	inst.retAlreadyMaxGambleRate		= function() { return ret_code.AlreadyMaxGambleRate; }
	inst.retAlreadyMaxPromotionStep		= function() { return ret_code.AlreadyMaxPromotionStep; }
	inst.retAlreadyMaxEvolutionStep		= function() { return ret_code.AlreadyMaxEvolutionStep; }
	inst.retAlReadyExistGuildName		= function() { return ret_code.AlReadyExistGuildName; }
	inst.retAlReadyJoinGuild			= function() { return ret_code.AlReadyJoinGuild; }
	inst.retAlreadyAnotherGuildMember	= function() { return ret_code.AlreadyAnotherGuildMember; }
	inst.retAlreadyInviteTarget			= function() { return ret_code.AlreadyInviteTarget; }
	inst.retAlreadyMaxElderCount		= function() { return ret_code.AlreadyMaxElderCount; }
	inst.retAlreadyComplete				= function() { return ret_code.AlreadyComplete; }
	inst.retAlreadyRewardPayment		= function() { return ret_code.AlreadyRewardPayment; }
	inst.retAlreadyFighting				= function() { return ret_code.AlreadyFighting; }
	inst.retAlreadyOpenRuneSlot			= function() { return ret_code.AlreadyOpenRuneSlot; }
	inst.retAlreadySummonOpen			= function() { return ret_code.AlreadySummonOpen; }
	inst.retAlreadyUse					= function() { return ret_code.AlreadyUse; }
	inst.retAlreadyTowerSecretMazeReset	= function() { return ret_code.AlreadyTowerSecretMazeReset; }
	inst.retAlreadyTowerBuyBuff			= function() { return ret_code.AlreadyTowerBuyBuff; }
	inst.retAlreadyTowerAccumScoreReward= function() { return ret_code.AlreadyTowerAccumScoreReward; }
	inst.retAlreadyGuildLevelMax		= function() { return ret_code.AlreadyGuildLevelMax; }
	inst.retAlreadyGuildRaidChapterOpen	= function() { return ret_code.AlreadyGuildRaidChapterOpen; }
	inst.retAlreadyChapterRewardBox		= function() { return ret_code.AlreadyChapterRewardBox; }
	inst.retAlreadyRewardMail			= function() { return ret_code.AlreadyRewardMail; }
	inst.retAlreadySameNick				= function() { return ret_code.AlreadySameNick; }
	inst.retAlreadySameUserIcon			= function() { return ret_code.AlreadySameUserIcon; }
	inst.retAlreadyExistHero			= function() { return ret_code.AlreadyExistHero; }
	inst.retAlreadyMaxEnchantStep		= function() { return ret_code.AlreadyMaxEnchantStep; }	
	inst.retAlreadyMax					= function() { return ret_code.AlreadyMax; }	
	inst.retAlreadyGuildElder			= function() { return ret_code.AlreadyGuildElder; }
		
	inst.retExistNotAbleHero			= function() { return ret_code.ExistNotAbleHero; }
	inst.retNotMatchDayOfWeek			= function() { return ret_code.NotMatchDayOfWeek; }
	inst.retNotMatchTowerFloorType		= function() { return ret_code.NotMatchTowerFloorType; }
	inst.retNotMatchTowerBattleType		= function() { return ret_code.NotMatchTowerBattleType; }

	inst.retEmptyHeroSlot				= function() { return ret_code.EmptyHeroSlot; }

	inst.retUnchangedLevel				= function() { return ret_code.UnchangedLevel; }

	inst.retIncorrectUseCount			= function() { return ret_code.IncorrectUseCount; }
	inst.retIncorrectItem				= function() { return ret_code.IncorrectItem; }
	inst.retIncorrectTargetUser 		= function() { return ret_code.IncorrectTargetUser; }
	inst.retIncorrectMailID 			= function() { return ret_code.IncorrectMailID; }
	inst.retIncorrectSellCount 			= function() { return ret_code.IncorrectSellCount; }
	inst.retIncorrectTowerSkipPointFloor= function() { return ret_code.IncorrectTowerSkipPointFloor; }
	inst.retIncorrectDate				= function() { return ret_code.IncorrectDate; }
	inst.retIncorrectNick				= function() { return ret_code.IncorrectNick; }
	inst.retIncorrectUserIconID			= function() { return ret_code.IncorrectUserIconID; }
	inst.retIncorrectBindHeroID			= function() { return ret_code.IncorrectBindHeroID; }

	inst.retRemainTime					= function() { return ret_code.RemainTime; }

	inst.retJoinOptionIsDisabled		= function() { return ret_code.JoinOptionIsDisabled; }
	inst.retArriveInMaxMemberCount		= function() { return ret_code.ArriveInMaxMemberCount; }
	inst.retNotGuildMember				= function() { return ret_code.NotGuildMember; }
	inst.retExistGuildMember			= function() { return ret_code.ExistGuildMember; }
	inst.retOverInviteCount				= function() { return ret_code.OverInviteCount; }
	inst.retUndefinedChangeAuthType		= function() { return ret_code.UndefinedChangeAuthType; }
	inst.retTargetIsNotElder			= function() { return ret_code.TargetIsNotElder; }
	inst.retNotGuildMaster				= function() { return ret_code.NotGuildMaster; }
	inst.retNotOpenGuildRaidChapter		= function() { return ret_code.NotOpenGuildRaidChapter; }
	inst.retClosedGuildRaidChapter		= function() { return ret_code.ClosedGuildRaidChapter; }
	inst.retElderOpenRaidFalse			= function() { return ret_code.ElderOpenRaidFalse; }	

	inst.retNotSellItem					= function() { return ret_code.NotSellItem; }
	inst.retAttendAccumOverToday		= function() { return ret_code.AttendAccumOverToday; }
	inst.retRandomShopClosed			= function() { return ret_code.RandomShopClosed; }
	inst.retNotResetRandomShop			= function() { return ret_code.NotResetRandomShop; }
	inst.retNotMatchRuneSlot			= function() { return ret_code.NotMatchRuneSlot; }

	inst.retFriendDeleteLimit			= function() { return ret_code.FriendDeleteLimit; }
	inst.retMessageTextIsBlank			= function() { return ret_code.MessageTextIsBlank; }
	inst.retAlreadyFriend				= function() { return ret_code.AlreadyFriend; }
	inst.retTargetFriendLimit			= function() { return ret_code.TargetFriendLimit; }
	inst.retUserFriendLimit				= function() { return ret_code.UserFriendLimit; }
	inst.retNoTargetUser				= function() { return ret_code.NoTargetUser; }
	inst.retFriendRequestLimit			= function() { return ret_code.FriendRequestLimit; }
	inst.retNoFriendRequest				= function() { return ret_code.NoFriendRequest; }
	inst.retAlreadyRecvStamina			= function() { return ret_code.AlreadyRecvStamina; }

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;