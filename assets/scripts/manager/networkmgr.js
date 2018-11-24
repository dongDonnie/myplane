var config = require('config')
var requestService = require('requestservice')
var serverTimeService = require("servertimeservice")
var GlobalVar = require("globalvar")
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto")
var ByteBuffer = require("bytebuffer");
const weChatAPI = require("weChatAPI")

var self = null;

const NetworkManager = cc.Class({

    statics: {
        instance: null,
        getInstance: function () {
            if (NetworkManager.instance == null) {
                NetworkManager.instance = new NetworkManager();
                NetworkManager.instance.registerEvent();
            }
            return NetworkManager.instance;
        },
        destroyInstance() {
            if (NetworkManager.instance != null) {
                NetworkManager.instance.unregisterEvent();
                delete NetworkManager.instance;
                NetworkManager.instance = null;
            }
        },
    },

    ctor() {
        self = this;

        this.socket = null;
        this.m_writeBuf = new ByteBuffer();
        this.m_readBuf = new ByteBuffer();

        this.connected = false;
        this.needReConnected = true;
        this.connectHostAddress = '';
        this.connectHostPort = 0;
        this.onConnectCallBack = null;

        this.hookHandler = null;

        this.updateTimeID = -1;
        this.heartBeatTimeID = -1;
        this.connectTimerID = -1;
    },

    registerEvent() {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NETWORK_TIMEOUT, self._onNetworkTimeout, self);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NETWORK_DEAD, self._onNetworkDead, self);
    },

    unregisterEvent() {
        GlobalVar.eventManager().removeListenerWithTarget(NetworkManager.instance);
    },

    init() {
        self.updateTimeID = GlobalVar.gameTimer().startTimer(function () {
            self.update();
        }, 1 / 60);
        self.heartBeatTimeID = GlobalVar.gameTimer().startTimer(function () {
            self.onHeartBeat();
        }, 10);
    },

    reset() {
        if (!!this.socket) {
            this.socket = null;
        }
        GlobalVar.gameTimer().delTimer(self.updateTimeID);
        GlobalVar.gameTimer().delTimer(self.heartBeatTimeID);
    },

    update() {
        requestService.getInstance().update();
        serverTimeService.getInstance().update();
    },

    onHeartBeat() {
        if (self.connected) {
            let msg = {
                Reply: 0,
                TimeStamp: 123,
                ServerTime: 456,
            }
            requestService.getInstance().addRequest(GameServerProto.GMID_PING, msg);
            //GlobalVar.handlerManager().meHandler.sendMsg(GameServerProto.GMID_PING, msg);
        }
    },

    connect(host, port) {
        if (!!this.socket) {
            return;
        }
        let url = (cc.sys.platform === cc.sys.WECHAT_GAME ? ('wss://' + host) : ('ws://' + host + ':' + port));
        this.socket = new WebSocket(url);
        this.socket.binaryType = 'arraybuffer';
        this.socket.onopen = function (event) {
            console.log('socket open: ', event);
            GameServerProto.Init();
            self.connected = true;
            serverTimeService.getInstance(); //实例化服务器时间服务
            self.init();
            if (!!self.onConnectCallBack) {
                self.onConnectCallBack();
            }
        };
        this.socket.onclose = function (event) {
            console.log('socket close: ', event);
            self.connected = false;
            requestService.getInstance().onDisconnected();
            GlobalVar.netWaiting().showReconnect(false);
            self.reset();
            self.connectToServer(self.connectHostAddress, self.connectHostPort);
        };
        this.socket.onerror = function (event) {
            console.error('socket error: ', event);
            if (self.connected) {
                GlobalVar.netWaiting().showWaiting(false);
                GlobalVar.netWaiting().showReconnect(true);
            }
            self.connected = false;
            requestService.getInstance().onDisconnected();
            self.reset();
        };
        this.socket.onmessage = function (event) {
            // console.log('socket message event: ', event);
            self.m_readBuf.clear();
            self.m_readBuf.append(event.data);
            self.m_readBuf.limit = self.m_readBuf.offset;
            self.m_readBuf.offset = 0;
            let msg = {};
            GameServerProto.Decode(self.m_readBuf, msg);
            if (!!self.hookHandler) {
                self.hookHandler(msg.id, msg); //传递到requestService
                GlobalVar.messageDispatcher.onNetMessage(msg.id, msg); //传递到分发器
            }
            if (msg.id != 1)
                console.log('message:', msg);
            // console.log('socket message data: ', msg);
        };
    },

    send(msg) {
        this.m_writeBuf.clear();
        if (GameServerProto.Encode(msg.id, msg.data, this.m_writeBuf) < 0) {
            return false;
        }
        this.m_writeBuf.limit = this.m_writeBuf.offset;
        this.m_writeBuf.offset = 0;
        if (msg.id != 1)
            console.log('send:', msg);
        if (!!this.socket) {
            this.socket.send(this.m_writeBuf.toArrayBuffer());
            return true;
        }

        return false;
    },

    connectToServer(host, port, callback) {
        self.connectHostAddress = host;
        self.connectHostPort = port;
        if (!!callback) {
            this.onConnectCallBack = callback;
        }
        this.connect(host, port);
    },

    setOnConnectCallBack(callback) {
        if (!!callback) {
            this.onConnectCallBack = callback;
        }
    },

    setHookHandler(_hookHandler) {
        self.hookHandler = _hookHandler;
    },

    checkConnection() {
        if (!self.connected) {
            GlobalVar.netWaiting().showWaiting(true);
            this.connectTimerID = GlobalVar.gameTimer().startTimer(function () {
                if (!self.connected) {
                    GlobalVar.gameTimer().delTimer(self.connectTimerID);
                    self.connectTimerID = -1;
                    GlobalVar.netWaiting().showWaiting(false);
                    self.connectToServer(self.connectHostAddress, self.connectHostPort);
                    //GlobalVar.netWaiting().showReconnect(true);
                }
            }, 5);
        }
    },

    _onNetworkLogin(data) {
        if (data.ret && data.ret != 0) {
            // console.log("wx session expired, start login wx.");
            //self.useWxLogin(username1)
        } else {
            // console.log("login success, start afterlogin.");
            self.afterLogin(data);
            //self.reqCallBack();
        }
    },

    afterLogin(data) {
        if (data.newToken) {
            GlobalVar.Me.loginData.token = data.newToken;
        }
        var date = new Date();
        self.loginLocalTimeStamp = Math.floor(date.getTime() / 1000);

        requestService.getInstance().onLoginedGame();
    },

    onLoginedGame() {
        requestService.getInstance().onLoginedGame();
    },

    _onNetworkTimeout() {
        //GlobalVar.netWaiting().showReconnect(true);
    },

    _onNetworkDead() {
        var isWaiting = requestService.getInstance().hasWaiting();

        if (isWaiting) {
            GlobalVar.netWaiting().showReconnect(true);
        } else {
            if (!!this.socket) {
                this.socket.onclose();
            }
        }
    }
});