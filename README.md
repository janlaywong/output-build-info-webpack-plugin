<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# output-build-info-webpack-plugin

输出webpack打包环境信息（例如打包时间，分支，Git相关信息等）

### 使用方式

```console
$ npm install output-build-info-webpack-plugin --save
```

然后添加到你的`webpack` 配置中

```js
const OutputBuildInfoWebpackPlugin = require('output-build-info-webpack-plugin');

module.exports = {
    plugins: [
        new OutputBuildInfoWebpackPlugin({
            outputName: 'build-log.json',
            dateFormatType: 'yyyy-MM-dd hh:mm:ss',
            buildType: 'local'
        })
    ]
};
```

### 参数


名称 | 说明 | 类型 | 默认值
---|---|---|---
outputName | 输出文件名称 | string | build-log.json
dateFormatType | 时间格式 | string | yyyy-MM-dd hh:mm:ss
buildType | 编译平台（自定义）| string | local


### 输出文件格式

#### Git 工作区
```json5
{
  "build_time": "2020-06-12 11:03:12", // 编译输出时间
  "build_type": "local", // 自定义类型
  "git": {
    "last_commit": { // 本地最新一次commit
      "hash": "a6aa20b543c1019e423c8e79c66e2e8ec85549bd",
      "date": "2020-06-12T11:05:11+08:00",
      "message": "fix: 修复构建产生的Bug",
      "refs": "HEAD -> master",
      "body": "",
      "author_name": "janlay",
      "author_email": "janlay884181317@gmail.com"
    },
    "currentBranch": "master", // 本地编译分支
    "build_user": { // 编译人
      "name": "janlay",
      "email": "janlay884181317@gmail.com"
    }
  }
}
```

#### 非 Git 工作区 (没有.git目录)

```json5
{
  "build_time": "2020-06-12 11:07:12",
  "build_type": "local"
}
```
