	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGachaOld = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGacha -', p_user.uuid, p_recv);

		var recv_gacha_id = parseInt(p_recv.gacha_id);

		// 1. 가챠 확인. 
		var base_gacha = BaseGachaRe.inst.GetBaseGacha(recv_gacha_id);
		if ( base_gacha == undefined ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Gacha Info In Base Gacha ID', recv_gacha_id);
			return;
		}

		// GT_USER select - 유저 재화 확인
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ){
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error Not Exist User In GT_USER');
				return;
			}

			// GT_VIP select - 1. vip 확인			
			if ( base_gacha.vip_gacha == true ) {
				var vip_base = BaseVipRe.inst.GetVip(p_ret_user.dataValues.VIP_STEP);
				if ( typeof vip_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Vip Info In Base ', 'Current VIP Step', p_ret_vip.dataValues.STEP);
					return;
				}

				if ( vip_base.vip_gacha == false ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughVipStep(), 'GachaID', recv_gacha_id);
					return;
				}
			}

			// GT_GACHA select
			GTMgr.inst.GetGTGacha().find({
				where : { UUID : p_user.uuid, GACHA_ID : recv_gacha_id, EXIST_YN : true }
			})
			.then(function (p_ret_gacha) {
				if ( p_ret_gacha == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Gacha Info In GT_GACHA GachaID', recv_gacha_id);
				}

				var daily_gacha_count	= p_ret_gacha.dataValues.DAILY_GACHA_COUNT;
				var last_gacha_date		= p_ret_gacha.dataValues.LAST_GACHA_DATE;

				// 2. 재화 확인
				var free_pass = false;
				var delta_time = 0;

				// 무료 확인
				if ( base_gacha.daily_free_exec_count != 0 ) {
					var calc_free_count = base_gacha.daily_free_exec_count - daily_gacha_count;

					if ( calc_free_count > 0 ) {
						delta_time = Timer.inst.GetDeltaTime(last_gacha_date);

						if ( delta_time >= base_gacha.free_exec_delay_time_for_sec || calc_free_count == base_gacha.daily_free_exec_count ) {
							free_pass = true;
							delta_time = 0;
							console.log('무료 뽑기 수행 중');
						}
					}
				}

				if ( free_pass == false ) {
					if ( base_gacha.price_type == DefineValues.inst.GachaPriceTypeGold ) {
						// 골드 부족
						if ( base_gacha.price > p_ret_user.dataValues.GOLD ) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'Need Gold', base_gacha.price, 'Current Gold', p_ret_user.dataValues.GOLD);
							return;
						}
					} else if ( base_gacha.price_type == DefineValues.inst.GachaPriceTypeCash ) {
						// 캐쉬 부족.
						if ( base_gacha.price > p_ret_user.dataValues.CASH ) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Need Cash', base_gacha.price, 'Current Cash', p_ret_user.dataValues.CASH);
							return;
						}
					} else {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'No Gacha Price Type', base_gacha.price_type);
						return;
					}
				}

				// 3. 가챠 만들기
				var gacha_info = GachaMgr.inst.GachaReward(base_gacha, p_ret_gacha.dataValues.TOTAL_GACHA_COUNT, free_pass);
				if ( typeof gacha_info === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Failed Make Gacha Info GachaID', recv_gacha_id);
					return;
				}

				var result_item_list = new HashMap();
				var result_hero_list = new HashMap();

				// 영웅 ID 목록, 보유하고 있는 영웅 ID 목록
				var gacha_hero_id_list = [];
				var user_hero_id_list = [];

				gacha_info.GetAllHero().forEach(function (h_value, h_key) { // key : index, value : item (소환권)
					var item_base = BaseItemRe.inst.GetItem(h_value.item_id);
					if ( item_base != undefined ) {
						// hero_id 가 중복 될 수 있다.
						gacha_hero_id_list.push(item_base.hero_id);
					}
				});

				console.log('가챠 영웅 :', gacha_hero_id_list);

				// GT_HERO select
				GTMgr.inst.GetGTHero().findAll({
					where : { UUID : p_user.uuid, HERO_ID : { in : gacha_hero_id_list }, EXIST_YN : true }
				})
				.then(function (p_ret_hero_list) {					
					for ( var cnt_list in p_ret_hero_list ) {
						(function (cnt_list) {
							var hero_data	= p_ret_hero_list[cnt_list].dataValues;
							// console.log('hero_data.HERO_ID', hero_data.HERO_ID);
							var find_index	= gacha_hero_id_list.indexOf(hero_data.HERO_ID);
							if ( find_index != -1 ) {
								user_hero_id_list.push(gacha_hero_id_list[find_index]);
							}
						})(cnt_list);
					}

					console.log('보유 영웅 :', user_hero_id_list, user_hero_id_list.length);

					// db용 결과 만들기(영웅) 
					gacha_info.GetAllHero().forEach(function (h_value, h_key) { // key : index, value : item (소환권)
						// 보유 영웅이 같은게 있는지 검사 있다면 영혼석 변환 후 아이템 리스트에 담는다. 
						var item_base = BaseItemRe.inst.GetItem(h_value.item_id);
						if ( item_base != undefined ) {
							
							if ( result_hero_list.has(item_base.hero_id) == true || ( user_hero_id_list.indexOf(item_base.hero_id) != -1 ) ) {
								var hero_base = BaseHeroRe.inst.GetHero(item_base.hero_id);

								if ( hero_base != undefined ) {
									var hero_evolution_base = BaseHeroEvolutionRe.inst.GetHeroEvolution(hero_base.evolution_step);
									
									if ( hero_evolution_base != undefined ) {
										// 영혼 석으로 변환.
										var exchange_count = hero_evolution_base.hero_stone_exchange;
									
										if ( result_item_list.has(hero_base.stone_id) == true ) {
											var temp_count	= result_item_list.get(hero_base.stone_id);
											var ret_count	= temp_count + exchange_count;

											result_item_list.set(hero_base.stone_id, ret_count);
										} else {
											result_item_list.set(hero_base.stone_id, exchange_count);
										}
									}	
								}
							} else {
								var hero_count = 1;
								result_hero_list.set(item_base.hero_id, hero_count);
							}

							// packet - view hero
							p_ack_packet.gacha_view_info.hero_list.push(item_base.hero_id);
						}
					});

					// db용 결과 만들기 (아이템)
					gacha_info.GetAllItem().forEach(function(i_value, i_key) { // key : index, value : item;
						if ( result_item_list.has(i_value.item_id) == true ) {
							var temp_item_count	= result_item_list.get(i_value.item_id);
							var ret_item_count	= temp_item_count + i_value.item_count;

							result_item_list.set(i_value.item_id, ret_item_count);
						} else {
							result_item_list.set(i_value.item_id, i_value.item_count);
						}

						var temp_item		= new PacketCommonData.RewardItem();
						temp_item.item_id	= i_value.item_id;
						temp_item.item_count= i_value.item_count;

						// packet - view item
						p_ack_packet.gacha_view_info.item_list.push(temp_item);
					});

					// 확인용. 
					// console.log('result_item_list', result_item_list);
					// console.log('result_hero_list', result_hero_list);

					result_item_list.forEach(function(value, key) {
						console.log('확인용 item key : %d, value : %d', key, value);
					});

					result_hero_list.forEach(function(value, key) {
						console.log('확인용 hero key : %d, value : %d', key, value);
					});

					// call ad-hoc query
					mkDB.inst.GetSequelize().query('call sp_gacha_re(?, ?, ?, ?, ?, ?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?,?,?,?,?,?,?,?,?);'
						, null
						, { raw: true, type: 'SELECT' }
						, [ p_user.uuid
							, base_gacha.gacha_id
							, free_pass
							, gacha_info.need_gold
							, gacha_info.need_cash
							, base_gacha.exec_count
							, (typeof result_item_list.keys()[0] === 'undefined') ? 0 : result_item_list.keys()[0], (typeof result_item_list.values()[0] === 'undefined') ? 0 : result_item_list.values()[0]
							, (typeof result_item_list.keys()[1] === 'undefined') ? 0 : result_item_list.keys()[1], (typeof result_item_list.values()[1] === 'undefined') ? 0 : result_item_list.values()[1]
							, (typeof result_item_list.keys()[2] === 'undefined') ? 0 : result_item_list.keys()[2], (typeof result_item_list.values()[2] === 'undefined') ? 0 : result_item_list.values()[2]
							, (typeof result_item_list.keys()[3] === 'undefined') ? 0 : result_item_list.keys()[3], (typeof result_item_list.values()[3] === 'undefined') ? 0 : result_item_list.values()[3]
							, (typeof result_item_list.keys()[4] === 'undefined') ? 0 : result_item_list.keys()[4], (typeof result_item_list.values()[4] === 'undefined') ? 0 : result_item_list.values()[4]
							, (typeof result_item_list.keys()[5] === 'undefined') ? 0 : result_item_list.keys()[5], (typeof result_item_list.values()[5] === 'undefined') ? 0 : result_item_list.values()[5]
							, (typeof result_item_list.keys()[6] === 'undefined') ? 0 : result_item_list.keys()[6], (typeof result_item_list.values()[6] === 'undefined') ? 0 : result_item_list.values()[6]
							, (typeof result_item_list.keys()[7] === 'undefined') ? 0 : result_item_list.keys()[7], (typeof result_item_list.values()[7] === 'undefined') ? 0 : result_item_list.values()[7]
							, (typeof result_item_list.keys()[8] === 'undefined') ? 0 : result_item_list.keys()[8], (typeof result_item_list.values()[8] === 'undefined') ? 0 : result_item_list.values()[8]
							, (typeof result_item_list.keys()[9] === 'undefined') ? 0 : result_item_list.keys()[9], (typeof result_item_list.values()[9] === 'undefined') ? 0 : result_item_list.values()[9]
							, (typeof result_hero_list.keys()[0] === 'undefined') ? 0 : result_hero_list.keys()[0]
							, (typeof result_hero_list.keys()[1] === 'undefined') ? 0 : result_hero_list.keys()[1]
							, (typeof result_hero_list.keys()[2] === 'undefined') ? 0 : result_hero_list.keys()[2]
							, (typeof result_hero_list.keys()[3] === 'undefined') ? 0 : result_hero_list.keys()[3]
							, (typeof result_hero_list.keys()[4] === 'undefined') ? 0 : result_hero_list.keys()[4]
							, (typeof result_hero_list.keys()[5] === 'undefined') ? 0 : result_hero_list.keys()[5]
							, (typeof result_hero_list.keys()[6] === 'undefined') ? 0 : result_hero_list.keys()[6]
							, (typeof result_hero_list.keys()[7] === 'undefined') ? 0 : result_hero_list.keys()[7]
							, (typeof result_hero_list.keys()[8] === 'undefined') ? 0 : result_hero_list.keys()[8]
							, (typeof result_hero_list.keys()[9] === 'undefined') ? 0 : result_hero_list.keys()[9]
					])
					.then(function (p_ret_gacha) {
						// console.log('p_ret_gacha', p_ret_gacha);
						// User
						if ( Object.keys(p_ret_gacha[0]).length > 0 ) {
							// packet - user, gacha
							p_ack_packet.result_gold = p_ret_gacha[0][0].GOLD;
							p_ack_packet.result_cash = p_ret_gacha[0][0].CASH;

							p_ack_packet.gacha_info.gacha_id = base_gacha.gacha_id;
							p_ack_packet.gacha_info.daily_gacha_count = p_ret_gacha[0][0].DAILY_GACHA_COUNT;
							p_ack_packet.gacha_info.total_gacha_count = p_ret_gacha[0][0].TOTAL_GACHA_COUNT;
							p_ack_packet.gacha_info.free_gacha_remain_time = 0;

							if ( base_gacha.daily_free_exec_count != 0 ) {
								let temp_count = base_gacha.daily_free_exec_count - p_ret_gacha[0][0].DAILY_GACHA_COUNT;
								if ( temp_count > 0 ) {
									let temp_time = Timer.inst.GetDeltaTime(p_ret_gacha[0][0].LAST_GACHA_DATE);
									if ( temp_time <= base_gacha.free_exec_delay_time_for_sec ) {
										p_ack_packet.gacha_info.free_gacha_remain_time = base_gacha.free_exec_delay_time_for_sec - temp_time;
									}
								}
							}
						}

						// Item
						if ( Object.keys(p_ret_gacha[1]).length > 0 ) {
							for ( let item_cnt in p_ret_gacha[1] ) {
								let result_item			= new PacketCommonData.Item();
								result_item.iuid		= p_ret_gacha[1][item_cnt].iuid;
								result_item.item_id		= p_ret_gacha[1][item_cnt].item_id;
								result_item.item_count	= p_ret_gacha[1][item_cnt].item_count;

								// packet - item_list
								p_ack_packet.result_item_info.item_list.push(result_item);
							}
						}

						// hero
						if ( Object.keys(p_ret_gacha[2]).length > 0 ) {
							for ( let hero_cnt in p_ret_gacha[2] ) {
								(function (hero_cnt) {
									let ret_hero_id = p_ret_gacha[2][hero_cnt].hero_id;

									// packet - hero_list
									p_ack_packet.result_item_info.hero_list.push(ret_hero_id);
								})(hero_cnt);
							}
						}

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGacha - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGacha - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGacha - 2');
			});			
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGacha - 1');
		});
	};