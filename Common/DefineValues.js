/********************************************************************
Title : DefineValues
Date : 2015.10.16
Update : 2017.04.07
Desc : 서버 Define 값
writer: dongsu
********************************************************************/
(function(exports) {
	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 이 클래스는 BT_Common.js 에서 inst 에 key, value 형식으로 만들어 진다.
	// Hero_EvolutionStatus_Factor	0.6	성급 성장 증가율
	// Hero_PromotionStatus_Factor	0	승급 성장 증가율
	// Hero_ReinforceStatus_Factor	0	승급 성장 증가율
	// Item_EvolutionStatus_Factor	0	아이템 성급 성장 증가율
	// Item_PromotionStatus_Factor	0	아이템 승급 성장 증가율
	// Item_ReinforceStatus_Factor	0	아이템 승급 성장 증가율
	// SkillGauge	1000	스킬 게이지
	// ActionGauge	1000	액션 게이지
	// TagGauge	1000	태그 게이지
	// ComboDmgRate_BAD	0.1	콤보 대미지 증가_배드
	// ComboDmgRate_Good	0.2	콤보 대미지 증가_굿
	// ComboDmgRate_Great	0.2	콤보 대미지 증가_그레이트
	// ComboDmgRate_Perfect	0.3	콤보 대미지 증가_퍼펙트
	// Defence_Factor	30000	방어력 상수
	// StaminaRecoverTime	300	스테미너 회복 시간
	// SkillPointMax	20	최대 스킬 포인트
	// SkillPointChargeAmount	20	스킬 포인트 1회 충전 시 충전되는 스킬 포인트량
	// SkillPointChargeCash	20	스킬 포인트 1회 충전 시 필요한 캐쉬 재화량
	// NotReward	0	보상 없음
	// ItemReward	1	아이템 보상
	// GoldReward	2	골드 보상
	// CashReward	3	캐쉬 보상
	// HonorPointReward	4	명예 포인트 보상
	// AlliancePointReward	5	길드 포인트 보상
	// ChallengePointReward	6	PVP 포인트 보상
	// StaminaReward	7	스테미너 보상
	// AccountExpReward	8	계정 경험치 보상
	// DailyBasicCharge_RankingMatch	5	랭킹전 일일 기본 횟수
	// CoolRemoveCash_RankingMatch	10	랭킹전 준비 시간 제거에 소모되는 캐쉬
	// MaxTeamSlot	4	팀 최대 슬롯수
	// MaxTagSlot	3	태그 최대 슬롯수
	// MaxRankingUser	30000	
	// SummonsTraitExpCash	3	소환수 특성 경험치 당 필요 캐쉬 배율
	// RankiListPageToCount	20	랭킹 리스트 페이지당 유저 수
	// AccountBuffResetNeedCash	300	계정 버프 초기화 시 필요 캐쉬
	// AccountBuffResetRefundGoldRate	0.5	계정 버프 초기화 시 환불되는 골드 비율
	// PvpBattleResource	scn_RankingMatch_001	PVP_랭킹전 배경리소스
	// PvpBackgroundFade	0.5	PVP_랭킹전 배경 페이딩 농도(0~1)
	// PvpEntranceCamera	2001	PVP_랭킹전 입장카메라[D] BT_C_DIRECTING의 DirectingID
	// PvpBGM	910010	PVP_랭킹전 BGM[D] BT_C_SOUND의 SoundID
	// GuildCreateCost	250	길드 창설 비용(캐쉬)
	// GuildInvitationMaxList	2	길드 초대 리스트 맥스
	// GuildSubscriptionApplicationMaxList	2	길드가입신청자 리스트 맥스
	// GuildAdministratorsMaxList	3	길드 관리자 리스트 맥스
	// InfinityTowerAwakeBouns	2.5	영웅의탑 점수 강적 배율
	// InfinityTowerHighBouns	2.5	영웅의탑 점수 상급 배율
	// InfinityTowerMiddleBouns	1.5	영웅의탑 점수 중급 배율
	// InfinityTowerLowBouns	0	영웅의탑 점수 하적 배율
	// InfinityTowerSecretMazeResetCash	30	영웅의탑 비밀미로 리셋 캐쉬
	// InfinityTowerBattleResource	scn_tower_map_001	영웅의탑 배경리소스
	// InfinityTowerBackgroundFade	0.5	영웅의탑 배경 페이딩 농도(0~1)
	// InfinityTowerEntranceCamera	2001	영웅의탑_랭킹전 입장카메라
	// InfinityTowerBGM	910010	영웅의탑 BGM
	// InfinityTower_GroupID	700	영웅의탑챕터ID
	// GuildRaidPlayCount	2	길드레이드 하루 이용 가능 횟수
	// GuildRaidBattleLimitTurn	20	길드 레이드  배틀 제약 턴 
	// InfinityTowerDecrease	7	접속 안했을시 감소하는 수치
	// GuilddonateCount	2	길드기부 카운트
	// GuildRaidTimeoutMinute	10080	챕터별 길드레이드 제한 시간 (minute단위)
	// PvpRaidBattleLimitTurn	30	pvp 배틀 제한턴
	// PvpStartSkillGauge	500	pvp 시작 시 스킬 게이지
	// TutorialChapterID	100	튜토리얼 던전ID
	// NormalChapterIDMax	199	시나리오 난이도 일반 던전ID  MAX 수치
	// EliteChapterIDMax	299	시나리오 난이도 어려움 던전ID  MAX 수치
	// NightmareChapterIDMax	399	시나리오 난이도 매우 어려움 던전ID  MAX 수치
	// ProjetileMoveSpeed	30	프로젝타일 비행 속도
	// Aggro_AttackerDmg_Factor	0.8	어그로 공격 시 증가 수치
	// Aggro_DefenderDmg_Factor	-0.2	어그로 피격 시 증가 수치
	// Aggro_Heal_Factor	0.5	어그로 치유 증가 수치
	// Aggro_FrontLine_Factor	2.2	어그로 앞 라인 증가 수치
	// Aggro_BackLine_Factor	0.5	어그로 뒤 라인 증가 수치
	// Aggro_NormalAttack_Factor	1	어그로 일반공격 증가 수치
	// Aggro_Active_Factor	0.25	어그로 액티브스킬 증가 수치
	// Aggro_Auto_Factor	0.45	어그로 오토스킬 증가 수치
	// Aggro_Attacker_Factor	1	어그로 attacker 증가 수치
	// Aggro_Defender_Factor	2	어그로 defender 증가 수치
	// Aggro_Supporter_Factor	1	어그로 supporter 증가 수치
	// Aggro_Universal_Factor	1	어그로 universal 증가 수치
	// Agility_Add_Hit_Factor	100	추가타횟수 = agility / Agility_Add_Hit_Factor
	// Gather_SkillGauge	400	기 모으기를 했을 때 증가되는 스킬게이지 량
	// Friend_ListMax	50	총 친구수
	// Friend_SendMax	50	보낸 친구 요청 최대 수
	// Friend_RecvMax	50	받은 친구 요청 최대 수
	// Friend_DeleteMax	5	일일 친구 삭제 수치
	// RandomShopTime	3600	랜덤상점 출현 시간 (초단위)
	// Friend_StaminaResetTime	86400	친구에게 스태미너 전송후 쿨타임 (초단위)
	// FX_SkillCaster_Idx	12037	스킬 이펙트 대상 확인시 캐스터 머리위에 생성 되는 fx 인덱스
	// VictorySoundFX	220006	VICTORY 글자에 출력될 효과음 SoundID
	// ClearRankFX	220007	클리어 랭크(별)에 출력될 효과음 SoundID
	// Card_Atk_Increase_Same	0.1	카드 공격력당 증가 피해량 (같은 속성)
	// Card_Atk_Increase_Different	0.05	카드 공격력당 증가 피해량 (다른 속성)
	// Card_Def_Increase_Same	0.1	카드 방어력당 하락 피해량 (같은 속성)
	// Card_Def_Increase_Different	0.05	카드 방어력당 하락 피해량 (다른 속성)
	// Attribute_Relation_Normal	1	카드 일반 속성 공격 시 증가 피해량
	// Attribute_Relation_Strong	1.5	카드 강 속성 공격 시 증가 피해량
	// Attribute_Relation_Weak	0.75	카드 약 속성 공격 시 증가 피해량
	// Weekly_Dungeon_Count	3	요일 던전 진입 횟수
	// Weekly_Dungeon_Count_Sunday	6	요일 던전 일요일 진입 횟수
	// Hit_Chance_Min	0.05	적중 최소치
	// Hit_Chance_Max	0.95	적중 최대치
	// Hero_Card_Defence_Num	5	영웅 최초 시작 시 
	// Npc_Card_Attack_Num	5	몬스터의 카드 공격수치(고정)
	// Npc_Card_Defence_Num	0	몬스터의 카드 방어수치(고정)
	// Defence_Skill_ID	1	방어 스킬 스킬 아이디
	// Defence_Skill_FX	12045	방어 스킬 이펙트
	// Potion_Cooltime	4	포션 사용 쿨타임
	// Potion_Heal	0.2	포션 사용 시 회복 되는 hp 량
	// Potion_FX	190	포션의 FX 아이디
	// Fever_Gauge_Max	10000	피버게이지 최대량
	// NextTurnSound	100000	다음 턴이 올 때의 효과음 SoundID
	// MissSound	100002	공격 미스시의 효과음 SoundID
	// CharacterAreaAlly	12046	활성 아군 캐릭터 표시
	// CharacterAreaEnemy	12047	활성 적군 캐릭터 표시
	// IntroRunSound	100058	배틀 시작시 달리는 효과음 SoundID
	// ItemPotionSound	100018	포션 사용시 효과음 SoundID
	// AmbushSuccessSound	120007	기습 성공시 일반 효과음 ID
	// AmbushTurnSound	120008	기습 성공시 턴이 돌아올 때 효과음 ID
	// AmbushTextSound	120009	기습 성공시 글자 박히는 효과음 ID
	// CharacterAreaAllyBow	12049	활성 아군 캐릭터 표시
	// CharacterAreaAllyMagic	12050	활성 아군 캐릭터 표시
	// CharacterAreaAllyShield	12051	활성 아군 캐릭터 표시
	// CharacterAreaAllySword	12052	활성 아군 캐릭터 표시
	// CharacterAreaEnemyBow	12053	활성 적군 캐릭터 표시
	// CharacterAreaEnemyMagic	12054	활성 적군 캐릭터 표시
	// CharacterAreaEnemyShield	12055	활성 적군 캐릭터 표시
	// CharacterAreaEnemySword	12056	활성 적군 캐릭터 표시
	// ProphecySpringResetCost	100	예언의 샘 리셋 비용
	// HeroMpMax	100	전투 진입 시 영웅의 MP최대치
	// RecorveryMp	15	동일 속성 카드 사용 시 한 장당 회복되는 MP량
	// RecorveryAnotherElementMp 	5	다른 속성 카드 사용 시 한장당 회복되는 mp량
	// StartMp	50	시작시 카드 mp
	// Uesr_To_Card_Element_Count_1	3	유저 속성이 1가지 일 때 카드의 개수
	// Uesr_To_Card_Element_Count_2	3	유저 속성이 2가지 일 때 카드의 개수
	// Uesr_To_Card_Element_Count_3	4	유저 속성이 3가지 일 때 카드의 개수
	// Uesr_To_Card_Element_Count_4	4	유저 속성이 4가지 일 때 카드의 개수
	// GuildBuffSkillLevelMax	10	길드 버프 스킬 레벨 최대치
	// Card_Atk_Max	9	카드 공격 수치 최대치
	// Card_Def_Max	9	카드 공격 수치 최대치
	// EquipmentInventoryBasic	100	장비 인벤토리 최초 수치
	// EquipItemMaxLv	20	
	// EquipItemMaxEnchant	10	
	// EquipSlotSetMin	2	
	// EquipSlotSetMax	4	
	// ProphecySpring_Count	3	예언의 샘 입장 횟수
	// Max_LeadershipGauge	1000	통솔력 최대 수치
	// RecorverySameElementLeadership	10	같은 속성일 때 리더쉽 상승 수치
	// RecorveryAnotherElementLeadership	30	다른 속성일 때 리더쉽 상승 수치
	// PvpChargeCash	5	PVP 1회 충전 시 소모되는 캐쉬
	// PvpCountMax	10	PVP 이용 기본 횟수 최대치
	// PvpActualOpenLeague	3	현재 오픈되어 있는 PVP 리그 (0:브론즈,1:실버,2:골드,3:플레티넘,5:다이아)
	// ChargeUseCount	3	차지 연속 실행 횟수
	// ChargeAttackUp	0.2	차지 공격력 증가 수치
	// MaxStageClearGrade	3	최대 스테이지 클리어 등급(별3개)
	// MaxVipStep	15	최대 VIP 단계
	// OneDayHours	24	24시간
	// MinLevel	25	영웅 레벨업 계산에 사용되는 최소 레벨
	// GuildRaidChapter	3	챕터 타입 : 길드 레이드
	// ScenarioHard	6	챕터 타입 : 예언의 샘(시나리오 정예)
	// EquipSlotWeapon	1	장비 장착 인덱스 : 무기
	// EquipSlotBody	2	장비 장착 인덱스 : 상의
	// EquipSlotPant	3	장비 장착 인덱스 : 하의
	// EquipSlotShoes	4	장비 장착 인덱스 : 신발
	// FirstCategoryConsumption	1	아이템 카테고리 1 : 소비 아이템
	// FirstCategoryEquipment	2	아이템 카테고리 1 : 장비 아이템
	// FirstCategoryHero	3	아이템 카테고리 1 : 영웅
	// SecondCategoryExpScrollByConsumption	3	아이템 카테고리 2 : 영웅 경험치
	// SecondCategorySummonHero	1	아이템 카테고리 2 : 영웅
	// SecondCategoryRandomBoxByConsumption	4	아이템 카테고리 2 : 랜덤 상자
	// SecondCategoryMoneyByConsumption	5	아이템 카테고리 2 : 골드 획득
	// GameModeNormal	1	게임 모드 : 일반(시나리오)
	// GameModeInfinityTower	8	게임 모드 : 영웅의 탑
	// MaxMailReward	5	우편 : 최대 보상 수
	// MaxMailCount	100	우편 : 최대 보유 우편 수
	// ItemMail	ITEM	우편 : 아이템 우편
	// MailStringInfinityTowerRankReward1	3	우편 문자열 : BT_C_LOCALIZATION.xlsx 의 BT_MAIL_REWARD_TEXT 시트
	// MailStringInfinityTowerRankReward2	4	우편 문자열 : BT_C_LOCALIZATION.xlsx 의 BT_MAIL_REWARD_TEXT 시트
	// MailStringGuildRaidStageRankReward1	5	우편 문자열 : BT_C_LOCALIZATION.xlsx 의 BT_MAIL_REWARD_TEXT 시트
	// MailStringGuildRaidStageRankReward2	6	우편 문자열 : BT_C_LOCALIZATION.xlsx 의 BT_MAIL_REWARD_TEXT 시트
	// MailStringGuildRaidChapterRankReward1	7	우편 문자열 : BT_C_LOCALIZATION.xlsx 의 BT_MAIL_REWARD_TEXT 시트
	// MailStringGuildRaidChapterRankReward2	8	우편 문자열 : BT_C_LOCALIZATION.xlsx 의 BT_MAIL_REWARD_TEXT 시트
	// NormalShop	1	일반 상점
	// PvpShop	3	PVP 상점
	// GuildShop	4	길드 상점
	// RandomShop	2	랜덤 상점
	// ChallengeShop	5	도전 포인트 상점
	// MaxShopItemCount	12	최대 상점 아이템 수
	// InfinityTowerBattleFloor	1	영웅의 탑 : 배틀 층
	// InfinityTowerBuffShopFloor	2	영웅의 탑 : 버프 상점 층
	// InfinityTowerRewardBoxFloor	3	영웅의 탑 : 보상 층
	// InfinityTowerSecretMazeFloor	4	영웅의 탑 : 비밀미로 층
	// InfinityTowerBattleLow	1	영웅의 탑 배틀 난이도 : 하
	// InfinityTowerBattleMiddle	2	영웅의 탑 배틀 난이도 : 중
	// InfinityTowerBattleHigh	3	영웅의 탑 배틀 난이도 : 상
	// InfinityTowerBattleAwake	4	영웅의 탑 배틀 난이도 : 강적
	// InfinityTowerRankScorePlusPercent	0.2	랭크 점수 가산 포인트
	// InfinityTowerSecretMazeBuffShop	3	비밀미로 버프 상점
	// InfinityTowerSkipPointMinus	7	영웅의 탑 스킵 포인트
	// GuildAuthMaster	1	길드장
	// GuildAuthElder	2	부길드장
	// GuildAuthMember	3	길드원
	// GuildRaidRankStageReward	0	길드 레이드 랭크 스테이지 보상
	// GuildJoinPendingApprovalWait	0	길드 가입 대기
	// GuildJoinPendingApprovalAccept	1	길드 가입 수락
	// GuildJoinPendingApprovalReject	2	길드 가입 거절
	// GuildJoinOptionFree	1	길드 가입 옵션 : 제한 없음
	// GuildJoinOptionApproval	2	길드 가입 옵션 : 승인 가입
	// GuildJoinOptionDisable	3	길드 가입 옵션 : 가입 못함
	// GachaPriceTypeGold	1	골드 가챠
	// GachaPriceTypeCash	2	캐쉬 가챠
	// FriendTakeStamina	5	친구에게 받는 보너스 스태미너
	// FriendBonusStamina	2	친구에게 스태미너 전송 후 얻는 보너스 스태미너
	// FriendOneDayRequestCount	50	하루동안 친구 요청 제한 수
	// AccountBuffPoint	3	계정 버프 획득 포인트
	// DarkDungoneWait	0	어둠의 던전 : 대기
	// DarkDungoneStart	1	어둠의 던전 : 입장
	// DarkDungoneBattleSuccess	2	어둠의 던전 : 배틀 성공
	// DarkDungoneBattleFailed	3	어둠의 던전 : 배틀 실패
	// DarkDungoneComplete	4	어둠의 던전 : 완료
	// SkillEffectNone	None	스킬 이펙트 : 없음
	// SkillEffectClearGoldUp	Passive_ClearGoldUp	스킬 이펙트 : 골드 추가 획득
	// SkillEffectHeroExpUp	Passive_HeroExpUp	스킬 이펙트 : 영웅 경험치 추가 획득
	// SkillEffectCallGuild	GUILD	스킬 이펙트 : 호출 위치
	// DailyMission	1	일일 미션
	// WeeklyMission	3	주간 미션
	// ConquestyMission	5	정복 미션
	// MaxGuildElderCount	3	부길드장 수
	// TransferGuildMaster	1	길드장 변경
	// AppointElder	2	부길드장 임명
	// DemoteElder	3	부길드장 해임

	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
