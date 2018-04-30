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
       
        declare m_skill_1 	int default 0;        declare m_skill_2 	int default 0;
        declare m_skill_3 	int default 0;        declare m_skill_4 	int default 0;
        declare m_skill_5 	int default 0;        declare m_skill_6 	int default 0;
        declare m_skill_7 	int default 0;        declare m_skill_8 	int default 0;
        declare m_skill_9 	int default 0;        declare m_skill_10 	int default 0;
        declare m_skill_11 	int default 0;        declare m_skill_12 	int default 0;
        declare m_skill_13 	int default 0;        declare m_skill_14 	int default 0;
        declare m_skill_15 	int default 0;        declare m_skill_16 	int default 0;
        declare m_skill_17 	int default 0;
        
        declare m_evolution_step int default 0;
       
        declare hero_cur cursor for select A.HERO_ID,
											B.EVOLUTION_STEP,
											B.SKILL_ID1, B.SKILL_ID2, B.SKILL_ID3,
                                            B.CARD_ACTIVE_SKILL_ID, B.CARD_PASSIVE_ID1, B.CARD_PASSIVE_ID2, B.CARD_PASSIVE_ID3, B.CARD_PASSIVE_ID4, B.CARD_PASSIVE_ID5,
                                            B.PASSIVE_ID1, B.PASSIVE_ID2, B.PASSIVE_ID3, B.PASSIVE_ID4, B.PASSIVE_ID5, B.PASSIVE_ID6, B.PASSIVE_ID7, B.PASSIVE_ID8
									from BT_START_HEROes A
									join BT_HERO_BASEs B on A.HERO_ID = B.HERO_ID and A.HERO_ID <> 0;
		declare continue handler for sqlstate '02000' set hero_cur_state = 1;
		
		open hero_cur;
			repeat
				fetch hero_cur into m_hero, m_evolution_step, m_skill_1, m_skill_2, m_skill_3, m_skill_4, m_skill_5, m_skill_6, m_skill_7, m_skill_8, m_skill_9, m_skill_10, m_skill_11, m_skill_12, m_skill_13, m_skill_14, m_skill_15, m_skill_16, m_skill_17;
				if not hero_cur_state then
					insert into GT_HEROes (UUID, HERO_ID, EVOLUTION_STEP) values (m_uuid, m_hero, m_evolution_step);
					
                    # 영웅의 진화(별) 단계에 따른 스킬 지급.
                    if (m_skill_1 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_1); end if;
					if (m_skill_2 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_2); end if;
					if (m_skill_3 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_3); end if;
					if (m_skill_4 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_4); end if;
					if (m_skill_5 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_5); end if;
					if (m_skill_6 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_6); end if;
					if (m_skill_7 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_7); end if;
					if (m_skill_8 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_8); end if;
					if (m_skill_9 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_9); end if;
					if (m_skill_10 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_10); end if;
					if (m_skill_11 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_11); end if;
					if (m_skill_12 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_12); end if;
					if (m_skill_13 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_13); end if;
					if (m_skill_14 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_14); end if;
					if (m_skill_15 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_15); end if;
					if (m_skill_16 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_16); end if;
					if (m_skill_17 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero, m_skill_17); end if;
				end if;
			until hero_cur_state end repeat;
		close hero_cur;
	end;

	# 3. 팀 정보 입력.
    begin
		# 팀은 한개
		insert into GT_TEAMs (UUID, TEAM_ID) values (m_uuid, 1);        
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
					if ( m_slot_id = 1 ) then update GT_TEAMs set SLOT1 = m_hero_id where UUID = m_uuid and TEAM_ID = 1;
                    elseif ( m_slot_id = 2 ) then update GT_TEAMs set SLOT2 = m_hero_id where UUID = m_uuid and TEAM_ID = 1;
                    elseif ( m_slot_id = 3 ) then update GT_TEAMs set SLOT3 = m_hero_id where UUID = m_uuid and TEAM_ID = 1;
                    elseif ( m_slot_id = 4 ) then update GT_TEAMs set SLOT4 = m_hero_id where UUID = m_uuid and TEAM_ID = 1;
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
END