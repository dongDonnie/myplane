const SceneDefines = require("scenedefines");
const SceneBase = require("scenebase");
const GlobalVar = require("globalvar")
const EventMsgID = require("eventmsgid")
const weChatAPI = require("weChatAPI");

var LoginScene = cc.Class({
    extends: SceneBase,

    ctor: function() {
        this.uiNode = null;
    },

    properties: {
        login:{
            default:null,
            type:cc.Node
        },
        server:{
            default:null,
            type:cc.Node
        }
    },

    onLoad: function () {
        this.sceneName="LoginScene";
        this.uiNode = cc.find("Canvas/UINode");
        this.registerEvent();
        
        GlobalVar.soundManager().playBGM("cdnRes/audio/main/music/logon");

        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            //this.loadPrefab("UIServerSel");
        }else{
            //this.loadPrefab("UILogin");
            this.login.active=true;
            this.server.active=false;
        }
    },

    registerEvent() {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENTER_GAME, this.replaceSceneToMain, this);
    },

    onDestroy() {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    replaceSceneToMain(evt) {
        // console.log("登陆消息：", evt);
        GlobalVar.me().updatePlayerDataByGMDT_PLAYER(evt.data.Player);
        GlobalVar.me().setServerTime(evt.data.ServerTime);
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            weChatAPI.requestIosRechageLockState(GlobalVar.me().level, GlobalVar.me().combatPoint, GlobalVar.me().creatTime, function (state) {
                GlobalVar.IosRechargeLock = state;
            });
        }
        GlobalVar.handlerManager().noticeHandler.sendGetNoticeReq();
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

});

