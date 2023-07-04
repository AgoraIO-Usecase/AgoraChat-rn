## 面向开发者

### 下载地址

[repo](https://github.com/asteriskzuo/react-native-chat-library)

### 初始化流程

1. 安装依赖，以及生成本地文件： `yarn`，该命令会自动执行 `prepare` 命令。
2. 对于 `iOS` 平台, 需要执行 `pod install`，生成对应工程。
3. 对于 `Android` 平台，需要执行 `gradle` 命令。
4. 对于开发者模式，由于 `example` 使用 `expo` 工具，所以，编译和运行相比较原生 `react-native` 还是方便很多。编译可以通过 `xcode` 或者 `Android studio` 或者 `命令`。
5. 运行 执行 `expo run:android` 或者 `expo run:ios`，具体参考 `expo` 帮助。

**注意 1** 不建议使用 `npm` 命令，如果使用报错请自行修复。
**注意 2** 初始化需要生成本地文件。例如：`version.ts` 和 `env.ts` 。
**注意 3** 如果是 `iOS` 平台，使用真机，还需要注意 `identifier` 相关的设置。
**注意 4** 如果是 `Android` 平台，当前 `gradle` 版本为 `7.0.4`，所以，老旧 `Android studio` 无法正常运行，建议使用 `2022` 版本或者以上。
**注意 5** 如果是 `iOS` 平台，由于 即时通讯 `SDK` 不支持 `arm64` 模拟器，所以，如果使用模拟器请使用 `12.4`或者以下的模拟器。
**注意 6** 如果对于指定平台不太熟悉，请参阅相关资料。
**注意 7** 如果对于 `expo` 不熟悉，请参考相关资料。 建议，安装 `expo-cli` 工具，帮助非常详细。
**注意 8** 目前不支持 `web` 平台。后续更新。
**注意 9** 对于命令不太熟悉的可以参考 `example/package.json` 里面的脚本命令。
**注意 10** 如果编译遇到问题，请尝试原生编译，相互印证解决问题。

### 关于项目体积

对于想要使用 `yarn2` 的开发者，可以尝试。 `yarn1`项目的体积确实非常大。

### UIKIT

目前市面绝大部分的开源 UI 组件，我都进行了研究，但是某些组件还不够完善，只能说是参考级的，所以，这里实现的组件可能有这样那样的问题，如果发现请欢迎完善。

### 代码贡献

请遵守代码提交尊则。具体参考：`@commitlint/config-conventional/README.md`

```text
  [
    'build',
    'chore',
    'ci',
    'docs',
    'feat',
    'fix',
    'perf',
    'refactor',
    'revert',
    'style',
    'test',
    'tag
  ];
```

```
feat: 一项新功能
fix: 一个错误修复
docs: 仅文档更改
style: 不影响代码含义的更改（空白，格式，缺少分号等）
refactor: 既不修正错误也不增加功能的代码更改（重构）
perf: 改进性能的代码更改
test: 添加缺失或更正现有测试
build: 影响构建系统或外部依赖项的更改（gulp，npm等）
ci: 对CI配置文件和脚本的更改
chore: 更改构建过程或辅助工具和库，例如文档生成
tag: 多包版本管理

ref: https://juejin.cn/post/6934292467160514567
```

### 添加tag

```sh
git commit -am"tag: v0.1.1 uikit-v0.1.1-beta.3 callkit-v0.1.2-beta.3" && git tag -a v0.1.1 -m"v0.1.1"
```

```sh
git commit -m"tag: uikit@1.0.0 && callkit@1.0.0"
git tag -a uikit@1.0.0 -m"uikit@1.0.0"
git tag -a callkit@1.0.0 -m"callkit@1.0.0"
git push --tags
```

---

[返回父文档](./index.md)
