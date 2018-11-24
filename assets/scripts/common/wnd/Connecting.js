const GlobalVar = require("globalvar")
var Connecting = cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        
    },

    start(){
        
    },

    btnClick: function (event, data) {
        if (data == 1) {
            GlobalVar.networkManager().reset(autoLink);
        } else {
            cc.log("Reconnect: cancel btn pressed.");
        }
    }
});