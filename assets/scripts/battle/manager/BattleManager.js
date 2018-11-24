const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require('resmapping')
const GlobalFunc = require('GlobalFunctions')

const BattleManager = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null,
        getInstance: function () {
            if (BattleManager.instance == null) {
                BattleManager.instance = new BattleManager();
            }
            return BattleManager.instance;
        },
        destroyInstance() {
            if (BattleManager.instance != null) {
                delete BattleManager.instance;
                BattleManager.instance = null;
            }
        }
    },

    properties: {
        managers: [],
        rootNode: null,
        displayContainer: null,
        currentTime: 0,
        ///////////////////////////////////////////////////////////
        isEditorFlag: false,
        isCampaignFlag: false,
        isEndlessFlag: false,
        isShowFlag: false,
        campName: "",
        isDemo: false,
        timerId: 0,

        flyMsgTime1: 0,
        flyMsgTime2: 0,

        gameState: 0,
        result: 0,

        battleMsg: null,
        endlessScore: 0,

        music: null,
        endGameAnimeCount: -1,
        endGameAnimePos: cc.v2(0, 0),

        comboKill: 0,
        comboKillHoldTime: 3,
        comboKillCurTime: 0,
    },

    ctor() {
        require('MonsterMapping').init();
        require('BulletMapping').init();

        this.entityManager = require('EntityManager');
        this.heroManager = require('HeroManager');
        this.scenarioManager = require('ScenarioManager');
        this.factory = require('Factory');
    },

    start(rootNode, dc, id, full) {

        this.allScreen = GlobalFunc.isAllScreen();

        this.displayContainer = dc;
        this.rootNode = rootNode;
        this.managers[Defines.MgrType.FACTORY] = this.factory.getInstance();
        this.managers[Defines.MgrType.ENTITY] = this.entityManager.getInstance();
        this.managers[Defines.MgrType.HERO] = this.heroManager.getInstance();
        this.managers[Defines.MgrType.SCENARIO] = this.scenarioManager.getInstance();

        for (let mgr in this.managers) {
            this.managers[mgr].start(this);
        }

        let Collision = require('Collision');
        this.collision = new Collision();

        this.currentTime = 0;

        if (!this.isDemo) {
            if (this.isEndlessFlag) {
                this.campName = 'CampEndless';
                this.endlessScore = 0;
            } else if (this.isCampaignFlag) {
                this.campName = this.campName;
            } else if (this.isEditorFlag) {
                this.campName = 'CampEditor';
            } else if (this.isShowFlag) {
                this.campName = 'CampDemo';
            }
            this.scenarioManager.getInstance().initScenario(this.campName);
            this.gameState = Defines.GameResult.START;
        }

        if (this.battleMsg != null) {
            this.heroManager.getInstance().createPlane(this.displayContainer, this.isDemo, this.battleMsg.ChuZhanConf.ChuZhanMemberID, this.battleMsg.PropBag.Props, true);
        } else {
            this.heroManager.getInstance().createPlane(this.displayContainer, this.isDemo, id, null, full);
        }

        this.success();
    },

    openShader: function (open) {
        this.managers[Defines.MgrType.HERO].openShader(open);
    },

    startOutside(dc, id, full) {
        dc.removeAllChildren(false);
        var self = this;
        this.isDemo = true;
        this.currentTime = 0;
        this.show = 0;
        this.showDC = dc;
        this.showID = id;
        this.showFull = typeof full !== 'undefined' ? full : false;

        this.timerId = setInterval(this.updateOutSide.bind(this), Defines.BATTLE_FRAME_SECOND * 1000);

        this.showDC.active = false;

        GlobalVar.resManager().pushPreLoadHero(id)
        let wearWing = GlobalVar.me().guazaiData.getGuazaiBySlot(1);
        if (typeof wearWing !== 'undefined') {
            GlobalVar.resManager().pushPreLoadHero(wearWing.ItemID);
        }
        let wearMissile = GlobalVar.me().guazaiData.getGuazaiBySlot(3);
        if (typeof wearMissile !== 'undefined') {
            GlobalVar.resManager().pushPreLoadHero(wearMissile.ItemID);
        }
        let wearAssist = GlobalVar.me().guazaiData.getGuazaiBySlot(4);
        if (typeof wearAssist !== 'undefined') {
            GlobalVar.resManager().pushPreLoadHero(wearAssist.ItemID);
        }

        GlobalVar.resManager().preLoadHero(function (complete) {
            if (!complete) {
                self.currentTime = 0;
                self.showDC.removeAllChildren(false);
                let sz = self.showDC.getContentSize();
                const PlaneEntity = require('PlaneEntity');
                let planeEntity = new PlaneEntity();
                planeEntity.newPart('Fighter/Fighter_' + self.showID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
                planeEntity.setPosition(cc.v2(0.5 * sz.width, 0.29 * sz.height));
                self.showDC.addChild(planeEntity, 7, 'plane');
                setTimeout(function () {
                    self.showDC.active = true;
                }, 300);
                //planeEntity.openShader(true);
                self.show = 1;
            } else if (complete) {
                self.show = 2;
            }
        });
    },

    updateOutSide() {
        if (this.show == 1 || this.show == 2) {
            if (this.currentTime < 1.6) {
                let plane = this.showDC.getChildByName('plane');
                if (!!plane) {
                    this.currentTime += Defines.BATTLE_FRAME_SECOND;
                    if (this.currentTime > 1.6) {
                        if (this.currentTime == 1.6) {
                            plane.openShader(false);
                        } else {
                            if (this.show == 2) {
                                this.showDC.removeAllChildren(false);
                                this.currentTime = 0;
                                this.show = 3;
                                this.start(null, this.showDC, this.showID, this.showFull);
                            }
                        }
                    } else {
                        plane.update(Defines.BATTLE_FRAME_SECOND);
                    }
                }
            }

        }

        if (this.show == 3) {
            this.currentTime += Defines.BATTLE_FRAME_SECOND;
            this.managers[Defines.MgrType.FACTORY].update(Defines.BATTLE_FRAME_SECOND);
            this.managers[Defines.MgrType.ENTITY].update(Defines.BATTLE_FRAME_SECOND);
            this.managers[Defines.MgrType.HERO].update(Defines.BATTLE_FRAME_SECOND);
        }
    },

    quitOutSide() {
        if (!this.isDemo) {
            return;
        }

        GlobalVar.resManager().clearPreLoadHero();

        if (this.displayContainer) {
            this.displayContainer.removeAllChildren(false);
        }

        clearInterval(this.timerId);
        this.release();
        BattleManager.destroyInstance();
    },

    update(dt) {
        let bmgr = BattleManager.getInstance();

        if (bmgr.gameState == Defines.GameResult.START) {
            bmgr.managers[Defines.MgrType.SCENARIO].update(Defines.BATTLE_FRAME_SECOND);
            bmgr.managers[Defines.MgrType.HERO].update(Defines.BATTLE_FRAME_SECOND);
        } else if (bmgr.gameState == Defines.GameResult.READY) {
            let uiNode = cc.find("Canvas/UINode");
            if (uiNode != null) {
                let ui = uiNode.getChildByName("UIBattle");
                if (ui != null) {
                    ui.getComponent("UIBattle").moveSkillBtn();
                    ui.getComponent("UIBattle").moveAssistBtn();
                }
            }
            bmgr.managers[Defines.MgrType.SCENARIO].update(Defines.BATTLE_FRAME_SECOND);
            bmgr.managers[Defines.MgrType.HERO].update(Defines.BATTLE_FRAME_SECOND);
            bmgr.gameState = Defines.GameResult.RUNNING;
        } else if (bmgr.gameState == Defines.GameResult.RUNNING) {
            bmgr.currentTime += Defines.BATTLE_FRAME_SECOND;
            if (bmgr.isEditorFlag == false) {
                bmgr.collision.update(Defines.BATTLE_FRAME_SECOND);
            }
            for (let mgr in bmgr.managers) {
                bmgr.managers[mgr].update(Defines.BATTLE_FRAME_SECOND);
            }
        } else if (bmgr.gameState == Defines.GameResult.INTERRUPT) {
            bmgr.managers[Defines.MgrType.ENTITY].pauseEntity();
            bmgr.managers[Defines.MgrType.HERO].pauseEntity();
        } else if (bmgr.gameState == Defines.GameResult.PAUSE) {

        } else if (bmgr.gameState == Defines.GameResult.PREPARE) {

        } else if (bmgr.gameState == Defines.GameResult.RESUME) {
            bmgr.managers[Defines.MgrType.ENTITY].resumeEntity();
            bmgr.managers[Defines.MgrType.HERO].resumeEntity();
            bmgr.gameState = Defines.GameResult.RUNNING;
        } else if (bmgr.gameState == Defines.GameResult.END) {

        } else if (bmgr.gameState == Defines.GameResult.SUCCESS) {
            bmgr.currentTime += Defines.BATTLE_FRAME_SECOND;
            if (bmgr.isEditorFlag == false) {
                bmgr.collision.update(Defines.BATTLE_FRAME_SECOND);
            }
            bmgr.managers[Defines.MgrType.FACTORY].update(Defines.BATTLE_FRAME_SECOND);
            bmgr.managers[Defines.MgrType.ENTITY].update(Defines.BATTLE_FRAME_SECOND);
            bmgr.managers[Defines.MgrType.HERO].update(Defines.BATTLE_FRAME_SECOND);
            // for (let mgr in bmgr.managers) {
            //     bmgr.managers[mgr].update(Defines.BATTLE_FRAME_SECOND);
            // }
            if (bmgr.managers[Defines.MgrType.HERO].planeEntity != null &&
                bmgr.managers[Defines.MgrType.ENTITY].entityBuffList.length == 0 &&
                bmgr.endGameAnimeCount < 0) {
                bmgr.managers[Defines.MgrType.HERO].flyOutOffScreen();
                bmgr.gameState = Defines.GameResult.FLYOUT;
            }
        } else if (bmgr.gameState == Defines.GameResult.FAILED) {

        } else if (bmgr.gameState == Defines.GameResult.FLYOUT) {
            //bmgr.managers[Defines.MgrType.SCENARIO].update(Defines.BATTLE_FRAME_SECOND);
            bmgr.managers[Defines.MgrType.HERO].update(Defines.BATTLE_FRAME_SECOND);
        } else if (bmgr.gameState == Defines.GameResult.COUNT) {
            bmgr.currentTime += Defines.BATTLE_FRAME_SECOND;
            if (bmgr.isEditorFlag == false) {
                bmgr.collision.update(Defines.BATTLE_FRAME_SECOND);
            }
            bmgr.managers[Defines.MgrType.FACTORY].update(Defines.BATTLE_FRAME_SECOND);
            bmgr.managers[Defines.MgrType.ENTITY].update(Defines.BATTLE_FRAME_SECOND);
            bmgr.managers[Defines.MgrType.HERO].update(Defines.BATTLE_FRAME_SECOND);
            // for (let mgr in bmgr.managers) {
            //     bmgr.managers[mgr].update(Defines.BATTLE_FRAME_SECOND);
            // }
            if (bmgr.managers[Defines.MgrType.HERO].planeEntity != null &&
                bmgr.managers[Defines.MgrType.ENTITY].entityMonBltList.length == 0 &&
                bmgr.managers[Defines.MgrType.ENTITY].entityHeroBltList.length == 0 &&
                bmgr.endGameAnimeCount < 0) {
                bmgr.endGameAnimeCount = 0;
                bmgr.success(function () {
                    require('AIInterface').allBuffChaseToHero();
                    bmgr.endGameAnimeCount = -1;
                })
                bmgr.gameState = Defines.GameResult.SUCCESS;
            }
        } else if (bmgr.gameState == Defines.GameResult.NONE) {

        } else if (bmgr.gameState == Defines.GameResult.CARD) {

        } else {
            cc.warn('error gameState: ' + bmgr.gameState);
        }

        this.comboKillCurTime += dt;
        if (this.comboKillCurTime >= this.comboKillHoldTime) {
            this.comboKill = 0;
        }
    },

    getManager(name) {
        return this.managers[name];
    },

    reset() {
        this.isEditorFlag = false;
        this.isEndlessFlag = false;
        this.isCampaignFlag = false;
        this.campName = "";
        this.battleMsg = null;
    },

    setBattleMsg(data) {
        this.battleMsg = data;
    },

    setNormalCampaign(idx) {
        this.campName = 'CampNormal' + idx;
    },

    setCampName(name) {
        this.campName = typeof name !== 'undefined' ? name : 'CampDemo';
    },

    getCampName() {
        return this.campName;
    },

    setMusic(music) {
        this.music = typeof music !== 'undefined' ? music : null;
    },

    getMusic() {
        return this.music;
    },

    release() {
        require('AIInterface').eliminateAllMonsters();
        require('AIInterface').eliminateAllBullets(false);
        this.entityManager.destroyInstance();
        this.heroManager.destroyInstance();
        this.scenarioManager.destroyInstance();
        require('PoolManager').destroyInstance();
    },

    flyDamageMsg(dmg, critical, pos, big, immediately) {
        immediately = typeof immediately !== 'undefined' ? immediately : false;
        if (dmg == 0) {
            if (this.currentTime - this.flyMsgTime1 >= 0.1 || immediately) {
                let node = new cc.Node();
                let sp = node.addComponent(cc.Sprite);
                sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/battle/_text_resist');
                node.scale = 1.0;
                node.opacity = 230;
                if (!immediately) {
                    this.flyMsgTime1 = this.currentTime;
                }
                node.setPosition(pos);
                this.displayContainer.addChild(node, Defines.Z.FLYDAMAGEMSG);
                this.flyFadeAction(node, critical, big);
            }
        } else {
            if (this.currentTime - this.flyMsgTime2 >= 0.1 || immediately) {
                let node = null;
                if (critical) {
                    let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/FlyDamageMsgCritical');
                    if (prefab != null) {
                        node = cc.instantiate(prefab);
                    }
                } else {
                    let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/FlyDamageMsg');
                    if (prefab != null) {
                        node = cc.instantiate(prefab);
                    }
                }
                if (node != null) {
                    let lbl = node.getComponent(cc.Label);
                    lbl.string = dmg;
                    node.setPosition(pos);
                    this.displayContainer.addChild(node, Defines.Z.FLYDAMAGEMSG);
                    this.flyFadeAction(node, critical, big);
                }
                if (!immediately) {
                    this.flyMsgTime2 = this.currentTime;
                }
            }
        }
    },

    flyFadeAction(node, critical, big) {
        let oldPos = node.getPosition();

        let exScale = 1.6;

        if (big) {
            exScale = 2.1;
        }

        if (critical) {
            node.scale = 0.0;
        } else {
            node.scale = exScale;
        }

        let scaleLarge = cc.scaleTo(0.1 * exScale, 2.5 * exScale);
        let scaleSmall = cc.scaleTo(0.08 * exScale, 0.5 * exScale);
        let scaleBack = cc.scaleTo(0.08 * exScale, exScale);
        let seq = cc.sequence(scaleLarge, scaleSmall, scaleBack);

        let move = cc.moveTo(0.6, oldPos.add(cc.v2(20, 50)));
        let fadeOut = cc.fadeOut(0.6);
        let spawn = cc.spawn(move, fadeOut);

        let tSeq = null;
        if (critical) {
            tSeq = cc.sequence(seq, spawn);
        } else {
            tSeq = spawn;
        }
        node.runAction(cc.sequence(tSeq, cc.removeSelf(true)));
    },

    runHurtEffect: function () {
        let msgNode = cc.find("Canvas/MsgNode");
        if (msgNode != null) {
            if (msgNode.getChildByName('202') == null) {
                let node = new cc.Node();
                let nodeSize = msgNode.getContentSize();
                let sp = node.addComponent(cc.Sprite);
                sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/battle/heroHit');
                sp.type = cc.Sprite.Type.SIMPLE;
                sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                node.setContentSize(nodeSize);
                msgNode.addChild(node, 999, '202');
            }
            if (msgNode.getChildByName('202') != null) {
                let node = msgNode.getChildByName('202');
                node.stopAllActions();
                node.opacity = 255;
                node.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(1.0)));
            }
        }
    },

    showShadow: function (show) {
        show = typeof show !== 'undefined' ? show : false;
        if (show) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/Shadow');
            if (prefab != null) {
                let shadow = cc.instantiate(prefab);
                this.displayContainer.addChild(shadow, Defines.Z.EXECUTESHADOW, '5000');
                shadow.getComponent(cc.Widget).updateAlignment();
                shadow.opacity = 0;
                shadow.runAction(cc.fadeTo(0.2, 140));
            }
        } else {
            let shadow = this.displayContainer.getChildByName('5000');
            if (shadow != null) {
                shadow.runAction(cc.sequence(cc.fadeOut(0.1), cc.removeSelf(true)));
            }
        }
    },

    screenShake: function (type) {
        type = typeof type !== 'undefined' ? type : 0;
        this.displayContainer.stopAllActions();
        let size = this.displayContainer.getContentSize();
        let origin = cc.v2(-0.5 * size.width, -0.5 * size.height)
        this.displayContainer.setPosition(cc.v2(-0.5 * size.width, -0.5 * size.height));
        let array = [];
        for (let i = 0; i < Math.random() * 2 + 2; i++) {
            let randomNum = 1;
            if (type == 0) {
                randomNum = 5;
            } else if (type == 1) {
                randomNum = 3;
            }
            let param = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * randomNum + randomNum);
            let dst = cc.v2(0, 0);
            if (i % 2 == 0) {
                dst = origin.add(cc.v2(0, param));
            } else {
                dst = origin.add(cc.v2(param, 0));
            }
            let act = cc.sequence(cc.moveTo(0.05, dst), cc.moveTo(0.05, origin));
            array.push(act);
        }
        let act = cc.sequence(array);
        this.displayContainer.runAction(act);
    },

    warning: function (callback) {
        if (this.displayContainer.getChildByName('6000') == null) {
            var self = this;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/Warning', function (prefab) {
                if (prefab != null) {
                    let incoming = cc.instantiate(prefab);
                    self.displayContainer.addChild(incoming, Defines.Z.WARNING, '6000');
                    incoming.setPosition(0.5 * cc.view.getDesignResolutionSize().width, self.displayContainer.getContentSize().height * 0.618);
                    let spine = incoming.getComponent(sp.Skeleton);
                    spine.setAnimation(0, 'animation', false);
                    if (!!callback) {
                        spine.setCompleteListener(callback);
                    }
                    GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/boss_come');
                }
            });
        } else {
            let incoming = this.displayContainer.getChildByName('6000');
            let spine = incoming.getComponent(sp.Skeleton);
            spine.setAnimation(0, 'animation', false);
            if (!!callback) {
                spine.setCompleteListener(callback);
            }
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/boss_come');
        }
    },

    success: function (callback) {
        if (this.displayContainer.getChildByName('9000') == null) {
            var self = this;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/Success', function (prefab) {
                if (prefab != null) {
                    var victory = cc.instantiate(prefab);
                    victory.opacity=0;
                    let spine = victory.getComponent(sp.Skeleton);
                    spine.setStartListener(trackEntry => {
                        victory.opacity=255;
                    });
                    self.displayContainer.addChild(victory, Defines.Z.WARNING, '9000');
                    victory.setPosition(0.5 * cc.view.getDesignResolutionSize().width, self.displayContainer.getContentSize().height * 0.618);
                    if(!!callback){
                        callback();
                    }
                }
            });
        } else {
            var victory = this.displayContainer.getChildByName('9000');
            let spine = victory.getComponent(sp.Skeleton);
            spine.setCompleteListener(trackEntry => {
                if (!!callback) {
                    callback();
                }
            });
            spine.setAnimation(0, 'animation', false);
            GlobalVar.soundManager().stopBGM();
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/game_pass');
        }
    },

    setBossHpBar: function (entity) {
        let uiNode = cc.find("Canvas/UINode");
        if (uiNode != null) {
            let uiBattle = uiNode.getChildByName("UIBattle");
            if (uiBattle != null) {
                uiBattle.getComponent("UIBattle").setBossHpBar(entity);
            }
        }
    },

});