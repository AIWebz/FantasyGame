// ===== Realm of Embers — game data =====
const CLASSES = {
  warrior: {
    name: 'Warrior', role: 'Frontline Bruiser', resource: 'Rage', weapon: 'Longsword',
    lore: 'Forged in the shield-walls of the northern marches, Warriors trust steel and stubbornness above all. They shrug off blows that would fell lesser fighters and answer with crushing strikes.',
    base: { hp: 150, mp: 40, str: 16, dex: 9, int: 5, def: 13 },
    grow: { hp: 18, mp: 4, str: 3, dex: 1, int: 0, def: 2 },
    main: 'str', colors: ['#8a8f99', '#7a1a1a', '#c9a24a'],
    skills: [
      { id: 'cleave', name: 'Cleave', lvl: 1, cost: 10, type: 'dmg', mult: 1.7, desc: 'A sweeping strike for heavy damage.' },
      { id: 'shieldwall', name: 'Shield Wall', lvl: 3, cost: 14, type: 'buff', stat: 'def', amt: 1.0, turns: 3, desc: 'Doubles defense for 3 turns.' },
      { id: 'warcry', name: 'War Cry', lvl: 5, cost: 16, type: 'buff', stat: 'atk', amt: 0.5, turns: 3, desc: '+50% attack for 3 turns.' },
      { id: 'execute', name: 'Execute', lvl: 8, cost: 24, type: 'dmg', mult: 2.4, execute: true, desc: 'Massive damage; triple vs. foes under 30% HP.' }
    ]
  },
  mage: {
    name: 'Mage', role: 'Arcane Artillery', resource: 'Mana', weapon: 'Staff',
    lore: 'Scholars of the Ember Spire, Mages bend fire and frost to their will. Fragile in body, they end battles before the enemy can close the distance.',
    base: { hp: 85, mp: 130, str: 4, dex: 9, int: 18, def: 5 },
    grow: { hp: 9, mp: 14, str: 0, dex: 1, int: 4, def: 1 },
    main: 'int', colors: ['#2a3f8a', '#6a2a9a', '#e0c070'],
    skills: [
      { id: 'fireball', name: 'Fireball', lvl: 1, cost: 14, type: 'dmg', mult: 2.1, dot: { dmg: 0.25, turns: 2, name: 'Burning' }, desc: 'Hurls fire; target burns for 2 turns.' },
      { id: 'frost', name: 'Frost Lance', lvl: 3, cost: 16, type: 'dmg', mult: 1.6, stun: 0.45, desc: 'Icy spear; 45% chance to freeze.' },
      { id: 'barrier', name: 'Arcane Barrier', lvl: 5, cost: 20, type: 'buff', stat: 'def', amt: 1.5, turns: 3, desc: 'Shimmering ward, +150% defense.' },
      { id: 'meteor', name: 'Meteor', lvl: 8, cost: 40, type: 'dmg', mult: 3.4, desc: 'Calls down a falling star.' }
    ]
  },
  ranger: {
    name: 'Ranger', role: 'Wilderness Marksman', resource: 'Focus', weapon: 'Longbow',
    lore: 'Wardens of the deep forests, Rangers read the wind and strike from afar. Their arrows rarely miss and often find the gaps in armor.',
    base: { hp: 110, mp: 70, str: 9, dex: 17, int: 8, def: 8 },
    grow: { hp: 13, mp: 6, str: 1, dex: 3, int: 1, def: 1 },
    main: 'dex', colors: ['#2e5a2a', '#6a4a22', '#b8d070'],
    skills: [
      { id: 'aimed', name: 'Aimed Shot', lvl: 1, cost: 10, type: 'dmg', mult: 1.8, critBonus: 0.35, desc: 'Careful shot, +35% crit chance.' },
      { id: 'mend', name: 'Field Dressing', lvl: 3, cost: 14, type: 'heal', mult: 0.3, desc: 'Restore 30% of max HP.' },
      { id: 'volley', name: 'Volley', lvl: 5, cost: 18, type: 'dmg', mult: 0.85, hits: 3, desc: 'Three rapid arrows.' },
      { id: 'hawk', name: "Hawk's Eye", lvl: 8, cost: 26, type: 'dmg', mult: 2.8, critBonus: 1, desc: 'A guaranteed critical shot.' }
    ]
  },
  rogue: {
    name: 'Rogue', role: 'Shadow Assassin', resource: 'Energy', weapon: 'Twin Daggers',
    lore: 'Born in the alleys of Greyhaven, Rogues fight dirty and fast. Poisoned blades and impossible reflexes make them deadly duelists.',
    base: { hp: 100, mp: 60, str: 8, dex: 18, int: 7, def: 7 },
    grow: { hp: 12, mp: 5, str: 1, dex: 4, int: 0, def: 1 },
    main: 'dex', colors: ['#2a2a30', '#5a1a3a', '#a0a0b0'],
    skills: [
      { id: 'backstab', name: 'Backstab', lvl: 1, cost: 12, type: 'dmg', mult: 1.5, critBonus: 0.5, desc: 'Strike vitals, +50% crit chance.' },
      { id: 'poison', name: 'Envenom', lvl: 3, cost: 12, type: 'dmg', mult: 0.8, dot: { dmg: 0.5, turns: 4, name: 'Poisoned' }, desc: 'Poison deals damage for 4 turns.' },
      { id: 'evade', name: 'Smoke Bomb', lvl: 5, cost: 15, type: 'buff', stat: 'evade', amt: 0.6, turns: 2, desc: '60% evasion for 2 turns.' },
      { id: 'flurry', name: 'Blade Flurry', lvl: 8, cost: 28, type: 'dmg', mult: 0.9, hits: 5, desc: 'Five lightning-fast cuts.' }
    ]
  },
  cleric: {
    name: 'Cleric', role: 'Divine Healer', resource: 'Faith', weapon: 'Mace',
    lore: 'Servants of the Dawnmother, Clerics mend wounds with prayer and smite the unholy with radiant light. The undead fear them most of all.',
    base: { hp: 115, mp: 110, str: 9, dex: 7, int: 15, def: 10 },
    grow: { hp: 13, mp: 11, str: 1, dex: 1, int: 3, def: 2 },
    main: 'int', colors: ['#e8e0c8', '#c9a24a', '#f8f0a0'],
    skills: [
      { id: 'smite', name: 'Holy Smite', lvl: 1, cost: 12, type: 'dmg', mult: 1.7, holy: true, desc: 'Radiant blow; double vs. undead.' },
      { id: 'heal', name: 'Divine Heal', lvl: 1, cost: 16, type: 'heal', mult: 0.45, desc: 'Restore 45% of max HP.' },
      { id: 'sanct', name: 'Sanctuary', lvl: 5, cost: 20, type: 'buff', stat: 'regen', amt: 0.12, turns: 4, desc: 'Regenerate 12% HP per turn.' },
      { id: 'wrath', name: 'Wrath of Dawn', lvl: 8, cost: 36, type: 'dmg', mult: 2.9, holy: true, stun: 0.3, desc: 'Blinding holy fire.' }
    ]
  },
  paladin: {
    name: 'Paladin', role: 'Holy Champion', resource: 'Zeal', weapon: 'Warhammer',
    lore: 'Knights of the Silver Oath blend plate armor with sacred power. Paladins stand between the innocent and the darkness, healing allies and crushing evil.',
    base: { hp: 135, mp: 75, str: 14, dex: 7, int: 10, def: 12 },
    grow: { hp: 16, mp: 7, str: 2, dex: 1, int: 2, def: 2 },
    main: 'str', colors: ['#c8ccd8', '#2a4a9a', '#f0d070'],
    skills: [
      { id: 'crusader', name: 'Crusader Strike', lvl: 1, cost: 10, type: 'dmg', mult: 1.6, holy: true, desc: 'Hallowed strike; double vs. undead.' },
      { id: 'layhands', name: 'Lay on Hands', lvl: 3, cost: 18, type: 'heal', mult: 0.4, desc: 'Restore 40% of max HP.' },
      { id: 'judge', name: 'Judgement', lvl: 5, cost: 18, type: 'dmg', mult: 1.4, stun: 0.5, desc: '50% chance to stun the foe.' },
      { id: 'avenger', name: 'Avenging Light', lvl: 8, cost: 32, type: 'dmg', mult: 2.6, holy: true, lifesteal: 0.4, desc: 'Heals you for 40% of damage dealt.' }
    ]
  }
};

