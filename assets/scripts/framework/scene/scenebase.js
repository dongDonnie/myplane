const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
var SceneBase = cc.Class({
    extends: cc.Component,

    properties: {
        sceneName: {
            default: "",
            visible: false
        },
    },

    onLoad: function () {

    },

    releaseScene: function () {

    },

    loadPrefab: function (prefabName,callback) {
        if(this.sceneName==""){
            return;
        }
        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/" + this.sceneName + "/" + prefabName, function (prefab) {
            if (prefab != null) {
                var uiInterface = cc.instantiate(prefab);
                self.uiNode.addChild(uiInterface, 0, prefabName);
                if(!!callback){
                    callback();
                }
            } else {
                // cc.log("load prefab failed!");
            }
        });
    },

});