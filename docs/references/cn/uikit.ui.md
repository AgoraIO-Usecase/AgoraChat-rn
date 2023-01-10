# Icon

主要分为本地图标和矢量图标。

`LocalIcon` 提供本地图标加载的方法。

`VectorIcon` 提供网络资源加载，而资源来自 `react-native-vector-icons`。

`LocalIcon` 如果需要更新，除了添加资源，还需要重新运行脚本 `scripts/bundle-icons.js`。

[示例代码](../../../example/src/__dev__/test_icon.tsx)

# Image

主要采用两种方式进行图片加载。

`Image` 主要针对 `react-native` 原始版本改进了 `onLoad` 和 `onError`。

`FastImage` 是对 `react-native-fast-image` 的封装， 相比 `Image` 更加了缓存处理。

采用哪种类型，他会自行判断。

[示例代码](../../../example/src/__dev__/test_image.tsx)

# ActionMenu

基于 `Modal` 的组件，可以当做右键菜单使用。

[示例代码](../../../example/src/__dev__/test_menu.tsx)

# Alert

基于 `Modal` 的组件，警告对话框。

[示例代码](../../../example/src/__dev__/test_alert.tsx)

# Avatar

基于 `Image` 的组件，该组件支持大小、形状、颜色的改变，并且还支持头像的右下角状态。

[示例代码](../../../example/src/__dev__/test_avatar.tsx)

# Badge

未读数组件。

[示例代码](../../../example/src/__dev__/test_badge.tsx)

# BottomSheet

基于 `Modal` 的组件，从下面弹出的抽屉菜单。支持点击蒙版取消和下滑屏幕取消。

[示例代码](../../../example/src/__dev__/test_sheet.tsx)

# Button

基于 `Pressable` 的组件，`react-native` 自带 `Button` 的 `title` 在 `Android` 平台内容字母大写。 为了达到统一效果定制了该组件。

[示例代码](../../../example/src/__dev__/test_button.tsx)

# Divider

分隔符组件。方向为水平。

[示例代码](../../../example/src/__dev__/test_divider.tsx)

# EqualHeightList

等高列表组件。 典型应用场景：通讯录列表、群组列表、会话列表等。
该组件支持字母列表定位，支持下拉刷新，支持自定义头组件（典型应用：搜索组件）。

**注意** `EqualHeightList.T` 版本目前为测试版本不建议使用。

[示例代码](../../../example/src/__dev__/test_list3.tsx)

# Loading

表示等待的组件。

[示例代码](../../../example/src/__dev__/test_loading.tsx)

# LoadingRN

表示等待的组件。对 `react-native` 的 `ActivityIndicator` 的封装。

[示例代码](../../../example/src/__dev__/test_loading_rn.tsx)

# MenuBar

以后完善。

# Modal

模态窗口的基础组件，基于 `react-native` 的 `Modal` 实现，支持半透明、透明蒙版、支持点击蒙版取消、是其他模态窗口组件的基础组件。一般不会直接使用。

[示例代码](../../../example/src/__dev__/test_modal.tsx)

# Prompt

提示框组件。典型应用场景包括：显示提示内容、显示和编辑提示内容等。

[示例代码](../../../example/src/__dev__/test_prompt.tsx)

# SearchBar

搜索组件。基于 `TextInputEx` 组件实现。

[示例代码](../../../example/src/__dev__/test_search.tsx)

# Switch

开关组件。典型应用场景：对布尔值的选择。支持大小和颜色的修改。

[示例代码](../../../example/src/__dev__/test_switch.tsx)

# TextInput

基于 `react-native` 的 `TextInput` 的封装。主要增加了默认颜色样式主题的修改。

[示例代码](../../../example/src/__dev__/test_input.tsx)

# TextInputEx

由于 `react-native` 提供的 `TextInput` 缺少了自定义图标，所以，该组件实现了左边图标和右边图标的自定义以及事件响应处理。

左边图标典型应用：搜索。
右边图标典型应用：清空输入内容、密码是否显示。

支持 `iOS` 风格的 `取消` 按钮。

# Toast

限时弹出提示信息的组件。

**注意** 需要上下文才能支持 限时。

[示例代码](../../../example/src/__dev__/test_toast.tsx)

---

[返回父文档](./uikit.md)
