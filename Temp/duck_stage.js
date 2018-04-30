/********************************************************************
Title : DuckStage
Date : 2016.06.07
Update : 2017.04.19
Desc : 테스트 패킷을 관리 - 스테이지 클리어
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');
var moment = require('moment');
var async = require('async');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 스테이지 클리어 
	inst.ReqStageClear = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqStageClear -', p_uuid, p_recv);

		var stage_id = parseInt(p_recv.stage_id);
		var clear_grade = parseInt(p_recv.clear_grade);

		var str_now = Timer.inst.GetNowByStrDate();

		// 챕터, 스테이지 등록 후 패킷을 보내기 위해서 async.waterfall 을 사용
		// 이게 맞는 문법인지는 모르겠다.
		// 2017.04.19 호오. waterfall 사용했네. 하지만 Promise 가 더 편하다.
		async.waterfall([
			function (callback) {
				// call ad-hoc query - 챕터 등록
				mkDB.inst.GetSequelize().query("select CHAPTER_ID, CHAPTER_TYPE from BT_CHAPTER_BASEs where CHAPTER_ID = (select CHAPTER_ID from BT_STAGE_BASEs where STAGE_ID = ?);",
					null,
					{ raw : true, type : 'SELECT' },
					[ stage_id ]
				)
				.then(function (p_ret_chapter_info) {
					if ( Object.keys(p_ret_chapter_info).length <= 0 ) {
						p_ack_packet.chapter_list = null;
						p_ack_packet.stage_list = null;

						Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
						return;
					}

					// call ad-hco query - 챕터 선택
					mkDB.inst.GetSequelize().query('select * from BT_CHAPTER_BASEs where CHAPTER_ID <= ? and CHAPTER_TYPE = ?',
						null,
						{ raw : true, type : 'SELECT' },
						[ p_ret_chapter_info[0].CHAPTER_ID, p_ret_chapter_info[0].CHAPTER_TYPE ]
					)
					.then(function (p_ret_chapter_select) {
						// callback(null, p_ret_chapter_select);
						var chapter_len = Object.keys(p_ret_chapter_select).length;

						if ( chapter_len <= 0 ) {
							p_ack_packet.chapter_list = null;
							p_ack_packet.stage_list = null;

							Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
							return;
						}

						var chapter_count = 0;
						var caslt_id_list = [];
						for ( var cnt_chapter in p_ret_chapter_select ) {
							(function (cnt_chapter) {
								caslt_id_list.push(p_ret_chapter_select[cnt_chapter].CHAPTER_ID);
								// GT_CASTLE select
								GTMgr.inst.GetGTChapter().find({
									where : { UUID : p_uuid, CHAPTER_ID : p_ret_chapter_select[cnt_chapter].CHAPTER_ID, EXIST_YN : true }
								})
								.then(function (p_ret_user_chapter) {
									if (p_ret_user_chapter == null) {
										// GT_CASTLE insert
										GTMgr.inst.GetGTChapter().create({
											UUID		: p_uuid,
											CHAPTER_ID	: p_ret_chapter_select[cnt_chapter].CHAPTER_ID,
											REG_DATE	: str_now
										})
										.then(function (p_ret_user_chapter_create) {
											if ( ++chapter_count == chapter_len ) {
												callback(null, caslt_id_list, stage_id, clear_grade);
											}
										})
										.catch(function (p_error) {
											callback(p_error);
										});
									} else {
										if ( ++chapter_count == chapter_len ) {
											callback(null, caslt_id_list, stage_id, clear_grade);
										}
									}
								})
								.catch(function (p_error) {
									callback(p_error);
								});
							})(cnt_chapter);
						}
					})
					.catch(function (p_error) {
						callback(p_error);
					});
				})
				.catch(function (p_error) {
					callback(p_error);
				});
			}
			, function (p_chapter_id, p_stage_id, p_clear_grade, callback) {
				// 스테이지 등록
				mkDB.inst.GetSequelize().query('select * from BT_STAGE_BASEs where CHAPTER_ID in (?) and STAGE_ID <= ? order by STAGE_ID',
					null,
					{ raw : true, type : 'SELECT' },
					[ p_chapter_id, p_stage_id ]
				)
				.then(function (p_ret_stage_select) {
					console.log('p_ret_stage_select', Object.keys(p_ret_stage_select).length);
					var stage_len = Object.keys(p_ret_stage_select).length;
					if ( stage_len < 0 ) {
						p_ack_packet.chapter_list = null;
						p_ack_packet.stage_list = null;

						Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
						return;
					}

					var stage_count = 0;
					for ( var cnt_stage in p_ret_stage_select ) {
						(function (cnt_stage) {
							// GT_STAGE select
							GTMgr.inst.GetGTStage().find({
								where : { UUID : p_uuid, STAGE_ID : p_ret_stage_select[cnt_stage].STAGE_ID, EXIST_YN : true }
							})
							.then(function (p_ret_user_stage) {
								var chapter_id = p_ret_stage_select[cnt_stage].CHAPTER_ID;
								var stage_id = p_ret_stage_select[cnt_stage].STAGE_ID;

								var chapter_type = 0;

								if ( chapter_id < 101) {
									chapter_type = 1;									
								} else {
									chapter_type = (parseInt(chapter_id) / 100);
								}

								if ( p_ret_user_stage == null ) {
									// GT_STAGE insert
									GTMgr.inst.GetGTStage().create({
										UUID		: p_uuid,
										CHAPTER_ID	: p_ret_stage_select[cnt_stage].CHAPTER_ID,
										CHAPTER_TYPE: chapter_type,
										STAGE_ID	: p_ret_stage_select[cnt_stage].STAGE_ID,
										CLEAR_GRADE	: p_clear_grade,
										REG_DATE	: str_now
									})
									.then(function (p_ret_user_stage_create) {
										if ( ++stage_count == stage_len ) {
											callback(null);
										}
									})
									.catch(function (p_error) {
										callback(p_error);
									});
								} else {
									if ( p_ret_user_stage.dataValues.CLEAR_GRADE != p_clear_grade ) {
										// GT_STAGE update
										p_ret_user_stage.updateAttributes({
											CLEAR_GRADE : p_clear_grade
										})
										.then(function (p_ret_user_stage_update) {
											if ( ++stage_count == stage_len ) {
												callback(null);
											}
										})
										.catch(function (p_eror) {

										});
									} else {
										if ( ++stage_count == stage_len ) {
											callback(null);
										}
									}
								}
							})
							.catch(function (p_error) {
								callback(p_error);
							});
						})(cnt_stage);
					}
				})
				.catch(function (p_error) {
					callback(p_error);
				});
			}
			, function (callback) {
				// 패킷 보내기
				console.log('SendPacket');
				mkDB.inst.GetSequelize().query('select A.CHAPTER_ID, A.TAKE_REWARD_BOX_COUNT, ifnull(B.STAGE_ID, 0) as STAGE_ID, ifnull(B.CLEAR_GRADE, 0) as CLEAR_GRADE from GT_CHAPTERs A \
												left join GT_STAGEs B on A.CHAPTER_ID = B.CHAPTER_ID and A.UUID = B.UUID \
												where A.UUID = ? order by A.CHAPTER_ID;',
					null,
					{ raw : true, type : 'SELECT' },
					[ p_uuid ]
				)
				.then(function (p_ret_stage) {
					// console.log('p_ret_stage', p_ret_stage);
					if ( Object.keys(p_ret_stage).length <= 0 ) {
						p_ack_packet.chapter_list = null;
						p_ack_packet.stage_list = null;

						Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
						return;
					}

					var chapter_id = 0;
					for ( var cnt in p_ret_stage ) {
						(function (cnt) {
							if ( chapter_id != p_ret_stage[cnt].CHAPTER_ID ) {
								chapter_id = p_ret_stage[cnt].CHAPTER_ID;

								var chapter = new PacketCommonData.ChapterInfo();
								chapter.chapter_id = chapter_id;
								chapter.take_reward_box_count = p_ret_stage[cnt].TAKE_REWARD_BOX_COUNT;

								p_ack_packet.chapter_list.push(chapter);
								p_evt_packet.chapter_list.push(chapter);
							}

							if ( p_ret_stage[cnt].STAGE_ID != 0 ) {
								var stage_id = p_ret_stage[cnt].STAGE_ID;

								var stage = new PacketCommonData.StageInfo();
								stage.chapter_id = p_ret_stage[cnt].CHAPTER_ID;
								stage.stage_id = stage_id;
								stage.clear_grade = p_ret_stage[cnt].CLEAR_GRADE;

								p_ack_packet.stage_list.push(stage);
								p_evt_packet.stage_list.push(stage);
							}
						})(cnt);
					}

					Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
					callback(null, 'Finish');
				})
				.catch(function (p_error) {
					callback(p_error);
				});
			}
		], function (p_error, p_success) {
			if ( p_error ) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqStageClear');
				return;
			}

			console.log('!!!!! Finish !!!!!', p_success);
		});
	}
	
	exports.inst = inst;

})(exports || global);
(exports || global).inst;



리소스도 손을 좀 봐야할텐데

부파의 이미지가 갑옷같은 기본 몸에 붙어있는게 떨어지는거라면 좀 쉽겠지

그건 떼거나 교체하면 되니까


근데 기본 몸을 이루는 부위가 손상이 되려면 그 부분이 떨어져야 할거 같아

마치 예전 리듬겜 옷 갈아 입히는 것처럼

겉으로는 한 몸인데 부위별로 다른 메시 쓰는것 처럼

그리고 애니메이션도 손을 많이 봐야할거야

부위 파괴가 되면 애니도 그에 맞춰서 바뀌어야 할테니까

클라쪽 자원이 좀 부족하지 싶은데

이게 나눠서 작업하기가 좀 애매해서


부파 시스템만 누가 따로 해야할거 같은데


배틀의 로직을 한명이 하고 부파 시스템 한명하고 유아이 한명 그리고 카메라 연출 한명
이렇게 나눠야할거 같아

부파 할때 동환씨도 같이 해야할거야


리듬겜 옷 갈아 입히는 것처럼 해야겠네

기존 매카님 컨트롤러는 못쓸거야

그 캐릭 전용으로 만들어야 될거 같은데

근데 부파를 테스트 하면서 개발을 해야하는거라 리소스에서 빨리 준비를 해줘야 될거야


그러면 유월 말까지는 힘들지 클라도 알엔디 할게 많은데

지금 시스템으로 풀려고 하면 답없고 새로 만들어야 할게 많아


어느부위에 공격했다치고 데미지나 무슨 값에 따라 부위 파괴하고 파괴되면 어떻게 모양을 바꾸고 애니도 하겠다를 만든다음에 배틀을 붙여야지


배틀 로직을 다른 사람이 하는게 나을텐데

희종님이 짠 로직이 복잡하진 않아서 일 이주 보면 상우씨가 할 수 있을거야


부파는 희종님하고 동환씨 같이 하는게 나을듯


내 생각엔 팔월까진 걸릴듯

빠르면 칠월


유월은 힘들거 같은데 대충 모양만 나오고

팔 수 있는 느낌에는 한계가 분명 있어

한달운 더 벌어야해

칠월까지로 기간 좀 늘려봐