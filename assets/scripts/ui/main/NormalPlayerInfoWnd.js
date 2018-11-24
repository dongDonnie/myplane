
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

cc.Class({
    extends: RootBase,

    properties: {
        nodeAtt: {
            default: null,
            type: cc.Node,
        },
        labelCombat: {
            default: null,
            type: cc.Label,
        },
        labelRollName: {
            default: null,
            type: cc.Label,
        },
        progressExp: {
            default: null,
            type: cc.ProgressBar,
        },
    },

    onLoad: function () {
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_PLAYERINFO_WND;
        this.animeStartParam(0, 0);
    },

    start:function(){

    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            // GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.initPlayerInfoWnd();
        }
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    initPlayerInfoWnd(data) {
        let PlayerInfo = GlobalVar.me().propData.getProps();
        for(let i = 0; i<PlayerInfo.length;i++){
            let value = PlayerInfo[i].Value?PlayerInfo[i].Value:0;
            switch (PlayerInfo[i].ID) {
                case GameServerProto.PTPROP_Attack:
                    this.setPlayerAtk(value);
                    break;
                case GameServerProto.PTPROP_AttackGrowUp:
                    this.setPlayerAtkGrow(value);
                    break;
                case GameServerProto.PTPROP_Defence:
                    this.setPlayerDef(value);
                    break;
                case GameServerProto.PTPROP_DefenceGrowUp:
                    this.setPlayerDefGrow(value);
                    break;
                case GameServerProto.PTPROP_HP:
                    this.setPlayerLife(value);
                    break;
                case GameServerProto.PTPROP_HPGrowUp:
                    this.setPlayerLifeGrow(value);
                    break;
                case GameServerProto.PTPROP_WingManAttack:
                    this.setPlayerWingAtk(value);
                    break;
                case GameServerProto.PTPROP_ThrowingPower:
                    this.setPlayerHurlAtk(value);
                    break;
                case GameServerProto.PTPROP_MissilePower:
                    this.setPlayerRocketAtk(value);
                    break;
                case GameServerProto.PTPROP_AssistAttack:
                    this.setPlayerSubAtk(value);
                    break;
                case GameServerProto.PTPROP_CritRate:
                    this.setPlayerCriRate(value);
                    break;
                case GameServerProto.PTPROP_CritDamage:
                    this.setPlayerCriDamage(value);
                    break;
                case GameServerProto.PTPROP_EndlessAddPer:
                    this.setPlayerScore(value);
                    break;
                default:
                    break;
            }
        }

        this.setPlayerCombat(GlobalVar.me().getCombatPoint() || 0);
        this.setPlayerLevel(GlobalVar.me().getLevel() || 0);
        this.setRollName(GlobalVar.me().getRoleName() || "");
        this.setPlayerAvatar(GlobalVar.me().avatar);
        
        this.setExpBar(GlobalVar.me().getLevel(), GlobalVar.me().getExp());
    },

    getLabel(name) {
        return this.nodeAtt.getChildByName(name).getComponent(cc.Label);
    },

    setRollName: function(data){
        this.labelRollName.string = data;
    },
    setPlayerCombat: function (data) {
        this.labelCombat.string = data;
    },
    setExpBar: function(level, exp){
        let levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLevel', level);
        let levelUpNeedExp = levelUpData.dwExp;
        let percent = exp/levelUpNeedExp;

        if (cc.game.renderType != cc.game.RENDER_TYPE_WEBGL){
            this.progressExp.progress = percent;
        }else{
            this.progressExp.node.runAction(cc.progressLoading(0.3, this.progressExp.progress, percent));
        }
    },
    setPlayerAvatar: function (url){
        if (cc.sys.platform !== cc.sys.WECHAT_GAME){
            return;
        }
        if (url == "") {
            return;
        }

        let nodeCenter = this.node.getChildByName("nodeCenter");
        let spritePlayerHeadImg = nodeCenter.getChildByName("spritePlayerHeadImg");
        let spriteHeader = spritePlayerHeadImg.getChildByName("spriteHeader");
        
        url = url + "?aaa=aa.png";
        cc.loader.load(url, function (err, tex) {
            if (err) {
                // cc.error("LoadURLSpriteFrame err." + url);
            }
            let spriteFrame = new cc.SpriteFrame(tex);
            spriteHeader.getComponent("RemoteSprite").spriteFrame = spriteFrame;
        })
    },
    setPlayerLevel: function (data) {
        this.getLabel("labelLevel").string = data;
    },
    setPlayerLife: function (data) {
        this.getLabel("labelLife").string = data;
    },
    setPlayerAtk: function (data) {
        this.getLabel("labelAtk").string = data;
    },
    setPlayerDef: function (data) {
        this.getLabel("labelDef").string = data;
    },
    setPlayerWingAtk: function (data) {
        this.getLabel("labelWingAtk").string = data;
    },
    setPlayerHurlAtk: function (data) {
        this.getLabel("labelHurlAtk").string = data;
    },
    setPlayerRocketAtk: function (data) {
        this.getLabel("labelRocketAtk").string = data;
    },
    setPlayerSubAtk: function (data) {
        this.getLabel("labelSubAtk").string = data;
    },
    setPlayerCriDamage: function (data) {
        this.getLabel("labelCriDamage").string = data;
    },
    setPlayerCriRate: function (data) {
        this.getLabel("labelCriRate").string = data;
    },
    setPlayerScore: function (data) {
        this.getLabel("labelScore").string = data;
    },
    setPlayerLifeGrow: function (data) {
        this.getLabel("labelLifeGrow").string = data;
    },
    setPlayerAtkGrow: function (data) {
        this.getLabel("labelAtkGrow").string = data;
    },
    setPlayerDefGrow: function (data) {
        this.getLabel("labelDefGrow").string = data;
    },

});
