/********************************************************************
Title : DuckAccount
Date : 2016.05.23
Update : 2017.04.18
Desc : 테스트 패킷을 관리 - 계정
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var GTMgr = require('../../DB/GTMgr.js');
var UserMgr = require('../../Data/Game/UserMgr.js');

var LoadGTUser	= require('../../DB/GTLoad/LoadGTUser.js');
var SetGTUser	= require('../../DB/GTSet/SetGTUser.js');

var BaseExpRe = require('../../Data/Base/BaseExpRe.js');
var BaseLevelUnlock = require('../../Data/Base/BaseLevelUnlock.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');
var moment = require('moment');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 서버 메세지
	inst.ReqServerMsg = function(p_socket, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('recv - ReqServerMsg -', p_recv);

		p_ack_packet.server_msg = p_recv.msg;
		p_evt_packet.server_msg = p_recv.msg;

		UserMgr.inst.GetAllUser().forEach(function(value, key) {
			// console.log('key : %d, socket :', key, value.GetSocket());
			if ( value.GetSocket().connected == true ) {
				value.GetSocket().emit(p_evt_cmd, JSON.stringify(p_evt_packet));
			}
		});

		p_socket.emit(p_ack_cmd, JSON.stringify(p_ack_packet));
	}

	//------------------------------------------------------------------------------------------------------------------
	// 계정 레벨
	inst.ReqAccountLevel = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqAccountLevel -', p_uuid, p_recv);

		let target_level = parseInt(p_recv.account_level);

		if ( target_level > BaseExpRe.inst.max_account_level )
			target_level = BaseExpRe.inst.max_account_level;

		let base_exp = BaseExpRe.inst.GetAccountExp(target_level);
		if ( typeof base_exp === 'undefined' ) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find BaseExp', target_level);
			return;
		}

		return new Promise(function (resolve, reject) {
			LoadGTUser.inst.SelectUser(p_uuid)
			.then(value => {
				let ret_user = value;

				if ( ret_user == null )
					throw ([ PacketRet.inst.retFail(), 'Not Find User in GT_USER', p_uuid ]);

				if ( ret_user.dataValues.USER_LEVEL == target_level) {
					resolve(ret_user);
				} else {
					let base_unlock = BaseLevelUnlock.inst.GetLevelUnlock(base_exp.level);
					
					if ( typeof base_unlock === 'undefined' )
						throw ([ PacketRet.inst.retFail(), 'Not Exist LevelUnlock In Base level', levelup.level ]);

					// use account_buff
					let old_level = ret_user.dataValues.USER_LEVEL;

					ret_user['USER_LEVEL'] = base_exp.level;

					// 1. MAX 스테미너 증가
					ret_user['MAX_STAMINA'] = base_unlock.max_stamina;
					// ret_user['LAST_STAMINA_CHANGE_DATE'] = Timer.inst.GetNowByStrDate();

					// 2. 스테미너 회복
					ret_user['STAMINA'] = ret_user.dataValues.STAMINA + base_unlock.recovery_stamina;

					// 3. 계정 버프 포인트 계산
					if ( base_unlock.open_accountbuff == true ) {
						let ret_buff_point = ( base_exp.level - old_level ) * DefineValues.inst.AccountBuffPoint;

						console.log('ret_buff_point : %d', ret_buff_point);

						ret_user['ACCOUNT_BUFF_POINT'] = ret_user.dataValues.ACCOUNT_BUFF_POINT + ret_buff_point;
					}

					ret_user['USER_EXP'] = base_exp.total_exp;

					// start transaction
					mkDB.inst.GetSequelize().transaction(function (transaction) {
						// console.log('ProcessTransaction');
						let t = transaction;

						return ret_user.save({ transaction : t })
						.then(p_ret_user_update => {
							t.commit();
							resolve(p_ret_user_update);
						}).catch(p_error => {
							if (t)
								t.rollback();

							reject(p_error);
						});
					});
				}
			})
			.catch(p_error => { reject(p_error); });
		})
		.then(value => {
			// console.log('value', value);
			let ret_user = value;

			p_ack_packet.account_level	= ret_user.USER_LEVEL;
			p_ack_packet.account_exp	= ret_user.USER_EXP;
			p_ack_packet.stamina		= ret_user.STAMINA;

			Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});

		// var account_exp = parseInt(p_recv.account_exp);

		// // GT_USER select
		// GTMgr.inst.GetGTUser().find({
		// 	where : { UUID : p_uuid, EXIST_YN : true }
		// })
		// .then(function (p_ret_user_find) {
		// 	// query select join
		// 	mkDB.inst.GetSequelize().query('select A.TARGET_LEVEL, B.MAX_STAMINA from BT_EXPs A \
		// 									left join BT_LEVEL_UNLOCKs B on A.TARGET_LEVEL = B.TARGET_LEVEL \
		// 									where A.ACCOUNT_TOTAL_EXP <= ? order by A.TARGET_LEVEL desc limit 1;',
		// 		null,
		// 		{ raw : true, type : 'SELECT' },
		// 		[ account_exp ]
		// 	)
		// 	.then(function (p_ret_exp) {
		// 		console.log('p_ret_exp', p_ret_exp);

		// 		var account_level	= p_ret_exp[0].TARGET_LEVEL;
		// 		var max_stamina		= p_ret_exp[0].MAX_STAMINA;

		// 		if ( p_ret_user_find.dataValues.USER_LEVEL == account_level ) {
		// 			p_ack_packet.account_level	= p_ret_user_find.dataValues.USER_LEVEL;
		// 			p_ack_packet.account_exp	= p_ret_user_find.dataValues.USER_EXP;
		// 			p_ack_packet.stamina		= p_ret_user_find.dataValues.STAMINA;

		// 			Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
		// 			return;
		// 		}

		// 		if ( Object.keys(p_ret_exp).length <= 0 ) {
		// 			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'No BT Exp');
		// 			return;
		// 		}
				
		// 		// query update
		// 		mkDB.inst.GetSequelize().query('update GT_USERs set USER_LEVEL = ?, USER_EXP = ?, STAMINA = ?, MAX_STAMINA = ? where UUID = ? and EXIST_YN = true;',
		// 			null,
		// 			{ raw : true, type : 'UPDATE' },
		// 			[ account_level, account_exp, max_stamina, max_stamina, p_uuid ]
		// 		)
		// 		.then(function (p_ret_user_update) {
		// 			console.log('p_ret_user_update', p_ret_user_update);
					
		// 			// call select
		// 			mkDB.inst.GetSequelize().query('select * from GT_USERs where UUID = ? and EXIST_YN = true;',
		// 				null,
		// 				{ raw : true, type : 'SELECT' },
		// 				[ p_uuid ]
		// 			)
		// 			.then(function (p_ret_user) {
		// 				if ( Object.keys(p_ret_user).length > 0 ) {
		// 					p_ack_packet.account_level	= p_ret_user[0].USER_LEVEL;
		// 					p_ack_packet.account_exp	= p_ret_user[0].USER_EXP;
		// 					p_ack_packet.stamina		= p_ret_user[0].STAMINA;
		// 				} else {
		// 					p_ack_packet.account_level	= 0;
		// 					p_ack_packet.account_exp	= 0;
		// 					p_ack_packet.stamina		= 0;

		// 					p_evt_packet.account_level	= 0;
		// 					p_evt_packet.account_exp	= 0;
		// 					p_evt_packet.stamina		= 0;
		// 				}

		// 				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
		// 			})
		// 			.catch(function (p_error) {
		// 				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqAccountLevel - 4');
		// 			});
		// 		})
		// 		.catch(function (p_error) {
		// 			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqAccountLevel - 3');
		// 		});
		// 	})
		// 	.catch(function (p_error) {
		// 		Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqAccountLevel - 2');
		// 	});
		// })
		// .catch(function (p_error) {
		// 	Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqAccountLevel - 1');
		// });
	}

	//------------------------------------------------------------------------------------------------------------------
	// 계정 버프
	inst.ReqAccountBuff = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqAccountBuff -', p_uuid, p_recv);

		var account_buff_level = parseInt(p_recv.account_buff_level);

		// query
		mkDB.inst.GetSequelize().query('select A.* from BT_ACCOUNT_BUFF_BASEs A \
										left join GT_USERs B on A.NEED_ACCOUNT_LEVEL <= B.USER_LEVEL \
										where B.UUID = ? \
										order by ACCOUNT_BUFF_ID;',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_uuid ]
		)
		.then(function (p_ret_bt_account_buff) {
			if ( Object.keys(p_ret_bt_account_buff).length <= 0 ) {
				p_ack_packet.account_buff_list	= null;
				p_evt_packet.account_skill_level= 0;

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
				return;
			}

			for ( var cnt in p_ret_bt_account_buff ) {
				(function (cnt) {
					if (account_buff_level > p_ret_bt_account_buff[cnt].MAX_LEVEL) {
						account_buff_level = p_ret_bt_account_buff[cnt].MAX_LEVEL;
					}
					
					// GT_ACCOUNT_BUFF select
					GTMgr.inst.GetGTAccountBuff().find({
						where : { UUID : p_uuid, ACCOUNT_BUFF_ID : p_ret_bt_account_buff[cnt].ACCOUNT_BUFF_ID, EXIST_YN : true }
					})
					.then(function (p_ret_user_account_buff) {
						if ( p_ret_user_account_buff == null ) {
							// 계정 버프 레벨 조건 확인
							if ( p_ret_bt_account_buff[cnt].NEED_ACCOUNT_BUFF_LEVEL == 0 || account_buff_level >= p_ret_bt_account_buff[cnt].NEED_ACCOUNT_BUFF_LEVEL ) {
								// GT_ACCOUNT_BUFF insert
								GTMgr.inst.GetGTAccountBuff().create({
									UUID				: p_uuid,
									ACCOUNT_BUFF_ID		: p_ret_bt_account_buff[cnt].ACCOUNT_BUFF_ID,
									ACCOUNT_BUFF_LEVEL	: account_buff_level,
									REG_DATE			: moment().format('YYYY-MM-DD HH:mm:ss')
								})
								.then(function (p_ret_account_buff_insert) {
									logger.info('ReqAccountBuff insert account_buff', p_ret_account_buff_insert.dataValues.ACCOUNT_BUFF_ID, 'level', p_ret_account_buff_insert.dataValues.ACCOUNT_BUFF_LEVEL);
								})
								.catch(function (p_error) {
									Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
								});
							}
						} else {
							// console.log('account_buff_level: %d, need_account_buff_level: %d', account_buff_level, p_ret_bt_account_buff[cnt].NEED_ACCOUNT_BUFF_LEVEL);
							if ( p_ret_bt_account_buff[cnt].NEED_ACCOUNT_BUFF_LEVEL == 0 || account_buff_level >= p_ret_bt_account_buff[cnt].NEED_ACCOUNT_BUFF_LEVEL ) {
								// GT_ACCOUNT_BUFF update
								p_ret_user_account_buff['ACCOUNT_BUFF_LEVEL'] = account_buff_level;
							} else {
								p_ret_user_account_buff['EXIST_YN'] = false;
							}

							p_ret_user_account_buff.save()
							.then(function (p_ret_account_buff_update) {
								logger.info('ReqAccountBuff update account_buff', p_ret_account_buff_update.dataValues.ACCOUNT_BUFF_ID, 'level', p_ret_account_buff_update.dataValues.ACCOUNT_BUFF_LEVEL, 'exist_yn', p_ret_account_buff_update.dataValues.EXIST_YN);
							})
							.catch(function (p_error) {
								Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
							});
						}
					})
					.catch(function (p_error) {
						Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
					});

					// Make packet
					var account_buff = new PacketCommonData.AccountBuff();
					if ( p_ret_bt_account_buff[cnt].NEED_ACCOUNT_BUFF_LEVEL == 0 || account_buff_level >= p_ret_bt_account_buff[cnt].NEED_ACCOUNT_BUFF_LEVEL ) {
						account_buff.account_buff_id	= p_ret_bt_account_buff[cnt].ACCOUNT_BUFF_ID;
						account_buff.account_buff_level	= account_buff_level;

						p_ack_packet.account_buff_list.push(account_buff);
						p_evt_packet.account_buff_list.push(account_buff);
					}
				})(cnt);
			}

			Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqAccountBuff');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// Vip
	inst.ReqVip = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqVip -', p_uuid, p_recv);

		var accum_cash = parseInt(p_recv.accum_cash);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER UUID', p_uuid);
				return;
			}
		
			// call ad-hoc query select
			mkDB.inst.GetSequelize().query('select * from BT_VIPs where ACCUM_CASH <= ? order by VIP_ID desc limit 1;',
				null,
				{ raw : true, type : 'SELECT' },
				[ accum_cash ]
			)
			.then(function (p_ret_vip) {
				if ( Object.keys(p_ret_vip).length <= 0 ) {
					Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find BT_VIP Accum Cash', accum_cash);
					return;
				}

				var step					= p_ret_vip[0].STEP;
				var max_buy_gold_count		= p_ret_vip[0].MAX_BUY_GOLD_COUNT;
				var max_buy_stamina_count	= p_ret_vip[0].MAX_BUY_STAMINA_COUNT;
				var max_buy_add_attend_count= p_ret_vip[0].MAX_BUY_ADD_ATTEND_COUNT;
				var skill_point_charge_time	= p_ret_vip[0].SKILL_POINT_CHARGE_TIME;

				// GT_USER update
				p_ret_user.updateAttributes({
					VIP_STEP : step,
					ACCUM_BUY_CASH : accum_cash

				})
				.then(function (p_ret_user_update) {
					var update_user_data = p_ret_user_update.dataValues;

					p_ack_packet.vip_step					= update_user_data.VIP_STEP;
					p_ack_packet.accum_cash					= update_user_data.ACCUM_BUY_CASH;
					p_ack_packet.max_buy_gold_count			= p_ret_vip[0].MAX_BUY_GOLD_COUNT;
					p_ack_packet.max_buy_stamina_count		= p_ret_vip[0].MAX_BUY_STAMINA_COUNT;
					p_ack_packet.max_buy_add_attend_count	= p_ret_vip[0].MAX_BUY_ADD_ATTEND_COUNT;
					p_ack_packet.skill_point_charge_time	= p_ret_vip[0].SKILL_POINT_CHARGE_TIME;

					p_evt_packet.vip_step					= update_user_data.VIP_STEP;
					p_evt_packet.accum_cash					= update_user_data.ACCUM_BUY_CASH;
					p_evt_packet.max_buy_gold_count			= p_ret_vip[0].MAX_BUY_GOLD_COUNT;
					p_evt_packet.max_buy_stamina_count		= p_ret_vip[0].MAX_BUY_STAMINA_COUNT;
					p_evt_packet.max_buy_add_attend_count	= p_ret_vip[0].MAX_BUY_ADD_ATTEND_COUNT;
					p_evt_packet.skill_point_charge_time	= p_ret_vip[0].SKILL_POINT_CHARGE_TIME;

					Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
				})
				.catch(function (p_error) {
					Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqVip - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqVip - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqVip - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// Wallet
	inst.ReqWallet = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet, p_wallet_type)  {
		logger.debug('UUID : %d, recv - ReqWallet -', p_uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			var point = 0;

			switch(p_wallet_type) {
				case DefineValues.inst.GoldReward: {
						point = parseInt(p_recv.gold);
						p_ret_user['GOLD'] = point;
					}
					break;

				case DefineValues.inst.CashReward: {
						point = parseInt(p_recv.cash);
						p_ret_user['CASH'] = point;
					}
					break;

				case DefineValues.inst.HonorPointReward: {
						point = parseInt(p_recv.honor_point);
						p_ret_user['POINT_HONOR'] = point;
					}
					break;

				case DefineValues.inst.AlliancePointReward: {
						point = parseInt(p_recv.alliance_point);
						p_ret_user['POINT_ALLIANCE'] = point;
					}
					break;

				case DefineValues.inst.ChallengePointReward: {
						point = parseInt(p_recv.challenge_point);
						p_ret_user['POINT_CHALLENGE'] = point;
					}
					break;
			}

			if ( point == 0 ) {
				p_ack_packet.msg = "No type value: " + p_wallet_type;
				Sender.inst.toDuck(p_socket, 0, p_ack_cmd, p_ack_packet, null, null);
				return;
			}

			// GT_USER update
			p_ret_user.save()
			.then(function (p_ret_user_update) {
				switch(p_wallet_type) {
					case DefineValues.inst.GoldReward:
						p_ack_packet.total_gold = p_ret_user_update.dataValues.GOLD;
						p_evt_packet.total_gold = p_ret_user_update.dataValues.GOLD;
						break;

					case DefineValues.inst.CashReward:
						p_ack_packet.total_cash = p_ret_user_update.dataValues.CASH;
						p_evt_packet.total_cash = p_ret_user_update.dataValues.CASH;
						break;

					case DefineValues.inst.HonorPointReward:
						p_ack_packet.total_honor_point = p_ret_user_update.dataValues.POINT_HONOR;
						p_evt_packet.total_honor_point = p_ret_user_update.dataValues.POINT_HONOR;
						break;

					case DefineValues.inst.AlliancePointReward:
						p_ack_packet.total_alliance_point = p_ret_user_update.dataValues.POINT_ALLIANCE;
						p_evt_packet.total_alliance_point = p_ret_user_update.dataValues.POINT_ALLIANCE;
						break;

					case DefineValues.inst.ChallengePointReward:
						p_ack_packet.total_challenge_point = p_ret_user_update.dataValues.POINT_CHALLENGE;
						p_evt_packet.total_challenge_point = p_ret_user_update.dataValues.POINT_CHALLENGE;
						break;
				}

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqWallet - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqWallet - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// DailyContents
	inst.ReqDailyContents = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqDailyContents - ', p_uuid, p_recv);

		// GT_GACHA update
		GTMgr.inst.GetGTGacha().update(
			{ DAILY_GACHA_COUNT : 0 }, { UUID : p_uuid, EXIST_YN : true }
		)
		.then(function (p_ret_gacha_update) {
			logger.info('====================== DailyComplete Gacha !!');

			// GT_DAILY_CONTENTS update
			GTMgr.inst.GetGTDailyContents().update({ 
					BUY_STAMINA_COUNT					: 0,
					BUY_GOLD_COUNT						: 0,
					BUY_ADD_ATTEND_COUNT				: 0,
					SHOP_RESET_COUNT					: 0,	// 상점 리셋 수
					GUILD_POINT_DONATION_COUNT			: DefineValues.inst.GuilddonateCount,	// 길드 포인트 기부
					GUILD_RAID_BATTLE_COUNT				: DefineValues.inst.GuildRaidPlayCount,		// 길드 레이드 참여 수
					FRIEND_REQUEST_COUNT				: DefineValues.inst.FriendOneDayRequestCount,	// 친구 요청 수
					FRIEND_DELETE_COUNT					: DefineValues.inst.Friend_DeleteMax,	// 친구 삭제 수
					EXEC_WEEKLY_DUNGEON_PLAY_COUNT		: 0,		// 요일 던전 플레이 수
					PVP_GAIN_HONOR_POINT 				: 0,
					PVP_PLAY_COUNT 						: 0
				},
				{ UUID : p_uuid, EXIST_YN : true }
			)
			.then(function (p_ret_daily_contents_update) {
				logger.info('====================== DailyComplete DailyContents !!');

				// GT_GACHA select
				GTMgr.inst.GetGTGacha().findAll({
					where : { UUID : p_uuid, EXIST_YN : true }
				})
				.then(function (p_ret_gacha) {
					for (var cnt in p_ret_gacha) {
						// console.log('p_ret_gacha', p_ret_gacha[cnt].dataValues);
						var gacha_id			= p_ret_gacha[cnt].dataValues.GACHA_ID;
						var daily_gacha_count	= p_ret_gacha[cnt].dataValues.DAILY_GACHA_COUNT;
						var total_gacha_count	= p_ret_gacha[cnt].dataValues.TOTAL_GACHA_COUNT;
						var last_gacha_date		= p_ret_gacha[cnt].dataValues.LAST_GACHA_DATE;

						var gacha_info = new PacketCommonData.GachaInfo();
						gacha_info.gacha_id					= gacha_id;
						gacha_info.daily_gacha_count		= daily_gacha_count;
						gacha_info.total_gacha_count		= total_gacha_count;
						gacha_info.free_gacha_remain_time	= 0;

						p_ack_packet.gacha_info_list.push(gacha_info);
						p_evt_packet.gacha_info_list.push(gacha_info);
					}
					
					// GT_DAILY_CONTENTS select
					GTMgr.inst.GetGTDailyContents().find({
						where : { UUID : p_uuid, EXIST_YN : true }
					})
					.then(function (p_ret_daily_contents) {
						p_ack_packet.weekly_dungeon_count		= p_ret_daily_contents.dataValues.EXEC_WEEKLY_DUNGEON_PLAY_COUNT;
						p_ack_packet.shop_reset_count			= p_ret_daily_contents.dataValues.SHOP_RESET_COUNT;
						p_ack_packet.gold_buy_count			= p_ret_daily_contents.dataValues.BUY_GOLD_COUNT;
						p_ack_packet.stamina_buy_count			= p_ret_daily_contents.dataValues.BUY_STAMINA_COUNT;
						p_ack_packet.guild_raid_battle_count		= p_ret_daily_contents.dataValues.GUILD_RAID_BATTLE_COUNT;
						p_ack_packet.weekly_dungeon_count		= p_ret_daily_contents.dataValues.EXEC_WEEKLY_DUNGEON_PLAY_COUNT;
						
						p_evt_packet.shop_reset_count			= p_ret_daily_contents.dataValues.SHOP_RESET_COUNT;
						p_evt_packet.gold_buy_count			= p_ret_daily_contents.dataValues.BUY_GOLD_COUNT;
						p_evt_packet.stamina_buy_count			= p_ret_daily_contents.dataValues.BUY_STAMINA_COUNT;
						p_evt_packet.guild_raid_battle_count		= p_ret_daily_contents.dataValues.GUILD_RAID_BATTLE_COUNT;

						Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
					})
					.catch(function (p_error) {
						Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqDailyContents - 6');
					});					
				})
				.catch(function(p_error) {
					Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqDailyContents - 3');
				});
			})
			.catch(function(p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqDailyContents - 2');
			});
		})
		.catch(function(p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqDailyContents - 1');
		});	
	}

	//------------------------------------------------------------------------------------------------------------------
	// GuildPoint
	inst.ReqGuildPoint = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqGuildPoint - ', p_uuid, p_recv);

		let recv_guild_point = parseInt(p_recv.guild_point);

		LoadGTUser.inst.SelectUser(p_uuid)
		.then(p_ret_user => {
			if ( p_ret_user == null ) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER UUID', p_uuid);
				return;
			}

			// GT_GUILD select
			return GTMgr.inst.GetGTGuildMember().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			});
		})
		.then(p_ret_member => {
			if ( p_ret_member == null ) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Guild Member In GT_GUILD_MEMBER UUID', p_uuid);
				return;
			}

			return GTMgr.inst.GetGTGuild().find({
				where : { GUILD_ID : p_ret_member.dataValues.GUILD_ID, EXIST_YN : true }
			});
		})
		.then(p_ret_guild => {
			// console.log('p_ret_guild', p_ret_guild.dataValues);
			return p_ret_guild.updateAttributes({
				GUILD_POINT : recv_guild_point
			});
		})
		.then(p_ret_guild => {
			p_ack_packet.guild_point = p_ret_guild.dataValues.GUILD_POINT;
			p_evt_packet.guild_point = p_ret_guild.dataValues.GUILD_POINT;

			Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
		})
		.catch(p_error => {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqGuildPoint - 1');
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;