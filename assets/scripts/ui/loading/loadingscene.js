const SceneBase = require("scenebase");
const GlobalVar = require("globalvar");
const RemoteSprite = require("RemoteSprite");
const SceneDefines = require('scenedefines');
const ResMapping = require("resmapping");

var LoadingState = {
    E_PREPARE: 0,
    E_RELEASE_MAIN_CACHE: 1,
    E_RELEASE_OTHER_CACHE: 2,
    E_START_LOADING_THREAD: 3,
    E_LOADING: 4,
    E_WAITING: 5,
    E_FINISH: 6,
};

var LoadingScene = cc.Class({
    extends: SceneBase,

    properties: {
        loadingBar: {
            default: null,
            type: cc.ProgressBar
        },
        labelTip: {
            default: null,
            type: cc.Label,
        },
        spriteChara: {
            default: null,
            type: RemoteSprite,
        },
        labelProgressPercent: {
            default: null,
            type: cc.Label
        },
    },

    statics: {

    },

    ctor: function () {
        this.loadingState = LoadingState.E_WAITING;
        this.totalCount = 0;
    },

    onLoad: function () {
        this._super();
        GlobalVar.windowManager().releaseView();
        GlobalVar.resManager().clearCache();
        GlobalVar.netWaiting().release();

        this.loadingState = LoadingState.E_PREPARE;
    },

    start: function () {
        let tipsCount = GlobalVar.tblApi.getLength('TblTips');
        let randomTipsIndex = Math.floor(Math.random() * tipsCount) + 1;
        let spriteCount = this.spriteChara.frameList.length;
        let randomCharaIndex = Math.floor(Math.random() * spriteCount);
        this.labelTip.string = GlobalVar.tblApi.getDataBySingleKey('TblTips', randomTipsIndex).strString;
        this.spriteChara.setFrame(randomCharaIndex);
    },

    update: function (dt) {
        if (this.loadingState === LoadingState.E_WAITING) {

        } else if (this.loadingState === LoadingState.E_PREPARE) {
            //let nextSceneState = GlobalVar.sceneManager().nextScene;
            this.loadingState = LoadingState.E_LOADING;

        } else if (this.loadingState === LoadingState.E_RELEASE_MAIN_CACHE) {

            this.loadingState = LoadingState.E_RELEASE_OTHER_CACHE;

        } else if (this.loadingState === LoadingState.E_RELEASE_OTHER_CACHE) {

            this.loadingState = LoadingState.E_START_LOADING_THREAD;

        } else if (this.loadingState === LoadingState.E_START_LOADING_THREAD) {

            this.loadingState = LoadingState.E_LOADING;

        } else if (this.loadingState === LoadingState.E_LOADING) {

            this.loadingState = LoadingState.E_WAITING;

            GlobalVar.netWaiting().init();

            let next = GlobalVar.sceneManager().nextScene;

            this.totalCount = GlobalVar.resManager().setPreLoad(next, this.finishCallback.bind(this));
            GlobalVar.resManager().totalPreLoad(next);

            if (next == SceneDefines.MAIN_STATE) {
                cc.director.preloadScene("MainScene");
                // cc.director.preloadScene("MainScene", this.finishCallback(++GlobalVar.resManager().loadStep));
                // this.totalCount++;
            } else if (next == SceneDefines.BATTLE_STATE) {
                cc.director.preloadScene("BattleScene");
                // cc.director.preloadScene("BattleScene",this.finishCallback(++GlobalVar.resManager().loadStep));
                // this.totalCount++;
            }

            if (this.totalCount == 0) {
                this.loadingBar.progress = 100;
                this.loadingState = LoadingState.E_FINISH;
            }else{
                var self=this;
                let action = cc.progressLoading(1.2, this.loadingBar.progress, 1, null, function (per) {
                    self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.totalLength * per;
                    self.labelProgressPercent.string = Math.floor(per * 100) + "%";
                });
                this.loadingBar.node.runAction(action);
            }

        } else if (this.loadingState === LoadingState.E_FINISH) {

            this.loadingState = LoadingState.E_WAITING;
            this.releaseScene();

            let nextSceneState = GlobalVar.sceneManager().nextScene;
            GlobalVar.sceneManager().directGotoScene(nextSceneState);

        } else {

            this.loadingState = LoadingState.E_WAITING;

        }
    },

    finishCallback: function (step, obj, type, path) {
        if (this.loadingState == LoadingState.E_FINISH) {
            return;
        }
        var self = this;
        let percent = 0;
        if (this.totalCount == 0) {
            percent = 1;
        } else {
            percent = (step+1) / this.totalCount;
            if(percent*100%10>=5){
                percent=Math.ceil(percent*10)/10;
            }
            if(this.loadingBar.progress>percent){
                percent=Math.ceil(this.loadingBar.progress*10)/10;
            }
            if (GlobalVar.sceneManager().nextScene == SceneDefines.MAIN_STATE) {
                if (obj != null && type == ResMapping.ResType.Prefab && path.indexOf('cdnRes/prefab/Windows/') != -1) {
                    GlobalVar.windowManager().preLoadView(obj, path);
                }
            }
        }
        //this.loadingBar.node.getChildByName("spriteLight").x = this.loadingBar.totalLength * percent;
        //this.loadingBar.progress = percent;
        //this.labelProgressPercent.string = Math.floor(percent*100) + "%";
        // if (percent >= 1) {
        //     if (step == -1 || step >= self.totalCount) {
        //         this.loadingState = LoadingState.E_FINISH;
        //     }
        // }
        let action = cc.progressLoading(1.2, this.loadingBar.progress, percent<=1?percent:1, function () {
            if (percent >= 1) {
                if (step == -1 || step >= self.totalCount) {
                    self.loadingState = LoadingState.E_FINISH;
                }
            }
        }, function (per) {
            self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.totalLength * per;
            self.labelProgressPercent.string = Math.floor(per * 100) + "%";
        });
        this.loadingBar.node.runAction(action);
    },

    releaseScene: function () {
        this._super();
    },

});