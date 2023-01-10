# UI 主题

这里的主题主要包括：颜色、字体、以及调色板。

调色板主要参考 `react-native-paper`。主要是考虑通用和好用。

颜色方面主要提供了基础的颜色建议，以及专为组件设计的颜色。

字体方面主要提供了几种风格。

为了方便使用提供了 `light` 和 `dark` 模版，对于有额外需要的应用可以自定义。

**注意** 自定义需要按照指定模板进行设置。
**注意** 目前 `dark` 还不够完善，不建议使用。

主题类型为 `ThemeContextType`。
主题的上下文为 `ThemeContextProvider`。

使用讲解：

## 初始化部分

安装上下文：

```typescript
<ThemeContextProvider value={theme}>{children}</ThemeContextProvider>
```

## 使用部分

使用上下文：

```typescript
const { colors, fonts } = useThemeContext();
```

---

[返回父文档](./uikit.md)
