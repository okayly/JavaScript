sp_battle_reward
sp_challenge_reward
sp_challenge_sweep_reward
sp_create_user
sp_daily_dungeon_reward
sp_daily_dungeon_sweep_reward
sp_duck_infinity_tower_reset
sp_duck_insert_item
sp_duck_insert_item_category1
sp_duck_update_account_level
sp_duck_update_hero_level
sp_gacha_re
sp_hero_skill_levelup
sp_insert_chapter_reward
sp_insert_hero_rune_create
sp_insert_hero_rune_slot_open
sp_insert_infinity_tower_accum_score_reward
sp_insert_infinity_tower_all_skip_reward
sp_insert_infinity_tower_cash_reward_box
sp_insert_infinity_tower_reward_box
sp_insert_inventory_all_item
sp_insert_mail
sp_insert_mail_reward_all
sp_insert_randombox
sp_insert_reward
sp_insert_reward_box
sp_insert_summon_open
sp_insert_vip_reward
sp_rank_match_record
sp_select_infinity_tower_rank
sp_select_infinity_tower_ranker_list
sp_select_summon
sp_special_dungeon_reward
sp_special_dungeon_sweep_reward
sp_sweep_reward
sp_update_account_buff_levelup
sp_update_account_buff_reset
sp_update_buy_stamina
sp_update_hero_equip_rune_levelup
sp_update_hero_rune_equip
sp_update_hero_rune_levelup
sp_update_hero_rune_sell
sp_update_hero_rune_unequip
sp_update_hero_skill_levelup
sp_update_mail_info
sp_update_mail_read
sp_update_summon_gage
sp_update_summon_levelup
sp_update_summon_levelup_cash
sp_update_summon_trait_levelup
sp_update_summon_trait_levelup_cash
sp_update_summon_use



-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: localhost    Database: mKUF_JW
-- ------------------------------------------------------
-- Server version	5.6.28-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'mKUF_JW'
--

