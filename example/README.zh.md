_中文 | [English](./README.md)_

---

这是 `example` 项目的说明。

## 编译运行

1. 在 `repo` 根目录 初始化 所有项目

```sh
yarn
```

2. 执行 `example` 项目初始化

```sh
cd example && yarn run gse
```

3. 如果是 `iOS` 平台，需要 `pod install`

```sh
cd example/ios && pod install
```

4. 如果是 `Android` 平台，需要 `gradle sync project`

5. 运行调试服务

```sh
cd example && yarn run start
```
