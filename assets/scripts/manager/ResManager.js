const ResMapping = require("resmapping");
const SceneDefines = require('scenedefines');
const GlobalVar = require("globalvar");

var ResManager = cc.Class({
    extends: cc.Component,
    ctor: function () {
        this.cache = [];
        for (let i in ResMapping.ResType) {
            this.cache[ResMapping.ResType[i]] = {};
        }
        this.resDocument = [];
        for (let i = SceneDefines.INIT_STATE; i < SceneDefines.STATECOUNT; i++) {
            this.resDocument[i] = [];
        }
        this.initResDocument();
        this.loadCallBack = null;
        this.loadStep = 0;
    },

    statics: {
        instance: null,
        getInstance: function () {
            if (ResManager.instance == null) {
                ResManager.instance = new ResManager();
            }
            return ResManager.instance;
        },
        destroyInstance() {
            if (ResManager.instance != null) {
                delete ResManager.instance;
                ResManager.instance = null;
            }
        }
    },

    loadResArray: function (array, callback) {
        if (typeof array !== 'undefined') {
            let sum = array.length;
            for (let i = 0; i < array.length; i++) {
                this.loadRes(array[i].type, array[i].url, function (obj) {
                    sum--;
                    if (sum <= 0 && !!callback) {
                        callback();
                    }
                })
            }
        }
    },

    setPreLoadHero: function () {
        this.preLoadArray = [];
        this.resSliceArray = {};
        let members = GlobalVar.tblApi.getData('TblMember');
        for (let memberID in members) {
            let resArray = [];
            let path = 'cdnRes/battlemodel/prefab/Fighter/Fighter_' + memberID;
            resArray.push({
                url: path,
                type: ResMapping.ResType.Prefab,
            });
            for (let q = members[memberID].wSkillCommon; q <= members[memberID].wSkillCommon + 3; q++) {
                let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', q);
                for (let bulletIndex in skill.oVecBulletIDs) {
                    let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[bulletIndex]);
                    if (bullet.strName.indexOf("thunderball") != -1) {
                        for (let index = 1; index < 10; index += 2) {
                            let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                            resArray.push({
                                url: path,
                                type: ResMapping.ResType.SpriteFrame,
                            });
                        }
                    } else {
                        let path = 'cdnRes/bullets/' + bullet.strName;
                        resArray.push({
                            url: path,
                            type: ResMapping.ResType.SpriteFrame,
                        });
                    }
                }
            }
            this.resSliceArray[memberID] = resArray;
        }
        let guazais = GlobalVar.tblApi.getData('TblGuaZai');
        for (let guazaiID in guazais) {
            let resArray = [];
            if (guazais[guazaiID].strModel != '') {
                if (guazais[guazaiID].strModel.indexOf("L") != -1) {
                    let path = 'cdnRes/battlemodel/prefab/Wingman/' + guazais[guazaiID].strModel;
                    resArray.push({
                        url: path,
                        type: ResMapping.ResType.Prefab,
                    });
                } else {
                    let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', guazais[guazaiID].strModel);
                    let path = '';
                    if (itemData.byColor != 6) {
                        path = 'cdnRes/itemicon/' + itemData.byType + '/' + itemData.byColor + '/' + guazais[guazaiID].strModel;
                    } else {
                        path = 'cdnRes/itemicon/' + itemData.byType + '/5/' + guazais[guazaiID].strModel;
                    }
                    if (path != '') {
                        //let path = 'cdnRes/itemicon/' + guazais[guazaiID].strModel;
                        resArray.push({
                            url: path,
                            type: ResMapping.ResType.SpriteFrame,
                        });
                    }
                }
            }
            if (guazais[guazaiID].byPosition == 1) {
                for (let g = guazais[guazaiID].wSkillID; g <= guazais[guazaiID].wSkillID + 3; g++) {
                    let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', g);
                    for (let bulletIndex in skill.oVecBulletIDs) {
                        let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[bulletIndex]);
                        if (bullet.strName.indexOf("thunderball") != -1) {
                            for (let index = 1; index < 10; index += 2) {
                                let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                                resArray.push({
                                    url: path,
                                    type: ResMapping.ResType.SpriteFrame,
                                });
                            }
                        } else {
                            let path = 'cdnRes/bullets/' + bullet.strName;
                            resArray.push({
                                url: path,
                                type: ResMapping.ResType.SpriteFrame,
                            });
                        }
                    }
                }
            } else if (guazais[guazaiID].byPosition == 3) {
                let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', guazais[guazaiID].wSkillID);
                for (let bulletIndex in skill.oVecBulletIDs) {
                    let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[bulletIndex]);
                    if (bullet.strName.indexOf("thunderball") != -1) {
                        for (let index = 1; index < 10; index += 2) {
                            let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                            resArray.push({
                                url: path,
                                type: ResMapping.ResType.SpriteFrame,
                            });
                        }
                    } else {
                        let path = 'cdnRes/bullets/' + bullet.strName;
                        resArray.push({
                            url: path,
                            type: ResMapping.ResType.SpriteFrame,
                        });
                    }
                }
            } else if (guazais[guazaiID].byPosition == 4) {
                for (let f = guazais[guazaiID].wSkillID; f <= guazais[guazaiID].wSkillID + 1; f++) {
                    let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', f);
                    for (let bulletIndex in skill.oVecBulletIDs) {
                        let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[bulletIndex]);
                        if (bullet.strName.indexOf("thunderball") != -1) {
                            for (let index = 1; index < 10; index += 2) {
                                let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                                resArray.push({
                                    url: path,
                                    type: ResMapping.ResType.SpriteFrame,
                                });
                            }
                        } else {
                            let path = 'cdnRes/bullets/' + bullet.strName;
                            resArray.push({
                                url: path,
                                type: ResMapping.ResType.SpriteFrame,
                            });
                        }
                    }
                }
            }
            this.resSliceArray[guazaiID] = resArray;
        }
    },

    pushPreLoadHero: function (id) {
        if (typeof this.resSliceArray[id] !== 'undefined') {
            let array = this.resSliceArray[id];
            for (let key in array) {
                this.preLoadArray.push(array[key]);
            }
        }
    },

    clearPreLoadHero: function () {
        this.preLoadArray.splice(0, this.preLoadArray.length);
    },

    preLoadHero: function (callback) {
        var self = this;
        let ready = 0;
        for (let res in this.preLoadArray) {
            this.loadRes(this.preLoadArray[res].type, this.preLoadArray[res].url, function (obj, type, path) {
                if (path.indexOf('Fighter') != -1 && !!callback) {
                    callback(false);
                }
                for (let key in self.preLoadArray) {
                    if (self.preLoadArray[key].type == type && self.getPathName(self.preLoadArray[key].url) == path) {
                        ready++;
                        break;
                    }
                }
                if (ready >= self.preLoadArray.length && !!callback) {
                    self.preLoadArray.splice(0, self.preLoadArray.length);
                    callback(true);
                }
            })
        }
    },

    pushDeep: function (path, resType) {
        if (typeof this.resDeepArray !== 'undefined') {
            let has = false;
            for (let deep in this.resDeepArray) {
                if (this.resDeepArray[deep].url == path && this.resDeepArray[deep].type == resType) {
                    has = true;
                }
            }
            if (this.getCacheRes(resType, path) != null) {
                has = true;
            }
            if (!has) {
                this.resDeepArray.push({
                    url: path,
                    type: resType
                })
            }
        }
    },

    initDeepPreLoadRes: function (scene) {
        if (typeof this.resDeepArray !== 'undefined') {
            this.resDeepArray.splice(0, this.resDeepArray.length);
        } else {
            this.resDeepArray = [];
        }
        if (scene == SceneDefines.BATTLE_STATE) {
            this.pushDeep('cdnRes/prefab/BattleScene/UIBattlePause', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/BattleScene/UIBattleEnd', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/BattleScene/UIBattleCount', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/BattleScene/UIBattleCard', ResMapping.ResType.Prefab);

            this.pushDeep('cdnRes/battlemodel/motionstreak/huoyan_lan', ResMapping.ResType.Texture2D);
            this.pushDeep('cdnRes/battlemodel/motionstreak/huoyan_lv', ResMapping.ResType.Texture2D);
            this.pushDeep('cdnRes/battlemodel/motionstreak/huoyan_zi', ResMapping.ResType.Texture2D);
            this.pushDeep('cdnRes/battlemodel/motionstreak/huoyan_jin', ResMapping.ResType.Texture2D);
            this.pushDeep('cdnRes/battlemodel/motionstreak/huoyan', ResMapping.ResType.Texture2D);

            this.pushDeep('cdnRes/battle/gold', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/stone_01', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/stone_02', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/stone_03', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/battle_buff_1', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/battle_buff_2', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/battle_buff_3', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/battle_buff_4', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/battle_buff_5', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/battle_wall_dark', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/battle_wall_nebula', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/battle_wall_light', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/heroHit', ResMapping.ResType.SpriteFrame);

            this.pushDeep('cdnRes/battle/_text_resist', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/_text_miss', ResMapping.ResType.SpriteFrame);
            this.pushDeep('cdnRes/battle/_text_baoji', ResMapping.ResType.SpriteFrame);

            this.pushDeep('cdnRes/battlemodel/prefab/effect/EnemyIncoming', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/GetBuff', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/HeroBulletHit', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/MonsterBulletClear', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/MonsterHp', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/Shadow', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/Shield', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/Success', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/LaserBeam', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/HyperBazooka', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/QuantumBrust', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/Warning', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/bBomb', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/bugBomb', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/lBomb', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/miBomb', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/FlyDamageMsg', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/battlemodel/prefab/effect/FlyDamageMsgCritical', ResMapping.ResType.Prefab);

            let memberID = GlobalVar.me().memberData.getStandingByFighterID();
            let memberArray = this.resSliceArray[memberID];
            for (let mindex in memberArray) {
                this.pushDeep(memberArray[mindex].url, memberArray[mindex].type);
            }
            for (let index in GlobalVar.me().guazaiData.guazaiWear) {
                let wear = GlobalVar.me().guazaiData.getGuazaiBySlot(index);
                if (typeof wear === 'undefined' || typeof this.resSliceArray[wear.ItemID] === 'undefined') {
                    continue;
                }
                let array = this.resSliceArray[wear.ItemID];
                for (let gindex in array) {
                    this.pushDeep(array[gindex].url, array[gindex].type);
                }
            }

            let battleManager = require('BattleManager').getInstance();
            let campName = battleManager.getCampName();
            if (campName != '') {
                if (campName == 'CampEditor') {
                    this.resDocument[SceneDefines.BATTLE_STATE].push({
                        url: "cdnRes/battlemap",
                        type: ResMapping.ResType.SpriteFrame
                    });
                    this.resDocument[SceneDefines.BATTLE_STATE].push({
                        url: "cdnRes/bullets",
                        type: ResMapping.ResType.SpriteFrame
                    });
                    this.resDocument[SceneDefines.BATTLE_STATE].push({
                        url: "cdnRes/battlemodel/prefab/Monster",
                        type: ResMapping.ResType.Prefab
                    });
                } else if (campName == 'CampDemo') {
                    this.resDocument[SceneDefines.BATTLE_STATE].push({
                        url: "cdnRes/battlemap",
                        type: ResMapping.ResType.SpriteFrame
                    });
                    this.resDocument[SceneDefines.BATTLE_STATE].push({
                        url: "cdnRes/battlemodel/prefab/Monster",
                        type: ResMapping.ResType.Prefab
                    });
                    this.resDocument[SceneDefines.BATTLE_STATE].push({
                        url: "cdnRes/bullets",
                        type: ResMapping.ResType.SpriteFrame
                    });
                } else if (campName == 'CampEndless') {
                    let data=require(campName).data;
                    for (let i = 0; i < data.maps.length; i++){
                        for (let j = 0; j < data.maps[i].length; j++){
                            let path = 'cdnRes/battlemap/' + data.maps[i][j];
                            this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                        }
                    }
                    for(let mn in data.monstersNormal){
                        let groups=data.monstersNormal[mn].groups;
                        for(let ng in groups){
                            let groupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', groups[ng]);
                            for (let m = 0; m < groupData.oVecMonsterIDs.length; m++) {
                                let monsterData = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', groupData.oVecMonsterIDs[m]);
                                let path = 'cdnRes/battlemodel/prefab/Monster/' + monsterData.strName;
                                this.pushDeep(path, ResMapping.ResType.Prefab);
                                for (let z = 0; z < monsterData.oVecSkillIDs.length; z++) {
                                    let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', monsterData.oVecSkillIDs[z]);
                                    if (skill != null) {
                                        for (let y in skill.oVecBulletIDs) {
                                            let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[y]);
                                            if (bullet.strName.indexOf("thunderball") != -1) {
                                                for (let index = 1; index < 10; index += 2) {
                                                    let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                                                    this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                                }
                                            } else {
                                                let path = 'cdnRes/bullets/' + bullet.strName;
                                                this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for(let me in data.monstersElite){
                        let groups=data.monstersElite[me].groups;
                        for(let eg in groups){
                            let groupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', groups[eg]);
                            for (let m = 0; m < groupData.oVecMonsterIDs.length; m++) {
                                let monsterData = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', groupData.oVecMonsterIDs[m]);
                                let path = 'cdnRes/battlemodel/prefab/Monster/' + monsterData.strName;
                                this.pushDeep(path, ResMapping.ResType.Prefab);
                                for (let z = 0; z < monsterData.oVecSkillIDs.length; z++) {
                                    let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', monsterData.oVecSkillIDs[z]);
                                    if (skill != null) {
                                        for (let y in skill.oVecBulletIDs) {
                                            let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[y]);
                                            if (bullet.strName.indexOf("thunderball") != -1) {
                                                for (let index = 1; index < 10; index += 2) {
                                                    let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                                                    this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                                }
                                            } else {
                                                let path = 'cdnRes/bullets/' + bullet.strName;
                                                this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for(let ml in data.monstersLine){
                        let groups=data.monstersLine[ml].groups;
                        for(let lg in groups){
                            let groupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', groups[lg]);
                            for (let m = 0; m < groupData.oVecMonsterIDs.length; m++) {
                                let monsterData = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', groupData.oVecMonsterIDs[m]);
                                let path = 'cdnRes/battlemodel/prefab/Monster/' + monsterData.strName;
                                this.pushDeep(path, ResMapping.ResType.Prefab);
                                for (let z = 0; z < monsterData.oVecSkillIDs.length; z++) {
                                    let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', monsterData.oVecSkillIDs[z]);
                                    if (skill != null) {
                                        for (let y in skill.oVecBulletIDs) {
                                            let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[y]);
                                            if (bullet.strName.indexOf("thunderball") != -1) {
                                                for (let index = 1; index < 10; index += 2) {
                                                    let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                                                    this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                                }
                                            } else {
                                                let path = 'cdnRes/bullets/' + bullet.strName;
                                                this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for(let mm in data.monstersMissile){
                        let groups=data.monstersMissile[mm].groups;
                        for(let mg in groups){
                            let groupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', groups[mg]);
                            for (let m = 0; m < groupData.oVecMonsterIDs.length; m++) {
                                let monsterData = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', groupData.oVecMonsterIDs[m]);
                                let path = 'cdnRes/battlemodel/prefab/Monster/' + monsterData.strName;
                                this.pushDeep(path, ResMapping.ResType.Prefab);
                                for (let z = 0; z < monsterData.oVecSkillIDs.length; z++) {
                                    let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', monsterData.oVecSkillIDs[z]);
                                    if (skill != null) {
                                        for (let y in skill.oVecBulletIDs) {
                                            let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[y]);
                                            if (bullet.strName.indexOf("thunderball") != -1) {
                                                for (let index = 1; index < 10; index += 2) {
                                                    let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                                                    this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                                }
                                            } else {
                                                let path = 'cdnRes/bullets/' + bullet.strName;
                                                this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    let map = require(campName).data;
                    for (let i = 0; i < map.maps.length; i++) {
                        for (let j = 0; j < map.maps[i].length; j++) {
                            let path = 'cdnRes/battlemap/' + map.maps[i][j];
                            this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                        }
                    }
                    for (let k = 0; k < map.monsterWaves.length; k++) {
                        if (typeof map.monsterWaves[k].wave === 'undefined') {
                            continue;
                        }
                        for (let l = 0; l < map.monsterWaves[k].wave.groups.length; l++) {
                            let groupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', map.monsterWaves[k].wave.groups[l]);
                            for (let m = 0; m < groupData.oVecMonsterIDs.length; m++) {
                                let monsterData = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', groupData.oVecMonsterIDs[m]);
                                let path = 'cdnRes/battlemodel/prefab/Monster/' + monsterData.strName;
                                this.pushDeep(path, ResMapping.ResType.Prefab);
                                for (let z = 0; z < monsterData.oVecSkillIDs.length; z++) {
                                    let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', monsterData.oVecSkillIDs[z]);
                                    if (skill != null) {
                                        for (let y in skill.oVecBulletIDs) {
                                            let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[y]);
                                            if (bullet.strName.indexOf("thunderball") != -1) {
                                                for (let index = 1; index < 10; index += 2) {
                                                    let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                                                    this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                                }
                                            } else {
                                                let path = 'cdnRes/bullets/' + bullet.strName;
                                                this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (let n = 0; n < map.monsterExtra.length; n++) {
                        let groupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', map.monsterExtra[n]);
                        for (let p = 0; p < groupData.oVecMonsterIDs.length; p++) {
                            let monsterData = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', groupData.oVecMonsterIDs[p]);
                            let path = 'cdnRes/battlemodel/prefab/Monster/' + monsterData.strName;
                            this.pushDeep(path, ResMapping.ResType.Prefab);
                            for (let x = 0; x < monsterData.oVecSkillIDs.length; x++) {
                                let skill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', monsterData.oVecSkillIDs[x]);
                                if (skill != null) {
                                    for (let w in skill.oVecBulletIDs) {
                                        let bullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', skill.oVecBulletIDs[w]);
                                        if (bullet.strName.indexOf("thunderball") != -1) {
                                            for (let index = 1; index < 10; index += 2) {
                                                let path = 'cdnRes/animebullets/' + bullet.strName + '/' + bullet.strName + '_000' + index;
                                                this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                            }
                                        } else {
                                            let path = 'cdnRes/bullets/' + bullet.strName;
                                            this.pushDeep(path, ResMapping.ResType.SpriteFrame);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if (scene == SceneDefines.MAIN_STATE) {
            this.pushDeep('cdnRes/prefab/Windows/NormalPlane', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/Windows/NormalImprovement', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/Windows/GuazaiMain', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/Windows/EndlessChallengeView', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/Windows/NormalDailyMissionWnd', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/Windows/NormalQuestListView', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/Windows/NormalDrawView', ResMapping.ResType.Prefab);
            this.pushDeep('cdnRes/prefab/Windows/NormalNoticeView', ResMapping.ResType.Prefab);
        }
        return this.resDeepArray.length;
    },

    deepPreLoadRes: function (callback) {
        if (typeof this.resDeepArray !== 'undefined') {
            var self=this;
            for (let deep in this.resDeepArray) {
                this.loadRes(this.resDeepArray[deep].type, this.resDeepArray[deep].url, callback,function(type,path){
                    self.loadRes(type,path,callback,function(errorType,errorPath){
                        if(!!callback){
                            callback(null,errorType,errorPath);
                        }
                    });
                });
            }
        }
    },

    initResDocument: function () {
        // this.resDocument[SceneDefines.BATTLE_STATE].push({
        //     url: "cdnRes/battle",
        //     type: ResMapping.ResType.SpriteFrame
        // });
        // this.resDocument[SceneDefines.BATTLE_STATE].push({
        //     url: "cdnRes/battlemodel/prefab/effect",
        //     type: ResMapping.ResType.Prefab
        // });
    },

    totalPreLoad: function (sceneState) {
        this.loadStep = 0;

        for (let i = 0; i < this.resDocument[sceneState].length; i++) {
            this.loadResDir(this.resDocument[sceneState][i].url, this.resDocument[sceneState][i].type);
        }

        var self = this;
        this.deepPreLoadRes(function (obj, type, path) {
            self.loadCompleteNotify(obj, type, path);
        });
    },

    setPreLoad: function (sceneState, callback) {
        this.loadCallBack = callback;

        // if (this.resDocument[sceneState].length == 0) {
        //     if (!!this.loadCallBack) {
        //         this.loadCallBack(-1);
        //     }
        //     return 0;
        // }

        let sum = this.initDeepPreLoadRes(sceneState);
        return this.resDocument[sceneState].length + sum;
    },

    loadCompleteNotify: function (obj, type, path) {
        this.loadStep++;
        if (!!this.loadCallBack) {
            this.loadCallBack(this.loadStep, obj, type, path);
        }
    },

    loadResDir: function (documentName, resType) {
        var self = this;
        if (resType == ResMapping.ResType.SpriteFrame) {
            cc.loader.loadResDir(documentName, cc.SpriteFrame, (err, assets) => {
                if (err) {
                    // cc.error("LoadResDir err." + documentName);
                    return;
                }
                for (let i = 0; i < assets.length; i++) {
                    let loadPath = documentName + '/' + assets[i]._name;
                    if (!self.cache[resType][loadPath]) {
                        self.cache[resType][loadPath] = assets[i];
                    }
                }
                self.loadCompleteNotify();
            });
        } else if (resType == ResMapping.ResType.Prefab) {
            cc.loader.loadResDir(documentName, cc.Prefab, (err, assets) => {
                if (err) {
                    // cc.error("LoadResDir err." + documentName);
                    return;
                }
                for (let i = 0; i < assets.length; i++) {
                    let loadPath = documentName + '/' + assets[i]._name;
                    if (!self.cache[resType][loadPath]) {
                        self.cache[resType][loadPath] = assets[i];
                    }
                }
                self.loadCompleteNotify();
            });
        } else if (resType === ResMapping.ResType.AudioClip) {
            cc.loader.loadResDir(documentName, (err, assets) => {
                if (err) {
                    // cc.error("LoadResDir err." + documentName);
                    return;
                }
                for (let i = 0; i < assets.length; i++) {
                    let loadPath = documentName + '/' + assets[i]._name;
                    if (!self.cache[resType][loadPath]) {
                        self.cache[resType][loadPath] = assets[i];
                    }
                }
                self.loadCompleteNotify();
            });
        } else if (resType === ResMapping.ResType.LabelAtlas) {
            cc.loader.loadResDir(documentName, (err, assets) => {
                if (err) {
                    // cc.error("LoadResDir err." + documentName);
                    return;
                }
                for (let i = 0; i < assets.length; i++) {
                    let loadPath = documentName + '/' + assets[i]._name;
                    if (!self.cache[resType][loadPath]) {
                        self.cache[resType][loadPath] = assets[i];
                    }
                }
                self.loadCompleteNotify();
            });
        }
    },

    loadRes: function (resType, path, callback,errorCB) {
        var self = this;
        path = this.getPathName(path);
        let resObj = null;

        if (!resObj) {
            resObj = this.getCacheRes(resType, path);
        }

        if (!resObj) {
            if (resType === ResMapping.ResType.SpriteFrame) {
                cc.loader.loadRes(path, cc.SpriteFrame, function (err, obj) {
                    if (err) {
                        cc.error("LoadSpriteFrame err." + path);
                        if(!!errorCB){
                            errorCB(ResMapping.ResType.SpriteFrame, path);
                        }
                        return;
                    }
                    self.cache[ResMapping.ResType.SpriteFrame][path] = obj;
                    if (!!callback) {
                        callback(obj, ResMapping.ResType.SpriteFrame, path);
                    };
                });
            } else if (resType === ResMapping.ResType.Prefab) {
                cc.loader.loadRes(path, cc.Prefab, function (err, obj) {
                    if (err) {
                        cc.error("LoadSpriteFrame err." + path);
                        if(!!errorCB){
                            errorCB(ResMapping.ResType.SpriteFrame, path);
                        }
                        return;
                    }
                    self.cache[ResMapping.ResType.Prefab][path] = obj;
                    if (!!callback) {
                        callback(obj, ResMapping.ResType.Prefab, path);
                    };
                });
            } else if (resType === ResMapping.ResType.AudioClip) {
                cc.loader.loadRes(path, function (err, obj) {
                    if (err) {
                        cc.error("LoadSpriteFrame err." + path);
                        if(!!errorCB){
                            errorCB(ResMapping.ResType.SpriteFrame, path);
                        }
                        return;
                    }
                    self.cache[ResMapping.ResType.AudioClip][path] = obj;
                    if (!!callback) {
                        callback(obj, ResMapping.ResType.AudioClip, path);
                    };
                });
            } else if (resType === ResMapping.ResType.LabelAtlas) {
                cc.loader.loadRes(path, function (err, obj) {
                    if (err) {
                        cc.error("LoadSpriteFrame err." + path);
                        if(!!errorCB){
                            errorCB(ResMapping.ResType.SpriteFrame, path);
                        }
                        return;
                    }
                    self.cache[ResMapping.ResType.LabelAtlas][path] = obj;
                    if (!!callback) {
                        callback(obj, ResMapping.ResType.LabelAtlas, path);
                    };
                });
            } else if (resType === ResMapping.ResType.Texture2D) {
                cc.loader.loadRes(path, cc.Texture2D, function (err, obj) {
                    if (err) {
                        cc.error("LoadSpriteFrame err." + path);
                        if(!!errorCB){
                            errorCB(ResMapping.ResType.SpriteFrame, path);
                        }
                        return;
                    }
                    self.cache[ResMapping.ResType.Texture2D][path] = obj;
                    if (!!callback) {
                        callback(obj, ResMapping.ResType.Texture2D, path);
                    };
                });
            } else {
                cc.loader.loadRes(path, function (err, obj) {
                    if (err) {
                        cc.error("preLoadResources err." + path);
                        if(!!errorCB){
                            errorCB(ResMapping.ResType.SpriteFrame, path);
                        }
                        return;
                    }
                    self.cache[resType][path] = obj;
                    if (!!callback) {
                        callback(obj, resType, path);
                    }
                });
            }
        } else {
            if (!!callback) {
                callback(resObj, resType, path);
            } else {
                return resObj;
            }
        }
        return null;
    },

    addCache:function(resType, path,obj){
        this.cache[resType][path] = obj;
    },

    clearCache: function () {
        //cc.loader.releaseAll();
        for (let i = 0; i < ResMapping.ResType.Total; ++i) {
            for (let key in this.cache[i]) {
                var deps = cc.loader.getDependsRecursively(key);
                if (i == ResMapping.ResType.SpriteFrame) {
                    cc.loader.release(this.cache[i][key]);
                }
                // cc.log('@@@')
                // cc.log(this.cache[i][key])
                // cc.log(deps);
                // cc.log('###')
                cc.loader.release(deps);
                delete this.cache[i][key];
            };
        }
        // cc.log('$$$')
        // cc.log(this.cache);
        // cc.log('&&&')
    },

    // releaseCache: function (resType, path) {
    //     this.cache[resType][path]
    //     cc.loader.release(path);
    // },

    getCacheRes: function (resType, path) {
        let resObj = this.cache[resType][path];
        return resObj;
    },

    delCacheRes: function (resType, path) {
        delete this.cache[resType][path];
    },

    getPathName: function (path) {
        let index = path.lastIndexOf('.');
        let folderPath = "";
        if (index != -1) {
            folderPath = path.substring(0, index);
        } else {
            folderPath = path;
        }
        return folderPath;
    },
});