/********************************************************************
Title : pvp info
Date : 2017.02.27
Update : 2017.04.07
Desc : pvp 정보 전달. 
writer: dongsu
********************************************************************/

var LoadPVP	= require('../../DB/GTLoad/LoadGTPVP.js');
var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqPvpRecord = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqPvpRecord -', p_user.uuid, p_recv);

		var recv_league_id		= parseInt(p_recv.league_id);

		LoadPVP.inst.GetRecord(p_user.uuid)
		.then( values => {
			values.map(row => {

				let record_data = row.dataValues;
				let record_info = new PacketCommonData.PvpRecord();
				console.log('확인용 - row : ', record_data);
				record_info.battle_result 	= record_data.BATTLE_RESULT;
				record_info.user_level	= record_data.TARGET_USER_LEVEL;
				record_info.user_icon	= record_data.TARGET_ICON;
				record_info.user_nick	= record_data.TARGET_NICK;
				record_info.battle_date 	= Timer.inst.GetUnixTime(record_data.REG_DATE);
				record_info.earn_pvp_point 	= record_data.DELTA_POINT;
				record_info.battle_power 	= record_data.TARGET_BATTLE_POWER;

				let slot1_hero 			= new PacketCommonData.MatchHero();
				slot1_hero.hero_id 		= record_data.TARGET_HERO_SLOT1_HERO_ID;
				slot1_hero.hero_level 	= record_data.TARGET_HERO_SLOT1_HERO_LEVEL;
				slot1_hero.reinforce_step 	= record_data.TARGET_HERO_SLOT1_HERO_REINFORCE_STEP;
				slot1_hero.evolution_step 	= record_data.TARGET_HERO_SLOT1_HERO_EVOLUTION_STEP;
				slot1_hero.slot_num 		= 1;
				record_info.slot_info.push(slot1_hero);

				let slot2_hero 			= new PacketCommonData.MatchHero();
				slot2_hero.hero_id 		= record_data.TARGET_HERO_SLOT2_HERO_ID;
				slot2_hero.hero_level 	= record_data.TARGET_HERO_SLOT2_HERO_LEVEL;
				slot2_hero.reinforce_step 	= record_data.TARGET_HERO_SLOT2_HERO_REINFORCE_STEP;
				slot2_hero.evolution_step 	= record_data.TARGET_HERO_SLOT2_HERO_EVOLUTION_STEP;
				slot2_hero.slot_num 		= 2;
				record_info.slot_info.push(slot2_hero);

				let slot3_hero 			= new PacketCommonData.MatchHero();
				slot3_hero.hero_id 		= record_data.TARGET_HERO_SLOT3_HERO_ID;
				slot3_hero.hero_level 	= record_data.TARGET_HERO_SLOT3_HERO_LEVEL;
				slot3_hero.reinforce_step 	= record_data.TARGET_HERO_SLOT3_HERO_REINFORCE_STEP;
				slot3_hero.evolution_step 	= record_data.TARGET_HERO_SLOT3_HERO_EVOLUTION_STEP;
				slot3_hero.slot_num 		= 3;
				record_info.slot_info.push(slot3_hero);

				let slot4_hero 			= new PacketCommonData.MatchHero();
				slot4_hero.hero_id 		= record_data.TARGET_HERO_SLOT4_HERO_ID;
				slot4_hero.hero_level 	= record_data.TARGET_HERO_SLOT4_HERO_LEVEL;
				slot4_hero.reinforce_step 	= record_data.TARGET_HERO_SLOT4_HERO_REINFORCE_STEP;
				slot4_hero.evolution_step 	= record_data.TARGET_HERO_SLOT4_HERO_EVOLUTION_STEP;
				slot4_hero.slot_num 		= 4;
				record_info.slot_info.push(slot4_hero);

				p_ack_packet.pvp_record_list.push(record_info);
			})

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		})
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;