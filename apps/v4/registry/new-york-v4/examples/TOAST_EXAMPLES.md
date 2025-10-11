# Toast Examples

This directory contains various examples demonstrating the new Sonner-based toast implementation with full backward compatibility for the legacy toast system.

## ⚡ Backward Compatibility

The new implementation is **100% backward compatible** with the old Radix-based toast system. All existing code will continue to work without any changes:

- ✅ Legacy `variant: "destructive"` → Auto-mapped to `error`
- ✅ Legacy `<ToastAction>` React elements → Fully supported
- ✅ Modern simple object API → New simplified syntax
- ✅ All return values match legacy API → `{ id, dismiss, update }`

## Available Examples

### Basic Examples

#### 1. **toast-simple.tsx**
Simple toast notification with just a description.
```tsx
toast({
  description: "Your message has been sent.",
})
```

#### 2. **toast-with-title.tsx**
Toast with both title and description.
```tsx
toast({
  title: "Scheduled: Catch up",
  description: "Friday, February 10, 2024 at 5:57 PM",
})
```

#### 3. **toast-with-action.tsx**
Toast with an action button that users can click.
```tsx
toast({
  title: "Event created",
  description: "Your event has been created successfully.",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo clicked"),
  },
})
```

### Variant Examples

#### 4. **toast-success.tsx**
Success variant with green styling and checkmark icon.
```tsx
toast.success({
  title: "Success!",
  description: "Your changes have been saved successfully.",
})
```

#### 5. **toast-error.tsx**
Error variant with red styling and error icon.
```tsx
toast.error({
  title: "Error!",
  description: "There was a problem with your request.",
})
```

#### 6. **toast-warning.tsx**
Warning variant with amber styling and warning icon.
```tsx
toast.warning({
  title: "Warning!",
  description: "Please review your input before proceeding.",
})
```

#### 7. **toast-info.tsx**
Info variant with blue styling and info icon.
```tsx
toast.info({
  title: "New update available",
  description: "Version 2.0.0 is now available for download.",
})
```

### Advanced Examples

#### 8. **toast-promise.tsx**
Promise-based toast that shows loading state and auto-updates on completion.
```tsx
toast.promise(fetchDataPromise, {
  loading: "Loading data...",
  success: (data) => `Data loaded successfully!`,
  error: (err) => `Failed to load data: ${err}`,
})
```

#### 9. **toast-with-close.tsx**
Persistent toast with manual dismissal functionality.
```tsx
// Show persistent toast
toast({
  title: "Persistent notification",
  description: "This toast will stay until you dismiss it.",
  duration: Infinity,
})

// Dismiss all toasts
toast.dismiss()
```

#### 10. **toast-demo.tsx**
Comprehensive demo showcasing all toast variants and features in one place.

## Usage

### Basic Usage
```tsx
import { toast } from "@/registry/new-york-v4/hooks/use-toast"

// Show a toast
toast({
  title: "Title",
  description: "Description",
})
```

### With useToast Hook
```tsx
import { useToast } from "@/registry/new-york-v4/hooks/use-toast"

function MyComponent() {
  const { toast, dismiss } = useToast()
  
  return (
    <button onClick={() => toast({ title: "Hello" })}>
      Show Toast
    </button>
  )
}
```

## API Reference

### Toast Options

| Option | Type | Description |
|--------|------|-------------|
| `title` | `React.ReactNode` | The title of the toast |
| `description` | `React.ReactNode` | The description/message of the toast |
| `variant` | `"default" \| "success" \| "error" \| "warning" \| "info"` | The visual variant of the toast |
| `action` | `{ label: string, onClick: () => void }` | Action button configuration |
| `duration` | `number` | Duration in ms before auto-dismiss (default: 4000, use `Infinity` for persistent) |
| `position` | `string` | Position on screen (e.g., "top-right", "bottom-center") |
| `closeButton` | `boolean` | Show/hide close button |

### Methods

| Method | Description |
|--------|-------------|
| `toast(options)` | Show a default toast |
| `toast.success(options)` | Show a success toast |
| `toast.error(options)` | Show an error toast |
| `toast.warning(options)` | Show a warning toast |
| `toast.info(options)` | Show an info toast |
| `toast.message(message, options)` | Quick message toast |
| `toast.promise(promise, options)` | Promise-based toast |
| `toast.dismiss(id?)` | Dismiss toast(s) |

## Migration Guide

### No Migration Required! 🎉

The new implementation is **fully backward compatible**. Your existing code will work without any changes!

### Legacy API (Still Supported)
```tsx
import { useToast } from "@/registry/new-york-v4/hooks/use-toast"
import { ToastAction } from "@/registry/new-york-v4/ui/toast"

const { toast } = useToast()

// Old destructive variant - still works!
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong",
  action: <ToastAction altText="Try again">Try again</ToastAction>,
})
```

### Modern API (Recommended for New Code)
```tsx
import { useToast } from "@/registry/new-york-v4/hooks/use-toast"

const { toast } = useToast()

// New simpler syntax
toast.error({
  title: "Error",
  description: "Something went wrong",
  action: {
    label: "Try again",
    onClick: () => handleRetry(),
  },
})
```

### Compatibility Features

#### 1. Action Prop - Both Formats Supported

**Legacy (React Element):**
```tsx
import { ToastAction } from "@/registry/new-york-v4/ui/toast"

toast({
  title: "Event created",
  action: <ToastAction altText="Undo">Undo</ToastAction>,
})
```

**Modern (Simple Object):**
```tsx
toast({
  title: "Event created",
  action: {
    label: "Undo",
    onClick: () => handleUndo(),
  },
})
```

#### 2. Variant Mapping

| Legacy Variant | Modern Equivalent | Auto-Mapped |
|---------------|-------------------|-------------|
| `"default"` | `"default"` | ✅ |
| `"destructive"` | `"error"` | ✅ Yes |
| N/A | `"success"` | New |
| N/A | `"warning"` | New |
| N/A | `"info"` | New |

#### 3. Return Value Compatibility

Both APIs return the same structure:
```tsx
const result = toast({ title: "Hello" })
// result: { id, dismiss, update }

result.dismiss() // Dismiss this specific toast
```

### Gradual Migration Strategy

You can mix both APIs in the same codebase:

```tsx
// Keep legacy code as-is
toast({
  variant: "destructive",
  action: <ToastAction>Undo</ToastAction>,
})

// Use modern API for new features
toast.success({ title: "Saved!" })
toast.warning({ title: "Warning!" })
toast.info({ title: "Info!" })
```

## Notes

- The new implementation uses Sonner, which provides better performance and UX
- No need to manually add a `<Toaster />` component if using the app layout
- Toasts are automatically managed and dismissed
- Promise toasts automatically handle loading, success, and error states

