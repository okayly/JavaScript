/********************************************************************
Title : DuckStage
Date : 2016.06.07
Update : 2017.04.20
Desc : 테스트 패킷을 관리 - 스테이지 클리어
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var BaseStage = require('../../Data/Base/BaseStage.js');
var BaseChapter = require('../../Data/Base/BaseChapter.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var SelectChapter = function(p_t, p_uuid, p_chapter_id) {
		return new Promise(function (resolve, reject) {
			// GT_CHAPTER select
			GTMgr.inst.GetGTChapter().find({
				where : { UUID : p_uuid, CHAPTER_ID : p_chapter_id, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_chapter => {
				resolve(p_ret_chapter);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectStage = function(p_t, p_uuid, p_stage_id) {
		return new Promise(function (resolve, reject) {
			// GT_STAGE select
			GTMgr.inst.GetGTStage().find({
				where : { UUID : p_uuid, STAGE_ID : p_stage_id, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_stage => {
				resolve(p_ret_stage);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertChapter = function(p_t, p_uuid, p_chapter_id) {
		return new Promise(function (resolve, reject) {
			SelectChapter(p_t, p_uuid, p_chapter_id)
			.then(value => {
				let ret_chapter = value;

				if ( ret_chapter == null ) {
					// GT_CHAPTER insert
					GTMgr.inst.GetGTChapter().create({
						UUID		: p_uuid,
						CHAPTER_ID	: p_chapter_id,
						REG_DATE	: Timer.inst.GetNowByStrDate()
					}, { transaction : p_t })
					.then(p_ret_chapter_insert => {
						resolve(p_ret_chapter_insert);
					})
					.catch(p_error => { reject(p_error); });
				} else {
					resolve(ret_chapter);
				}
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertStage = function(p_t, p_uuid, p_chapter_id, p_stage_id) {
		return new Promise(function (resolve, reject) {
			// Promise.all GO!
			Promise.all([
				BaseChapter.inst.GetBaseChapter(p_chapter_id),
				SelectStage(p_t, p_uuid, p_stage_id)
			])
			.then(values => {
				let base_chapter = values[0];
				let ret_stage = values[1];

				if ( typeof base_chapter === 'undefined' || typeof ret_stage === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'base_chapter or ret_stage is undefined' ]);

				if ( ret_stage == null ) {
					// GT_STAGE insert
					GTMgr.inst.GetGTStage().create({
						UUID		: p_uuid,
						CHAPTER_ID	: p_chapter_id,
						CHAPTER_TYPE: base_chapter.chapter_type,
						STAGE_ID	: p_stage_id,
						CLEAR_GRADE	: DefineValues.inst.MaxStageClearGrade,
						REG_DATE	: Timer.inst.GetNowByStrDate()
					}, { transaction : p_t })
					.then(p_ret_stage_insert => {
						resolve(p_ret_stage_insert);
					})
					.catch(p_error => { reject(p_error); });
				} else {
					resolve(ret_stage);
				}
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertOrUpdateStage = function(p_t, p_uuid, p_chapter_id, p_stage_id) {
		return new Promise(function (resolve, reject) {
			// Promise.all GO!
			return Promise.all([
				InsertChapter(p_t, p_uuid, p_chapter_id),
				InsertStage(p_t, p_uuid, p_chapter_id, p_stage_id)
			])
			.then(values => {
				resolve(values);
			})
			.catch(p_error => { reject(p_error); });
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	// 스테이지 클리어 
	inst.ReqStageClear = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqStageClear -', p_uuid, p_recv);

		let recv_stage_id = parseInt(p_recv.stage_id);
		let recv_clear_grade = parseInt(p_recv.clear_grade);

		// 챕터 구분
		// 1. 시나리오 보통
		// 2. 시나리오 어려움
		// 3. 시나리오 악몽
		// 5. 길드 레이드
		// 6. 예언의 샘
		// 7. 어둠의 던전

		// call ad-hoc query - BT_STAGE_BASE select
		mkDB.inst.GetSequelize().query("select * from BT_STAGE_BASEs where STAGE_ID <= ? order by STAGE_ID;",
			null,
			{ raw : true, type : 'SELECT' },
			[ recv_stage_id ]
		)
		.then(p_ret_stage_list => {
			console.log('BT_STAGE_BASE select', recv_stage_id, p_ret_stage_list.length);

			return new Promise(function (resolve, reject) {
				mkDB.inst.GetSequelize().transaction(function (transaction) {
					let t = transaction;

					// Promise.all GOD!
					return Promise.all(p_ret_stage_list.map(stage => {
						let stage_id = stage.STAGE_ID;
						let chapter_id = stage.CHAPTER_ID;

						return InsertOrUpdateStage(t, p_uuid, chapter_id, stage_id);
					}))
					.then(values => {
						t.commit();
						resolve(values);
					})
					.catch(p_error => {
						if (t)
							t.rollback();
						reject(p_error);
					});
				});
			});
		})
		.then(values => {
			for ( let cnt = 0; cnt < values.length; ++cnt ) {
				let value = values[cnt];
				for ( let cnt = 0; cnt < value.length; ++cnt )
					console.log('value[%d] :', cnt, value[cnt].dataValues);
			}
			// console.log('values', values);

			// for ( let cnt = 0; cnt < values.length; ++cnt )
			// 	console.log('values[%d]', values[cnt]);

			// let ret_chapter = values[0];
			// let ret_stage = values[1];

			// for ( let cnt = 0; cnt < ret_chapter.length; ++cnt ) {
			// 	let chapter = new PacketCommonData.ChapterInfo();
			// 	chapter.chapter_id = ret_chapter[cnt].dataValues.CHAPTER_ID;
			// 	chapter.take_reward_box_count = ret_chapter[cnt].dataValues.TAKE_REWARD_BOX_COUNT;

			// 	p_ack_packet.chapter_list.push(chapter);
			// 	p_evt_packet.chapter_list.push(chapter);				
			// }

			// for ( let cnt = 0; cnt < ret_stage.length; ++cnt ) {
			// 	let stage = new PacketCommonData.StageInfo();
			// 	stage.chapter_id = ret_stage[cnt].dataValues.CHAPTER_ID;
			// 	stage.stage_id = ret_stage[cnt].dataValues.STAGE_ID;
			// 	stage.clear_grade = ret_stage[cnt].dataValues.CLEAR_GRADE;

			// 	p_ack_packet.stage_list.push(stage);
			// 	p_evt_packet.stage_list.push(stage);
			// }

			Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
		})
		.catch(p_error => {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}	
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;