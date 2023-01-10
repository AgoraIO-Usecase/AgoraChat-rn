# 模态组件

模态组件上下文主要做了两件事情。 1. 解决多模态组件并发出现的问题， 2. 解决原始使用代码冗余问题，同时使代码编写变得优雅。

模态组件管理框架主要采用消息队列方式解决问题，以及优化代码冗余问题。

模态组件典型应用场景：弹出警告内容、弹出菜单、弹出提示内容等。对应的组件为 `Alert` `BottomSheet` `Prompt`。

**注意** 由于限时提示组件 `toast` 的特殊性所以放在了单独上下文中进行管理。

使用讲解：

## 初始化部分

安装上下文：

```typescript
<DialogContextProvider>{children}</DialogContextProvider>
```

## 使用部分

使用上下文：

```typescript
const menu = useActionMenu();
menu.openMenu({...});

const alert = useAlert();
alert.openAlert({...});

const prompt = usePrompt();
prompt.openPrompt({...});

const sheet = useBottomSheet();
sheet.openSheet({...});
```

---

[返回父文档](./uikit.md)
