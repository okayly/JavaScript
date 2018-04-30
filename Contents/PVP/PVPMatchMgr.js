/********************************************************************
Title : pvp info
Date : 2017.02.27
Update : 2017.04.07
Desc : pvp 정보 전달. 
writer: dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var BaseLevelUnlock	= require('../../Data/Base/BaseLevelUnlock.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var FindMatchPlayer = function(p_uuid, p_min_ell, p_max_ell, p_except_uuids, p_limit, p_player_list) {
		return new Promise((resolve, reject) => {
			let a 		= p_uuid;
			let [b, c, d] 	= p_except_uuids;
			let unlock_level = BaseLevelUnlock.inst.GetPvPUnlockLevel();

			return  mkDB.inst.GetSequelize().query('select A.UUID, A.PVP_ELO, \
									B.NICK, B.USER_LEVEL, B.ICON, \
									C.BATTLE_POWER \
									from GT_PVPs as A \
									left join GT_USERs as B on A.UUID = B.UUID \
									left join GT_TEAMs as C on A.UUID = C.UUID and C.TEAM_ID = 7 \
									where A.DEPENSE_ELL between ? and ? and A.UUID not in (?, ?, ?, ?) \
									and B.USER_LEVEL >= ? \
									and (C.SLOT1 != 0 or C.SLOT2 != 0 or C.SLOT3 != 0 or C.SLOT4 != 0) \
									order by A.DEPENSE_ELL DESC limit ?;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_min_ell, p_max_ell, a, parseInt(b), parseInt(c), parseInt(d), unlock_level, p_limit ]
			).then(p_ret => {

				if ( p_ret != null ) {

					p_ret.map(row => { 

						let player_info 		= new PacketCommonData.MatchPlayer();
						player_info.uuid 		= row.UUID;
						player_info.user_level 	= row.USER_LEVEL;
						player_info.user_nick 	= row.NICK;
						player_info.battle_power 	= row.BATTLE_POWER;
						player_info.user_icon 	= row.ICON;
						player_info.pvp_point 	= row.PVP_ELO;
						p_player_list.set(row.UUID, player_info); 
					});

					// console.log('사이즈 -', p_player_list.size);
				}

				resolve();
			})
			.catch(p_error => { reject([p_error, 'FindMatchPlayer']) })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var GetMatchDetailInfo = function(p_player_list) {
		return new Promise((resolve, reject) => {
			
			var mapIter = p_player_list.keys();
			let a = mapIter.next().value;
			let b = mapIter.next().value;
			let c = mapIter.next().value;
			console.log('확인용 a : %d, b : %d, c : %d ', a, b, c);
			return  mkDB.inst.GetSequelize().query('select B.*, \
									case \
										when B.HERO_ID = A.SLOT1 then 1 \
										when B.HERO_ID = A.SLOT2 then 2 \
										when B.HERO_ID = A.SLOT3 then 3 \
										when B.HERO_ID = A.SLOT4 then 4 \
										else 0 \
									end as SLOT \
									from  \
									(select * from GT_TEAMs where UUID in (?, ?, ?) and TEAM_ID = 7) as A \
									left join GT_HEROes as B on A.UUID = B.UUID and B.HERO_ID in (A.SLOT1, A.SLOT2, A.SLOT3, A.SLOT4);',
				null,
				{ raw : true, type : 'SELECT' },
				[ (a != null) ? a : 0,
				  (b != null) ? b : 0,
				  (c != null) ? c : 0 ]
			).then(p_rets => {
				// console.log('확인용4 - ', p_rets);
				if ( p_rets == null ) { reject([p_error, 'GetMatchDetailInfo - 3']); }
				p_rets.map(row => {
					// console.log('확인용5 - ', row);
					let target = p_player_list.get(row.UUID);
					if ( target == undefined ) { reject([p_error, 'GetMatchDetailInfo - 2']); }

					let hero_info 			= new PacketCommonData.MatchHero();
					hero_info.hero_id 		= row.HERO_ID;
					hero_info.hero_level 		= row.HERO_LEVEL;
					hero_info.reinforce_step 	= row.REINFORCE_STEP;
					hero_info.evolution_step 	= row.EVOLUTION_STEP;
					hero_info.slot_num 		= row.SLOT;
					target.hero_list.push(hero_info);
				});

				resolve();
			})
			.catch(p_error => { reject([p_error, 'GetMatchDetailInfo - 1']) })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetMatchPlayer = function(p_user, p_stand_ell, p_range_value, p_except_uuids, p_limit_loop, temp_map) {
		return new Promise((resolve, reject) => {

			let limit_loop 	  = p_limit_loop + 1;
			let range_value = limit_loop * 60;
			let min_ell 	= p_stand_ell - p_range_value;
			let max_ell 	= p_stand_ell + p_range_value;
			let limit_line 	= 3 - temp_map.size;

			console.log('확인용. 루프 카운트 - ', limit_loop);
			console.log('확인용. range_value - ', range_value);
			console.log('확인용. min - ', min_ell);
			console.log('확인용. max - ', max_ell);
			console.log('확인용. limit_line - ', limit_line);
			FindMatchPlayer(p_user.uuid, min_ell, max_ell, p_except_uuids, limit_line, temp_map)
			.then( p_ret => {

				if ( temp_map.size >= 3 || ( temp_map.size != 0 && limit_loop > 10 )) {
					// console.log('확인용1 temp_map - ', temp_map);

					return GetMatchDetailInfo(temp_map);
				}
				else if ( limit_loop <= 10 ) {
					console.log('확인용2 - size : %d, ret_limit_line : %d', temp_map.size, limit_line);
					let temp_mapIter = temp_map.keys();
					let a = temp_mapIter.next().value;
					let b = temp_mapIter.next().value;
					let c = temp_mapIter.next().value;
					let except_list = [];
					except_list.push((p_except_uuids[0] == 0) ? ((a != null) ? a : 0) : p_except_uuids[0]);
					except_list.push((p_except_uuids[1] == 0) ? ((b != null) ? b : 0) : p_except_uuids[1]);
					except_list.push((p_except_uuids[2] == 0) ? ((c != null) ? c : 0) : p_except_uuids[2]);
					// console.log('확인용. - 제외 ', except_list);
					
					return inst.GetMatchPlayer(p_user, p_stand_ell, range_value, except_list, limit_loop, temp_map);
				}
				else {
					resolve();
				}
			})
			.then( p_ret_detail => {
				
				// console.log('호출 확인. ', limit_loop);
				resolve();
			})
			.catch(p_error => { reject([p_error, 'FindMatchPlayer']) })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;