const BaseObject = require('BaseObject')

cc.Class({
    extends: BaseObject,

    properties: {

    },

    onLoad() {
        var spine = this.spine = this.node.getComponent('sp.Skeleton');
        // this._setMix('daiji', 'bianxing_1');
        // this._setMix('bianxing_1', 'putong');
        // this._setMix('putong', 'BaoZou_Start');
        // this._setMix('BaoZou_Start', 'BaoZou');
        // this._setMix('BaoZou', 'BaoZou_End');
        // this._setMix('putong', 'BaoZou_Start');

        // var self=this;
        // spine.setStartListener(trackEntry => {
        //     var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        //     //cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
        // });
        // spine.setInterruptListener(trackEntry => {
        //     var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        //     //cc.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
        // });
        // spine.setEndListener(trackEntry => {
        //     var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        //     //cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
        // });
        // spine.setDisposeListener(trackEntry => {
        //     var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        //     //cc.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
        // });
        // spine.setCompleteListener((trackEntry, loopCount) => {
        //     var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        //     if (self._displayLoop) {
        //         if (animationName === 'daiji') {
        //             self.transform();
        //         } else if (animationName === 'putong') {
        //             self.crazyStart();
        //         } else if (animationName === 'BaoZou') {
        //             self.crazyEnd();
        //         }
        //     }
        //     //cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
        // });
        // spine.setEventListener((trackEntry, event) => {
        //     var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        //     //cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
        // });

        this._hasStop = false;
    },

    stop() {
        this.spine.clearTrack(0);
        this._hasStop = true;
    },

    playAction(actName, loop, callback) {
        if (this.spine == null) {
            return false;
        }

        loop = typeof loop !== 'undefined' ? loop : false;
        if (this.findAction(actName) != null) {

            this.spine.setCompleteListener((trackEntry, loopCount) => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                if (!!callback) {
                    callback(animationName);
                }
                //cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            });

            this.spine.setAnimation(0, actName, loop);
            if(this.defaultAction!=null){
                this.spine.addAnimation(0, this.defaultAction, true, 0);
            }
            this._hasStop = false;

            return true;
        }
        return false;
    },

    addAction(actName, loop, callback) {
        if (this.spine == null) {
            return false;
        }

        loop = typeof loop !== 'undefined' ? loop : 0;
        if (this.findAction(actName) != null) {

            this.spine.setCompleteListener((trackEntry, loopCount) => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                if (!!callback) {
                    callback(animationName);
                }
                //cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            });

            for(let i=0;i<loop;i++){
                this.spine.addAnimation(0, actName, false);
            }
            
            if(this.defaultAction!=null){
                this.spine.addAnimation(0, this.defaultAction, true, 0);
            }
            this._hasStop = false;

            return true;
        }
        return false;
    },

    setDefaultAction(actName) {
        if (this.findAction(actName) != null) {
            this.defaultAction = actName;
            return true;
        }
        return false;
    },

    toggleDebugSlots() {
        this.spine.debugSlots = !this.spine.debugSlots;
    },

    toggleDebugBones() {
        this.spine.debugBones = !this.spine.debugBones;
    },

    toggleTimeScale() {
        if (this.spine.timeScale === 1.0) {
            this.spine.timeScale = 0.3;
        } else {
            this.spine.timeScale = 1.0;
        }
    },

});