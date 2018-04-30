/********************************************************************
Title : Stage
Date : 2016.07.14
Update : 2016.08.18
Desc : 로그인 정보 - 스테이지
writer: dongsu
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqStage = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqStage -', p_user.uuid, p_recv);

		// call ad-hoc query
		mkDB.inst.GetSequelize().query('select A.CHAPTER_ID, A.TAKE_REWARD_BOX_COUNT, B.STAGE_ID, B.CLEAR_GRADE, B.ABLE_COUNT, B.EXIST_YN \
										from GT_CHAPTERs A \
										left join GT_STAGEs B on A.CHAPTER_ID = B.CHAPTER_ID and A.UUID = B.UUID \
										where A.UUID = ? \
										order by A.CHAPTER_ID;',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_user.uuid ]
		)
		.then(function (p_ret_chapter) {
			// console.log('p_ret_chapter', p_ret_chapter);
			var chapter_id = 0;
			for ( var cnt in p_ret_chapter ) {
				// console.log('%d p_ret_chapter :', cnt, p_ret_chapter[cnt]);
				if ( chapter_id != p_ret_chapter[cnt].CHAPTER_ID ) {
					var chapter						= new PacketCommonData.ChapterInfo();
					chapter.chapter_id				= p_ret_chapter[cnt].CHAPTER_ID;
					chapter.take_reward_box_count	= p_ret_chapter[cnt].TAKE_REWARD_BOX_COUNT;
					p_ack_packet.chapter_list.push(chapter);

					chapter_id = p_ret_chapter[cnt].CHAPTER_ID;
				}

				if (p_ret_chapter[cnt].STAGE_ID != null) {
					var stage			= new PacketCommonData.StageInfo();
					stage.chapter_id	= p_ret_chapter[cnt].CHAPTER_ID;
					stage.stage_id	= p_ret_chapter[cnt].STAGE_ID;
					stage.clear_grade	= p_ret_chapter[cnt].CLEAR_GRADE;
					stage.able_count 	= p_ret_chapter[cnt].ABLE_COUNT;
					p_ack_packet.stage_list.push(stage);
				}
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqStage - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;