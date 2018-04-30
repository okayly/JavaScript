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
			declare m_i int default 1;

			declare hero_cur cursor for select hero_id from input_heros;
			declare continue handler for sqlstate '02000' set hero_cur_state = 1;
			
			open hero_cur;
				repeat
					fetch hero_cur into m_hero_id;
					if not hero_cur_state then
						set m_i = 1;
						
						# 1. 영웅 아이템 지급.
						select SKILL_ID1, SKILL_ID2, SKILL_ID3,
                               CARD_ACTIVE_SKILL_ID, CARD_PASSIVE_ID1, CARD_PASSIVE_ID2, CARD_PASSIVE_ID3, CARD_PASSIVE_ID4, CARD_PASSIVE_ID5,
                               PASSIVE_ID1, PASSIVE_ID2, PASSIVE_ID3, PASSIVE_ID4, PASSIVE_ID5, PASSIVE_ID6, PASSIVE_ID7, PASSIVE_ID8,
							   EVOLUTION_STEP
						into m_skill_1, m_skill_2, m_skill_3, m_skill_4, m_skill_5, m_skill_6, m_skill_7, m_skill_8, m_skill_9, m_skill_10, m_skill_11, m_skill_12, m_skill_13, m_skill_14, m_skill_15, m_skill_16, m_skill_17,
							 m_evolution_step
						from BT_HERO_BASEs where HERO_ID = m_hero_id;

						# 2. 영웅 삽입.
						insert into GT_HEROes (UUID, HERO_ID, EVOLUTION_STEP) values (p_UUID, m_hero_id, m_evolution_step);
						
						# 3. 영웅의 스킬 지급.
						if (m_skill_1 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_1); end if;
					    if (m_skill_2 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_2); end if;
					    if (m_skill_3 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_3); end if;
					    if (m_skill_4 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_4); end if;
					    if (m_skill_5 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_5); end if;
					    if (m_skill_6 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_6); end if;
					    if (m_skill_7 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_7); end if;
					    if (m_skill_8 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_8); end if;
					    if (m_skill_9 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_9); end if;
					    if (m_skill_10 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_10); end if;
					    if (m_skill_11 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_11); end if;
					    if (m_skill_12 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_12); end if;
					    if (m_skill_13 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_13); end if;
					    if (m_skill_14 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_14); end if;
					    if (m_skill_15 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_15); end if;
					    if (m_skill_16 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_16); end if;
					    if (m_skill_17 <> 0) then insert into GT_HERO_SKILLs (UUID, HERO_ID, SKILL_ID) values (m_uuid, m_hero_id, m_skill_17); end if;
							
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
END