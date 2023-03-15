_English | [中文](./README.zh.md)_

---

Here is the description of the `callkit-example` project.

## Compile and run

1. Initialize all projects in the `repo` root directory

```sh
yarn
```

2. Execute `callkit-example` project initialization

```sh
cd examples/callkit-example && yarn run gse
```

3. If it is `iOS` platform, `pod install` is required

```sh
cd examples/callkit-example/ios && pod install
```

4. If it is `Android` platform, `gradle sync project` is required

5. Run the debug service

```sh
cd examples/callkit-example && yarn run start
```
