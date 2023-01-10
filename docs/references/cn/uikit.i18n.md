# 多语言管理

这套国际化组件除了支持 UIKIT 本身提供组件的国际化，还可以支持 应用定制化组件的国际化。

它的使用场景和主题不太一样，应用里面涉及到国际化的地方还是比较多的，所以，考虑这种可扩展式的国际化架构。

国际化的对象类型 `StringSetContextType`.
国际化的上下文类型 `I18nContextProvider`.

使用起来非常简单。如果需要应用定制化组件的国际化，只需要扩展 `StringSetContextType` 类型，以及 自定义 `useI18nContext`.

使用讲解：

## 安装上下文

如果不定制化使用，只需要

```typescript
const localization = createStringSetEn2(new UIKitStringSet());
<I18nContextProvider i18n={localization}>{children}</I18nContextProvider>;
```

如果需要定制化，只需要

```typescript
class AppStringSet extends UIKitStringSet2 {
  // todo
}
const localization = createStringSetEn2(new AppStringSet());
<I18nContextProvider i18n={localization}>{children}</I18nContextProvider>;
```

[示例代码](../../../example/src/I18n/AppCStringSet.en.ts)

将国际化对象设置到 `UIKitContainer` 组件里面就完成了初始化部分。

## 使用上下文

如果不定制化使用，只需要

```typescript
const { search } = useI18nContext();
```

如果需要定制化，只需要

```typescript
export function useAppI18nContext(): AppStringSet {
  const i18n = useI18nContext() as AppStringSet;
  if (!i18n) throw Error('StringSetContext is not provided');
  return i18n;
}
const { search } = useAppI18nContext();
```

[示例代码](../../../example/src/screens/ContactList.tsx)

**注意** 国际化写了 2 个版本，第一版采用 `组合大于继承` 的方式进行编写，虽然也达到了使用要求但是使用起来并不太方便，所以，第二版采用 `继承` 的方式编写，简单好用。 [第一版位置](../../../packages/react-native-chat-uikit/src/I18n) , [第二版位置](../../../packages/react-native-chat-uikit/src/I18n2)，保留第一版更多是提示后面有想法的人可以进行详细对比。

---

[返回父文档](./uikit.md)
