/********************************************************************
Title : UserChapterReward
Date : 2016.06.10
Update : 2016.07.29
Desc : 챕터 누적 별 보상
writer: dongsu
*******************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var BaseChapter = require('../../Data/Base/BaseChapter.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChapterReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChapterReward -', p_user.uuid, p_recv);

		var sequelize = mkDB.inst.GetSequelize();

		var recv_chapter_id = parseInt(p_recv.chapter_id);
		var recv_box_id = parseInt(p_recv.reward_box_id);

		var base_chapter = BaseChapter.inst.GetBaseChapter(recv_chapter_id);
		// console.log('base_chapter', base_chapter);
		if ( typeof base_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter Info In Base ChapterID', recv_chapter_id);
			return;
		}

		var base_box = base_chapter.GetRewardBox(recv_box_id);
		if ( typeof base_box === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Reward Box Info In Base ChapterID', recv_chapter_id, 'Reward Box ID', recv_box_id);
			return;
		}

		// 챕터 별 갯수
		GTMgr.inst.GetGTStage().findAll({
			where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id },
			attributes : [ [sequelize.fn('sum', sequelize.col('CLEAR_GRADE')), 'STAR'] ]
		})
		.then(function (p_ret_chapter_star) {
			// console.log('p_ret_chapter_star', p_ret_chapter_star[0]);
			if ( p_ret_chapter_star[0] == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughStar(), 'Current Star', 0, 'Need Star', base_box.need_star);
				return;
			}

			// GT_CHAPTER select - 챕터 정보
			GTMgr.inst.GetGTChapter().find({
				where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id, EXIST_YN : true }
			})
			.then(function (p_ret_chapter) {
				if ( p_ret_chapter == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter Info In GT_CHAPTER ChapterID', recv_chapter_id);
					return;
				}

				if ( p_ret_chapter.dataValues.TAKE_REWARD_BOX_COUNT >= recv_box_id ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyChapterRewardBox(), 'Reward Box Count', p_ret_chapter.dataValues.TAKE_REWARD_BOX_COUNT, 'Box ID', recv_box_id);
					return;
				}

				if ( p_ret_chapter_star[0].dataValues.STAR < base_box.need_star ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughStar(), 'Current Star', p_ret_chapter_star[0].dataValues.STAR, 'Need Star', base_box.need_star);
					return;
				}

				// call ad-hoc query
				mkDB.inst.GetSequelize().query('call sp_insert_chapter_reward(?, ?, ?, ?, ?, ?,?, ?,?);',
					null,
					{ raw : true, type : 'SELECT' },
					[ p_user.uuid, recv_chapter_id, recv_box_id, base_box.cash, base_box.gold,
					  ( typeof base_box.GetItem(1) === 'undefined' ) ? 0 : base_box.GetItem(1).item_id, ( typeof base_box.GetItem(1) === 'undefined' ) ? 0 : base_box.GetItem(1).item_count,
					  ( typeof base_box.GetItem(2) === 'undefined' ) ? 0 : base_box.GetItem(2).item_id, ( typeof base_box.GetItem(2) === 'undefined' ) ? 0 : base_box.GetItem(2).item_count ]
				)
				.then(function (p_ret_chapter_reward) {
					// console.log('p_ret_chapter_reward', p_ret_chapter_reward);
					if ( Object.keys(p_ret_chapter_reward[0]).length > 0 ) {
						var ret_cash = p_ret_chapter_reward[0][0].CASH;
						var ret_gold = p_ret_chapter_reward[0][0].GOLD;

						p_ack_packet.result_gold = ret_gold;
						p_ack_packet.result_cash = ret_cash;
					}
					
					// item reward
					if ( Object.keys(p_ret_chapter_reward[1]).length > 0 ) {
						for ( var item_cnt in p_ret_chapter_reward[1] ) {
							var result_item			= new PacketCommonData.Item();
							result_item.iuid		= p_ret_chapter_reward[1][item_cnt].IUID;
							result_item.item_id		= p_ret_chapter_reward[1][item_cnt].ITEM_ID;
							result_item.item_count	= p_ret_chapter_reward[1][item_cnt].ITEM_COUNT;

							p_ack_packet.reward_items.push(result_item);
						}
					}
					
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChapterReward - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChapterReward - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChapterReward - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;