// xp required to go from level L to L+1 — grows each level
function xpForLevel(l) { return Math.floor(100 * Math.pow(l, 1.65)); }
const MAX_LEVEL = 20;

const ENEMIES = {
  wolf: { name: 'Woodland Raider', kind: 'beast', color: '#6a6a70', hp: 45, atk: 9, def: 2, xp: 22, gold: [2, 6], lvl: 1 },
  spider: { name: 'Bog Witch', kind: 'spider', color: '#3a2a3a', hp: 55, atk: 11, def: 3, xp: 28, gold: [3, 8], lvl: 2, drops: [['silk', 0.5]] },
  goblin: { name: 'Goblin Scout', kind: 'humanoid', color: '#5a8a3a', hp: 50, atk: 10, def: 3, xp: 26, gold: [5, 12], lvl: 2, weapon: 'dagger' },
  warchief: { name: 'Grukk the Warchief', kind: 'humanoid', color: '#4a7a2a', hp: 180, atk: 16, def: 6, xp: 140, gold: [60, 90], lvl: 4, boss: true, weapon: 'axe', size: 1.2 },
  bandit: { name: 'Bandit Cutthroat', kind: 'humanoid', color: '#7a5a3a', hp: 90, atk: 17, def: 6, xp: 48, gold: [10, 22], lvl: 4, weapon: 'sword', hood: true, drops: [['ring', 0.15]] },
  archer: { name: 'Bandit Archer', kind: 'humanoid', color: '#5a4a2a', hp: 75, atk: 19, def: 4, xp: 50, gold: [10, 20], lvl: 4, weapon: 'bow', hood: true, drops: [['ring', 0.15]] },
  captain: { name: 'Captain Varrek', kind: 'humanoid', color: '#8a2a2a', hp: 320, atk: 26, def: 10, xp: 300, gold: [150, 220], lvl: 6, boss: true, weapon: 'sword', size: 1.2 },
  skeleton: { name: 'Skeleton Warrior', kind: 'skeleton', color: '#d8d0b8', hp: 130, atk: 25, def: 10, xp: 80, gold: [12, 28], lvl: 6, undead: true, weapon: 'sword', drops: [['bone', 0.6]] },
  ghoul: { name: 'Ravenous Ghoul', kind: 'humanoid', color: '#6a7a6a', hp: 150, atk: 28, def: 7, xp: 88, gold: [10, 25], lvl: 7, undead: true, drops: [['bone', 0.5]] },
  wraith: { name: 'Crypt Wraith', kind: 'wraith', color: '#7a8ab0', hp: 120, atk: 32, def: 6, xp: 95, gold: [15, 30], lvl: 7, undead: true },
  lich: { name: 'Mordrith the Acolyte', kind: 'lich', color: '#4a2a6a', hp: 560, atk: 38, def: 14, xp: 650, gold: [300, 400], lvl: 9, boss: true, undead: true, size: 1.2 },
  troll: { name: 'Mountain Troll', kind: 'troll', color: '#5a6a5a', hp: 280, atk: 40, def: 16, xp: 170, gold: [25, 50], lvl: 10, size: 1.15 },
  drake: { name: 'Ash Knight', kind: 'dragon', color: '#9a3a1a', hp: 240, atk: 46, def: 14, xp: 190, gold: [30, 60], lvl: 11, drops: [['scale', 0.55]] },
  cultist: { name: 'Ash Cultist', kind: 'humanoid', color: '#3a1a1a', hp: 200, atk: 42, def: 12, xp: 160, gold: [30, 55], lvl: 10, hood: true, weapon: 'staff' },
  ashfang: { name: 'Ashfang the Undying', kind: 'dragon', color: '#5a1a0a', hp: 1600, atk: 62, def: 22, xp: 2500, gold: [1500, 2000], lvl: 14, boss: true, size: 1.45 }
};

