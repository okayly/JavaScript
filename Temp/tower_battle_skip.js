		// GT_INFINITY_TOWER_USER select
		GTMgr.inst.GetGTInfinityTowerUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_tower_user) {
			if ( p_ret_tower_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower User In GT_INFINITY_TOWER_USER');
				return;
			}
			var tower_user_data = p_ret_tower_user.dataValues; 

			if ( recv_floor > tower_user_data.SKIP_POINT ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTowerSkipPointFloor(), 'Floor', recv_floor, 'Skip Point', tower_user_data.SKIP_POINT);
				return;
			}
			
			var tower_base = BaseTower.inst.GetTowerFloor(recv_floor);
			if ( typeof tower_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
				return;
			}

			// 보상 점수와 티켓은 난이도 상의 보상
			var battle_type = DefineValues.inst.InfinityTowerBattleHigh;
			var reward_base = tower_base.GetBattleReward(battle_type);
			if ( typeof reward_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower Reward In Base Floor', recv_floor, 'Battle Type', battle_type);
				return;
			}
		
			// GT_INFINITY_TOWER_FLOOR select
			GTMgr.inst.GetGTInfinityTowerFloor().find({
				where : { UUID : p_user.uuid, FLOOR : recv_floor, EXIST_YN : true }
			})
			.then(function (p_ret_floor) {
				// console.log('p_ret_floor:', p_ret_floor);
				var clear_grade	= 3;
				var str_now		= Timer.inst.GetNowByStrDate();

				var reward_ticket	= reward_base.ticket;
				var reward_score	= reward_base.score;
				logger.info('Reward Ticket', reward_ticket, 'Reward Score', reward_score);

				if (p_ret_floor == null) {
					// GT_INFINITY_TOWER_FLOOR insert
					GTMgr.inst.GetGTInfinityTowerFloor().create({
						UUID				: p_user.uuid,
						FLOOR				: recv_floor,
						FLOOR_TYPE			: tower_base.floor_type,
						BATTLE_TYPE			: battle_type,
						BATTLE_CLEAR_GRADE	: clear_grade,
						UPDATE_DATE			: str_now,
						REG_DATE			: str_now
					})
					.then(function (p_ret_floor_create) {
						logger.info('UUID : %d, Create Tower Floor', p_ret_floor_create.dataValues.UUID, p_ret_floor_create.dataValues.FLOOR);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleSkip - 5');
					});
				} else {
					// GT_INFINITY_TOWER_FLOOR update
					p_ret_floor.updateAttributes({
						BATTLE_TYPE			: battle_type,
						BATTLE_CLEAR_GRADE	: clear_grade
					})
					.then(function (p_ret_floor_update) {
						logger.info('UUID : %d, Update Tower Floor', p_ret_floor_update.dataValues.UUID, p_ret_floor_update.dataValues.FLOOR);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleSkip - 4');
					});
				}

				// GT_INFINITY_TOWER_USER update
				p_ret_tower_user.updateAttributes({
					TODAY_TICKET: tower_user_data.TODAY_TICKET + reward_ticket,
					TODAY_SCORE	: tower_user_data.TODAY_SCORE + reward_score,
					ACCUM_SCORE	: tower_user_data.ACCUM_SCORE + reward_score,
					UPDATE_DATE	: str_now
				})
				.then(function (p_ret_user_update) {
					var user_data = p_ret_user_update.dataValues; 
					p_ack_packet.floor			= p_ret_floor.dataValues.FLOOR;
					p_ack_packet.ticket			= user_data.TODAY_TICKET;
					p_ack_packet.daily_score	= user_data.TODAY_SCORE;
					p_ack_packet.accum_score	= user_data.ACCUM_SCORE;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleSkip - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleSkip - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleSkip - 1');
		});