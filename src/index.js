const git = require('simple-git/promise')();

function OutputCurrentBuildInfoPlugin() {
    Date.prototype.Format = function (fmt) {
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
}

OutputCurrentBuildInfoPlugin.prototype.apply = function (compiler) {
    compiler.plugin('emit', async function (compilation, callback) {
        let gitRepoInit = true;
        let output = {
            build_time: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
            build_type: 'local'
        };
        try {
            await git.status();
        } catch (e) {
            if ('fatal: not a git repository (or any of the parent directories): .git' === e.message.toString().trim()) {
                console.info('\x1B[33m%s\x1b[0m:', "git repository not found.");
                gitRepoInit = false;
            }
        } finally {
            if (gitRepoInit) {
                output.git = {};
                const log = await git.log();
                const listConfig = await git.listConfig();
                const currentBranch = await git.branchLocal();

                if (log.latest) {
                    output.git.last_commit = log.latest;
                }

                output.git.currentBranch = currentBranch.current || '';
                let configFileList = Array.from(listConfig.files).reverse();

                configFileList.forEach(item => {
                    const currentFile = listConfig.values[item];

                    if (currentFile['user.name']) {
                        output.git.build_user = currentFile['user.name'];
                        return false;
                    }
                });
            }

            compilation.assets['build-log.json'] = {
                source: function () {
                    return JSON.stringify(output);
                },
                size: function () {
                    return output.length;
                }
            };
        }

        callback();
    });
};

module.exports = OutputCurrentBuildInfoPlugin;