/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_battle_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_battle_reward`(
	in p_UUID BIGINT,
    in p_STAMINA INT,
    in p_ADD_GOLD BIGINT,
    in p_ADD_HERO_EXP INT,
    in p_ADD_ACCOUNT_EXP INT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT,
    in p_ITEM_ID_6 INT, in p_ITEM_COUNT_6 INT,
    in p_ITEM_ID_7 INT, in p_ITEM_COUNT_7 INT,
    in p_ITEM_ID_8 INT, in p_ITEM_COUNT_8 INT,
    in p_ITEM_ID_9 INT, in p_ITEM_COUNT_9 INT,
    in p_ITEM_ID_10 INT, in p_ITEM_COUNT_10 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists heros;
    drop temporary table if exists result_item;
    drop temporary table if exists result_hero;
	
	# 보상을 위한 가상 테이블 만들기. 
	begin
		create temporary table reward_items ( item_id int, item_count int);
        if (p_ITEM_ID_1 <> 0) then insert into reward_items values (p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then insert into reward_items values (p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        if (p_ITEM_ID_3 <> 0) then insert into reward_items values (p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
        if (p_ITEM_ID_4 <> 0) then insert into reward_items values (p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
        if (p_ITEM_ID_5 <> 0) then insert into reward_items values (p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
        if (p_ITEM_ID_6 <> 0) then insert into reward_items values (p_ITEM_ID_6, p_ITEM_COUNT_6); end if;
        if (p_ITEM_ID_7 <> 0) then insert into reward_items values (p_ITEM_ID_7, p_ITEM_COUNT_7); end if;
        if (p_ITEM_ID_8 <> 0) then insert into reward_items values (p_ITEM_ID_8, p_ITEM_COUNT_8); end if;
        if (p_ITEM_ID_9 <> 0) then insert into reward_items values (p_ITEM_ID_9, p_ITEM_COUNT_9); end if;
        if (p_ITEM_ID_10 <> 0) then insert into reward_items values (p_ITEM_ID_10, p_ITEM_COUNT_10); end if;
		
        # 커서를 위한 가상 테이블 만들기.
		create temporary table heros ( hero_id int);
		insert into heros select SLOT1 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and SLOT1 <> 0;
		insert into heros select SLOT2 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and SLOT2 <> 0;
		insert into heros select SLOT3 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and SLOT3 <> 0;
		insert into heros select SLOT4 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and SLOT4 <> 0;
		insert into heros select SLOT5 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and SLOT5 <> 0;
        insert into heros select SLOT6 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and SLOT6 <> 0;
        insert into heros select TAG_SLOT1 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and TAG_SLOT1 <> 0;
        insert into heros select TAG_SLOT2 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and TAG_SLOT2 <> 0;
        insert into heros select TAG_SLOT3 from GT_TEAMs where GAME_MODE = 1 and UUID = p_UUID and TAG_SLOT3 <> 0;
        
        # 결과 반환용 테이블.
		create temporary table result_item ( iuid bigint, item_id int, item_count int);
        create temporary table result_hero ( hero_id int, hero_exp int, hero_level int);
	 end;   

	# 보상 본문 위치.
	begin
		#declare temp_gold bigint default 0;
		# 1. User 보상 적용. (gold, exp, level) 
		begin
            declare m_current_user_level int default 0;
            declare m_current_user_exp   int default 0;
            declare m_target_user_level  int default 0;
            declare m_target_user_exp    int default 0;
            declare m_sum_user_exp 		 int default 0;
            
            select USER_LEVEL, USER_EXP into m_current_user_level, m_current_user_exp from GT_USERs where UUID = p_UUID;
            set m_sum_user_exp = m_current_user_exp + p_ADD_ACCOUNT_EXP;
            
            select A.TARGET_LEVEL, A.ACCOUNT_TOTAL_EXP into m_target_user_level, m_target_user_exp
			from (
				select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
                from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_sum_user_exp
			) as A order by A.TARGET_LEVEL desc limit 1;

            # 계정 레벨 업
            if ( m_target_user_level > m_current_user_level ) then
                begin
                    declare m_recovery_stamina int default 0;
                    declare m_max_stamina int default 0;
                    
                    select RECOVERY_STAMINA into m_recovery_stamina from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_target_user_level;
                    select MAX_STAMINA into m_max_stamina from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_target_user_level;

                    update GT_USERs set USER_LEVEL = m_target_user_level, USER_EXP = m_sum_user_exp, GOLD = p_ADD_GOLD, STAMINA = p_STAMINA + m_recovery_stamina, MAX_STAMINA = m_max_stamina, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
                end;
            else
                begin
                    update GT_USERs set USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
                end;
            end if;
		end;

		# 2. Hero 보상 적용. (exp, level)
		begin
			declare hero_cur_state int default 0;
            declare m_hero_id int default 0;
            declare m_user_level int default 0;
			declare m_sum_exp int default 0;
			declare m_result_level int default 0;
			declare m_result_exp int default 0;
			declare m_current_level int default 0;
			declare m_current_exp int default 0;
			declare m_target_level int default 0;
			declare m_target_exp int default 0;

			declare hero_cur cursor for select hero_id from heros;
            declare continue handler for sqlstate '02000' set hero_cur_state = 1;
            
            select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID;
            open hero_cur;
				repeat
					fetch hero_cur into m_hero_id;
                    if not hero_cur_state then

						select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID;
						select HERO_LEVEL, EXP into m_current_level, m_current_exp
							from GT_HEROes where UUID = p_UUID and HERO_ID = m_hero_id LIMIT 1;
						
						set m_sum_exp = m_current_exp + p_ADD_HERO_EXP;
						
						select A.TARGET_LEVEL, A.HERO_TOTAL_EXP into m_target_level, m_target_exp
						from (
							select TARGET_LEVEL, HERO_TOTAL_EXP from BT_EXPs 
								where HERO_TOTAL_EXP <= m_sum_exp ) as A 
									where A.TARGET_LEVEL <= m_user_level + 1
									and A.TARGET_LEVEL <= (select TARGET_LEVEL from BT_EXPs order by TARGET_LEVEL desc limit 1)
										order by A.TARGET_LEVEL desc limit 1;
										
						if ( m_target_level > m_user_level ) then
							update GT_HEROes set EXP = m_target_exp, HERO_LEVEL = m_user_level
									where UUID = p_UUID and HERO_ID = m_hero_id;
							set m_result_level = m_user_level;
							set m_result_exp = m_target_exp;
						else
							update GT_HEROes set EXP = m_sum_exp, HERO_LEVEL = m_target_level
									where UUID = p_UUID and HERO_ID = m_hero_id;            
							set m_result_level = m_target_level;
							set m_result_exp = m_sum_exp;
						end if;
                            
                        # 결과 반환을 위한 임시테이블 삽입.
						insert into result_hero values (m_hero_id, m_result_exp, m_result_level);
					end if; # if not hero_cur_state then
				until hero_cur_state end repeat;
			close hero_cur;
		end;
	
		# 3. 보상 아이템 지급.
        begin
			declare item_cur_state int default 0;
			declare m_item_id bigint;
            declare m_item_count int;
            declare m_inven_item_cnt int;
            declare m_current_stack_cnt int;
            declare m_cate int;
            
            declare m_result_iuid bigint;
            declare m_result_count int default 0;
        
			declare item_cur cursor for select item_id, item_count from reward_items;
            declare continue handler for sqlstate '02000' set item_cur_state = 1;

            open item_cur;
				repeat
					fetch item_cur into m_item_id, m_item_count;
                    if not item_cur_state then
							
						# 인벤토리에 아이템이 존재 하는 지 검사.
                        select count(*) into m_inven_item_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                        if( m_inven_item_cnt = 0 ) then
							# 없다면 삽입.
							insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
                            set m_result_iuid = (SELECT LAST_INSERT_ID());
                            set m_result_count = m_item_count;
                        else
							select CATEGORY1 into m_cate from BT_ITEM_BASEs where ITEM_ID = m_item_id;
                            if ( m_cate = 2 ) then
								# 장착 아이템.
                                insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
								set m_result_iuid = (SELECT LAST_INSERT_ID());
								set m_result_count = m_item_count;
							else
								select IUID, ITEM_COUNT into m_result_iuid, m_current_stack_cnt 
                                from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                                
                                set m_result_count = m_current_stack_cnt+m_item_count;
								update GT_INVENTORies set ITEM_COUNT = m_result_count where UUID = p_UUID and ITEM_ID = m_item_id;
                            end if;
						end if;
                        
                        # 결과 반환을 위한 임시테이블 삽입.
                        if ( m_result_iuid <> 0 && m_result_count <> 0 ) then 
							insert into result_item values (m_result_iuid, m_item_id, m_result_count); 
                        end if;
                        
                    end if;
				until item_cur_state end repeat;
			close item_cur;
        end;
    end;
    
    # 결과 반환.
    begin
		select * from GT_USERs where UUID = p_UUID;
        select * from result_hero;
        select * from result_item;
    end;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists heros;
    drop temporary table if exists result_item;
    drop temporary table if exists result_hero;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_challenge_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_challenge_reward`(
	in p_UUID BIGINT,
    in p_STAMINA INT,
    in p_ADD_ACCOUNT_EXP INT,
    in p_ADD_HERO_EXP INT,
    in p_ADD_GOLD BIGINT,
    in p_GAME_MODE INT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists heros;
    drop temporary table if exists result_item;
    drop temporary table if exists result_hero;
	
	# 보상을 위한 가상 테이블 만들기. 
	begin
		create temporary table reward_items ( item_id int, item_count int);
        if (p_ITEM_ID_1 <> 0) then insert into reward_items values  (p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then insert into reward_items values  (p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        if (p_ITEM_ID_3 <> 0) then insert into reward_items values  (p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
        if (p_ITEM_ID_4 <> 0) then insert into reward_items values  (p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
        if (p_ITEM_ID_5 <> 0) then insert into reward_items values  (p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
		
        # 커서를 위한 가상 테이블 만들기.
		create temporary table heros ( hero_id int);
		insert into heros select SLOT1 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT1 <> 0;
		insert into heros select SLOT2 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT2 <> 0;
		insert into heros select SLOT3 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT3 <> 0;
		insert into heros select SLOT4 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT4 <> 0;
		insert into heros select SLOT5 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT5 <> 0;
        insert into heros select SLOT6 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT6 <> 0;
        insert into heros select TAG_SLOT1 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT1 <> 0;
        insert into heros select TAG_SLOT2 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT2 <> 0;
        insert into heros select TAG_SLOT3 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT3 <> 0;
        
        # 결과 반환용 테이블.
		create temporary table result_item ( iuid bigint, item_id int, item_count int);
        create temporary table result_hero ( hero_id int, hero_exp int, hero_level int);
	 end;   

	# 보상 본문 위치.
	begin
		#declare temp_gold bigint default 0;
		# 1. User 보상 적용. (gold, exp, level) 
		begin
            
            declare m_current_user_level int default 0;
            declare m_current_user_exp   int default 0;
            declare m_target_user_level  int default 0;
            declare m_target_user_exp    int default 0;
            declare m_sum_user_exp 		 int default 0;
            
            select USER_LEVEL, USER_EXP into m_current_user_level, m_current_user_exp from GT_USERs where UUID = p_UUID;
            set m_sum_user_exp = m_current_user_exp + p_ADD_ACCOUNT_EXP;
            
            select A.TARGET_LEVEL, A.ACCOUNT_TOTAL_EXP into m_target_user_level, m_target_user_exp
			from (
				select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
                from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_sum_user_exp ) as A  
			order by A.TARGET_LEVEL desc limit 1;
            
            if ( m_target_user_level > m_current_user_level ) then
				begin                
					update GT_USERs set 
						USER_LEVEL = m_target_user_level,
                        USER_EXP = m_sum_user_exp,
                        GOLD = GOLD + p_ADD_GOLD,
                        STAMINA = p_STAMINA + (select ifnull(RECOVERY_STAMINA, 0) from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_target_user_level),
                        MAX_STAMINA = (select ifnull(MAX_STAMINA, 0) from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_target_user_level),
                        LAST_STAMINA_CHANGE_DATE = now()
					where UUID = p_UUID;
                end;
			else
                update GT_USERs set USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
			end if;
		end;
	
		# 2. Hero 보상 적용. (exp, level)
		begin
			declare hero_cur_state int default 0;
            declare m_hero_id int default 0;
            declare m_user_level int default 0;
			declare m_sum_exp int default 0;
			declare m_result_level int default 0;
			declare m_result_exp int default 0;
			declare m_current_level int default 0;
			declare m_current_exp int default 0;
			declare m_target_level int default 0;
			declare m_target_exp int default 0;

			declare hero_cur cursor for select hero_id from heros;
            declare continue handler for sqlstate '02000' set hero_cur_state = 1;
            
            select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID;
            open hero_cur;
				repeat
					fetch hero_cur into m_hero_id;
                    if not hero_cur_state then

						select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID;
						select HERO_LEVEL, EXP into m_current_level, m_current_exp from GT_HEROes where UUID = p_UUID and HERO_ID = m_hero_id LIMIT 1;
						
						set m_sum_exp = m_current_exp + p_ADD_HERO_EXP;
						
						select A.TARGET_LEVEL, A.HERO_TOTAL_EXP into m_target_level, m_target_exp
						from (
							select TARGET_LEVEL, HERO_TOTAL_EXP from BT_EXPs 
							where HERO_TOTAL_EXP <= m_sum_exp
						) as A 
						where A.TARGET_LEVEL <= m_user_level + 1 and A.TARGET_LEVEL <= (select TARGET_LEVEL from BT_EXPs order by TARGET_LEVEL desc limit 1)
						order by A.TARGET_LEVEL desc limit 1;
										
						if ( m_target_level > m_user_level ) then
							update GT_HEROes set EXP = m_target_exp, HERO_LEVEL = m_user_level where UUID = p_UUID and HERO_ID = m_hero_id;
							
                            set m_result_level = m_user_level;
							set m_result_exp = m_target_exp;
						else
							update GT_HEROes set EXP = m_sum_exp, HERO_LEVEL = m_target_level where UUID = p_UUID and HERO_ID = m_hero_id;            
                            
							set m_result_level = m_target_level;
							set m_result_exp = m_sum_exp;
						end if;
                            
                        # 결과 반환을 위한 임시테이블 삽입.
						insert into result_hero values (m_hero_id, m_result_exp, m_result_level);
					end if; # if not hero_cur_state then
				until hero_cur_state end repeat;
			close hero_cur;
		end;
	
		# 3. 보상 아이템 지급.
        begin
			declare item_cur_state int default 0;
			declare m_item_id bigint;
            declare m_item_count int;
            declare m_inven_item_cnt int;
            declare m_current_stack_cnt int;
            declare m_cate int;
            
            declare m_result_iuid bigint;
            declare m_result_count int default 0;
        
			declare item_cur cursor for select item_id, item_count from reward_items;
            declare continue handler for sqlstate '02000' set item_cur_state = 1;

            open item_cur;
				repeat
					fetch item_cur into m_item_id, m_item_count;
                    if not item_cur_state then
							
						# 인벤토리에 아이템이 존재 하는 지 검사.
                        select count(*) into m_inven_item_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                        if ( m_inven_item_cnt = 0 ) then
							# 없다면 삽입.
							insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
                            set m_result_iuid = (SELECT LAST_INSERT_ID());
                            set m_result_count = m_item_count;
                        else
							select CATEGORY1 into m_cate from BT_ITEM_BASEs where ITEM_ID = m_item_id;
                            if ( m_cate = 2 ) then
								# 장착 아이템.
                                insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
								set m_result_iuid = (SELECT LAST_INSERT_ID());
								set m_result_count = m_item_count;
							else
								select IUID, ITEM_COUNT into m_result_iuid, m_current_stack_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;                                
                                set m_result_count = m_current_stack_cnt+m_item_count;
								update GT_INVENTORies set ITEM_COUNT = m_result_count where UUID = p_UUID and ITEM_ID = m_item_id;
                            end if;
						end if;
                        
                        # 결과 반환을 위한 임시테이블 삽입.
                        if ( m_result_iuid <> 0 && m_result_count <> 0 ) then 
							insert into result_item values (m_result_iuid, m_item_id, m_result_count); 
                        end if;
                        
                    end if;
				until item_cur_state end repeat;
			close item_cur;
        end;
    end;
    
    # 결과 반환.
    begin
		select * from GT_USERs where UUID = p_UUID;
        select * from result_hero;
        select * from result_item;
    end;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists heros;
    drop temporary table if exists result_item;
    drop temporary table if exists result_hero;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_challenge_sweep_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_challenge_sweep_reward`(
	in p_UUID BIGINT,
    in p_STAMINA INT,
    in p_ADD_ACCOUNT_EXP INT,
    in p_ADD_GOLD BIGINT,
    in p_CHAPTER_ID INT,
    in p_REMAIN_COUNT INT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists result_item;
	
	# 보상을 위한 가상 테이블 만들기. 
	begin
		create temporary table reward_items ( item_id int, item_count int);
        if (p_ITEM_ID_1 <> 0) then insert into reward_items values  (p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then insert into reward_items values  (p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        if (p_ITEM_ID_3 <> 0) then insert into reward_items values  (p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
        if (p_ITEM_ID_4 <> 0) then insert into reward_items values  (p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
        if (p_ITEM_ID_5 <> 0) then insert into reward_items values  (p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
		
        # 결과 반환용 테이블.
		create temporary table result_item ( iuid bigint, item_id int, item_count int);
	 end;   

	# 보상 본문 위치.
	begin
		#declare temp_gold bigint default 0;
		# 1. User 보상 적용. (gold, exp, level) 
		begin
            
            declare m_current_user_level int default 0;
            declare m_current_user_exp   int default 0;
            declare m_target_user_level  int default 0;
            declare m_target_user_exp    int default 0;
            declare m_sum_user_exp 		 int default 0;
            
            select USER_LEVEL, USER_EXP into m_current_user_level, m_current_user_exp from GT_USERs where UUID = p_UUID;
            set m_sum_user_exp = m_current_user_exp + p_ADD_ACCOUNT_EXP;
            
            select A.TARGET_LEVEL, A.ACCOUNT_TOTAL_EXP into m_target_user_level, m_target_user_exp
			from (
				select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
                from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_sum_user_exp ) as A  
			order by A.TARGET_LEVEL desc limit 1;
            
            if ( m_target_user_level > m_current_user_level ) then
				begin
					update GT_USERs set
						USER_LEVEL = m_target_user_level,
						USER_EXP = m_sum_user_exp,
						GOLD = GOLD + p_ADD_GOLD, 
						STAMINA = p_STAMINA + (select ifnull(RECOVERY_STAMINA, 0) from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_target_user_level),
						MAX_STAMINA = (select ifnull(MAX_STAMINA, 0) from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_target_user_level),
						LAST_STAMINA_CHANGE_DATE = now()
					where UUID = p_UUID;
				end;
			else
                update GT_USERs set USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
			end if;
		end;
	
		# 2. 보상 아이템 지급.
        begin
			declare item_cur_state int default 0;
			declare m_item_id bigint;
            declare m_item_count int;
            declare m_inven_item_cnt int;
            declare m_current_stack_cnt int;
            declare m_cate int;
            
            declare m_result_iuid bigint;
            declare m_result_count int default 0;
        
			declare item_cur cursor for select item_id, item_count from reward_items;
            declare continue handler for sqlstate '02000' set item_cur_state = 1;

            open item_cur;
				repeat
					fetch item_cur into m_item_id, m_item_count;
                    if not item_cur_state then
							
						# 인벤토리에 아이템이 존재 하는 지 검사.
                        select count(*) into m_inven_item_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                        if( m_inven_item_cnt = 0 ) then
							# 없다면 삽입.
							insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
                            set m_result_iuid 		= (SELECT LAST_INSERT_ID());
                            set m_result_count		= m_item_count;
                        else
							select CATEGORY1 into m_cate from BT_ITEM_BASEs where ITEM_ID = m_item_id;
                            if ( m_cate = 2 ) then
								# 장착 아이템.
                                insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
								set m_result_iuid 		= (SELECT LAST_INSERT_ID());
								set m_result_count		= m_item_count;
							else
								select IUID, ITEM_COUNT into m_result_iuid, m_current_stack_cnt 
                                from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                                
                                set m_result_count = m_current_stack_cnt+m_item_count;
								update GT_INVENTORies set ITEM_COUNT = m_result_count where UUID = p_UUID and ITEM_ID = m_item_id;
                            end if;
						end if;
                        
                        # 결과 반환을 위한 임시테이블 삽입.
                        if ( m_result_iuid <> 0 && m_result_count <> 0 ) then 
							insert into result_item values (m_result_iuid, m_item_id, m_result_count); 
                        end if;
                        
                    end if;
				until item_cur_state end repeat;
			close item_cur;
        end;
    end;
    
    # 3. 횟수 업데이트.
    begin
		update GT_CHALLENGE_CHAPTERs set DAILY_EXEC_COUNT = p_REMAIN_COUNT where UUID = p_UUID and CHALLENGE_CHAPTER_ID = p_CHAPTER_ID;
    end;
    
    # 결과 반환.
    begin
		select * from GT_USERs where UUID = p_UUID;
        select * from result_item;
    end;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists result_item;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_user`(in p_ACCOUNT varchar(20))
BEGIN

	declare m_uuid bigint default 0;

	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 1. 유저 테이블에 유저 정보 삽입.
    begin	
        insert into GT_USERs (ACCOUNT, NICK, ICON, USER_LEVEL, GOLD, STAMINA, MAX_STAMINA, LAST_LOGIN_DATE) 
        values (p_ACCOUNT, p_ACCOUNT, (select HERO_ICON from BT_START_HEROes where HERO_ICON <> 0 order by rand() limit 1), 1, 1000, fn_select_max_stamina(1), fn_select_max_stamina(1), now());
        set m_uuid = (SELECT LAST_INSERT_ID());
        
        # 일반 챕터의 첫번째 스테이지와 영웅 챕터의 첫번째 스테이지
        insert into GT_CHAPTERs (UUID, CHAPTER_ID) values (m_uuid, (select CHAPTER_ID from BT_CHAPTER_BASEs where CHAPTER_TYPE = 1 order by CHAPTER_ID limit 1))
													  , (m_uuid, (select CHAPTER_ID from BT_CHAPTER_BASEs where CHAPTER_TYPE = 2 order by CHAPTER_ID limit 1));
    end;
    
    # 2. 기본 지급 영웅 및 영웅의 아이템 지급. 
    begin
        declare hero_cur_state int default 0;
        declare m_hero	 	int default 0;
		declare m_weapon 	int default 0;
		declare m_body 		int default 0;
		declare m_pants 	int default 0;
		declare m_shoes		int default 0;
		declare m_acc1		int default 0;
		declare m_acc2	    int default 0;
        
        declare m_skill_1 	int default 0;
        declare m_skill_2 	int default 0;
        declare m_skill_3 	int default 0;
        declare m_skill_4 	int default 0;
        declare m_skill_5 	int default 0;
        declare m_skill_6 	int default 0;
        declare m_evolution_step int default 0;
        
        declare m_i int default 1;
        
        declare hero_cur cursor for select A.HERO_ID, 
											B.EQUIP_SLOT_ID1, B.EQUIP_SLOT_ID2, B.EQUIP_SLOT_ID3, B.EQUIP_SLOT_ID4, B.EQUIP_SLOT_ID5, B.EQUIP_SLOT_ID6, 
											B.SKILL_ID1, B.SKILL_ID2, B.SKILL_ID3, B.SKILL_ID4, B.SKILL_ID5, B.SKILL_ID6, 
                                            B.EVOLUTION_STEP
									from BT_START_HEROes A
									join BT_HERO_BASEs B on A.HERO_ID = B.HERO_ID and A.HERO_ID <> 0;
		declare continue handler for sqlstate '02000' set hero_cur_state = 1;
		
		open hero_cur;
			repeat
				fetch hero_cur into m_hero, m_weapon, m_body, m_pants, m_shoes, m_acc1, m_acc2, m_skill_1, m_skill_2, m_skill_3, m_skill_4, m_skill_5, m_skill_6, m_evolution_step;
				if not hero_cur_state then
					insert into GT_HEROes (UUID, HERO_ID, EVOLUTION_STEP) values (m_uuid, m_hero, m_evolution_step);
                    
					insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (m_uuid, m_hero, m_weapon, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_weapon));
					insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (m_uuid, m_hero, m_body, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_body));
					insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (m_uuid, m_hero, m_pants, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_pants));
					insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (m_uuid, m_hero, m_shoes, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_shoes));
					insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (m_uuid, m_hero, m_acc1, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_acc1));
					insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (m_uuid, m_hero, m_acc2, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_acc2));
					
                    # 영웅의 진화(별) 단계에 따른 스킬 지급.
                    while m_i <= 6 do
						if( m_i <= m_evolution_step ) then
							case
								when m_i = 1 then if (m_skill_1 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (m_uuid, m_hero, m_skill_1); end if;
                                when m_i = 2 then if (m_skill_2 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (m_uuid, m_hero, m_skill_2); end if;
                                when m_i = 3 then if (m_skill_3 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (m_uuid, m_hero, m_skill_3); end if;
                                when m_i = 4 then if (m_skill_4 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (m_uuid, m_hero, m_skill_4); end if;
                                when m_i = 5 then if (m_skill_5 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (m_uuid, m_hero, m_skill_5); end if;
                                when m_i = 6 then if (m_skill_6 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (m_uuid, m_hero, m_skill_6); end if;
							end case;
                        end if;
                        set m_i = m_i + 1;
                    end while;
					set m_i = 1;
				end if;
			until hero_cur_state end repeat;
		close hero_cur;
	end;

	# 3. 팀 정보 입력.
    begin
		# TODO : 초기 팀 정보가 결정되면, 변경하도록 하며, 지금은 임시 값을 설정한다. 2015.11.25
		insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 1);
        insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 2);
        insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 3);
        insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 4);
        insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 5);
        insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 6);
        insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 7);
        insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 8);
        insert into GT_TEAMs (UUID, GAME_MODE) values (m_uuid, 9);
    end;
    
	# 4. 팀에 기본 영웅 설정.
    # TODO : 기본 팀 설정이 변경되면 팀에 기본 영웅을 삽입하는 현재 내용이 변경될 수 있다. 2015.11.25
	begin
        declare team_cur_state int default 0;
        declare m_slot_id int default 0;
        declare m_hero_id int default 0;
        
        declare team_cur cursor for select SLOT_ID, HERO_ID from BT_START_HEROes;
		declare continue handler for sqlstate '02000' set team_cur_state = 1;
        
        open team_cur;
			repeat
				fetch team_cur into m_slot_id, m_hero_id;
                if not team_cur_state then
					if ( m_slot_id = 1 ) then update GT_TEAMs set SLOT1 = m_hero_id where UUID = m_uuid and GAME_MODE = 1;
                    elseif ( m_slot_id = 2 ) then update GT_TEAMs set SLOT2 = m_hero_id where UUID = m_uuid and GAME_MODE = 1;
                    elseif ( m_slot_id = 3 ) then update GT_TEAMs set SLOT3 = m_hero_id where UUID = m_uuid and GAME_MODE = 1;
                    elseif ( m_slot_id = 4 ) then update GT_TEAMs set SLOT4 = m_hero_id where UUID = m_uuid and GAME_MODE = 1;
                    elseif ( m_slot_id = 5 ) then update GT_TEAMs set SLOT5 = m_hero_id where UUID = m_uuid and GAME_MODE = 1;
                    elseif ( m_slot_id = 7 ) then update GT_TEAMs set TAG_SLOT1 = m_hero_id where UUID = m_uuid and GAME_MODE = 1;
                    elseif ( m_slot_id = 8 ) then update GT_TEAMs set TAG_SLOT2 = m_hero_id where UUID = m_uuid and GAME_MODE = 1;
                    elseif ( m_slot_id = 9 ) then update GT_TEAMs set TAG_SLOT3 = m_hero_id where UUID = m_uuid and GAME_MODE = 1;
                    end if;
                end if;
			until team_cur_state end repeat;
		close team_cur;
    end;
    
    # 5. 가챠 정보 삽입.
    begin
		insert into GT_GACHAs (UUID, GACHA_ID, DAILY_GACHA_COUNT, TOTAL_GACHA_COUNT, LAST_GACHA_DATE) values (m_uuid, 1, 0, 0, now());
        insert into GT_GACHAs (UUID, GACHA_ID, DAILY_GACHA_COUNT, TOTAL_GACHA_COUNT, LAST_GACHA_DATE) values (m_uuid, 2, 0, 0, now());
        insert into GT_GACHAs (UUID, GACHA_ID, DAILY_GACHA_COUNT, TOTAL_GACHA_COUNT, LAST_GACHA_DATE) values (m_uuid, 3, 0, 0, now());
        insert into GT_GACHAs (UUID, GACHA_ID, DAILY_GACHA_COUNT, TOTAL_GACHA_COUNT, LAST_GACHA_DATE) values (m_uuid, 4, 0, 0, now());
        insert into GT_GACHAs (UUID, GACHA_ID, DAILY_GACHA_COUNT, TOTAL_GACHA_COUNT, LAST_GACHA_DATE) values (m_uuid, 5, 0, 0, now());
        insert into GT_GACHAs (UUID, GACHA_ID, DAILY_GACHA_COUNT, TOTAL_GACHA_COUNT, LAST_GACHA_DATE) values (m_uuid, 6, 0, 0, now());
        insert into GT_GACHAs (UUID, GACHA_ID, DAILY_GACHA_COUNT, TOTAL_GACHA_COUNT, LAST_GACHA_DATE) values (m_uuid, 7, 0, 0, now());
    end;
    
    # 6. VIP 기본 정보
    begin
		# 2016-07-18 삭제
		#insert into GT_VIPs (UUID, MAX_BUY_GOLD_COUNT, MAX_BUY_STAMINA_COUNT, MAX_BUY_ADD_ATTEND_COUNT, SKILL_POINT_CHARGE_TIME) values (m_uuid, fn_select_max_buy_gold_count(0), fn_select_max_buy_stamina_count(0), fn_select_max_buy_add_attend_count(0), fn_select_skill_point_charge_time(0));
        insert into GT_RANKs (UUID, TOP_RANK, CURRENT_RANK) values (m_uuid, 30000, 30000);
        insert into GT_CHECK_CONTENTs (UUID) values (m_uuid);
        
        # DAILY_CONTENTS 설정
        insert into GT_DAILY_CONTENTSes (UUID, RANK_MATCH_LATELY_DATE, REG_DATE) values (m_uuid, (select date_sub(now(),interval 5 minute)), now());
    end;
    
    # 미션 삽입.
    begin
        declare misstion_cur_state int default 0;
        declare m_misstion_id int default 0;
        declare m_mission_type int default 0;
        declare m_mission_open_lv int default 0;
        declare m_prev_mission_id int default 0;
        
        declare misstion_cur cursor for select MISSION_ID, MISSION_TYPE, PREV_MISSION_ID, MISSION_OPEN_LV from BT_MISSIONs;
		declare continue handler for sqlstate '02000' set misstion_cur_state = 1;
        
        open misstion_cur;
			repeat
				fetch misstion_cur into m_misstion_id, m_mission_type, m_prev_mission_id, m_mission_open_lv;
                if m_mission_type <> 1 and m_prev_mission_id = 0 and m_mission_open_lv = 1 then
					insert into GT_MISSIONs (UUID, MISSION_ID, PROGRESS_COUNT) values (m_uuid, m_misstion_id, 0);
                end if;
			until misstion_cur_state end repeat;
		close misstion_cur;
    end;
    
    # 필요 정보 반환.
    select * from GT_USERs where UUID = m_uuid and EXIST_YN = true;

        
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_daily_dungeon_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_daily_dungeon_reward`(
	in p_UUID BIGINT,
    in p_STAMINA INT,
    in p_ADD_ACCOUNT_EXP INT,
    in p_ADD_HERO_EXP INT,
    in p_ADD_GOLD BIGINT,
    in p_GAME_MODE INT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists heros;
    drop temporary table if exists result_item;
    drop temporary table if exists result_hero;
	
	# 보상을 위한 가상 테이블 만들기. 
	begin
		create temporary table reward_items ( item_id int, item_count int);
        if (p_ITEM_ID_1 <> 0) then insert into reward_items values  (p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then insert into reward_items values  (p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        if (p_ITEM_ID_3 <> 0) then insert into reward_items values  (p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
        if (p_ITEM_ID_4 <> 0) then insert into reward_items values  (p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
        if (p_ITEM_ID_5 <> 0) then insert into reward_items values  (p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
		
        # 커서를 위한 가상 테이블 만들기.
		create temporary table heros ( hero_id int);
		insert into heros select SLOT1 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT1 <> 0;
		insert into heros select SLOT2 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT2 <> 0;
		insert into heros select SLOT3 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT3 <> 0;
		insert into heros select SLOT4 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT4 <> 0;
		insert into heros select SLOT5 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT5 <> 0;
        insert into heros select SLOT6 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT6 <> 0;
        insert into heros select TAG_SLOT1 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT1 <> 0;
        insert into heros select TAG_SLOT2 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT2 <> 0;
        insert into heros select TAG_SLOT3 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT3 <> 0;
        
        # 결과 반환용 테이블.
		create temporary table result_item ( iuid bigint, item_id int, item_count int);
        create temporary table result_hero ( hero_id int, hero_exp int, hero_level int);
	 end;   

	# 보상 본문 위치.
	begin
		#declare temp_gold bigint default 0;
		# 1. User 보상 적용. (gold, exp, level) 
		begin
            
            declare m_current_user_level int default 0;
            declare m_current_user_exp   int default 0;
            declare m_target_user_level  int default 0;
            declare m_target_user_exp    int default 0;
            declare m_sum_user_exp 		 int default 0;
            
            select USER_LEVEL, USER_EXP into m_current_user_level, m_current_user_exp from GT_USERs where UUID = p_UUID;
            set m_sum_user_exp = m_current_user_exp + p_ADD_ACCOUNT_EXP;
            
            select A.TARGET_LEVEL, A.ACCOUNT_TOTAL_EXP into m_target_user_level, m_target_user_exp
			from (
				select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
                from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_sum_user_exp ) as A  
			order by A.TARGET_LEVEL desc limit 1;
            
            if ( m_target_user_level > m_current_user_level ) then
				update GT_USERs set USER_LEVEL = m_target_user_level, USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, 
						STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now()
                where UUID = p_UUID;
			else
                update GT_USERs set USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, 
									STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
			end if;
		end;
	
		# 2. Hero 보상 적용. (exp, level)
		begin
			declare hero_cur_state int default 0;
            declare m_hero_id int default 0;
            declare m_user_level int default 0;
			declare m_sum_exp int default 0;
			declare m_result_level int default 0;
			declare m_result_exp int default 0;
			declare m_current_level int default 0;
			declare m_current_exp int default 0;
			declare m_target_level int default 0;
			declare m_target_exp int default 0;

			declare hero_cur cursor for select hero_id from heros;
            declare continue handler for sqlstate '02000' set hero_cur_state = 1;
            
            select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID;
            open hero_cur;
				repeat
					fetch hero_cur into m_hero_id;
                    if not hero_cur_state then

						select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID;
						select HERO_LEVEL, EXP into m_current_level, m_current_exp
							from GT_HEROes where UUID = p_UUID and HERO_ID = m_hero_id LIMIT 1;
						
						set m_sum_exp = m_current_exp + p_ADD_HERO_EXP;
						
						select A.TARGET_LEVEL, A.HERO_TOTAL_EXP into m_target_level, m_target_exp
						from (
							select TARGET_LEVEL, HERO_TOTAL_EXP from BT_EXPs 
								where HERO_TOTAL_EXP <= m_sum_exp ) as A 
									where A.TARGET_LEVEL <= m_user_level + 1
									and A.TARGET_LEVEL <= (select TARGET_LEVEL from BT_EXPs order by TARGET_LEVEL desc limit 1)
										order by A.TARGET_LEVEL desc limit 1;
										
						if ( m_target_level > m_user_level ) then
							update GT_HEROes set EXP = m_target_exp, HERO_LEVEL = m_user_level
									where UUID = p_UUID and HERO_ID = m_hero_id;
							set m_result_level = m_user_level;
							set m_result_exp = m_target_exp;
						else
							update GT_HEROes set EXP = m_sum_exp, HERO_LEVEL = m_target_level
									where UUID = p_UUID and HERO_ID = m_hero_id;            
							set m_result_level = m_target_level;
							set m_result_exp = m_sum_exp;
						end if;
                            
                        # 결과 반환을 위한 임시테이블 삽입.
						insert into result_hero values (m_hero_id, m_result_exp, m_result_level);
					end if; # if not hero_cur_state then
				until hero_cur_state end repeat;
			close hero_cur;
		end;
	
		# 3. 보상 아이템 지급.
        begin
			declare item_cur_state int default 0;
			declare m_item_id bigint;
            declare m_item_count int;
            declare m_inven_item_cnt int;
            declare m_current_stack_cnt int;
            declare m_cate int;
            
            declare m_result_iuid bigint;
            declare m_result_count int default 0;
        
			declare item_cur cursor for select item_id, item_count from reward_items;
            declare continue handler for sqlstate '02000' set item_cur_state = 1;

            open item_cur;
				repeat
					fetch item_cur into m_item_id, m_item_count;
                    if not item_cur_state then
							
						# 인벤토리에 아이템이 존재 하는 지 검사.
                        select count(*) into m_inven_item_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                        if( m_inven_item_cnt = 0 ) then
							# 없다면 삽입.
							insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
                            set m_result_iuid 		= (SELECT LAST_INSERT_ID());
                            set m_result_count		= m_item_count;
                        else
							select CATEGORY1 into m_cate from BT_ITEM_BASEs where ITEM_ID = m_item_id;
                            if ( m_cate = 2 ) then
								# 장착 아이템.
                                insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
								set m_result_iuid 		= (SELECT LAST_INSERT_ID());
								set m_result_count		= m_item_count;
							else
								select IUID, ITEM_COUNT into m_result_iuid, m_current_stack_cnt 
                                from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                                
                                set m_result_count = m_current_stack_cnt+m_item_count;
								update GT_INVENTORies set ITEM_COUNT = m_result_count where UUID = p_UUID and ITEM_ID = m_item_id;
                            end if;
						end if;
                        
                        # 결과 반환을 위한 임시테이블 삽입.
                        if ( m_result_iuid <> 0 && m_result_count <> 0 ) then 
							insert into result_item values (m_result_iuid, m_item_id, m_result_count); 
                        end if;
                        
                    end if;
				until item_cur_state end repeat;
			close item_cur;
        end;
    end;
    
    # 결과 반환.
    begin
		select USER_LEVEL, USER_EXP, GOLD from GT_USERs where UUID = p_UUID;
        select * from result_hero;
        select * from result_item;
    end;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists heros;
    drop temporary table if exists result_item;
    drop temporary table if exists result_hero;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_daily_dungeon_sweep_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_daily_dungeon_sweep_reward`(
	in p_UUID BIGINT,
    in p_STAMINA INT,
    in p_ADD_ACCOUNT_EXP INT,
    in p_ADD_GOLD BIGINT,
    in p_GROUP_ID INT,
    in p_REMAIN_COUNT INT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists result_item;
	
	# 보상을 위한 가상 테이블 만들기. 
	begin
		create temporary table reward_items ( item_id int, item_count int);
        if (p_ITEM_ID_1 <> 0) then insert into reward_items values  (p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then insert into reward_items values  (p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        if (p_ITEM_ID_3 <> 0) then insert into reward_items values  (p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
        if (p_ITEM_ID_4 <> 0) then insert into reward_items values  (p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
        if (p_ITEM_ID_5 <> 0) then insert into reward_items values  (p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
		
        # 결과 반환용 테이블.
		create temporary table result_item ( iuid bigint, item_id int, item_count int);
	 end;   

	# 보상 본문 위치.
	begin
		#declare temp_gold bigint default 0;
		# 1. User 보상 적용. (gold, exp, level) 
		begin
            
            declare m_current_user_level int default 0;
            declare m_current_user_exp   int default 0;
            declare m_target_user_level  int default 0;
            declare m_target_user_exp    int default 0;
            declare m_sum_user_exp 		 int default 0;
            
            select USER_LEVEL, USER_EXP into m_current_user_level, m_current_user_exp from GT_USERs where UUID = p_UUID;
            set m_sum_user_exp = m_current_user_exp + p_ADD_ACCOUNT_EXP;
            
            select A.TARGET_LEVEL, A.ACCOUNT_TOTAL_EXP into m_target_user_level, m_target_user_exp
			from (
				select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
                from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_sum_user_exp ) as A  
			order by A.TARGET_LEVEL desc limit 1;
            
            if ( m_target_user_level > m_current_user_level ) then
				update GT_USERs set USER_LEVEL = m_target_user_level, USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, 
						STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now()
                where UUID = p_UUID;
			else
                update GT_USERs set USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, 
									STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
			end if;
		end;
	
		# 2. 보상 아이템 지급.
        begin
			declare item_cur_state int default 0;
			declare m_item_id bigint;
            declare m_item_count int;
            declare m_inven_item_cnt int;
            declare m_current_stack_cnt int;
            declare m_cate int;
            
            declare m_result_iuid bigint;
            declare m_result_count int default 0;
        
			declare item_cur cursor for select item_id, item_count from reward_items;
            declare continue handler for sqlstate '02000' set item_cur_state = 1;

            open item_cur;
				repeat
					fetch item_cur into m_item_id, m_item_count;
                    if not item_cur_state then
							
						# 인벤토리에 아이템이 존재 하는 지 검사.
                        select count(*) into m_inven_item_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                        if( m_inven_item_cnt = 0 ) then
							# 없다면 삽입.
							insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
                            set m_result_iuid 		= (SELECT LAST_INSERT_ID());
                            set m_result_count		= m_item_count;
                        else
							select CATEGORY1 into m_cate from BT_ITEM_BASEs where ITEM_ID = m_item_id;
                            if ( m_cate = 2 ) then
								# 장착 아이템.
                                insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
								set m_result_iuid 		= (SELECT LAST_INSERT_ID());
								set m_result_count		= m_item_count;
							else
								select IUID, ITEM_COUNT into m_result_iuid, m_current_stack_cnt 
                                from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                                
                                set m_result_count = m_current_stack_cnt+m_item_count;
								update GT_INVENTORies set ITEM_COUNT = m_result_count where UUID = p_UUID and ITEM_ID = m_item_id;
                            end if;
						end if;
                        
                        # 결과 반환을 위한 임시테이블 삽입.
                        if ( m_result_iuid <> 0 && m_result_count <> 0 ) then 
							insert into result_item values (m_result_iuid, m_item_id, m_result_count); 
                        end if;
                        
                    end if;
				until item_cur_state end repeat;
			close item_cur;
        end;
    end;
    
    # 3. 횟수 업데이트.
    begin
		update GT_DAILY_DUNGEON_GROUPs set DAILY_EXEC_COUNT = p_REMAIN_COUNT where UUID = p_UUID and DAILY_DUNGEON_GROUP_ID = p_GROUP_ID;
    end;
    
    # 결과 반환.
    begin
		select USER_LEVEL, USER_EXP, GOLD from GT_USERs where UUID = p_UUID;
        select * from result_item;
    end;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists result_item;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_duck_infinity_tower_reset` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_duck_infinity_tower_reset`(
      in p_UUID int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    
    begin
		delete from GT_INFINITY_TOWER_USERs where UUID = p_UUID;
		delete from GT_INFINITY_TOWER_FLOORs where UUID = p_UUID;
		delete from GT_INFINITY_TOWER_HEROes where UUID = p_UUID;
		delete from GT_INFINITY_TOWER_BATTLE_BOTs where UUID = p_UUID;
		delete from GT_INFINITY_TOWER_BATTLE_BOT_HEROes where UUID = p_UUID;
    
        select * from GT_INFINITY_TOWER_USERs where UUID = p_UUID;
		select * from GT_INFINITY_TOWER_FLOORs where UUID = p_UUID;
		select * from GT_INFINITY_TOWER_HEROes where UUID = p_UUID;
		select * from GT_INFINITY_TOWER_BATTLE_BOTs where UUID = p_UUID;
		select * from GT_INFINITY_TOWER_BATTLE_BOT_HEROes where UUID = p_UUID;
    end;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_duck_insert_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_duck_insert_item`(
	in p_UUID int
    , in p_ITEM_ID int
    , in p_ITEM_COUNT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    begin
        declare m_iuid int default 0;
        
		set m_iuid = fn_add_item(p_UUID, p_ITEM_ID, p_ITEM_COUNT);
        select * from GT_INVENTORies WHERE UUID = p_UUID and ITEM_ID = p_ITEM_ID and EXIST_YN = true;
    end;
	
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_duck_insert_item_category1` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_duck_insert_item_category1`(
	in p_UUID int
    , in p_ITEM_CATEGORY1 int
    , in p_ITEM_COUNT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    drop table if exists item_iuids;
    create table item_iuids (iuid int);
    
    begin
		declare item_cur_state int default 0;
        declare m_item_id int default 0;
        declare m_iuid int default 0;
        declare m_item_count int default 0;
        
        declare item_cur cursor for select ITEM_ID from BT_ITEM_BASEs where CATEGORY1 = p_ITEM_CATEGORY1;
		declare continue handler for sqlstate '02000' set item_cur_state = 1;
        
        open item_cur;
			repeat
				fetch item_cur into m_item_id;
                if not item_cur_state then
					set m_iuid = fn_duck_set_item(p_UUID, m_item_id, p_ITEM_COUNT);
                    select count(*) into m_item_count from item_iuids where iuid = m_iuid;
					if (m_item_count = 0) then
						insert into item_iuids (iuid) values (m_iuid);
					end if;
                end if;
			until item_cur_state end repeat;
		close item_cur;
                
        select B.* from item_iuids A left join GT_INVENTORies B on B.IUID = A.iuid where B.UUID = p_UUID;
    end;
    
    drop table if exists item_iuids;
	
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_duck_update_account_level` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_duck_update_account_level`(
      in p_UUID int
    , in p_TARGET_LEVEL int
    , in p_EXP_PERCENT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    
    begin
        declare m_max_level int default 0;
        
        select max(TARGET_LEVEL) into m_max_level from BT_EXPs;
        
        if (p_TARGET_LEVEL <= 0) then
			set p_TARGET_LEVEL = 1;
		elseif (p_TARGET_LEVEL > m_max_level) then
			set p_TARGET_LEVEL = m_max_level;
		end if;
       
		if (p_TARGET_LEVEL > 0) then
			update GT_USERs set USER_LEVEL = p_TARGET_LEVEL
				, USER_EXP = (select ACCOUNT_NEED_EXP + floor((ACCOUNT_TOTAL_EXP - ACCOUNT_NEED_EXP) * (p_EXP_PERCENT / 100)) from BT_EXPs where TARGET_LEVEL = p_TARGET_LEVEL)
				, STAMINA = fn_select_max_stamina(p_TARGET_LEVEL)
				, MAX_STAMINA = fn_select_max_stamina(p_TARGET_LEVEL)
				, LAST_STAMINA_CHANGE_DATE = now()
			where UUID = p_UUID;
		end if;
        
        select * from GT_USERs where UUID = p_UUID;
    end;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_duck_update_hero_level` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_duck_update_hero_level`(
      in p_UUID int
	, in p_HERO_ID int
    , in p_TARGET_LEVEL int
    , in p_EXP_PERCENT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    
    begin
        declare m_max_level int default 0;
        
        # 목표 레벨 설정
        select max(TARGET_LEVEL) into m_max_level from BT_EXPs;        
        
        if (p_TARGET_LEVEL <= 0) then
			set p_TARGET_LEVEL = 1;
		elseif (p_TARGET_LEVEL > m_max_level) then
			set p_TARGET_LEVEL = m_max_level;
		end if;
       
		if (p_TARGET_LEVEL > 0) then
			update GT_HEROes set HERO_LEVEL = p_TARGET_LEVEL
				, EXP = (select HERO_NEED_EXP + floor((HERO_TOTAL_EXP - HERO_NEED_EXP) * (p_EXP_PERCENT / 100)) from BT_EXPs where TARGET_LEVEL = p_TARGET_LEVEL)
			where UUID = p_UUID and HERO_ID = p_HERO_ID;
		end if;
        
        select * from GT_HEROes where UUID = p_UUID and HERO_ID = p_HERO_ID;
    end;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_gacha_re` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_gacha_re`(
	in p_UUID BIGINT,
    in p_GACHA_ID INT,
    in p_FREE BOOL,
    in p_GOLD BIGINT,
    in p_CASH INT,
    in p_EXEC_COUNT INT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT,
    in p_ITEM_ID_6 INT, in p_ITEM_COUNT_6 INT,
    in p_ITEM_ID_7 INT, in p_ITEM_COUNT_7 INT,
    in p_ITEM_ID_8 INT, in p_ITEM_COUNT_8 INT,
    in p_ITEM_ID_9 INT, in p_ITEM_COUNT_9 INT,
    in p_ITEM_ID_10 INT, in p_ITEM_COUNT_10 INT,
    in p_HERO_ID_1 INT, in p_HERO_ID_2 INT,
    in p_HERO_ID_3 INT, in p_HERO_ID_4 INT,
    in p_HERO_ID_5 INT, in p_HERO_ID_6 INT,
    in p_HERO_ID_7 INT, in p_HERO_ID_8 INT,
    in p_HERO_ID_9 INT, in p_HERO_ID_10 INT
)
BEGIN

	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.    
    drop temporary table if exists input_heros;
    drop temporary table if exists result_hero;
    
    begin    
		# 아이템 보상 결과
		declare m_iuid1 int default 0;
		declare m_iuid2 int default 0;
		declare m_iuid3 int default 0;
		declare m_iuid4 int default 0;
		declare m_iuid5 int default 0;
		declare m_iuid6 int default 0;
		declare m_iuid7 int default 0;
		declare m_iuid8 int default 0;
		declare m_iuid9 int default 0;
		declare m_iuid10 int default 0;
    
    
		# 커서를 위한 가상 테이블 만들기. # 결과 반환용 테이블.
		create temporary table input_heros ( hero_id int);        
		create temporary table result_hero ( hero_id int, evolution_step int );
        
        if (p_HERO_ID_1 <> 0) then insert into input_heros values  (p_HERO_ID_1); end if;
        if (p_HERO_ID_2 <> 0) then insert into input_heros values  (p_HERO_ID_2); end if;
        if (p_HERO_ID_3 <> 0) then insert into input_heros values  (p_HERO_ID_3); end if;
        if (p_HERO_ID_4 <> 0) then insert into input_heros values  (p_HERO_ID_4); end if;
        if (p_HERO_ID_5 <> 0) then insert into input_heros values  (p_HERO_ID_5); end if;
        if (p_HERO_ID_6 <> 0) then insert into input_heros values  (p_HERO_ID_6); end if;
        if (p_HERO_ID_7 <> 0) then insert into input_heros values  (p_HERO_ID_7); end if;
        if (p_HERO_ID_8 <> 0) then insert into input_heros values  (p_HERO_ID_8); end if;
        if (p_HERO_ID_9 <> 0) then insert into input_heros values  (p_HERO_ID_9); end if;
        if (p_HERO_ID_10 <> 0) then insert into input_heros values  (p_HERO_ID_10); end if;		
	
		# 1. 유저 가챠 정보 변경.    
		if (p_FREE = true) then
			update GT_GACHAs set DAILY_GACHA_COUNT = DAILY_GACHA_COUNT + p_EXEC_COUNT,
								 TOTAL_GACHA_COUNT = TOTAL_GACHA_COUNT + p_EXEC_COUNT,
                                 LAST_GACHA_DATE = now()
			where GACHA_ID = p_GACHA_ID and UUID = p_UUID;
        else
			update GT_USERs set GOLD = GOLD - p_GOLD, CASH = CASH - p_CASH where UUID = p_UUID;
			update GT_GACHAs set TOTAL_GACHA_COUNT = TOTAL_GACHA_COUNT + p_EXEC_COUNT where GACHA_ID = p_GACHA_ID and UUID = p_UUID;
        end if;    
    
		# 2. 아이템 지급. 아이템 보상
        if (p_ITEM_ID_1 <> 0) then set m_iuid1 = fn_add_item(p_UUID, p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then set m_iuid2 = fn_add_item(p_UUID, p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
		if (p_ITEM_ID_3 <> 0) then set m_iuid3 = fn_add_item(p_UUID, p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
		if (p_ITEM_ID_4 <> 0) then set m_iuid4 = fn_add_item(p_UUID, p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
		if (p_ITEM_ID_5 <> 0) then set m_iuid5 = fn_add_item(p_UUID, p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
        if (p_ITEM_ID_6 <> 0) then set m_iuid6 = fn_add_item(p_UUID, p_ITEM_ID_6, p_ITEM_COUNT_6); end if;
        if (p_ITEM_ID_7 <> 0) then set m_iuid7 = fn_add_item(p_UUID, p_ITEM_ID_7, p_ITEM_COUNT_7); end if;
        if (p_ITEM_ID_8 <> 0) then set m_iuid8 = fn_add_item(p_UUID, p_ITEM_ID_8, p_ITEM_COUNT_8); end if;
        if (p_ITEM_ID_9 <> 0) then set m_iuid9 = fn_add_item(p_UUID, p_ITEM_ID_9, p_ITEM_COUNT_9); end if;
        if (p_ITEM_ID_10 <> 0) then set m_iuid10 = fn_add_item(p_UUID, p_ITEM_ID_10, p_ITEM_COUNT_10); end if;
    
		# select m_iuid1, m_iuid2, m_iuid3, m_iuid4, m_iuid5, m_iuid6, m_iuid7, m_iuid8, m_iuid9, m_iuid10;
    
		# 3. 영웅 삽입.
		begin
			declare hero_cur_state int default 0;
			declare m_hero_id int default 0;
			
			declare m_weapon 	int default 0;
			declare m_body 		int default 0;
			declare m_pants 	int default 0;
			declare m_shoes		int default 0;
			declare m_ring		int default 0;
			declare m_necklace	int default 0;
			
			
			declare m_skill_1 int default 0;
			declare m_skill_2 int default 0;
			declare m_skill_3 int default 0;
			declare m_skill_4 int default 0;
			declare m_skill_5 int default 0;
			declare m_skill_6 int default 0;
			
			declare m_evolution_step int default 0;
			declare m_i int default 1;

			declare hero_cur cursor for select hero_id from input_heros;
			declare continue handler for sqlstate '02000' set hero_cur_state = 1;
			
			open hero_cur;
				repeat
					fetch hero_cur into m_hero_id;
					if not hero_cur_state then
						set m_i = 1;
						
						# 1. 영웅 아이템 지급.
						select EQUIP_SLOT_ID1, EQUIP_SLOT_ID2, EQUIP_SLOT_ID3, EQUIP_SLOT_ID4, EQUIP_SLOT_ID5, EQUIP_SLOT_ID6, 
							   SKILL_ID1, SKILL_ID2, SKILL_ID3, SKILL_ID4, SKILL_ID5, SKILL_ID6, 
							   EVOLUTION_STEP
						into m_weapon, m_body, m_pants, m_shoes, m_ring, m_necklace, 
							 m_skill_1, m_skill_2, m_skill_3, m_skill_4, m_skill_5, m_skill_6, 
							 m_evolution_step
						from BT_HERO_BASEs where HERO_ID = m_hero_id;

						# 2. 영웅 삽입.
						insert into GT_HEROes (UUID, HERO_ID, EVOLUTION_STEP) values (p_UUID, m_hero_id, m_evolution_step);
						
						insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (p_UUID, m_hero_id, m_weapon
							, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_weapon));
						insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (p_UUID, m_hero_id, m_body
							, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_body));
						insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (p_UUID, m_hero_id, m_pants
							, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_pants));
						insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (p_UUID, m_hero_id, m_shoes
							, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_shoes));
						insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (p_UUID, m_hero_id, m_ring
							, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_ring));
						insert into GT_EQUIPMENT_ITEMs (UUID, HERO_ID, ITEM_ID, EQUIP_KIND) values (p_UUID, m_hero_id, m_necklace
							, (select CATEGORY2 from BT_ITEM_BASEs where ITEM_ID = m_necklace));
							
						# 3. 영웅의 진화(별) 단계에 따른 스킬 지급.
						while m_i <= 6 do
							if( m_i <= m_evolution_step ) then
								case
									when m_i = 1 then if (m_skill_1 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (p_UUID, m_hero_id, m_skill_1); end if;
									when m_i = 2 then if (m_skill_2 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (p_UUID, m_hero_id, m_skill_2); end if;
									when m_i = 3 then if (m_skill_3 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (p_UUID, m_hero_id, m_skill_3); end if;
									when m_i = 4 then if (m_skill_4 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (p_UUID, m_hero_id, m_skill_4); end if;
									when m_i = 5 then if (m_skill_5 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (p_UUID, m_hero_id, m_skill_5); end if;
									when m_i = 6 then if (m_skill_6 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) valueS (p_UUID, m_hero_id, m_skill_6); end if;
								end case;
							end if;
							set m_i = m_i + 1;
						end while;
							
						# 결과 반환을 위한 임시테이블 삽입.
						insert into result_hero values (m_hero_id, m_evolution_step);
					end if; # if not hero_cur_state then
				until hero_cur_state end repeat;
			close hero_cur;
		end;
    
		# 유저 정보.
		select A.*, B.* from GT_USERs as A
        left join GT_GACHAs as B on A.UUID = B.UUID and B.GACHA_ID = p_GACHA_ID
		where A.UUID = p_UUID;
        # 아이템 정보.
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid1, m_iuid2, m_iuid3, m_iuid4, m_iuid5, m_iuid6, m_iuid7, m_iuid8, m_iuid9, m_iuid10);
        # 영웅 정보.
        select * from result_hero;    
    end;

	# 가상 테이블 삭제.
    drop temporary table if exists input_heros;
    drop temporary table if exists result_hero;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_hero_skill_levelup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_hero_skill_levelup`(
	in p_UUID int
    , in p_HERO_ID int
    , in p_GOLD int
    , in p_SKILL_ID int
    , in p_SKILL_LEVEL int
    , in p_SKILL_POINT int
    , in p_LAST_ADD_SKILL_POINT_DATE int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 영웅 스킬 레벨
    update GT_HERO_SKILLs set SKILL_LEVEL = p_SKILL_LEVEL where UUID = p_UUID and HERO_ID = p_HERO_ID and SKILL_ID = p_SKILL_ID;
	
    # 유저 정보
    update GT_USERs set GOLD = p_GOLD, SKILL_POINT = p_SKILL_POINT, LAST_ADD_SKILL_POINT_DATE = p_LAST_ADD_SKILL_POINT_DATE where UUID = p_UUID;
    
    # 결과
    select 
		s.SKILL_ID, s.SKILL_LEVEL, u.GOLD, u.SKILL_POINT, u.LAST_ADD_SKILL_POINT_DATE
    from GT_HERO_SKILLs s
    left join GT_USERs u on u.UUID = s.UUID
    where s.UUID = p_UUID and HERO_ID = p_HERO_ID and SKILL_ID = p_SKILL_ID;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_chapter_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_chapter_reward`(
	in p_UUID BIGINT,
    in p_CHAPTER_ID INT,
    in p_REWARD_BOX_ID INT,
    in p_REWARD_CASH INT,
    in p_REWARD_GOLD BIGINT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;

	# 보상 본문 위치.
	begin
		# 아이템 보상 결과
		declare m_iuid1 int default 0;
		declare m_iuid2 int default 0;
        
        # 아이템 보상
        if (p_ITEM_ID_1 <> 0) then set m_iuid1 = fn_add_item(p_UUID, p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then set m_iuid2 = fn_add_item(p_UUID, p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        
		# User 보상(gold, cash)
		update GT_USERs set CASH = CASH + p_REWARD_CASH, GOLD = GOLD + p_REWARD_GOLD where UUID = p_UUID;
        
        # 보상 상자 ID
		update GT_CHAPTERs set TAKE_REWARD_BOX_COUNT = p_REWARD_BOX_ID where UUID = p_UUID and CHAPTER_ID = p_CHAPTER_ID;			
    
		# 결과 반환
		select * from GT_USERs where UUID = p_UUID;
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid1, m_iuid2);
    end;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_hero_rune_create` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_hero_rune_create`(
	in p_UUID BIGINT
    , in p_RUNE_TYPE int
    , in p_RUNE_ITEM_ID int
    , in p_RUNE_ITEM_LEVEL int
    , in p_RUNE_ITEM_COUNT int
    , in p_NEED_GOLD int
    , in p_ITEM_ID_1 int, in p_ITEM_COUNT_1 int
    , in p_ITEM_ID_2 int, in p_ITEM_COUNT_2 int
    , in p_ITEM_ID_3 int, in p_ITEM_COUNT_3 int
    , in p_ITEM_ID_4 int, in p_ITEM_COUNT_4 int
    , in p_ITEM_ID_5 int, in p_ITEM_COUNT_5 int
    , in p_ITEM_ID_6 int, in p_ITEM_COUNT_6 int
    , in p_ITEM_ID_7 int, in p_ITEM_COUNT_7 int
    , in p_ITEM_ID_8 int, in p_ITEM_COUNT_8 int
    , in p_ITEM_ID_9 int, in p_ITEM_COUNT_9 int
    , in p_ITEM_ID_10 int, in p_ITEM_COUNT_10 int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
		declare m_ruid int default 0;
        
        declare m_iuid_1 int default 0;
        declare m_iuid_2 int default 0;
        declare m_iuid_3 int default 0;
        declare m_iuid_4 int default 0;
        declare m_iuid_5 int default 0;
        declare m_iuid_6 int default 0;
        declare m_iuid_7 int default 0;
        declare m_iuid_8 int default 0;
        declare m_iuid_9 int default 0;
        declare m_iuid_10 int default 0;
        
        if (p_RUNE_ITEM_ID > 0 and p_RUNE_ITEM_LEVEL > 0 and p_RUNE_ITEM_COUNT > 0) then        
			# 재화 차감
			if (p_NEED_GOLD <> 0) then
				update GT_USERs set GOLD = if (GOLD - p_NEED_GOLD < 0, 0, GOLD - p_NEED_GOLD) where UUID = p_UUID;
			end if;
			
			set m_ruid = fn_add_rune(p_UUID, p_RUNE_TYPE, p_RUNE_ITEM_ID, p_RUNE_ITEM_LEVEL, p_RUNE_ITEM_COUNT);
            
            if (p_ITEM_ID_1 <> 0) then set m_iuid_1 = fn_add_item(p_UUID, p_ITEM_ID_1, -p_ITEM_COUNT_1); end if;
			if (p_ITEM_ID_2 <> 0) then set m_iuid_2 = fn_add_item(p_UUID, p_ITEM_ID_2, -p_ITEM_COUNT_2); end if;
            if (p_ITEM_ID_3 <> 0) then set m_iuid_3 = fn_add_item(p_UUID, p_ITEM_ID_3, -p_ITEM_COUNT_3); end if;
            if (p_ITEM_ID_4 <> 0) then set m_iuid_4 = fn_add_item(p_UUID, p_ITEM_ID_4, -p_ITEM_COUNT_4); end if;
            if (p_ITEM_ID_5 <> 0) then set m_iuid_5 = fn_add_item(p_UUID, p_ITEM_ID_5, -p_ITEM_COUNT_5); end if;
            if (p_ITEM_ID_6 <> 0) then set m_iuid_6 = fn_add_item(p_UUID, p_ITEM_ID_6, -p_ITEM_COUNT_6); end if;
            if (p_ITEM_ID_7 <> 0) then set m_iuid_7 = fn_add_item(p_UUID, p_ITEM_ID_7, -p_ITEM_COUNT_7); end if;
            if (p_ITEM_ID_8 <> 0) then set m_iuid_8 = fn_add_item(p_UUID, p_ITEM_ID_8, -p_ITEM_COUNT_8); end if;
            if (p_ITEM_ID_9 <> 0) then set m_iuid_9 = fn_add_item(p_UUID, p_ITEM_ID_9, -p_ITEM_COUNT_9); end if;
            if (p_ITEM_ID_10 <> 0) then set m_iuid_10 = fn_add_item(p_UUID, p_ITEM_ID_10, -p_ITEM_COUNT_10); end if;
		end if;
    
		# 정보 반환
        select GOLD from GT_USERs where UUID = p_UUID;
        select * from GT_HERO_RUNEs where RUID = m_ruid;
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1, m_iuid_2, m_iuid_3, m_iuid_4, m_iuid_5, m_iuid_6, m_iuid_7, m_iuid_8, m_iuid_9, m_iuid_10);
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_hero_rune_slot_open` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_hero_rune_slot_open`(
	in p_UUID BIGINT
    , in p_HERO_ID int
    , in p_RUNE_SLOT_ID int
    , in p_RUNE_SLOT_TYPE int
    , in p_RUNE_SLOT_STEP int
    , in p_NEED_GOLD int
    , in p_ITEM_ID_1 int, in p_ITEM_COUNT_1 int
    , in p_ITEM_ID_2 int, in p_ITEM_COUNT_2 int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
		declare m_rune_slot_count int default 0;
		
        declare m_iuid_1 int default 0;
        declare m_iuid_2 int default 0;
        
        if (p_HERO_ID <> 0 and p_RUNE_SLOT_ID <> 0 and p_RUNE_SLOT_STEP <> 0) then        
			# 재화 차감
			if (p_NEED_GOLD <> 0) then
				update GT_USERs set GOLD = if (GOLD - p_NEED_GOLD < 0, 0, GOLD - p_NEED_GOLD) where UUID = p_UUID;
			end if;            
        
			select count(*) into m_rune_slot_count from GT_HERO_RUNE_SLOTs where UUID = p_UUID and HERO_ID = p_HERO_ID and RUNE_SLOT_ID = p_RUNE_SLOT_ID;
			if (m_rune_slot_count = 0) then
				insert into GT_HERO_RUNE_SLOTs (UUID, HERO_ID, RUNE_SLOT_ID, RUNE_SLOT_TYPE, RUNE_SLOT_STEP) values (p_UUID, p_HERO_ID, p_RUNE_SLOT_ID, p_RUNE_SLOT_TYPE, p_RUNE_SLOT_STEP);
			end if;
            
            if (p_ITEM_ID_1 <> 0) then
				set m_iuid_1 = fn_add_item(p_UUID, p_ITEM_ID_1, -p_ITEM_COUNT_1);
			end if;
            
			if (p_ITEM_ID_2 <> 0) then
				set m_iuid_2 = fn_add_item(p_UUID, p_ITEM_ID_2, -p_ITEM_COUNT_2);
			end if;
		end if;
    
		# 정보 반환
        select GOLD from GT_USERs where UUID = p_UUID;
        select * from GT_HERO_RUNE_SLOTs where UUID = p_UUID and HERO_ID = p_HERO_ID and RUNE_SLOT_ID = p_RUNE_SLOT_ID;
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1, m_iuid_2);
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_infinity_tower_accum_score_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_infinity_tower_accum_score_reward`(
	in p_UUID int
    , in p_SCORE_REWARD_ID_LIST varchar(128)
    , in p_REWARD_TYPE_1 int, in p_REWARD_ITEM_ID_1 int, in p_REWARD_COUNT_1 int
    , in p_REWARD_TYPE_2 int, in p_REWARD_ITEM_ID_2 int, in p_REWARD_COUNT_2 int
    , in p_REWARD_TYPE_3 int, in p_REWARD_ITEM_ID_3 int, in p_REWARD_COUNT_3 int
    , in p_REWARD_TYPE_4 int, in p_REWARD_ITEM_ID_4 int, in p_REWARD_COUNT_4 int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    
    begin
		declare m_iuid_1 int default 0;
        declare m_iuid_2 int default 0;
        declare m_iuid_3 int default 0;
        declare m_iuid_4 int default 0;
        declare m_wallet int default 0;
        
        update GT_INFINITY_TOWER_USERs set SCORE_REWARD_ID_LIST = p_SCORE_REWARD_ID_LIST where UUID = p_UUID;
        
		if (p_REWARD_TYPE_1 = 1) then
			set m_iuid_1 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_1, p_REWARD_COUNT_1);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_1, p_REWARD_COUNT_1);
		end if;
		
		if (p_REWARD_TYPE_2 = 1) then
			set m_iuid_2 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_2, p_REWARD_COUNT_2);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_2, p_REWARD_COUNT_2);
		end if;
		
		if (p_REWARD_TYPE_3 = 1) then
			set m_iuid_3 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_3, p_REWARD_COUNT_3);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_3, p_REWARD_COUNT_3);
		end if;
        
        if (p_REWARD_TYPE_4 = 1) then
			set m_iuid_4 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_4, p_REWARD_COUNT_4);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_4, p_REWARD_COUNT_4);
		end if;
        
        -- 결과 반환
        select GOLD, CASH, POINT_HONOR, POINT_ALLIANCE, POINT_CHALLENGE FROM GT_USERs where UUID = p_UUID;
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1, m_iuid_2, m_iuid_3, m_iuid_4);        
    end;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_infinity_tower_all_skip_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_infinity_tower_all_skip_reward`(
	in p_UUID int
    , in p_START_FLOOR int
    , in p_END_FLOOR int
    , in p_ADD_GOLD int
    , in p_ADD_POINT_CHALLENGE int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 획득 아이템 IUID 테이블
    drop table if exists item_iuids;
    create table item_iuids (iuid int);
    
    begin
		declare m_iuid int default 0;
		declare m_floor, m_floor_type int default 0;        
		declare m_type1, m_item_id1, m_count1 int default 0;
        declare m_type2, m_item_id2, m_count2 int default 0;
        declare m_type3, m_item_id3, m_count3 int default 0;
        declare m_wallet, m_item_count int default 0;
        
        declare m_reward_box int default 3;
        declare m_secret_maze int default 4;
        declare m_reward_gold int default 2;
        declare m_reward_point_challenge int default 6;
        
        declare tower_cur_state int default 0;
        declare tower_cur cursor for select TOWER_FLOOR, FLOOR_TYPE
			, BOX1_REWARD_TYPE, BOX1_REWARD_ITEM_ID, BOX1_REWARD_COUNT
            , BOX2_REWARD_TYPE, BOX2_REWARD_ITEM_ID, BOX2_REWARD_COUNT
            , BOX3_REWARD_TYPE, BOX3_REWARD_ITEM_ID, BOX3_REWARD_COUNT
		from BT_INFINITY_TOWER_BASEs where TOWER_FLOOR >= p_START_FLOOR and TOWER_FLOOR <= p_END_FLOOR;
        declare continue handler for sqlstate '02000' set tower_cur_state = 1;
        
        open tower_cur;
			repeat
				fetch tower_cur into m_floor, m_floor_type
								  , m_type1, m_item_id1, m_count1
								  , m_type2, m_item_id2, m_count2
								  , m_type3, m_item_id3, m_count3;
                
                if not tower_cur_state then
					#select m_floor, m_floor_type, m_item_id1, m_count1, m_type2, m_item_id2, m_count2, m_type3, m_item_id3, m_count3;
					# 보물 상장 층, 비밀 미로 층
                    if (m_floor_type = m_reward_box) then
						# 보상 설정
						if (m_type1 = 1) then
							set m_iuid = fn_add_item(p_UUID, m_item_id1, m_count1);
							select count(*) into m_item_count from item_iuids where iuid = m_iuid;
							if (m_item_count = 0) then
								insert into item_iuids (iuid) values (m_iuid);
							end if;						
						elseif (m_type2 = 1) then
							set m_iuid = fn_add_item(p_UUID, m_item_id2, m_count2);
							select count(*) into m_item_count from item_iuids where iuid = m_iuid;
							if (m_item_count = 0) then
								insert into item_iuids (iuid) values (m_iuid);
							end if;						
						elseif (m_type3 = 1) then
							set m_iuid = fn_add_item(p_UUID, m_item_id3, m_count3);
							select count(*) into m_item_count from item_iuids where iuid = m_iuid;
							if (m_item_count = 0) then
								insert into item_iuids (iuid) values (m_iuid);
							end if;
						end if;
					end if;
                end if;
			until tower_cur_state end repeat;
		close tower_cur;
        
        # 골드, 도전포인트 추가
        set m_wallet = fn_add_wallet(p_UUID, m_reward_gold, p_ADD_GOLD);
        set m_wallet = fn_add_wallet(p_UUID, m_reward_point_challenge, p_ADD_POINT_CHALLENGE);
    end;
    
    # 재화
    select * from GT_USERs where UUID = p_UUID;
    
    # 획득 아이템
    select B.* from item_iuids A left join GT_INVENTORies B on B.IUID = A.iuid where B.UUID = p_UUID;
    
    drop table if exists item_iuids;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_infinity_tower_cash_reward_box` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_infinity_tower_cash_reward_box`(
	in p_UUID int
    , in p_FLOOR int
	, in p_NEED_CASH int
    , in p_BUY_COUNT int
    , in p_RANDOMBOX_ID int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    
    begin
        declare m_floor_count int default 0;        
        declare m_cutting_value int default 10;
        
        declare m_reward_type int default 0;
        declare m_item_id int default 0;
        declare m_effect_id int default 0;
        declare m_effect_value int default 0;
        
        declare m_iuid int default 0;
        declare m_wallet int default 0;
        
        # 층 정보
        select count(*) into m_floor_count from GT_INFINITY_TOWER_FLOORs where UUID = p_UUID and FLOOR = p_FLOOR and EXIST_YN = true;
        
        if (m_floor_count <> 0) then
			# cash 빼기
            update GT_USERs set CASH = if ((CASH - p_NEED_CASH) < 0, 0, CASH - p_NEED_CASH) where UUID = p_UUID;
            
            # 층 정보
			update GT_INFINITY_TOWER_FLOORs set CASH_REWARD_BOX_COUNT = p_BUY_COUNT, UPDATE_DATE = now() where UUID = p_UUID and FLOOR = p_FLOOR;
            
            select REWARD_TYPE, ITEM_ID, EFFECT_ID, (select floor(rand() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE)) as EFFECT_VALUE 
            into m_reward_type, m_item_id, m_effect_id, m_effect_value
            from BT_RANDOMBOXes where RANDOMBOX_ID = p_RANDOMBOX_ID;
        
			# 아이템 획득
            if (m_reward_type = 2) then
				if (m_item_id <> 0 and m_effect_value <> 0) then
					set m_iuid = fn_add_item(p_UUID, m_item_id, m_effect_value);
				end if;
			else
				# 골드 획득 - 10 단위로 절삭
                if (m_effect_id = 2) then
					select if (m_effect_value > m_cutting_value, floor(m_effect_value / m_cutting_value) * m_cutting_value, m_effect_value) into m_effect_value;
				end if;
				
				set m_wallet = fn_add_wallet(p_UUID, m_effect_id, m_effect_value);
				
			end if;
        end if;
        
        -- 결과 반환
        select GOLD, CASH, POINT_HONOR, POINT_ALLIANCE, POINT_CHALLENGE FROM GT_USERs where UUID = p_UUID;
        select * from GT_INVENTORies where UUID = p_UUID and IUID = m_iuid;
        select * from GT_INFINITY_TOWER_FLOORs where UUID = p_UUID and FLOOR = p_FLOOR;        
    end;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_infinity_tower_reward_box` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_infinity_tower_reward_box`(
	in p_UUID int
    , in p_FLOOR int
    , in p_FLOOR_TYPE int
    , in p_REWARD_TYPE_1 int
    , in p_REWARD_ITEM_ID_1 int
    , in p_REWARD_COUNT_1 int
    , in p_REWARD_TYPE_2 int
    , in p_REWARD_ITEM_ID_2 int
    , in p_REWARD_COUNT_2 int
    , in p_REWARD_TYPE_3 int
    , in p_REWARD_ITEM_ID_3 int
    , in p_REWARD_COUNT_3 int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    
    begin
		declare m_iuid_1 int default 0;
        declare m_iuid_2 int default 0;
        declare m_iuid_3 int default 0;        
        declare m_wallet int default 0;
        declare m_floor_count int default 0;
        
        # 층 정보
        select count(*) into m_floor_count from GT_INFINITY_TOWER_FLOORs where UUID = p_UUID and FLOOR = p_FLOOR and EXIST_YN = true;
        
        if (m_floor_count = 0) then
			# 보물상자 층
			insert into GT_INFINITY_TOWER_FLOORs (UUID, FLOOR, FLOOR_TYPE, REWARD_TYPE_1, REWARD_ITEM_ID_1, REWARD_COUNT_1, REWARD_TYPE_2, REWARD_ITEM_ID_2, REWARD_COUNT_2, REWARD_TYPE_3, REWARD_ITEM_ID_3, REWARD_COUNT_3, IS_REWARD_BOX_OPEN, UPDATE_DATE)
			values (p_UUID, p_FLOOR, p_FLOOR_TYPE, p_REWARD_TYPE_1, p_REWARD_ITEM_ID_1, p_REWARD_COUNT_1, p_REWARD_TYPE_2, p_REWARD_ITEM_ID_2, p_REWARD_COUNT_2, p_REWARD_TYPE_3, p_REWARD_ITEM_ID_3, p_REWARD_COUNT_3, true, now());
		else
			# 비밀미로 층
			update GT_INFINITY_TOWER_FLOORs set REWARD_TYPE_1 = p_REWARD_TYPE_1, REWARD_ITEM_ID_1 = p_REWARD_ITEM_ID_1, REWARD_COUNT_1 = p_REWARD_COUNT_1
												, REWARD_TYPE_2 = p_REWARD_TYPE_2, REWARD_ITEM_ID_2 = p_REWARD_ITEM_ID_2, REWARD_COUNT_2 = p_REWARD_COUNT_2
												, REWARD_TYPE_3 = p_REWARD_TYPE_3, REWARD_ITEM_ID_3 = p_REWARD_ITEM_ID_3, REWARD_COUNT_3 = p_REWARD_COUNT_3
                                                , IS_REWARD_BOX_OPEN = true, UPDATE_DATE = now()
			where UUID = p_UUID and FLOOR = p_FLOOR;
		end if;
        
		if (p_REWARD_TYPE_1 = 1) then
			set m_iuid_1 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_1, p_REWARD_COUNT_1);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_1, p_REWARD_COUNT_1);
		end if;
		
		if (p_REWARD_TYPE_2 = 1) then
			set m_iuid_2 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_2, p_REWARD_COUNT_2);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_2, p_REWARD_COUNT_2);
		end if;
		
		if (p_REWARD_TYPE_3 = 1) then
			set m_iuid_3 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_3, p_REWARD_COUNT_3);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_3, p_REWARD_COUNT_3);
		end if;        
        
        -- 결과 반환
        select GOLD, CASH, POINT_HONOR, POINT_ALLIANCE, POINT_CHALLENGE FROM GT_USERs where UUID = p_UUID;
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1, m_iuid_2, m_iuid_3);        
    end;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_inventory_all_item` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_inventory_all_item`(
	in p_UUID int
    , in p_ITEM_COUNT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    drop table if exists item_iuids;
    create table item_iuids (iuid int);
    
    begin
		declare item_cur_state int default 0;
        declare m_item_id int default 0;
        declare m_iuid int default 0;
        declare m_item_count int default 0;
        
        declare item_cur cursor for select ITEM_ID from BT_ITEM_BASEs where CATEGORY1 <> 2 and CATEGORY1 <> 4;
		declare continue handler for sqlstate '02000' set item_cur_state = 1;
        
        open item_cur;
			repeat
				fetch item_cur into m_item_id;
                if not item_cur_state then
					set m_iuid = fn_duck_set_item(p_UUID, m_item_id, p_ITEM_COUNT);                    
                    select count(*) into m_item_count from item_iuids where iuid = m_iuid;
					if (m_item_count = 0) then
						insert into item_iuids (iuid) values (m_iuid);
					end if;
                end if;
			until item_cur_state end repeat;
		close item_cur;
        
        select B.* from item_iuids A left join GT_INVENTORies B on B.IUID = A.iuid where B.UUID = p_UUID;
    end;
    
    drop table if exists item_iuids;
	
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_mail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_mail`(
      in p_UUID int
	, in p_SENDER int
    , in p_MAIL_TYPE varchar(20)
    , in p_MAIL_ICON_TYPE int
    , in p_MAIL_ICON_ITEM_ID int
    , in p_MAIL_ICON_COUNT int
    , in p_SUBJECT varchar(512)
    , in p_CONTENTS varchar(1024)
    , in p_REWARD1_TYPE int, in p_REWARD1_ITEM_ID int, in p_REWARD1_COUNT int
    , in p_REWARD2_TYPE int, in p_REWARD2_ITEM_ID int, in p_REWARD2_COUNT int
    , in p_REWARD3_TYPE int, in p_REWARD3_ITEM_ID int, in p_REWARD3_COUNT int
    , in p_REWARD4_TYPE int, in p_REWARD4_ITEM_ID int, in p_REWARD4_COUNT int
    , in p_REWARD5_TYPE int, in p_REWARD5_ITEM_ID int, in p_REWARD5_COUNT int
    , in P_SEND_DATE datetime
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    # 내용 등록
    begin
		insert into GT_MAILs (UUID, MAIL_SENDER, MAIL_TYPE, MAIL_ICON_TYPE, MAIL_ICON_ITEM_ID, MAIL_ICON_COUNT, MAIL_SUBJECT, MAIL_CONTENTS
							, REWARD1_TYPE, REWARD1_ITEM_ID, REWARD1_COUNT
							, REWARD2_TYPE, REWARD2_ITEM_ID, REWARD2_COUNT
							, REWARD3_TYPE, REWARD3_ITEM_ID, REWARD3_COUNT
							, REWARD4_TYPE, REWARD4_ITEM_ID, REWARD4_COUNT
							, REWARD5_TYPE, REWARD5_ITEM_ID, REWARD5_COUNT
                            , REG_DATE)
					values (p_UUID, p_SENDER, p_MAIL_TYPE, p_MAIL_ICON_TYPE, p_MAIL_ICON_ITEM_ID, p_MAIL_ICON_COUNT, p_SUBJECT, p_CONTENTS
							, p_REWARD1_TYPE, p_REWARD1_ITEM_ID, p_REWARD1_COUNT
							, p_REWARD2_TYPE, p_REWARD2_ITEM_ID, p_REWARD2_COUNT
							, p_REWARD3_TYPE, p_REWARD3_ITEM_ID, p_REWARD3_COUNT
							, p_REWARD4_TYPE, p_REWARD4_ITEM_ID, p_REWARD4_COUNT
							, p_REWARD5_TYPE, p_REWARD5_ITEM_ID, p_REWARD5_COUNT
                            , P_SEND_DATE);
    end;
    
    # 결과값 반환
    begin
		select * from GT_MAILs where MAIL_ID = (SELECT LAST_INSERT_ID());
    end;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_mail_reward_all` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_mail_reward_all`(
	in p_UUID int
)
BEGIN
	# authors : jongwook
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 우편 ID 테이블
    drop table if exists mail_ids;
    create table mail_ids (mail_id int);
    
    # 획득 아이템 IUID 테이블
    drop table if exists item_iuids;
    create table item_iuids (iuid int);
    
    begin
		declare m_mail_id, m_iuid int default 0;
		declare m_type1, m_item_id1, m_count1 int default 0;
        declare m_type2, m_item_id2, m_count2 int default 0;
        declare m_type3, m_item_id3, m_count3 int default 0;
        declare m_type4, m_item_id4, m_count4 int default 0;
        declare m_type5, m_item_id5, m_count5 int default 0;
        declare m_wallet, m_item_count int default 0;
        
        declare mail_cur_state int default 0;
        declare mail_cur cursor for select MAIL_ID
			, REWARD1_TYPE, REWARD1_ITEM_ID, REWARD1_COUNT 
			, REWARD2_TYPE, REWARD2_ITEM_ID, REWARD2_COUNT
			, REWARD3_TYPE, REWARD3_ITEM_ID, REWARD3_COUNT
			, REWARD4_TYPE, REWARD4_ITEM_ID, REWARD4_COUNT
			, REWARD5_TYPE, REWARD5_ITEM_ID, REWARD5_COUNT
		from GT_MAILs where UUID = p_UUID and MAIL_READ_YN = false and MAIL_TYPE != 'TEXT' and MAIL_TYPE != 'GM' and isnull(MAIL_READ_DATE);
        declare continue handler for sqlstate '02000' set mail_cur_state = 1;
        
        open mail_cur;
			repeat
				fetch mail_cur into m_mail_id
								  , m_type1, m_item_id1, m_count1
								  , m_type2, m_item_id2, m_count2
								  , m_type3, m_item_id3, m_count3
								  , m_type4, m_item_id4, m_count4
								  , m_type5, m_item_id5, m_count5;
                
                if not mail_cur_state then                
					#select m_mail_id, m_type1, m_item_id1, m_count1, m_type2, m_item_id2, m_count2, m_type3, m_item_id3, m_count3, m_type4, m_item_id4, m_count4, m_type5, m_item_id5, m_count5;
                    
					# 우편 ID 설정
					insert into mail_ids (mail_id) value (m_mail_id);
                
					# 보상 설정
					if (m_type1 = 1) then
						set m_iuid = fn_add_item(p_UUID, m_item_id1, m_count1);
                        select count(*) into m_item_count from item_iuids where iuid = m_iuid;
                        if (m_item_count = 0) then
							insert into item_iuids (iuid) values (m_iuid);
						end if;
					elseif (m_type1 > 1) then
						set m_wallet = fn_add_wallet(p_UUID, m_type1, m_count1);
					end if;                    
                    
					if (m_type2 = 1) then
						set m_iuid = fn_add_item(p_UUID, m_item_id2, m_count2);
                        select count(*) into m_item_count from item_iuids where iuid = m_iuid;
                        if (m_item_count = 0) then
							insert into item_iuids (iuid) values (m_iuid);
						end if;
					elseif (m_type2 > 1) then
						set m_wallet = fn_add_wallet(p_UUID, m_type2, m_count2);
					end if;                    
                    
					if (m_type3 = 1) then
						set m_iuid = fn_add_item(p_UUID, m_item_id3, m_count3);
                        select count(*) into m_item_count from item_iuids where iuid = m_iuid;
                        if (m_item_count = 0) then
							insert into item_iuids (iuid) values (m_iuid);
						end if;
					elseif (m_type3 > 1) then
						set m_wallet = fn_add_wallet(p_UUID, m_type3, m_count3);
					end if;                    
                    
					if (m_type4 = 1) then
						set m_iuid = fn_add_item(p_UUID, m_item_id4, m_count4);
                        select count(*) into m_item_count from item_iuids where iuid = m_iuid;
                        if (m_item_count = 0) then
							insert into item_iuids (iuid) values (m_iuid);
						end if;
					elseif (m_type4 > 1) then
						set m_wallet = fn_add_wallet(p_UUID, m_type4, m_count4);
					end if;                    
                    
					if (m_type5 = 1) then
						set m_iuid = fn_add_item(p_UUID, m_item_id5, m_count5);
                        select count(*) into m_item_count from item_iuids where iuid = m_iuid;
                        if (m_item_count = 0) then
							insert into item_iuids (iuid) values (m_iuid);
						end if;
					elseif (m_type5 > 1) then
						set m_wallet = fn_add_wallet(p_UUID, m_type5, m_count5);
					end if;
					
                end if;
                
			until mail_cur_state end repeat;
		close mail_cur;
    end;
       
	# MAIL_READ_YN = true 를 한다.
	update GT_MAILs
		set MAIL_READ_YN = true, MAIL_READ_DATE = if (isnull(MAIL_READ_DATE), now(), MAIL_READ_DATE)
	where UUID = p_UUID and MAIL_ID in (select mail_id from mail_ids);
    
    # 우편 ID
    select mail_id as MAIL_ID from mail_ids;
    
    # 재화
    select GOLD, CASH, POINT_HONOR, POINT_ALLIANCE, POINT_CHALLENGE from GT_USERs where UUID = p_UUID;
    
    # 획득 아이템
    select B.IUID, B.ITEM_ID, B.ITEM_COUNT from item_iuids A left join GT_INVENTORies B on B.IUID = A.iuid where B.UUID = p_UUID;
    
    drop table if exists mail_ids;
    drop table if exists item_iuids;
    
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_randombox` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_randombox`(
	in p_UUID int
    , in p_RANDOMBOX_IUID long
    , in p_RANDOMBOX_ID int
	, in p_BOX_IDS varchar(1024)
    , in p_BOX_COUNT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 랜덤박스 ID 테이블
    drop table if exists split_results;
    create table split_results (split_value varchar(4));
    
    # 획득한 아이템 정보 테이블
    drop temporary table if exists get_items;
	create temporary table get_items (IUID long, ITEM_ID int, ITEM_COUNT int);
    
    begin
		declare m_counter int default 0;
        declare m_reward_type int default 0;
        declare m_item_id int default 0;
        declare m_effect_id int default 0;
        declare m_effect_value int default 0;
        declare m_iuid int default 0;
        declare m_item_count int default 0;
        declare m_exist_yn int default 0;
        declare m_wallet int default 0;
        
        declare m_gold int default 0;
        declare m_cash int default 0;
        declare m_point_honor int default 0;
        declare m_point_alliance int default 0;
        declare m_point_challenge int default 0;
        
        declare m_cutting_value int default 100;
        declare m_cutting_value_point int default 10;
        
        # 랜덤박스 사용
        update GT_INVENTORies set ITEM_COUNT = ITEM_COUNT - p_BOX_COUNT, EXIST_YN = if (ITEM_COUNT - p_BOX_COUNT > 0, true, false)  where UUID = p_UUID and IUID = p_RANDOMBOX_IUID and EXIST_YN = 1;
        
        #select * from GT_INVENTORies;
        
        # loop 재화, 아이템 획득
        while (m_counter < p_BOX_COUNT) do
			set m_counter = m_counter + 1;
            
            select REWARD_TYPE, ITEM_ID, EFFECT_ID, (select floor(rand() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE)) as EFFECT_VALUE 
            into m_reward_type, m_item_id, m_effect_id, m_effect_value
            from BT_RANDOMBOXes where RANDOMBOX_ID = fn_string_split(p_BOX_IDS, ',', m_counter);
            
            #select m_reward_type, m_item_id, m_effect_id, m_effect_value;
            
            # 아이템 획득
            if (m_reward_type = 2) then
				if (m_item_id <> 0 and m_effect_value <> 0) then
					set m_iuid = fn_add_item(p_UUID, m_item_id, m_effect_value);
				end if;
                
				begin
					select ITEM_COUNT into m_item_count from GT_INVENTORies where UUID = p_UUID and IUID = m_iuid;
					select count(*) into m_exist_yn from get_items WHERE item_id = m_item_id;
                    
					if (m_exist_yn = 0) then
						insert into get_items (IUID, ITEM_ID, ITEM_COUNT) values (m_iuid, m_item_id, m_item_count);
					else
						update get_items set item_count = m_item_count where item_id = m_item_id;
					end if;
				end;
			else
				# 골드 획득 - 100 단위로 절삭
                if (m_effect_id = 2) then
					select if (m_effect_value > m_cutting_value, floor(m_effect_value / m_cutting_value) * m_cutting_value, m_effect_value) into m_effect_value;
				else					
					select if (m_effect_value > m_cutting_value_point, floor(m_effect_value / m_cutting_value_point) * m_cutting_value_point, m_effect_value) into m_effect_value;
				end if;
				
				set m_wallet = fn_add_wallet(p_UUID, m_effect_id, m_effect_value);
				
			end if;
        end while;
        
        -- 결과 반환
        select * from GT_INVENTORies where UUID = p_UUID and IUID = p_RANDOMBOX_IUID;
        select * FROM GT_USERs where UUID = p_UUID;
        select * from get_items;
        
        drop table if exists split_results;
        drop temporary table if exists get_items;
    end;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_reward`(
	in p_UUID BIGINT
    , in p_GOLD int
    , in p_CASH int
    , in p_POINT_HONOR int
    , in p_POINT_ALLIANCE int
    , in p_POINT_CHALLENGE int
    , in p_ITEM1_ID int, in p_ITEM1_COUNT int
    , in p_ITEM2_ID int, in p_ITEM2_COUNT int
    , in p_ITEM3_ID int, in p_ITEM3_COUNT int
    , in p_ITEM4_ID int, in p_ITEM4_COUNT int
    , in p_ITEM5_ID int, in p_ITEM5_COUNT int 
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
		# function 반환값 변수
		declare m_iuid int default 0;
        
        # 재화 보상 지급
        if (p_GOLD <> 0) then
			update GT_USERs set GOLD = GOLD + p_GOLD where UUID = p_UUID;
		end if;
        
        if (p_CASH <> 0) then
			update GT_USERs set CASH = CASH + p_CASH where UUID = p_UUID;
		end if;
        
        if (p_POINT_HONOR <> 0) then
			update GT_USERs set POINT_HONOR = POINT_HONOR + p_POINT_HONOR where UUID = p_UUID;
		end if;
        
        if (p_POINT_ALLIANCE <> 0) then
			update GT_USERs set POINT_POINT_ALLIANCE = POINT_POINT_ALLIANCE + p_POINT_POINT_ALLIANCE where UUID = p_UUID;
		end if;
        
        if (p_POINT_CHALLENGE <> 0) then
			update GT_USERs set POINT_CHALLENGE = POINT_CHALLENGE + p_POINT_CHALLENGE where UUID = p_UUID;
		end if;
        
		# 아이템 보상 지급
        if (p_ITEM1_ID <> 0) then
            select fn_add_item(p_UUID, p_ITEM1_ID, p_ITEM1_COUNT) into m_iuid;
		end if;

        if (p_ITEM2_ID <> 0) then
            select fn_add_item(p_UUID, p_ITEM2_ID, p_ITEM2_COUNT) into m_iuid;
		end if;

		if (p_ITEM3_ID <> 0) then
            select fn_add_item(p_UUID, p_ITEM3_ID, p_ITEM3_COUNT) into m_iuid;
		end if;

		if (p_ITEM4_ID <> 0) then
            select fn_add_item(p_UUID, p_ITEM4_ID, p_ITEM4_COUNT) into m_iuid;
		end if;

		if (p_ITEM5_ID <> 0) then
            select fn_add_item(p_UUID, p_ITEM5_ID, p_ITEM5_COUNT) into m_iuid;
		end if;
    
		# 보상 정보 반환
        select * from GT_USERs where UUID = p_UUID;
        
		select IUID, ITEM_ID, ITEM_COUNT 
        from GT_INVENTORies 
        where UUID = p_UUID and ITEM_ID in (p_ITEM1_ID, p_ITEM2_ID, p_ITEM3_ID, p_ITEM4_ID, p_ITEM5_ID) and EXIST_YN = 1;
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_reward_box` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_reward_box`(
	in p_UUID bigint
    , in p_ACCOUNT_EXP int
    , in p_STAMINA int
    , in p_GOLD int
    , in p_CASH int
    , in p_POINT_HONOR int
    , in p_POINT_ALLIANCE int
    , in p_POINT_CHALLENGE int
    , in p_ITEM_ID_1 int, in p_ITEM_COUNT_1 int
    , in p_ITEM_ID_2 int, in p_ITEM_COUNT_2 int
    , in p_ITEM_ID_3 int, in p_ITEM_COUNT_3 int
    , in p_ITEM_ID_4 int, in p_ITEM_COUNT_4 int
    , in p_ITEM_ID_5 int, in p_ITEM_COUNT_5 int
    , in p_ITEM_ID_6 int, in p_ITEM_COUNT_6 int
    , in p_ITEM_ID_7 int, in p_ITEM_COUNT_7 int
    , in p_ITEM_ID_8 int, in p_ITEM_COUNT_8 int
    , in p_ITEM_ID_9 int, in p_ITEM_COUNT_9 int
    , in p_ITEM_ID_10 int, in p_ITEM_COUNT_10 int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
		declare m_user_level   int default 0;
		declare m_user_exp     int default 0;
        declare m_stamina      int default 0;
        declare m_max_stamina  int default 0;

		# 아이템 보상 결과
		declare m_iuid1 int default 0;
        declare m_iuid2 int default 0;
        declare m_iuid3 int default 0;
        declare m_iuid4 int default 0;
        declare m_iuid5 int default 0;
        declare m_iuid6 int default 0;
        declare m_iuid7 int default 0;
        declare m_iuid8 int default 0;
        declare m_iuid9 int default 0;
        declare m_iuid10 int default 0;
        
        # 기본 정보
        select USER_LEVEL, USER_EXP, STAMINA, MAX_STAMINA into m_user_level, m_user_exp, m_stamina, m_max_stamina from GT_USERs where UUID = p_UUID and EXIST_YN = true;
        
        # 계정 경험치
        if (p_ACCOUNT_EXP <> 0) then
			begin
				declare m_target_level int default 0;
                
				set m_user_exp = m_user_exp + p_ACCOUNT_EXP;

				# 레벨업 정보
				select A.TARGET_LEVEL into m_target_level
				from (
					select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
					from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_user_exp
				) as A order by A.TARGET_LEVEL desc limit 1;
                
                # 레벨 업
                if (m_target_level > m_user_level) then
                    begin
                        declare m_recoverty_stamina int default 0;

                        set m_user_level = m_target_level;

                        select RECOVERY_STAMINA into m_recoverty_stamina from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_user_level;
                        
    					set m_stamina = m_stamina + m_recoverty_stamina;
                        set m_max_stamina = fn_select_max_stamina(m_user_level);
                    end;
                end if;
			end;
        end if;
        
        # 스테미너
        if (p_STAMINA <> 0) then
			set m_stamina = m_stamina + p_STAMINA;
        end if;       
        
        # 보상
		update GT_USERs set 
			GOLD = GOLD + p_GOLD
            , CASH = CASH + p_CASH
            , POINT_HONOR = POINT_HONOR + p_POINT_HONOR
            , POINT_ALLIANCE = POINT_ALLIANCE + p_POINT_ALLIANCE
            , POINT_CHALLENGE = POINT_CHALLENGE + p_POINT_CHALLENGE
            , USER_EXP = m_user_exp
            , USER_LEVEL = m_user_level
            , STAMINA = if (m_stamina < 0, 0, m_stamina)
            , MAX_STAMINA = m_max_stamina
            , LAST_STAMINA_CHANGE_DATE = if (m_stamina >= m_max_stamina, null, now())
		where UUID = p_UUID;
        
		# 아이템 보상
        if (p_ITEM_ID_1 <> 0) then set m_iuid1 = fn_add_item(p_UUID, p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then set m_iuid2 = fn_add_item(p_UUID, p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
		if (p_ITEM_ID_3 <> 0) then set m_iuid3 = fn_add_item(p_UUID, p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
		if (p_ITEM_ID_4 <> 0) then set m_iuid4 = fn_add_item(p_UUID, p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
		if (p_ITEM_ID_5 <> 0) then set m_iuid5 = fn_add_item(p_UUID, p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
        if (p_ITEM_ID_6 <> 0) then set m_iuid6 = fn_add_item(p_UUID, p_ITEM_ID_6, p_ITEM_COUNT_6); end if;
        if (p_ITEM_ID_7 <> 0) then set m_iuid7 = fn_add_item(p_UUID, p_ITEM_ID_7, p_ITEM_COUNT_7); end if;
        if (p_ITEM_ID_8 <> 0) then set m_iuid8 = fn_add_item(p_UUID, p_ITEM_ID_8, p_ITEM_COUNT_8); end if;
        if (p_ITEM_ID_9 <> 0) then set m_iuid9 = fn_add_item(p_UUID, p_ITEM_ID_9, p_ITEM_COUNT_9); end if;
        if (p_ITEM_ID_10 <> 0) then set m_iuid10 = fn_add_item(p_UUID, p_ITEM_ID_10, p_ITEM_COUNT_10); end if;
   
		# 보상 정보 반환
        select * from GT_USERs where UUID = p_UUID;
		select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid1, m_iuid2, m_iuid3, m_iuid4, m_iuid5, m_iuid6, m_iuid7, m_iuid8, m_iuid9, m_iuid10) and EXIST_YN = 1;
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_summon_open` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_summon_open`(
	in p_UUID BIGINT
    , in p_SUMMON_ID int
    , in p_NEED_GOLD int
    , in p_NEED_CASH int
    , in p_TRAIT_01_SKILL_ID int, in p_TRAIT_01_EXP_ID int
    , in p_TRAIT_02_SKILL_ID int, in p_TRAIT_02_EXP_ID int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
		declare m_summon_count int default 0;
        declare m_summon_tot_count int default 0;
        declare m_trait_01_count int default 0;
        declare m_trait_02_count int default 0;
        
        # 재화 차감
        if (p_NEED_GOLD <> 0) then
			update GT_USERs set GOLD = if (GOLD - p_NEED_GOLD < 0, 0, GOLD - p_NEED_GOLD) where UUID = p_UUID;
		end if;
        
        if (p_NEED_CASH <> 0) then
			update GT_USERs set CASH = if (CASH - p_NEED_CASH < 0, 0, CASH - p_NEED_CASH) where UUID = p_UUID;
		end if;
        
        # 최초 Open이면 사용으로 설정
        select count(*) into m_summon_tot_count from GT_SUMMONs where UUID = p_UUID;
        
        select count(*) into m_summon_count from GT_SUMMONs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID;        
        if (m_summon_count = 0) then
			insert into GT_SUMMONs (UUID, SUMMON_ID, USE_YN) values (p_UUID, p_SUMMON_ID, if(m_summon_tot_count = 0, true, false));
        end if;
        
        # 특성 설정
        select count(*) into m_trait_01_count from GT_SUMMON_TRAITs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID and TRAIT_SKILL_ID = p_TRAIT_01_SKILL_ID;
        if (m_trait_01_count = 0) then
			insert into GT_SUMMON_TRAITs (UUID, SUMMON_ID, TRAIT_SKILL_ID, TRAIT_EXP_ID) values (p_UUID, p_SUMMON_ID, p_TRAIT_01_SKILL_ID, p_TRAIT_01_EXP_ID);
        end if;
        
        select count(*) into m_trait_02_count from GT_SUMMON_TRAITs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID and TRAIT_SKILL_ID = p_TRAIT_02_SKILL_ID;
        if (m_trait_02_count = 0) then
			insert into GT_SUMMON_TRAITs (UUID, SUMMON_ID, TRAIT_SKILL_ID, TRAIT_EXP_ID) values (p_UUID, p_SUMMON_ID, p_TRAIT_02_SKILL_ID, p_TRAIT_02_EXP_ID);
        end if;
    
		# 정보 반환
        select GOLD, CASH from GT_USERs where UUID = p_UUID;
        select * from GT_SUMMONs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID;
        select * from GT_SUMMON_TRAITs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID and TRAIT_SKILL_ID in (p_TRAIT_01_SKILL_ID, p_TRAIT_02_SKILL_ID);
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insert_vip_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_vip_reward`(
	in p_UUID BIGINT
    , in p_REWARD_STEP_LIST varchar(255)
	, in p_REWARD_TYPE_1 int, in p_REWARD_ITEM_ID_1 int, in p_REWARD_COUNT_1 int
	, in p_REWARD_TYPE_2 int, in p_REWARD_ITEM_ID_2 int, in p_REWARD_COUNT_2 int
	, in p_REWARD_TYPE_3 int, in p_REWARD_ITEM_ID_3 int, in p_REWARD_COUNT_3 int
	, in p_REWARD_TYPE_4 int, in p_REWARD_ITEM_ID_4 int, in p_REWARD_COUNT_4 int
	, in p_REWARD_TYPE_5 int, in p_REWARD_ITEM_ID_5 int, in p_REWARD_COUNT_5 int 
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
		# function 반환값 변수
		declare m_iuid_1 int default 0;
		declare m_iuid_2 int default 0;
		declare m_iuid_3 int default 0;
		declare m_iuid_4 int default 0;
		declare m_iuid_5 int default 0;
        declare m_wallet int default 0;
        
        # 보상 ID 설정
        update GT_VIPs set REWARD_STEP_LIST = p_REWARD_STEP_LIST where UUID = p_UUID;
        
        if (p_REWARD_TYPE_1 = 1) then
			set m_iuid_1 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_1, p_REWARD_COUNT_1);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_1, p_REWARD_COUNT_1);
		end if;

		if (p_REWARD_TYPE_2 = 1) then
			set m_iuid_2 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_2, p_REWARD_COUNT_2);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_2, p_REWARD_COUNT_2);
		end if;

		if (p_REWARD_TYPE_3 = 1) then
			set m_iuid_3 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_3, p_REWARD_COUNT_3);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_3, p_REWARD_COUNT_3);
		end if;  

		if (p_REWARD_TYPE_4 = 1) then
			set m_iuid_4 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_4, p_REWARD_COUNT_4);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_4, p_REWARD_COUNT_4);
		end if;  

		if (p_REWARD_TYPE_5 = 1) then
			set m_iuid_5 = fn_add_item(p_UUID, p_REWARD_ITEM_ID_5, p_REWARD_COUNT_5);
		else
			set m_wallet = fn_add_wallet(p_UUID, p_REWARD_TYPE_5, p_REWARD_COUNT_5);
		end if;  
    
		# 보상 정보 반환
        select * from GT_USERs where UUID = p_UUID;
        select * from GT_VIPs where UUID = p_UUID;
		select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1, m_iuid_2, m_iuid_3, m_iuid_4, m_iuid_5);
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_rank_match_record` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_rank_match_record`(
	in p_UUID BIGINT,
    in p_BATTLE_RESULT BOOL,
    in p_USER_RANK INT,
    in p_DELTA_RANK INT,
    in p_OPPONENT_UUID BIGINT,
    in p_OPPONENT_RANK INT,
    in p_OPPONENT_USER_LEVEL INT,
	in p_OPPONENT_ICON INT,
    in p_OPPONENT_NICK VARCHAR(20),
    in p_OPPONENT_BATTLE_POWER INT,
    in p_BOT BOOL,
    in p_SLOT1_HERO_ID INT, in p_SLOT1_HERO_LEVEL INT, in p_SLOT1_POROMOTION_STEP INT, in p_SLOT1_EVOLUTION_STEP INT,
    in p_SLOT2_HERO_ID INT, in p_SLOT2_HERO_LEVEL INT, in p_SLOT2_POROMOTION_STEP INT, in p_SLOT2_EVOLUTION_STEP INT,
    in p_SLOT3_HERO_ID INT, in p_SLOT3_HERO_LEVEL INT, in p_SLOT3_POROMOTION_STEP INT, in p_SLOT3_EVOLUTION_STEP INT,
    in p_SLOT4_HERO_ID INT, in p_SLOT4_HERO_LEVEL INT, in p_SLOT4_POROMOTION_STEP INT, in p_SLOT4_EVOLUTION_STEP INT,
    in p_SLOT5_HERO_ID INT, in p_SLOT5_HERO_LEVEL INT, in p_SLOT5_POROMOTION_STEP INT, in p_SLOT5_EVOLUTION_STEP INT,
    in p_SLOT6_HERO_ID INT, in p_SLOT6_HERO_LEVEL INT, in p_SLOT6_POROMOTION_STEP INT, in p_SLOT6_EVOLUTION_STEP INT,
    in p_TAG_SLOT1_HERO_ID INT, in p_TAG_SLOT1_HERO_LEVEL INT, in p_TAG_SLOT1_POROMOTION_STEP INT, in p_TAG_SLOT1_EVOLUTION_STEP INT,
    in p_TAG_SLOT2_HERO_ID INT, in p_TAG_SLOT2_HERO_LEVEL INT, in p_TAG_SLOT2_POROMOTION_STEP INT, in p_TAG_SLOT2_EVOLUTION_STEP INT,
    in p_TAG_SLOT3_HERO_ID INT, in p_TAG_SLOT3_HERO_LEVEL INT, in p_TAG_SLOT3_POROMOTION_STEP INT, in p_TAG_SLOT3_EVOLUTION_STEP INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 1. 랭크전 결과 기록.
    # TODO : 상대방의 정보는 봇일 수 있기 때문에 받아 와야 한다. 
    # - 본인의 정보는 GT_TEAM과 GT_HERO를 연계해서 정보를 만든다. 
    # - GT_TEAM의 슬롯이 나열 되어 있고, 해당 컬럼의 값이 0 일 수 있기에 검색 결과 empty row가 나올 수 있다. (not null)
    # - empty row 식별을 위해 max 함수를 사용함으로 인해서 in을 통한 검색에 제한이 온다. 
    # - Team의 영웅 정보를 가상 테이블을 만들어서 커서로 영웅 정보를 가져온다 해도 record 테이블에 넣을 수 있는 방법이 없다. 
    begin
    
		declare m_my_record int;
        declare m_target_record int;
        
        if ( p_BOT = true ) then 
			insert into GT_RANK_RECORDs
						(UUID, BATTLE_RESULT, DELTA_RANK, OPPONENT_UUID, OPPONENT_RANK, OPPONENT_USER_LEVEL, OPPONENT_ICON, OPPONENT_NICK, OPPONENT_BATTLE_POWER, OPPONENT_ALLIANCE_NAME, BATTLE_DATE,
						 SLOT1_HERO_ID, SLOT1_HERO_LEVEL, SLOT1_POROMOTION_STEP, SLOT1_EVOLUTION_STEP, SLOT2_HERO_ID, SLOT2_HERO_LEVEL, SLOT2_POROMOTION_STEP, SLOT2_EVOLUTION_STEP,
						 SLOT3_HERO_ID, SLOT3_HERO_LEVEL, SLOT3_POROMOTION_STEP, SLOT3_EVOLUTION_STEP, SLOT4_HERO_ID, SLOT4_HERO_LEVEL, SLOT4_POROMOTION_STEP, SLOT4_EVOLUTION_STEP,
						 SLOT5_HERO_ID, SLOT5_HERO_LEVEL, SLOT5_POROMOTION_STEP, SLOT5_EVOLUTION_STEP, SLOT6_HERO_ID, SLOT6_HERO_LEVEL, SLOT6_POROMOTION_STEP, SLOT6_EVOLUTION_STEP,
						 TAG_SLOT1_HERO_ID, TAG_SLOT1_HERO_LEVEL, TAG_SLOT1_POROMOTION_STEP, TAG_SLOT1_EVOLUTION_STEP,
						 TAG_SLOT2_HERO_ID, TAG_SLOT2_HERO_LEVEL, TAG_SLOT2_POROMOTION_STEP, TAG_SLOT2_EVOLUTION_STEP,
						 TAG_SLOT3_HERO_ID, TAG_SLOT3_HERO_LEVEL, TAG_SLOT3_POROMOTION_STEP, TAG_SLOT3_EVOLUTION_STEP)
				values ( p_UUID, p_BATTLE_RESULT, p_DELTA_RANK, p_OPPONENT_UUID, p_OPPONENT_RANK, p_OPPONENT_USER_LEVEL, p_OPPONENT_ICON, p_OPPONENT_NICK, p_OPPONENT_BATTLE_POWER, '', now(),
						 p_SLOT1_HERO_ID, p_SLOT1_HERO_LEVEL, p_SLOT1_POROMOTION_STEP, p_SLOT1_EVOLUTION_STEP, p_SLOT2_HERO_ID, p_SLOT2_HERO_LEVEL, p_SLOT2_POROMOTION_STEP, p_SLOT2_EVOLUTION_STEP,
						 p_SLOT3_HERO_ID, p_SLOT3_HERO_LEVEL, p_SLOT3_POROMOTION_STEP, p_SLOT3_EVOLUTION_STEP, p_SLOT4_HERO_ID, p_SLOT4_HERO_LEVEL, p_SLOT4_POROMOTION_STEP, p_SLOT4_EVOLUTION_STEP,
						 p_SLOT5_HERO_ID, p_SLOT5_HERO_LEVEL, p_SLOT5_POROMOTION_STEP, p_SLOT5_EVOLUTION_STEP, p_SLOT6_HERO_ID, p_SLOT6_HERO_LEVEL, p_SLOT6_POROMOTION_STEP, p_SLOT6_EVOLUTION_STEP,
						 p_TAG_SLOT1_HERO_ID, p_TAG_SLOT1_HERO_LEVEL, p_TAG_SLOT1_POROMOTION_STEP, p_TAG_SLOT1_EVOLUTION_STEP,
						 p_TAG_SLOT2_HERO_ID, p_TAG_SLOT2_HERO_LEVEL, p_TAG_SLOT2_POROMOTION_STEP, p_TAG_SLOT2_EVOLUTION_STEP,
						 p_TAG_SLOT3_HERO_ID, p_TAG_SLOT3_HERO_LEVEL, p_TAG_SLOT3_POROMOTION_STEP, p_TAG_SLOT3_EVOLUTION_STEP);
		else
			set m_my_record 	= fn_insert_match_record(p_UUID, p_OPPONENT_UUID, p_BATTLE_RESULT, p_DELTA_RANK, p_OPPONENT_RANK);
            set m_target_record = fn_insert_match_record(p_OPPONENT_UUID, p_UUID, p_BATTLE_RESULT, -p_DELTA_RANK, p_USER_RANK);
        end if;

    end;
    
    select p_UUID;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_select_infinity_tower_rank` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_select_infinity_tower_rank`(
	  in p_UUID bigint
    )
BEGIN
    select * from (
		select 
			(select count(*) from GT_INFINITY_TOWER_USERs T2 where T2.LAST_RANK_SCORE > T1.LAST_RANK_SCORE) + 1 as ORDER_RANK
			, ifnull((select USER_LEVEL from GT_USERs where UUID = T1.UUID), 0) as USER_LEVEL
			, ifnull((select NICK from GT_USERs where UUID = T1.UUID), 0) as NICK
			, ifnull((select ICON from GT_USERs where UUID = T1.UUID), 0) as ICON
			, T1.*
		from GT_INFINITY_TOWER_USERs T1
	) T_RANK
	WHERE UUID = p_UUID
	order by ORDER_RANK, LAST_BATTLE_SCORE_DATE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_select_infinity_tower_ranker_list` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_select_infinity_tower_ranker_list`(
	  in p_PAGE_NUM bigint
    )
BEGIN
    select * from (
		select 
			(select count(*) from GT_INFINITY_TOWER_USERs T2 where T2.LAST_RANK_SCORE > T1.LAST_RANK_SCORE) + 1 as ORDER_RANK
			, ifnull((select USER_LEVEL from GT_USERs where UUID = T1.UUID), 0) as USER_LEVEL
			, ifnull((select NICK from GT_USERs where UUID = T1.UUID), 0) as NICK
			, ifnull((select ICON from GT_USERs where UUID = T1.UUID), 0) as ICON
			, T1.*
		from GT_INFINITY_TOWER_USERs T1
	) T_RANK
	WHERE ORDER_RANK between (20 * p_PAGE_NUM - 20) + 1 and 20 * p_PAGE_NUM
	order by ORDER_RANK, LAST_BATTLE_SCORE_DATE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_select_summon` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_select_summon`(
	  in p_UUID bigint
    )
BEGIN
	
    # 1. 궁극 소환수
	select * from GT_SUMMONs where UUID = p_UUID;
    
    # 2. 궁극 소환수 특성
    select * from GT_SUMMON_TRAITs where UUID = p_UUID;    
    
    # 3. 궁극 소환수 게이지
    select SUMMON_GAGE from GT_USERs where UUID = p_UUID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_special_dungeon_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_special_dungeon_reward`(
	in p_UUID BIGINT,
    in p_STAMINA INT,
    in p_ADD_ACCOUNT_EXP INT,
    in p_ADD_HERO_EXP INT,
    in p_ADD_GOLD BIGINT,
    in p_GAME_MODE INT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists heros;
    drop temporary table if exists result_item;
    drop temporary table if exists result_hero;
	
	# 보상을 위한 가상 테이블 만들기. 
	begin
		create temporary table reward_items ( item_id int, item_count int);
        if (p_ITEM_ID_1 <> 0) then insert into reward_items values  (p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then insert into reward_items values  (p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        if (p_ITEM_ID_3 <> 0) then insert into reward_items values  (p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
        if (p_ITEM_ID_4 <> 0) then insert into reward_items values  (p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
        if (p_ITEM_ID_5 <> 0) then insert into reward_items values  (p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
		
        # 커서를 위한 가상 테이블 만들기.
		create temporary table heros ( hero_id int);
		insert into heros select SLOT1 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT1 <> 0;
		insert into heros select SLOT2 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT2 <> 0;
		insert into heros select SLOT3 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT3 <> 0;
		insert into heros select SLOT4 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT4 <> 0;
		insert into heros select SLOT5 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT5 <> 0;
        insert into heros select SLOT6 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and SLOT6 <> 0;
        insert into heros select TAG_SLOT1 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT1 <> 0;
        insert into heros select TAG_SLOT2 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT2 <> 0;
        insert into heros select TAG_SLOT3 from GT_TEAMs where GAME_MODE = p_GAME_MODE and UUID = p_UUID and TAG_SLOT3 <> 0;
        
        # 결과 반환용 테이블.
		create temporary table result_item ( iuid bigint, item_id int, item_count int);
        create temporary table result_hero ( hero_id int, hero_exp int, hero_level int);
	 end;   

	# 보상 본문 위치.
	begin
		#declare temp_gold bigint default 0;
		# 1. User 보상 적용. (gold, exp, level) 
		begin
            
            declare m_current_user_level int default 0;
            declare m_current_user_exp   int default 0;
            declare m_target_user_level  int default 0;
            declare m_target_user_exp    int default 0;
            declare m_sum_user_exp 		 int default 0;
            
            select USER_LEVEL, USER_EXP into m_current_user_level, m_current_user_exp from GT_USERs where UUID = p_UUID;
            set m_sum_user_exp = m_current_user_exp + p_ADD_ACCOUNT_EXP;
            
            select A.TARGET_LEVEL, A.ACCOUNT_TOTAL_EXP into m_target_user_level, m_target_user_exp
			from (
				select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
                from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_sum_user_exp ) as A  
			order by A.TARGET_LEVEL desc limit 1;
            
            if ( m_target_user_level > m_current_user_level ) then
				update GT_USERs set USER_LEVEL = m_target_user_level, USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, 
						STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now()
                where UUID = p_UUID;
			else
                update GT_USERs set USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, 
									STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
			end if;
		end;
	
		# 2. Hero 보상 적용. (exp, level)
		begin
			declare hero_cur_state int default 0;
            declare m_hero_id int default 0;
            declare m_user_level int default 0;
			declare m_sum_exp int default 0;
			declare m_result_level int default 0;
			declare m_result_exp int default 0;
			declare m_current_level int default 0;
			declare m_current_exp int default 0;
			declare m_target_level int default 0;
			declare m_target_exp int default 0;

			declare hero_cur cursor for select hero_id from heros;
            declare continue handler for sqlstate '02000' set hero_cur_state = 1;
            
            select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID;
            open hero_cur;
				repeat
					fetch hero_cur into m_hero_id;
                    if not hero_cur_state then

						select USER_LEVEL into m_user_level from GT_USERs where UUID = p_UUID;
						select HERO_LEVEL, EXP into m_current_level, m_current_exp
							from GT_HEROes where UUID = p_UUID and HERO_ID = m_hero_id LIMIT 1;
						
						set m_sum_exp = m_current_exp + p_ADD_HERO_EXP;
						
						select A.TARGET_LEVEL, A.HERO_TOTAL_EXP into m_target_level, m_target_exp
						from (
							select TARGET_LEVEL, HERO_TOTAL_EXP from BT_EXPs 
								where HERO_TOTAL_EXP <= m_sum_exp ) as A 
									where A.TARGET_LEVEL <= m_user_level + 1
									and A.TARGET_LEVEL <= (select TARGET_LEVEL from BT_EXPs order by TARGET_LEVEL desc limit 1)
										order by A.TARGET_LEVEL desc limit 1;
										
						if ( m_target_level > m_user_level ) then
							update GT_HEROes set EXP = m_target_exp, HERO_LEVEL = m_user_level
									where UUID = p_UUID and HERO_ID = m_hero_id;
							set m_result_level = m_user_level;
							set m_result_exp = m_target_exp;
						else
							update GT_HEROes set EXP = m_sum_exp, HERO_LEVEL = m_target_level
									where UUID = p_UUID and HERO_ID = m_hero_id;            
							set m_result_level = m_target_level;
							set m_result_exp = m_sum_exp;
						end if;
                            
                        # 결과 반환을 위한 임시테이블 삽입.
						insert into result_hero values (m_hero_id, m_result_exp, m_result_level);
					end if; # if not hero_cur_state then
				until hero_cur_state end repeat;
			close hero_cur;
		end;
	
		# 3. 보상 아이템 지급.
        begin
			declare item_cur_state int default 0;
			declare m_item_id bigint;
            declare m_item_count int;
            declare m_inven_item_cnt int;
            declare m_current_stack_cnt int;
            declare m_cate int;
            
            declare m_result_iuid bigint;
            declare m_result_count int default 0;
        
			declare item_cur cursor for select item_id, item_count from reward_items;
            declare continue handler for sqlstate '02000' set item_cur_state = 1;

            open item_cur;
				repeat
					fetch item_cur into m_item_id, m_item_count;
                    if not item_cur_state then
							
						# 인벤토리에 아이템이 존재 하는 지 검사.
                        select count(*) into m_inven_item_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                        if( m_inven_item_cnt = 0 ) then
							# 없다면 삽입.
							insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
                            set m_result_iuid 		= (SELECT LAST_INSERT_ID());
                            set m_result_count		= m_item_count;
                        else
							select CATEGORY1 into m_cate from BT_ITEM_BASEs where ITEM_ID = m_item_id;
                            if ( m_cate = 2 ) then
								# 장착 아이템.
                                insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
								set m_result_iuid 		= (SELECT LAST_INSERT_ID());
								set m_result_count		= m_item_count;
							else
								select IUID, ITEM_COUNT into m_result_iuid, m_current_stack_cnt 
                                from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                                
                                set m_result_count = m_current_stack_cnt+m_item_count;
								update GT_INVENTORies set ITEM_COUNT = m_result_count where UUID = p_UUID and ITEM_ID = m_item_id;
                            end if;
						end if;
                        
                        # 결과 반환을 위한 임시테이블 삽입.
                        if ( m_result_iuid <> 0 && m_result_count <> 0 ) then 
							insert into result_item values (m_result_iuid, m_item_id, m_result_count); 
                        end if;
                        
                    end if;
				until item_cur_state end repeat;
			close item_cur;
        end;
    end;
    
    # 결과 반환.
    begin
		select USER_LEVEL, USER_EXP, GOLD from GT_USERs where UUID = p_UUID;
        select * from result_hero;
        select * from result_item;
    end;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists heros;
    drop temporary table if exists result_item;
    drop temporary table if exists result_hero;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_special_dungeon_sweep_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_special_dungeon_sweep_reward`(
	in p_UUID BIGINT,
    in p_STAMINA INT,
    in p_ADD_ACCOUNT_EXP INT,
    in p_ADD_GOLD BIGINT,
    in p_GROUP_ID INT,
    in p_REMAIN_COUNT INT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists result_item;
	
	# 보상을 위한 가상 테이블 만들기. 
	begin
		create temporary table reward_items ( item_id int, item_count int);
        if (p_ITEM_ID_1 <> 0) then insert into reward_items values  (p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then insert into reward_items values  (p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        if (p_ITEM_ID_3 <> 0) then insert into reward_items values  (p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
        if (p_ITEM_ID_4 <> 0) then insert into reward_items values  (p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
        if (p_ITEM_ID_5 <> 0) then insert into reward_items values  (p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
		
        # 결과 반환용 테이블.
		create temporary table result_item ( iuid bigint, item_id int, item_count int);
	 end;   

	# 보상 본문 위치.
	begin
		#declare temp_gold bigint default 0;
		# 1. User 보상 적용. (gold, exp, level) 
		begin
            
            declare m_current_user_level int default 0;
            declare m_current_user_exp   int default 0;
            declare m_target_user_level  int default 0;
            declare m_target_user_exp    int default 0;
            declare m_sum_user_exp 		 int default 0;
            
            select USER_LEVEL, USER_EXP into m_current_user_level, m_current_user_exp from GT_USERs where UUID = p_UUID;
            set m_sum_user_exp = m_current_user_exp + p_ADD_ACCOUNT_EXP;
            
            select A.TARGET_LEVEL, A.ACCOUNT_TOTAL_EXP into m_target_user_level, m_target_user_exp
			from (
				select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
                from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_sum_user_exp ) as A  
			order by A.TARGET_LEVEL desc limit 1;
            
            if ( m_target_user_level > m_current_user_level ) then
				update GT_USERs set USER_LEVEL = m_target_user_level, USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, 
						STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now()
                where UUID = p_UUID;
			else
                update GT_USERs set USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, 
									STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
			end if;
		end;
	
		# 2. 보상 아이템 지급.
        begin
			declare item_cur_state int default 0;
			declare m_item_id bigint;
            declare m_item_count int;
            declare m_inven_item_cnt int;
            declare m_current_stack_cnt int;
            declare m_cate int;
            
            declare m_result_iuid bigint;
            declare m_result_count int default 0;
        
			declare item_cur cursor for select item_id, item_count from reward_items;
            declare continue handler for sqlstate '02000' set item_cur_state = 1;

            open item_cur;
				repeat
					fetch item_cur into m_item_id, m_item_count;
                    if not item_cur_state then
							
						# 인벤토리에 아이템이 존재 하는 지 검사.
                        select count(*) into m_inven_item_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                        if( m_inven_item_cnt = 0 ) then
							# 없다면 삽입.
							insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
                            set m_result_iuid 		= (SELECT LAST_INSERT_ID());
                            set m_result_count		= m_item_count;
                        else
							select CATEGORY1 into m_cate from BT_ITEM_BASEs where ITEM_ID = m_item_id;
                            if ( m_cate = 2 ) then
								# 장착 아이템.
                                insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
								set m_result_iuid 		= (SELECT LAST_INSERT_ID());
								set m_result_count		= m_item_count;
							else
								select IUID, ITEM_COUNT into m_result_iuid, m_current_stack_cnt 
                                from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                                
                                set m_result_count = m_current_stack_cnt+m_item_count;
								update GT_INVENTORies set ITEM_COUNT = m_result_count where UUID = p_UUID and ITEM_ID = m_item_id;
                            end if;
						end if;
                        
                        # 결과 반환을 위한 임시테이블 삽입.
                        if ( m_result_iuid <> 0 && m_result_count <> 0 ) then 
							insert into result_item values (m_result_iuid, m_item_id, m_result_count); 
                        end if;
                        
                    end if;
				until item_cur_state end repeat;
			close item_cur;
        end;
    end;
    
    # 3. 횟수 업데이트.
    begin
		update GT_SPECIAL_DUNGEON_GROUPs set DAILY_EXEC_COUNT = p_REMAIN_COUNT where UUID = p_UUID and SPECIAL_DUNGEON_GROUP_ID = p_GROUP_ID;
    end;
    
    
    # 결과 반환.
    begin
		select USER_LEVEL, USER_EXP, GOLD from GT_USERs where UUID = p_UUID;
        select * from result_item;
    end;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists result_item;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_sweep_reward` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_sweep_reward`(
	in p_UUID BIGINT,
    in p_STAMINA INT,
    in p_ADD_ACCOUNT_EXP INT,
    in p_ADD_GOLD BIGINT,
    in p_ITEM_ID_1 INT, in p_ITEM_COUNT_1 INT,
    in p_ITEM_ID_2 INT, in p_ITEM_COUNT_2 INT,
    in p_ITEM_ID_3 INT, in p_ITEM_COUNT_3 INT,
    in p_ITEM_ID_4 INT, in p_ITEM_COUNT_4 INT,
    in p_ITEM_ID_5 INT, in p_ITEM_COUNT_5 INT,
    in p_ITEM_ID_6 INT, in p_ITEM_COUNT_6 INT,
    in p_ITEM_ID_7 INT, in p_ITEM_COUNT_7 INT,
    in p_ITEM_ID_8 INT, in p_ITEM_COUNT_8 INT,
    in p_ITEM_ID_9 INT, in p_ITEM_COUNT_9 INT,
    in p_ITEM_ID_10 INT, in p_ITEM_COUNT_10 INT,
    in p_ITEM_ID_11 INT, in p_ITEM_COUNT_11 INT,
    in p_ITEM_ID_12 INT, in p_ITEM_COUNT_12 INT,
    in p_ITEM_ID_13 INT, in p_ITEM_COUNT_13 INT,
    in p_ITEM_ID_14 INT, in p_ITEM_COUNT_14 INT,
    in p_ITEM_ID_15 INT, in p_ITEM_COUNT_15 INT
)
BEGIN
	
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists result_item;
	
	# 보상을 위한 가상 테이블 만들기. 
	begin
		create temporary table reward_items ( item_id int, item_count int);
        if (p_ITEM_ID_1 <> 0) then insert into reward_items values  (p_ITEM_ID_1, p_ITEM_COUNT_1); end if;
        if (p_ITEM_ID_2 <> 0) then insert into reward_items values  (p_ITEM_ID_2, p_ITEM_COUNT_2); end if;
        if (p_ITEM_ID_3 <> 0) then insert into reward_items values  (p_ITEM_ID_3, p_ITEM_COUNT_3); end if;
        if (p_ITEM_ID_4 <> 0) then insert into reward_items values  (p_ITEM_ID_4, p_ITEM_COUNT_4); end if;
        if (p_ITEM_ID_5 <> 0) then insert into reward_items values  (p_ITEM_ID_5, p_ITEM_COUNT_5); end if;
        if (p_ITEM_ID_6 <> 0) then insert into reward_items values  (p_ITEM_ID_6, p_ITEM_COUNT_6); end if;
        if (p_ITEM_ID_7 <> 0) then insert into reward_items values  (p_ITEM_ID_7, p_ITEM_COUNT_7); end if;
        if (p_ITEM_ID_8 <> 0) then insert into reward_items values  (p_ITEM_ID_8, p_ITEM_COUNT_8); end if;
        if (p_ITEM_ID_9 <> 0) then insert into reward_items values  (p_ITEM_ID_9, p_ITEM_COUNT_9); end if;
        if (p_ITEM_ID_10 <> 0) then insert into reward_items values  (p_ITEM_ID_10, p_ITEM_COUNT_10); end if;
        if (p_ITEM_ID_11 <> 0) then insert into reward_items values  (p_ITEM_ID_11, p_ITEM_COUNT_11); end if;
        if (p_ITEM_ID_12 <> 0) then insert into reward_items values  (p_ITEM_ID_12, p_ITEM_COUNT_12); end if;
        if (p_ITEM_ID_13 <> 0) then insert into reward_items values  (p_ITEM_ID_13, p_ITEM_COUNT_13); end if;
        if (p_ITEM_ID_14 <> 0) then insert into reward_items values  (p_ITEM_ID_14, p_ITEM_COUNT_14); end if;
        if (p_ITEM_ID_15 <> 0) then insert into reward_items values  (p_ITEM_ID_15, p_ITEM_COUNT_15); end if;
		
        # 결과 반환용 테이블.
		create temporary table result_item ( iuid bigint, item_id int, item_count int);
	 end;   

	# 보상 본문 위치.
	begin
		#declare temp_gold bigint default 0;
		
		# 1. User 보상 적용. (gold, exp, level) 
		begin
            declare m_current_user_level int default 0;
            declare m_current_user_exp   int default 0;
            declare m_target_user_level  int default 0;
            declare m_target_user_exp    int default 0;
            declare m_sum_user_exp 		 int default 0;
            
            select USER_LEVEL, USER_EXP into m_current_user_level, m_current_user_exp from GT_USERs where UUID = p_UUID;
            set m_sum_user_exp = m_current_user_exp + p_ADD_ACCOUNT_EXP;
            
            select A.TARGET_LEVEL, A.ACCOUNT_TOTAL_EXP into m_target_user_level, m_target_user_exp
			from (
				select TARGET_LEVEL, ACCOUNT_TOTAL_EXP 
                from BT_EXPs where ACCOUNT_TOTAL_EXP <= m_sum_user_exp ) as A  
			order by A.TARGET_LEVEL desc limit 1;
            
            # 계정 레벨 업
            if ( m_target_user_level > m_current_user_level ) then
                begin
                    declare m_recovery_stamina int default 0;
                    declare m_max_stamina int default 0;
                    
                    select RECOVERY_STAMINA into m_recovery_stamina from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_target_user_level;
                    select MAX_STAMINA into m_max_stamina from BT_LEVEL_UNLOCKs where TARGET_LEVEL = m_target_user_level;

                    update GT_USERs set USER_LEVEL = m_target_user_level, USER_EXP = m_sum_user_exp, GOLD = p_ADD_GOLD, STAMINA = p_STAMINA + m_recovery_stamina, MAX_STAMINA = m_max_stamina, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
                end;
            else
                begin
                    update GT_USERs set USER_EXP = m_sum_user_exp, GOLD = GOLD + p_ADD_GOLD, STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = now() where UUID = p_UUID;
                end;
            end if;
		end;

		# 3. 보상 아이템 지급.
        begin
			declare item_cur_state int default 0;
			declare m_item_id bigint;
            declare m_item_count int;
            declare m_inven_item_cnt int;
            declare m_current_stack_cnt int;
            declare m_cate int;
            
            declare m_result_iuid bigint;
            declare m_result_count int default 0;
        
			declare item_cur cursor for select item_id, item_count from reward_items;
            declare continue handler for sqlstate '02000' set item_cur_state = 1;

            open item_cur;
				repeat
					fetch item_cur into m_item_id, m_item_count;
                    if not item_cur_state then
							
						# 인벤토리에 아이템이 존재 하는 지 검사.
                        select count(*) into m_inven_item_cnt from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                        if( m_inven_item_cnt = 0 ) then
							# 없다면 삽입.
							insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
                            set m_result_iuid = (SELECT LAST_INSERT_ID());
                            set m_result_count = m_item_count;
                        else
							select CATEGORY1 into m_cate from BT_ITEM_BASEs where ITEM_ID = m_item_id;
                            if ( m_cate = 2 ) then
								# 장착 아이템.
                                insert GT_INVENTORies (UUID, ITEM_ID, ITEM_COUNT, EXIST_YN) values (p_UUID, m_item_id, m_item_count, true);
								set m_result_iuid = (SELECT LAST_INSERT_ID());
								set m_result_count = m_item_count;
							else
								select IUID, ITEM_COUNT into m_result_iuid, m_current_stack_cnt 
                                from GT_INVENTORies where UUID = p_UUID and ITEM_ID = m_item_id and EXIST_YN = true;
                                
                                set m_result_count = m_current_stack_cnt+m_item_count;
								update GT_INVENTORies set ITEM_COUNT = m_result_count where UUID = p_UUID and ITEM_ID = m_item_id;
                            end if;
						end if;
                        
                        # 결과 반환을 위한 임시테이블 삽입.
                        if ( m_result_iuid <> 0 && m_result_count <> 0 ) then 
							insert into result_item values (m_result_iuid, m_item_id, m_result_count); 
                        end if;
                        
                    end if;
				until item_cur_state end repeat;
			close item_cur;
        end;
    end;
    
    # 결과 반환.
    begin
		select * from GT_USERs where UUID = p_UUID;
        select * from result_item;
    end;
    
    # 가상 테이블 삭제.
    drop temporary table if exists reward_items;
    drop temporary table if exists result_item;

commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_account_buff_levelup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_account_buff_levelup`(
      in p_UUID int
    , in p_ACCOUNT_BUFF_ID int
    , in p_NEED_GOLD int
    , in p_ITEM_ID int
    , in p_COUNT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    begin
		declare m_account_buff_count int default 0;
		declare m_curr_level int default 0;
		declare m_max_level int default 0;
		declare m_iuid_1 int default 0;
        
        # 계정 버프 확인
        select count(*) into m_account_buff_count from GT_ACCOUNT_BUFFs where UUID = p_UUID and ACCOUNT_BUFF_ID = p_ACCOUNT_BUFF_ID and EXIST_YN = true;
        if (m_account_buff_count = 0) then
			insert into GT_ACCOUNT_BUFFs (UUID, ACCOUNT_BUFF_ID) values (p_UUID, p_ACCOUNT_BUFF_ID);
		end if;
        
        # 현재 레벨
        select ACCOUNT_BUFF_LEVEL into m_curr_level from GT_ACCOUNT_BUFFs where UUID = p_UUID and ACCOUNT_BUFF_ID = p_ACCOUNT_BUFF_ID and EXIST_YN = true;
        
        # 최대 레벨
        select MAX_LEVEL into m_max_level from BT_ACCOUNT_BUFF_BASEs where ACCOUNT_BUFF_ID = p_ACCOUNT_BUFF_ID;       
		
        # 레벨 업 조건
        if (m_curr_level + 1 <= m_max_level) then
			# 재화 차감
			if (p_NEED_GOLD <> 0) then
				update GT_USERs set GOLD = if (GOLD - p_NEED_GOLD < 0, 0, GOLD - p_NEED_GOLD) where UUID = p_UUID;
			end if;
            
			# 소환수 levelup
			update GT_ACCOUNT_BUFFs
            set ACCOUNT_BUFF_LEVEL = ACCOUNT_BUFF_LEVEL + 1	
				, ACCUM_USE_GOLD = ACCUM_USE_GOLD + p_NEED_GOLD, ACCUM_USE_RESOURCE_COUNT = ACCUM_USE_RESOURCE_COUNT + p_COUNT
            where UUID = p_UUID and ACCOUNT_BUFF_ID = p_ACCOUNT_BUFF_ID and EXIST_YN = true;
			
			# 재료 감소
			if (p_ITEM_ID <> 0) then set m_iuid_1 = fn_add_item(p_UUID, p_ITEM_ID, -p_COUNT); end if;
		end if;

        # @결과 반환
        # 골드
        select GOLD from GT_USERs where UUID = p_UUID;
        
        # 계정 버프
        select * from GT_ACCOUNT_BUFFs where UUID = p_UUID and ACCOUNT_BUFF_ID = p_ACCOUNT_BUFF_ID and EXIST_YN = true;
        
        # 재료 아이템
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1);
        
        # 계정 버프 강화 사용 총 골드, 재료 수
		select sum(ACCUM_USE_GOLD) as TOTAL_USE_GOLD, sum(ACCUM_USE_RESOURCE_COUNT) as TOTAL_USE_RESOURCE_COUNT
		from GT_ACCOUNT_BUFFs where UUID = p_UUID and EXIST_YN = true;
        
    end;
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_account_buff_reset` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_account_buff_reset`(
      in p_UUID int
	, in p_NEED_CASH int
    , in p_REFUND_GOLD int
    , in p_REFUND_GOLD_RATE float
    , in p_REFUND_ITEM_ID long
    , in p_REFUND_RESOURCE_COUNT int    
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    begin
		declare m_account_buff_count int default 0;		
		declare m_refund_iuid int default 0;
        declare m_refund_gold int default 0;
        declare m_refund_resource_count int default 0;
        
        # 계정 버프 확인
        select count(*) into m_account_buff_count from GT_ACCOUNT_BUFFs where UUID = p_UUID and EXIST_YN = true;
        if (m_account_buff_count <> 0) then
			# 보상 골드, 재료 수
			select floor(sum(ACCUM_USE_GOLD) * p_REFUND_GOLD_RATE), sum(ACCUM_USE_RESOURCE_COUNT) into m_refund_gold, m_refund_resource_count
            from GT_ACCOUNT_BUFFs where UUID = p_UUID and EXIST_YN = true;
			
            # 골드 증가
			update GT_USERs
				set CASH = if (CASH - p_NEED_CASH < 0, 0, CASH - p_NEED_CASH)
				, GOLD = GOLD + m_refund_gold
            where UUID = p_UUID;            
			
			# 재화 감소, 재료 증가
			if (p_REFUND_ITEM_ID <> 0) then
				set m_refund_iuid = fn_add_item(p_UUID, p_REFUND_ITEM_ID, m_refund_resource_count);
			end if;
            
            # 계정 버프 Reset
            update GT_ACCOUNT_BUFFs set EXIST_YN = false
            where UUID = p_UUID and EXIST_YN = true;
		end if;
		
        # @결과 반환
        # 골드, 캐쉬
        select GOLD, CASH from GT_USERs where UUID = p_UUID;
        
        # 계정 버프
        select m_refund_gold as REFUND_GOLD, m_refund_resource_count as REFUND_RESOURCE_COUNT;
        
        # 재료 아이템
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_refund_iuid);
        
    end;
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_buy_stamina` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_buy_stamina`(
	in p_UUID int
    , in p_STAMINA int
    , in p_LAST_STAMINA_CHANGE_DATE datetime
    , in p_CASH int
    , in p_BUY_STAMINA_COUNT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 1. 유저 테이블에 골드, 캐쉬 update
    begin
		update GT_USERs set STAMINA = p_STAMINA, LAST_STAMINA_CHANGE_DATE = p_LAST_STAMINA_CHANGE_DATE, CASH = p_CASH where UUID = p_UUID;
    end;
    
    # 2. VIP 테이블 buy_gold_count update
    begin
		update GT_VIPs set BUY_STAMINA_COUNT = p_BUY_STAMINA_COUNT where UUID = p_UUID;
    end;
    
    # 3. 필요 정보 반환
    select u.STAMINA, u.CASH, u.LAST_STAMINA_CHANGE_DATE, v.BUY_STAMINA_COUNT
    from GT_USERs u
    left join GT_VIPs v on u.UUID = v.UUID
    where u.UUID = p_UUID;
	
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_hero_equip_rune_levelup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_hero_equip_rune_levelup`(
	in p_UUID BIGINT
    , in p_HERO_ID int
    , in p_RUNE_SLOT_ID int
    , in p_TARGET_LEVEL int
    , in p_NEED_GOLD int
    , in p_ITEM_ID_1 int, in p_ITEM_COUNT_1 int
    , in p_ITEM_ID_2 int, in p_ITEM_COUNT_2 int
    , in p_ITEM_ID_3 int, in p_ITEM_COUNT_3 int
    , in p_ITEM_ID_4 int, in p_ITEM_COUNT_4 int
    , in p_ITEM_ID_5 int, in p_ITEM_COUNT_5 int
    , in p_ITEM_ID_6 int, in p_ITEM_COUNT_6 int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
        declare m_iuid_1 int default 0;
        declare m_iuid_2 int default 0;
        declare m_iuid_3 int default 0;
        declare m_iuid_4 int default 0;
        declare m_iuid_5 int default 0;
        declare m_iuid_6 int default 0;
        
        if (p_HERO_ID <> 0 and p_RUNE_SLOT_ID <> 0 and p_TARGET_LEVEL <> 0) then
			# 재화 차감
			if (p_NEED_GOLD <> 0) then
				update GT_USERs set GOLD = if (GOLD - p_NEED_GOLD < 0, 0, GOLD - p_NEED_GOLD) where UUID = p_UUID;
			end if;
        
			update GT_HERO_RUNE_SLOTs set EQUIP_ITEM_LEVEL = p_TARGET_LEVEL where UUID = p_UUID and RUNE_SLOT_ID = p_RUNE_SLOT_ID;
            
            if (p_ITEM_ID_1 <> 0) then set m_iuid_1 = fn_add_item(p_UUID, p_ITEM_ID_1, -p_ITEM_COUNT_1); end if;
			if (p_ITEM_ID_2 <> 0) then set m_iuid_2 = fn_add_item(p_UUID, p_ITEM_ID_2, -p_ITEM_COUNT_2); end if;
            if (p_ITEM_ID_3 <> 0) then set m_iuid_3 = fn_add_item(p_UUID, p_ITEM_ID_3, -p_ITEM_COUNT_3); end if;
            if (p_ITEM_ID_4 <> 0) then set m_iuid_4 = fn_add_item(p_UUID, p_ITEM_ID_4, -p_ITEM_COUNT_4); end if;
            if (p_ITEM_ID_5 <> 0) then set m_iuid_5 = fn_add_item(p_UUID, p_ITEM_ID_5, -p_ITEM_COUNT_5); end if;
            if (p_ITEM_ID_6 <> 0) then set m_iuid_6 = fn_add_item(p_UUID, p_ITEM_ID_6, -p_ITEM_COUNT_6); end if;
		end if;
    
		# 정보 반환
        select GOLD from GT_USERs where UUID = p_UUID;
        select * from GT_HERO_RUNE_SLOTs where UUID = p_UUID and HERO_ID = p_HERO_ID and RUNE_SLOT_ID = p_RUNE_SLOT_ID;
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1, m_iuid_2, m_iuid_3, m_iuid_4, m_iuid_5, m_iuid_6);
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_hero_rune_equip` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_hero_rune_equip`(
	in p_UUID BIGINT
    , in p_HERO_ID int
    , in p_RUNE_SLOT_ID int
    , in p_RUNE_TYPE int
    , in p_RUNE_ITEM_ID int
    , in p_RUNE_ITEM_LEVEL int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
		declare m_ruid int default 0;
        declare m_rune_count int default -1;
        
        update GT_HERO_RUNE_SLOTs set EQUIP_RUNE_TYPE = p_RUNE_TYPE, EQUIP_ITEM_ID = p_RUNE_ITEM_ID, EQUIP_ITEM_LEVEL = p_RUNE_ITEM_LEVEL
        where UUID = p_UUID and HERO_ID = p_HERO_ID and RUNE_SLOT_ID = p_RUNE_SLOT_ID;
        
        if (p_HERO_ID <> 0 and p_RUNE_SLOT_ID <> 0 and p_RUNE_ITEM_ID <> 0 and p_RUNE_ITEM_LEVEL <> 0) then
			set m_ruid = fn_add_rune(p_UUID, p_RUNE_TYPE, p_RUNE_ITEM_ID, p_RUNE_ITEM_LEVEL, m_rune_count);
		end if;
    
		# 정보 반환
        select * from GT_HERO_RUNE_SLOTs where UUID = p_UUID and HERO_ID = p_HERO_ID and RUNE_SLOT_ID = p_RUNE_SLOT_ID;
        select * from GT_HERO_RUNEs where UUID = p_UUID and RUID = m_ruid;
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_hero_rune_levelup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_hero_rune_levelup`(
	in p_UUID BIGINT
    , in p_RUID int
    , in p_TARGET_LEVEL int
    , in p_NEED_GOLD int
    , in p_ITEM_ID_1 int, in p_ITEM_COUNT_1 int
    , in p_ITEM_ID_2 int, in p_ITEM_COUNT_2 int
    , in p_ITEM_ID_3 int, in p_ITEM_COUNT_3 int
    , in p_ITEM_ID_4 int, in p_ITEM_COUNT_4 int
    , in p_ITEM_ID_5 int, in p_ITEM_COUNT_5 int
    , in p_ITEM_ID_6 int, in p_ITEM_COUNT_6 int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin    
		declare m_rune_type int default 0;
		declare m_rune_item_id int default 0;
        declare m_rune_item_level int default 0;
        
        declare m_rune_add_count int default 1;
        declare m_rune_sub_count int default -1;
        
		declare m_ruid_1 int default 0;
        declare m_ruid_2 int default 0;
        
        declare m_iuid_1 int default 0;
        declare m_iuid_2 int default 0;
        declare m_iuid_3 int default 0;
        declare m_iuid_4 int default 0;
        declare m_iuid_5 int default 0;
        declare m_iuid_6 int default 0;
        
        select RUNE_TYPE, ITEM_ID, ITEM_LEVEL into m_rune_type, m_rune_item_id, m_rune_item_level from GT_HERO_RUNEs where UUID = p_UUID and RUID = p_RUID;
        
        if (m_rune_item_id <> 0 and m_rune_item_level <> 0) then
			# 재화 차감
			if (p_NEED_GOLD <> 0) then
				update GT_USERs set GOLD = if (GOLD - p_NEED_GOLD < 0, 0, GOLD - p_NEED_GOLD) where UUID = p_UUID;
			end if;            
           
			# 룬 설정(중가 하고 빼고)
            set m_ruid_1 = fn_add_rune(p_UUID, m_rune_type, m_rune_item_id, p_TARGET_LEVEL, m_rune_add_count);
            set m_ruid_2 = fn_add_rune(p_UUID, m_rune_type, m_rune_item_id, m_rune_item_level, m_rune_sub_count);
            
            # 재료 아이템 차감
            if (p_ITEM_ID_1 <> 0) then set m_iuid_1 = fn_add_item(p_UUID, p_ITEM_ID_1, -p_ITEM_COUNT_1); end if;
			if (p_ITEM_ID_2 <> 0) then set m_iuid_2 = fn_add_item(p_UUID, p_ITEM_ID_2, -p_ITEM_COUNT_2); end if;
            if (p_ITEM_ID_3 <> 0) then set m_iuid_3 = fn_add_item(p_UUID, p_ITEM_ID_3, -p_ITEM_COUNT_3); end if;
            if (p_ITEM_ID_4 <> 0) then set m_iuid_4 = fn_add_item(p_UUID, p_ITEM_ID_4, -p_ITEM_COUNT_4); end if;
            if (p_ITEM_ID_5 <> 0) then set m_iuid_5 = fn_add_item(p_UUID, p_ITEM_ID_5, -p_ITEM_COUNT_5); end if;
            if (p_ITEM_ID_6 <> 0) then set m_iuid_6 = fn_add_item(p_UUID, p_ITEM_ID_6, -p_ITEM_COUNT_6); end if;
		end if;
    
		# 정보 반환
        select GOLD from GT_USERs where UUID = p_UUID;
        select * from GT_HERO_RUNEs where UUID = p_UUID and RUID in (m_ruid_1, m_ruid_2);
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1, m_iuid_2, m_iuid_3, m_iuid_4, m_iuid_5, m_iuid_6);
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_hero_rune_sell` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_hero_rune_sell`(
	in p_UUID int
    , in p_RUID int
    , in p_GOLD int
    , in p_SELL_COUNT int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 1. 유저 테이블 update
    begin
		update GT_USERs set GOLD = GOLD + (p_GOLD * p_SELL_COUNT) where UUID = p_UUID;
    end;
    
    # 2. 아이템 처리
    begin
		declare m_item_count int;
        
        # 아이템 감소
        select ITEM_COUNT - p_SELL_COUNT into m_item_count from GT_HERO_RUNEs where UUID = p_UUID and RUID = p_RUID;
        
        # TODO : 예외 처리 - m_item_count 가 0 보다 작을 경우 필요 방법 찾자
		if (m_item_count <= 0) then
			update GT_HERO_RUNEs set ITEM_COUNT = 0, EXIST_YN = 0 where UUID = p_UUID and RUID = p_RUID;
		else
			update GT_HERO_RUNEs set ITEM_COUNT = m_item_count where UUID = p_UUID and RUID = p_RUID and EXIST_YN = 1;
		end if;
    end;
    
    # 3. 필요 정보 반환
    select * from GT_HERO_RUNEs where UUID = p_UUID and RUID = p_RUID;
    
    # 유저 재화
    select GOLD from GT_USERs where UUID = p_UUID;
	
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_hero_rune_unequip` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_hero_rune_unequip`(
	in p_UUID BIGINT
    , in p_HERO_ID int
    , in p_RUNE_SLOT_ID int
    , in p_EQUIP_RUNE_TYPE int
    , in p_EQUIP_RUNE_ITEM_ID int
    , in p_EQUIP_RUNE_ITEM_LEVEL int
    , in p_GOLD int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
	
	begin
		declare m_ruid int default 0;
        declare m_rune_count int default 1;
        
        update GT_USERs set GOLD = GOLD - p_GOLD where UUID = p_UUID;
        
        update GT_HERO_RUNE_SLOTs set EQUIP_RUNE_TYPE = 0, EQUIP_ITEM_ID = 0, EQUIP_ITEM_LEVEL = 0
        where UUID = p_UUID and HERO_ID = p_HERO_ID and RUNE_SLOT_ID = p_RUNE_SLOT_ID;
        
        if (p_EQUIP_RUNE_TYPE <> 0 and p_EQUIP_RUNE_ITEM_ID <> 0 and p_EQUIP_RUNE_ITEM_LEVEL <> 0) then
			set m_ruid = fn_add_rune(p_UUID, p_EQUIP_RUNE_TYPE, p_EQUIP_RUNE_ITEM_ID, p_EQUIP_RUNE_ITEM_LEVEL, m_rune_count);
		end if;
    
		# 정보 반환
        select * from GT_HERO_RUNE_SLOTs where UUID = p_UUID and HERO_ID = p_HERO_ID and RUNE_SLOT_ID = p_RUNE_SLOT_ID;
        select * from GT_HERO_RUNEs where UUID = p_UUID and RUID = m_ruid;        
        select GOLD from GT_USERs where UUID = p_UUID;
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_hero_skill_levelup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_hero_skill_levelup`(
	in p_UUID int
    , in p_HERO_ID int
    , in p_GOLD int
    , in p_SKILL_ID int
    , in p_SKILL_LEVEL int
    , in p_SKILL_POINT int
    , in p_LAST_SKILL_POINT_CHANGE_DATE DATETIME
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 영웅 스킬 레벨
    update GT_HERO_SKILLs set SKILL_LEVEL = p_SKILL_LEVEL where UUID = p_UUID and HERO_ID = p_HERO_ID and SKILL_ID = p_SKILL_ID;
	
    # 유저 정보
    update GT_USERs set GOLD = p_GOLD, SKILL_POINT = p_SKILL_POINT, LAST_SKILL_POINT_CHANGE_DATE = p_LAST_SKILL_POINT_CHANGE_DATE where UUID = p_UUID;
    
    # 결과
    select 
		s.SKILL_ID, s.SKILL_LEVEL, u.GOLD, u.SKILL_POINT, u.LAST_SKILL_POINT_CHANGE_DATE
    from GT_HERO_SKILLs s
    left join GT_USERs u on u.UUID = s.UUID
    where s.UUID = p_UUID and HERO_ID = p_HERO_ID and SKILL_ID = p_SKILL_ID;
    
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_mail_info` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_mail_info`(
	in p_UUID int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 1. Mail EXIST_YN 설정. now()와 MAIL_READ_DATE 비교일이 1일 이상 TEXT는 MAIL_READ_DATE, ITEM은 MAIL_READ_YN 값으로 설정
    begin
		update GT_MAILs 
		set EXIST_YN = if (MAIL_TYPE = 'TEXT'
							, if(datediff(now(), MAIL_READ_DATE) >= 1, false, true)
							, if (MAIL_READ_YN = true and datediff(now(), MAIL_READ_DATE) >= 1, false, true));
                            
		select * from GT_MAILs where UUID = p_UUID and EXIST_YN = true;
    end;
	
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_mail_read` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_mail_read`(
	in p_UUID int
    , in p_MAIL_ID int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;
    
    # 1. Mail read_yn, read_date update
    begin
		# 보상이 있는 우편은 보상을 받아야 MAIL_READ_YN = true 를 한다.
		update GT_MAILs
			set MAIL_READ_YN = if(MAIL_TYPE = 'TEXT', true, false), MAIL_READ_DATE = now()
        where UUID = p_UUID and MAIL_ID = p_MAIL_ID and isnull(MAIL_READ_DATE);
    end;
        
    # 2. 우편 정보 반환
    select * from GT_MAILs where UUID = p_UUID and MAIL_ID = p_MAIL_ID;
	
	commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_summon_gage` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_summon_gage`(
	  in p_UUID bigint
      , in p_SUMMON_GAGE int
      , in p_MAX_SUMMON_GAGE int
      , in p_BATTLE_CLEAR boolean
      , in p_USE_SUMMON boolean
    )
BEGIN
    # 1. 배틀 성공 : 소환수 사용(25), 소환수 미사용(+25)
	# 2. 배틀 실패 : 소환수 사용(0), 소환수 미사용(아무것도 하지 않음)
	
    if (p_BATTLE_CLEAR = true) then
		if (p_USE_SUMMON = true) then
			update GT_USERs set SUMMON_GAGE = p_SUMMON_GAGE where UUID = p_UUID;
		else
			update GT_USERs set SUMMON_GAGE = if (SUMMON_GAGE + p_SUMMON_GAGE > p_MAX_SUMMON_GAGE, p_MAX_SUMMON_GAGE, SUMMON_GAGE + p_SUMMON_GAGE) where UUID = p_UUID;
        end if;        
    else
		if (p_USE_SUMMON = true) then
			update GT_USERs set SUMMON_GAGE = 0 where UUID = p_UUID;
		end if;
    end if;
    
    # 결과 값 반환
    select SUMMON_GAGE from GT_USERs where UUID = p_UUID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_summon_levelup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_summon_levelup`(
      in p_UUID int
    , in p_SUMMON_ID int
    , in p_NEED_GOLD int
    , in p_ITEM_ID_1 int, in p_COUNT_1 int
    , in p_ITEM_ID_2 int, in p_COUNT_2 int
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    begin
		declare m_summon_count int default 0;
		declare m_curr_level int default 0;
        declare m_max_level int default 0;
        
		declare m_iuid_1 int default 0;
        declare m_iuid_2 int default 0;
        
        # 소환수 확인
        select count(*) into m_summon_count from GT_SUMMONs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID;
        if (m_summon_count = 0) then
			insert into GT_SUMMONs (UUID, SUMMON_ID) values (p_UUID, p_SUMMON_ID);
        end if;
        
        # 현재 레벨
        select SUMMON_LEVEL into m_curr_level from GT_SUMMONs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID;
        
        # 최대 레벨
        select TARGET_LEVEL into m_max_level from BT_SUMMON_LEVELUPs where SUMMON_ID = p_SUMMON_ID order by TARGET_LEVEL desc limit 1;
        
        # 최대 레벨 미만 일때 적용
        if (m_curr_level + 1 <= m_max_level) then
			# 골드 감소
			if (p_NEED_GOLD <> 0) then
				update GT_USERs set GOLD = if (GOLD - p_NEED_GOLD < 0, 0, GOLD - p_NEED_GOLD) where UUID = p_UUID;
			end if;
		   
			# 소환수 levelup
			update GT_SUMMONs set SUMMON_LEVEL = SUMMON_LEVEL + 1 where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID;
			
			# 재료 감소
			if (p_ITEM_ID_1 <> 0) then set m_iuid_1 = fn_add_item(p_UUID, p_ITEM_ID_1, -p_COUNT_1); end if;
			if (p_ITEM_ID_2 <> 0) then set m_iuid_2 = fn_add_item(p_UUID, p_ITEM_ID_2, -p_COUNT_2); end if;
        end if;

        # 결과 반환
        select GOLD from GT_USERs where UUID = p_UUID;
        select * from GT_SUMMONs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID;
        select * from GT_INVENTORies where UUID = p_UUID and IUID in (m_iuid_1, m_iuid_2);
    end;
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_summon_levelup_cash` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_summon_levelup_cash`(
      in p_UUID int
    , in p_SUMMON_ID int
    , in p_NEED_CASH int    
)
BEGIN
	# exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;    
    begin
		# 재화 차감
        if (p_NEED_CASH <> 0) then
			update GT_USERs set CASH = if (CASH - p_NEED_CASH < 0, 0, CASH - p_NEED_CASH) where UUID = p_UUID;
		end if;
       
        # 소환수 levelup
		update GT_SUMMONs set SUMMON_LEVEL = SUMMON_LEVEL + 1 where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID;

        # 결과 반환
        select CASH from GT_USERs where UUID = p_UUID;
        select * from GT_SUMMONs where UUID = p_UUID and SUMMON_ID = p_SUMMON_ID;
    end;
    commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_summon_trait_levelup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_summon_trait_levelup`(
	in p_UUID bigint
    , in p_TRAIT_SKILL_ID int
    , in p_TRAIT_EXP_ID int
    , in P_ADD_EXP int
    , in p_NEED_GOLD int
    , in p_ITEM_ID_1 bigint, in p_COUNT_1 int
    , in p_ITEM_ID_2 bigint, in p_COUNT_2 int
    , in p_ITEM_ID_3 bigint, in p_COUNT_3 int
    , in p_ITEM_ID_4 bigint, in p_COUNT_4 int
    , in p_ITEM_ID_5 bigint, in p_COUNT_5 int
    , in p_ITEM_ID_6 bigint, in p_COUNT_6 int
    , in p_ITEM_ID_7 bigint, in p_COUNT_7 int
    , in p_ITEM_ID_8 bigint, in p_COUNT_8 int
    , in p_ITEM_ID_9 bigint, in p_COUNT_9 int
    , in p_ITEM_ID_10 bigint, in p_COUNT_10 int
)
BEGIN
	# authors : jongwook
    # exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;

	# 소환수 특성 경험치 증가 및 레벨업.
	begin
		declare m_sum_exp int default 0;
        declare m_current_step int default 0;
        declare m_current_exp int default 0;
        declare m_target_level int default 0;
        
		declare m_iuid_1 bigint default 0;	declare m_iuid_2 bigint default 0;
		declare m_iuid_3 bigint default 0;	declare m_iuid_4 bigint default 0;
		declare m_iuid_5 bigint default 0;	declare m_iuid_6 bigint default 0;
		declare m_iuid_7 bigint default 0;	declare m_iuid_8 bigint default 0;
		declare m_iuid_9 bigint default 0;	declare m_iuid_10 bigint default 0;
        
        declare m_calc_count int default 0;
        declare m_current_item_count int default 0;
        
        # 재화 차감
        if (p_NEED_GOLD <> 0) then
			update GT_USERs set GOLD = if (GOLD - p_NEED_GOLD < 0, 0, GOLD - p_NEED_GOLD) where UUID = p_UUID;
		end if;

        # 소환수 특성 업
		select TRAIT_LEVEL, TRAIT_EXP into m_current_step, m_current_exp from GT_SUMMON_TRAITs
        where UUID = p_UUID and TRAIT_SKILL_ID = p_TRAIT_SKILL_ID limit 1;
        
        set m_sum_exp = m_current_exp + p_ADD_EXP;        
      
        select TRAIT_STEP into m_target_level from BT_SUMMON_TRAIT_EXPs 
        where TRAIT_EXP_ID = p_TRAIT_EXP_ID and TOTAL_EXP < m_sum_exp
		order by TRAIT_STEP desc limit 1;
		
        # level 설정
		update GT_SUMMON_TRAITs set TRAIT_EXP = m_sum_exp, TRAIT_LEVEL = m_target_level
		where UUID = p_UUID and TRAIT_SKILL_ID = p_TRAIT_SKILL_ID;
		            
		# 사용 아이템 차감        
		if (p_ITEM_ID_1 <> 0) then set m_iuid_1 = fn_add_item(p_UUID, p_ITEM_ID_1, -p_COUNT_1); end if;
		if (p_ITEM_ID_2 <> 0) then set m_iuid_2 = fn_add_item(p_UUID, p_ITEM_ID_2, -p_COUNT_2); end if;
		if (p_ITEM_ID_3 <> 0) then set m_iuid_3 = fn_add_item(p_UUID, p_ITEM_ID_3, -p_COUNT_3); end if;
		if (p_ITEM_ID_4 <> 0) then set m_iuid_4 = fn_add_item(p_UUID, p_ITEM_ID_4, -p_COUNT_4); end if;
		if (p_ITEM_ID_5 <> 0) then set m_iuid_5 = fn_add_item(p_UUID, p_ITEM_ID_5, -p_COUNT_5); end if;
		if (p_ITEM_ID_6 <> 0) then set m_iuid_6 = fn_add_item(p_UUID, p_ITEM_ID_6, -p_COUNT_6); end if;
		if (p_ITEM_ID_7 <> 0) then set m_iuid_7 = fn_add_item(p_UUID, p_ITEM_ID_7, -p_COUNT_7); end if;
		if (p_ITEM_ID_8 <> 0) then set m_iuid_8 = fn_add_item(p_UUID, p_ITEM_ID_8, -p_COUNT_8); end if;
		if (p_ITEM_ID_9 <> 0) then set m_iuid_9 = fn_add_item(p_UUID, p_ITEM_ID_9, -p_COUNT_9); end if;
		if (p_ITEM_ID_10 <> 0) then set m_iuid_10 = fn_add_item(p_UUID, p_ITEM_ID_10, -p_COUNT_10); end if;
        
		# 결과 반환
        select GOLD from GT_USERs where UUID = p_UUID;
		select * from GT_SUMMON_TRAITs where UUID = p_UUID and TRAIT_SKILL_ID = p_TRAIT_SKILL_ID;
        select * from GT_INVENTORies where IUID in (m_iuid_1, m_iuid_2, m_iuid_3, m_iuid_4, m_iuid_5, m_iuid_6, m_iuid_7, m_iuid_8, m_iuid_9, m_iuid_10);
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_summon_trait_levelup_cash` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_summon_trait_levelup_cash`(
	in p_UUID bigint
    , in p_TRAIT_SKILL_ID int
    , in p_TRAIT_EXP_ID int
    , in P_ADD_EXP int
    , in p_NEED_CASH int
)
BEGIN
	# authors : jongwook
    # exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;

	# 소환수 특성 경험치 증가 및 레벨업.
	begin
		declare m_sum_exp int default 0;
        declare m_current_step int default 0;
        declare m_current_exp int default 0;
        declare m_target_level int default 0;
        declare m_curr_cash int default 0;
        
        declare m_calc_count int default 0;
        declare m_current_item_count int default 0;
        
        select CASH into m_curr_cash from GT_USERs where UUID = p_UUID;
        
        if (m_curr_cash >= p_NEED_CASH) then        
			# 재화 차감
			if (p_NEED_CASH > 0) then
				update GT_USERs set CASH = if (CASH - p_NEED_CASH < 0, 0, CASH - p_NEED_CASH) where UUID = p_UUID;
			end if;

			# 소환수 특성 정보
			select TRAIT_LEVEL, TRAIT_EXP into m_current_step, m_current_exp from GT_SUMMON_TRAITs
			where UUID = p_UUID and TRAIT_SKILL_ID = p_TRAIT_SKILL_ID limit 1;
			
			set m_sum_exp = m_current_exp + p_ADD_EXP;        
		  
			select TRAIT_STEP into m_target_level from BT_SUMMON_TRAIT_EXPs 
			where TRAIT_EXP_ID = p_TRAIT_EXP_ID and TOTAL_EXP <= m_sum_exp
			order by TRAIT_STEP desc limit 1;
			
			# level 설정
			update GT_SUMMON_TRAITs set TRAIT_EXP = m_sum_exp, TRAIT_LEVEL = m_target_level
			where UUID = p_UUID and TRAIT_SKILL_ID = p_TRAIT_SKILL_ID;
		end if;
        
		# 결과 반환
        select CASH from GT_USERs where UUID = p_UUID;
		select * from GT_SUMMON_TRAITs where UUID = p_UUID and TRAIT_SKILL_ID = p_TRAIT_SKILL_ID;
    end;
    
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_summon_use` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_summon_use`(
	in p_UUID bigint
    , in p_OLD_SUMMON_ID int
    , in P_NEW_SUMMON_ID int
)
BEGIN
	# authors : jongwook
    # exception handler 
    declare exit handler for SQLEXCEPTION
	begin
		rollback;
        -- select Errors;
        show Errors;
	end;
    
    start transaction;

	# 소환수 특성 경험치 증가 및 레벨업.
	begin
		if (p_OLD_SUMMON_ID <> 0) then
			update GT_SUMMONs set USE_YN = false where SUMMON_ID = p_OLD_SUMMON_ID and USE_YN = true;
		end if;
            
		if (p_NEW_SUMMON_ID <> 0) then
			update GT_SUMMONs set USE_YN = true where SUMMON_ID = p_NEW_SUMMON_ID;
		end if;
        
		# 반환 값
        select * from GT_SUMMONs where USE_YN = true;
	end;
commit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-10 15:22:35
