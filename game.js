"use strict";

(() => {
    const STORAGE_KEY = "magic-ovad-side-shooter-mvp.save.v1";
    const AUDIO_SETTINGS_KEY = "magic-ovad-side-shooter-mvp.audio.v1";
    const DAILY_STORAGE_KEY = "magic-ovad-side-shooter-mvp.daily.v1";
    const MAX_HP = 3;
    const FOOT_EXTENSION = 26;
    const GRAVITY = 1850;
    const FRICTION = 0.86;
    const DEFAULT_AUDIO_SETTINGS = {
        master: 1,
        sfx: 1,
        shots: 1,
        music: 1
    };

    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    const ui = {
        hp: document.getElementById("hud-hp"),
        hearts: document.getElementById("hud-hearts"),
        hpFill: document.getElementById("hud-hp-fill"),
        hero: document.getElementById("hud-hero"),
        zone: document.getElementById("hud-zone"),
        objective: document.getElementById("hud-objective"),
        boss: document.getElementById("hud-boss"),
        score: document.getElementById("hud-score"),
        mushrooms: document.getElementById("hud-mushrooms"),
        skill: document.getElementById("hud-skill"),
        grenades: document.getElementById("hud-grenades"),
        skillFill: document.getElementById("hud-skill-fill"),
        eventBanner: document.getElementById("event-banner"),
        progressText: document.getElementById("hud-progress-text"),
        progressFill: document.getElementById("hud-progress-fill"),
        dailyPanel: document.getElementById("daily-panel"),
        dailyList: document.getElementById("daily-list"),
        dailySeed: document.getElementById("daily-seed"),
        dailyHud: document.getElementById("daily-hud"),
        dailyHudList: document.getElementById("daily-hud-list"),
        mapTitle: document.getElementById("map-title"),
        mapEyebrow: document.getElementById("map-eyebrow"),
        mapSubtitle: document.getElementById("map-subtitle"),
        worldMap: document.getElementById("world-map"),
        mapStartButton: document.getElementById("map-start-button"),
        mapHeroesButton: document.getElementById("map-heroes-button"),
        mapMenuButton: document.getElementById("map-menu-button"),
        pauseButton: document.getElementById("pause-button"),
        heroGrid: document.getElementById("hero-grid"),
        upgradeGrid: document.getElementById("upgrade-grid"),
        upgradeHint: document.getElementById("upgrade-hint"),
        pauseZone: document.getElementById("pause-zone"),
        resultEyebrow: document.getElementById("result-eyebrow"),
        resultTitle: document.getElementById("result-title"),
        resultCopy: document.getElementById("result-copy"),
        nextZoneButton: document.getElementById("next-zone-button"),
        gameoverCopy: document.getElementById("gameover-copy"),
        settingsButton: document.getElementById("settings-button"),
        pauseSettingsButton: document.getElementById("pause-settings-button"),
        settingsBack: document.getElementById("settings-back"),
        audioResetButton: document.getElementById("audio-reset-button"),
        volumeInputs: {
            master: document.getElementById("master-volume"),
            sfx: document.getElementById("sfx-volume"),
            shots: document.getElementById("shot-volume"),
            music: document.getElementById("music-volume")
        },
        volumeValues: {
            master: document.getElementById("master-volume-value"),
            sfx: document.getElementById("sfx-volume-value"),
            shots: document.getElementById("shot-volume-value"),
            music: document.getElementById("music-volume-value")
        }
    };

    const screens = {
        menu: document.getElementById("menu-screen"),
        map: document.getElementById("map-screen"),
        heroes: document.getElementById("heroes-screen"),
        pause: document.getElementById("pause-screen"),
        settings: document.getElementById("settings-screen"),
        result: document.getElementById("result-screen"),
        gameover: document.getElementById("gameover-screen")
    };

    const audio = {
        shoot: document.getElementById("audio-shoot"),
        hit: document.getElementById("audio-hit"),
        eat: document.getElementById("audio-eat"),
        fall: document.getElementById("audio-fall"),
        fly1: document.getElementById("audio-fly1"),
        music: document.getElementById("audio-music")
    };

    const GUN_PACK = "images/Guns_V1.01 - Commission - Copy";
    const CITY_PACK = "images/2dcitywithoutline/2dcitywithoutline";
    const CITY_BACKGROUND_PACK = "images/free-scrolling-city-backgrounds-pixel-art/1 Backgrounds";
    const GRAFFITI_PACK = "images/monster/Free-Graffiti-Constructor-Pixel-Art";
    const MONSTER_FANTASY_PACK = "images/monster/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy";
    const MONSTER_FANTASY_PACK_2 = "images/monster/Monsters Creatures Fantasy 2/Monsters Creatures Fantasy 2";
    const FOREST_MONSTER_PACK = "images/monster/Forest_Monsters_FREE/Forest_Monsters_FREE/Mushroom/Mushroom without VFX";
    const GANGSTER_PACK = "images/monster/gangster-pixel-character-sprite-sheets-pack";
    const HOMELESS_PACK = "images/monster/Free-Homeless-Character-Sprite-Sheets-Pixel-Art";
    const CITY_BACKGROUND_VARIANTS = 8;
    const CITY_BACKGROUND_LAYER_COUNT = 5;
    const CITY_BACKGROUND_TIMES = ["Day", "Night"];
    const GRAFFITI_TAGS = ["OVAD TEAM", "EFFEKTIHVE INC"];
    const GRAFFITI_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const MOTO_TERRAIN_STEP = 110;
    const DEFAULT_CAMERA_PLAYER_RATIO = 0.28;
    const MOTO_CAMERA_PLAYER_RATIO = 0.12;
    const MOTO_WORLD_SCALE = 0.9;
    const ENEMY_FIRE_VIEW_DELAY = 0.45;

    const imagePaths = {
        rookie: "images/black2.png",
        mushroom: "images/skin1.png",
        forest: "images/skin2.png",
        fire: "images/skin3.png",
        ice: "images/skin4.png",
        golden: "images/skin5.png",
        shadow: "images/skin6.png",
        star: "images/skin7.png",
        stone: "images/skin8.png",
        cat: "images/skin9.png",
        ghost: "images/skin10.png",
        firefly: "images/skin11.png",
        mushroomPickup: "images/mushroom.png",
        flyMushroom: "images/fly-mushroom.png",
        lakeBg: "images/level-1-bg.png",
        oldBg: "images/Background.png",
        sticker: "images/sticker.png",
        playerMotorcycle: "images/motorcycle post-up/motorcycle post-up.png",
        gunAk: `${GUN_PACK}/01 - Individual sprites/Guns/AK 47 [96x48].png`,
        gunAkShoot: `${GUN_PACK}/02 - Sprite sheets/AK 47 [96x48]/[SHOOT WITH CASING AND MUZZLE FLASH] AK 47.png`,
        gunBazooka: `${GUN_PACK}/01 - Individual sprites/Guns/Bazooka - M20 [192x32].png`,
        gunBazookaShoot: `${GUN_PACK}/02 - Sprite sheets/Bazooka - M20 [192x32]/[SHOOT WITH MUZZLE FLASH] Bazooka - M20.png`,
        gunGlock: `${GUN_PACK}/01 - Individual sprites/Guns/Glock - P80 [64x48].png`,
        gunGlockShoot: `${GUN_PACK}/02 - Sprite sheets/Glock - P80 [64x48]/[SHOOT WITH CASING AND MUZZLE FLASH] Glock - P80.png`,
        gunRevolver: `${GUN_PACK}/01 - Individual sprites/Guns/Revolver - Colt 45 [64x32].png`,
        gunRevolverShoot: `${GUN_PACK}/02 - Sprite sheets/Revolver - Colt 45 [64x32]/[SHOOT WITH MUZZLE FLASH] Revolver - Colt 45.png`,
        gunMp5: `${GUN_PACK}/01 - Individual sprites/Guns/Submachine - MP5A3 [80x48].png`,
        gunMp5Shoot: `${GUN_PACK}/02 - Sprite sheets/Submachine - MP5A3 [80x48]/[SHOOT WITH CASING AND MUZZLE FLASH] Submachine - MP5A3.png`,
        gunThickBazooka: `${GUN_PACK}/01 - Individual sprites/Guns/Thick Bazooka - M20 [192x32].png`,
        gunThickBazookaShoot: `${GUN_PACK}/02 - Sprite sheets/Thick Bazooka - M20 [192x32]/[SHOOT WITH MUZZLE FLASH] Thick Bazooka - M20.png`,
        bulletAk: `${GUN_PACK}/01 - Individual sprites/Bullets & Ammo/AK 47/Bullet.png`,
        bulletBazooka: `${GUN_PACK}/01 - Individual sprites/Bullets & Ammo/Bazooka - M20 - Copy/M20 Rocket.png`,
        bulletGlock: `${GUN_PACK}/01 - Individual sprites/Bullets & Ammo/Glock - P80/Bullet.png`,
        bulletRevolver: `${GUN_PACK}/01 - Individual sprites/Bullets & Ammo/Revolver - Colt 45/Bullet.png`,
        bulletMp5: `${GUN_PACK}/01 - Individual sprites/Bullets & Ammo/Submachine - MP5A3/Bullet.png`,
        bulletThickBazooka: `${GUN_PACK}/01 - Individual sprites/Bullets & Ammo/Thick Bazooka - M20/M20 Thick Rocket.png`,
        cityHouses: `${CITY_PACK}/house1/stoke1house0001.png`,
        cityVehicles: `${CITY_PACK}/vehicles/vehicles0001.png`,
        cityGrounds: `${CITY_PACK}/grounds/strokegrounds0001.png`,
        cityProps: `${CITY_PACK}/cityfirstprops/stroke1.png`,
        cityRoadProps: `${CITY_PACK}/citysecondprops/strokecitysecondcityprops0001.png`,
        cityDivers: `${CITY_PACK}/divers/strokedivers0001.png`,
        monsterMushroomRun: `${MONSTER_FANTASY_PACK}/Mushroom/Run.png`,
        monsterForestMushroomRun: `${FOREST_MONSTER_PACK}/Mushroom-Run.png`,
        monsterFlyingEyeFlight: `${MONSTER_FANTASY_PACK}/Flying eye/Flight.png`,
        monsterBatFly: `${MONSTER_FANTASY_PACK_2}/Bat/fly.png`,
        gangster1Idle: `${GANGSTER_PACK}/Gangsters_1/Idle.png`,
        gangster1IdleAlt: `${GANGSTER_PACK}/Gangsters_1/Idle_2.png`,
        gangster1Walk: `${GANGSTER_PACK}/Gangsters_1/Walk.png`,
        gangster1Run: `${GANGSTER_PACK}/Gangsters_1/Run.png`,
        gangster1Shoot: `${GANGSTER_PACK}/Gangsters_1/Shot.png`,
        gangster1Reload: `${GANGSTER_PACK}/Gangsters_1/Recharge.png`,
        gangster1Attack: `${GANGSTER_PACK}/Gangsters_1/Attack_1.png`,
        gangster1Jump: `${GANGSTER_PACK}/Gangsters_1/Jump.png`,
        gangster1Hurt: `${GANGSTER_PACK}/Gangsters_1/Hurt.png`,
        gangster1Dead: `${GANGSTER_PACK}/Gangsters_1/Dead.png`,
        gangster2Idle: `${GANGSTER_PACK}/Gangsters_2/Idle.png`,
        gangster2IdleAlt: `${GANGSTER_PACK}/Gangsters_2/Idle_2.png`,
        gangster2Walk: `${GANGSTER_PACK}/Gangsters_2/Walk.png`,
        gangster2Run: `${GANGSTER_PACK}/Gangsters_2/Run.png`,
        gangster2Attack: `${GANGSTER_PACK}/Gangsters_2/Attack_1.png`,
        gangster2Attack2: `${GANGSTER_PACK}/Gangsters_2/Attack_2.png`,
        gangster2Attack3: `${GANGSTER_PACK}/Gangsters_2/Attack_3.png`,
        gangster2Jump: `${GANGSTER_PACK}/Gangsters_2/Jump.png`,
        gangster2Hurt: `${GANGSTER_PACK}/Gangsters_2/Hurt.png`,
        gangster2Dead: `${GANGSTER_PACK}/Gangsters_2/Dead.png`,
        gangster3Idle: `${GANGSTER_PACK}/Gangsters_3/Idle.png`,
        gangster3IdleAlt: `${GANGSTER_PACK}/Gangsters_3/Idle_2.png`,
        gangster3Walk: `${GANGSTER_PACK}/Gangsters_3/Walk.png`,
        gangster3Run: `${GANGSTER_PACK}/Gangsters_3/Run.png`,
        gangster3Shoot: `${GANGSTER_PACK}/Gangsters_3/Shot.png`,
        gangster3Reload: `${GANGSTER_PACK}/Gangsters_3/Recharge.png`,
        gangster3Attack: `${GANGSTER_PACK}/Gangsters_3/Attack.png`,
        gangster3Jump: `${GANGSTER_PACK}/Gangsters_3/Jump.png`,
        gangster3Hurt: `${GANGSTER_PACK}/Gangsters_3/Hurt.png`,
        gangster3Dead: `${GANGSTER_PACK}/Gangsters_3/Dead.png`,
        homeless1Idle: `${HOMELESS_PACK}/Homeless_1/Idle.png`,
        homeless1Walk: `${HOMELESS_PACK}/Homeless_1/Walk.png`,
        homeless1Run: `${HOMELESS_PACK}/Homeless_1/Run.png`,
        homeless1Attack: `${HOMELESS_PACK}/Homeless_1/Attack_1.png`,
        homeless1Throw: `${HOMELESS_PACK}/Homeless_1/Attack_2.png`,
        homeless1Jump: `${HOMELESS_PACK}/Homeless_1/Jump.png`,
        homeless1Hurt: `${HOMELESS_PACK}/Homeless_1/Hurt.png`,
        homeless1Dead: `${HOMELESS_PACK}/Homeless_1/Dead.png`,
        homeless2Idle: `${HOMELESS_PACK}/Homeless_2/Idle.png`,
        homeless2Walk: `${HOMELESS_PACK}/Homeless_2/Walk.png`,
        homeless2Run: `${HOMELESS_PACK}/Homeless_2/Run.png`,
        homeless2Attack: `${HOMELESS_PACK}/Homeless_2/Attack_1.png`,
        homeless2Jump: `${HOMELESS_PACK}/Homeless_2/Jump.png`,
        homeless2Hurt: `${HOMELESS_PACK}/Homeless_2/Hurt.png`,
        homeless2Dead: `${HOMELESS_PACK}/Homeless_2/Dead.png`,
        homeless3Idle: `${HOMELESS_PACK}/Homeless_3/Idle.png`,
        homeless3Walk: `${HOMELESS_PACK}/Homeless_3/Walk.png`,
        homeless3Run: `${HOMELESS_PACK}/Homeless_3/Run.png`,
        homeless3Attack: `${HOMELESS_PACK}/Homeless_3/Attack_1.png`,
        homeless3Throw: `${HOMELESS_PACK}/Homeless_3/Attack_2.png`,
        homeless3Jump: `${HOMELESS_PACK}/Homeless_3/Jump.png`,
        homeless3Hurt: `${HOMELESS_PACK}/Homeless_3/Hurt.png`,
        homeless3Dead: `${HOMELESS_PACK}/Homeless_3/Dead.png`,
        uiHeartFull: "images/UI/Basic_GUI_Bundle/Icons/Icon_Small_HeartFull.png",
        uiHeartEmpty: "images/UI/Basic_GUI_Bundle/Icons/Icon_Small_HeartEmpty.png",
        uiCheck: "images/UI/Basic_GUI_Bundle/Icons/Icon_Small_WhiteOutline_Check.png",
        uiStar: "images/UI/Basic_GUI_Bundle/Icons/Icon_Small_Star.png"
    };

    const cityBackgroundSets = Array.from({ length: CITY_BACKGROUND_VARIANTS }, (_, variantIndex) => {
        const variant = variantIndex + 1;
        const modes = {};
        CITY_BACKGROUND_TIMES.forEach((time) => {
            const timeKey = time.toLowerCase();
            modes[timeKey] = Array.from({ length: CITY_BACKGROUND_LAYER_COUNT }, (_, layerIndex) => {
                const layer = layerIndex + 1;
                const key = `cityBg${variant}${time}${layer}`;
                imagePaths[key] = `${CITY_BACKGROUND_PACK}/${variant}/${time}/${layer}.png`;
                return key;
            });
        });
        return { variant, modes };
    });

    const graffitiLetterKeys = {};
    GRAFFITI_ALPHABET.split("").forEach((letter) => {
        graffitiLetterKeys[letter] = [1, 2].map((style) => {
            const key = `graffitiLetter${letter}${style}`;
            imagePaths[key] = `${GRAFFITI_PACK}/1 Font/${letter}${style}.png`;
            return key;
        });
    });

    const graffitiDecorKeys = [
        ["graffitiSpray1", "2 Decoratoins/1 Spray/1.png"],
        ["graffitiSpray2", "2 Decoratoins/1 Spray/5.png"],
        ["graffitiSpray3", "2 Decoratoins/1 Spray/9.png"],
        ["graffitiSmudge1", "2 Decoratoins/4 Smudges/19.png"],
        ["graffitiSmudge2", "2 Decoratoins/4 Smudges/23.png"],
        ["graffitiCircle1", "2 Decoratoins/6 Circles/35.png"],
        ["graffitiCircle2", "2 Decoratoins/6 Circles/39.png"],
        ["graffitiStar1", "2 Decoratoins/16 Stars/101.png"],
        ["graffitiStar2", "2 Decoratoins/16 Stars/105.png"]
    ].map(([key, path]) => {
        imagePaths[key] = `${GRAFFITI_PACK}/${path}`;
        return key;
    });

    const images = {};
    Object.entries(imagePaths).forEach(([key, path]) => {
        const img = new Image();
        img.src = path;
        images[key] = img;
    });

    const weaponCatalog = {
        glock: {
            name: "Glock P80",
            image: "gunGlock",
            shootImage: "gunGlockShoot",
            bulletImage: "bulletGlock",
            frameW: 64,
            frameH: 48,
            drawW: 60,
            gripX: 18,
            gripY: 25,
            muzzleDistance: 48,
            supportDistance: 39,
            bulletLength: 15,
            speedMod: 1,
            damageMod: 1,
            recoil: 3
        },
        revolver: {
            name: "Colt 45",
            image: "gunRevolver",
            shootImage: "gunRevolverShoot",
            bulletImage: "bulletRevolver",
            frameW: 64,
            frameH: 32,
            drawW: 68,
            gripX: 19,
            gripY: 17,
            muzzleDistance: 55,
            supportDistance: 43,
            bulletLength: 17,
            speedMod: 0.98,
            damageMod: 1.12,
            recoil: 4
        },
        mp5: {
            name: "MP5A3",
            image: "gunMp5",
            shootImage: "gunMp5Shoot",
            bulletImage: "bulletMp5",
            frameW: 80,
            frameH: 48,
            drawW: 82,
            gripX: 26,
            gripY: 27,
            muzzleDistance: 65,
            supportDistance: 56,
            bulletLength: 15,
            speedMod: 1.08,
            damageMod: 0.9,
            recoil: 3
        },
        ak: {
            name: "AK 47",
            image: "gunAk",
            shootImage: "gunAkShoot",
            bulletImage: "bulletAk",
            frameW: 96,
            frameH: 48,
            drawW: 96,
            gripX: 33,
            gripY: 27,
            muzzleDistance: 76,
            supportDistance: 64,
            bulletLength: 17,
            speedMod: 1.12,
            damageMod: 1.02,
            recoil: 4
        },
        bazooka: {
            name: "M20 Bazooka",
            image: "gunBazooka",
            shootImage: "gunBazookaShoot",
            bulletImage: "bulletBazooka",
            frameW: 192,
            frameH: 32,
            drawW: 116,
            gripX: 70,
            gripY: 17,
            muzzleDistance: 74,
            supportDistance: 64,
            bulletLength: 30,
            radiusBonus: 3,
            speedMod: 0.78,
            damageMod: 1.38,
            recoil: 7,
            rocket: true
        },
        thickBazooka: {
            name: "Thick M20",
            image: "gunThickBazooka",
            shootImage: "gunThickBazookaShoot",
            bulletImage: "bulletThickBazooka",
            frameW: 192,
            frameH: 32,
            drawW: 126,
            gripX: 70,
            gripY: 17,
            muzzleDistance: 81,
            supportDistance: 68,
            bulletLength: 34,
            radiusBonus: 4,
            speedMod: 0.72,
            damageMod: 1.55,
            recoil: 8,
            rocket: true
        }
    };

    const playerBulletRanges = {
        normal: 640 * 1.25,
        spore: 550 * 0.95,
        leaf: 660 * 1.5,
        fire: 650 * 1.15,
        ice: 610 * 1.35,
        gold: 600 * 1.2,
        shadow: 760 * 1.35,
        star: 640 * 1.25,
        stone: 520 * 1.45,
        cat: 610 * 1.35,
        ghost: 720 * 1.25,
        spark: 690
    };

    const citySprites = {
        yellowHouse: { image: "cityHouses", sx: 150, sy: 105, sw: 420, sh: 515, w: 245, h: 300 },
        blueShop: { image: "cityHouses", sx: 800, sy: 82, sw: 380, sh: 370, w: 245, h: 240 },
        cafe: { image: "cityHouses", sx: 84, sy: 760, sw: 450, sh: 350, w: 270, h: 210 },
        bakery: { image: "cityHouses", sx: 1226, sy: 515, sw: 540, sh: 890, w: 260, h: 430 },
        smallHouse: { image: "cityHouses", sx: 135, sy: 1580, sw: 400, sh: 320, w: 260, h: 210 },
        foodTruck: { image: "cityVehicles", sx: 60, sy: 220, sw: 520, sh: 390, w: 150, h: 112 },
        ambulance: { image: "cityVehicles", sx: 1438, sy: 190, sw: 560, sh: 390, w: 170, h: 115 },
        policeCar: { image: "cityVehicles", sx: 430, sy: 1760, sw: 330, sh: 190, w: 140, h: 80 },
        redCar: { image: "cityVehicles", sx: 1280, sy: 1785, sw: 320, sh: 185, w: 132, h: 74 },
        cityBus: { image: "cityVehicles", sx: 72, sy: 1395, sw: 510, sh: 250, w: 210, h: 92 },
        bench: { image: "cityProps", sx: 300, sy: 662, sw: 315, sh: 230, w: 120, h: 88 },
        stopSign: { image: "cityProps", sx: 1068, sy: 970, sw: 100, sh: 270, w: 34, h: 92 },
        dangerSign: { image: "cityProps", sx: 1660, sy: 970, sw: 120, sh: 265, w: 44, h: 92 },
        cone: { image: "cityProps", sx: 160, sy: 1335, sw: 70, sh: 110, w: 32, h: 48 },
        trafficLight: { image: "cityProps", sx: 270, sy: 1570, sw: 380, sh: 470, w: 118, h: 146 },
        roadBlock: { image: "cityRoadProps", sx: 870, sy: 745, sw: 360, sh: 200, w: 140, h: 76 },
        roadPlatform: { image: "cityRoadProps", sx: 1545, sy: 1130, sw: 365, sh: 220, w: 210, h: 44 },
        awningRed: { image: "cityRoadProps", sx: 162, sy: 172, sw: 430, sh: 330, w: 170, h: 74 },
        awningBlue: { image: "cityRoadProps", sx: 780, sy: 172, sw: 430, sh: 330, w: 170, h: 74 }
    };

    const CITY_BUILDING_SPACING = 360;
    const CITY_BUILDING_NAMES = ["yellowHouse", "blueShop", "cafe", "bakery", "smallHouse"];
    const CITY_ROAD_LANE_GAP = 150;

    const heroes = [
        {
            id: "rookie",
            name: "Rookie Ovad",
            image: "rookie",
            weapon: "Sting Rifle",
            perk: "Balanced speed, fast reload, clean single shots.",
            skill: "Focus Burst",
            color: "#50d8c8",
            fireRate: 240,
            speed: 1,
            jump: 1,
            bullet: "normal"
        },
        {
            id: "mushroom",
            name: "Mushroom King",
            image: "mushroom",
            weapon: "Spore Shotgun",
            perk: "Short spread. Skill heals one HP and fires spores.",
            skill: "Spore Heal",
            color: "#c7ef5f",
            fireRate: 410,
            speed: 0.94,
            jump: 0.96,
            bullet: "spore"
        },
        {
            id: "forest",
            name: "Forest Spirit",
            image: "forest",
            weapon: "Leaf Piercer",
            perk: "Piercing leaves and softer landings.",
            skill: "Leaf Fan",
            color: "#88e060",
            fireRate: 330,
            speed: 1.05,
            jump: 1.12,
            bullet: "leaf"
        },
        {
            id: "fire",
            name: "Fire Hopper",
            image: "fire",
            weapon: "Flame Pistol",
            perk: "Burning shots. Skill turns on rapid fire.",
            skill: "Overheat",
            color: "#ff8757",
            fireRate: 180,
            speed: 1.02,
            jump: 1,
            bullet: "fire"
        },
        {
            id: "ice",
            name: "Ice Warrior",
            image: "ice",
            weapon: "Frost Bolts",
            perk: "Freezes enemies and slows bosses.",
            skill: "Frost Lock",
            color: "#86dbff",
            fireRate: 300,
            speed: 0.98,
            jump: 1,
            bullet: "ice"
        },
        {
            id: "golden",
            name: "Golden Hero",
            image: "golden",
            weapon: "Gold Splitter",
            perk: "More mushrooms from kills and double gold shots.",
            skill: "Gold Rush",
            color: "#ffd166",
            fireRate: 360,
            speed: 1,
            jump: 1,
            bullet: "gold"
        },
        {
            id: "shadow",
            name: "Shadow Master",
            image: "shadow",
            weapon: "Shadow Needles",
            perk: "Fast piercing shots. Skill gives phase immunity.",
            skill: "Shadow Phase",
            color: "#ad8cff",
            fireRate: 260,
            speed: 1.1,
            jump: 1.04,
            bullet: "shadow"
        },
        {
            id: "star",
            name: "Stars Wanderer",
            image: "star",
            weapon: "Star Splitter",
            perk: "Triple star shots, strong against bosses.",
            skill: "Star Storm",
            color: "#f5d7ff",
            fireRate: 420,
            speed: 0.98,
            jump: 1.04,
            bullet: "star"
        },
        {
            id: "stone",
            name: "Stone Warden",
            image: "stone",
            weapon: "Rock Cannon",
            perk: "Slow heavy damage and passive armor.",
            skill: "Stone Guard",
            color: "#b8c0c8",
            fireRate: 520,
            speed: 0.88,
            jump: 0.9,
            bullet: "stone"
        },
        {
            id: "cat",
            name: "Magic Cat",
            image: "cat",
            weapon: "Blink Sparks",
            perk: "Light homing shots. Skill teleports forward.",
            skill: "Blink Shot",
            color: "#ff9ce3",
            fireRate: 280,
            speed: 1.08,
            jump: 1.16,
            bullet: "cat"
        },
        {
            id: "ghost",
            name: "Ghost Fox",
            image: "ghost",
            weapon: "Ghost Dashers",
            perk: "High crit damage. Skill dashes through danger.",
            skill: "Ghost Dash",
            color: "#d6e3ff",
            fireRate: 310,
            speed: 1.14,
            jump: 1.08,
            bullet: "ghost"
        },
        {
            id: "firefly",
            name: "FireFly",
            image: "firefly",
            weapon: "Spark Minigun",
            perk: "Tiny fast shots and a short hover burst.",
            skill: "Spark Barrage",
            color: "#ffe66d",
            fireRate: 110,
            speed: 1.04,
            jump: 1.06,
            bullet: "spark"
        }
    ];

    const heroWeapons = {
        rookie: "glock",
        mushroom: "revolver",
        forest: "ak",
        fire: "mp5",
        ice: "ak",
        golden: "revolver",
        shadow: "mp5",
        star: "thickBazooka",
        stone: "bazooka",
        cat: "glock",
        ghost: "revolver",
        firefly: "mp5"
    };

    const heroById = Object.fromEntries(heroes.map((hero) => [hero.id, hero]));

    const upgrades = [
        { id: "damage", name: "Damage", max: 4, cost: (level) => 16 + level * 12, text: "More bullet damage" },
        { id: "cooldown", name: "Reload", max: 4, cost: (level) => 14 + level * 10, text: "Faster fire rate" },
        { id: "armor", name: "Armor", max: 3, cost: (level) => 18 + level * 14, text: "Chance to block damage" },
        { id: "engine", name: "Engine", max: 3, cost: (level) => 14 + level * 12, text: "More bike fuel" },
        { id: "skill", name: "Skill", max: 3, cost: (level) => 20 + level * 14, text: "Lower skill cooldown" },
        { id: "magnet", name: "Magnet", max: 3, cost: (level) => 12 + level * 10, text: "Pull pickups closer" }
    ];

    const dailyGoals = [
        { id: "city_kills", label: "Clear city enemies", stat: "kills", goal: 12, reward: 4 },
        { id: "city_mushrooms", label: "Collect mushrooms", stat: "mushrooms", goal: 9, reward: 4 },
        { id: "city_push", label: "Reach city depth", stat: "progress", goal: 45, reward: 5 }
    ];

    const cityRunModifiers = [
        { id: "rooftop_cache", name: "Rooftop Cache", text: "More rooftop pickups", trafficCount: 4, pickupStep: 620 },
        { id: "rush_hour", name: "Rush Hour", text: "Faster traffic, richer score", trafficCount: 5, trafficSpeed: 1.12, pickupStep: 760 },
        { id: "backstreet_sweep", name: "Backstreet Sweep", text: "Gangster patrols control the blocks", trafficCount: 4, pickupStep: 680 }
    ];

    const LEVELS_PER_LOCATION = 5;
    const firstCityEnemyDeck = ["homeless1", "homeless2", "homeless1", "homeless2"];

    const locationTemplates = [
        {
            name: "Ovad City",
            shortName: "City",
            biome: "city",
            vehicle: "foot",
            width: 9100,
            reward: 24,
            ground: "#55606f",
            soil: "#242936",
            skyTop: "#9fd5ff",
            skyBottom: "#4d739d",
            enemySet: firstCityEnemyDeck,
            boss: {
                name: "Traffic Queen",
                hp: 44,
                pattern: "city",
                color: "#ffcd3f",
                mechanic: "Rush-hour cars and cone spreads"
            },
            stageNames: ["City Gates", "Rooftop Blocks", "Rush Road", "Canal Edge", "Traffic Queen"]
        },
        {
            name: "Bog Kayak Run",
            shortName: "Swamp",
            biome: "swamp",
            vehicle: "kayak",
            width: 4700,
            reward: 32,
            ground: "#466b37",
            soil: "#263c28",
            skyTop: "#9acb79",
            skyBottom: "#2d4737",
            enemySet: ["forestShroom", "skeeter", "slime", "waterfly", "nightBat"],
            boss: {
                name: "Mud Admiral",
                hp: 56,
                pattern: "swamp",
                color: "#e09b45",
                mechanic: "Poison waves across the water"
            },
            stageNames: ["Bog Shore", "Reed Drift", "Mire Bridge", "Rot Creek", "Mud Admiral"]
        },
        {
            name: "Dung Island",
            shortName: "Dung",
            biome: "dung",
            vehicle: "foot",
            width: 5100,
            reward: 42,
            ground: "#a56c35",
            soil: "#4b2b16",
            skyTop: "#d5a35a",
            skyBottom: "#563319",
            enemySet: ["dungling", "sporeShroom", "nightBat", "roller"],
            boss: {
                name: "The Brown Throne",
                hp: 70,
                pattern: "dung",
                color: "#7b421f",
                mechanic: "Bouncing bombs and summoned dunglings"
            },
            stageNames: ["Brown Beach", "Sticky Hill", "Rotten Grove", "Throne Path", "Brown Throne"]
        },
        {
            name: "Sky Ridge",
            shortName: "Sky",
            biome: "sky",
            vehicle: "foot",
            width: 5600,
            reward: 54,
            ground: "#78bde8",
            soil: "#3e78b5",
            skyTop: "#d6f7ff",
            skyBottom: "#4d8cdf",
            enemySet: ["flyingEye", "nightBat", "stormbug", "ovad", "fly"],
            boss: {
                name: "Storm Crown",
                hp: 84,
                pattern: "sky",
                color: "#fff070",
                mechanic: "Lightning marks and side wind"
            },
            stageNames: ["Cloud Lift", "Gust Steps", "Storm Bridge", "High Ridge", "Storm Crown"]
        },
        {
            name: "Cosmic Hive",
            shortName: "Space",
            biome: "space",
            vehicle: "foot",
            width: 6200,
            reward: 72,
            ground: "#5b44c8",
            soil: "#180d3d",
            skyTop: "#101746",
            skyBottom: "#050610",
            enemySet: ["voidfly", "flyingEye", "cometling", "nightBat", "stormbug"],
            boss: {
                name: "Void Ovad Prime",
                hp: 110,
                pattern: "space",
                color: "#b980ff",
                mechanic: "Gravity pulses and homing comets"
            },
            stageNames: ["Launch Field", "Moon Belt", "Star Drift", "Void Gate", "Void Prime"]
        }
    ];

    const levels = createCampaignLevels(locationTemplates);

    function cityLevelBackground(stageIndex, locationIndex = 0, seed = 0) {
        const stageNumber = stageIndex + 1;
        const rng = makeSeededRng(hashString(`city-background:${locationIndex}:${stageNumber}:${seed}`));
        const variant = 1 + Math.floor(rng() * CITY_BACKGROUND_VARIANTS);
        const forcedNight = stageNumber === 3 || stageNumber === 4;
        const time = (forcedNight || rng() > 0.58) ? "Night" : "Day";
        const set = cityBackgroundSets[variant - 1] || cityBackgroundSets[0];

        return {
            variant,
            time,
            layers: set.modes[time.toLowerCase()] || set.modes.day,
            forcedNight
        };
    }

    function createCampaignLevels(locations) {
        return locations.flatMap((location, locationIndex) => {
            return Array.from({ length: LEVELS_PER_LOCATION }, (_, stageIndex) => {
                const isBossLevel = stageIndex === LEVELS_PER_LOCATION - 1;
                const stageNumber = stageIndex + 1;
                const stageName = location.stageNames[stageIndex] || `${location.shortName} ${stageNumber}`;
                const widthScale = isBossLevel ? 1 : 0.52 + stageIndex * 0.1;
                const difficultyIndex = locationIndex * 1.35 + stageIndex * 0.42;
                const motoRun = location.biome === "city";
                const cityBackground = location.biome === "city"
                    ? cityLevelBackground(stageIndex, locationIndex)
                    : null;
                const boss = isBossLevel && location.boss
                    ? { ...location.boss, hp: Math.ceil(location.boss.hp * (1 + locationIndex * 0.1)) }
                    : null;

                return {
                    ...location,
                    id: `${location.biome}-${stageNumber}`,
                    name: isBossLevel ? `${location.name}: ${stageName}` : `${location.name}: ${stageName}`,
                    shortName: `${location.shortName} ${stageNumber}`,
                    mapName: stageName,
                    locationName: location.name,
                    locationShortName: location.shortName,
                    enemySet: location.biome === "city" ? firstCityEnemyDeck : location.enemySet,
                    cityBackground,
                    locationIndex,
                    stageIndex,
                    stageNumber,
                    globalStage: locationIndex * LEVELS_PER_LOCATION + stageNumber,
                    isBossLevel,
                    motoRun,
                    difficultyIndex,
                    width: motoRun ? Math.round(location.width * (2.18 + stageIndex * 0.18)) : Math.round(location.width * widthScale),
                    reward: location.reward + stageIndex * 5 + locationIndex * 4,
                    boss
                };
            });
        });
    }

    function humanAnimations(prefix, drawW, drawH, offsetY, frames) {
        const base = { frameW: 128, frameH: 128, drawW, drawH, offsetY };
        const animation = (state, fps = 7) => ({
            ...base,
            image: `${prefix}${state[0].toUpperCase()}${state.slice(1)}`,
            frames: frames[state] || frames.run || 1,
            fps
        });

        const animations = {
            idle: animation("idle", 5),
            walk: animation("walk", 7),
            run: animation("run", 8),
            attack: animation("attack", 10),
            jump: animation("jump", 8),
            hurt: animation("hurt", 10),
            dead: animation("dead", 8)
        };

        if (frames.shoot) {
            animations.shoot = animation("shoot", 10);
        }

        if (frames.idleAlt) {
            animations.idleAlt = animation("idleAlt", 5);
        }

        if (frames.reload) {
            animations.reload = animation("reload", 9);
        }

        if (frames.attack2) {
            animations.attack2 = animation("attack2", 10);
        }

        if (frames.attack3) {
            animations.attack3 = animation("attack3", 10);
        }

        if (frames.throw) {
            animations.throw = animation("throw", 9);
        }

        return animations;
    }

    const enemyTypes = {
        ovad: { name: "Ovad", hp: 3, w: 42, h: 30, speed: 74, flying: true, color: "#f6d15b", score: 80, shoot: false },
        waterfly: { name: "Water Fly", hp: 2, w: 34, h: 26, speed: 96, flying: true, color: "#67e8f9", score: 70, shoot: true, shot: "bubble" },
        skeeter: { name: "Skeeter", hp: 2, w: 28, h: 24, speed: 120, flying: true, color: "#e8ff94", score: 60, shoot: false },
        slime: { name: "Bog Slime", hp: 5, w: 54, h: 36, speed: 42, flying: false, color: "#7fe36c", score: 110, shoot: true, shot: "poison" },
        forestShroom: {
            name: "Forest Shroom",
            hp: 5,
            w: 42,
            h: 48,
            speed: 54,
            flying: false,
            color: "#f2704f",
            score: 120,
            shoot: false,
            sprite: { image: "monsterForestMushroomRun", frameW: 64, frameH: 64, frames: 10, fps: 10, drawW: 56, drawH: 88, offsetY: 1 }
        },
        sporeShroom: {
            name: "Spore Shroom",
            hp: 6,
            w: 54,
            h: 56,
            speed: 48,
            flying: false,
            color: "#bd5d69",
            score: 150,
            shoot: true,
            shot: "poison",
            sprite: { image: "monsterMushroomRun", frameW: 150, frameH: 150, frames: 8, fps: 9, drawW: 250, drawH: 210, offsetY: 70 }
        },
        dungling: { name: "Dungling", hp: 5, w: 48, h: 42, speed: 52, flying: false, color: "#815022", score: 120, shoot: false },
        fly: { name: "Fat Fly", hp: 4, w: 44, h: 34, speed: 82, flying: true, color: "#b4a089", score: 90, shoot: true, shot: "spit" },
        flyingEye: {
            name: "Flying Eye",
            hp: 4,
            w: 48,
            h: 36,
            speed: 104,
            flying: true,
            color: "#d9a36b",
            score: 130,
            shoot: true,
            shot: "spark",
            sprite: { image: "monsterFlyingEyeFlight", frameW: 150, frameH: 150, frames: 8, fps: 10, drawW: 190, drawH: 160, offsetY: 0 }
        },
        nightBat: {
            name: "Night Bat",
            hp: 3,
            w: 58,
            h: 36,
            speed: 118,
            flying: true,
            color: "#9b2d45",
            score: 115,
            shoot: false,
            sprite: { image: "monsterBatFly", frameW: 87, frameH: 87, frames: 11, fps: 12, drawW: 76, drawH: 64, offsetY: 0 }
        },
        gangster1: {
            name: "Gangster",
            hp: 5,
            w: 78,
            h: 112,
            speed: 42,
            flying: false,
            color: "#c8ccd8",
            score: 120,
            shoot: true,
            shot: "gangster",
            ranged: true,
            melee: true,
            meleeDamage: 1,
            gangsterRole: "pistol",
            magazine: 4,
            reloadDuration: 1.75,
            shootCooldown: [0.82, 1.28],
            preferredRange: 0.62,
            animations: humanAnimations("gangster1", 216, 216, 14, { idle: 6, idleAlt: 11, walk: 10, run: 10, shoot: 4, reload: 17, attack: 3, jump: 10, hurt: 5, dead: 5 })
        },
        gangster2: {
            name: "Street Brawler",
            hp: 6,
            w: 80,
            h: 114,
            speed: 58,
            flying: false,
            color: "#b7c4d6",
            score: 135,
            shoot: false,
            ranged: false,
            melee: true,
            meleeDamage: 1,
            gangsterRole: "brawler",
            attackCooldown: [0.7, 1.05],
            combo: ["attack", "attack2", "attack3"],
            animations: humanAnimations("gangster2", 220, 220, 14, { idle: 7, idleAlt: 13, walk: 10, run: 10, attack: 6, attack2: 4, attack3: 6, jump: 10, hurt: 4, dead: 5 })
        },
        gangster3: {
            name: "City Bruiser",
            hp: 7,
            w: 84,
            h: 118,
            speed: 36,
            flying: false,
            color: "#d2c4a8",
            score: 150,
            shoot: true,
            shot: "gangsterHeavy",
            ranged: true,
            melee: true,
            meleeDamage: 1,
            gangsterRole: "heavy",
            magazine: 3,
            reloadDuration: 0.72,
            shootCooldown: [1.18, 1.8],
            preferredRange: 0.72,
            animations: humanAnimations("gangster3", 224, 224, 14, { idle: 7, idleAlt: 14, walk: 10, run: 10, shoot: 12, reload: 6, attack: 5, jump: 10, hurt: 4, dead: 5 })
        },
        homeless1: {
            name: "Street Drifter",
            hp: 4,
            w: 76,
            h: 110,
            speed: 58,
            flying: false,
            color: "#b69b72",
            score: 105,
            shoot: false,
            melee: true,
            meleeDamage: 1,
            molotov: true,
            animations: humanAnimations("homeless1", 208, 208, 14, { idle: 6, walk: 8, run: 8, attack: 5, throw: 3, jump: 16, hurt: 3, dead: 4 })
        },
        homeless2: {
            name: "Backstreet Drifter",
            hp: 5,
            w: 78,
            h: 112,
            speed: 54,
            flying: false,
            color: "#a88b68",
            score: 115,
            shoot: false,
            melee: true,
            meleeDamage: 1,
            animations: humanAnimations("homeless2", 212, 212, 14, { idle: 7, walk: 8, run: 8, attack: 10, jump: 12, hurt: 3, dead: 4 })
        },
        homeless3: {
            name: "Alley Drifter",
            hp: 5,
            w: 78,
            h: 112,
            speed: 56,
            flying: false,
            color: "#b08d61",
            score: 115,
            shoot: false,
            melee: true,
            meleeDamage: 1,
            molotov: true,
            animations: humanAnimations("homeless3", 212, 212, 14, { idle: 6, walk: 8, run: 8, attack: 5, throw: 3, jump: 16, hurt: 3, dead: 4 })
        },
        roller: { name: "Roller", hp: 6, w: 48, h: 48, speed: 68, flying: false, color: "#5a3217", score: 140, shoot: true, shot: "dung" },
        stormbug: { name: "Storm Bug", hp: 5, w: 46, h: 32, speed: 112, flying: true, color: "#ffe66d", score: 140, shoot: true, shot: "spark" },
        voidfly: { name: "Void Fly", hp: 6, w: 44, h: 32, speed: 126, flying: true, color: "#9d8cff", score: 160, shoot: true, shot: "comet" },
        cometling: { name: "Cometling", hp: 7, w: 44, h: 44, speed: 88, flying: true, color: "#ff82e7", score: 180, shoot: true, shot: "comet" }
    };

    const save = loadSave();
    let daily = loadDailyState();
    let audioSettings = loadAudioSettings();
    const controls = {
        left: false,
        right: false,
        up: false,
        jump: false,
        down: false,
        fireHeld: false,
        pointerShoot: false,
        aimStickShoot: false,
        skill: false,
        action: false,
        actionPressed: false,
        grenade: false,
        grenadePressed: false,
        jumpPressed: false,
        aimX: 1,
        aimY: 0,
        aimActive: false,
        aimPointerId: null,
        moveStickActive: false,
        moveStickActionHeld: false,
        aimKeys: {
            left: false,
            right: false,
            up: false,
            down: false
        }
    };

    const view = { w: 1, h: 1, dpr: 1 };
    let lastFrame = 0;
    let overlay = "menu";
    let heroReturnScreen = "menu";
    let settingsReturnScreen = "menu";
    let wasPlayingBeforeHeroes = false;
    let wasPlayingBeforeSettings = false;

    const player = {
        x: 100,
        y: 0,
        w: 50,
        h: 62,
        vx: 0,
        vy: 0,
        dir: 1,
        hp: MAX_HP,
        onGround: false,
        invuln: 0,
        fireTimer: 0,
        weaponAnimTimer: 0,
        weaponAnimDuration: 0.12,
        skillTimer: 0,
        phaseTimer: 0,
        shieldTimer: 0,
        rapidTimer: 0,
        spreadTimer: 0,
        hoverTimer: 0,
        grenadeTimer: 0,
        grenades: 3,
        jumpsUsed: 0,
        flipTimer: 0,
        flipDuration: 0.62,
        flipProgress: 0,
        flipAngle: 0,
        flipDirection: 1,
        motoAngle: 0,
        motoAngularVelocity: 0,
        vehicle: null,
        bikeFuel: 0,
        nearbyBike: null
    };

    const run = {
        state: "menu",
        levelIndex: 0,
        mapIndex: 0,
        mapPage: 0,
        maxUnlockedLevel: 0,
        completedLevels: {},
        level: null,
        cameraX: 0,
        score: 0,
        time: 0,
        groundY: 0,
        waterY: 0,
        platforms: [],
        enemies: [],
        playerBullets: [],
        enemyBullets: [],
        hazards: [],
        trafficCars: [],
        particles: [],
        pickups: [],
        boss: null,
        message: "",
        messageTimer: 0,
        shake: 0,
        wind: 0,
        seed: 0,
        generationRng: null,
        cityPlan: null,
        cityBackground: null,
        motoTerrain: null,
        stats: { kills: 0, mushrooms: 0, progress: 0 }
    };

    function loadSave() {
        const fallback = {
            selectedHero: "rookie",
            mushrooms: 0,
            upgrades: { damage: 0, cooldown: 0, armor: 0, engine: 0, skill: 0, magnet: 0 }
        };

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return fallback;
            }

            const parsed = JSON.parse(raw);
            return {
                selectedHero: heroById && heroById[parsed.selectedHero] ? parsed.selectedHero : fallback.selectedHero,
                mushrooms: Number.isFinite(parsed.mushrooms) ? parsed.mushrooms : 0,
                upgrades: { ...fallback.upgrades, ...(parsed.upgrades || {}) }
            };
        } catch (error) {
            return fallback;
        }
    }

    function persistSave() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    }

    function dailyDateKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function loadDailyState() {
        const today = dailyDateKey();
        const fallback = { dateKey: today, progress: { kills: 0, mushrooms: 0, progress: 0 }, completed: {} };

        try {
            const raw = localStorage.getItem(DAILY_STORAGE_KEY);
            if (!raw) {
                return fallback;
            }

            const parsed = JSON.parse(raw);
            if (parsed.dateKey !== today) {
                return fallback;
            }

            return {
                dateKey: today,
                progress: { ...fallback.progress, ...(parsed.progress || {}) },
                completed: { ...(parsed.completed || {}) }
            };
        } catch (error) {
            return fallback;
        }
    }

    function persistDaily() {
        localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(daily));
    }

    function hashString(text) {
        let hash = 2166136261;
        for (let index = 0; index < text.length; index += 1) {
            hash ^= text.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function makeSeededRng(seed) {
        let state = seed >>> 0;
        return () => {
            state += 0x6d2b79f5;
            let value = state;
            value = Math.imul(value ^ (value >>> 15), value | 1);
            value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
            return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
        };
    }

    function genRand(min, max) {
        const source = run.generationRng || Math.random;
        return min + source() * (max - min);
    }

    function createCityRunPlan(seed) {
        const rng = makeSeededRng(seed);
        const modifier = cityRunModifiers[Math.floor(rng() * cityRunModifiers.length)] || cityRunModifiers[0];
        return {
            ...modifier,
            seed,
            label: seed.toString(16).toUpperCase().padStart(8, "0").slice(0, 8),
            trafficCount: modifier.trafficCount || 4,
            trafficSpeed: modifier.trafficSpeed || 1,
            pickupStep: modifier.pickupStep || 720,
            platformStart: 380 + Math.floor(rng() * 110),
            platformStep: 380 + Math.floor(rng() * 90),
            heightOffset: Math.floor(rng() * 42) - 18
        };
    }

    function createRunSeed(index) {
        return hashString(`${daily.dateKey}:level:${index}`);
    }

    function renderHearts(hp) {
        if (!ui.hearts) {
            return;
        }

        ui.hearts.innerHTML = "";
        for (let index = 0; index < MAX_HP; index += 1) {
            const img = document.createElement("img");
            img.alt = index < hp ? "Full heart" : "Empty heart";
            img.src = index < hp ? imagePaths.uiHeartFull : imagePaths.uiHeartEmpty;
            ui.hearts.appendChild(img);
        }
    }

    function renderDailyOps() {
        if (ui.dailySeed) {
            const seed = hashString(`${daily.dateKey}:level:0`).toString(16).toUpperCase().padStart(8, "0").slice(0, 8);
            ui.dailySeed.textContent = `${daily.dateKey} · City seed ${seed}`;
        }

        const renderGoal = (goal) => {
            const value = Math.min(goal.goal, Math.floor(daily.progress[goal.stat] || 0));
            const done = Boolean(daily.completed[goal.id]);
            const icon = done ? imagePaths.uiCheck : imagePaths.uiStar;
            return `
                <div class="daily-item${done ? " is-complete" : ""}">
                    <img src="${icon}" alt="">
                    <div>
                        <strong>${goal.label}</strong>
                        <span>${value}/${goal.goal} · +${goal.reward} mushrooms</span>
                    </div>
                </div>
            `;
        };

        if (ui.dailyList) {
            ui.dailyList.innerHTML = dailyGoals.map(renderGoal).join("");
        }
        if (ui.dailyHudList) {
            ui.dailyHudList.innerHTML = dailyGoals.map((goal) => {
                const value = Math.min(goal.goal, Math.floor(daily.progress[goal.stat] || 0));
                const done = Boolean(daily.completed[goal.id]);
                return `<span class="${done ? "is-complete" : ""}">${value}/${goal.goal}</span>`;
            }).join("");
        }
    }

    function recordDailyProgress(stat, amount, absolute = false) {
        if (!run.level || run.level.biome !== "city") {
            return;
        }

        const current = daily.progress[stat] || 0;
        const next = absolute ? Math.max(current, amount) : current + amount;
        if (next === current) {
            return;
        }

        daily.progress[stat] = next;
        let completedGoal = null;
        dailyGoals.forEach((goal) => {
            if (goal.stat === stat && !daily.completed[goal.id] && next >= goal.goal) {
                daily.completed[goal.id] = true;
                completedGoal = goal;
            }
        });

        if (completedGoal) {
            save.mushrooms += completedGoal.reward;
            persistSave();
            showMessage(`Daily complete: ${completedGoal.label}`);
        }

        persistDaily();
        renderDailyOps();
    }

    function loadAudioSettings() {
        try {
            const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
            if (!raw) {
                return { ...DEFAULT_AUDIO_SETTINGS };
            }

            const parsed = JSON.parse(raw);
            return {
                master: audioSettingValue(parsed.master, DEFAULT_AUDIO_SETTINGS.master),
                sfx: audioSettingValue(parsed.sfx, DEFAULT_AUDIO_SETTINGS.sfx),
                shots: audioSettingValue(parsed.shots, DEFAULT_AUDIO_SETTINGS.shots),
                music: audioSettingValue(parsed.music, DEFAULT_AUDIO_SETTINGS.music)
            };
        } catch (error) {
            return { ...DEFAULT_AUDIO_SETTINGS };
        }
    }

    function audioSettingValue(value, fallback) {
        return Number.isFinite(value) ? clamp(value, 0, 1) : fallback;
    }

    function persistAudioSettings() {
        localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(audioSettings));
    }

    function currentHero() {
        return heroById[save.selectedHero] || heroes[0];
    }

    function currentWeapon(hero = currentHero()) {
        return weaponCatalog[heroWeapons[hero.id]] || weaponCatalog.glock;
    }

    function playerWeaponRange(hero = currentHero()) {
        const weapon = currentWeapon(hero);
        const baseRange = playerBulletRanges[hero.bullet] || playerBulletRanges.normal;
        return clamp(baseRange * (weapon.speedMod || 1), 420, 1250);
    }

    function meleeEnemyAggroRange(hero = currentHero()) {
        return playerWeaponRange(hero) * 1.5;
    }

    function currentSkillCooldown() {
        return Math.max(3.8, 7.2 - save.upgrades.skill * 0.8);
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function gameplayWorldScale() {
        return run.level?.motoRun ? MOTO_WORLD_SCALE : 1;
    }

    function visibleWorldWidth() {
        return view.w / gameplayWorldScale();
    }

    function worldBottomOffset() {
        return view.h * (1 - gameplayWorldScale());
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function rectsOverlap(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function entityRect(entity) {
        if (entity === player) {
            return playerCollisionRect();
        }

        return { x: entity.x, y: entity.y, w: entity.w, h: entity.h };
    }

    function enemyVisibleForCombat(enemy) {
        const left = run.cameraX + 18;
        const right = run.cameraX + visibleWorldWidth() - 32;
        return enemy.x + enemy.w > left && enemy.x < right;
    }

    function playerFootExtension() {
        return player.vehicle === "kayak" ? 12 : FOOT_EXTENSION;
    }

    function playerFootBottom() {
        return player.y + player.h + playerFootExtension();
    }

    function cityRoadBottomY() {
        return Math.min(view.h - 24, run.groundY + CITY_ROAD_LANE_GAP);
    }

    function cityTrafficLaneBottom(lane) {
        return lane === "lower"
            ? cityRoadBottomY()
            : Math.min(cityRoadBottomY() - 30, run.groundY + 96);
    }

    function motoRoadBaseY() {
        const hudClearance = view.w <= 720 ? 118 : 104;
        const target = view.h * (view.w <= 720 ? 0.66 : 0.63);
        return clamp(target, hudClearance, Math.max(hudClearance, run.groundY + 34));
    }

    function createMotoTerrain(level, seed) {
        const rng = makeSeededRng(hashString(`moto-terrain:${level.id}:${seed}`));
        const points = [];
        const roadBaseY = motoRoadBaseY();
        const minY = roadBaseY - 34;
        const maxY = roadBaseY + 52;
        let y = roadBaseY;
        let targetY = y;

        for (let x = -MOTO_TERRAIN_STEP * 2, index = 0; x <= level.width + MOTO_TERRAIN_STEP * 4; x += MOTO_TERRAIN_STEP, index += 1) {
            if (x < 640) {
                targetY = roadBaseY;
            } else if (index % 4 === 0) {
                const roadWave = Math.sin(x * 0.0017 + seed * 0.00001) * 24;
                targetY = clamp(roadBaseY + roadWave + (rng() - 0.5) * 46, minY, maxY);
            }

            y += (targetY - y) * 0.34;
            const ripple = Math.sin(x * 0.006 + seed * 0.00003) * 3;
            points.push({ x, y: clamp(y + ripple, minY, maxY) });
        }

        return points;
    }

    function motoTerrainY(x) {
        const points = run.motoTerrain;
        if (!points || points.length < 2) {
            return run.groundY;
        }

        if (x <= points[0].x) {
            return points[0].y;
        }

        for (let index = 0; index < points.length - 1; index += 1) {
            const a = points[index];
            const b = points[index + 1];
            if (x >= a.x && x <= b.x) {
                const t = (x - a.x) / Math.max(1, b.x - a.x);
                const smooth = t * t * (3 - 2 * t);
                return a.y + (b.y - a.y) * smooth;
            }
        }

        return points[points.length - 1].y;
    }

    function motoTerrainSlope(x) {
        const span = 18;
        return (motoTerrainY(x + span) - motoTerrainY(x - span)) / (span * 2);
    }

    function normalizeAngle(angle) {
        let value = angle;
        while (value > Math.PI) {
            value -= Math.PI * 2;
        }
        while (value < -Math.PI) {
            value += Math.PI * 2;
        }
        return value;
    }

    function cityPlayerTrafficDepth() {
        const depth = playerFootBottom();

        if (depth < run.groundY - 6 || depth > cityRoadBottomY() + 10) {
            return null;
        }

        return depth;
    }

    function trafficDepthMatches(car) {
        const playerDepth = cityPlayerTrafficDepth();
        if (playerDepth === null) {
            return false;
        }

        return Math.abs(playerDepth - cityTrafficLaneBottom(car.lane)) <= 34;
    }

    function trafficXOverlaps(car) {
        return player.x + player.w * 0.78 > car.x + 18 && player.x + player.w * 0.22 < car.x + car.w - 18;
    }

    function landPlayerOn(surfaceY) {
        player.y = surfaceY - player.h - playerFootExtension();
        player.vy = 0;
        player.onGround = true;
    }

    function isPlayerOnCityRoad() {
        if (!run.level || run.level.biome !== "city") {
            return false;
        }

        const footBottom = playerFootBottom();
        return player.onGround && footBottom >= run.groundY - 4 && footBottom <= cityRoadBottomY() + 8;
    }

    function playerCollisionRect() {
        const extension = playerFootExtension();
        return {
            x: player.x,
            y: player.y,
            w: player.w,
            h: player.h + extension
        };
    }

    function audioVolume(volume, channel = "sfx") {
        const channelVolume = channel === "music"
            ? audioSettings.music
            : channel === "shots"
                ? audioSettings.sfx * audioSettings.shots
                : audioSettings.sfx;

        return clamp(volume * audioSettings.master * channelVolume, 0, 1);
    }

    function playAudio(name, volume = 0.45, channel = "sfx") {
        const element = audio[name];
        if (!element) {
            return;
        }

        try {
            element.volume = audioVolume(volume, channel);
            element.currentTime = 0;
            element.play().catch(() => {});
        } catch (error) {
            // Browser audio can be blocked until the first user gesture.
        }
    }

    function applyAudioSettings() {
        if (audio.music) {
            audio.music.volume = audioVolume(0.18, "music");
        }

        renderAudioSettings();
    }

    function startMusic() {
        try {
            audio.music.volume = audioVolume(0.18, "music");
            audio.music.play().catch(() => {});
        } catch (error) {
            // Ignore autoplay restrictions.
        }
    }

    function resizeCanvas() {
        view.dpr = Math.min(window.devicePixelRatio || 1, 2);
        view.w = Math.max(320, canvas.clientWidth);
        view.h = Math.max(360, canvas.clientHeight);
        canvas.width = Math.round(view.w * view.dpr);
        canvas.height = Math.round(view.h * view.dpr);
        ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);

        if (run.level) {
            const previousGround = run.groundY || view.h - 112;
            setLevelY();
            if (run.level.motoRun) {
                run.motoTerrain = createMotoTerrain(run.level, run.seed);
            }
            const delta = run.groundY - previousGround;
            player.y += delta;
            run.platforms.forEach((platform) => {
                platform.y += delta;
            });
            run.enemies.forEach((enemy) => {
                if (!enemy.flying) {
                    enemy.y += delta;
                    enemy.baseY += delta;
                }
            });
        }
    }

    function setLevelY() {
        const level = run.level || levels[0];
        const reserve = gameplayBottomReserve();
        run.groundY = level.vehicle === "kayak" ? view.h - reserve + 32 : view.h - reserve;
        run.waterY = level.vehicle === "kayak" ? view.h - reserve - 4 : view.h - reserve - 44;
    }

    function gameplayBottomReserve() {
        if (view.w <= 720) {
            return 200;
        }

        if (view.w <= 980) {
            return 132;
        }

        return 112;
    }

    function showScreen(name) {
        overlay = name;
        Object.entries(screens).forEach(([key, element]) => {
            element.classList.toggle("is-active", key === name);
        });
        if (name === "map") {
            renderWorldMap();
        }
    }

    function currentMapLevel() {
        return levels[clamp(run.mapIndex, 0, levels.length - 1)] || levels[0];
    }

    function mapPageForIndex(index) {
        return Math.floor(clamp(index, 0, levels.length - 1) / LEVELS_PER_LOCATION);
    }

    function maxMapPage() {
        return Math.max(0, Math.ceil(levels.length / LEVELS_PER_LOCATION) - 1);
    }

    function levelMapLabel(level) {
        return `${level.locationShortName} ${level.stageNumber}/${LEVELS_PER_LOCATION}`;
    }

    function showWorldMap() {
        run.state = "map";
        run.mapPage = mapPageForIndex(run.mapIndex);
        showScreen("map");
        startMusic();
        updateHud();
    }

    function renderWorldMap() {
        if (!ui.worldMap) {
            return;
        }

        const hero = currentHero();
        const heroSrc = imagePaths[hero.image] || imagePaths.rookie;
        const pageCount = maxMapPage() + 1;
        run.mapPage = clamp(Number.isFinite(run.mapPage) ? run.mapPage : mapPageForIndex(run.mapIndex), 0, pageCount - 1);
        const pageStart = run.mapPage * LEVELS_PER_LOCATION;
        const pageLevels = levels.slice(pageStart, pageStart + LEVELS_PER_LOCATION);
        const pageLevel = pageLevels[0] || levels[0];
        const selected = currentMapLevel();
        ui.mapEyebrow.textContent = `Page ${run.mapPage + 1}/${pageCount}`;
        ui.mapTitle.textContent = pageLevel.locationName;
        ui.mapSubtitle.textContent = `${levelMapLabel(selected)} - ${selected.mapName}${selected.isBossLevel ? " boss stage" : " route stage"}`;
        ui.mapStartButton.textContent = selected.isBossLevel ? "Start Boss Stage" : "Start Level";
        ui.mapStartButton.disabled = run.mapIndex > run.maxUnlockedLevel;

        const nodes = pageLevels.map((level, pageOffset) => {
            const index = pageStart + pageOffset;
            const complete = Boolean(run.completedLevels[level.id]);
            const current = index === run.mapIndex;
            const locked = index > run.maxUnlockedLevel;
            const classes = [
                "map-node",
                complete ? "is-complete" : "",
                current ? "is-current" : "",
                locked ? "is-locked" : "",
                level.isBossLevel ? "is-boss" : ""
            ].filter(Boolean).join(" ");

            return `
                <button class="${classes}" data-map-index="${index}" data-biome="${level.biome}" type="button" ${locked ? "disabled" : ""}>
                    ${current ? `<img class="map-avatar" src="${heroSrc}" alt="">` : ""}
                    <small>${levelMapLabel(level)}</small>
                    <strong>${level.mapName}</strong>
                    <span>${complete ? "Cleared" : locked ? "Locked" : level.isBossLevel ? "Boss" : "Route"}</span>
                </button>
            `;
        }).join("");

        ui.worldMap.innerHTML = `
            <div class="map-page-title">
                <strong>${pageLevel.locationShortName} routes</strong>
                <span>${pageStart + 1}-${Math.min(pageStart + LEVELS_PER_LOCATION, levels.length)} / ${levels.length}</span>
            </div>
            <div class="map-page-grid">${nodes}</div>
            <div class="map-page-nav">
                <button class="map-page-button" data-map-page="prev" type="button" ${run.mapPage <= 0 ? "disabled" : ""}>Prev</button>
                <span>${run.mapPage + 1}/${pageCount}</span>
                <button class="map-page-button" data-map-page="next" type="button" ${run.mapPage >= pageCount - 1 ? "disabled" : ""}>Next</button>
            </div>
        `;

        ui.worldMap.querySelectorAll("[data-map-index]").forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.mapIndex);
                if (index > run.maxUnlockedLevel) {
                    return;
                }
                run.mapIndex = index;
                renderWorldMap();
            });
        });
        ui.worldMap.querySelectorAll("[data-map-page]").forEach((button) => {
            button.addEventListener("click", () => {
                const direction = button.dataset.mapPage === "next" ? 1 : -1;
                run.mapPage = clamp(run.mapPage + direction, 0, pageCount - 1);
                run.mapIndex = clamp(run.mapPage * LEVELS_PER_LOCATION, 0, levels.length - 1);
                renderWorldMap();
            });
        });
    }

    function openHeroes(returnScreen) {
        heroReturnScreen = returnScreen || "menu";
        wasPlayingBeforeHeroes = run.state === "playing";
        if (wasPlayingBeforeHeroes) {
            run.state = "paused";
        }
        renderHeroGrid();
        renderUpgrades();
        showScreen("heroes");
    }

    function closeHeroes() {
        if (wasPlayingBeforeHeroes && heroReturnScreen === "pause") {
            showPause();
            return;
        }
        showScreen(heroReturnScreen);
    }

    function openSettings(returnScreen) {
        settingsReturnScreen = returnScreen || "menu";
        wasPlayingBeforeSettings = run.state === "playing";
        if (wasPlayingBeforeSettings) {
            run.state = "paused";
        }
        renderAudioSettings();
        showScreen("settings");
    }

    function closeSettings() {
        if (wasPlayingBeforeSettings && settingsReturnScreen === "pause") {
            showPause();
            return;
        }
        showScreen(settingsReturnScreen);
    }

    function renderAudioSettings() {
        Object.entries(ui.volumeInputs).forEach(([key, input]) => {
            const value = Math.round((audioSettings[key] ?? 1) * 100);
            if (input) {
                input.value = String(value);
            }
            if (ui.volumeValues[key]) {
                ui.volumeValues[key].textContent = `${value}%`;
            }
        });
    }

    function setAudioSetting(name, value) {
        audioSettings[name] = clamp(Number(value) / 100, 0, 1);
        persistAudioSettings();
        applyAudioSettings();
    }

    function bindVolumeInput(key, input) {
        if (!input) {
            return;
        }

        const updateFromPointer = (event) => {
            const rect = input.getBoundingClientRect();
            if (rect.width <= 0) {
                return;
            }

            const percent = clamp((event.clientX - rect.left) / rect.width, 0, 1);
            const value = Math.round(percent * 100);
            input.value = String(value);
            setAudioSetting(key, value);
        };

        const stopDrag = (event) => {
            input.removeEventListener("pointermove", updateFromPointer);
            input.removeEventListener("pointerup", stopDrag);
            input.removeEventListener("pointercancel", stopDrag);
            input.removeEventListener("lostpointercapture", stopDrag);

            try {
                if (input.hasPointerCapture && input.hasPointerCapture(event.pointerId)) {
                    input.releasePointerCapture(event.pointerId);
                }
            } catch (error) {
                // Pointer capture can already be gone on some mobile browsers.
            }
        };

        input.addEventListener("input", () => setAudioSetting(key, input.value));
        input.addEventListener("change", () => setAudioSetting(key, input.value));
        input.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            input.focus();
            if (input.setPointerCapture) {
                input.setPointerCapture(event.pointerId);
            }
            updateFromPointer(event);
            input.addEventListener("pointermove", updateFromPointer);
            input.addEventListener("pointerup", stopDrag);
            input.addEventListener("pointercancel", stopDrag);
            input.addEventListener("lostpointercapture", stopDrag);
        });
    }

    function showPause() {
        if (run.level) {
            run.state = "paused";
            const detail = run.level.boss ? run.level.boss.mechanic : "Reach the map exit";
            ui.pauseZone.textContent = `${run.level.name} - ${detail}`;
        }
        showScreen("pause");
    }

    function resumeGame() {
        if (!run.level) {
            showScreen("menu");
            return;
        }
        run.state = "playing";
        showScreen(null);
    }

    function resetSave() {
        if (!window.confirm("Reset local progress for this MVP?")) {
            return;
        }

        localStorage.removeItem(STORAGE_KEY);
        save.selectedHero = "rookie";
        save.mushrooms = 0;
        save.upgrades = { damage: 0, cooldown: 0, armor: 0, engine: 0, skill: 0, magnet: 0 };
        renderHeroGrid();
        renderUpgrades();
        updateHud();
    }

    function renderHeroGrid() {
        ui.heroGrid.innerHTML = "";
        heroes.forEach((hero) => {
            const card = document.createElement("article");
            card.className = `hero-card${hero.id === save.selectedHero ? " is-selected" : ""}`;
            card.innerHTML = `
                <div class="hero-row">
                    <img src="${imagePaths[hero.image]}" alt="">
                    <div>
                        <h3>${hero.name}</h3>
                        <p>${currentWeapon(hero).name} - ${hero.weapon}</p>
                    </div>
                </div>
                <p>${hero.perk}</p>
                <button type="button">${hero.id === save.selectedHero ? "Selected" : "Select"}</button>
            `;
            card.querySelector("button").addEventListener("click", () => {
                save.selectedHero = hero.id;
                persistSave();
                renderHeroGrid();
                updateHud();
            });
            ui.heroGrid.appendChild(card);
        });
    }

    function renderUpgrades() {
        ui.upgradeHint.textContent = `Mushrooms: ${Math.floor(save.mushrooms)}`;
        ui.upgradeGrid.innerHTML = "";
        upgrades.forEach((upgrade) => {
            const level = save.upgrades[upgrade.id] || 0;
            const cost = upgrade.cost(level);
            const button = document.createElement("button");
            button.type = "button";
            button.disabled = level >= upgrade.max || save.mushrooms < cost;
            button.innerHTML = `${upgrade.name} ${level}/${upgrade.max}<br>${level >= upgrade.max ? "Max" : `${cost} mushrooms`}<br>${upgrade.text}`;
            button.addEventListener("click", () => {
                if (level >= upgrade.max || save.mushrooms < cost) {
                    return;
                }

                save.mushrooms -= cost;
                save.upgrades[upgrade.id] = level + 1;
                persistSave();
                renderUpgrades();
                updateHud();
            });
            ui.upgradeGrid.appendChild(button);
        });
    }

    function startCampaign() {
        run.score = 0;
        run.levelIndex = 0;
        run.mapIndex = 0;
        run.maxUnlockedLevel = 0;
        run.completedLevels = {};
        run.level = null;
        showWorldMap();
    }

    function startLevel(index) {
        resizeCanvas();
        const level = levels[index];
        run.state = "playing";
        run.levelIndex = index;
        run.level = level;
        run.cameraX = 0;
        run.time = 0;
        run.seed = createRunSeed(index);
        run.cityPlan = level.biome === "city" ? createCityRunPlan(run.seed) : null;
        run.cityBackground = level.biome === "city" ? cityLevelBackground(level.stageIndex, level.locationIndex, run.seed) : null;
        run.motoTerrain = null;
        run.generationRng = run.cityPlan ? makeSeededRng(run.seed) : null;
        run.stats = { kills: 0, mushrooms: 0, progress: 0 };
        run.message = "";
        run.messageTimer = 0;
        run.wind = 0;
        setLevelY();
        run.motoTerrain = level.motoRun ? createMotoTerrain(level, run.seed) : null;

        player.x = level.motoRun ? 145 : 92;
        player.w = 50;
        player.h = 62;
        player.vx = 0;
        player.vy = 0;
        player.dir = 1;
        controls.aimX = 1;
        controls.aimY = 0;
        controls.aimActive = false;
        controls.fireHeld = false;
        controls.pointerShoot = false;
        controls.aimStickShoot = false;
        controls.moveStickActive = false;
        controls.moveStickActionHeld = false;
        player.hp = MAX_HP;
        player.invuln = 1.2;
        player.fireTimer = 0;
        player.weaponAnimTimer = 0;
        player.skillTimer = 0;
        player.phaseTimer = 0;
        player.shieldTimer = 0;
        player.rapidTimer = 0;
        player.spreadTimer = 0;
        player.hoverTimer = 0;
        player.grenadeTimer = 0;
        player.grenades = level.biome === "city" ? 4 : 3;
        player.jumpsUsed = 0;
        player.flipTimer = 0;
        player.flipProgress = 0;
        player.flipAngle = 0;
        player.flipDirection = 1;
        player.motoAngle = 0;
        player.motoAngularVelocity = 0;
        player.nearbyBike = null;
        player.vehicle = level.vehicle === "kayak" ? "kayak" : level.motoRun ? "bike" : null;
        player.bikeFuel = level.motoRun ? 999 : 0;
        player.y = player.vehicle === "kayak"
            ? run.waterY - 68
            : level.motoRun
                ? motoTerrainY(player.x + player.w / 2) - player.h - 17
                : run.groundY - player.h - playerFootExtension();

        run.platforms = createPlatforms(level);
        run.enemies = createEnemies(level);
        run.pickups = createPickups(level);
        run.playerBullets = [];
        run.enemyBullets = [];
        run.hazards = [];
        run.trafficCars = createTrafficCars(level);
        run.particles = [];
        run.boss = createBoss(level);
        run.generationRng = null;
        showScreen(null);
        startMusic();
        renderDailyOps();
        updateHud();
    }

    function createPlatforms(level) {
        if (level.vehicle === "kayak") {
            return [];
        }

        if (level.motoRun) {
            return [];
        }

        if (level.biome === "city") {
            const cityPlatforms = createCityRoofPlatforms(level);
            const plan = run.cityPlan || {};
            const heights = [120, 205, 148, 240, 135, 218, 156, 228];
            let platformIndex = 0;

            for (let x = plan.platformStart || 420; x < level.width - 620; x += plan.platformStep || 430) {
                const isAwning = platformIndex % 2 === 0;
                const height = heights[platformIndex % heights.length] + (plan.heightOffset || 0) + genRand(-18, 18);
                const platform = {
                    x: x + genRand(-24, 24),
                    y: height,
                    w: isAwning ? 170 + (platformIndex % 3) * 22 + genRand(-8, 18) : 205 + (platformIndex % 4) * 14 + genRand(-10, 24),
                    kind: isAwning ? "cityAwning" : "cityRoad",
                    sprite: isAwning ? (platformIndex % 4 === 0 ? "awningRed" : "awningBlue") : null
                };

                cityPlatforms.push({
                    x: platform.x,
                    y: run.groundY - platform.y,
                    w: platform.w,
                    h: 18,
                    kind: platform.kind,
                    sprite: platform.sprite,
                    color: platform.kind === "cityRoad" ? "#2f3540" : "#5a6a76"
                });
                platformIndex += 1;
            }

            return cityPlatforms;
        }

        const platforms = [];
        let x = 460;
        while (x < level.width - 850) {
            const width = rand(130, 230);
            platforms.push({
                x,
                y: run.groundY - rand(105, 245),
                w: width,
                h: 16,
                color: level.biome === "space" ? "#8e7cff" : level.biome === "sky" ? "#e6fbff" : level.ground
            });
            x += rand(330, 520);
        }
        return platforms;
    }

    function cityBuildingLayout(gridX) {
        const index = Math.abs(Math.floor(gridX / CITY_BUILDING_SPACING));
        const name = CITY_BUILDING_NAMES[index % CITY_BUILDING_NAMES.length];
        const sprite = citySprites[name];
        const scale = 0.88 + (index % 3) * 0.08;
        const w = sprite.w * scale;
        const h = sprite.h * scale;
        const drawX = gridX + (index % 2) * 34;
        const drawY = run.groundY - 54 - h;

        return { index, name, sprite, scale, w, h, drawX, drawY };
    }

    function createCityRoofPlatforms(level) {
        const platforms = [];

        for (let x = 0; x < level.width - 160; x += CITY_BUILDING_SPACING) {
            const building = cityBuildingLayout(x);
            platforms.push({
                x: building.drawX + 12,
                y: building.drawY + 10,
                w: Math.max(128, building.w - 24),
                h: 26,
                kind: "cityRoof",
                color: "#29313d"
            });
        }

        return platforms;
    }

    function createTrafficCars(level) {
        if (level.biome !== "city") {
            return [];
        }

        if (level.motoRun) {
            return createMotoTrafficCars(level);
        }

        const sprites = ["redCar", "policeCar", "cityBus", "ambulance", "foodTruck"];
        const cars = [];
        const plan = run.cityPlan || {};
        const count = plan.trafficCount || 6;
        const safeStart = 1750;
        const usableWidth = Math.max(1000, level.width - safeStart - 900);

        for (let index = 0; index < count; index += 1) {
            const spriteName = sprites[index % sprites.length];
            const sprite = citySprites[spriteName];
            const lane = index % 2 === 0 ? "upper" : "lower";
            const direction = lane === "upper" ? -1 : 1;
            const speed = direction * (150 + (index % 4) * 22) * (plan.trafficSpeed || 1);

            cars.push({
                sprite: spriteName,
                lane,
                x: safeStart + (usableWidth / count) * index + genRand(-90, 210),
                y: cityTrafficCarY(sprite, lane),
                w: sprite.w,
                h: sprite.h,
                vx: speed,
                flip: direction > 0,
                hp: trafficCarMaxHp(spriteName),
                maxHp: trafficCarMaxHp(spriteName),
                destroyed: false,
                respawnTimer: 0,
                hitCooldown: 0,
                graffitiSeed: `car-graffiti:${level.id}:${index}:${spriteName}`
            });
        }

        return cars;
    }

    function createMotoTrafficCars(level) {
        const sprites = ["redCar", "policeCar", "ambulance", "foodTruck"];
        const rng = makeSeededRng(hashString(`moto-cars:${level.id}:${run.seed}`));
        const cars = [];
        const count = 2 + (level.stageIndex >= 2 ? 1 : 0);
        const safeStart = 2150;
        const finishReserve = level.isBossLevel ? 1900 : 1300;
        const routeMin = safeStart;
        const routeMax = Math.max(routeMin + 900, level.width - finishReserve);
        const usableWidth = Math.max(900, routeMax - routeMin);

        for (let index = 0; index < count; index += 1) {
            const spriteName = sprites[(index + level.stageIndex) % sprites.length];
            const sprite = citySprites[spriteName] || citySprites.redCar;
            const scale = spriteName === "foodTruck" ? 0.82 : 0.9;
            const w = Math.round(sprite.w * scale);
            const h = Math.round(sprite.h * scale);
            const x = clamp(routeMin + usableWidth * ((index + 0.72) / (count + 0.35)) + (rng() - 0.5) * 460, routeMin, routeMax);
            const movementRoll = rng();
            const direction = rng() > 0.5 ? 1 : -1;
            const vx = movementRoll < 0.48 ? 0 : direction * (24 + rng() * 34);
            const y = motoTrafficCarY(x, w, h);

            cars.push({
                sprite: spriteName,
                lane: "moto",
                moto: true,
                x,
                y,
                w,
                h,
                vx,
                flip: vx > 0,
                angle: Math.atan(motoTerrainSlope(x + w / 2)) * 0.45,
                hp: trafficCarMaxHp(spriteName),
                maxHp: trafficCarMaxHp(spriteName),
                destroyed: false,
                respawnTimer: 0,
                hitCooldown: 0,
                routeMin,
                routeMax,
                homeX: x,
                graffitiSeed: `moto-car-graffiti:${level.id}:${index}:${spriteName}`
            });
        }

        return cars;
    }

    function motoTrafficCarY(x, w, h) {
        return motoTerrainY(x + w / 2) - h + 3;
    }

    function cityTrafficCarY(sprite, lane) {
        return cityTrafficLaneBottom(lane) - sprite.h;
    }

    function trafficCarMaxHp(spriteName) {
        switch (spriteName) {
            case "cityBus":
                return 12;
            case "foodTruck":
            case "ambulance":
                return 9;
            case "policeCar":
                return 7;
            default:
                return 6;
        }
    }

    function trafficCarDamageRect(car) {
        return {
            x: car.x + 8,
            y: car.y + car.h * 0.22,
            w: car.w - 16,
            h: car.h * 0.64
        };
    }

    function createEnemies(level) {
        const enemies = [];
        let x = 620;
        let index = 0;
        const deck = level.motoRun ? firstCityEnemyDeck : level.enemySet;
        const difficultyIndex = level.difficultyIndex ?? run.levelIndex;
        const cityGangLevel = level.biome === "city" && !level.motoRun;
        const roofPlatforms = cityGangLevel
            ? run.platforms.filter((platform) => platform.y > 205 && platform.w > 110 && platform.x > 360 && platform.x < level.width - 700)
            : [];
        let roofShooterIndex = 0;

        while (x < level.width - 980) {
            const kind = deck[index % deck.length];
            const spec = enemyTypes[kind];
            const flying = spec.flying || level.vehicle === "kayak";
            const isCityGangster = cityGangLevel && Boolean(spec.ranged);
            const isCityMelee = cityGangLevel && Boolean(spec.melee);
            let spawnX = x;
            let surfaceY = run.groundY;
            let stationary = false;
            let onRoof = false;

            if (level.motoRun && !flying) {
                spawnX += genRand(-80, 120);
                surfaceY = motoTerrainY(spawnX + spec.w / 2);
                stationary = Boolean(spec.ranged);
            } else if (isCityGangster) {
                stationary = true;
                if (roofPlatforms.length > 0 && index % 4 === 0) {
                    const roof = roofPlatforms[roofShooterIndex % roofPlatforms.length];
                    roofShooterIndex += 1;
                    spawnX = clamp(roof.x + roof.w * 0.5 + genRand(-roof.w * 0.18, roof.w * 0.18), roof.x + 16, roof.x + roof.w - spec.w - 16);
                    surfaceY = roof.y - 2;
                    onRoof = true;
                } else {
                    spawnX += genRand(-34, 34);
                }
            } else if (isCityMelee) {
                spawnX += genRand(-42, 42);
            }

            const y = flying ? genRand(120, Math.max(160, run.groundY - 180)) : surfaceY - spec.h;
            const levelScale = 1 + difficultyIndex * 0.12;
            enemies.push({
                kind,
                name: spec.name,
                x: spawnX,
                y,
                baseY: y,
                w: spec.w,
                h: spec.h,
                hp: Math.ceil(spec.hp * levelScale),
                maxHp: Math.ceil(spec.hp * levelScale),
                speed: spec.speed * (1 + difficultyIndex * 0.045),
                flying,
                color: spec.color,
                score: spec.score,
                shoot: spec.shoot,
                shot: spec.shot,
                ranged: Boolean(spec.ranged),
                melee: Boolean(spec.melee),
                meleeDamage: spec.meleeDamage || 1,
                molotovs: spec.molotov ? 1 : 0,
                gangsterRole: spec.gangsterRole || null,
                maxAmmo: spec.magazine || 0,
                ammo: spec.magazine || 0,
                reloadDuration: spec.reloadDuration || 0,
                reloadTimer: 0,
                attackCooldown: genRand(0.25, 1.25),
                meleeCooldown: spec.attackCooldown || null,
                shootCooldown: spec.shootCooldown || null,
                combo: spec.combo || null,
                comboIndex: 0,
                behaviorTimer: genRand(0.8, 2.4),
                strafeDir: genRand(0, 1) < 0.5 ? -1 : 1,
                preferredRange: spec.preferredRange || 0.62,
                stationary,
                anchorX: spawnX,
                surfaceY,
                onRoof,
                vy: 0,
                actionTimer: 0,
                animState: stationary ? "idle" : "walk",
                sprite: spec.sprite,
                animations: spec.animations,
                dir: stationary ? -1 : genRand(0, 1) < 0.5 ? -1 : 1,
                timer: genRand(0, 2),
                fireTimer: genRand(0.6, 2.6),
                frozen: 0
            });
            x += level.motoRun ? genRand(760, 1080) : cityGangLevel ? genRand(330, 520) : rand(250, 420);
            index += 1;
        }
        return enemies;
    }

    function createPickups(level) {
        const pickups = [];
        if (level.motoRun) {
            for (let x = 760; x < level.width - 900; x += 720) {
                const ground = motoTerrainY(x);
                pickups.push({ type: "mushroom", x: x + genRand(-80, 80), y: ground - genRand(96, 145), w: 32, h: 32, taken: false });
            }
            pickups.push({ type: "heart", x: level.width * 0.56, y: motoTerrainY(level.width * 0.56) - 142, w: 30, h: 30, taken: false });
            return pickups;
        }

        const mushroomStep = level.biome === "city" && run.cityPlan ? run.cityPlan.pickupStep : 720;
        let pickupIndex = 0;
        for (let x = 520; x < level.width - 1000; x += mushroomStep) {
            const rooftopPickup = level.biome === "city" && pickupIndex % 3 === 1;
            const y = rooftopPickup ? run.groundY - genRand(185, 330) : run.groundY - genRand(120, 260);
            pickups.push({ type: "mushroom", x: x + genRand(-70, 70), y, w: 32, h: 32, taken: false });
            pickupIndex += 1;
        }

        if (level.vehicle !== "kayak") {
            pickups.push({ type: "bike", x: Math.min(920, level.width * 0.25), y: run.groundY - 44, w: 86, h: 44, taken: false });
            if (level.biome === "city") {
                pickups.push({ type: "bike", x: level.width * 0.48, y: run.groundY - 44, w: 86, h: 44, taken: false });
            }
            if (level.biome === "sky" || level.biome === "dung") {
                pickups.push({ type: "bike", x: level.width * 0.58, y: run.groundY - 44, w: 86, h: 44, taken: false });
            }
        }

        pickups.push({ type: "heart", x: level.width * 0.52, y: run.groundY - 170, w: 30, h: 30, taken: false });
        return pickups;
    }

    function createBoss(level) {
        if (!level.boss) {
            return null;
        }

        return {
            active: false,
            dead: false,
            name: level.boss.name,
            pattern: level.boss.pattern,
            mechanic: level.boss.mechanic,
            color: level.boss.color,
            x: level.width - 600,
            y: level.vehicle === "kayak" ? run.waterY - 130 : run.groundY - 170,
            w: 132,
            h: 128,
            hp: level.boss.hp,
            maxHp: level.boss.hp,
            timer: 0,
            fireTimer: 1.2,
            specialTimer: 3.5,
            shieldTimer: 0,
            frozen: 0,
            dir: -1
        };
    }

    function update(dt) {
        if (run.state !== "playing" || !run.level) {
            return;
        }

        run.time += dt;
        run.messageTimer = Math.max(0, run.messageTimer - dt);
        run.shake = Math.max(0, run.shake - dt * 14);
        player.invuln = Math.max(0, player.invuln - dt);
        player.fireTimer = Math.max(0, player.fireTimer - dt);
        player.weaponAnimTimer = Math.max(0, player.weaponAnimTimer - dt);
        player.skillTimer = Math.max(0, player.skillTimer - dt);
        player.phaseTimer = Math.max(0, player.phaseTimer - dt);
        player.shieldTimer = Math.max(0, player.shieldTimer - dt);
        player.rapidTimer = Math.max(0, player.rapidTimer - dt);
        player.spreadTimer = Math.max(0, player.spreadTimer - dt);
        player.hoverTimer = Math.max(0, player.hoverTimer - dt);
        player.grenadeTimer = Math.max(0, player.grenadeTimer - dt);
        updateFlip(dt);

        updateAimFromKeys();

        if (isShooting()) {
            shoot();
        }

        if (controls.skill) {
            useSkill();
        }
        if (controls.grenadePressed) {
            throwGrenade();
        }

        updatePlayer(dt);
        updateBullets(dt);
        updateEnemies(dt);
        updateBoss(dt);
        updatePickups(dt);
        updateTrafficCars(dt);
        updateHazards(dt);
        updateParticles(dt);
        updateCamera();
        updateLevelExit();
        if (run.level.biome === "city") {
            const progress = Math.floor(clamp(player.x / run.level.width, 0, 1) * 100);
            run.stats.progress = Math.max(run.stats.progress, progress);
            recordDailyProgress("progress", progress, true);
        }
        updateHud();

        controls.actionPressed = false;
        controls.jumpPressed = false;
        controls.grenadePressed = false;
    }

    function updatePlayer(dt) {
        const hero = currentHero();
        player.nearbyBike = null;

        if (run.level.vehicle === "kayak") {
            updateKayak(dt, hero);
            return;
        }

        if (run.level.motoRun) {
            updateMotoRun(dt, hero);
            return;
        }

        if (controls.actionPressed && player.vehicle === "bike") {
            dismountBike("Bike parked");
        }

        const speedBase = player.vehicle === "bike" ? 430 : 245;
        const upgradeBoost = 1 + save.upgrades.engine * 0.04;
        const speed = speedBase * hero.speed * upgradeBoost;
        const accel = speed * 8;

        if (run.level.biome === "sky" && run.boss && run.boss.active) {
            run.wind = Math.sin(run.time * 1.2) * 92;
        } else {
            run.wind *= 0.9;
        }

        if (controls.left) {
            player.vx -= accel * dt;
            player.dir = -1;
        }
        if (controls.right) {
            player.vx += accel * dt;
            player.dir = 1;
        }

        player.vx += run.wind * dt;
        player.vx *= player.onGround ? FRICTION : 0.98;
        player.vx = clamp(player.vx, -speed, speed);

        const cityRoadWalking = isPlayerOnCityRoad();
        const gravityMod = run.level.biome === "space" ? 0.62 : 1;
        if (!cityRoadWalking) {
            player.vy += GRAVITY * gravityMod * dt;
        }

        if (controls.jumpPressed) {
            tryJump(hero);
        }

        if (player.hoverTimer > 0 && controls.jump) {
            player.vy -= 900 * dt;
        }

        if (cityRoadWalking && player.onGround && player.vy >= 0) {
            const roadMove = (controls.down ? 1 : 0) - (controls.up ? 1 : 0);
            const roadSpeed = player.vehicle === "bike" ? 230 : 165;
            const footExtension = playerFootExtension();
            player.vy = 0;
            player.y += roadMove * roadSpeed * dt;
            player.y = clamp(
                player.y,
                run.groundY - player.h - footExtension,
                cityRoadBottomY() - player.h - footExtension
            );
        }

        player.x += player.vx * dt;
        player.y += player.vy * dt;
        player.x = clamp(player.x, 24, run.level.width - player.w - 24);

        collideWithWorld();

        if (player.vehicle === "bike") {
            player.bikeFuel -= dt;
            if (player.bikeFuel <= 0) {
                dismountBike("Bike fuel empty");
            }
        }
    }

    function updateFlip(dt) {
        if (player.flipTimer <= 0) {
            if (player.onGround) {
                player.flipAngle = 0;
                player.flipProgress = 0;
            }
            return;
        }

        player.flipTimer = Math.max(0, player.flipTimer - dt);
        player.flipProgress = clamp(player.flipProgress + dt / player.flipDuration, 0, 1);
        player.flipAngle = player.flipDirection * Math.PI * 2 * player.flipProgress;

        if (player.flipTimer <= 0 && player.onGround) {
            player.flipAngle = 0;
            player.flipProgress = 0;
        }
    }

    function tryJump(hero) {
        if (player.onGround) {
            performJump(hero, false);
            return;
        }

        if (player.vehicle !== "bike" && player.jumpsUsed < 2) {
            performJump(hero, true);
        }
    }

    function performJump(hero, isDoubleJump) {
        const bikeMod = player.vehicle === "bike" ? 0.86 : 1;
        player.vy = (isDoubleJump ? -610 : -650) * hero.jump * bikeMod;
        player.onGround = false;
        player.jumpsUsed = isDoubleJump ? 2 : 1;
        playAudio("fly1", isDoubleJump ? 0.42 : 0.36);

        if (isDoubleJump) {
            player.flipTimer = player.flipDuration;
            player.flipProgress = 0;
            player.flipDirection = player.dir || 1;
            player.flipAngle = 0;
            player.vx += (player.dir || 1) * 80;
            addHitParticles(player.x + player.w / 2, player.y + player.h / 2, hero.color, 8);
            showMessage("Double flip");
        }
    }

    function updateMotoRun(dt, hero) {
        player.vehicle = "bike";
        player.nearbyBike = null;
        player.dir = 1;

        const gas = controls.right ? 1 : 0.34;
        const brake = controls.left ? 1 : 0;
        const lean = (controls.down ? 1 : 0) - (controls.up ? 1 : 0);
        const speedBoost = 1 + save.upgrades.engine * 0.04;
        const maxSpeed = 735 * hero.speed * speedBoost;
        const minCruise = 120;
        const centerX = player.x + player.w / 2;
        const slope = motoTerrainSlope(centerX);

        if (player.onGround) {
            player.vx += (gas * 860 - brake * 1120 + slope * 620) * dt;
            player.vx *= brake ? 0.982 : 0.996;
        } else {
            player.vx += (gas * 210 - brake * 240) * dt;
            player.motoAngularVelocity += lean * 4.5 * dt;
            player.motoAngularVelocity *= 0.985;
        }

        player.vx = clamp(player.vx, -150, maxSpeed);
        if (!brake && player.vx < minCruise) {
            player.vx += (minCruise - player.vx) * 0.6 * dt;
        }

        if (controls.jumpPressed && player.onGround) {
            player.vy = -520 - Math.min(155, Math.max(0, player.vx) * 0.18);
            player.onGround = false;
            player.jumpsUsed = 1;
            playAudio("fly1", 0.4);
        }

        player.vy += GRAVITY * 0.92 * dt;
        player.x += player.vx * dt;
        player.y += player.vy * dt;
        player.x = clamp(player.x, 24, run.level.width - player.w - 24);

        const groundY = motoTerrainY(player.x + player.w / 2);
        const wheelBottom = player.y + player.h + 17;
        const targetAngle = Math.atan(motoTerrainSlope(player.x + player.w / 2));

        if (wheelBottom >= groundY && player.vy >= -90) {
            const wasAirborne = !player.onGround;
            const landingDiff = Math.abs(normalizeAngle(player.motoAngle - targetAngle));
            player.onGround = true;
            player.y = groundY - player.h - 17;
            player.vy = 0;
            player.jumpsUsed = 0;
            player.motoAngle += normalizeAngle(targetAngle - player.motoAngle) * Math.min(1, dt * 11);
            player.motoAngle += lean * 0.045;
            player.motoAngularVelocity = 0;

            if (wasAirborne && landingDiff > 1.15 && Math.abs(player.vx) > 360 && player.invuln <= 0) {
                player.vx *= 0.45;
                damagePlayer(1);
                showMessage("Hard landing");
            }
        } else {
            player.onGround = false;
            player.motoAngle += (player.motoAngularVelocity + lean * 2.8) * dt;
            player.motoAngle = normalizeAngle(player.motoAngle);
        }

        if (player.y > view.h + 260) {
            const respawnX = clamp(player.x - 420, 120, run.level.width - player.w - 120);
            player.x = respawnX;
            player.y = motoTerrainY(player.x + player.w / 2) - player.h - 17;
            player.vx = 180;
            player.vy = 0;
            player.motoAngle = Math.atan(motoTerrainSlope(player.x + player.w / 2));
            player.motoAngularVelocity = 0;
            player.onGround = true;
            damagePlayer(1);
        }

        player.flipTimer = 0;
        player.flipProgress = 0;
        player.flipAngle = player.motoAngle;
        player.bikeFuel = 999;
    }

    function updateKayak(dt, hero) {
        const speed = 255 * hero.speed;
        player.vx = 0;

        if (controls.left) {
            player.vx = -speed * 0.82;
            player.dir = -1;
        }
        if (controls.right) {
            player.vx = speed;
            player.dir = 1;
        }

        if (!controls.left && !controls.right) {
            player.vx = 85;
        }

        if (controls.jump || controls.jumpPressed) {
            player.vy -= 920 * dt;
        }
        if (controls.down) {
            player.vy += 920 * dt;
        }

        player.vy += Math.sin(run.time * 4) * 12 * dt;
        player.vy *= 0.9;
        player.x += player.vx * dt;
        player.y += player.vy * dt;
        player.x = clamp(player.x, 24, run.level.width - player.w - 24);
        player.y = clamp(player.y, 90, run.waterY - 34);
        player.onGround = false;
    }

    function collideWithWorld() {
        player.onGround = false;

        const footExtension = playerFootExtension();
        let footBottom = playerFootBottom();

        if (run.level.biome === "city") {
            const upperRoadY = run.groundY;
            const lowerRoadY = cityRoadBottomY();
            const previousFootBottom = footBottom - player.vy * 0.02;

            if (
                player.vy >= 0 &&
                previousFootBottom < upperRoadY - 4 &&
                footBottom >= upperRoadY &&
                footBottom <= upperRoadY + 24
            ) {
                landPlayerOn(upperRoadY);
                footBottom = playerFootBottom();
            }

            if (!player.onGround && player.vy >= 0 && footBottom >= upperRoadY && footBottom <= lowerRoadY + 18) {
                if (footBottom > lowerRoadY) {
                    player.y = lowerRoadY - player.h - footExtension;
                }
                player.vy = 0;
                player.onGround = true;
                footBottom = playerFootBottom();
            }
        } else if (footBottom >= run.groundY) {
            landPlayerOn(run.groundY);
            footBottom = playerFootBottom();
        }

        if (player.vy >= 0) {
            run.platforms.forEach((platform) => {
                const previousFootBottom = footBottom - player.vy * 0.02;
                const wasAbove = previousFootBottom <= platform.y + 4;
                if (
                    wasAbove &&
                    player.x + player.w > platform.x &&
                    player.x < platform.x + platform.w &&
                    footBottom >= platform.y &&
                    footBottom <= platform.y + platform.h + 28
                ) {
                    player.y = platform.y - player.h - footExtension;
                    player.vy = 0;
                    player.onGround = true;
                    footBottom = playerFootBottom();
                }
            });
        }

        if (player.onGround) {
            player.jumpsUsed = 0;
            player.flipTimer = 0;
            player.flipProgress = 0;
            player.flipAngle = 0;
        }
    }

    function mountBike(pickup) {
        if (pickup.taken) {
            return;
        }
        pickup.taken = true;
        player.vehicle = "bike";
        player.bikeFuel = 8 + save.upgrades.engine * 3;
        player.vx = 260 * player.dir;
        showMessage("Bike mounted");
    }

    function dismountBike(message) {
        player.vehicle = null;
        player.bikeFuel = 0;
        player.vx *= 0.5;
        showMessage(message);
    }

    function setAimVector(dx, dy, active = true) {
        const length = Math.hypot(dx, dy);

        if (length < 0.12) {
            return;
        }

        controls.aimX = dx / length;
        controls.aimY = dy / length;
        controls.aimActive = active;

        if (Math.abs(controls.aimX) > 0.18) {
            player.dir = controls.aimX < 0 ? -1 : 1;
        }
    }

    function getAimVector() {
        if (!controls.aimActive) {
            return { x: player.dir || 1, y: 0 };
        }

        return { x: controls.aimX, y: controls.aimY };
    }

    function updateAimFromKeys() {
        const x = (controls.aimKeys.right ? 1 : 0) - (controls.aimKeys.left ? 1 : 0);
        const y = (controls.aimKeys.down ? 1 : 0) - (controls.aimKeys.up ? 1 : 0);

        if (x !== 0 || y !== 0) {
            setAimVector(x, y, true);
        }
    }

    function isAimKeyHeld() {
        return controls.aimKeys.left || controls.aimKeys.right || controls.aimKeys.up || controls.aimKeys.down;
    }

    function isShooting() {
        return controls.fireHeld || controls.pointerShoot || controls.aimStickShoot || isAimKeyHeld();
    }

    function aimDashDirection() {
        const aim = getAimVector();
        if (Math.abs(aim.x) > 0.2) {
            return aim.x < 0 ? -1 : 1;
        }

        return player.dir || 1;
    }

    function weaponGripPoint(aim = getAimVector()) {
        const aimSide = Math.abs(aim.x) > 0.12 ? Math.sign(aim.x) : player.dir || 1;
        const rootX = player.x + player.w / 2 + aimSide * 17;
        const rootY = player.y + player.h - 15;
        return {
            x: rootX + aim.x * 24,
            y: rootY + aim.y * 24
        };
    }

    function weaponMuzzlePoint(aim = getAimVector(), hero = currentHero()) {
        const grip = weaponGripPoint(aim);
        const weapon = currentWeapon(hero);
        return {
            x: grip.x + aim.x * weapon.muzzleDistance,
            y: grip.y + aim.y * weapon.muzzleDistance
        };
    }

    function playerBulletVelocity(baseVx, baseVy, inheritScale = 1) {
        const carrierScale = player.vehicle === "bike" ? inheritScale : 0.12;
        return {
            vx: baseVx + player.vx * carrierScale,
            vy: baseVy
        };
    }

    function shoot() {
        if (player.fireTimer > 0 || run.state !== "playing") {
            return;
        }

        const hero = currentHero();
        const cooldownUpgrade = 1 - save.upgrades.cooldown * 0.08;
        const rapidMod = player.rapidTimer > 0 ? 0.48 : 1;
        player.fireTimer = (hero.fireRate / 1000) * cooldownUpgrade * rapidMod;
        fireWeapon(hero);
        playAudio("shoot", 0.7, "shots");
    }

    function throwGrenade() {
        if (run.state !== "playing" || player.grenadeTimer > 0 || player.grenades <= 0) {
            return;
        }

        const aim = getAimVector();
        const side = Math.abs(aim.x) > 0.1 ? Math.sign(aim.x) : player.dir || 1;
        const throwX = player.x + player.w / 2 + side * 24;
        const throwY = player.y + player.h * 0.44;
        const speed = 470;
        player.grenades -= 1;
        player.grenadeTimer = 0.72;
        run.shake = Math.max(run.shake, 1.5);
        const velocity = playerBulletVelocity(aim.x * speed, aim.y * speed - 210, 0.35);
        createPlayerBullet({
            x: throwX,
            y: throwY,
            vx: velocity.vx,
            vy: velocity.vy,
            damage: 3.2 + save.upgrades.damage * 0.45,
            type: "grenade",
            radius: 10,
            life: 1.65,
            pierce: 0,
            color: "#ffb84d",
            grenade: true,
            owner: "player"
        });
        playAudio("shoot", 0.38, "shots");
        showMessage(`Grenades ${player.grenades}`);
    }

    function fireWeapon(hero) {
        const aim = getAimVector();
        const side = { x: -aim.y, y: aim.x };
        const weapon = currentWeapon(hero);
        const muzzle = weaponMuzzlePoint(aim, hero);
        const originX = muzzle.x;
        const originY = muzzle.y;
        const bonusDamage = save.upgrades.damage * 0.35;
        player.weaponAnimDuration = weapon.rocket ? 0.16 : 0.11;
        player.weaponAnimTimer = player.weaponAnimDuration;
        run.shake = Math.max(run.shake, weapon.rocket ? 5 : 1.4);

        const shot = (speed, spread, damage, type, radius = 5, life = 1.25, pierce = 0) => {
            const shotSpeed = Math.abs(speed) * weapon.speedMod;
            const velocity = playerBulletVelocity(
                aim.x * shotSpeed + side.x * spread,
                aim.y * shotSpeed + side.y * spread
            );
            createPlayerBullet({
                x: originX,
                y: originY,
                vx: velocity.vx,
                vy: velocity.vy,
                damage: (damage + bonusDamage) * weapon.damageMod,
                type,
                radius: radius + (weapon.radiusBonus || 0),
                life,
                pierce,
                color: hero.color,
                sprite: weapon.bulletImage,
                spriteLength: weapon.bulletLength,
                rocket: weapon.rocket
            });
        };

        switch (hero.bullet) {
            case "spore":
                shot(550, -90, 1.05, "spore", 7, 0.95);
                shot(520, 0, 1.05, "spore", 7, 0.95);
                shot(550, 90, 1.05, "spore", 7, 0.95);
                break;
            case "leaf":
                shot(660, 0, 1.25, "leaf", 5, 1.5, 1);
                break;
            case "fire":
                shot(650, rand(-24, 24), 1.1, "fire", 5, 1.15);
                break;
            case "ice":
                shot(610, 0, 1.1, "ice", 6, 1.35);
                break;
            case "gold":
                shot(600, -38, 1.05, "gold", 5, 1.2);
                shot(600, 38, 1.05, "gold", 5, 1.2);
                break;
            case "shadow":
                shot(760, 0, 1.15, "shadow", 4, 1.35, 2);
                break;
            case "star":
                shot(600, -72, 1.05, "star", 6, 1.25);
                shot(640, 0, 1.1, "star", 6, 1.25);
                shot(600, 72, 1.05, "star", 6, 1.25);
                break;
            case "stone":
                shot(520, 0, 2.4, "stone", 9, 1.45);
                break;
            case "cat":
                shot(610, -22, 0.95, "cat", 5, 1.35);
                shot(610, 22, 0.95, "cat", 5, 1.35);
                break;
            case "ghost":
                shot(720, 0, Math.random() < 0.28 ? 2.3 : 1.15, "ghost", 5, 1.25, 1);
                break;
            case "spark":
                shot(690, rand(-42, 42), 0.62, "spark", 4, 1);
                break;
            default:
                shot(640, 0, 1.15, "normal", 5, 1.25);
                if (player.spreadTimer > 0) {
                    shot(610, -70, 0.85, "normal", 5, 1.1);
                    shot(610, 70, 0.85, "normal", 5, 1.1);
                }
        }
    }

    function useSkill() {
        if (player.skillTimer > 0 || run.state !== "playing") {
            return;
        }

        const hero = currentHero();
        const cooldown = currentSkillCooldown();
        player.skillTimer = cooldown;

        switch (hero.id) {
            case "mushroom":
                player.hp = Math.min(MAX_HP, player.hp + 1);
                radialShots("spore", 10, 1.2, 460, hero.color);
                showMessage("Spore Heal");
                break;
            case "forest":
                player.spreadTimer = 5;
                radialShots("leaf", 12, 1.15, 560, hero.color, 1);
                showMessage("Leaf Fan");
                break;
            case "fire":
                player.rapidTimer = 5.8;
                showMessage("Overheat");
                break;
            case "ice":
                freezeNearby(420, 4);
                radialShots("ice", 8, 1.05, 500, hero.color);
                showMessage("Frost Lock");
                break;
            case "golden":
                addMushrooms(8);
                radialShots("gold", 8, 1.1, 500, hero.color);
                showMessage("Gold Rush");
                break;
            case "shadow":
                player.phaseTimer = 3.4;
                player.invuln = Math.max(player.invuln, 3.4);
                showMessage("Shadow Phase");
                break;
            case "star":
                radialShots("star", 16, 1.2, 620, hero.color);
                showMessage("Star Storm");
                break;
            case "stone":
                player.shieldTimer = 5.5;
                showMessage("Stone Guard");
                break;
            case "cat":
                player.x = clamp(player.x + aimDashDirection() * 240, 32, run.level.width - player.w - 32);
                radialShots("cat", 8, 0.95, 540, hero.color);
                showMessage("Blink Shot");
                break;
            case "ghost":
                player.phaseTimer = 2.3;
                player.invuln = Math.max(player.invuln, 2.3);
                player.x = clamp(player.x + aimDashDirection() * 310, 32, run.level.width - player.w - 32);
                showMessage("Ghost Dash");
                break;
            case "firefly":
                player.rapidTimer = 4.8;
                player.hoverTimer = 3.6;
                radialShots("spark", 14, 0.72, 610, hero.color);
                showMessage("Spark Barrage");
                break;
            default:
                player.spreadTimer = 4.2;
                radialShots("normal", 7, 1.0, 520, hero.color);
                showMessage("Focus Burst");
                break;
        }

        playAudio("shoot", 0.3, "shots");
    }

    function radialShots(type, count, damage, speed, color, pierce = 0) {
        const centerX = player.x + player.w / 2;
        const centerY = player.y + player.h / 2;
        const weapon = currentWeapon(currentHero());
        for (let index = 0; index < count; index += 1) {
            const angle = (-Math.PI * 0.65) + (index / Math.max(1, count - 1)) * Math.PI * 1.3;
            const velocity = playerBulletVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            createPlayerBullet({
                x: centerX,
                y: centerY,
                vx: velocity.vx,
                vy: velocity.vy,
                damage: damage + save.upgrades.damage * 0.25,
                type,
                radius: type === "stone" ? 8 : 5,
                life: 1.15,
                pierce,
                color,
                sprite: weapon.bulletImage,
                spriteLength: weapon.bulletLength,
                rocket: weapon.rocket && type !== "spark"
            });
        }
    }

    function freezeNearby(radius, seconds) {
        run.enemies.forEach((enemy) => {
            if (Math.abs(enemy.x - player.x) < radius && Math.abs(enemy.y - player.y) < radius) {
                enemy.frozen = Math.max(enemy.frozen, seconds);
            }
        });

        if (run.boss && run.boss.active) {
            run.boss.frozen = Math.max(run.boss.frozen, seconds);
        }
    }

    function createPlayerBullet(data) {
        run.playerBullets.push({ ...data, owner: "player" });
    }

    function createEnemyBullet(data) {
        run.enemyBullets.push(data);
    }

    function updateBullets(dt) {
        run.playerBullets.forEach((bullet) => {
            bullet.life -= dt;

            if (bullet.type === "cat") {
                const target = nearestTarget(bullet);
                if (target) {
                    const targetX = target.x + target.w / 2;
                    const targetY = target.y + target.h / 2;
                    bullet.vx += clamp((targetX - bullet.x) * 0.8, -160, 160) * dt;
                    bullet.vy += clamp((targetY - bullet.y) * 0.8, -160, 160) * dt;
                }
            }

            if (bullet.rocket && Math.random() < 0.55) {
                run.particles.push({
                    x: bullet.x - Math.sign(bullet.vx || 1) * 8,
                    y: bullet.y + rand(-3, 3),
                    vx: -bullet.vx * 0.05 + rand(-24, 24),
                    vy: -bullet.vy * 0.05 + rand(-24, 24),
                    r: rand(2, 5),
                    life: rand(0.18, 0.36),
                    color: "rgba(245,245,245,0.72)"
                });
            }

            bullet.x += bullet.vx * dt;
            bullet.y += bullet.vy * dt;
            bullet.vy += (bullet.type === "spore" || bullet.type === "stone" ? 180 : bullet.type === "grenade" ? 760 : 0) * dt;
            if (bullet.type === "grenade" && (bullet.life <= 0 || bullet.y + bullet.radius >= run.groundY + 8)) {
                if (!bullet.exploded) {
                    explodeBullet(bullet.x, bullet.y, bullet.color || "#ffb84d", 18);
                    bullet.exploded = true;
                    playAudio("hit", 0.32);
                }
                bullet.life = 0;
            }
        });

        run.enemyBullets.forEach((bullet) => {
            bullet.life -= dt;
            if (bullet.type === "comet") {
                bullet.vx += clamp((player.x + player.w / 2 - bullet.x) * 0.75, -110, 110) * dt;
                bullet.vy += clamp((player.y + player.h / 2 - bullet.y) * 0.75, -110, 110) * dt;
            }
            if (bullet.type === "dung" || bullet.type === "molotov") {
                bullet.vy += 680 * dt;
            }
            bullet.x += bullet.vx * dt;
            bullet.y += bullet.vy * dt;
            if (bullet.type === "molotov" && !bullet.ignited && (bullet.life <= 0 || bullet.y + bullet.radius >= run.groundY + 4)) {
                bullet.ignited = true;
                igniteMolotov(bullet.x, Math.min(bullet.y, run.groundY - 6));
                bullet.life = 0;
            }
        });

        checkBulletCollisions();

        const worldW = visibleWorldWidth();
        run.playerBullets = run.playerBullets.filter((bullet) => bullet.life > 0 && bullet.x > run.cameraX - 200 && bullet.x < run.cameraX + worldW + 260 && bullet.y > -220 && bullet.y < view.h + 220);
        run.enemyBullets = run.enemyBullets.filter((bullet) => bullet.life > 0 && bullet.x > run.cameraX - 240 && bullet.x < run.cameraX + worldW + 260 && bullet.y > -260 && bullet.y < view.h + 260);
    }

    function nearestTarget(bullet) {
        let best = null;
        let bestDistance = Infinity;
        run.enemies.forEach((enemy) => {
            const distance = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
            if (distance < bestDistance && distance < 420) {
                best = enemy;
                bestDistance = distance;
            }
        });
        if (run.boss && run.boss.active && !run.boss.dead) {
            const distance = Math.hypot(run.boss.x - bullet.x, run.boss.y - bullet.y);
            if (distance < bestDistance && distance < 520) {
                best = run.boss;
            }
        }
        return best;
    }

    function checkBulletCollisions() {
        run.playerBullets.forEach((bullet) => {
            const bulletRect = { x: bullet.x - bullet.radius, y: bullet.y - bullet.radius, w: bullet.radius * 2, h: bullet.radius * 2 };
            if (damageTrafficCarsWithBullet(bullet, bulletRect)) {
                return;
            }

            run.enemies.forEach((enemy) => {
                if (enemy.dead || !rectsOverlap(bulletRect, entityRect(enemy))) {
                    return;
                }

                damageEnemy(enemy, bullet.damage, bullet.type);
                addHitParticles(bullet.x, bullet.y, bullet.color || "#ffffff", 5);
                if (bullet.pierce > 0) {
                    bullet.pierce -= 1;
                } else {
                    bullet.life = 0;
                }
            });

            if (run.boss && run.boss.active && !run.boss.dead && rectsOverlap(bulletRect, entityRect(run.boss))) {
                damageBoss(bullet.damage, bullet.type);
                addHitParticles(bullet.x, bullet.y, bullet.color || "#ffffff", 8);
                if (bullet.pierce > 0) {
                    bullet.pierce -= 1;
                } else {
                    bullet.life = 0;
                }
            }
        });

        const playerRect = entityRect(player);
        run.enemyBullets.forEach((bullet) => {
            const bulletRect = { x: bullet.x - bullet.radius, y: bullet.y - bullet.radius, w: bullet.radius * 2, h: bullet.radius * 2 };
            if (rectsOverlap(playerRect, bulletRect)) {
                bullet.life = 0;
                if (bullet.type === "molotov" && !bullet.ignited) {
                    bullet.ignited = true;
                    igniteMolotov(bullet.x, bullet.y);
                }
                damagePlayer(bullet.damage || 1);
            }
        });
    }

    function vehicleBulletDamage(bullet) {
        let damage = bullet.damage * 0.72;

        if (bullet.rocket) {
            damage += 9;
        }
        if (bullet.type === "stone") {
            damage += 3.5;
        }
        if (bullet.type === "grenade") {
            damage += 7;
        }
        if (bullet.type === "fire") {
            damage += 1.2;
        }
        if (bullet.type === "spark" || bullet.type === "leaf") {
            damage *= 0.82;
        }

        return damage;
    }

    function damageTrafficCarsWithBullet(bullet, bulletRect) {
        if (!run.level || run.level.biome !== "city") {
            return false;
        }

        let hit = false;
        let destroyedVehicle = false;
        const splashRadius = bullet.rocket ? 112 : bullet.type === "grenade" ? 96 : bullet.type === "stone" ? 54 : 0;

        run.trafficCars.forEach((car) => {
            if (car.destroyed) {
                return;
            }

            const carRect = trafficCarDamageRect(car);
            const directHit = rectsOverlap(bulletRect, carRect);
            const splashHit = splashRadius > 0 && rectDistanceToPoint(carRect, bullet.x, bullet.y) <= splashRadius;
            if (!directHit && !splashHit) {
                return;
            }

            const splashFalloff = directHit ? 1 : 0.58;
            const wasDestroyed = car.destroyed;
            damageTrafficCar(car, vehicleBulletDamage(bullet) * splashFalloff, bullet);
            if (!wasDestroyed && car.destroyed) {
                destroyedVehicle = true;
            }
            hit = true;
        });

        run.hazards.forEach((hazard) => {
            if (hazard.type !== "traffic" || hazard.timer <= 0) {
                return;
            }

            const hazardRect = trafficHazardDamageRect(hazard);
            const directHit = rectsOverlap(bulletRect, hazardRect);
            const splashHit = splashRadius > 0 && rectDistanceToPoint(hazardRect, bullet.x, bullet.y) <= splashRadius;
            if (!directHit && !splashHit) {
                return;
            }

            const splashFalloff = directHit ? 1 : 0.58;
            const wasActive = hazard.timer > 0;
            damageTrafficHazard(hazard, vehicleBulletDamage(bullet) * splashFalloff, bullet);
            if (wasActive && hazard.timer <= 0) {
                destroyedVehicle = true;
            }
            hit = true;
        });

        if (!hit) {
            return false;
        }

        if ((bullet.rocket || bullet.type === "grenade") && !bullet.exploded) {
            explodeBullet(bullet.x, bullet.y, bullet.color || "#ff8f3a", 18);
            bullet.exploded = true;
            if (!destroyedVehicle) {
                playAudio("hit", bullet.rocket ? 0.3 : 0.34);
            }
        }

        if (bullet.pierce > 0 && !bullet.rocket && bullet.type !== "grenade") {
            bullet.pierce -= 1;
        } else {
            bullet.life = 0;
        }

        return true;
    }

    function trafficHazardDamageRect(hazard) {
        return {
            x: hazard.x + 8,
            y: hazard.y + hazard.h * 0.2,
            w: hazard.w - 16,
            h: hazard.h * 0.64
        };
    }

    function rectDistanceToPoint(rect, x, y) {
        const closestX = clamp(x, rect.x, rect.x + rect.w);
        const closestY = clamp(y, rect.y, rect.y + rect.h);
        return Math.hypot(x - closestX, y - closestY);
    }

    function damageTrafficCar(car, amount, bullet) {
        car.hp -= amount;
        car.hitCooldown = Math.max(car.hitCooldown || 0, 0.08);
        addHitParticles(bullet.x, bullet.y, bullet.rocket ? "#ffb84d" : bullet.color || "#ffffff", bullet.rocket ? 10 : 4);

        if (car.hp > 0) {
            run.shake = Math.max(run.shake, bullet.rocket ? 4 : 1.2);
            return;
        }

        explodeTrafficCar(car);
    }

    function damageTrafficHazard(hazard, amount, bullet) {
        hazard.hp = (hazard.hp ?? 5) - amount;
        addHitParticles(bullet.x, bullet.y, bullet.rocket ? "#ffb84d" : bullet.color || "#ffffff", bullet.rocket ? 8 : 4);
        if (hazard.hp > 0) {
            run.shake = Math.max(run.shake, bullet.rocket ? 4 : 1.2);
            return;
        }

        hazard.timer = 0;
        hazard.didDamage = true;
        run.score += 130;
        run.shake = Math.max(run.shake, 10);
        explodeBullet(hazard.x + hazard.w / 2, hazard.y + hazard.h * 0.5, "#ff8f3a", 28);
        showMessage("Vehicle destroyed");
        playAudio("hit", 0.4);
    }

    function explodeBullet(x, y, color, count) {
        for (let index = 0; index < count; index += 1) {
            run.particles.push({
                x,
                y,
                vx: rand(-260, 260),
                vy: rand(-260, 120),
                r: rand(3, 8),
                life: rand(0.28, 0.74),
                color: index % 3 === 0 ? "#fff3a3" : color
            });
        }
    }

    function igniteMolotov(x, y) {
        const patchY = clamp(y - 8, 80, run.groundY - 18);
        explodeBullet(x, y, "#ff6b1a", 14);
        run.hazards.push({
            type: "firePatch",
            x: x - 44,
            y: patchY,
            w: 88,
            h: 24,
            timer: 2.8,
            damageTimer: 0,
            damage: 1,
            color: "#ff7a1a"
        });
        run.shake = Math.max(run.shake, 3);
        playAudio("hit", 0.26);
    }

    function explodeTrafficCar(car) {
        if (car.destroyed) {
            return;
        }

        car.destroyed = true;
        car.respawnTimer = 3.4;
        car.hp = 0;
        run.score += car.sprite === "cityBus" ? 260 : 160;
        run.shake = Math.max(run.shake, 12);
        explodeBullet(car.x + car.w / 2, car.y + car.h * 0.52, "#ff8f3a", 34);
        showMessage("Vehicle destroyed");
        playAudio("hit", 0.45);
    }

    function respawnTrafficCar(car) {
        const sprite = citySprites[car.sprite] || citySprites.redCar;
        car.w = sprite.w;
        car.h = sprite.h;
        car.y = cityTrafficCarY(sprite, car.lane);
        car.x = car.vx < 0
            ? run.level.width + rand(360, 980)
            : -car.w - rand(360, 980);
        car.hp = car.maxHp || trafficCarMaxHp(car.sprite);
        car.maxHp = car.hp;
        car.destroyed = false;
        car.respawnTimer = 0;
        car.hitCooldown = 0;
    }

    function damageEnemy(enemy, damage, type) {
        if (type === "ice") {
            enemy.frozen = Math.max(enemy.frozen, 1.8);
        }
        if (type === "fire") {
            damage += 0.25;
        }
        if (type === "gold") {
            damage += 0.1;
        }

        enemy.hp -= damage;
        enemy.hitTimer = 0.12;
        setEnemyAnimState(enemy, "hurt", 0.14);
        if (enemy.hp <= 0 && !enemy.dead) {
            enemy.dead = true;
            setEnemyAnimState(enemy, "dead", 0.55);
            enemy.hitTimer = 0.55;
            run.score += enemy.score;
            run.stats.kills += 1;
            recordDailyProgress("kills", 1);
            addMushrooms(currentHero().id === "golden" ? 2 : 1);
            if (Math.random() < 0.18 + save.upgrades.magnet * 0.04) {
                run.pickups.push({ type: "mushroom", x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2, w: 30, h: 30, taken: false });
            }
            addHitParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.color, 14);
            playAudio("hit", 0.26);
        }
    }

    function damageBoss(damage, type) {
        const boss = run.boss;
        if (!boss || boss.dead) {
            return;
        }

        if (type === "ice") {
            boss.frozen = Math.max(boss.frozen, 1.2);
        }
        if (type === "fire") {
            damage += 0.22;
        }
        if (type === "star") {
            damage += 0.18;
        }
        if (boss.shieldTimer > 0) {
            damage *= 0.35;
        }

        boss.hp -= damage;
        boss.hitTimer = 0.14;
        run.score += 8;
        if (boss.hp <= 0) {
            boss.dead = true;
            completeLevel();
        }
    }

    function damagePlayer(amount) {
        if (player.invuln > 0 || player.phaseTimer > 0 || run.state !== "playing") {
            return;
        }

        const armorChance = Math.min(0.42, save.upgrades.armor * 0.09 + (currentHero().id === "stone" ? 0.18 : 0));
        if (player.shieldTimer > 0 || Math.random() < armorChance) {
            player.invuln = 0.7;
            showMessage("Blocked");
            addHitParticles(player.x + player.w / 2, player.y + player.h / 2, "#b8c0c8", 8);
            return;
        }

        player.hp -= Math.max(1, Math.ceil(amount));
        player.invuln = 1.1;
        player.vx = -player.dir * 190;
        player.vy = -240;
        run.shake = 6;

        if (player.hp <= 0) {
            gameOver();
        } else {
            playAudio("hit", 0.32);
        }
    }

    function updateEnemies(dt) {
        const playerRect = entityRect(player);
        const playerRange = playerWeaponRange();
        const meleeAggroDistance = meleeEnemyAggroRange();
        run.enemies.forEach((enemy) => {
            if (enemy.dead) {
                enemy.timer += dt;
                enemy.actionTimer = Math.max(0, (enemy.actionTimer || 0) - dt);
                enemy.hitTimer = Math.max(0, (enemy.hitTimer || 0) - dt);
                return;
            }

            const speedFactor = enemy.frozen > 0 ? 0.25 : 1;
            enemy.frozen = Math.max(0, enemy.frozen - dt);
            enemy.timer += dt;
            enemy.fireTimer -= dt * speedFactor;
            enemy.actionTimer = Math.max(0, (enemy.actionTimer || 0) - dt);
            enemy.hitTimer = Math.max(0, (enemy.hitTimer || 0) - dt);
            enemy.attackCooldown = Math.max(0, (enemy.attackCooldown || 0) - dt * speedFactor);
            enemy.behaviorTimer = Math.max(0, (enemy.behaviorTimer || 0) - dt * speedFactor);
            const visibleForCombat = enemyVisibleForCombat(enemy);
            if (!visibleForCombat) {
                enemy.fireTimer = Math.max(enemy.fireTimer, ENEMY_FIRE_VIEW_DELAY);
            }
            let handledCombat = false;

            if (enemy.flying) {
                const dx = player.x - enemy.x;
                if (Math.abs(dx) < 620) {
                    enemy.dir = Math.sign(dx || enemy.dir);
                    enemy.x += enemy.dir * enemy.speed * 0.42 * speedFactor * dt;
                } else {
                    enemy.x += enemy.dir * enemy.speed * 0.25 * speedFactor * dt;
                }
                enemy.y = enemy.baseY + Math.sin(enemy.timer * 3.3 + enemy.x * 0.02) * 32;
                enemy.y = clamp(enemy.y, 76, run.groundY - 44);
            } else {
                const dx = player.x - enemy.x;
                const distance = Math.abs(dx);
                const verticalDistance = (player.y + player.h * 0.5) - (enemy.y + enemy.h * 0.5);
                const combatDistance = Math.hypot(dx, verticalDistance);
                const surfaceY = enemy.surfaceY || run.groundY;
                let moved = false;
                let grounded = enemy.y + enemy.h >= surfaceY - 2 && Math.abs(enemy.vy || 0) < 1;
                const attentionDistance = enemy.ranged ? playerRange : enemy.melee ? meleeAggroDistance : 480;
                const lockedAction = enemy.actionTimer > 0 && ["throw", "attack", "attack2", "attack3", "shoot", "reload"].includes(enemy.animState);

                if (combatDistance < attentionDistance) {
                    enemy.dir = Math.sign(dx || enemy.dir);
                }

                if (enemy.onRoof && enemy.ranged && combatDistance < playerRange * 0.5 && player.y > enemy.y + 35) {
                    enemy.onRoof = false;
                    enemy.stationary = false;
                    enemy.surfaceY = run.groundY;
                    enemy.vy = -140;
                    setEnemyAnimState(enemy, "jump", 0.5);
                    grounded = false;
                }

                if (!grounded) {
                    enemy.vy = (enemy.vy || 0) + GRAVITY * 0.78 * dt;
                    enemy.y += enemy.vy * dt;
                    if (enemy.y + enemy.h >= enemy.surfaceY - 2) {
                        enemy.y = enemy.surfaceY - enemy.h;
                        enemy.vy = 0;
                        grounded = true;
                    }
                    if (enemy.actionTimer <= 0) {
                        setEnemyAnimState(enemy, "jump");
                    }
                } else if (enemy.gangsterRole) {
                    handledCombat = updateGangsterEnemy(enemy, dt, {
                        dx,
                        distance,
                        verticalDistance,
                        combatDistance,
                        surfaceY,
                        speedFactor,
                        playerRange,
                        meleeAggroDistance,
                        visibleForCombat,
                        lockedAction
                    });
                } else if (enemy.stationary) {
                    enemy.x = enemy.anchorX ?? enemy.x;
                    enemy.y = surfaceY - enemy.h;
                    if (enemy.actionTimer <= 0) {
                        setEnemyAnimState(enemy, "idle");
                    }
                } else if (enemy.ranged) {
                    const beforeX = enemy.x;
                    const closeRange = Math.min(340, playerRange * 0.38);
                    const preferredRange = Math.max(420, playerRange * 0.62);
                    if (!lockedAction && distance < closeRange) {
                        enemy.x -= enemy.dir * enemy.speed * 0.44 * speedFactor * dt;
                    } else if (!lockedAction && distance > preferredRange && combatDistance < playerRange) {
                        enemy.x += enemy.dir * enemy.speed * 0.2 * speedFactor * dt;
                    }
                    moved = Math.abs(enemy.x - beforeX) > 0.25;
                    enemy.y = surfaceY - enemy.h;
                    if (enemy.actionTimer <= 0) {
                        setEnemyAnimState(enemy, moved ? "walk" : "idle");
                    }
                } else {
                    const beforeX = enemy.x;
                    const chaseActive = enemy.melee && combatDistance < meleeAggroDistance;
                    if (!lockedAction && chaseActive) {
                        enemy.x += enemy.dir * enemy.speed * 0.78 * speedFactor * dt;
                    } else if (!lockedAction && enemy.melee) {
                        const patrolTarget = (enemy.anchorX || enemy.x) + Math.sin(enemy.timer * 0.6) * 62;
                        const patrolDelta = patrolTarget - enemy.x;
                        if (Math.abs(patrolDelta) > 6) {
                            enemy.dir = Math.sign(patrolDelta);
                            enemy.x += clamp(patrolDelta * 1.1, -enemy.speed * 0.18, enemy.speed * 0.18) * speedFactor * dt;
                        }
                    } else {
                        enemy.x += enemy.dir * enemy.speed * speedFactor * dt;
                    }
                    moved = Math.abs(enemy.x - beforeX) > 0.25;
                    enemy.y = surfaceY - enemy.h;
                    if (enemy.actionTimer <= 0) {
                        setEnemyAnimState(enemy, moved ? chaseActive ? "run" : "walk" : "idle");
                    }
                }
            }

            const enemyCenterX = enemy.x + enemy.w * 0.5;
            const enemyCenterY = enemy.y + enemy.h * 0.5;
            const playerCenterX = player.x + player.w * 0.5;
            const playerCenterY = player.y + player.h * 0.5;
            const shootDistance = Math.hypot(playerCenterX - enemyCenterX, playerCenterY - enemyCenterY);
            const canThrowMolotov = enemy.molotovs > 0
                && visibleForCombat
                && enemy.fireTimer <= 0
                && enemy.actionTimer <= 0
                && shootDistance < playerRange * 0.9
                && shootDistance > 140
                && Math.abs(playerCenterY - enemyCenterY) < 220;
            if (canThrowMolotov && !enemy.gangsterRole) {
                enemy.fireTimer = 2.2;
                throwMolotov(enemy);
            } else if (!handledCombat && !enemy.gangsterRole && visibleForCombat && enemyCanShoot(enemy) && enemy.fireTimer <= 0 && shootDistance < playerRange) {
                enemy.fireTimer = enemy.ranged
                    ? Math.max(0.95, rand(1.1, 1.9) - (run.level.difficultyIndex || 0) * 0.025)
                    : Math.max(0.72, rand(1.4, 2.7) - (run.level.difficultyIndex || 0) * 0.035);
                shootEnemy(enemy);
            }

            if (rectsOverlap(playerRect, entityRect(enemy))) {
                if (player.vehicle === "bike" && Math.abs(player.vx) > 170) {
                    damageEnemy(enemy, 3.4, "bike");
                    player.vx *= 0.7;
                    return;
                }
                if (enemy.gangsterRole) {
                    const activeGangsterAttack = enemy.actionTimer > 0 && ["attack", "attack2", "attack3"].includes(enemy.animState);
                    if (!activeGangsterAttack && enemy.attackCooldown <= 0) {
                        performGangsterMeleeAttack(enemy);
                    } else if (activeGangsterAttack) {
                        damagePlayer(enemy.meleeDamage || 1);
                    }
                    return;
                }
                if (enemy.melee) {
                    setEnemyAnimState(enemy, "attack", 0.34);
                }
                damagePlayer(enemy.kind === "roller" ? 2 : enemy.melee ? enemy.meleeDamage : 1);
            }
        });

        run.enemies = run.enemies.filter((enemy) => !enemy.dead || enemy.hitTimer > 0);
    }

    function updateGangsterEnemy(enemy, dt, context) {
        if (enemy.gangsterRole === "brawler") {
            return updateGangsterBrawler(enemy, dt, context);
        }

        return updateGangsterShooter(enemy, dt, context);
    }

    function refreshGangsterTactic(enemy) {
        enemy.behaviorTimer = rand(0.85, enemy.gangsterRole === "brawler" ? 1.75 : 2.35);
        enemy.strafeDir = Math.random() < 0.5 ? -1 : 1;
        if (enemy.gangsterRole === "brawler") {
            enemy.tactic = Math.random() < 0.32 ? "guard" : Math.random() < 0.62 ? "probe" : "rush";
        } else {
            enemy.tactic = Math.random() < 0.5 ? "hold" : "strafe";
        }
    }

    function gangsterIdleState(enemy) {
        return enemy.animations?.idleAlt && Math.sin(enemy.timer * 1.15 + enemy.x * 0.01) > 0.45 ? "idleAlt" : "idle";
    }

    function moveGangster(enemy, amount) {
        enemy.x = clamp(enemy.x + amount, 32, run.level.width - enemy.w - 32);
    }

    function updateGangsterBrawler(enemy, dt, context) {
        const { dx, distance, verticalDistance, combatDistance, surfaceY, speedFactor, meleeAggroDistance, lockedAction } = context;
        enemy.y = surfaceY - enemy.h;

        if (!enemy.tactic || enemy.behaviorTimer <= 0) {
            refreshGangsterTactic(enemy);
        }

        if (Math.abs(dx) > 2) {
            enemy.dir = Math.sign(dx);
        }

        const sameLayer = Math.abs(verticalDistance) < 115;
        const attackReach = 92;
        if (!lockedAction && sameLayer && distance < attackReach && enemy.attackCooldown <= 0) {
            performGangsterMeleeAttack(enemy);
            return true;
        }

        if (lockedAction) {
            return true;
        }

        let moved = false;
        if (combatDistance < meleeAggroDistance && sameLayer) {
            if (enemy.tactic === "guard" && distance > attackReach && distance < 245) {
                setEnemyAnimState(enemy, enemy.animations?.idleAlt ? "idleAlt" : "idle");
                return true;
            }

            if (distance > attackReach * 0.72) {
                const speed = enemy.tactic === "rush" || distance > 260 ? 0.92 : 0.58;
                moveGangster(enemy, enemy.dir * enemy.speed * speed * speedFactor * dt);
                moved = true;
            }
        } else {
            const patrolTarget = (enemy.anchorX || enemy.x) + Math.sin(enemy.timer * 0.58) * 78;
            const patrolDelta = patrolTarget - enemy.x;
            if (Math.abs(patrolDelta) > 7) {
                enemy.dir = Math.sign(patrolDelta);
                moveGangster(enemy, clamp(patrolDelta * 1.15, -enemy.speed * 0.22, enemy.speed * 0.22) * speedFactor * dt);
                moved = true;
            }
        }

        if (enemy.actionTimer <= 0) {
            setEnemyAnimState(enemy, moved ? (combatDistance < meleeAggroDistance ? "run" : "walk") : gangsterIdleState(enemy));
        }

        return true;
    }

    function updateGangsterShooter(enemy, dt, context) {
        const { dx, distance, verticalDistance, combatDistance, surfaceY, speedFactor, playerRange, meleeAggroDistance, visibleForCombat, lockedAction } = context;
        enemy.y = surfaceY - enemy.h;

        if (!enemy.tactic || enemy.behaviorTimer <= 0) {
            refreshGangsterTactic(enemy);
        }

        if (Math.abs(dx) > 2) {
            enemy.dir = Math.sign(dx);
        }

        if (enemy.reloadTimer > 0) {
            enemy.reloadTimer -= dt * speedFactor;
            if (enemy.actionTimer <= 0) {
                setEnemyAnimState(enemy, enemy.animations?.reload ? "reload" : gangsterIdleState(enemy), Math.max(0.2, enemy.reloadTimer));
            }
            if (enemy.reloadTimer <= 0) {
                enemy.ammo = enemy.maxAmmo;
                setEnemyAnimState(enemy, gangsterIdleState(enemy), 0.18);
            }
            return true;
        }

        const sameLayer = Math.abs(verticalDistance) < 160 || enemy.onRoof || Math.abs(verticalDistance) < playerRange * 0.28;
        const meleeReach = 76;
        if (!lockedAction && sameLayer && distance < meleeReach && enemy.attackCooldown <= 0) {
            performGangsterMeleeAttack(enemy);
            return true;
        }

        if (enemyCanShoot(enemy) && enemy.maxAmmo > 0 && enemy.ammo <= 0 && !lockedAction) {
            startGangsterReload(enemy);
            return true;
        }

        const canShootPlayer = enemyCanShoot(enemy)
            && visibleForCombat
            && sameLayer
            && combatDistance < playerRange
            && enemy.fireTimer <= 0
            && enemy.attackCooldown <= 0
            && !lockedAction;

        if (canShootPlayer) {
            shootGangster(enemy);
            return true;
        }

        if (lockedAction) {
            return true;
        }

        let moved = false;
        if (enemy.stationary) {
            enemy.x = enemy.anchorX ?? enemy.x;
        } else {
            const closeRange = Math.min(270, playerRange * 0.34);
            const preferredRange = playerRange * (enemy.preferredRange || 0.62);
            if (sameLayer && distance < closeRange) {
                moveGangster(enemy, -enemy.dir * enemy.speed * 0.52 * speedFactor * dt);
                moved = true;
            } else if (combatDistance < meleeAggroDistance && distance > preferredRange) {
                moveGangster(enemy, enemy.dir * enemy.speed * 0.34 * speedFactor * dt);
                moved = true;
            } else if (sameLayer && combatDistance < playerRange && enemy.tactic === "strafe") {
                moveGangster(enemy, enemy.strafeDir * enemy.speed * 0.16 * speedFactor * dt);
                moved = true;
            }
        }

        if (enemy.actionTimer <= 0) {
            setEnemyAnimState(enemy, moved ? (distance > playerRange * 0.85 ? "run" : "walk") : gangsterIdleState(enemy));
        }

        return true;
    }

    function startGangsterReload(enemy) {
        enemy.reloadTimer = enemy.reloadDuration || 0.9;
        enemy.fireTimer = Math.max(enemy.fireTimer || 0, enemy.reloadTimer);
        setEnemyAnimState(enemy, enemy.animations?.reload ? "reload" : gangsterIdleState(enemy), enemy.reloadTimer);
    }

    function shootGangster(enemy) {
        shootEnemy(enemy);
        enemy.ammo = Math.max(0, (enemy.ammo || enemy.maxAmmo || 1) - 1);
        const cooldown = enemy.shootCooldown || [1.0, 1.6];
        enemy.fireTimer = Math.max(0.75, rand(cooldown[0], cooldown[1]) - (run.level.difficultyIndex || 0) * 0.025);
        enemy.attackCooldown = enemy.fireTimer;
    }

    function performGangsterMeleeAttack(enemy) {
        const combo = enemy.combo || ["attack"];
        let state = combo[enemy.comboIndex % combo.length] || "attack";
        if (!enemy.animations?.[state]) {
            state = "attack";
        }
        enemy.comboIndex += 1;

        const duration = state === "attack3" ? 0.48 : state === "attack2" ? 0.34 : 0.38;
        setEnemyAnimState(enemy, state, duration);
        const cooldown = enemy.meleeCooldown || [0.68, enemy.gangsterRole === "brawler" ? 1.05 : 1.28];
        enemy.attackCooldown = rand(cooldown[0], cooldown[1]);

        if (enemy.gangsterRole === "brawler") {
            moveGangster(enemy, enemy.dir * 18);
        }

        const reach = enemy.gangsterRole === "brawler" ? 56 : 42;
        const attackRect = {
            x: enemy.dir > 0 ? enemy.x + enemy.w - 10 : enemy.x - reach + 10,
            y: enemy.y + 22,
            w: reach,
            h: enemy.h - 28
        };

        if (rectsOverlap(entityRect(player), attackRect)) {
            damagePlayer(enemy.meleeDamage || 1);
            addHitParticles(player.x + player.w / 2, player.y + player.h / 2, enemy.color, 6);
        }
    }

    function enemyCanShoot(enemy) {
        if (!enemy.shoot) {
            return false;
        }
        if (!enemy.animations) {
            return true;
        }

        const shootAnimation = enemy.animations.shoot;
        return Boolean(enemy.ranged && shootAnimation && images[shootAnimation.image]);
    }

    function throwMolotov(enemy) {
        enemy.molotovs = Math.max(0, (enemy.molotovs || 0) - 1);
        setEnemyAnimState(enemy, enemy.animations?.throw ? "throw" : "attack", 0.42);

        const fromX = enemy.x + enemy.w / 2 + enemy.dir * 20;
        const fromY = enemy.y + enemy.h * 0.36;
        const toX = player.x + player.w / 2;
        const toY = player.y + player.h * 0.58;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const vx = clamp(dx * 0.95, -430, 430);
        const vy = clamp(dy * 0.62 - 280, -470, -140);

        createEnemyBullet({
            x: fromX,
            y: fromY,
            vx,
            vy,
            radius: 8,
            damage: 1,
            life: 2.2,
            type: "molotov",
            color: "#ff8f3a"
        });
        playAudio("shoot", 0.22, "sfx");
    }

    function shootEnemy(enemy) {
        setEnemyAnimState(enemy, enemy.ranged ? "shoot" : "attack", enemy.ranged ? 0.36 : 0.28);
        const fromX = enemy.x + enemy.w / 2 + (enemy.ranged ? enemy.dir * 18 : 0);
        const fromY = enemy.y + (enemy.ranged ? enemy.h * 0.42 : enemy.h / 2);
        const toX = player.x + player.w / 2;
        const toY = player.y + player.h / 2;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const speed = enemy.shot === "gangsterHeavy" ? 360 : enemy.shot === "gangster" ? 330 : enemy.shot === "comet" ? 235 : enemy.shot === "spark" ? 300 : 210;
        createEnemyBullet({
            x: fromX,
            y: fromY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: enemy.shot === "gangsterHeavy" ? 5 : enemy.shot === "gangster" ? 4 : enemy.shot === "dung" ? 10 : 7,
            damage: enemy.shot === "dung" ? 2 : 1,
            life: enemy.ranged ? 2.6 : 4,
            type: enemy.shot || "sting",
            color: enemy.shot === "gangsterHeavy" ? "#ffdd76" : enemy.shot === "gangster" ? "#f6fbff" : enemy.color
        });
    }

    function updateBoss(dt) {
        const boss = run.boss;
        if (!boss || boss.dead) {
            return;
        }

        if (!boss.active && player.x > run.level.width - 1050) {
            boss.active = true;
            showMessage(`${boss.name}: ${boss.mechanic}`);
            run.messageTimer = 4;
        }

        if (!boss.active) {
            return;
        }

        const frozenFactor = boss.frozen > 0 ? 0.35 : 1;
        boss.frozen = Math.max(0, boss.frozen - dt);
        boss.shieldTimer = Math.max(0, boss.shieldTimer - dt);
        boss.hitTimer = Math.max(0, (boss.hitTimer || 0) - dt);
        boss.timer += dt * frozenFactor;
        boss.fireTimer -= dt * frozenFactor;
        boss.specialTimer -= dt * frozenFactor;

        const anchorX = run.level.width - 520;
        boss.x = anchorX + Math.sin(boss.timer * 1.2) * 90;
        boss.y += Math.sin(boss.timer * 1.9) * 20 * dt;
        boss.y = clamp(boss.y, 86, run.level.vehicle === "kayak" ? run.waterY - 150 : run.groundY - 180);

        if (boss.fireTimer <= 0) {
            boss.fireTimer = boss.pattern === "space" ? 0.88 : boss.pattern === "sky" ? 1.05 : boss.pattern === "city" ? 1.08 : 1.25;
            fireBossPattern(boss);
        }

        if (boss.specialTimer <= 0) {
            boss.specialTimer = boss.pattern === "lake" ? 6.2 : boss.pattern === "dung" ? 4.2 : boss.pattern === "city" ? 4.6 : 5;
            fireBossSpecial(boss);
        }

        if (rectsOverlap(entityRect(player), entityRect(boss))) {
            damagePlayer(2);
        }
    }

    function fireBossPattern(boss) {
        const originX = boss.x + boss.w * 0.35;
        const originY = boss.y + boss.h * 0.55;
        const playerCenterX = player.x + player.w / 2;
        const playerCenterY = player.y + player.h / 2;
        const angle = Math.atan2(playerCenterY - originY, playerCenterX - originX);

        if (boss.pattern === "lake") {
            [-0.4, -0.18, 0, 0.18, 0.4].forEach((offset) => {
                createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle + offset) * 240, vy: Math.sin(angle + offset) * 240, radius: 11, damage: 1, life: 4, type: "bubble", color: "#7ce7ff" });
            });
            return;
        }

        if (boss.pattern === "city") {
            [-0.28, 0, 0.28].forEach((offset) => {
                createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle + offset) * 285, vy: Math.sin(angle + offset) * 285, radius: 9, damage: 1, life: 3.8, type: "cone", color: "#ff9f1c" });
            });
            return;
        }

        if (boss.pattern === "swamp") {
            createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle) * 250, vy: Math.sin(angle) * 250, radius: 10, damage: 1, life: 4, type: "poison", color: "#9fff62" });
            run.hazards.push({ type: "wave", x: boss.x - 40, y: run.waterY - 18, w: 46, h: 22, vx: -260, timer: 3.8, damage: 1, color: "#9fff62" });
            return;
        }

        if (boss.pattern === "dung") {
            createEnemyBullet({ x: originX, y: originY, vx: -210 + rand(-70, 70), vy: -280 + rand(-120, 20), radius: 13, damage: 2, life: 4.5, type: "dung", color: "#6b3f1d" });
            return;
        }

        if (boss.pattern === "sky") {
            run.hazards.push({ type: "lightning", x: player.x + rand(-60, 60), y: 0, w: 44, h: run.groundY, timer: 1.2, warn: 0.72, damage: 1, color: "#fff070" });
            createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle) * 320, vy: Math.sin(angle) * 320, radius: 8, damage: 1, life: 3.2, type: "spark", color: "#fff070" });
            return;
        }

        if (boss.pattern === "space") {
            createEnemyBullet({ x: originX, y: originY, vx: Math.cos(angle) * 260, vy: Math.sin(angle) * 260, radius: 10, damage: 1, life: 5, type: "comet", color: "#d28cff" });
            createEnemyBullet({ x: boss.x + rand(0, boss.w), y: 50, vx: rand(-40, 40), vy: 230, radius: 10, damage: 1, life: 4.5, type: "comet", color: "#ff82e7" });
        }
    }

    function fireBossSpecial(boss) {
        if (boss.pattern === "lake") {
            boss.shieldTimer = 2.2;
            showMessage("Bubble shield");
            return;
        }

        if (boss.pattern === "city") {
            run.hazards.push({
                type: "traffic",
                x: boss.x - 60,
                y: run.groundY - 74,
                w: 138,
                h: 68,
                vx: -360,
                timer: 4.2,
                damage: 1,
                sprite: Math.random() < 0.5 ? "policeCar" : "redCar",
                hp: 7,
                maxHp: 7,
                color: "#ffcd3f"
            });
            showMessage("Rush hour");
            return;
        }

        if (boss.pattern === "dung") {
            const spec = enemyTypes.dungling;
            run.enemies.push({
                kind: "dungling",
                name: spec.name,
                x: boss.x - 80,
                y: run.groundY - spec.h,
                baseY: run.groundY - spec.h,
                w: spec.w,
                h: spec.h,
                hp: Math.ceil(spec.hp * 1.2),
                maxHp: Math.ceil(spec.hp * 1.2),
                speed: spec.speed * 1.2,
                flying: false,
                color: spec.color,
                score: spec.score,
                shoot: false,
                dir: -1,
                timer: 0,
                fireTimer: 2,
                frozen: 0
            });
            showMessage("Dunglings spawned");
            return;
        }

        if (boss.pattern === "space") {
            player.vy -= 420;
            run.shake = 5;
            showMessage("Gravity pulse");
            return;
        }

        if (boss.pattern === "swamp") {
            run.hazards.push({ type: "wave", x: boss.x - 20, y: run.waterY - 22, w: 62, h: 28, vx: -330, timer: 4.2, damage: 1, color: "#caff70" });
            showMessage("Poison wake");
            return;
        }

        if (boss.pattern === "sky") {
            run.wind = rand(-220, 220);
            showMessage("Crosswind");
        }
    }

    function updatePickups(dt) {
        const playerRect = entityRect(player);
        const magnetRadius = 62 + save.upgrades.magnet * 52;

        run.pickups.forEach((pickup) => {
            if (pickup.taken) {
                return;
            }

            if (pickup.type !== "bike") {
                const dx = player.x + player.w / 2 - (pickup.x + pickup.w / 2);
                const dy = player.y + player.h / 2 - (pickup.y + pickup.h / 2);
                const dist = Math.hypot(dx, dy);
                if (dist < magnetRadius && dist > 1) {
                    pickup.x += (dx / dist) * 180 * dt;
                    pickup.y += (dy / dist) * 180 * dt;
                }
            }

            if (!rectsOverlap(playerRect, pickup)) {
                return;
            }

            if (pickup.type === "bike") {
                player.nearbyBike = pickup;
                if (controls.actionPressed && player.vehicle !== "bike") {
                    mountBike(pickup);
                }
                return;
            }

            pickup.taken = true;
            if (pickup.type === "heart") {
                player.hp = Math.min(MAX_HP, player.hp + 1);
                showMessage("HP restored");
            } else {
                addMushrooms(3);
                run.stats.mushrooms += 3;
                recordDailyProgress("mushrooms", 3);
                run.score += 35;
                playAudio("eat", 0.55);
            }
        });

        run.pickups = run.pickups.filter((pickup) => !pickup.taken);
    }

    function updateHazards(dt) {
        const playerRect = entityRect(player);

        run.hazards.forEach((hazard) => {
            hazard.timer -= dt;
            hazard.damageTimer = Math.max(0, (hazard.damageTimer || 0) - dt);
            if (hazard.vx) {
                hazard.x += hazard.vx * dt;
            }

            if (hazard.type === "lightning" && hazard.timer < hazard.warn && !hazard.didDamage) {
                if (rectsOverlap(playerRect, { x: hazard.x, y: hazard.y, w: hazard.w, h: hazard.h })) {
                    damagePlayer(hazard.damage);
                    hazard.didDamage = true;
                }
            }

            if (hazard.type === "wave" && rectsOverlap(playerRect, hazard)) {
                damagePlayer(hazard.damage);
                hazard.didDamage = true;
            }

            if (hazard.type === "traffic" && !hazard.didDamage && rectsOverlap(playerRect, trafficHazardDamageRect(hazard))) {
                damagePlayer(hazard.damage || 1);
                hazard.didDamage = true;
            }

            if (hazard.type === "firePatch" && hazard.damageTimer <= 0 && rectsOverlap(playerRect, hazard)) {
                damagePlayer(hazard.damage || 1);
                hazard.damageTimer = 0.7;
            }
        });

        run.hazards = run.hazards.filter((hazard) => hazard.timer > 0);
    }

    function updateTrafficCars(dt) {
        if (!run.level || run.level.biome !== "city") {
            return;
        }

        if (run.level.motoRun) {
            updateMotoTrafficCars(dt);
            return;
        }

        run.trafficCars.forEach((car) => {
            const sprite = citySprites[car.sprite] || citySprites.redCar;
            car.y = cityTrafficCarY(sprite, car.lane);
            if (car.destroyed) {
                car.respawnTimer -= dt;
                car.hitCooldown = Math.max(0, car.hitCooldown - dt);
                if (Math.random() < 0.45) {
                    run.particles.push({
                        x: car.x + car.w * rand(0.25, 0.75),
                        y: car.y + car.h * rand(0.25, 0.6),
                        vx: rand(-24, 24),
                        vy: rand(-90, -20),
                        r: rand(4, 9),
                        life: rand(0.35, 0.85),
                        color: Math.random() < 0.35 ? "rgba(255,120,40,0.72)" : "rgba(35,38,42,0.62)"
                    });
                }
                if (car.respawnTimer <= 0) {
                    respawnTrafficCar(car);
                }
                return;
            }

            car.x += car.vx * dt;
            car.hitCooldown = Math.max(0, car.hitCooldown - dt);

            if (car.vx < 0 && car.x + car.w < -260) {
                car.x = run.level.width + rand(180, 760);
                car.hp = car.maxHp || trafficCarMaxHp(car.sprite);
            } else if (car.vx > 0 && car.x > run.level.width + 260) {
                car.x = -car.w - rand(180, 760);
                car.hp = car.maxHp || trafficCarMaxHp(car.sprite);
            }

            if (trafficDepthMatches(car) && trafficXOverlaps(car) && car.hitCooldown <= 0) {
                car.hitCooldown = 1.1;
                run.shake = Math.max(run.shake, 7);
                player.vx += Math.sign(car.vx || 1) * 230;
                player.vy = Math.min(player.vy, -180);
                damagePlayer(player.vehicle === "bike" ? 2 : 1);
            }
        });
    }

    function updateMotoTrafficCars(dt) {
        const playerRect = playerCollisionRect();

        run.trafficCars.forEach((car) => {
            updateMotoTrafficCarPose(car);
            car.hitCooldown = Math.max(0, car.hitCooldown - dt);

            if (car.destroyed) {
                car.respawnTimer -= dt;
                if (Math.random() < 0.38) {
                    run.particles.push({
                        x: car.x + car.w * rand(0.25, 0.75),
                        y: car.y + car.h * rand(0.24, 0.62),
                        vx: rand(-26, 26),
                        vy: rand(-86, -18),
                        r: rand(4, 9),
                        life: rand(0.35, 0.85),
                        color: Math.random() < 0.35 ? "rgba(255,120,40,0.72)" : "rgba(35,38,42,0.62)"
                    });
                }
                if (car.respawnTimer <= 0) {
                    if (Math.abs(car.x - player.x) < visibleWorldWidth() * 0.72) {
                        car.respawnTimer = 1.2;
                    } else {
                        respawnMotoTrafficCar(car);
                    }
                }
                return;
            }

            if (Math.abs(car.vx) > 0.1) {
                car.x += car.vx * dt;
                if (car.x < car.routeMin || car.x > car.routeMax) {
                    car.x = clamp(car.x, car.routeMin, car.routeMax);
                    car.vx *= -1;
                    car.flip = car.vx > 0;
                }
                updateMotoTrafficCarPose(car);
            }

            const carRect = trafficCarDamageRect(car);
            const overlapX = Math.min(playerRect.x + playerRect.w, carRect.x + carRect.w) - Math.max(playerRect.x, carRect.x);
            const overlapY = Math.min(playerRect.y + playerRect.h, carRect.y + carRect.h) - Math.max(playerRect.y, carRect.y);
            if (overlapX > 18 && overlapY > 18 && car.hitCooldown <= 0) {
                car.hitCooldown = 1.15;
                run.shake = Math.max(run.shake, 6);
                player.vx = Math.max(70, player.vx * 0.45);
                player.vy = Math.min(player.vy, -220);
                damagePlayer(1);
            }
        });
    }

    function updateMotoTrafficCarPose(car) {
        car.y = motoTrafficCarY(car.x, car.w, car.h);
        car.angle = Math.atan(motoTerrainSlope(car.x + car.w / 2)) * 0.45;
    }

    function respawnMotoTrafficCar(car) {
        const aheadX = clamp(Math.max(car.homeX, player.x + visibleWorldWidth() + rand(520, 1320)), car.routeMin, car.routeMax);
        car.x = aheadX;
        car.y = motoTrafficCarY(car.x, car.w, car.h);
        car.angle = Math.atan(motoTerrainSlope(car.x + car.w / 2)) * 0.45;
        car.hp = car.maxHp || trafficCarMaxHp(car.sprite);
        car.maxHp = car.hp;
        car.destroyed = false;
        car.respawnTimer = 0;
        car.hitCooldown = 0;
    }

    function updateParticles(dt) {
        run.particles.forEach((particle) => {
            particle.life -= dt;
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            particle.vy += 320 * dt;
        });
        run.particles = run.particles.filter((particle) => particle.life > 0);
    }

    function addHitParticles(x, y, color, count) {
        for (let index = 0; index < count; index += 1) {
            run.particles.push({
                x,
                y,
                vx: rand(-190, 190),
                vy: rand(-220, 40),
                r: rand(2, 5),
                life: rand(0.28, 0.62),
                color
            });
        }
    }

    function setEnemyAnimState(enemy, state, duration = 0) {
        const shouldRestart = enemy.animState !== state || (duration > 0 && (enemy.actionTimer || 0) <= 0);
        if (shouldRestart) {
            enemy.animStart = enemy.timer || 0;
        }
        enemy.animState = state;
        if (duration > 0) {
            enemy.actionTimer = Math.max(enemy.actionTimer || 0, duration);
        }
    }

    function updateCamera() {
        const worldW = visibleWorldWidth();
        const playerRatio = run.level?.motoRun ? MOTO_CAMERA_PLAYER_RATIO : DEFAULT_CAMERA_PLAYER_RATIO;
        const desired = player.x - view.w * playerRatio / gameplayWorldScale();
        run.cameraX = clamp(desired, 0, Math.max(0, run.level.width - worldW));
    }

    function updateLevelExit() {
        if (!run.level || run.level.isBossLevel || run.boss) {
            return;
        }

        if (player.x + player.w >= run.level.width - 180) {
            completeLevel();
        }
    }

    function addMushrooms(amount) {
        save.mushrooms += amount;
        persistSave();
    }

    function showMessage(text) {
        run.message = text;
        run.messageTimer = 2.1;
    }

    function completeLevel() {
        if (run.state !== "playing") {
            return;
        }

        const completedLevel = run.level;
        const campaignClear = run.levelIndex === levels.length - 1;
        const nextIndex = Math.min(run.levelIndex + 1, levels.length - 1);
        run.completedLevels[completedLevel.id] = true;
        run.maxUnlockedLevel = Math.max(run.maxUnlockedLevel, nextIndex);
        if (!campaignClear) {
            run.mapIndex = nextIndex;
        }

        run.state = "result";
        const reward = run.level.reward + Math.floor(run.score / 800);
        addMushrooms(reward);
        run.score += 900 + run.levelIndex * 180 + (completedLevel.isBossLevel ? 900 : 0);
        ui.resultEyebrow.textContent = campaignClear ? "Campaign clear" : completedLevel.isBossLevel ? "Boss defeated" : "Level clear";
        ui.resultTitle.textContent = campaignClear
            ? "Island saved"
            : completedLevel.isBossLevel
                ? `${completedLevel.boss.name} defeated`
                : `${completedLevel.mapName} cleared`;
        ui.resultCopy.textContent = campaignClear
            ? `Final score ${Math.floor(run.score)}. You earned ${reward} mushrooms.`
            : `You earned ${reward} mushrooms. The route map unlocked ${levels[nextIndex].mapName}.`;
        ui.nextZoneButton.textContent = campaignClear ? "Restart Campaign" : "Open Map";
        showScreen("result");
        renderUpgrades();
        updateHud();
    }

    function nextZone() {
        if (run.levelIndex >= levels.length - 1) {
            startCampaign();
            return;
        }
        showWorldMap();
    }

    function gameOver() {
        run.state = "gameover";
        playAudio("fall", 0.68);
        ui.gameoverCopy.textContent = `Score ${Math.floor(run.score)} on ${run.level.name}. Change hero or retry.`;
        showScreen("gameover");
    }

    function updateHud() {
        const hero = currentHero();
        const hp = clamp(player.hp, 0, MAX_HP);
        const level = run.level || currentMapLevel();
        const progress = run.level ? clamp(player.x / run.level.width, 0, 1) : 0;
        const skillCooldown = currentSkillCooldown();
        const skillReady = player.skillTimer <= 0 || run.state !== "playing";
        const skillRatio = skillReady ? 1 : clamp(1 - player.skillTimer / skillCooldown, 0, 1);
        ui.hp.textContent = `${hp}/${MAX_HP}`;
        renderHearts(hp);
        ui.hero.textContent = hero.name.replace(" Ovad", "");
        ui.zone.textContent = run.level
            ? `${level.locationShortName.toUpperCase()} ${level.stageNumber}/${LEVELS_PER_LOCATION}`
            : `MAP ${run.mapIndex + 1}/${levels.length}`;
        ui.objective.textContent = level.mapName || level.shortName || level.name;
        ui.boss.textContent = run.state === "map"
            ? "Pick the next route cell"
            : run.boss && run.boss.active
                ? `${run.boss.name} ${Math.ceil(clamp(run.boss.hp, 0, run.boss.maxHp))}/${run.boss.maxHp}`
                : level.motoRun ? "Moto run: ride to the finish" : run.cityPlan ? `${run.cityPlan.name}: ${run.cityPlan.text}` : level.isBossLevel && run.boss ? `Reach ${run.boss.name}` : "Reach the exit";
        ui.score.textContent = `${Math.floor(run.score)}`;
        ui.mushrooms.textContent = `${Math.floor(save.mushrooms)}`;
        ui.grenades.textContent = `${player.grenades}`;
        ui.hpFill.style.width = `${(hp / MAX_HP) * 100}%`;
        ui.hpFill.dataset.level = hp <= 1 ? "danger" : hp < MAX_HP ? "hurt" : "full";
        ui.skillFill.style.width = `${skillRatio * 100}%`;
        ui.progressText.textContent = `${Math.floor(progress * 100)}%`;
        ui.progressFill.style.width = `${progress * 100}%`;
        ui.eventBanner.textContent = run.message || "";
        ui.eventBanner.classList.toggle("is-visible", Boolean(run.message && run.messageTimer > 0));

        if (run.state !== "playing") {
            ui.skill.textContent = hero.skill;
        } else if (player.skillTimer <= 0) {
            ui.skill.textContent = "Ready";
        } else {
            ui.skill.textContent = `${player.skillTimer.toFixed(1)}s`;
        }
    }

    function render() {
        ctx.clearRect(0, 0, view.w, view.h);

        const level = run.level || levels[0];
        drawBackground(level);

        if (!run.level) {
            drawMenuScene();
            return;
        }

        const shakeX = run.shake > 0 ? rand(-run.shake, run.shake) : 0;
        const shakeY = run.shake > 0 ? rand(-run.shake, run.shake) : 0;

        const scale = gameplayWorldScale();
        ctx.save();
        ctx.translate(shakeX, shakeY + worldBottomOffset());
        ctx.scale(scale, scale);
        ctx.translate(-run.cameraX, 0);
        drawWorld(level);
        drawExitMarker(level);
        drawPlatforms();
        drawPickups();
        drawHazards();
        drawEnemies();
        drawBoss();
        drawBullets();
        drawPlayer();
        drawParticles();
        ctx.restore();

        drawBossHud();
        drawMessage();
        drawProgressBar();
    }

    function drawCitySprite(name, x, y, w, h, alpha = 1, flip = false) {
        const sprite = citySprites[name];
        const img = sprite && images[sprite.image];

        if (!sprite || !img || !img.complete || !img.naturalWidth) {
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            roundRect(x, y, w, h, 8);
            ctx.fill();
            return;
        }

        ctx.save();
        ctx.globalAlpha *= alpha;
        ctx.imageSmoothingEnabled = true;
        if (flip) {
            ctx.translate(x + w, y);
            ctx.scale(-1, 1);
            ctx.drawImage(img, sprite.sx, sprite.sy, sprite.sw, sprite.sh, 0, 0, w, h);
        } else {
            ctx.drawImage(img, sprite.sx, sprite.sy, sprite.sw, sprite.sh, x, y, w, h);
        }
        ctx.restore();
    }

    function deterministicUnit(seed) {
        return (hashString(String(seed)) % 10000) / 10000;
    }

    function pickDeterministic(list, seed) {
        if (!list.length) {
            return null;
        }
        return list[Math.floor(deterministicUnit(seed) * list.length) % list.length];
    }

    function graffitiTextWidth(text, scale = 1, seed = "tag") {
        let width = 0;
        for (let index = 0; index < text.length; index += 1) {
            const char = text[index];
            if (char === " ") {
                width += 7 * scale;
                continue;
            }

            const keys = graffitiLetterKeys[char.toUpperCase()];
            const key = keys ? keys[hashString(`${seed}:${char}:${index}`) % keys.length] : null;
            const img = key ? images[key] : null;
            width += ((img && img.naturalWidth) ? img.naturalWidth : 10) * scale;
            width -= 1 * scale;
        }
        return width;
    }

    function drawGraffitiTag(text, x, y, scale = 2, options = {}) {
        const seed = options.seed || `${text}:${x}:${y}`;
        const maxWidth = options.maxWidth || 0;
        const widthAtOne = graffitiTextWidth(text, 1, seed);
        const finalScale = maxWidth > 0 ? Math.min(scale, maxWidth / Math.max(1, widthAtOne)) : scale;
        const width = graffitiTextWidth(text, finalScale, seed);
        const alpha = options.alpha ?? 0.78;
        const yScale = options.yScale ?? 1;

        ctx.save();
        ctx.globalAlpha *= alpha;
        ctx.translate(x, y);
        ctx.rotate(options.rotation || 0);
        ctx.scale(1, yScale);
        ctx.imageSmoothingEnabled = false;

        if (options.decor !== false) {
            drawGraffitiDecor(width, finalScale, seed);
        }

        let cursor = 0;
        for (let index = 0; index < text.length; index += 1) {
            const char = text[index];
            if (char === " ") {
                cursor += 7 * finalScale;
                continue;
            }

            const keys = graffitiLetterKeys[char.toUpperCase()];
            const key = keys ? keys[hashString(`${seed}:${char}:${index}`) % keys.length] : null;
            const img = key ? images[key] : null;
            const letterW = ((img && img.naturalWidth) ? img.naturalWidth : 10) * finalScale;
            const letterH = ((img && img.naturalHeight) ? img.naturalHeight : 13) * finalScale;
            const wobble = (hashString(`${seed}:wobble:${index}`) % 5 - 2) * finalScale * 0.18;

            if (img && img.complete && img.naturalWidth) {
                ctx.drawImage(img, cursor, wobble, letterW, letterH);
            } else {
                ctx.fillStyle = "#8cff57";
                ctx.strokeStyle = "#101828";
                ctx.lineWidth = Math.max(1, finalScale);
                ctx.font = `900 ${Math.round(12 * finalScale)}px system-ui, sans-serif`;
                ctx.strokeText(char, cursor, 12 * finalScale + wobble);
                ctx.fillText(char, cursor, 12 * finalScale + wobble);
            }
            cursor += letterW - finalScale;
        }

        ctx.restore();
    }

    function drawGraffitiDecor(width, scale, seed) {
        const decorCount = 2 + (hashString(`${seed}:decorCount`) % 2);
        for (let index = 0; index < decorCount; index += 1) {
            const key = pickDeterministic(graffitiDecorKeys, `${seed}:decor:${index}`);
            const img = key ? images[key] : null;
            if (!img || !img.complete || !img.naturalWidth) {
                continue;
            }

            const side = deterministicUnit(`${seed}:side:${index}`) > 0.5 ? 1 : -1;
            const dx = deterministicUnit(`${seed}:dx:${index}`) * width - img.width * scale * 0.35;
            const dy = (deterministicUnit(`${seed}:dy:${index}`) - 0.55) * 18 * scale;
            const decorScale = scale * (1.1 + deterministicUnit(`${seed}:scale:${index}`) * 0.9);

            ctx.save();
            ctx.globalAlpha *= 0.48;
            if (side < 0) {
                ctx.translate(dx + img.width * decorScale, dy);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0, img.width * decorScale, img.height * decorScale);
            } else {
                ctx.drawImage(img, dx, dy, img.width * decorScale, img.height * decorScale);
            }
            ctx.restore();
        }
    }

    function drawCityBuildingGraffiti(building, gridX) {
        const seed = `building-graffiti:${run.levelIndex}:${Math.floor(gridX / CITY_BUILDING_SPACING)}:${building.name}`;
        if (deterministicUnit(seed) > 0.48) {
            return;
        }

        const tag = pickDeterministic(GRAFFITI_TAGS, `${seed}:tag`);
        const x = building.drawX + building.w * (0.12 + deterministicUnit(`${seed}:x`) * 0.08);
        const y = clamp(
            building.drawY + building.h * (0.43 + deterministicUnit(`${seed}:y`) * 0.26),
            building.drawY + 38,
            run.groundY - 118
        );
        const rotation = (deterministicUnit(`${seed}:rot`) - 0.5) * 0.08;
        drawGraffitiTag(tag, x, y, 1.95, {
            seed,
            maxWidth: building.w * 0.72,
            alpha: 0.72,
            rotation
        });
    }

    function drawCityRoadGraffiti(level) {
        const start = Math.floor((run.cameraX - 560) / 760) * 760;
        for (let x = start; x < run.cameraX + view.w + 620; x += 760) {
            const seed = `road-graffiti:${level.id}:${Math.floor(x / 760)}`;
            if (deterministicUnit(seed) > 0.42) {
                continue;
            }

            const tag = pickDeterministic(GRAFFITI_TAGS, `${seed}:tag`);
            const offsetX = 80 + deterministicUnit(`${seed}:x`) * 210;
            const laneY = deterministicUnit(`${seed}:lane`) > 0.5 ? run.groundY + 44 : run.groundY + 88;
            const rotation = (deterministicUnit(`${seed}:rot`) - 0.5) * 0.16;
            drawGraffitiTag(tag, x + offsetX, laneY, 2.45, {
                seed,
                maxWidth: 360,
                alpha: 0.34,
                rotation,
                yScale: 0.52,
                decor: false
            });
        }
    }

    function drawCarGraffiti(car) {
        const seed = car.graffitiSeed || `car-graffiti:${run.levelIndex}:${car.sprite}`;
        if (car.destroyed || deterministicUnit(seed) > 0.18) {
            return;
        }

        const tag = pickDeterministic(GRAFFITI_TAGS, `${seed}:tag`);
        const scale = car.sprite === "cityBus" || car.sprite === "foodTruck" ? 1.25 : 0.88;
        const x = car.x + car.w * 0.16;
        const y = car.y + car.h * 0.42;
        drawGraffitiTag(tag, x, y, scale, {
            seed,
            maxWidth: car.w * 0.68,
            alpha: 0.62,
            rotation: (deterministicUnit(`${seed}:rot`) - 0.5) * 0.08,
            decor: false
        });
    }

    function drawCityBackground(level) {
        ctx.save();
        if (drawCityParallaxBackground(level)) {
            ctx.restore();
            return;
        }

        ctx.fillStyle = "rgba(255,226,128,0.22)";
        ctx.beginPath();
        ctx.arc(view.w * 0.78, 78, 46, 0, Math.PI * 2);
        ctx.fill();

        const skylineTop = Math.max(70, view.h - gameplayBottomReserve() - 360);
        const parallax = run.cameraX * 0.18;
        const start = Math.floor((parallax - 160) / 130) * 130;
        for (let x = start; x < parallax + view.w + 220; x += 130) {
            const screenX = x - parallax;
            const height = 130 + ((Math.abs(Math.floor(x / 130)) * 47) % 125);
            const width = 86 + ((Math.abs(Math.floor(x / 130)) * 23) % 56);
            const y = skylineTop + 120 - height;
            ctx.fillStyle = "rgba(32,45,69,0.34)";
            ctx.fillRect(screenX, y, width, height);
            ctx.fillStyle = "rgba(255,236,164,0.18)";
            for (let wx = screenX + 14; wx < screenX + width - 8; wx += 24) {
                for (let wy = y + 24; wy < y + height - 18; wy += 28) {
                    if (((wx + wy) | 0) % 3 !== 0) {
                        ctx.fillRect(wx, wy, 9, 12);
                    }
                }
            }
        }
        ctx.restore();
    }

    function drawCityParallaxBackground(level) {
        const background = run.cityBackground || level.cityBackground || cityLevelBackground(level.stageIndex || 0, level.locationIndex || 0);
        const layers = background.layers || [];
        const speeds = [0.035, 0.065, 0.105, 0.155, 0.22];
        let drew = false;

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        layers.forEach((key, index) => {
            const img = images[key];
            if (!img || !img.complete || !img.naturalWidth) {
                return;
            }

            const scale = view.h / img.height;
            const tileW = img.width * scale;
            const tileH = img.height * scale;
            const offset = -((run.cameraX * speeds[index]) % tileW);
            for (let x = offset - tileW; x < view.w + tileW; x += tileW) {
                ctx.drawImage(img, x, 0, tileW, tileH);
            }
            drew = true;
        });

        if (drew && background.time === "Night") {
            ctx.fillStyle = "rgba(2, 8, 22, 0.12)";
            ctx.fillRect(0, 0, view.w, view.h);
        }

        ctx.restore();
        return drew;
    }

    function drawBackground(level) {
        const gradient = ctx.createLinearGradient(0, 0, 0, view.h);
        gradient.addColorStop(0, level.skyTop);
        gradient.addColorStop(1, level.skyBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, view.w, view.h);

        if (level.biome === "city") {
            drawCityBackground(level);
        }

        if (level.biome === "lake" && images.lakeBg.complete) {
            const img = images.lakeBg;
            const scale = Math.max(view.w / img.width, view.h / img.height);
            const tileW = img.width * scale;
            const tileH = img.height * scale;
            const offset = -((run.cameraX * 0.12) % tileW);
            ctx.globalAlpha = 0.48;
            for (let x = offset - tileW; x < view.w + tileW; x += tileW) {
                ctx.drawImage(img, x, 0, tileW, tileH);
            }
            ctx.globalAlpha = 1;
        }

        if (level.biome === "space") {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            for (let i = 0; i < 80; i += 1) {
                const x = (i * 97 - run.cameraX * (0.03 + (i % 5) * 0.01)) % (view.w + 80);
                const y = 30 + ((i * 53) % Math.max(80, view.h - 160));
                ctx.fillRect(x < 0 ? x + view.w + 80 : x, y, 2, 2);
            }
        }

        if (level.biome === "sky") {
            ctx.fillStyle = "rgba(255,255,255,0.55)";
            for (let i = 0; i < 8; i += 1) {
                const x = ((i * 230 - run.cameraX * 0.18) % (view.w + 220)) - 110;
                const y = 70 + (i % 4) * 55;
                drawCloud(x, y, 1 + (i % 3) * 0.2);
            }
        }
    }

    function drawMenuScene() {
        ctx.save();
        ctx.globalAlpha = 0.58;
        ctx.translate(-40, 0);
        drawCloud(view.w * 0.68, view.h * 0.22, 1.5);
        ctx.restore();
        ctx.fillStyle = "rgba(80,216,200,0.16)";
        ctx.beginPath();
        ctx.ellipse(view.w * 0.72, view.h * 0.67, 220, 64, -0.08, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawCloud(x, y, scale) {
        ctx.beginPath();
        ctx.ellipse(x, y, 42 * scale, 18 * scale, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 34 * scale, y - 6 * scale, 48 * scale, 22 * scale, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 78 * scale, y, 38 * scale, 18 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawWorld(level) {
        if (level.vehicle === "kayak") {
            ctx.fillStyle = "rgba(60, 118, 83, 0.78)";
            ctx.fillRect(run.cameraX - 80, run.waterY - 18, view.w + 160, view.h - run.waterY + 80);
            ctx.strokeStyle = "rgba(210, 255, 198, 0.34)";
            ctx.lineWidth = 3;
            for (let x = Math.floor((run.cameraX - 120) / 90) * 90; x < run.cameraX + view.w + 160; x += 90) {
                ctx.beginPath();
                ctx.moveTo(x, run.waterY + Math.sin(run.time * 3 + x * 0.02) * 8);
                ctx.quadraticCurveTo(x + 44, run.waterY - 8, x + 90, run.waterY + Math.sin(run.time * 3 + x * 0.02) * 8);
                ctx.stroke();
            }
            return;
        }

        if (level.biome === "city") {
            if (level.motoRun) {
                drawMotoCityWorld(level);
                return;
            }
            drawCityWorld(level);
            return;
        }

        ctx.fillStyle = level.soil;
        ctx.fillRect(run.cameraX - 80, run.groundY, view.w + 160, view.h - run.groundY + 80);
        ctx.fillStyle = level.ground;
        ctx.fillRect(run.cameraX - 80, run.groundY - 18, view.w + 160, 22);

        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.lineWidth = 2;
        for (let x = Math.floor((run.cameraX - 80) / 120) * 120; x < run.cameraX + view.w + 160; x += 120) {
            ctx.beginPath();
            ctx.moveTo(x, run.groundY - 18);
            ctx.quadraticCurveTo(x + 40, run.groundY - 30 - Math.sin(x) * 7, x + 92, run.groundY - 18);
            ctx.stroke();
        }
    }

    function drawExitMarker(level) {
        if (level.isBossLevel) {
            return;
        }

        const x = level.width - 126;
        const y = level.vehicle === "kayak"
            ? run.waterY - 54
            : level.motoRun
                ? motoTerrainY(x) - 70
                : run.groundY - 70;
        ctx.save();
        ctx.fillStyle = "rgba(80,216,200,0.18)";
        ctx.beginPath();
        ctx.ellipse(x + 18, y + 54, 58, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#f6fbff";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x, y + 62);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = "#50d8c8";
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 4);
        ctx.lineTo(x + 78, y + 18);
        ctx.lineTo(x + 2, y + 34);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#061015";
        ctx.font = "900 12px system-ui, sans-serif";
        ctx.fillText("EXIT", x + 14, y + 24);
        ctx.restore();
    }

    function drawMotoCityWorld(level) {
        drawMotoTerrain(level);
        drawMotoTrackDecor(level);
        drawTrafficCars();
    }

    function drawMotoTerrain(level) {
        const start = Math.floor((run.cameraX - 180) / MOTO_TERRAIN_STEP) * MOTO_TERRAIN_STEP;
        const worldW = visibleWorldWidth();
        const end = run.cameraX + worldW + 220;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(start, motoTerrainY(start));
        for (let x = start; x <= end; x += MOTO_TERRAIN_STEP / 2) {
            ctx.lineTo(x, motoTerrainY(x));
        }
        ctx.lineTo(end, view.h + 260);
        ctx.lineTo(start, view.h + 260);
        ctx.closePath();
        ctx.fillStyle = "#202733";
        ctx.fill();

        ctx.strokeStyle = "rgba(6,10,16,0.82)";
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(start, motoTerrainY(start) + 5);
        for (let x = start; x <= end; x += MOTO_TERRAIN_STEP / 2) {
            ctx.lineTo(x, motoTerrainY(x) + 5);
        }
        ctx.stroke();

        ctx.strokeStyle = "#dfe6ef";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(start, motoTerrainY(start));
        for (let x = start; x <= end; x += MOTO_TERRAIN_STEP / 2) {
            ctx.lineTo(x, motoTerrainY(x));
        }
        ctx.stroke();

        ctx.strokeStyle = "rgba(135,146,159,0.92)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(start, motoTerrainY(start) + 8);
        for (let x = start; x <= end; x += MOTO_TERRAIN_STEP / 2) {
            ctx.lineTo(x, motoTerrainY(x) + 8);
        }
        ctx.stroke();

        ctx.strokeStyle = "rgba(255,205,63,0.72)";
        ctx.lineWidth = 4;
        for (let x = Math.floor((run.cameraX - 100) / 150) * 150; x < run.cameraX + worldW + 160; x += 150) {
            const y1 = motoTerrainY(x) + 18;
            const y2 = motoTerrainY(x + 68) + 18;
            ctx.beginPath();
            ctx.moveTo(x, y1);
            ctx.lineTo(x + 68, y2);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawMotoTrackDecor(level) {
        const worldW = visibleWorldWidth();
        for (let x = Math.floor((run.cameraX - 560) / 930) * 930; x < run.cameraX + worldW + 620; x += 930) {
            const seed = `moto-road-graffiti:${level.id}:${Math.floor(x / 930)}`;
            if (deterministicUnit(seed) > 0.36) {
                continue;
            }
            const tag = pickDeterministic(GRAFFITI_TAGS, `${seed}:tag`);
            drawGraffitiTag(tag, x + 120, motoTerrainY(x + 120) + 16, 2.2, {
                seed,
                maxWidth: 340,
                alpha: 0.28,
                rotation: Math.atan(motoTerrainSlope(x + 120)) * 0.35,
                yScale: 0.5,
                decor: false
            });
        }
    }

    function drawCityWorld(level) {
        drawCityBuildings(level);

        ctx.fillStyle = "#2b303a";
        ctx.fillRect(run.cameraX - 80, run.groundY - 34, view.w + 160, view.h - run.groundY + 114);
        ctx.fillStyle = "#747d89";
        ctx.fillRect(run.cameraX - 80, run.groundY - 54, view.w + 160, 22);
        ctx.fillStyle = "#dfe6ef";
        ctx.fillRect(run.cameraX - 80, run.groundY - 58, view.w + 160, 4);
        ctx.fillStyle = "#ffcd3f";
        for (let x = Math.floor((run.cameraX - 100) / 96) * 96; x < run.cameraX + view.w + 160; x += 96) {
            ctx.fillRect(x, run.groundY + 18, 46, 5);
        }

        drawCityRoadGraffiti(level);
        drawCityStreetDecor(level);
        drawTrafficCars();
    }

    function drawCityBuildings(level) {
        const start = Math.floor((run.cameraX - 420) / CITY_BUILDING_SPACING) * CITY_BUILDING_SPACING;

        for (let x = start; x < run.cameraX + view.w + 520; x += CITY_BUILDING_SPACING) {
            const building = cityBuildingLayout(x);
            ctx.fillStyle = "rgba(0,0,0,0.22)";
            ctx.fillRect(building.drawX + 12, run.groundY - 70, building.w - 18, 18);
            drawCitySprite(building.name, building.drawX, building.drawY, building.w, building.h, 0.92);
            drawCityBuildingGraffiti(building, x);
        }
    }

    function drawCityStreetDecor(level) {
        for (let x = 520; x < level.width - 520; x += 740) {
            drawCitySprite("bench", x, run.groundY - 132, citySprites.bench.w, citySprites.bench.h, 0.88);
            drawCitySprite(x % 2 === 0 ? "stopSign" : "dangerSign", x + 170, run.groundY - 142, 42, 104, 0.9);
        }

        for (let x = 1180; x < level.width - 460; x += 920) {
            drawCitySprite("trafficLight", x, run.groundY - 190, 92, 122, 0.9);
        }

        for (let x = Math.floor((run.cameraX - 120) / 260) * 260; x < run.cameraX + view.w + 180; x += 260) {
            drawCitySprite("cone", x + 66, run.groundY - 82, 26, 42, 0.86);
        }
    }

    function drawTrafficCars() {
        run.trafficCars.forEach((car) => {
            if (car.moto) {
                ctx.save();
                ctx.translate(car.x + car.w / 2, car.y + car.h / 2);
                ctx.rotate(car.angle || 0);
                ctx.translate(-car.x - car.w / 2, -car.y - car.h / 2);
                drawTrafficCarBody(car);
                ctx.restore();
                return;
            }

            drawTrafficCarBody(car);
        });
    }

    function drawTrafficCarBody(car) {
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(car.x - 10, car.y + car.h - 9, car.w + 20, 9);
        drawCitySprite(car.sprite || "redCar", car.x, car.y, car.w, car.h, car.destroyed ? 0.42 : 0.98, car.flip);
        drawCarGraffiti(car);

        if (car.destroyed) {
            ctx.fillStyle = "rgba(10,10,12,0.58)";
            roundRect(car.x + car.w * 0.12, car.y + car.h * 0.38, car.w * 0.76, car.h * 0.34, 6);
            ctx.fill();
            ctx.fillStyle = "rgba(255,105,40,0.78)";
            ctx.beginPath();
            ctx.ellipse(car.x + car.w * 0.38, car.y + car.h * 0.5, 9, 15, 0.35, 0, Math.PI * 2);
            ctx.ellipse(car.x + car.w * 0.62, car.y + car.h * 0.45, 7, 12, -0.2, 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        if (car.hp < car.maxHp) {
            drawMiniBar(car.x + 8, car.y - 9, car.w - 16, 5, car.hp / car.maxHp, "#ffb84d");
        }
    }

    function drawPlatforms() {
        run.platforms.forEach((platform) => {
            if (platform.kind === "cityRoof") {
                return;
            }

            if (platform.kind && platform.kind.startsWith("city")) {
                drawCityPlatform(platform);
                return;
            }

            ctx.fillStyle = "rgba(0,0,0,0.24)";
            ctx.fillRect(platform.x + 5, platform.y + 8, platform.w, platform.h);
            ctx.fillStyle = platform.color;
            roundRect(platform.x, platform.y, platform.w, platform.h, 7);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.22)";
            ctx.fillRect(platform.x + 10, platform.y + 3, platform.w - 20, 3);
        });
    }

    function drawCityPlatform(platform) {
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(platform.x + 6, platform.y + 9, platform.w, platform.h);

        if (platform.sprite) {
            drawCitySprite(platform.sprite, platform.x - 14, platform.y - 48, platform.w + 28, 66, 0.95);
            ctx.fillStyle = "#28313d";
            roundRect(platform.x, platform.y, platform.w, platform.h, 6);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.55)";
            ctx.fillRect(platform.x + 12, platform.y + 3, platform.w - 24, 3);
            return;
        }

        drawCitySprite("roadPlatform", platform.x - 8, platform.y - 16, platform.w + 16, 50, 0.96);
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(platform.x + platform.w * 0.48, platform.y - 8, 8, 23);
    }

    function drawPickups() {
        run.pickups.forEach((pickup) => {
            if (pickup.type === "bike") {
                drawBike(pickup.x, pickup.y, 1);
                if (player.nearbyBike === pickup) {
                    drawWorldLabel("Ride", pickup.x + pickup.w / 2, pickup.y - 12, "#ffd166");
                }
                return;
            }

            if (pickup.type === "heart") {
                ctx.fillStyle = "#ff6b6b";
                ctx.beginPath();
                ctx.arc(pickup.x + 9, pickup.y + 10, 9, 0, Math.PI * 2);
                ctx.arc(pickup.x + 21, pickup.y + 10, 9, 0, Math.PI * 2);
                ctx.moveTo(pickup.x + 2, pickup.y + 15);
                ctx.lineTo(pickup.x + 15, pickup.y + 30);
                ctx.lineTo(pickup.x + 28, pickup.y + 15);
                ctx.fill();
                return;
            }

            const img = images.mushroomPickup;
            if (img.complete) {
                ctx.drawImage(img, pickup.x, pickup.y, pickup.w, pickup.h);
            } else {
                ctx.fillStyle = "#ffd166";
                ctx.beginPath();
                ctx.arc(pickup.x + pickup.w / 2, pickup.y + pickup.h / 2, pickup.w / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function drawEnemySprite(enemy) {
        let sprite = enemy.sprite;
        if (enemy.animations) {
            const state = enemy.dead
                ? "dead"
                : enemy.hitTimer > 0
                    ? "hurt"
                    : enemy.animState || "idle";
            sprite = enemy.animations[state] || enemy.animations.idle || enemy.animations.run || enemy.sprite;
            if (sprite && !images[sprite.image]) {
                sprite = enemy.animations.idle || enemy.animations.run || enemy.sprite;
            }
        }

        const img = sprite ? images[sprite.image] : null;
        if (!sprite || !img || !img.complete || !img.naturalWidth) {
            return false;
        }

        const frameW = sprite.frameW || img.width;
        const frameH = sprite.frameH || img.height;
        const frames = sprite.frames || Math.max(1, Math.floor(img.width / frameW));
        const animationClock = enemy.actionTimer > 0 && enemy.animStart !== undefined
            ? Math.max(0, enemy.timer - enemy.animStart)
            : enemy.timer;
        const frame = Math.floor(animationClock * (sprite.fps || 8)) % frames;
        const drawW = sprite.drawW || enemy.w;
        const drawH = sprite.drawH || enemy.h;
        let drawX = (enemy.w - drawW) / 2 + (sprite.offsetX || 0);
        const drawY = (enemy.flying ? (enemy.h - drawH) / 2 : enemy.h - drawH) + (sprite.offsetY || 0);

        ctx.save();
        if (enemy.dir < 0) {
            ctx.translate(enemy.w, 0);
            ctx.scale(-1, 1);
            drawX = enemy.w - drawX - drawW;
        }
        if (enemy.hitTimer > 0) {
            ctx.filter = "brightness(1.7) saturate(1.2)";
        }
        ctx.drawImage(img, frame * frameW, 0, frameW, frameH, drawX, drawY, drawW, drawH);
        ctx.restore();
        return true;
    }

    function drawEnemies() {
        run.enemies.forEach((enemy) => {
            if (enemy.dead && enemy.hitTimer <= 0) {
                return;
            }

            ctx.save();
            ctx.globalAlpha = enemy.frozen > 0 ? 0.62 : 1;
            ctx.translate(enemy.x, enemy.y);
            if (enemy.hitTimer > 0) {
                ctx.translate(rand(-3, 3), rand(-2, 2));
            }

            if (!drawEnemySprite(enemy)) {
                ctx.fillStyle = enemy.color;
                if (enemy.flying) {
                    ctx.fillStyle = "rgba(255,255,255,0.38)";
                    ctx.beginPath();
                    ctx.ellipse(enemy.w * 0.18, enemy.h * 0.35, enemy.w * 0.28, enemy.h * 0.28, -0.5, 0, Math.PI * 2);
                    ctx.ellipse(enemy.w * 0.72, enemy.h * 0.35, enemy.w * 0.28, enemy.h * 0.28, 0.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = enemy.color;
                    ctx.beginPath();
                    ctx.ellipse(enemy.w * 0.5, enemy.h * 0.58, enemy.w * 0.42, enemy.h * 0.34, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#121212";
                    ctx.beginPath();
                    ctx.arc(enemy.w * 0.62, enemy.h * 0.48, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (enemy.kind === "roller") {
                    ctx.beginPath();
                    ctx.arc(enemy.w / 2, enemy.h / 2, enemy.w / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = "rgba(255,255,255,0.22)";
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(enemy.w / 2, enemy.h / 2, enemy.w * 0.28, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    roundRect(0, 6, enemy.w, enemy.h - 6, 12);
                    ctx.fill();
                    ctx.fillStyle = "rgba(255,255,255,0.18)";
                    ctx.fillRect(8, 12, enemy.w - 16, 4);
                }
            }

            drawMiniBar(0, -8, enemy.w, 4, enemy.hp / enemy.maxHp, "#ff6b6b");
            ctx.restore();
        });
    }

    function drawBoss() {
        const boss = run.boss;
        if (!boss || !boss.active || boss.dead) {
            return;
        }

        ctx.save();
        ctx.translate(boss.x, boss.y);
        if (boss.hitTimer > 0) {
            ctx.translate(rand(-4, 4), rand(-3, 3));
        }
        ctx.globalAlpha = boss.frozen > 0 ? 0.7 : 1;

        if (boss.shieldTimer > 0) {
            ctx.strokeStyle = "rgba(124, 231, 255, 0.78)";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.ellipse(boss.w / 2, boss.h / 2, boss.w * 0.64, boss.h * 0.62, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.fillStyle = boss.color;
        ctx.beginPath();
        ctx.ellipse(boss.w / 2, boss.h / 2, boss.w * 0.42, boss.h * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.beginPath();
        ctx.ellipse(boss.w * 0.25, boss.h * 0.36, boss.w * 0.28, boss.h * 0.2, -0.5, 0, Math.PI * 2);
        ctx.ellipse(boss.w * 0.75, boss.h * 0.36, boss.w * 0.28, boss.h * 0.2, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#101018";
        ctx.beginPath();
        ctx.arc(boss.w * 0.6, boss.h * 0.45, 6, 0, Math.PI * 2);
        ctx.arc(boss.w * 0.73, boss.h * 0.45, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#101018";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(boss.w * 0.64, boss.h * 0.66, 20, 0.1, Math.PI - 0.1);
        ctx.stroke();
        ctx.restore();
    }

    function drawBullets() {
        run.playerBullets.forEach((bullet) => {
            drawBullet(bullet);
        });
        run.enemyBullets.forEach((bullet) => {
            drawBullet(bullet);
        });
    }

    function drawBullet(bullet) {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.fillStyle = bullet.color || (bullet.owner === "player" ? "#ffffff" : "#ff6b6b");
        if (bullet.type === "comet" || bullet.type === "fire") {
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 12;
        }

        if (bullet.type === "gangster" || bullet.type === "gangsterHeavy") {
            const angle = Math.atan2(bullet.vy || 0, bullet.vx || 1);
            const length = bullet.type === "gangsterHeavy" ? 26 : 20;
            ctx.rotate(angle);
            ctx.strokeStyle = "rgba(255, 236, 172, 0.72)";
            ctx.lineWidth = bullet.type === "gangsterHeavy" ? 3 : 2;
            ctx.beginPath();
            ctx.moveTo(-length, 0);
            ctx.lineTo(4, 0);
            ctx.stroke();
            ctx.fillStyle = bullet.color || "#f6fbff";
            ctx.beginPath();
            ctx.arc(5, 0, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        if (bullet.type === "grenade") {
            ctx.rotate(run.time * 8);
            ctx.fillStyle = "#2a2d34";
            ctx.beginPath();
            ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = bullet.color || "#ffb84d";
            ctx.fillRect(-3, -bullet.radius - 4, 7, 5);
            ctx.strokeStyle = "rgba(255,255,255,0.55)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, bullet.radius * 0.58, -0.8, 0.9);
            ctx.stroke();
            ctx.restore();
            return;
        }

        if (bullet.type === "molotov") {
            const angle = Math.atan2(bullet.vy || 0, bullet.vx || 1);
            ctx.rotate(angle + run.time * 5);
            ctx.fillStyle = "#22443a";
            roundRect(-4, -11, 8, 20, 3);
            ctx.fill();
            ctx.fillStyle = "#6f3a1f";
            ctx.fillRect(-3, -15, 6, 6);
            ctx.fillStyle = "#ffcf6b";
            ctx.beginPath();
            ctx.moveTo(0, -19);
            ctx.quadraticCurveTo(9, -9, 2, -5);
            ctx.quadraticCurveTo(-8, -9, 0, -19);
            ctx.fill();
            ctx.restore();
            return;
        }

        const sprite = bullet.sprite && images[bullet.sprite];
        if (sprite && sprite.complete && sprite.naturalWidth) {
            const angle = Math.atan2(bullet.vy || 0, bullet.vx || 1);
            const length = bullet.spriteLength || bullet.radius * 3.4;
            const height = Math.max(7, length * (sprite.height / Math.max(1, sprite.width)));

            ctx.rotate(angle);
            ctx.globalAlpha = 0.38;
            ctx.strokeStyle = bullet.color || "#ffffff";
            ctx.lineWidth = Math.max(2, bullet.radius * 0.55);
            ctx.beginPath();
            ctx.moveTo(-length * 0.65, 0);
            ctx.lineTo(-length * 1.55, 0);
            ctx.stroke();
            ctx.globalAlpha = 1;

            if (bullet.rocket) {
                const flame = ctx.createRadialGradient(-length * 0.58, 0, 1, -length * 0.58, 0, 13);
                flame.addColorStop(0, "#fff3a3");
                flame.addColorStop(0.45, "#ff8f3a");
                flame.addColorStop(1, "rgba(255,80,30,0)");
                ctx.fillStyle = flame;
                ctx.beginPath();
                ctx.ellipse(-length * 0.72, 0, 13, 7, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.drawImage(sprite, -length * 0.34, -height / 2, length, height);
            ctx.restore();
            return;
        }

        ctx.beginPath();
        ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        if (bullet.type === "leaf" || bullet.type === "spark") {
            ctx.strokeStyle = "rgba(255,255,255,0.48)";
            ctx.beginPath();
            ctx.moveTo(-bullet.radius * 2, 0);
            ctx.lineTo(bullet.radius * 2, 0);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawHazards() {
        run.hazards.forEach((hazard) => {
            if (hazard.type === "lightning") {
                const armed = hazard.timer < hazard.warn;
                ctx.fillStyle = armed ? "rgba(255,240,112,0.5)" : "rgba(255,240,112,0.14)";
                ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
                if (armed) {
                    ctx.strokeStyle = "#fff070";
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(hazard.x + hazard.w / 2, hazard.y);
                    ctx.lineTo(hazard.x + 8, hazard.y + hazard.h * 0.3);
                    ctx.lineTo(hazard.x + hazard.w - 8, hazard.y + hazard.h * 0.6);
                    ctx.lineTo(hazard.x + hazard.w / 2, hazard.y + hazard.h);
                    ctx.stroke();
                }
                return;
            }

            if (hazard.type === "traffic") {
                drawCitySprite(hazard.sprite || "redCar", hazard.x, hazard.y, hazard.w, hazard.h);
                ctx.fillStyle = "rgba(255,205,63,0.22)";
                ctx.fillRect(hazard.x - 12, hazard.y + hazard.h - 8, hazard.w + 24, 8);
                if (hazard.hp < hazard.maxHp) {
                    drawMiniBar(hazard.x + 8, hazard.y - 9, hazard.w - 16, 5, hazard.hp / hazard.maxHp, "#ffb84d");
                }
                return;
            }

            if (hazard.type === "firePatch") {
                const alpha = clamp(hazard.timer / 2.8, 0, 1);
                const flame = ctx.createLinearGradient(0, hazard.y, 0, hazard.y + hazard.h);
                flame.addColorStop(0, `rgba(255, 236, 128, ${0.7 * alpha})`);
                flame.addColorStop(0.45, `rgba(255, 113, 24, ${0.78 * alpha})`);
                flame.addColorStop(1, `rgba(114, 22, 10, ${0.36 * alpha})`);
                ctx.fillStyle = flame;
                ctx.beginPath();
                ctx.ellipse(hazard.x + hazard.w / 2, hazard.y + hazard.h / 2, hazard.w / 2, hazard.h / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                for (let index = 0; index < 5; index += 1) {
                    const px = hazard.x + 12 + index * (hazard.w - 24) / 4;
                    const height = 12 + Math.sin(run.time * 10 + index) * 5;
                    ctx.fillStyle = index % 2 === 0 ? "#ffd36d" : "#ff5a1f";
                    ctx.beginPath();
                    ctx.moveTo(px - 5, hazard.y + hazard.h - 4);
                    ctx.quadraticCurveTo(px, hazard.y + hazard.h - height, px + 5, hazard.y + hazard.h - 4);
                    ctx.fill();
                }
                return;
            }

            ctx.fillStyle = hazard.color || "#9fff62";
            ctx.globalAlpha = 0.75;
            roundRect(hazard.x, hazard.y, hazard.w, hazard.h, 12);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    function drawPlayer() {
        const hero = currentHero();
        const motoRun = run.level?.motoRun && player.vehicle === "bike";
        ctx.save();
        ctx.translate(player.x + player.w / 2, player.y + player.h / 2);

        if (player.phaseTimer > 0) {
            ctx.globalAlpha = 0.52 + Math.sin(run.time * 18) * 0.16;
        } else if (player.invuln > 0) {
            ctx.globalAlpha = 0.58 + Math.sin(run.time * 24) * 0.22;
        }

        if (motoRun && Math.abs(player.flipAngle) > 0.01) {
            ctx.rotate(player.flipAngle);
        }

        if (player.vehicle === "bike") {
            drawMotorcycle(-48, player.h / 2 - 25, motoRun ? 1.08 : 1);
        }
        if (player.vehicle === "kayak") {
            drawKayak(-52, player.h / 2 - 18);
        }

        if (!motoRun && (player.flipTimer > 0 || Math.abs(player.flipAngle) > 0.01)) {
            ctx.rotate(player.flipAngle);
        }

        const bodyBob = player.onGround && !player.vehicle ? Math.sin(run.time * 12) * Math.min(2.5, Math.abs(player.vx) / 90) : 0;
        ctx.translate(0, bodyBob);
        drawSpriteLimbs(hero, "back");

        ctx.save();
        if (player.dir < 0) {
            ctx.scale(-1, 1);
        }
        const img = images[hero.image];
        if (img && img.complete) {
            ctx.drawImage(img, -player.w / 2 - 4, -player.h / 2 - 6, player.w + 8, player.h + 8);
        } else {
            ctx.fillStyle = hero.color;
            roundRect(-player.w / 2, -player.h / 2, player.w, player.h, 12);
            ctx.fill();
        }
        ctx.restore();

        drawSpriteLimbs(hero, "front");
        ctx.restore();

        drawAimLine(hero);

        if (player.shieldTimer > 0) {
            ctx.strokeStyle = "rgba(184,192,200,0.82)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(player.x + player.w / 2, player.y + player.h / 2, player.w * 0.75, player.h * 0.62, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    function drawSpriteLimbs(hero, layer) {
        const front = layer === "front";
        const movement = clamp(Math.abs(player.vx) / 220, 0, 1);
        const stride = player.onGround && !player.vehicle ? Math.sin(run.time * 11 + player.x * 0.035) * movement : 0;
        const phase = front ? stride : -stride;
        const alpha = front ? 1 : 0.72;
        const color = hero.color;
        const bootColor = player.vehicle === "kayak" ? "#e78d36" : "#101820";
        const aim = getAimVector();
        const aimSide = Math.abs(aim.x) > 0.12 ? Math.sign(aim.x) : player.dir || 1;
        const side = front ? aimSide : -aimSide;
        const assetBottomY = player.h / 2 + 2;
        const legRootX = side * 10;
        const armRootX = side * 17;
        const legRootY = assetBottomY - 7;
        const armRootY = assetBottomY - 17;

        ctx.save();
        ctx.globalAlpha *= alpha;

        let armAngle = -0.1 - phase * 0.5;
        let armBend = 0.35 + Math.abs(phase) * 0.2;
        let legAngle = phase * 0.72;
        let legBend = 0.46 - Math.min(0.26, phase * 0.16);

        if (!player.onGround && !player.vehicle) {
            const tuck = player.flipTimer > 0 ? 0.95 : 0.52;
            armAngle = front ? -1.18 : 0.82;
            armBend = front ? 0.74 : -0.56;
            legAngle = front ? -0.56 * tuck : 0.58 * tuck;
            legBend = 0.92;
        }

        if (player.vehicle === "bike") {
            armAngle = front ? -1.15 : -0.86;
            armBend = front ? 0.22 : -0.18;
            legAngle = front ? 0.92 : 0.42;
            legBend = front ? -1.05 : -0.72;
        }

        if (player.vehicle === "kayak") {
            const paddle = Math.sin(run.time * 5.2);
            armAngle = front ? -1.25 + paddle * 0.28 : 0.92 - paddle * 0.24;
            armBend = front ? -0.3 : 0.45;
            legAngle = front ? 0.58 : 0.32;
            legBend = front ? -0.7 : -0.45;
        }

        const flipAngle = player.flipTimer > 0 || Math.abs(player.flipAngle) > 0.01 ? player.flipAngle : 0;
        const cos = Math.cos(flipAngle);
        const sin = Math.sin(flipAngle);
        const localAimX = aim.x * cos + aim.y * sin;
        const localAimY = -aim.x * sin + aim.y * cos;
        const aimAngle = Math.atan2(localAimX, localAimY);
        armAngle = aimAngle + (front ? -0.02 : 0.26);
        armBend = front ? 0 : 0.2;

        drawSegmentedLimb({
            x: legRootX,
            y: legRootY,
            upper: 14,
            lower: 14,
            width: 9,
            angle: legAngle,
            bend: legBend,
            color,
            capColor: bootColor,
            cap: "foot"
        });

        if (front) {
            drawHeldWeaponArmLocal(hero, armRootX, armRootY, localAimX, localAimY);
        } else {
            drawSupportArmLocal(hero, armRootX, armRootY, localAimX, localAimY);
        }

        ctx.restore();
    }

    function drawWeaponSpriteLocal(hero, handX, handY, aimX, aimY) {
        const weapon = currentWeapon(hero);
        const baseImage = images[weapon.image];
        const shootImage = images[weapon.shootImage];
        const firing = player.weaponAnimTimer > 0 && shootImage && shootImage.complete && shootImage.naturalWidth;
        const img = firing ? shootImage : baseImage;

        if (!img || !img.complete || !img.naturalWidth) {
            return false;
        }

        const frameW = weapon.frameW;
        const frameH = weapon.frameH;
        const frames = firing ? Math.max(1, Math.floor(img.width / frameW)) : 1;
        const progress = firing ? clamp(1 - player.weaponAnimTimer / Math.max(0.01, player.weaponAnimDuration), 0, 1) : 0;
        const frame = firing ? clamp(Math.floor(progress * frames), 0, frames - 1) : 0;
        const length = Math.hypot(aimX, aimY) || 1;
        const ax = aimX / length;
        const ay = aimY / length;
        const flipped = ax < 0;
        const angle = flipped ? Math.atan2(-ay, -ax) : Math.atan2(ay, ax);
        const drawW = weapon.drawW;
        const drawH = drawW * (frameH / frameW);
        const gripX = weapon.gripX * (drawW / frameW);
        const gripY = weapon.gripY * (drawH / frameH);
        const recoil = firing ? Math.sin(progress * Math.PI) * weapon.recoil : 0;

        ctx.save();
        ctx.translate(handX - ax * recoil, handY - ay * recoil);
        ctx.rotate(angle);
        if (flipped) {
            ctx.scale(-1, 1);
        }
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, frame * frameW, 0, frameW, frameH, -gripX, -gripY, drawW, drawH);
        ctx.restore();
        return true;
    }

    function drawHeldWeaponArmLocal(hero, armRootX, armRootY, aimX, aimY) {
        const length = Math.hypot(aimX, aimY) || 1;
        const ax = aimX / length;
        const ay = aimY / length;
        const handX = armRootX + ax * 24;
        const handY = armRootY + ay * 24;

        ctx.save();
        ctx.lineCap = "round";
        drawLimbStroke(armRootX, armRootY, handX, handY, 9, hero.color);

        if (!drawWeaponSpriteLocal(hero, handX, handY, aimX, aimY)) {
            const sideX = -ay;
            const sideY = ax;
            ctx.strokeStyle = "rgba(7, 12, 20, 0.9)";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(handX - ax * 18 - sideX * 4, handY - ay * 18 - sideY * 4);
            ctx.lineTo(handX + ax * 38, handY + ay * 38);
            ctx.stroke();
        }

        drawHand(handX, handY, 5.2);
        ctx.restore();
    }

    function drawSupportArmLocal(hero, armRootX, armRootY, aimX, aimY) {
        const length = Math.hypot(aimX, aimY) || 1;
        const ax = aimX / length;
        const ay = aimY / length;
        const sideX = -ay;
        const sideY = ax;
        const weapon = currentWeapon(hero);
        const weaponRootX = -armRootX;
        const weaponRootY = armRootY;
        const gripX = weaponRootX + ax * weapon.supportDistance + sideX * 4;
        const gripY = weaponRootY + ay * weapon.supportDistance + sideY * 4;
        const elbowX = armRootX + ax * 20 - sideX * 6;
        const elbowY = armRootY + ay * 20 - sideY * 6;

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(7, 12, 20, 0.58)";
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(armRootX, armRootY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(gripX, gripY);
        ctx.stroke();

        ctx.strokeStyle = hero.color;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(armRootX, armRootY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(gripX, gripY);
        ctx.stroke();

        drawHand(gripX, gripY, 4.8);
        ctx.restore();
    }

    function drawLimbStroke(fromX, fromY, toX, toY, width, color) {
        ctx.strokeStyle = "rgba(7, 12, 20, 0.58)";
        ctx.lineWidth = width + 4;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }

    function drawHand(x, y, radius) {
        ctx.fillStyle = "#ffe0bd";
        ctx.strokeStyle = "rgba(7, 12, 20, 0.68)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    function drawSegmentedLimb({ x, y, upper, lower, width, angle, bend, color, capColor, cap }) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.strokeStyle = "rgba(7, 12, 20, 0.58)";
        ctx.lineWidth = 1.5;
        roundRect(-width / 2, 0, width, upper, width / 2);
        ctx.fill();
        ctx.stroke();
        ctx.translate(0, upper - 2);
        ctx.rotate(bend);
        roundRect(-width / 2, 0, width, lower, width / 2);
        ctx.fill();
        ctx.stroke();
        ctx.translate(0, lower);
        ctx.fillStyle = capColor;

        if (cap === "foot") {
            roundRect(-width / 2 - 3, -2, width + 10, 7, 4);
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(0, 2, width * 0.56, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawAimLine(hero) {
        const aim = getAimVector();
        const muzzle = weaponMuzzlePoint(aim, hero);

        if (controls.aimActive || isShooting()) {
            ctx.save();
            ctx.globalAlpha = 0.52;
            ctx.strokeStyle = "rgba(255,255,255,0.78)";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            const reticleX = muzzle.x + aim.x * 32;
            const reticleY = muzzle.y + aim.y * 32;
            ctx.beginPath();
            ctx.arc(reticleX, reticleY, 9, 0, Math.PI * 2);
            ctx.moveTo(reticleX - 14, reticleY);
            ctx.lineTo(reticleX + 14, reticleY);
            ctx.moveTo(reticleX, reticleY - 14);
            ctx.lineTo(reticleX, reticleY + 14);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.lineCap = "butt";
            ctx.restore();
        }
    }

    function drawBike(x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = "#121820";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(17, 31, 13, 0, Math.PI * 2);
        ctx.arc(69, 31, 13, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(17, 31);
        ctx.lineTo(38, 12);
        ctx.lineTo(57, 31);
        ctx.lineTo(30, 31);
        ctx.lineTo(48, 12);
        ctx.lineTo(69, 31);
        ctx.stroke();
        ctx.restore();
    }

    function drawMotorcycle(x, y, scale) {
        const sprite = images.playerMotorcycle;
        if (sprite && sprite.complete && sprite.naturalWidth) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(sprite, 5, 32, 54, 32, 0, -8, 104, 62);
            ctx.restore();
            return;
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.translate(96, 0);
        ctx.scale(-1, 1);

        ctx.strokeStyle = "#101820";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(17, 34, 14, 0, Math.PI * 2);
        ctx.arc(76, 34, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#5f6876";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(17, 34, 8, 0, Math.PI * 2);
        ctx.arc(76, 34, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 6;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(17, 34);
        ctx.lineTo(40, 16);
        ctx.lineTo(58, 34);
        ctx.lineTo(31, 34);
        ctx.lineTo(49, 16);
        ctx.lineTo(76, 34);
        ctx.stroke();

        ctx.fillStyle = "#2f3540";
        roundRect(35, 18, 30, 12, 4);
        ctx.fill();
        ctx.fillStyle = "#ff4b3e";
        roundRect(49, 9, 22, 10, 4);
        ctx.fill();

        ctx.strokeStyle = "#101820";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(70, 15);
        ctx.lineTo(86, 5);
        ctx.moveTo(84, 5);
        ctx.lineTo(94, 6);
        ctx.moveTo(26, 23);
        ctx.lineTo(13, 14);
        ctx.stroke();

        ctx.fillStyle = "rgba(255,205,63,0.28)";
        ctx.beginPath();
        ctx.ellipse(2, 34, 20, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawKayak(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#e78d36";
        ctx.beginPath();
        ctx.moveTo(0, 22);
        ctx.quadraticCurveTo(52, -8, 104, 22);
        ctx.quadraticCurveTo(52, 38, 0, 22);
        ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.ellipse(52, 20, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawParticles() {
        run.particles.forEach((particle) => {
            ctx.globalAlpha = clamp(particle.life * 2, 0, 1);
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    function drawMiniBar(x, y, w, h, ratio, color) {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, Math.max(0, w * ratio), h);
    }

    function drawBossHud() {
        const boss = run.boss;
        if (!boss || !boss.active || boss.dead) {
            return;
        }

        const width = Math.min(520, view.w - 32);
        const x = (view.w - width) / 2;
        const y = Math.max(58, 16);
        ctx.fillStyle = "rgba(7,12,20,0.74)";
        roundRect(x, y, width, 42, 8);
        ctx.fill();
        ctx.fillStyle = "#f6fbff";
        ctx.font = "900 13px system-ui, sans-serif";
        ctx.fillText(boss.name, x + 12, y + 17);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        roundRect(x + 12, y + 25, width - 24, 8, 4);
        ctx.fill();
        ctx.fillStyle = boss.color;
        roundRect(x + 12, y + 25, (width - 24) * clamp(boss.hp / boss.maxHp, 0, 1), 8, 4);
        ctx.fill();
    }

    function drawMessage() {
        if (ui.eventBanner) {
            return;
        }

        if (!run.message || run.messageTimer <= 0) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = clamp(run.messageTimer, 0, 1);
        ctx.fillStyle = "rgba(7,12,20,0.82)";
        const text = run.message;
        ctx.font = "900 15px system-ui, sans-serif";
        const width = Math.min(view.w - 32, ctx.measureText(text).width + 34);
        const x = (view.w - width) / 2;
        const y = Math.max(92, view.h - gameplayBottomReserve() - 58);
        roundRect(x, y, width, 38, 8);
        ctx.fill();
        ctx.fillStyle = "#f6fbff";
        ctx.textAlign = "center";
        ctx.fillText(text, view.w / 2, y + 24);
        ctx.restore();
    }

    function drawProgressBar() {
        if (ui.progressFill) {
            return;
        }

        if (!run.level) {
            return;
        }

        const width = Math.min(360, view.w - 32);
        const x = 16;
        const y = view.h - gameplayBottomReserve() + 24;
        const ratio = clamp(player.x / run.level.width, 0, 1);
        ctx.fillStyle = "rgba(7,12,20,0.65)";
        roundRect(x, y, width, 8, 4);
        ctx.fill();
        ctx.fillStyle = "#50d8c8";
        roundRect(x, y, width * ratio, 8, 4);
        ctx.fill();
    }

    function drawWorldLabel(text, x, y, color) {
        ctx.fillStyle = "rgba(7,12,20,0.75)";
        ctx.font = "900 13px system-ui, sans-serif";
        const w = ctx.measureText(text).width + 18;
        roundRect(x - w / 2, y - 22, w, 24, 6);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(text, x, y - 6);
        ctx.textAlign = "left";
    }

    function roundRect(x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    function handleKey(event, pressed) {
        const code = event.code;
        let handledAim = false;

        if (code === "ArrowLeft" || code === "KeyA") {
            controls.left = pressed;
        }
        if (code === "ArrowRight" || code === "KeyD") {
            controls.right = pressed;
        }
        if (code === "ArrowDown" || code === "KeyS") {
            controls.down = pressed;
        }
        if (code === "ArrowUp" || code === "KeyW") {
            event.preventDefault();
            controls.up = pressed;
            if (!run.level || run.level.biome !== "city") {
                controls.jump = pressed;
                if (pressed) {
                    controls.jumpPressed = true;
                }
            } else if (!pressed) {
                controls.jump = false;
            }
        }
        if (code === "Space") {
            event.preventDefault();
            controls.jump = pressed;
            if (pressed) {
                controls.jumpPressed = true;
            }
        }

        if (code === "KeyJ") {
            controls.aimKeys.left = pressed;
            handledAim = true;
        }
        if (code === "KeyL") {
            controls.aimKeys.right = pressed;
            handledAim = true;
        }
        if (code === "KeyI") {
            controls.aimKeys.up = pressed;
            handledAim = true;
        }
        if (code === "KeyK") {
            controls.aimKeys.down = pressed;
            handledAim = true;
        }
        if (handledAim) {
            event.preventDefault();
            updateAimFromKeys();
        }

        if (code === "KeyF" || code === "ControlLeft") {
            event.preventDefault();
            controls.fireHeld = pressed;
        }

        if (code === "KeyE" || code === "KeyQ" || code === "ShiftLeft" || code === "ShiftRight") {
            event.preventDefault();
            controls.skill = pressed;
        }
        if (code === "KeyG") {
            event.preventDefault();
            controls.grenade = pressed;
            if (pressed) {
                controls.grenadePressed = true;
            }
        }
        if (code === "Enter" || code === "KeyR") {
            event.preventDefault();
            controls.action = pressed;
            if (pressed) {
                controls.actionPressed = true;
            }
        }
    }

    function bindMoveStick() {
        const stick = document.getElementById("move-stick");
        const knob = document.getElementById("move-knob");
        if (!stick || !knob) {
            return;
        }

        const resetStick = () => {
            controls.left = false;
            controls.right = false;
            controls.up = false;
            controls.down = false;
            controls.jump = false;
            controls.action = false;
            controls.moveStickActive = false;
            controls.moveStickActionHeld = false;
            stick.classList.remove("is-active");
            knob.style.transform = "";
        };

        const updateStick = (event) => {
            const rect = stick.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) {
                return;
            }

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = event.clientX - centerX;
            const dy = event.clientY - centerY;
            const distance = Math.hypot(dx, dy);
            const maxDistance = rect.width * 0.34;
            const clamped = distance > maxDistance && distance > 0 ? maxDistance / distance : 1;
            const x = maxDistance > 0 ? clamp(dx / maxDistance, -1, 1) : 0;
            const y = maxDistance > 0 ? clamp(dy / maxDistance, -1, 1) : 0;
            const deadzone = 0.24;
            const wantsAction = y > 0.82 && Math.abs(x) < 0.56;

            knob.style.transform = `translate(${dx * clamped}px, ${dy * clamped}px)`;
            controls.left = x < -deadzone;
            controls.right = x > deadzone;
            controls.up = y < -deadzone;
            controls.down = y > deadzone;
            controls.action = wantsAction;

            if (wantsAction && !controls.moveStickActionHeld) {
                controls.actionPressed = true;
            }

            controls.moveStickActionHeld = wantsAction;
        };

        stick.addEventListener("pointerdown", (event) => {
            if (run.state !== "playing") {
                return;
            }

            event.preventDefault();
            controls.moveStickActive = true;
            controls.jumpPressed = true;
            stick.setPointerCapture(event.pointerId);
            stick.classList.add("is-active");
            updateStick(event);
        });

        stick.addEventListener("pointermove", (event) => {
            if (!controls.moveStickActive || run.state !== "playing") {
                return;
            }

            event.preventDefault();
            updateStick(event);
        });

        ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
            stick.addEventListener(eventName, resetStick);
        });
    }

    function bindMobileControls() {
        document.querySelectorAll("[data-control]").forEach((button) => {
            const name = button.dataset.control;
            button.addEventListener("pointerdown", (event) => {
                event.preventDefault();
                button.setPointerCapture(event.pointerId);
                button.classList.add("is-pressed");
                controls[name] = true;
                if (name === "jump") {
                    controls.jumpPressed = true;
                }
                if (name === "action") {
                    controls.actionPressed = true;
                }
                if (name === "grenade") {
                    controls.grenadePressed = true;
                }
            });

            ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
                button.addEventListener(eventName, () => {
                    button.classList.remove("is-pressed");
                    controls[name] = false;
                });
            });
        });
    }

    function aimFromClientPoint(clientX, clientY) {
        if (!run.level) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const scale = gameplayWorldScale();
        const worldX = (clientX - rect.left) / scale + run.cameraX;
        const worldY = (clientY - rect.top - worldBottomOffset()) / scale;
        const originX = player.x + player.w / 2;
        const originY = player.y + player.h * 0.43;
        setAimVector(worldX - originX, worldY - originY, true);
    }

    function bindPointerAim() {
        canvas.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "mouse" && event.button !== 0) {
                return;
            }
            if (run.state !== "playing") {
                return;
            }

            event.preventDefault();
            controls.pointerShoot = true;
            controls.aimPointerId = event.pointerId;
            canvas.setPointerCapture(event.pointerId);
            aimFromClientPoint(event.clientX, event.clientY);
            shoot();
        });

        canvas.addEventListener("pointermove", (event) => {
            if (run.state !== "playing") {
                return;
            }
            if (event.pointerType === "mouse" || controls.pointerShoot) {
                aimFromClientPoint(event.clientX, event.clientY);
            }
        });

        ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
            canvas.addEventListener(eventName, (event) => {
                if (controls.aimPointerId === null || controls.aimPointerId === event.pointerId) {
                    controls.pointerShoot = false;
                    controls.aimPointerId = null;
                }
            });
        });
    }

    function bindAimStick() {
        const stick = document.getElementById("aim-stick");
        const knob = document.getElementById("aim-knob");
        if (!stick || !knob) {
            return;
        }

        const updateStick = (event) => {
            const rect = stick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let dx = event.clientX - centerX;
            let dy = event.clientY - centerY;
            const distance = Math.hypot(dx, dy);
            const maxDistance = rect.width * 0.34;

            if (distance < 8) {
                dx = player.dir || 1;
                dy = 0;
            }

            setAimVector(dx, dy, true);

            const clamped = distance > maxDistance ? maxDistance / distance : 1;
            knob.style.transform = `translate(${dx * clamped}px, ${dy * clamped}px)`;
            controls.aimStickShoot = true;
            shoot();
        };

        stick.addEventListener("pointerdown", (event) => {
            if (run.state !== "playing") {
                return;
            }

            event.preventDefault();
            stick.setPointerCapture(event.pointerId);
            stick.classList.add("is-active");
            updateStick(event);
        });

        stick.addEventListener("pointermove", (event) => {
            if (!controls.aimStickShoot || run.state !== "playing") {
                return;
            }

            event.preventDefault();
            updateStick(event);
        });

        ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
            stick.addEventListener(eventName, () => {
                controls.aimStickShoot = false;
                stick.classList.remove("is-active");
                knob.style.transform = "";
            });
        });
    }

    function bindUi() {
        document.getElementById("start-button").addEventListener("click", startCampaign);
        document.getElementById("heroes-button").addEventListener("click", () => openHeroes("menu"));
        ui.mapStartButton.addEventListener("click", () => startLevel(run.mapIndex));
        ui.mapHeroesButton.addEventListener("click", () => openHeroes("map"));
        ui.mapMenuButton.addEventListener("click", () => {
            run.state = "menu";
            showScreen("menu");
        });
        ui.settingsButton.addEventListener("click", () => openSettings("menu"));
        document.getElementById("reset-button").addEventListener("click", resetSave);
        document.getElementById("heroes-back").addEventListener("click", closeHeroes);
        ui.pauseButton.addEventListener("click", () => {
            if (run.state === "playing") {
                showPause();
            } else {
                showScreen("menu");
            }
        });
        document.getElementById("resume-button").addEventListener("click", resumeGame);
        document.getElementById("pause-heroes-button").addEventListener("click", () => openHeroes("pause"));
        ui.pauseSettingsButton.addEventListener("click", () => openSettings("pause"));
        document.getElementById("restart-zone-button").addEventListener("click", () => startLevel(run.levelIndex));
        document.getElementById("pause-menu-button").addEventListener("click", () => {
            run.state = "menu";
            showScreen("menu");
        });
        ui.nextZoneButton.addEventListener("click", nextZone);
        document.getElementById("result-heroes-button").addEventListener("click", () => openHeroes("result"));
        document.getElementById("retry-button").addEventListener("click", () => startLevel(run.levelIndex));
        document.getElementById("gameover-heroes-button").addEventListener("click", () => openHeroes("gameover"));
        document.getElementById("gameover-menu-button").addEventListener("click", () => {
            run.state = "menu";
            showScreen("menu");
        });
        ui.settingsBack.addEventListener("click", closeSettings);
        ui.audioResetButton.addEventListener("click", () => {
            audioSettings = { ...DEFAULT_AUDIO_SETTINGS };
            persistAudioSettings();
            applyAudioSettings();
        });
        Object.entries(ui.volumeInputs).forEach(([key, input]) => {
            bindVolumeInput(key, input);
        });
    }

    function initTelegramWebApp() {
        const telegramApp = window.Telegram && window.Telegram.WebApp;
        if (!telegramApp) {
            return;
        }

        telegramApp.ready();
        telegramApp.expand();
        if (typeof telegramApp.setHeaderColor === "function") {
            telegramApp.setHeaderColor("#101820");
        }
        if (typeof telegramApp.setBackgroundColor === "function") {
            telegramApp.setBackgroundColor("#101820");
        }
        if (typeof telegramApp.disableVerticalSwipes === "function") {
            telegramApp.disableVerticalSwipes();
        }
    }

    function loop(timestamp) {
        const dt = Math.min(0.033, (timestamp - lastFrame) / 1000 || 0);
        lastFrame = timestamp;
        update(dt);
        render();
        requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("keydown", (event) => {
        if (event.code === "Escape" || event.code === "KeyP") {
            event.preventDefault();
            if (run.state === "playing") {
                showPause();
            } else if (run.state === "paused") {
                resumeGame();
            }
            return;
        }
        handleKey(event, true);
    });
    window.addEventListener("keyup", (event) => handleKey(event, false));

    bindUi();
    bindMoveStick();
    bindMobileControls();
    bindPointerAim();
    bindAimStick();
    applyAudioSettings();
    resizeCanvas();
    renderHeroGrid();
    renderUpgrades();
    renderDailyOps();
    updateHud();
    initTelegramWebApp();
    requestAnimationFrame(loop);
})();