const ITEMS = {
  potion: { name: 'Healing Draught', type: 'consumable', heal: 0.4, price: 25, desc: 'Restores 40% HP.', rarity: 1 },
  bigpotion: { name: 'Elixir of Vigor', type: 'consumable', heal: 1, price: 90, desc: 'Fully restores HP.', rarity: 3 },
  ether: { name: 'Ether Vial', type: 'consumable', mana: 0.5, price: 30, desc: 'Restores 50% of your resource.', rarity: 2 },
  moonpetal: { name: 'Moonpetal', type: 'quest', desc: 'A glowing silver flower.', rarity: 2 },
  silk: { name: 'Witch-Thread', type: 'quest', desc: 'Enchanted thread, faintly humming.', rarity: 1 },
  ring: { name: "Elara's Signet Ring", type: 'quest', desc: 'A ring bearing a swan crest.', rarity: 3 },
  bone: { name: 'Cursed Bone', type: 'quest', desc: 'Cold to the touch.', rarity: 1 },
  scale: { name: 'Ash Sigil', type: 'quest', desc: 'A cult sigil, still warm.', rarity: 3 }
};

// Gear tiers — named per class weapon type
const WEAPON_NAMES = {
  warrior: ['Iron Longsword', 'Steel Bastard Sword', 'Runed Greatsword', 'Emberforged Claymore', 'Kingsbane'],
  mage: ['Oak Staff', 'Crystal Staff', 'Staff of Embers', 'Archmage Rod', 'Starfall Scepter'],
  ranger: ['Hunting Bow', 'Yew Longbow', 'Elven Recurve', 'Windwhisper', 'Dawnstring'],
  rogue: ['Rusty Dirks', 'Steel Stilettos', 'Venomfang Daggers', 'Shadowkiss Blades', 'Nightreaver'],
  cleric: ['Wooden Mace', 'Iron Flail', 'Blessed Morningstar', 'Sunlit Mace', 'Hand of Dawn'],
  paladin: ['Iron Warhammer', 'Steel Maul', 'Oathkeeper Hammer', 'Silver Judicator', 'Lightbringer']
};
const ARMOR_NAMES = {
  warrior: ['Leather Jerkin', 'Chainmail Hauberk', 'Steel Plate', 'Emberforged Plate', 'Aegis of Kings'],
  mage: ['Apprentice Robes', 'Silk Robes', 'Runed Vestments', 'Archmage Mantle', 'Robes of the Cosmos'],
  ranger: ['Padded Tunic', 'Studded Leather', 'Wardens Garb', 'Drakehide Armor', 'Mantle of the Wild'],
  rogue: ['Cloth Wraps', 'Dark Leathers', 'Shadow Garb', 'Nightsilk Armor', 'Veil of the Void'],
  cleric: ['Novice Habit', 'Chain Vestment', 'Templar Raiment', 'Radiant Chainmail', 'Vestments of Dawn'],
  paladin: ['Iron Breastplate', 'Knights Plate', 'Oathsworn Plate', 'Silver Aegis', 'Armor of the Silver Oath']
};
const GEAR_TIERS = [
  { atk: 3, def: 2, price: 0, lvl: 1, rarity: 1 },
  { atk: 8, def: 6, price: 120, lvl: 3, rarity: 2 },
  { atk: 15, def: 11, price: 380, lvl: 6, rarity: 3 },
  { atk: 24, def: 17, price: 900, lvl: 9, rarity: 4 },
  { atk: 36, def: 25, price: 2200, lvl: 12, rarity: 5 }
];

