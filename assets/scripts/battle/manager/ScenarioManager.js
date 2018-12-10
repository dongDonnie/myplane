const GlobalVar = require('globalvar')
const ResMapping = require('resmapping')
const Defines = require('BattleDefines')
const BattleEndlessMode = require('BattleEndlessMode')
const BattleCampaignMode = require('BattleCampaignMode')

var ScenarioManager = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (ScenarioManager.instance == null) {
                ScenarioManager.instance = new ScenarioManager();
            }
            return ScenarioManager.instance;
        },
        destroyInstance() {
            if (ScenarioManager.instance != null) {
                delete ScenarioManager.instance;
                ScenarioManager.instance = null;
            }
        }
    },

    properties: {

    },

    start(mgr) {
        this.battleManager = require('BattleManager').getInstance();
        // if (this.battleManager.isDemo) {
        //     return;
        // }
    },

    update(dt) {
        if (this.battleManager.isDemo) {
            return;
        }

        this.curTime += dt;
        this.interval += dt;

        if (this.battleManager.isEndlessFlag && !!this.battleEndlessMode) {
            this.battleEndlessMode.update(dt);
        }

        if (this.battleManager.isShowFlag && !!this.battleCampaignMode) {
            this.battleCampaignMode.update(dt);
        }

        if (this.battleManager.isCampaignFlag && !!this.battleCampaignMode && !this.end) {
            this.battleCampaignMode.update(dt);
            if(this.battleCampaignMode.step==12){
                this.end=true;
            }
        }

        // if (this.battleManager.isEditorFlag && !!this.battleEditorMode) {
        //     this.battleEditorMode.update(dt);
        // }

        this.comboKillCurTime += dt;
        if (this.comboKillCurTime >= this.comboKillHoldTime) {
            this.battleManager.comboKill = 0;
        }

        if(this.secondKill>0){
            this.secondKillTime+=dt;
            if(this.secondKillTime>=1){
                this.secondKill=0;
                this.secondKillTime=0;
            }
        }
    },

    initScenario: function (mapName) {
        
        if (this.battleManager.isEndlessFlag) {
            this.battleEndlessMode = new BattleEndlessMode();
            this.battleEndlessMode.init();
        }

        if (this.battleManager.isShowFlag) {
            this.battleCampaignMode = new BattleCampaignMode();
            this.battleCampaignMode.init(mapName);
        }

        if (this.battleManager.isCampaignFlag) {
            this.battleCampaignMode = new BattleCampaignMode();
            this.battleCampaignMode.init(mapName);
        }

        // if (this.battleManager.isEditorFlag) {
        //     this.battleEditorMode = new BattleCampaignMode();
        //     this.battleEditorMode.init(mapName);
        // }

        this.comboKillHoldTime=3;
        this.comboKillCurTime=0;
        this.secondKill=0;
        this.secondKillTime=0;

        this.end=false;
        return;
    },

    kill: function (entity) {
        if (entity.objectType != Defines.ObjectType.OBJ_MONSTER) {
            return;
        }

        if(entity.canDrop){
            this.battleManager.comboKill++;
            if(this.battleManager.comboKill>999){
                this.battleManager.comboKill=999;
            }

            this.secondKill++;
            if(this.secondKill>=10){
                this.battleManager.unDefeat(1);
                this.secondKill=0;
                this.secondKillTime=0;
            }
            
            if(this.battleManager.comboKill%100==0 && this.battleManager.comboKill!=0){
                this.battleManager.unDefeat(0);
            }
            this.comboKillCurTime=0;
        }

        if (this.battleManager.isEndlessFlag && !!this.battleEndlessMode) {
            this.battleEndlessMode.kill(entity);
        }
        if (this.battleManager.isShowFlag && !!this.battleCampaignMode) {
            this.battleCampaignMode.kill(entity);
        }
        if (this.battleManager.isCampaignFlag && !!this.battleCampaignMode) {
            this.battleCampaignMode.kill(entity);
        }
    },

    tryDropItem:function(mode,entity){
        if (this.battleManager.isEndlessFlag && !!this.battleEndlessMode) {
            this.battleEndlessMode.tryDropItem(mode,entity);
        }
    }
});