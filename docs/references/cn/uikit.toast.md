# toast

toast 组件主要进行提示，可以设置提示自动消失的时间。

## 安装上下文

```typescript
<ToastContextProvider dismissTimeout={TIMEOUT}></ToastContextProvider>
```

## 使用上下文

```typescript
const toast = useToastContext();
toast.showToast({...});
```

---

[返回父文档](./uikit.md)
