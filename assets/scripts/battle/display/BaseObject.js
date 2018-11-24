const Defines = require('BattleDefines');
var ShaderUtils = require("ShaderUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        spine: {
            default: null,
            type: sp.Skeleton
        },
        collider: {
            default: null,
            type: cc.BoxCollider
        },
        _hasStop: {
            default: false,
            visible: false
        },
        mixTime: 0.2,
        objectType: {
            default: Defines.ObjectType.OBJ_INVALID,
            visible: false
        },
        entity: {
            default: null,
            visible: false
        },
        defaultAction:{
            default: null,
            visible: false
        },
    },

    onLoad: function () {
        //cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        //cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    },

    _setMix(anim1, anim2) {
        this.spine.setMix(anim1, anim2, this.mixTime);
        this.spine.setMix(anim2, anim1, this.mixTime);
    },

    onCollisionEnter: function (other, self) {
        // cc.log(other);
        // cc.log(self);
        // this.node.color = cc.Color.RED;
    },

    onCollisionStay: function (other, self) {
        // console.log('on collision stay');
        //cc.log(other);
        //cc.log(self);
    },

    onCollisionExit: function () {
        //this.node.color = cc.Color.WHITE;
    },

    setObjectType: function (type) {
        this.objectType = type;
    },

    setEntity: function (entity) {
        this.entity = entity;
    },

    getSpine:function(){
        return this.spine;
    },

    playAction(actName, loop, callback) {

    },

    findAction(actName) {
        if (this.spine != null) {
            return this.spine.findAnimation(actName);
        }
    },

    pauseAction() {
        if (this.spine != null) {
            this.spine.paused = true;
        }
    },

    resumeAction() {
        if (this.spine != null) {
            this.spine.paused = false;
        }
    },

    update: function (dt) {

    },

});