

var StoredData = module.exports;
StoredData.Type = {};

StoredData.Type.UserName = "username";
StoredData.Type.Password = "password";
StoredData.Type.Version = "version";
StoredData.Type.BgmOnOff = "bgmOnOff";
StoredData.Type.EffectOnOff = "effectOnOff";
StoredData.Type.EndlessMode = "endlessMode";

StoredData.setUserName = function (username) {
    cc.sys.localStorage.setItem(StoredData.Type.UserName, username);
};

StoredData.getUserName = function () {
    return cc.sys.localStorage.getItem(StoredData.Type.UserName);
};

StoredData.setPassword = function (password) {
    cc.sys.localStorage.setItem(StoredData.Type.Password, password);
};

StoredData.getPassword = function () {
    return cc.sys.localStorage.getItem(StoredData.Type.Password);
};

StoredData.setVersion = function (version) {
    cc.sys.localStorage.setItem(StoredData.Type.Version, version);
};

StoredData.getVersion = function () {
    return cc.sys.localStorage.getItem(StoredData.Type.Version);
};

StoredData.setBgmOnOff = function (onOff) {
    cc.sys.localStorage.setItem(StoredData.Type.BgmOnOff, onOff);
}

StoredData.getBgmOnOff = function () {
    let onOff = cc.sys.localStorage.getItem(StoredData.Type.BgmOnOff);
    return (onOff === "false" ? false : true);
}

StoredData.setEffectOnOff = function (onOff) {
    cc.sys.localStorage.setItem(StoredData.Type.EffectOnOff, onOff);
}

StoredData.getEffectOnOff = function () {
    let onOff = cc.sys.localStorage.getItem(StoredData.Type.EffectOnOff);
    return (onOff === "false" ? false : true);
}

StoredData.setEndlessMode = function (index) {
    cc.sys.localStorage.setItem(StoredData.Type.EndlessMode, index);
}

StoredData.getEndlessMode = function (){
    let index = cc.sys.localStorage.getItem(StoredData.Type.EndlessMode);
    return parseInt(index) || 0;
}
