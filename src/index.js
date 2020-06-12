const {
    checkIsGitRepository,
    DateClassFormatFunction,
    getLocalGitLatestCommit,
    getLocalGitUserInfo,
    getLocalCurrentBranch
} = require('./utils');

class OutputCurrentBuildInfoPlugin {
    constructor(options = {}) {
        Date.prototype.Format = DateClassFormatFunction;

        this.outputName = options.outputName || 'build-log.json';
        this.dateFormatType = options.dateFormatType || 'yyyy-MM-dd hh:mm:ss';
        this.buildType = options.buildType || 'local';
    }

    apply(compiler) {
        compiler.plugin('emit', async (compilation, callback) => {
            let isGitRepository = true;
            let output = {
                build_time: (new Date()).Format(this.dateFormatType),
                build_type: 'local'
            };
            try {
                await checkIsGitRepository();
            } catch (e) {
                isGitRepository = false;
            } finally {
                if (isGitRepository) {
                    output.git = {
                        last_commit: await getLocalGitLatestCommit(),
                        currentBranch: await getLocalCurrentBranch(),
                        build_user: await getLocalGitUserInfo()
                    };
                }

                compilation.assets[this.outputName] = {
                    source(){
                        return JSON.stringify(output);
                    },
                    size(){
                        return output.length;
                    }
                };
            }

            callback();
        });
    }
}

module.exports = OutputCurrentBuildInfoPlugin;
