const GlobalVar = require("globalvar");
const BattleDefines = require('BattleDefines');
const SceneDefines = require("scenedefines");
const SceneBase = require("scenebase");
const ResMapping = require("resmapping");
const BattleManager = require('BattleManager');

var BattleScene = cc.Class({
    extends: SceneBase,
    ctor: function () {
        this.uiNode = null;
    },

    properties: {

    },

    onLoad: function () {
        this.sceneName = "BattleScene";
        this.battleManager = BattleManager.getInstance();
        this.uiNode = cc.find("Canvas/UINode");
        this.battleManager.start(this.node, cc.find('Canvas/GameNode'));
        if(this.battleManager.getMusic()!=null){
            GlobalVar.soundManager().playBGM("cdnRes/"+this.battleManager.getMusic());
        }
        // if (this.battleManager.isEditorFlag) {
        //     this.loadPrefab("UIBattleEditor")
        // } else {
        //     this.loadPrefab("UIBattle");
        // }
    },

    start:function(){
        if (this.battleManager.isEditorFlag) {
            this.loadPrefab("UIBattleEditor")
        } else {
            //this.loadPrefab("UIBattle");
        }
    },

    onDestroy() {
        this.releaseScene();
    },

    update: function (dt) {
        this.battleManager.update(dt);
        if (this.battleManager.gameState == BattleDefines.GameResult.INTERRUPT) {
            this.showPauseWnd();
            this.battleManager.gameState = BattleDefines.GameResult.PAUSE;
        } else if (this.battleManager.gameState == BattleDefines.GameResult.END) {
            this.showEndWnd();
            this.battleManager.gameState = BattleDefines.GameResult.NONE;
        }else if(this.battleManager.gameState==BattleDefines.GameResult.PREPARE){
            this.showCountWnd();
            this.battleManager.gameState = BattleDefines.GameResult.PAUSE;
        }else if(this.battleManager.gameState==BattleDefines.GameResult.CARD){
            this.showDrawRewardWnd();
            this.battleManager.gameState = BattleDefines.GameResult.NONE;
        }
    },

    releaseScene: function () {
        this._super();
        this.battleManager.release();
        BattleManager.destroyInstance();
    },

    showPauseWnd() {
        this.loadPrefab("UIBattlePause");
    },

    showEndWnd() {
        if (!GlobalVar.me().isKickedOut){
            this.loadPrefab("UIBattleEnd");
        }else{
            GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);
        }
    },

    showCountWnd(){
        this.loadPrefab("UIBattleCount");
    },

    showDrawRewardWnd(){
        this.loadPrefab("UIBattleCard");
    },
});