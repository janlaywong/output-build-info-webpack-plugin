const git = require('simple-git/promise')();

const {ERROR} = require('./enum');
const {Warn} = require('./log');

const DateClassFormatFunction = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (const k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

const isEqual = (messageA, messageB) => {
    return messageA.toString().trim() === messageB.toString().trim()
};

const checkIsGitRepository = async () => {
    try {
        await git.status();
    } catch (e) {
        const errorMessage = e.message.toString();
        Warn(errorMessage);
        return isEqual(ERROR.NOT_GIT_REPOSITORY, errorMessage)
    }
};

const getLocalCurrentBranch = async () => {
    try {
        const currentBranch = await git.branchLocal();
        return currentBranch.current || '';
    } catch (e) {
        const errorMessage = e.message.toString();
        Warn(errorMessage);
    }
};

const getLocalGitLatestCommit = async () => {
    try {
        const log = await git.log();
        return log.latest || {};
    } catch (e) {
        const errorMessage = e.message.toString();
        Warn(errorMessage);
    }
};

const getLocalGitUserInfo = async () => {
    try {
        const listConfig = await git.listConfig();
        const configFileList = Array.from(listConfig.files).reverse();

        let userInfo = {};
        configFileList.forEach(item => {
            const currentConfig = listConfig.values[item];
            const name = currentConfig['user.name'];
            const email = currentConfig['user.email'];
            if (name && email) {
                userInfo = {
                    name: name,
                    email: email
                };
                return false;
            }
        });
        return userInfo;
    } catch (e) {
        const errorMessage = e.message.toString();
        Warn(errorMessage);
    }
};

module.exports = {
    checkIsGitRepository,
    getLocalCurrentBranch,
    getLocalGitLatestCommit,
    getLocalGitUserInfo,
    DateClassFormatFunction,
};
