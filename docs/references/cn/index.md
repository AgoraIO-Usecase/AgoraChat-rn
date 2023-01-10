# UIKIT 以及 Example 的使用说明

该说明可以帮助开发者更有效率的进行项目开发以及学习实践。

该项目主要通过 `nodejs` 进行管理和维护。

## 工程主要结构

```text
react-native-chat-library
├── CONTRIBUTING.md ———— 贡献者
├── LICENSE ———— 许可证
├── README.md ———— 简要说明
├── docs ———— 详细说明
├── example ———— 即时通讯产品演示示例
├── lerna.json ———— 项目包管理工具
├── node_modules ———— 依赖项
├── package.json ———— 项目工程配置
├── packages ———— UIKIT 等 npm 包
├── scripts ———— 自定义脚本工具
├── templates ———— 配置模版文件
├── tsconfig.json ———— typescript 配置文件
└── yarn.lock ———— 版本控制文件
```

[工程详细说明](./workspace.md)

packages 主要包括开发的 `UIKIT` 等包。

### `react-native-chat-uikit` 项目 主要结构

```text
react-native-chat-uikit
├── LICENSE ———— 许可证
├── README.md ———— 简要说明
├── android ———— Android
├── ios ———— iOS
├── lib ———— 对外提供的接口
├── node_modules ———— 依赖项
├── package.json ———— `UIKIT` 工程配置文件
├── react-native-chat-uikit.podspec ———— iOS `pod-install` 配置文件
├── scripts ———— 自定义脚本工具
├── src ———— 源码
└── tsconfig.json ———— typescript 配置文件
```

[uikit 详细说明](./uikit.md)

### `example` 项目 主要结构

```text
example
├── android ———— Android
├── app.json ———— `expo`的配置文件
├── assets ———— 公共资源文件
├── index.js ———— 入口文件
├── ios ———— iOS
├── metro.config.js ———— `metro` 配置文件
├── node_modules ———— 依赖项
├── package.json ———— `example` 工程配置文件
├── react-native.config.js ———— `react-native` 配置文件
├── scripts ———— 自定义脚本工具
├── src ———— 源码
└── tsconfig.json ———— typescript 配置文件
```

[example 详细说明](./example.md)

### 开发者使用说明

[面向开发者](./developer.md)

### `npm` 或者 `yarn` 用户使用说明

[面向用户](./user.md)