const REGIONS = {
  town: { name: 'Emberfall Village', type: 'town', scene: 'town',
    desc: 'Smoke curls from thatched roofs as villagers whisper of darkness beyond the hills. The tavern hearth glows warm, the smithy rings with hammer-blows, and the old temple bell tolls at dusk.' },
  woods: { name: 'Whispering Woods', lvl: '1–4', scene: 'woods', unlock: 0,
    desc: 'Ancient oaks crowd the path, their branches murmuring in a wind you cannot feel. Raiders lurk in the shadows and goblin fires flicker between the trees.',
    enemies: ['wolf', 'wolf', 'spider', 'goblin', 'goblin'], forage: 'moonpetal', boss: 'warchief' },
  crossing: { name: "Bandit's Crossing", lvl: '4–6', scene: 'crossing', unlock: 2,
    desc: 'A ruined stone bridge spans a roaring river. Burnt wagons litter the trade road — the work of Captain Varrek and his cutthroats.',
    enemies: ['bandit', 'bandit', 'archer'], forage: null, boss: 'captain' },
  crypt: { name: 'Sunken Crypt', lvl: '6–9', scene: 'crypt', unlock: 4,
    desc: 'Cold air seeps from a cracked mausoleum. Below, the restless dead shamble through flooded halls, and violet light pulses from the deepest vault.',
    enemies: ['skeleton', 'ghoul', 'wraith', 'skeleton'], forage: null, boss: 'lich' },
  peaks: { name: 'Ashfang Peaks', lvl: '10–14', scene: 'peaks', unlock: 6,
    desc: 'Volcanic slopes glow beneath a blood-red sky. Trolls guard the passes, Ash Knights patrol the summit, and from the crater comes the slow breathing of something ancient.',
    enemies: ['troll', 'drake', 'cultist', 'drake'], forage: null, boss: 'ashfang' }
};

