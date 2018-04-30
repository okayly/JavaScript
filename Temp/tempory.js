	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGachaRe = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {		
		logger.debug('UUID : %d, recv - ReqGacha -', p_user.uuid, p_recv);

		var recv_gacha_id = parseInt(p_recv.gacha_id);

		var hero_evolution_for_mission = new HashMap();
		var hero_promotion_for_mission = new HashMap();

		// 1. 가챠 확인. 
		var base_gacha = BaseMgr.inst.GetBaseGacha(recv_gacha_id);
		if ( base_gacha ==undefined ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Gacha Info In Base');
			return;
		}

		// vip 확인. 
		if ( base_gacha.vip_gacha == true) {
			var base_vip = BaseMgr.inst.GetVip(p_user.GetVip().GetStep());
			if (base_vip == undefined) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Vip Info In Base', 'Current', p_user.GetVip().GetStep());
				return;
			}

			if ( base_vip.vip_gacha == false ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughVipStep());
				return;		
			}
		}

		var daily_gacha_count = 0;
		var total_gacha_count  = 0;
		var last_gacha_date;
		var user_gacha = p_user.GetGacha().GetInfo(recv_gacha_id);
		if ( user_gacha != undefined ) {
			daily_gacha_count 	= user_gacha.daily_gacha_count;
			last_gacha_date 	= user_gacha.last_gacha_date;
			total_gacha_count 	= user_gacha.total_gacha_count;
		}
	 	else {
	 		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Gacha Info In User');
	 		return;
	 	}

		// 2. 재화 확인. 
		var free_pass 	= false;
		var calc_free_count 	= 0;
		var delta_time 	= 0;
		if ( base_gacha.daily_free_exec_count != 0 ) { // 무료 확인. 
			calc_free_count = base_gacha.daily_free_exec_count - daily_gacha_count;
			if ( calc_free_count > 0 ) {
				delta_time = Timer.inst.GetDeltaTime(last_gacha_date);
				if ( delta_time >= base_gacha.free_exec_delay_time_for_sec || calc_free_count == base_gacha.daily_free_exec_count) {
					free_pass = true;
					delta_time = 0;
					console.log('무료 뽑기 수행 중.');
				}
			}
			else {
				calc_free_count = 0;
			}
		}

		if ( free_pass == false ) {
			if ( base_gacha.price_type == 1) { // gold
				if ( base_gacha.price > p_user.GetGold() )
				{	// 골드 부족. 
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'Need', base_gacha.price, 'Current', p_user.GetGold());
					return;
				}
			}
			else { // cash
				if ( base_gacha.price > p_user.GetCash() )
				{	// 캐쉬 부족. 
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Need', base_gacha.price, 'Current', p_user.GetCash());
					return;
				}
			}
		}

		// 3. 가챠 만들기 
		var gacha_info = GachaMgr.inst.GachaReward(base_gacha, total_gacha_count, free_pass);
		if ( gacha_info == undefined ) {
			// 가챠 실패. 
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Make Gacha', 'GachaID', recv_gacha_id);
			return;
		}

		var result_item_list = new HashMap();
		var result_hero_list = new HashMap();
		// db용 결과 만들기(영웅) 
		gacha_info.GetAllHero().forEach(function(h_value, h_key) { // key : index, value : item (소환권.)
			// 영웅이 같은게 있는지 검사 있다면 영혼석 변환 후 아이템 리스트로 담는다. 
			var base_item = BaseMgr.inst.GetItem(h_value.item_id);
			if (base_item != undefined ) {
				if ( result_hero_list.has(base_item.hero_id) == true || p_user.IsHaveByHero(base_item.hero_id) == true )  {
					var base_hero = BaseMgr.inst.GetBaseHero(base_item.hero_id);
					if ( base_hero != undefined ) {
						var base_hero_evolution = BaseMgr.inst.GetEvolution(base_hero.evolution_step);
						if ( base_hero_evolution != undefined ) {
							var exchange_count = base_hero_evolution.hero_stone_exchange;	// 영혼 석으로 변환. 
							if ( result_item_list.has(base_hero.stone_id) == true ) {
								var temp_count = result_item_list.get(base_hero.stone_id);
								var ret_count    = temp_count + exchange_count;
								result_item_list.set(base_hero.stone_id, ret_count);
							}
							else {
								result_item_list.set(base_hero.stone_id, exchange_count);
							}
						}	
					}
				}
				else {
					result_hero_list.set(base_item.hero_id, 1);
				}

				p_ack_packet.gacha_view_info.hero_list.push(base_item.hero_id);
			}
		})

		// db용 결과 만들기 (아이템)
		gacha_info.GetAllItem().forEach(function(i_value, i_key) { // key : index, value : item;
			if ( result_item_list.has(i_value.item_id) == true ) {
				var temp_item_count = result_item_list.get(i_value.item_id);
				var ret_item_count = temp_item_count + i_value.item_count;
				result_item_list.set(i_value.item_id, ret_item_count);
			}
			else {
				result_item_list.set(i_value.item_id, i_value.item_count);
			}

			var temp_item = new PacketCommonData.RewardItem();
			temp_item.item_id 	 = i_value.item_id;
			temp_item.item_count = i_value.item_count;
			p_ack_packet.gacha_view_info.item_list.push(temp_item);
		})

		// 확인용. 
		result_item_list.forEach(function(value, key) {
			console.log('확인용 item key : %d, value : %d', key, value);
		})

		result_hero_list.forEach(function(value, key) {
			console.log('확인용 hero key : %d, value : %d', key, value);
		})

		// 쿼리 만들기. 
		var str_query = 'call sp_gacha (' + p_user.uuid + ',' + 
									base_gacha.gacha_id + ',' + 
									free_pass + ',' + 
									gacha_info.need_gold + ',' + 
									gacha_info.need_cash + ',' + 
									base_gacha.exec_count;
		var check_count = 0;
		if ( result_item_list.count() > 0 || result_hero_list.count() > 0 ) {
			result_item_list.forEach(function(di_value, di_key) {	// 아이템 
				str_query = str_query + ',' + di_key + ',' + di_value;
				check_count++;
			})	

			for( var temp_item_count = check_count; temp_item_count < 10; temp_item_count++) {
				str_query = str_query + ',' + 0 + ',' + 0;
			}

			check_count = temp_item_count;
			result_hero_list.forEach(function(dh_value, dh_key) {	// 아이템 
				str_query = str_query + ',' + dh_key;
				check_count++;
			})

			for( var temp_hero_count = check_count; temp_hero_count < 20; temp_hero_count++) {
				str_query = str_query + ',' + 0;
			}

			str_query = str_query + ');';
		}
		
		console.log('sp query is - ' + str_query);

		Sequelize().query(str_query, null, { raw: true, type: 'SELECT' })
		.then(function (ret_gacha) {

		 	console.log(ret_gacha);
			// User
			if (Object.keys(ret_gacha[0]).length > 0) {	
				var ret_gold 	= ret_gacha[0][0].GOLD;
				var ret_cash 	= ret_gacha[0][0].CASH;
				var ret_date 	= ret_gacha[0][0].LAST_GACHA_DATE;

				p_user.UpdateGold(ret_gold);
				p_user.UpdateCash(ret_cash);
				p_user.GetGacha().UpdateInfo(base_gacha.gacha_id, base_gacha.exec_count, ret_date, free_pass);
			}
			
			// item
			if (Object.keys(ret_gacha[1]).length > 0) {

				for ( var item_cnt in ret_gacha[1] ) {
					var result_item 	= new PacketCommonData.Item();
					result_item.iuid 	= ret_gacha[1][item_cnt].iuid;
					result_item.item_id 	= ret_gacha[1][item_cnt].item_id;
					result_item.item_count = ret_gacha[1][item_cnt].item_count;

					p_ack_packet.result_item_info.item_list.push(result_item);
					p_user.GetInven().UpdateItemInfo(result_item.iuid, result_item.item_id, result_item.item_count);
				}
			}

			// hero
			if (Object.keys(ret_gacha[2]).length > 0) {

				for ( var hero_cnt in ret_gacha[2] ) {
					
					var ret_hero_id 	= ret_gacha[2][hero_cnt].hero_id;
					p_ack_packet.result_item_info.hero_list.push(ret_hero_id);

					var hero = new HeroData.Hero();
					var base_hero = BaseMgr.inst.GetBaseHero(ret_hero_id);
					hero.InitHeroInfo(ret_hero_id, 1, 0, base_hero.evolution_step);
					p_user.AddHero(hero);
					(function(hero) {
						// equip info
						GTMgr.inst.GetGTEquipmentItem().findAll({
							where: { UUID: p_user.uuid, HERO_ID : hero.hero_id }
						})
						.then(function (p_ret_equip) {
							for (var equip_cnt in p_ret_equip) {
								// console.log('으으으으응응 장비  ', p_ret_equip);
								var equip_item = new EquipData.EquipItem();
								equip_item.item_id 		= p_ret_equip[equip_cnt].ITEM_ID;
								equip_item.equip_kind 	= p_ret_equip[equip_cnt].EQUIP_KIND;
								equip_item.item_level 	= p_ret_equip[equip_cnt].ITEM_LEVEL;
								equip_item.evolution_step 	= p_ret_equip[equip_cnt].EVOLUTION_STEP;
								equip_item.promotion_step 	= p_ret_equip[equip_cnt].REINFORCE_STEP;

								hero.AddEquipItem(equip_item);	
							}
						})
						.catch(function (p_error) {
							logger.error('ReqGacha error - GetGTEquipmentItem().find', p_error);
						});

						// skill info
						GTMgr.inst.GetGTHeroSkill().findAll({
							where: { UUID: p_user.uuid, HERO_ID : hero.hero_id }
						})
						.then(function (p_ret_skill) {
							// console.log('으으으으응응 스킬 ', p_ret_skill);
							for (var skill_cnt in p_ret_skill) {
								var ret_skill_id     = p_ret_skill[skill_cnt].SKILL_ID;
								var ret_skill_level = p_ret_skill[skill_cnt].SKILL_LEVEL;
								hero.AddSkill(ret_skill_id, ret_skill_level);
							}
						})
						.catch(function (p_error) {
							logger.error('ReqGacha error - GetGTHeroSkill().find', p_error);
						});

						// 미션 
						// var base_hero = BaseMgr.inst.GetBaseHero(ret_hero_id);
						hero_evolution_for_mission.set(base_hero.evolution_step, base_hero.evolution_step);
						hero_promotion_for_mission.set(base_hero.promotion_step, base_hero.promotion_step);
					})(hero);
				}
			}

			p_ack_packet.gacha_info.gacha_id 			= base_gacha.gacha_id;
			p_ack_packet.gacha_info.daily_gacha_count 		= user_gacha.daily_gacha_count;
			p_ack_packet.gacha_info.total_gacha_count 		= user_gacha.total_gacha_count;
			p_ack_packet.gacha_info.free_gacha_remain_time 	= 0;

			if ( base_gacha.daily_free_exec_count != 0 ) {
				var temp_count = base_gacha.daily_free_exec_count - user_gacha.daily_gacha_count;
				if ( temp_count > 0 ) {
					var temp_time = Timer.inst.GetDeltaTime(user_gacha.last_gacha_date);
					if ( temp_time <= base_gacha.free_exec_delay_time_for_sec ) {
						p_ack_packet.gacha_info.free_gacha_remain_time = base_gacha.free_exec_delay_time_for_sec - temp_time;
					}	
				}
			}

			p_ack_packet.result_gold 	= p_user.GetGold();
			p_ack_packet.result_cash 	= p_user.GetCash();
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

			// 미션.
			// for mission
			hero_evolution_for_mission.forEach(function (value, key) {
				MissionMgr.inst.MissionCollectHeroEvolution(p_user, key, false);
			})
			hero_promotion_for_mission.forEach(function (value, key) {
				MissionMgr.inst.MissionCollectHeroPromotion(p_user, key, false);
			})
			MissionMgr.inst.MissionCollectHeroTotal(p_user);

			if ( base_gacha.price_type == 1 ) {
				MissionMgr.inst.MissionGatchaGold(p_user, base_gacha.exec_count)
			}
			else if (base_gacha.price_type == 2 ) {
				MissionMgr.inst.MissionGatchaCash(p_user, base_gacha.exec_count)	
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
		});
	};


	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChapterReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChapterReward -', p_user.uuid, p_recv);

		var recv_chapter_id = parseInt(p_recv.chapter_id);
		var recv_box_id = parseInt(p_recv.reward_box_id);

		var chapter = p_user.GetCastle(recv_chapter_id);
		if ( chapter == undefined ) {
			// 오류 캐슬 없음. 
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail());
			logger.error('UUID : %d, CastleID : %d Not Exist Castle Info In User', p_user.uuid, recv_chapter_id);
			return;
		}

		// TODO : 별 정보를 리워드 박스 안으로 합치자. 
		var  base_chapter = BaseMgr.inst.GetBaseCastle(recv_chapter_id);
		if ( base_chapter != undefined ) {

			var need_star = base_chapter.GetNeedStar(recv_box_id);
			if ( need_star != undefined ) {
				var total_star = chapter.GetTotalStar();
				if ( total_star >= need_star && chapter.take_reward_box_count < recv_box_id ) {

					var reward_box = base_chapter.GetRewardBox(recv_box_id);
					if ( reward_box == undefined ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail());
						logger.error('UUID : %d RewardBox ID : %d Not Exist RewardBox Info In Base', p_user.uuid, recv_box_id);
						return; 
					}

					var str_query = 'call sp_castle_reward (' + p_user.uuid + ',' + 
										recv_chapter_id + ',' + 
										recv_box_id  + ',' + 
										reward_box.cash + ',' + 
										reward_box.gold;

					var reward_item_list = reward_box.GetAllItem();
					if (  reward_item_list != undefined ) {
						var count = 0;
						reward_item_list.forEach(function(value, key) {
							str_query = str_query + ',' + value.item_id + ',' + value.item_count;
							count++;
						});

						for( var temp_count = count; temp_count < 2; temp_count++) {
							str_query = str_query + ',' + 0 + ',' + 0;
						}

						str_query = str_query + ');';
					}

					console.log('sp query is - ' + str_query);

					Sequelize().query(str_query, null, { raw: true, type: 'SELECT' })
					.success(function (ret_reward) {
					 	console.log(ret_reward);

						// User reward
						if (Object.keys(ret_reward[0]).length > 0) {
							var ret_cash = ret_reward[0][0].CASH;
							var ret_gold = ret_reward[0][0].GOLD;

							p_ack_packet.result_gold  = ret_gold;
							p_ack_packet.result_cash = ret_cash;
							p_user.UpdateGold(ret_gold);
							p_user.UpdateCash(ret_cash);
						}
						
						// item reward
						if (Object.keys(ret_reward[1]).length > 0) {

							for ( var item_cnt in ret_reward[1] ) {
								var result_item = new PacketCommonData.Item();
								result_item.iuid = ret_reward[1][item_cnt].iuid;
								result_item.item_id = ret_reward[1][item_cnt].item_id;
								result_item.item_count = ret_reward[1][item_cnt].item_count;

								p_ack_packet.reward_items.push(result_item);
								p_user.GetInven().UpdateItemInfo(result_item.iuid, result_item.item_id, result_item.item_count);
							}
						}
						
						chapter.take_reward_box_count = recv_box_id;
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.error(function (err) {
						console.log('err - ', err);
					});
				}
				else {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughStar());
					logger.error('UUID : %d, Not Enough Star BoxID : %d, NeedStar : %d, CurrentTotalStar : %d',p_user.uuid, recv_box_id, need_star, total_star );
					return; 
				}
			}
			else {
				logger.error('UUID : %d, RewardBox ID : %d, Not Exist RewardBox Info In Base', p_user.uuid, recv_box_id );
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail());
				return; 
			}
		}
		else{
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail());
			logger.error('UUID : %d, Castle ID : %d, Not Exist Castle Info In Base', p_user.uuid, recv_chapter_id );
			return; 
		}
	};


	// GT_CHALLENGE_CHAPTER select
	GTMgr.inst.GetGTChallengeChapter().findAll({
		where : { UUID : p_user.uuid, EXIST_YN : true }
	})
	.then(function (p_ret_chapter) {
		// console.log('p_ret_chapter', p_ret_chapter);
		for (var cnt in p_ret_chapter) {
			var data		= p_ret_chapter[cnt].dataValues;
			var chapter_id	= data.CHALLENGE_CHAPTER_ID;
			var exec_count	= data.DAILY_EXEC_COUNT;

			if (typeof p_user.GetChallenge() !== 'undefined') {
				p_user.GetChallenge().AddChallengeGroup(chapter_id, exec_count);
			}
		}

		// Set Challenge
		ProcessChallenge(p_user, p_ack_cmd, p_ack_packet);
	})
	.catch(function (p_error) {
		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
	});

	var ProcessChallenge = function(p_user, p_ack_cmd, p_ack_packet) {
		// GT_CHALLENGE_STAGE select
		GTMgr.inst.GetGTChallengeStage().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_stage) {
			// console.log('p_ret_stage', p_ret_stage);
			for (var cnt in p_ret_stage) {
				var data		= p_ret_stage[cnt].dataValues;
				var chapter_id	= data.CHALLENGE_CHAPTER_ID;
				var stage_id	= data.CHALLENGE_STAGE_ID;
				var clear_grade	= data.CLEAR_GRADE;

				if (typeof p_user.GetChallenge() !== 'undefined')
					p_user.GetChallenge().AddChallenge(chapter_id, stage_id, clear_grade);
			}

			// Set Packet
			var challenge_chapter_id_list = p_user.GetChallenge().GetAllChallengeGroup();
			if ( challenge_chapter_id_list != undefined ) {

				challenge_chapter_id_list.forEach(function(group_value, group_key) {
					var group_info = new PacketCommonData.DungeonGroupInfo();
					group_info.dungeon_group_id 		= group_value.dungeon_group_id;
					group_info.daily_remain_exec_count 	= group_value.exec_count;
					p_ack_packet.challenge_info.dungeon_group_list.push(group_info);

					var challenge_list = group_value.GetAllDungeon();
					if ( challenge_list != undefined ) {
						challenge_list.forEach(function(value, key) {
							var dungeon_info = new PacketCommonData.DungeonInfo();
							dungeon_info.dungeon_group_id 	= value.dungeon_group_id;
							dungeon_info.dungeon_id 		= value.dungeon_id;
							dungeon_info.clear_grade 		= value.clear_grade;
							p_ack_packet.challenge_info.dungeon_list.push(dungeon_info);
						});

						if (challenge_list.count() == 0)
							p_ack_packet.challenge_info.dungeon_list = null;
					}
				})
			}

			p_ack_packet.week_of_day = Timer.inst.GetNowDayByInt();
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
		});
	}


	var ProcessStage = function(p_user, p_ack_cmd, p_ack_packet) {
		// GT_TOWN select
		GTMgr.inst.GetGTStage().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_stage) {
			// console.log('확인용 - ', p_ret_stage);
			for ( var cnt in p_ret_stage ) {
				var data = p_ret_stage[cnt].dataValues;
				console.log('town data', data);

				// GameData
				var chapter_id = data.CHAPTER_ID;
				var stage = new StageData.Town();				
				stage.stage_id = data.STAGE_ID;
				stage.clear_grade = data.CLEAR_GRADE;

				p_user.AddTown(chapter_id, stage);
			}

			// Set Packet
			p_user.GetAllCastle().forEach(function(chapter_value, key) {
				var chapter = new PacketCommonData.ChapterInfo();
				chapter.chapter_id = chapter_value.chapter_id;
				chapter.take_reward_box_count = chapter_value.take_reward_box_count;
				p_ack_packet.chapter_list.push(chapter);

				chapter_value.GetTownMap().forEach(function(stage_value, key) {
					// console.log('stage', stage_value);
					var stage = new PacketCommonData.StageInfo();
					stage.chapter_id = chapter.chapter_id;
					stage.stage_id = stage_value.stage_id;
					stage.clear_grade = stage_value.clear_grade;

					p_ack_packet.stage_list.push(stage);
				});
			});

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqStage = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqStage - ', p_user.uuid, p_recv);

		// GT_CASTLE select 1. 캐슬 정보 읽고.
		GTMgr.inst.GetGTChapter().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_castle) {
			// console.log('확인용 - ', p_ret_castle);
			for ( var cnt in p_ret_castle ) {
				var data = p_ret_castle[cnt].dataValues;

				// Set Memory
				var castle = new ChapterData.Castle();
				castle.chapter_id = data.CHAPTER_ID;
				castle.take_reward_box_count = data.TAKE_REWARD_BOX_COUNT;
				p_user.AddCastle(castle);
			}

			// 2. 타운 정보 읽고.
			ProcessStage(p_user, p_ack_cmd, p_ack_packet);
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
		});
	};	