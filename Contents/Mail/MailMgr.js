/********************************************************************
Title : MailMgr
Date : 2016.04.25
Update : 2016.11.21
Desc : 우편 매니저
	   우편 대표 아이콘 : 첫번째 첨부 아이템 정보가
writer: jongwook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');
var UserMgr	= require('../../Data/Game/UserMgr.js');

var BaseGuild = require('../../Data/Base/BaseGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var DeleteOverCountMail = function(p_uuid) {
		// 우편이 100개가 넘으면 오래된 발송 내역부터 삭제
		GTMgr.inst.GetGTMail().findAll({
			where : { UUID : p_uuid, EXIST_YN : true },
			order : 'REG_DATE desc'
		})
		.then(function (p_ret_mail_list) {
			// console.log('p_ret_mail_list', p_ret_mail_list);
			for ( var cnt_mail in p_ret_mail_list ) {
				if ( cnt_mail >= (DefineValues.inst.MaxMailCount - 1) ) {
					// GT_MAIL update
					p_ret_mail_list[cnt_mail].updateAttributes({
						EXIST_YN : false
					})
					.then(function (p_ret_mail_update) {
						logger.info('UUID :', p_uuid, 'Remove Mail ID', p_ret_mail_update.dataValues.MAIL_ID);
					})
					.catch(function (p_error) {
						logger.error(p_error, 'error DeleteOverCountMail cnt_mail', cnt_mail);
					});
				}
			}
		})
		.catch(function (p_error) {
			logger.error(p_error, 'Error DeleteOverCountMail UUID', p_uuid);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 우편 보내기
	inst.SendMail = function(p_uuid, p_sender, p_mail_type, p_mail_string_id, p_string_value_list, p_subject, p_contents, p_reward_item_list) {
		// 메일 삭제
		DeleteOverCountMail(p_uuid);

		// GT_MAIL isnert
		GTMgr.inst.GetGTMail().create({
			UUID					: p_uuid,
			MAIL_SENDER				: (p_mail_string_id != 0) ? '' : p_sender,
			MAIL_TYPE				: p_mail_type,
			MAIL_ICON_TYPE			: (typeof p_reward_item_list[0] === 'undefined') ? 0 : p_reward_item_list[0].reward_type,
			MAIL_ICON_ITEM_ID		: (typeof p_reward_item_list[0] === 'undefined') ? 0 : p_reward_item_list[0].reward_item_id,
			MAIL_ICON_COUNT			: (typeof p_reward_item_list[0] === 'undefined') ? 0 : p_reward_item_list[0].reward_count,
			MAIL_STRING_ID			: p_mail_string_id,
			MAIL_STRING_VALUE_LIST	: (p_mail_string_id == 0) ? null : p_string_value_list,
			MAIL_SUBJECT			: (p_mail_string_id == 0) ? p_subject : '',
			MAIL_CONTENTS			: (p_mail_string_id == 0) ? p_contents : '',
			REWARD1_TYPE			: (typeof p_reward_item_list[0] === 'undefined') ? 0 : p_reward_item_list[0].reward_type,
			REWARD1_ITEM_ID			: (typeof p_reward_item_list[0] === 'undefined') ? 0 : p_reward_item_list[0].reward_item_id,
			REWARD1_COUNT			: (typeof p_reward_item_list[0] === 'undefined') ? 0 : p_reward_item_list[0].reward_count,
			REWARD2_TYPE			: (typeof p_reward_item_list[1] === 'undefined') ? 0 : p_reward_item_list[1].reward_type,
			REWARD2_ITEM_ID			: (typeof p_reward_item_list[1] === 'undefined') ? 0 : p_reward_item_list[1].reward_item_id,
			REWARD2_COUNT			: (typeof p_reward_item_list[1] === 'undefined') ? 0 : p_reward_item_list[1].reward_count,
			REWARD3_TYPE			: (typeof p_reward_item_list[2] === 'undefined') ? 0 : p_reward_item_list[2].reward_type,
			REWARD3_ITEM_ID			: (typeof p_reward_item_list[2] === 'undefined') ? 0 : p_reward_item_list[2].reward_item_id,
			REWARD3_COUNT			: (typeof p_reward_item_list[2] === 'undefined') ? 0 : p_reward_item_list[2].reward_count,
			REWARD4_TYPE			: (typeof p_reward_item_list[3] === 'undefined') ? 0 : p_reward_item_list[3].reward_type,
			REWARD4_ITEM_ID			: (typeof p_reward_item_list[3] === 'undefined') ? 0 : p_reward_item_list[3].reward_item_id,
			REWARD4_COUNT			: (typeof p_reward_item_list[3] === 'undefined') ? 0 : p_reward_item_list[3].reward_count,
			REWARD5_TYPE			: (typeof p_reward_item_list[4] === 'undefined') ? 0 : p_reward_item_list[4].reward_type,
			REWARD5_ITEM_ID			: (typeof p_reward_item_list[4] === 'undefined') ? 0 : p_reward_item_list[4].reward_item_id,
			REWARD5_COUNT			: (typeof p_reward_item_list[4] === 'undefined') ? 0 : p_reward_item_list[4].reward_count,
			REG_DATE				: Timer.inst.GetNowByStrDate()
		})
		.then(function (p_ret_mail) {
			console.log('mail insert', p_ret_mail.dataValues.MAIL_ID);
		})
		.catch(function (p_error) {
			logger.error('UUID :', p_uuid, 'Error SendMail', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SendTextMail = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_uuid, p_subject, p_contents) {
		// 메일 삭제
		DeleteOverCountMail(p_uuid);

		// GT_MAIL isnert
		GTMgr.inst.GetGTMail().create({
			UUID					: p_uuid,
			MAIL_SENDER				: p_user.uuid,
			MAIL_TYPE				: 'TEXT',
			MAIL_SUBJECT			: p_subject,
			MAIL_CONTENTS			: p_contents,
			REG_DATE				: Timer.inst.GetNowByStrDate()
		})
		.then(function (p_ret_mail) {
			// console.log('mail insert', p_ret_mail);
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SendTextMail - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 레이드 스테이지 클리어 우편 보내기
	inst.SendRaidStageClearReward = function(p_user, p_ack_cmd, p_ack_packet, p_guild_id, p_chapter_id, p_stage_id) {
		logger.info('MailMgr - SendRaidStageClearReward - guild_id : %d, chapter_id : %d, stage_id : %d', p_guild_id, p_chapter_id, p_stage_id);

		// IS_REWARD update
		// 스테이지에 참여한 유저의 데미지 랭크를 구해서 보내주려고 했는데...
		// 한번에 길드원 만큼 메일을 쏘네....우선 그렇게 하고 수정은 로그인 할때 받게 해보자

		GTMgr.inst.GetGTGuildRaidParicipant().findAll({
			where : { GUILD_ID : p_guild_id, CHAPTER_ID : p_chapter_id, STAGE_ID : p_stage_id, EXIST_YN : true },
			order : "DAMAGE DESC"
		})
		.then(function (p_ret_guild_member) {
			// console.log('p_ret_guild_member', p_ret_guild_member);
			for ( var cnt in p_ret_guild_member ) {
				(function (cnt) {
					var data_member = p_ret_guild_member[cnt].dataValues;
					console.log('Guild Raid Member %d -', cnt, data_member.UUID);

					var rank = parseInt(cnt) + 1;
					var rank_reward = BaseGuild.inst.GetStageRankReward(p_stage_id, rank);
					// console.log('stage_id: %d, rank: %d, rank_reward', p_stage_id, rank, rank_reward);
					if ( typeof rank_reward !== 'undefined' ) {
						var value_list = [];
						if (rank_reward.mail_string_id == DefineValues.inst.MailStringGuildRaidStageRankReward1) {
							// {0} 스테이지이름 {1} 보스이름  {2} 누적데미지량  {3} 누적데미지 등수 {4}보상 등수
							value_list.push(p_stage_id);
							value_list.push(p_stage_id);
							value_list.push(data_member.DAMAGE);
							value_list.push(rank_reward.rank_min);
							value_list.push(rank);
						}
						else if ( rank_reward.mail_string_id == DefineValues.inst.MailStringGuildRaidStageRankReward2 ) {
							// {0} 스테이지이름 {1} 보스이름  {2} 누적데미지량  {3} 누적데미지 등수 {4}~{5}속해있는 보상등수
							value_list.push(p_stage_id);
							value_list.push(p_stage_id);
							value_list.push(data_member.DAMAGE);
							value_list.push(rank);
							value_list.push(rank_reward.rank_min);
							value_list.push(rank_reward.rank_max);
						}

						var make_value_list = null;
						for ( var value_cnt in value_list ) {
							make_value_list = (value_cnt == 0) ? value_list[value_cnt] : make_value_list + ',' + value_list[value_cnt];
						}

						// console.log('stage make_value_list', make_value_list);

						// 우편 보상
						var mail_type = 'SYSTEM';
						var sender = '';
						inst.SendMail(data_member.UUID, sender, mail_type, rank_reward.mail_string_id, make_value_list, '', '', rank_reward.reward_list);

					} else {
						logger.error('Error - rank_reward is undefined', 'stage_id', p_stage_id, 'rank', rank);
					}
				})(cnt);
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SendRaidStageClearReward');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SendRaidChapterClearReward = function(p_user, p_ack_cmd, p_ack_packet, p_guild_id, p_chapter_id) {
		console.log('MailMgr - SendRaidChapterClearReward');

		mkDB.inst.GetSequelize().query('select sum(A.DAMAGE) as DAMAGE \
								, B.NICK as NICK \
								, B.USER_LEVEL as USER_LEVEL \
								, B.ICON as ICON \
								from GT_GUILD_RAID_PARTICIPANTs as A \
								left join GT_USERs as B on A.UUID = B.UUID \
							where A.GUILD_ID = ? and A.EXIST_YN = true \
							group by A.UUID order by DAMAGE DESC',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_guild_id ]
		)
		.then(function (p_ret_guild_raid_chapter_damage) {
			// console.log('p_ret_guild_raid_chapter_damage', p_ret_guild_raid_chapter_damage);
			for ( var cnt in p_ret_guild_raid_chapter_damage ) {
				(function (cnt) {
					var data_member = p_ret_guild_raid_chapter_damage[cnt];
					// console.log('data_member - ', data_member);
					var rank = parseInt(cnt) + 1;
					var rank_reward = BaseGuild.inst.GetChapterRankReward(p_chapter_id, rank);
					// console.log('chapter_id : %d, rank : %d, rank_reward', p_chapter_id, rank, rank_reward);
					if ( typeof rank_reward !== 'undefined' ) {						
						var value_list = [];
						if (rank_reward.mail_string_id == DefineValues.inst.MailStringGuildRaidChapterRankReward1) {
							// 축하합니다! 레이드 {0}챕터를 모두 클리어 하셨습니다. \n총 누적 데미지량  : {1}\n누적 기여도 등수  : {2}\n {0}챕터를 모두 클리어 하여, 챕터 기여도 등수인 {3}위의 보상이 지급되었습니다.
							// {0}  챕터이름 {1} 누적데미지량  {2} 누적데미지 등수 {3}보상 등수
							value_list.push(p_chapter_id);
							value_list.push(data_member.DAMAGE);
							value_list.push(rank_reward.rank_min);
							value_list.push(rank);
						}
						else if ( rank_reward.mail_string_id == DefineValues.inst.MailStringGuildRaidChapterRankReward2 ) {
							// 축하합니다! 레이드 {0}챕터를 모두 클리어 하셨습니다. \n총 누적 데미지량  : {1}\n누적 기여도 등수  : {2}\n {0}챕터를 모두 클리어 하여, 챕터 기여도 등수인 ({3}위~{4}위)위의 보상이 지급되었습니다.
							// {0}  챕터이름 {1} 누적데미지량  {2} 누적데미지 등수 {3}~{4}속해있는 보상 등수 
							value_list.push(p_chapter_id);
							value_list.push(data_member.DAMAGE);
							value_list.push(rank);
							value_list.push(rank_reward.rank_min);
							value_list.push(rank_reward.rank_max);
						}

						var make_value_list = null;
						for ( var value_cnt in value_list ) {
							make_value_list = (value_cnt == 0) ? value_list[value_cnt] : make_value_list + ',' + value_list[value_cnt];
						}

						// console.log('chapter make_value_list', make_value_list);

						// 우편 보상
						var mail_type = 'SYSTEM';
						var sender = '';
						inst.SendMail(data_member.UUID, sender, mail_type, rank_reward.mail_string_id, make_value_list, '', '', rank_reward.reward_list);
					}
				})(cnt);
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error SendRaidChapterClearReward - 1');
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;