const MAIN_QUESTS = [
  { id: 'm1', title: 'Embers of Warning', giver: 'Elder Maren', region: 'woods',
    desc: 'Raiders grow bold, attacking travelers on the forest road. Thin their numbers.',
    obj: { type: 'kill', target: 'wolf', count: 3 }, xp: 80, gold: 40 },
  { id: 'm2', title: 'The Goblin Warchief', giver: 'Elder Maren', region: 'woods',
    desc: 'The raiders were paid by goblins. Find their warchief Grukk deep in the woods and end him.',
    obj: { type: 'kill', target: 'warchief', count: 1 }, xp: 150, gold: 80, boss: 'warchief' },
  { id: 'm3', title: 'Roads of Blood', giver: 'Captain Hale', region: 'crossing',
    desc: "Grukk carried a bandit's coin purse. Bandits at the crossing are paying goblins to raid. Break their ranks.",
    obj: { type: 'killAny', targets: ['bandit', 'archer'], count: 4 }, xp: 220, gold: 120 },
  { id: 'm4', title: "The Captain's Ledger", giver: 'Captain Hale', region: 'crossing',
    desc: 'Defeat Captain Varrek and recover his ledger. Someone is funding this chaos.',
    obj: { type: 'kill', target: 'captain', count: 1 }, xp: 350, gold: 200, boss: 'captain' },
  { id: 'm5', title: 'Whispers Below', giver: 'High Priestess Ysolde', region: 'crypt',
    desc: "The ledger names a cult in the Sunken Crypt. The dead are rising there. Purge them.",
    obj: { type: 'killAny', targets: ['skeleton', 'ghoul', 'wraith'], count: 5 }, xp: 450, gold: 220 },
  { id: 'm6', title: 'The Acolyte of Ash', giver: 'High Priestess Ysolde', region: 'crypt',
    desc: 'Mordrith, an acolyte of the dragon cult, works dark rites in the deepest vault. Stop the ritual.',
    obj: { type: 'kill', target: 'lich', count: 1 }, xp: 700, gold: 400, boss: 'lich' },
  { id: 'm7', title: 'Ascent of Ash', giver: 'Elder Maren', region: 'peaks',
    desc: "Mordrith's dying words: 'Ashfang wakes.' Fight your way up the volcanic peaks.",
    obj: { type: 'killAny', targets: ['troll', 'drake', 'cultist'], count: 5 }, xp: 900, gold: 500 },
  { id: 'm8', title: 'Ashfang the Undying', giver: 'Elder Maren', region: 'peaks',
    desc: 'The ancient dragon-lich Ashfang rises in bone and fire. Destroy it and save the realm.',
    obj: { type: 'kill', target: 'ashfang', count: 1 }, xp: 3000, gold: 2000, boss: 'ashfang' }
];

