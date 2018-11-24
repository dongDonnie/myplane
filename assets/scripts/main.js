const GlobalVar = require("globalvar");
const weChatAPI = require("weChatAPI");
const i18n = require('LanguageData');
cc.Class({
    extends: cc.Component,

    properties: {
        nodeLogo: {
            default: null,
            type: cc.Node,
        },
        isJsonLoaded: {
            default: false,
            visible: false,
        },
        isLogoFadedIn: {
            default: false,
            visible: false,
        },
    },

    onLoad() {
        // if (cc.sys.platform === cc.sys.WECHAT_GAME){
            this.isJsonLoaded = false;
            this.isLogoFadedIn = false;
        // }
        //cc.director.setDisplayStats(true);
        // var screenSize = cc.view.getFrameSize();
        // if (screenSize.height / screenSize.width >= 1.78) {
        //     cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_WIDTH);
        // }
        // else {
        //     cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_HEIGHT);
        // }

        //SCREEN = cc.director.getWinSizeInPixels();

        //设为常驻节点
        // cc.game.addPersistRootNode(this.node);
        
        // if (cc.sys.platform === cc.sys.WECHAT_GAME){
            
        // }else{
            // GlobalVar.networkManager().connectToServer('192.168.2.251', 9908);
        // }
        // GlobalVar.networkManager().connectToServer('weplane-s1.17fengyou.com', 8101);
        GlobalVar.isAndroid = cc.sys.os == cc.sys.OS_ANDROID;
        GlobalVar.isIOS = cc.sys.os == cc.sys.OS_IOS;
        // GlobalVar.isIOS = true;
    },

    start() {
        // if (cc.sys.platform === cc.sys.WECHAT_GAME){
        //     wx.connectSocket({
        //         url: 'wss://weplane-s1.17fengyou.com:8102',
        //         success: res => {
        //             console.log("test success");
        //             return true;
        //         },
        //         fail: res => {
        //             // do something
        //             console.log("test fail");
        //             return false;
        //         }
        //       })
        // }
        // return;
        //cc.game.setFrameRate(60);
        weChatAPI.setFramesPerSecond(60);
        weChatAPI.deviceKeepScreenOn();

        i18n.init('zh');
        let self = this;

        GlobalVar.netWaiting().init();

        this.nodeLogo.runAction(cc.sequence(cc.fadeIn(1.0), cc.callFunc(()=>{
            self.isLogoFadedIn = true;
        })))
        GlobalVar.tblApi.init(function () {
            self.isJsonLoaded = true;
            // GlobalVar.sceneManager().startUp();
        });
        // GlobalVar.tblApi.init(function () {
        //     GlobalVar.sceneManager().startUp();
        // });
    },

    update() {
        let self = this;
        if (this.isJsonLoaded && this.isLogoFadedIn){
            this.isJsonLoaded = false;
            this.isLogoFadedIn = false;
            this.nodeLogo.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(1.0), cc.callFunc(()=>{
                GlobalVar.sceneManager().startUp();
            })))
        }
    },
});
