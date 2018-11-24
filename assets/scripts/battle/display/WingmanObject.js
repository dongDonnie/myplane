const BaseObject = require('BaseObject');

cc.Class({
    extends: BaseObject,

    properties: {
        _displayLoop: {
            default: false,
            visible: false
        },
    },

    onLoad: function () {
        var spine = this.spine = this.node.getComponent('sp.Skeleton');

        var self = this;
        spine.setStartListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            //cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
        });
        spine.setInterruptListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            //cc.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
        });
        spine.setEndListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            //cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
        });
        spine.setDisposeListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            //cc.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
        });
        spine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (self._displayLoop) {
                if (animationName === 'daiji') {
                    self.transform();
                } else if (animationName === 'putong') {
                    self.crazyStart();
                } else if (animationName === 'BaoZou') {
                    self.crazyEnd();
                }
            }
            //cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
        });
        spine.setEventListener((trackEntry, event) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            //cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
        });

        this._hasStop = false;
    },

    setDisPlayLoop(displayLoop) {
        displayLoop = typeof displayLoop !== 'undefined' ? displayLoop : false;
        this._displayLoop = displayLoop;
    },

    stop() {
        this.spine.clearTrack(0);
        this._hasStop = true;
    },

    standingBy() {
        this.spine.setAnimation(0, 'xiaohuo', true);
        this._hasStop = false;
    },

    transform() {
        // this.spine.setAnimation(0, 'bianxing_1', false);
        // this.spine.addAnimation(0, 'putong', true, 0);
        this._hasStop = false;
    },

    normal() {
        this.spine.setAnimation(0, 'xiaohuo', true);
        this._hasStop = false;
    },

    crazyStart() {
        this.spine.setAnimation(0, 'BaoZou_Start', false);
        this.spine.addAnimation(0, 'BaoZou', true, 0);
        this._hasStop = false;
    },

    crazy() {
        this.spine.setAnimation(0, 'BaoZou', true);
        this._hasStop = false;
    },

    crazyEnd() {
        this.spine.setAnimation(0, 'BaoZou_End', false);
        this.spine.addAnimation(0, 'xiaohuo', true, 0);
        this._hasStop = false;
    },

    playAction(actName, loop) {
        loop = typeof loop !== 'undefined' ? loop : false;
        if (this.findAction(actName) != null) {
            this.spine.setAnimation(0, actName, loop);
            this._hasStop = false;
        }
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