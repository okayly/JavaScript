/********************************************************************
Title : BattleStart
Date : 2015.09.24
Update : 2017.03.08
Desc : 배틀 시작 - 최초 클리어 보상이 존재
writer: dongsu
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var BattleMgr		= require('./BattleMgr.js');

var BaseStage 	= require('../../Data/Base/BaseStage.js');
var BaseChapter 	= require('../../Data/Base/BaseChapter.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	// dongsu
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

		var stage_base = BaseStage.inst.GetBaseStage(recv_stage_id);
		if ( typeof stage_base === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Stage Info In Base');
			return;
		}

		var chapter_base = BaseChapter.inst.GetBaseChapter(recv_chapter_id);
		if ( typeof chapter_base === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter Info In Base');
			return;
		}

		var GetUser = function() {
			// GT_USER select
			return new Promise(function (resolve, reject) {
				return GTMgr.inst.GetGTUser().find({ where : { UUID : p_user.uuid, EXIST_YN : true }})
				.then(p_ret_user => { resolve(p_ret_user); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var GetChapter = function() {
			// GT_CHAPTER select
			return new Promise(function (resolve, reject) {
				return GTMgr.inst.GetGTChapter().find({ where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id, EXIST_YN : true }})
				.then(p_ret_chapter => { resolve(p_ret_chapter); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var GetStage = function() {
			// GT_STAGE select
			return new Promise(function (resolve, reject) {
				return GTMgr.inst.GetGTStage().find({ where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id, STAGE_ID : recv_stage_id, EXIST_YN : true }})
				.then(p_ret_stage => { resolve(p_ret_stage); })
				.catch(p_error => { reject(p_error) });
			});
		}

		// Promise GO!
		Promise.all([
			GetUser(),
			GetChapter(),
			GetStage()
		])
		.then(values => {
			// for ( let cnt in values ) {
			// 	console.log('values', ( values[cnt] != null) ? values[cnt].dataValues : values[cnt]);
			// }

			let ret_user = values[0];
			let ret_chapter = values[1];
			let ret_stage = values[2];

			let first_enter_chapter = ( ret_chapter == null );
			let first_enter_stage  = ( ret_stage == null );

			// 스테미너 검사
			if ( stage_base.need_stamina > ret_user.dataValues.STAMINA ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughStamina(), 'NotEnoughStamina');
				return;
			}

			// 
			if ( first_enter_stage == false && chapter_base.chapter_type == 6 ) {
				if ( ret_chapter.dataValues.ABLE_COUNT <= 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughExecCount(), 'NotEnoughExecCount');
					return;
				}
			}

			// 보상 만들기. TODO : 바로 반환 하도록 수정. 
			BattleMgr.inst.CreateBattle(p_user.uuid, recv_chapter_id, chapter_base.chapter_type, recv_stage_id, first_enter_chapter, first_enter_stage);

			let battle_info = BattleMgr.inst.GetBattle(p_user.uuid);
			if ( typeof battle_info === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Chapter ID :', recv_chapter_id, 'Stage ID :', recv_stage_id);
				return;
			}

			// 배틀 중 보상 연출 때문에 보상 정보를 미리 보냄.
			battle_info.reward_item.GetItemList().map(item => {
				// console.log('Reward Item', item);
				let reward_item	= new PacketCommonData.RewardItem();
				reward_item.item_id			= item.item_id;
				reward_item.item_count		= item.item_count;
				reward_item.item_category1	= item.item_category1;

				p_ack_packet.reward_item_list.push(reward_item);
			});
			
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			console.log('Error Promise.all', p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;