const SIDE_QUESTS = [
  { id: 's1', title: "The Herbalist's Request", giver: 'Old Wenna', minLvl: 1, region: 'woods',
    desc: 'Gather 4 Moonpetals from the Whispering Woods for my remedies.',
    obj: { type: 'collect', item: 'moonpetal', count: 4 }, xp: 70, gold: 35, reward: { potion: 2 } },
  { id: 's2', title: "Weaver's Thread", giver: 'Tailor Bram', minLvl: 2, region: 'woods',
    desc: 'Bring me 3 spools of Witch-Thread from the bog witches. Finest thread there is.',
    obj: { type: 'collect', item: 'silk', count: 3 }, xp: 90, gold: 60 },
  { id: 's3', title: 'Goblin Bounty', giver: 'Quest Board', minLvl: 2, region: 'woods',
    desc: 'Bounty posted: slay 5 goblin scouts harassing the farms.',
    obj: { type: 'kill', target: 'goblin', count: 5 }, xp: 120, gold: 70 },
  { id: 's4', title: 'The Lost Signet', giver: 'Lady Elara', minLvl: 4, region: 'crossing',
    desc: "Bandits stole my late husband's signet ring. Please, recover it.",
    obj: { type: 'collect', item: 'ring', count: 1 }, xp: 200, gold: 150, reward: { bigpotion: 1 } },
  { id: 's5', title: 'Archers in the Reeds', giver: 'Quest Board', minLvl: 4, region: 'crossing',
    desc: 'Bandit archers pick off ferrymen. Eliminate 4 of them.',
    obj: { type: 'kill', target: 'archer', count: 4 }, xp: 240, gold: 110 },
  { id: 's6', title: 'Bones for the Pyre', giver: 'Brother Aldous', minLvl: 6, region: 'crypt',
    desc: 'Bring 6 Cursed Bones so they may be burned and the spirits laid to rest.',
    obj: { type: 'collect', item: 'bone', count: 6 }, xp: 380, gold: 180, reward: { ether: 2 } },
  { id: 's7', title: 'Wraith Hunter', giver: 'Quest Board', minLvl: 7, region: 'crypt',
    desc: 'Banish 3 crypt wraiths that haunt the old graveyard.',
    obj: { type: 'kill', target: 'wraith', count: 3 }, xp: 420, gold: 200 },
  { id: 's8', title: 'Troll Slayer', giver: 'Smith Dorrin', minLvl: 10, region: 'peaks',
    desc: 'Mountain trolls block the ore paths. Slay 3 and I will make it worth your while.',
    obj: { type: 'kill', target: 'troll', count: 3 }, xp: 700, gold: 400 },
  { id: 's9', title: 'Sigils of Ash', giver: 'Smith Dorrin', minLvl: 10, region: 'peaks',
    desc: 'Bring me 4 Ash Sigils from the Ash Knights — I can forge wonders with them.',
    obj: { type: 'collect', item: 'scale', count: 4 }, xp: 800, gold: 500, reward: { bigpotion: 2 } }
];
