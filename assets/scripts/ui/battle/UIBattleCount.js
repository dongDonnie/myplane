const GlobalVar = require("globalvar");
const UIBase = require("uibase");
const Defines = require('BattleDefines');

cc.Class({
    extends: UIBase,

    properties: {
        
    },

    onLoad: function () {
        this.battleManager = require('BattleManager').getInstance();
    },

    countdown:function(){
        this.battleManager.gameState = Defines.GameResult.RESUME;
        this.node.destroy();
    },

});