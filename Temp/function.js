/*!50003 DROP FUNCTION IF EXISTS `fn_add_hero_exp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_add_hero_exp`(
	p_UUID int
    , p_HERO_ID int
    , p_ADD_EXP int) RETURNS int(11)
BEGIN
	# 영웅 경험치 설정(레벨업 포합)
    declare m_user_level int default 0;
    declare m_hero_exp int default 0;
    declare m_hero_level int default 0;
    declare m_target_level int default 0;
    declare m_target_exp int default 0;
	
    if (p_ADD_EXP = 0) then 
		return -1;
	end if;
    
    # 영웅 레벨은 계정 레벨을 넘을 수 없다.
    select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID and EXIST_YN = true;
    
    # 영웅 정보
	select ifnull(HERO_LEVEL, 0), ifnull(EXP, 0) into m_hero_level, m_hero_exp from GT_HEROes WHERE UUID = p_UUID and HERO_ID = p_HERO_ID and EXIST_YN = true;
    
    if (m_hero_level = 0) then
		return -2;
    end if;
    
    # 경험치 계산
    set m_hero_exp = m_hero_exp + p_ADD_EXP;
    
    select A.TARGET_LEVEL, A.HERO_TOTAL_EXP into m_target_level, m_target_exp
	from (select TARGET_LEVEL, HERO_TOTAL_EXP from BT_EXPs where HERO_TOTAL_EXP <= m_hero_exp) as A 
	where A.TARGET_LEVEL <= m_user_level + 1 and A.TARGET_LEVEL <= (select TARGET_LEVEL from BT_EXPs order by TARGET_LEVEL desc limit 1)
	order by A.TARGET_LEVEL desc limit 1;
    
    update GT_HEROes set HERO_LEVEL = if (m_target_level > m_user_level, m_user_level, m_target_level), EXP = if (m_target_level > m_user_level, m_target_exp, m_hero_exp)
    where UUID = p_UUID and HERO_ID = p_HERO_ID and EXIST_YN = true;
    
	return p_HERO_ID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_add_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_add_item`(
	p_UUID int
    , p_ITEM_ID int
    , p_ADD_ITEM_COUNT int) RETURNS int(11)
BEGIN
	# 인벤토리에 아이템을 추가 하고 IUID를 반환 한다.
    
    declare m_curr_count int default 0;
    declare m_ret_count int default 0;
    declare m_iuid int default 0;
	
    if (p_ITEM_ID = 0) then 
		return 0;
	end if;
    
    # 가방에서 아이템 확인
	select ifnull(IUID, 0), ifnull(ITEM_COUNT, 0) into m_iuid, m_curr_count from GT_INVENTORies WHERE UUID = p_UUID and ITEM_ID = p_ITEM_ID and EXIST_YN = 1;
    
    # 아이템 수 계산
    set m_ret_count = m_curr_count + p_ADD_ITEM_COUNT;
    
    if (m_ret_count > 0) then # 0 보다 크다
		if (m_iuid > 0) then
			update GT_INVENTORies set ITEM_COUNT = m_ret_count where UUID = p_UUID and ITEM_ID = p_ITEM_ID and EXIST_YN = 1;
        else
			insert into GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT) values (p_UUID, p_ITEM_ID, m_ret_count);
            set m_iuid = (SELECT LAST_INSERT_ID());
        end if;
	elseif (m_ret_count <= 0) then # 0 보다 작다
		if (m_iuid > 0) then
			update GT_INVENTORies set ITEM_COUNT = 0, EXIST_YN = 0 where UUID = p_UUID and ITEM_ID = p_ITEM_ID and EXIST_YN = 1;
        end if;
    end if;
    
	return m_iuid;	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_add_rune` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_add_rune`(
	p_UUID int
    , p_RUNE_TYPE int
    , p_ITEM_ID int
    , p_ITEM_LEVEL int
    , p_ADD_ITEM_COUNT int) RETURNS int(11)
BEGIN
	# 인벤토리에 아이템을 추가 하고 IUID를 반환 한다.
    
    declare m_curr_count int default 0;
    declare m_ret_count int default 0;
    declare m_ruid int default 0;
	
    if (p_ITEM_ID = 0) then 
		return 0;
	end if;
    
    # 룬 아이템 확인
	select ifnull(RUID, 0), ifnull(ITEM_COUNT, 0) into m_ruid, m_curr_count from GT_HERO_RUNEs WHERE UUID = p_UUID and ITEM_ID = p_ITEM_ID and ITEM_LEVEL = p_ITEM_LEVEL and EXIST_YN = 1;
    
    # 아이템 수 계산
    set m_ret_count = m_curr_count + p_ADD_ITEM_COUNT;
    
    if (m_ret_count > 0) then # 0 보다 크다
		if (m_ruid > 0) then
			update GT_HERO_RUNEs set ITEM_COUNT = m_ret_count where UUID = p_UUID and ITEM_ID = p_ITEM_ID and ITEM_LEVEL = p_ITEM_LEVEL and EXIST_YN = 1;
        else
			insert into GT_HERO_RUNEs (UUID, RUNE_TYPE, ITEM_ID, ITEM_COUNT, ITEM_LEVEL) values (p_UUID, p_RUNE_TYPE, p_ITEM_ID, m_ret_count, p_ITEM_LEVEL);
            set m_ruid = (SELECT LAST_INSERT_ID());
        end if;
	elseif (m_ret_count <= 0) then # 0 보다 작다
		if (m_ruid > 0) then
			update GT_HERO_RUNEs set ITEM_COUNT = 0, EXIST_YN = 0 where UUID = p_UUID and ITEM_ID = p_ITEM_ID and ITEM_LEVEL = p_ITEM_LEVEL and EXIST_YN = 1;
        end if;
    end if;
    
	return m_ruid;	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_add_wallet` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_add_wallet`(
	p_UUID int
    , p_TYPE int
    , p_VALUE int) RETURNS int(11)
BEGIN
	# 재화 update 후 재화 반환 (0: 없음, 1: 아이템, 2: Gold, 3: Cash, 4: HonorPoint, 5: AlliancePoint, 6: ChallengePoint)
	case
		when p_TYPE = 2 then 
			update GT_USERs set GOLD = GOLD + p_VALUE where UUID = p_UUID;
            return (select GOLD from GT_USERs where UUID = p_UUID);
        when p_TYPE = 3 then
			update GT_USERs set CASH = CASH + p_VALUE where UUID = p_UUID;
            return (select CASH from GT_USERs where UUID = p_UUID);
        when p_TYPE = 4 then
			update GT_USERs set POINT_HONOR = POINT_HONOR + p_VALUE where UUID = p_UUID;
            return (select POINT_HONOR from GT_USERs where UUID = p_UUID);
        when p_TYPE = 5 then
			update GT_USERs set POINT_ALLIANCE = POINT_ALLIANCE + p_VALUE where UUID = p_UUID;
            return (select POINT_ALLIANCE from GT_USERs where UUID = p_UUID);
        when p_TYPE = 6 then
			update GT_USERs set POINT_CHALLENGE = POINT_CHALLENGE + p_VALUE where UUID = p_UUID;
            return (select POINT_CHALLENGE from GT_USERs where UUID = p_UUID);
		when p_TYPE = 7 then
			update GT_USERs set STAMINA = STAMINA + p_VALUE where UUID = p_UUID;
            return (select STAMINA from GT_USERs where UUID = p_UUID);
		else return 0;
	end case;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_duck_set_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_duck_set_item`(
	p_UUID int
    , p_ITEM_ID int
    , p_ITEM_COUNT int) RETURNS int(11)
BEGIN
	# 인벤토리에 아이템을 추가 하고 IUID를 반환 한다.
    declare m_iuid int default 0;
	
    if (p_ITEM_ID = 0) then 
		return 0;
	end if;
    
    # 가방에서 아이템 확인
	select ifnull(IUID, 0) into m_iuid from GT_INVENTORies WHERE UUID = p_UUID and ITEM_ID = p_ITEM_ID and EXIST_YN = 1;

    if (p_ITEM_COUNT > 0) then # 0 보다 크다
		if (m_iuid > 0) then
			update GT_INVENTORies set ITEM_COUNT = p_ITEM_COUNT where UUID = p_UUID and ITEM_ID = p_ITEM_ID and EXIST_YN = 1;
        else
			insert into GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT) values (p_UUID, p_ITEM_ID, p_ITEM_COUNT);
            set m_iuid = (SELECT LAST_INSERT_ID());
        end if;
	elseif (p_ITEM_COUNT <= 0) then # 0 보다 작다
		if (m_iuid > 0) then
			update GT_INVENTORies set ITEM_COUNT = 0, EXIST_YN = 0 where UUID = p_UUID and ITEM_ID = p_ITEM_ID and EXIST_YN = 1;
        end if;
    end if;
    
	return m_iuid;	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_insert_match_record` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_insert_match_record`(
	p_UUID 		  BIGINT,
    p_TARGET_UUID BIGINT,
    p_BATTLE_RESULT BOOL,
    p_DELTA_RANK  INT, 
    p_TARGET_RANK INT
) RETURNS int(11)
BEGIN
	declare m_level int;
	declare m_icon int;
	declare m_nick varchar(20);
	declare m_battle_power int;
	declare m_alliance_name varchar(20);
	declare m_slot1_hero_id int;
	declare m_slot1_hero_level int;
	declare m_slot1_promotion_step int;
	declare m_slot1_evolution_step int;
	declare m_slot2_hero_id int;
	declare m_slot2_hero_level int;
	declare m_slot2_promotion_step int;
	declare m_slot2_evolution_step int;
	declare m_slot3_hero_id int;
	declare m_slot3_hero_level int;
	declare m_slot3_promotion_step int;
	declare m_slot3_evolution_step int;
	declare m_slot4_hero_id int;
	declare m_slot4_hero_level int;
	declare m_slot4_promotion_step int;
	declare m_slot4_evolution_step int;
	declare m_slot5_hero_id int;
	declare m_slot5_hero_level int;
	declare m_slot5_promotion_step int;
	declare m_slot5_evolution_step int;
	declare m_slot6_hero_id int;
	declare m_slot6_hero_level int;
	declare m_slot6_promotion_step int;
	declare m_slot6_evolution_step int;
	declare m_tag_slot1_hero_id int;
	declare m_tag_slot1_hero_level int;
	declare m_tag_slot1_promotion_step int;
	declare m_tag_slot1_evolution_step int;
	declare m_tag_slot2_hero_id int;
	declare m_tag_slot2_hero_level int;
	declare m_tag_slot2_promotion_step int;
	declare m_tag_slot2_evolution_step int;
	declare m_tag_slot3_hero_id int;
	declare m_tag_slot3_hero_level int;
	declare m_tag_slot3_promotion_step int;
	declare m_tag_slot3_evolution_step int;
	
	select A.USER_LEVEL, A.ICON, A.NICK, B.BATTLE_POWER into m_level, m_icon, m_nick, m_battle_power 
		from GT_USERs A
	left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7
		where A.UUID = p_TARGET_UUID;

	
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_slot1_hero_id, m_slot1_hero_level, m_slot1_promotion_step, m_slot1_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.SLOT1 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_slot2_hero_id, m_slot2_hero_level, m_slot2_promotion_step, m_slot2_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.SLOT2 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_slot3_hero_id, m_slot3_hero_level, m_slot3_promotion_step, m_slot3_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.SLOT3 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_slot4_hero_id, m_slot4_hero_level, m_slot4_promotion_step, m_slot4_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.SLOT4 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_slot5_hero_id, m_slot5_hero_level, m_slot5_promotion_step, m_slot5_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.SLOT5 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_slot6_hero_id, m_slot6_hero_level, m_slot6_promotion_step, m_slot6_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.SLOT6 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_tag_slot1_hero_id, m_tag_slot1_hero_level, m_tag_slot1_promotion_step, m_tag_slot1_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.TAG_SLOT1 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_tag_slot2_hero_id, m_tag_slot2_hero_level, m_tag_slot2_promotion_step, m_tag_slot2_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.TAG_SLOT2 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
	select  if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_ID), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.HERO_LEVEL), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.REINFORCE_STEP), 
			if (COALESCE(MAX(A.HERO_ID), 0) = 0, 0, A.EVOLUTION_STEP) into m_tag_slot3_hero_id, m_tag_slot3_hero_level, m_tag_slot3_promotion_step, m_tag_slot3_evolution_step
	from GT_HEROes A left join GT_TEAMs B on A.UUID = B.UUID and B.GAME_MODE = 7 where B.TAG_SLOT3 = A.HERO_ID and A.UUID = p_TARGET_UUID;
    
    insert into GT_RANK_RECORDs
			(UUID, BATTLE_RESULT, DELTA_RANK, OPPONENT_UUID, OPPONENT_RANK, OPPONENT_USER_LEVEL, OPPONENT_ICON, OPPONENT_NICK, OPPONENT_BATTLE_POWER, OPPONENT_ALLIANCE_NAME, BATTLE_DATE,
			 SLOT1_HERO_ID, SLOT1_HERO_LEVEL, SLOT1_POROMOTION_STEP, SLOT1_EVOLUTION_STEP, SLOT2_HERO_ID, SLOT2_HERO_LEVEL, SLOT2_POROMOTION_STEP, SLOT2_EVOLUTION_STEP,
			 SLOT3_HERO_ID, SLOT3_HERO_LEVEL, SLOT3_POROMOTION_STEP, SLOT3_EVOLUTION_STEP, SLOT4_HERO_ID, SLOT4_HERO_LEVEL, SLOT4_POROMOTION_STEP, SLOT4_EVOLUTION_STEP,
			 SLOT5_HERO_ID, SLOT5_HERO_LEVEL, SLOT5_POROMOTION_STEP, SLOT5_EVOLUTION_STEP, SLOT6_HERO_ID, SLOT6_HERO_LEVEL, SLOT6_POROMOTION_STEP, SLOT6_EVOLUTION_STEP,
			 TAG_SLOT1_HERO_ID, TAG_SLOT1_HERO_LEVEL, TAG_SLOT1_POROMOTION_STEP, TAG_SLOT1_EVOLUTION_STEP,
			 TAG_SLOT2_HERO_ID, TAG_SLOT2_HERO_LEVEL, TAG_SLOT2_POROMOTION_STEP, TAG_SLOT2_EVOLUTION_STEP,
			 TAG_SLOT3_HERO_ID, TAG_SLOT3_HERO_LEVEL, TAG_SLOT3_POROMOTION_STEP, TAG_SLOT3_EVOLUTION_STEP)
	values ( p_UUID, p_BATTLE_RESULT, p_DELTA_RANK, p_TARGET_UUID, p_TARGET_RANK, m_level, m_icon, m_nick, m_battle_power, 'pocatcom', now(),
			m_slot1_hero_id, m_slot1_hero_level, m_slot1_promotion_step, m_slot1_evolution_step, m_slot2_hero_id, m_slot2_hero_level, m_slot2_promotion_step, m_slot2_evolution_step,
			m_slot3_hero_id, m_slot3_hero_level, m_slot3_promotion_step, m_slot3_evolution_step, m_slot4_hero_id, m_slot4_hero_level, m_slot4_promotion_step, m_slot4_evolution_step,
			m_slot5_hero_id, m_slot5_hero_level, m_slot5_promotion_step, m_slot5_evolution_step, m_slot6_hero_id, m_slot6_hero_level, m_slot6_promotion_step, m_slot6_evolution_step,
			m_tag_slot1_hero_id, m_tag_slot1_hero_level, m_tag_slot1_promotion_step, m_tag_slot1_evolution_step,
			m_tag_slot2_hero_id, m_tag_slot2_hero_level, m_tag_slot2_promotion_step, m_tag_slot2_evolution_step,
			m_tag_slot3_hero_id, m_tag_slot3_hero_level, m_tag_slot3_promotion_step, m_tag_slot3_evolution_step);
             
	return 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_select_max_buy_add_attend_count` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_select_max_buy_add_attend_count`(
	p_VIP_STEP int
    ) RETURNS int(11)
BEGIN
	if (p_VIP_STEP < 0) then
		set p_VIP_STEP = 0;
	elseif (p_VIP_STEP  > (select max(STEP) from BT_VIPs)) then
		set p_VIP_STEP = (select max(STEP) from BT_VIPs);
	end if;
	
	return (select MAX_BUY_ADD_ATTEND_COUNT from BT_VIPs where STEP = p_VIP_STEP);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_select_max_buy_gold_count` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_select_max_buy_gold_count`(
	p_VIP_STEP int
    ) RETURNS int(11)
BEGIN
	if (p_VIP_STEP < 0) then
		set p_VIP_STEP = 0;
	elseif (p_VIP_STEP  > (select max(STEP) from BT_VIPs)) then
		set p_VIP_STEP = (select max(STEP) from BT_VIPs);
	end if;
	
	return (select MAX_BUY_GOLD_COUNT from BT_VIPs where STEP = p_VIP_STEP);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_select_max_buy_stamina_count` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_select_max_buy_stamina_count`(
	p_VIP_STEP int
    ) RETURNS int(11)
BEGIN
	if (p_VIP_STEP < 0) then
		set p_VIP_STEP = 0;
	elseif (p_VIP_STEP  > (select max(STEP) from BT_VIPs)) then
		set p_VIP_STEP = (select max(STEP) from BT_VIPs);
	end if;
	
	return (select MAX_BUY_STAMINA_COUNT from BT_VIPs where STEP = p_VIP_STEP);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_select_max_stamina` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_select_max_stamina`(
	p_LEVEL int
    ) RETURNS int(11)
BEGIN
	if (p_LEVEL < 1) then
		return (select MAX_STAMINA from BT_LEVEL_UNLOCKs where TARGET_LEVEL = 1);
	elseif (p_LEVEL > 50) then
		return (select MAX_STAMINA from BT_LEVEL_UNLOCKs where TARGET_LEVEL = 50);
	else
		return (select MAX_STAMINA from BT_LEVEL_UNLOCKs where TARGET_LEVEL = p_LEVEL);	
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_select_recovery_stamina` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_select_recovery_stamina`(
	p_LEVEL int
    ) RETURNS int(11)
BEGIN
	if (p_LEVEL < 1) then
		return (select RECOVERY_STAMINA from BT_LEVEL_UNLOCKs where TARGET_LEVEL = 1);
	elseif (p_LEVEL > 50) then
		return (select RECOVERY_STAMINA from BT_LEVEL_UNLOCKs where TARGET_LEVEL = 50);
	else
		return (select RECOVERY_STAMINA from BT_LEVEL_UNLOCKs where TARGET_LEVEL = p_LEVEL);
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_select_skill_point_charge_time` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_select_skill_point_charge_time`(
	p_VIP_STEP int
    ) RETURNS int(11)
BEGIN
	if (p_VIP_STEP < 0) then
		set p_VIP_STEP = 0;
	elseif (p_VIP_STEP  > (select max(STEP) from BT_VIPs)) then
		set p_VIP_STEP = (select max(STEP) from BT_VIPs);
	end if;
	
	return (select SKILL_POINT_CHARGE_TIME from BT_VIPs where STEP = p_VIP_STEP);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_string_split` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_string_split`(
	p_STRING varchar(1024),
	p_DELIMITER varchar(12),
	p_POS int) RETURNS varchar(255) CHARSET utf8
return replace(substring(substring_index(p_STRING, p_DELIMITER, p_POS), length(substring_index(p_STRING, p_DELIMITER, p_POS -1)) + 1), p_DELIMITER, '') ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_update_account_levelup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_update_account_levelup`(
	  p_UUID int
	, p_CURR_LEVEL int
	, p_TARGET_LEVEL int
	, p_ADD_EXP int
	, p_ADD_GOLD int
	, p_STAMINA int) RETURNS int(11)
BEGIN   
	if ( p_TARGET_LEVEL > p_CURR_LEVEL ) then
		update GT_USERs set USER_LEVEL = p_TARGET_LEVEL
			, USER_EXP = p_ADD_EXP
			, GOLD = GOLD + p_ADD_GOLD
			, STAMINA = p_STAMINA + fn_select_recovery_stamina(p_TARGET_LEVEL)
			, MAX_STAMINA = fn_select_max_stamina(p_TARGET_LEVEL)
			, LAST_STAMINA_CHANGE_DATE = now()
		where UUID = p_UUID;    
		return 1;
	else
		update GT_USERs set USER_EXP = p_ADD_EXP
				, GOLD = GOLD + p_ADD_GOLD
				, STAMINA = p_STAMINA
				, LAST_STAMINA_CHANGE_DATE = now()
		where UUID = p_UUID;
		return 2;
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_update_use_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_update_use_item`(
	p_UUID int
    , p_IUID int
    , p_USE_COUNT int) RETURNS int(11)
BEGIN
	declare m_exist_yn tinyint default 0;
    declare m_curr_count int default 0;
    declare m_ret_count int default 0;
    
    # 가방에서 아이템 확인
	select count(*), ifnull(ITEM_COUNT, 0) into m_exist_yn, m_curr_count from GT_INVENTORies WHERE UUID = p_UUID and IUID = p_IUID and EXIST_YN = 1;
    
    # 아이템 수 계산
    set m_ret_count = m_curr_count - p_USE_COUNT;
    
    if (m_ret_count > 0) then # 0 보다 크다
		if (m_exist_yn > 0) then
			update GT_INVENTORies set ITEM_COUNT = m_ret_count where UUID = p_UUID and IUID = p_IUID and EXIST_YN = 1;
		end if;
	elseif (m_ret_count <= 0) then # 0 보다 작다
		if (m_exist_yn > 0) then
			update GT_INVENTORies set ITEM_COUNT = 0, EXIST_YN = 0 where UUID = p_UUID and IUID = p_IUID and EXIST_YN = 1;
        end if;
    end if;

    if (m_ret_count > 0) then
		return (select ITEM_COUNT from GT_INVENTORies where UUID = p_UUID and IUID = p_IUID and EXIST_YN = 1);
	else
		return 0;
	end if;
END ;;
DELIMITER ;