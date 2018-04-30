	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDarkDungeonBattleFinishOld = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeonBattleFinish', p_recv);

		var recv_stage_id		= parseInt(p_recv.stage_id);
		var recv_clear_grade	= parseInt(p_recv.clear_grade);
		var recv_hero_id_list	= p_recv.hero_id_list;

		// 챕터, 스테이지 확인
		var base_stage = BaseDarkDungeon.inst.GetDarkDungeonStage(recv_stage_id);
		if ( typeof base_stage === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Stage in Base DarkDungeon Stage', recv_stage_id);
			return;
		}

		var base_chapter = BaseDarkDungeon.inst.GetDarkDungeonChapter(base_stage.chapter_id);
		if ( typeof base_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter in Base DarkDungeon Chapter', recv_chapter_id);
			return;
		}

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// 미션 - 영웅 레벨관련 변수 선언
			var hero_level_map = new HashMap();

			// GT_HERO select
			GTMgr.inst.GetGTHero().findAll({
				where : { UUID : p_user.uuid, HERO_ID : recv_hero_id_list, EXIST_YN : true }
			})
			.then(function (p_ret_hero_list) {
				// 영웅별 레벨 셋팅
				for ( var hero_cnt in p_ret_hero_list ) {
					var hero_data = p_ret_hero_list[hero_cnt].dataValues;

					hero_level_map.set(hero_data.HERO_ID, hero_data.HERO_LEVEL);
				}
				// console.log('hero_level_map', hero_level_map);

				// GT_DARK_DUNGEON
				GTMgr.inst.GetGTDarkDungeon().find({
					where : {
						UUID : p_user.uuid,
						CHAPTER_ID : base_stage.chapter_id,
						CURR_STAGE_ID : recv_stage_id
					}
				})
				.then(function (p_ret_stage) {
					if ( p_ret_stage == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Stage in GT_DARK_DUNGEON stage_id', recv_stage_id);
						return;
					}

					var state = ( recv_clear_grade != 0 ) ? DefineValues.inst.DarkDungoneBattleSuccess : DefineValues.inst.DarkDungoneBattleFailed;

					// GT_DARK_DUNGEON update
					p_ret_stage.updateAttributes({
						STATE : state,
						UPDATE_DATE : Timer.inst.GetNowByStrDate()
					})
					.then(function (p_ret_stage_update) {
						console.log('ReqDarkDungeonBattleFinish - update', p_ret_stage_update.dataValues);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonBattleFinish - 1');
					});

					// 아이템 생성
					var reward_item_list = DarkDungeonMgr.inst.GetRewardStageSubItemList(base_stage.sub_item_drop_group_id);

					// 스태미너 감소
					var now_date = moment();
					var ret_stamina = user_data.STAMINA - base_stage.need_stamina;

					// Max 까지 남은 시간 계산.
					var ret_remain_time = GerStaminaFullRemainTime(now_date, ret_stamina, user_data.MAX_STAMINA, user_data.LAST_STAMINA_CHANGE_DATE);
					var last_stamina_change_date = ( ret_stamina < user_data.MAX_STAMINA ) ? now_date.format('YYYY-MM-DD HH:mm:ss') : null;

					// 보상 쿼리 만들기.
					var str_query = 'call sp_battle_reward (' + p_user.uuid + ', ' + 
											ret_stamina + ', ' + 
											base_stage.reward_gold + ', ' + 
											base_stage.reward_hero_exp + ', ' + 
											base_stage.reward_account_exp;

					// 추가 클리어 보상을 줘야 한다.
					var reward_item_count = 0;
					reward_item_list.forEach(function (value, key) {
						str_query = str_query + ', ' + key + ',' + value;
						reward_item_count++;
					});

					for( var empty_item_count = reward_item_count; empty_item_count < 10; empty_item_count++ ) {
						str_query = str_query + ', ' + 0 + ',' + 0;
					}

					str_query = str_query + ');';

					console.log('sp query is - ' + str_query);

					// call ad-hoc query
					mkDB.inst.GetSequelize().query(str_query,
						null,
						{ raw : true, type : 'SELECT' }
					)
					.then(function (p_ret_reward) {
					 	// console.log('p_ret_reward:', p_ret_reward);
					 	p_ack_packet.chapter_id	= base_stage.chapter_id;
						p_ack_packet.stage_id	= base_stage.stage_id;							
						
						// User reward
						if ( Object.keys(p_ret_reward[0]).length > 0 ) {
							var ret_user_level	= p_ret_reward[0][0].USER_LEVEL;
							var ret_user_exp	= p_ret_reward[0][0].USER_EXP;
							var ret_gold		= p_ret_reward[0][0].GOLD;

							p_ack_packet.result_gold		= ret_gold;
							p_ack_packet.result_user_level	= ret_user_level;
							p_ack_packet.result_user_exp	= ret_user_exp;
							p_ack_packet.account_buff_point = p_ret_reward[0][0].ACCOUNT_BUFF_POINT;

							if ( user_data.LEVEL != ret_user_level ) {
								MissionMgr.inst.MissionAchieveUserLV(p_user, ret_user_level, true);
							}

							p_ack_packet.stamina			= p_ret_reward[0][0].STAMINA;
							p_ack_packet.max_stamina		= p_ret_reward[0][0].MAX_STAMINA;
							p_ack_packet.stamina_remain_time= ret_remain_time;
						}
						
						// hero reward
						if ( Object.keys(p_ret_reward[1]).length > 0 ) {
							var hero_levelup_count = 0;
							var max_hero_level = 0;

							for ( var hero_cnt in p_ret_reward[1] ) {
								var result_hero	= new PacketCommonData.HeroLevelInfo();

								result_hero.hero_id		= p_ret_reward[1][hero_cnt].hero_id;
								result_hero.hero_exp	= p_ret_reward[1][hero_cnt].hero_exp;
								result_hero.hero_level	= p_ret_reward[1][hero_cnt].hero_level;

								p_ack_packet.result_hero_list.push(result_hero);

								// 영웅 레벨 업 카운트
								var old_level = hero_level_map.get(result_hero.hero_id);
								if ( result_hero.hero_level > old_level ) {
									var delta_level = result_hero.hero_level - old_level;
									hero_levelup_count = hero_levelup_count + delta_level;

									if ( result_hero.hero_level > max_hero_level )
										max_hero_level = result_hero.hero_level;
									// console.log('HERO_ID : %d, new_level : %d, delta_level : %d', p_ret_hero.dataValues.HERO_ID, p_ret_hero.dataValues.HERO_LEVEL, delta_level);
								}
							}

							// for mission - AchieveHeroLV, IsLevelUpHero
							if ( max_hero_level != 0 ) {
								MissionMgr.inst.MissionAchieveHeroLV(p_user, max_hero_level);
							}

							if ( hero_levelup_count != 0 ) {
								MissionMgr.inst.MissionIsLevelUpHero(p_user, hero_levelup_count);
							}
						}
						
						// item reward
						if ( Object.keys(p_ret_reward[2]).length > 0 ) {
							for ( var item_cnt in p_ret_reward[2] ) {
								var result_item			= new PacketCommonData.Item();
								result_item.iuid		= p_ret_reward[2][item_cnt].iuid;
								result_item.item_id		= p_ret_reward[2][item_cnt].item_id;
								result_item.item_count	= p_ret_reward[2][item_cnt].item_count;

								p_ack_packet.result_item_list.push(result_item);
							}
						}

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonBattleFinish - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonBattleFinish - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonBattleFinish - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonBattleFinish - 1');
		});
	}


	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBattleFinish = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqBattleFinish -', p_user.uuid, p_recv);

		var recv_clear_grade = parseInt(p_recv.clear_grade);

		var battle_info = BattleMgr.inst.GetBattle(p_user.uuid);
		if ( battle_info == undefined ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Get User Battle Info');
			return;
		}

		// 배틀 실패 - 배틀 정보 삭제
		if ( recv_clear_grade == 0 ) {
			BattleMgr.inst.DelBattle(p_user.uuid);
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			return;
		}

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}

			var user_data = p_ret_user.dataValues;

			// 미션 - 영웅 레벨관련 변수 선언
			var hero_id_array = [];
			var hero_level_map = new HashMap();

			// GT_TEAM select - 영웅 레벨업 미션 때문에 영웅 레벨을 가져 온다.
			GTMgr.inst.GetGTTeam().find({
				where: { UUID : p_user.uuid, TEAM_ID : DefineValues.inst.GameModeNormal, EXIST_YN : true }
			})
			.then(function (p_ret_team) {
				var team_data = p_ret_team.dataValues;

				if ( team_data.SLOT1 != 0 ) hero_id_array.push(team_data.SLOT1);
				if ( team_data.SLOT2 != 0 ) hero_id_array.push(team_data.SLOT2);
				if ( team_data.SLOT3 != 0 ) hero_id_array.push(team_data.SLOT3);
				if ( team_data.SLOT4 != 0 ) hero_id_array.push(team_data.SLOT4);

				// GT_HERO select
				GTMgr.inst.GetGTHero().findAll({
					where : { UUID : p_user.uuid, HERO_ID : hero_id_array, EXIST_YN : true }
				})
				.then(function (p_ret_hero_list) {
					// 영웅별 레벨 셋팅
					for ( var hero_cnt in p_ret_hero_list ) {
						var hero_data = p_ret_hero_list[hero_cnt].dataValues;

						hero_level_map.set(hero_data.HERO_ID, hero_data.HERO_LEVEL);
					}
					// console.log('hero_level_map', hero_level_map);

					// GT_CHAPTER select - 챕터 설정
					GTMgr.inst.GetGTChapter().find({
						where : { UUID : p_user.uuid, CHAPTER_ID : battle_info.chapter_id, EXIST_YN : true }
					})
					.then(function (p_ret_chapter) {
						if ( p_ret_chapter == null ) {
							// GT_CHAPTER insert - 챕터 설정
							GTMgr.inst.GetGTChapter().create({
								UUID : p_user.uuid, CHAPTER_ID : battle_info.chapter_id
							})
							.then(function (p_ret_chapter_insert) {
								logger.info('New Chapter Insert', battle_info.chapter_id);
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'GT_CHAPTER insert');
							});
						}
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'GT_CHAPTER select');
					});

					// GT_STAGE select - 스테이지 설정
					GTMgr.inst.GetGTStage().find({
						where : { UUID : p_user.uuid, CHAPTER_ID : battle_info.chapter_id, STAGE_ID : battle_info.stage_id, EXIST_YN : true }
					})
					.then(function (p_ret_stage) {
						if ( p_ret_stage == null ) {
							// GT_STAGE insert - 새로운 스테이지
							var able_count = 0;
							if ( battle_info.chapter_type == 6 ) {
								able_count = 2;
							}

							// todo : able_count 추가 이전 코드. 
							GTMgr.inst.GetGTStage().create({
								UUID : p_user.uuid,
								CHAPTER_ID : battle_info.chapter_id,
								CHAPTER_TYPE : battle_info.chapter_type,
								STAGE_ID : battle_info.stage_id,
								CLEAR_GRADE : recv_clear_grade,
								ABLE_COUNT : able_count
							})
							.then(function (p_ret_stage_insert) {
								logger.info('New Stage Clear', battle_info.stage_id);
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'GT_STAGE insert');
							});
						} else {
							// 기존 스테이지 등급 업
							var change_stage_info = false;
							if ( p_ret_stage.dataValues.CLEAR_GRADE < recv_clear_grade ) {
								p_ret_stage['CLEAR_GRADE'] = recv_clear_grade;
								change_stage_info = true;
							}
							if ( battle_info.chapter_type == 6 ) {
								p_ret_stage['ABLE_COUNT'] = p_ret_stage.dataValues.ABLE_COUNT - 1;
								change_stage_info = true;
							}

							if ( change_stage_info == true ) {
								p_ret_stage.save()
								.then(function (p_ret_stage_update) {
									logger.info('Stage Clear Grade UP', p_ret_stage.dataValues.STAGE_ID, 'clear_grade', p_ret_stage_update.dataValues.CLEAR_GRADE);
								})
								.catch(function (p_error) {
									Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'GT_STAGE update');
								})	
							}

							// todo : 예언의 샘 추가 이전 코드. (able_count)
							// if ( p_ret_stage.dataValues.CLEAR_GRADE < recv_clear_grade ) {
							// 	// GT_STAGE update
							// 	p_ret_stage.updateAttributes({
							// 		CLEAR_GRADE : recv_clear_grade
							// 	})
							// 	.then(function (p_ret_stage_update) {
							// 		logger.info('Stage Clear Grade UP', p_ret_stage.dataValues.STAGE_ID, 'clear_grade', p_ret_stage_update.dataValues.CLEAR_GRADE);
							// 	})
							// 	.catch(function (p_error) {
							// 		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'GT_STAGE update');
							// 	});
							// }
						}
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'GT_STAGE select');
					});

					// 스태미너 감소
					var now_date = moment();
					var ret_stamina = user_data.STAMINA - battle_info.need_stamina;

					// Max 까지 남은 시간 계산.
					var ret_remain_time = GerStaminaFullRemainTime(now_date, ret_stamina, user_data.MAX_STAMINA, user_data.LAST_STAMINA_CHANGE_DATE);
					var last_stamina_change_date = ( ret_stamina < user_data.MAX_STAMINA ) ? now_date.format('YYYY-MM-DD HH:mm:ss') : null;

					// 보상 쿼리 만들기.
					var str_query = 'call sp_battle_reward (' + p_user.uuid + ', ' + 
											ret_stamina + ', ' + 
											battle_info.reward_info.reward_gold + ', ' + 
											battle_info.reward_info.reward_hero_exp + ', ' + 
											battle_info.reward_info.reward_account_exp;

					var reward_item_list = battle_info.reward_info.GetRewardAllItem();
					if ( reward_item_list != undefined ) {
						var count = 0;
						reward_item_list.forEach(function(value, key) {
							str_query = str_query + ', ' + value.item_id + ',' + value.item_count;
							count++;
						});

						for( var temp_count = count; temp_count < 10; temp_count++ ) {
							str_query = str_query + ', ' + 0 + ',' + 0;
						}

						str_query = str_query + ');';
					}

					console.log('sp query is - ' + str_query);

					// call ad-hoc query
					mkDB.inst.GetSequelize().query(str_query,
						null,
						{ raw : true, type : 'SELECT' }
					)
					.then(function (p_ret_reward) {
					 	// console.log('p_ret_reward:', p_ret_reward);
					 	p_ack_packet.chapter_id	= battle_info.chapter_id;
						p_ack_packet.stage_id	= battle_info.stage_id;
						p_ack_packet.first_enter= battle_info.first_enter_stage;
						
						// User reward
						if (Object.keys(p_ret_reward[0]).length > 0) {
							var ret_user_level	= p_ret_reward[0][0].USER_LEVEL;
							var ret_user_exp	= p_ret_reward[0][0].USER_EXP;
							var ret_gold		= p_ret_reward[0][0].GOLD;

							p_ack_packet.result_gold		= ret_gold;
							p_ack_packet.result_user_level	= ret_user_level;
							p_ack_packet.result_user_exp	= ret_user_exp;
							p_ack_packet.account_buff_point = p_ret_reward[0][0].ACCOUNT_BUFF_POINT;

							if ( user_data.USER_LEVEL != ret_user_level ) {
								// Mission - User levelup
								MissionMgr.inst.MissionAchieveUserLV(p_user, ret_user_level, true);
							}

							p_ack_packet.stamina			= p_ret_reward[0][0].STAMINA;
							p_ack_packet.max_stamina		= p_ret_reward[0][0].MAX_STAMINA;
							p_ack_packet.stamina_remain_time= ret_remain_time;
						}
						
						// hero reward
						if ( Object.keys(p_ret_reward[1]).length > 0 ) {
							var hero_levelup_count = 0;
							var max_hero_level = 0;

							for ( var hero_cnt in p_ret_reward[1] ) {
								var result_hero	= new PacketCommonData.HeroLevelInfo();

								result_hero.hero_id		= p_ret_reward[1][hero_cnt].hero_id;
								result_hero.hero_exp	= p_ret_reward[1][hero_cnt].hero_exp;
								result_hero.hero_level	= p_ret_reward[1][hero_cnt].hero_level;

								p_ack_packet.result_heros.push(result_hero);

								// 영웅 레벨 업 카운트
								var old_level = hero_level_map.get(result_hero.hero_id);
								if ( result_hero.hero_level > old_level ) {
									var delta_level = result_hero.hero_level - old_level;
									hero_levelup_count = hero_levelup_count + delta_level;

									if ( result_hero.hero_level > max_hero_level )
										max_hero_level = result_hero.hero_level;
									// console.log('HERO_ID : %d, new_level : %d, delta_level : %d', p_ret_hero.dataValues.HERO_ID, p_ret_hero.dataValues.HERO_LEVEL, delta_level);
								}
							}

							// for mission - AchieveHeroLV, IsLevelUpHero
							if ( max_hero_level != 0 ) {
								MissionMgr.inst.MissionAchieveHeroLV(p_user, max_hero_level);
							}

							if ( hero_levelup_count != 0 ) {
								MissionMgr.inst.MissionIsLevelUpHero(p_user, hero_levelup_count);
							}
						}
						
						// item reward
						if ( Object.keys(p_ret_reward[2]).length > 0 ) {
							for ( var item_cnt in p_ret_reward[2] ) {
								var result_item			= new PacketCommonData.Item();
								result_item.iuid		= p_ret_reward[2][item_cnt].iuid;
								result_item.item_id		= p_ret_reward[2][item_cnt].item_id;
								result_item.item_count	= p_ret_reward[2][item_cnt].item_count;

								p_ack_packet.result_items.push(result_item);
							}
						}

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

						BattleMgr.inst.DelBattle(p_user.uuid);

						// Mission - DungeonClearNormal
						MissionMgr.inst.MissionDungeonClearNormal(p_user, battle_info.stage_id, 1);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleFinish - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleFinish - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleFinish - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleFinish - 1');
		});
	}