var requestService = require('requestservice')
var GlobalVar = require('globalvar');

var HandlerBase = cc.Class({
    ctor: function() {
    },

    initHandler: function() {

    },

    unInitHandler: function() {

    },

    sendMsg: function(msgid, msg) {
        requestService.getInstance().addRequest(msgid, msg);
    },
});

module.exports = HandlerBase;
