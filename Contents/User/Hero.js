/********************************************************************
Title : Hero
Date : 2016.07.14
Update : 2017.03.15
Desc : 로그인 정보 - 영웅
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};
	//------------------------------------------------------------------------------------------------------------------
	inst.ReqHero = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqHero -', p_user.uuid, p_recv);

		var GetHero = function() {
			return new Promise(function (resolve, reject) {
				console.log('1. GetHero')

				// GT_HERO select
				GTMgr.inst.GetGTHero().findAll({
					where : { UUID : p_user.uuid, EXIST_YN : true },
					order : 'HERO_ID'
				})
				.then(p_hero_list => { resolve(p_hero_list); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var GetEquip = function() {
			return new Promise(function (resolve, reject) {
				console.log('2. GetEquip');

				// GT_EQUIPMENT select
				GTMgr.inst.GetGTEquipmentItem().findAll({
					where : { UUID : p_user.uuid, EXIST_YN : true },
					order : 'HERO_ID, SLOT_ID'
				})
				.then(p_equip_list => { resolve(p_equip_list); })
				.catch(p_error => { reject(p_error); });
			});
		}

		var SendPacket = function() {
			console.log('All done! SendPacket');

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		}

		// for mission
		var achieve_hero_level = 0;

		// Promise GO!
		GetHero()
		.then(p_hero_list => {
			for ( let cnt in p_hero_list ) {
				(function (cnt) {
					let data = p_hero_list[cnt];

					achieve_hero_level = ( achieve_hero_level < data.HERO_LEVEL ) ? data.HERO_LEVEL : achieve_hero_level;

					// Packet
					let packet_hero				= new PacketCommonData.HeroBase();
					packet_hero.hero_id			= data.HERO_ID;
					packet_hero.hero_level		= data.HERO_LEVEL;
					packet_hero.reinforce_step	= data.REINFORCE_STEP;
					packet_hero.evolution_step	= data.EVOLUTION_STEP;
					packet_hero.hero_exp		= data.EXP;
					packet_hero.equip_set_count	= data.EQUIP_SET_COUNT;
					packet_hero.battle_power	= 0;

					p_ack_packet.heroes.push(packet_hero);
				})(cnt);
			}
		})
		.then(GetEquip)
		.then(p_equip_list => {
			// console.log('p_equip_list', p_equip_list);
			for ( let cnt in p_equip_list ) {
				let equip_set_data = new PacketCommonData.EquipSet();

				equip_set_data.hero_id = p_equip_list[cnt].HERO_ID;
				equip_set_data.equip_set_id = p_equip_list[cnt].SLOT_ID;

				for ( let slot = DefineValues.inst.EquipSlotWeapon; slot <= DefineValues.inst.EquipSlotShoes; ++slot ) {
					let equip_slot = new PacketCommonData.EquipSlot();

					equip_slot.slot_id = slot;
					equip_slot.iuid = p_equip_list[cnt]['IUID_' + slot];

					equip_set_data.equip_slot_list.push(equip_slot);
				}

				p_ack_packet.hero_equip_list.push(equip_set_data);
			}
		})
		.then(SendPacket)
		.catch(p_error => {
			console.log('Promise Error', p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;