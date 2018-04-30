	inst.ReqBattleStart = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqBattleStart -', p_user.uuid, p_recv);

		// 배틀 보상
		// 보상 이벤트도 생각 해야 한다.
		// 1. 계정 경험치 - 고정
		// 2. 영웅 경험치 - 고정
		// 3. 골드 - 고정
		// 4. 보상 아이템
		//    - 최초 클리어 - 고정(5개)
		//    - 일반 클리어 - 랜덤
		//      보상 갯수를 결정 한 후 10개 보상에서 확률로 골라 준다.

		// 1. 배틀 정보 확인. 
		// TODO : 우선 기존의 배틀 정보가 존재한다면 삭제 한다. 정보의 삭제는 BattleEnd 에서 하나 완료 하지 않은 정보가 존재 할 수 있다. 
		var recv_chapter_id	= parseInt(p_recv.chapter_id);
		var recv_stage_id	= parseInt(p_recv.stage_id);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}

			var stage_base = BaseStage.inst.GetBaseStage(recv_stage_id);
			if ( stage_base == undefined ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Stage Info In Base');
				return;
			}

			var chapter_base = BaseChapter.inst.GetBaseChapter(recv_chapter_id);
			if ( chapter_base == undefined ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter Info In Base');
				return;
			}

			// 스테미너 검사
			if ( stage_base.need_stamina > p_ret_user.dataValues.STAMINA ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughStamina());
				return;
			}

			// 유저에서 스테이지 있는지 찾는다.
			var first_enter_chapter = false;
			var first_enter_stage  = false;

			// call ad-hoc
			mkDB.inst.GetSequelize().query('select *, \
							 ifnull((select STAGE_ID from GT_STAGEs B where A.UUID = B.UUID and A.CHAPTER_ID = B.CHAPTER_ID and B.STAGE_ID = ? and EXIST_YN = true), 0) as STAGE_ID, \
							 ifnull((select ABLE_COUNT from GT_STAGEs B where A.UUID = B.UUID and A.CHAPTER_ID = B.CHAPTER_ID and B.STAGE_ID = ? and EXIST_YN = true), 0) as ABLE_COUNT \
							from GT_CHAPTERs A \
							where A.CHAPTER_ID = ? \
							and A.UUID = ? and EXIST_YN = true;',
				null,
				{ raw: true, type: 'SELECT' },
				[ recv_stage_id, recv_stage_id, recv_chapter_id, p_user.uuid ]
			)
			.then (function (p_ret_first_clear) {
				// console.log('p_ret_first_clear', p_ret_first_clear);
				if ( Object.keys(p_ret_first_clear).length > 0 ) {
					first_enter_stage = ( p_ret_first_clear[0].STAGE_ID == 0 );
				} 
				else 
				{
					first_enter_stage = true;
					first_enter_chapter = true;
				}

				// todo : 상수는 밖으로 빼야 함. 
				if ( first_enter_stage == false && chapter_base.chapter_type == 6 ) {
					if ( p_ret_first_clear.ABLE_COUNT <= 0 ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughExecCount());
						return;
					}
				}

				// 보상 만들기. TODO : 바로 반환 하도록 수정. 
				BattleMgr.inst.CreateBattle(p_user.uuid, recv_chapter_id, chapter_base.chapter_type, recv_stage_id, first_enter_chapter, first_enter_stage);

				var battle_info = BattleMgr.inst.GetBattle(p_user.uuid);
				if ( battle_info == undefined ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Chapter ID :', recv_chapter_id, 'Stage ID :', recv_stage_id);
					return;
				}

				// 배틀 중 보상 연출 때문에 보상 정보를 미리 보냄.
				battle_info.reward_info.GetRewardAllItem().forEach(function(value, key) {
					var data		= new PacketCommonData.RewardItem();
					data.item_id	= value.item_id;
					data.item_count	= value.item_count;

					p_ack_packet.reward_item_list.push(data);
				});
				
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleStart - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBattleStart - 1');
		});
	};