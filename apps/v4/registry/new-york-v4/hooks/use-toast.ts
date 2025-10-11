"use client"

// Modern toast implementation using sonner library with backward compatibility
import * as React from "react"
import { toast as sonnerToast } from "sonner"
import type { ExternalToast } from "sonner"

// Legacy types for backward compatibility
type ToastActionElement = React.ReactElement

// Modern variant types with legacy "destructive" support
type ToastVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "destructive"

// Flexible action type supporting both legacy and modern APIs
type ToastAction =
  | ToastActionElement // Legacy: React element like <ToastAction>Undo</ToastAction>
  | {
      // Modern: Simple object
      label: string
      onClick: () => void
    }

interface ToastOptions extends Omit<ExternalToast, "action"> {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  action?: ToastAction
}

// Return type for backward compatibility
interface ToastReturn {
  id: string | number
  dismiss: () => void
  update: (options: Partial<ToastOptions>) => void
}

type ToastFunction = {
  (options: ToastOptions): ToastReturn
  success: (options: ToastOptions) => ToastReturn
  error: (options: ToastOptions) => ToastReturn
  warning: (options: ToastOptions) => ToastReturn
  info: (options: ToastOptions) => ToastReturn
  message: (message: string, options?: ToastOptions) => ToastReturn
  promise: typeof sonnerToast.promise
  custom: typeof sonnerToast.custom
  dismiss: (toastId?: string | number) => void
}

/**
 * Extract action configuration from legacy or modern action prop
 */
function parseAction(action: ToastAction | undefined): ExternalToast["action"] {
  if (!action) return undefined

  // Check if it's a React element (legacy API)
  if (React.isValidElement(action)) {
    const props = action.props as any
    const label = typeof props.children === "string" ? props.children : "Action"
    const onClick = props.onClick || (() => {})

    return {
      label,
      onClick,
    }
  }

  // Modern API - simple object
  return {
    label: action.label,
    onClick: action.onClick,
  }
}

/**
 * Display a toast notification
 * @param options - Toast configuration options
 * @returns Toast object with id, dismiss, and update methods
 */
function toast(options: ToastOptions): ToastReturn {
  let { title, description, variant = "default", action, ...rest } = options

  // Map legacy "destructive" variant to "error"
  if (variant === "destructive") {
    variant = "error"
  }

  // Build the toast message
  const message = title
  const toastOptions: ExternalToast = {
    ...rest,
    description,
    action: parseAction(action),
  }

  // Call the appropriate sonner method based on variant
  let toastId: string | number
  switch (variant) {
    case "success":
      toastId = sonnerToast.success(message, toastOptions)
      break
    case "error":
      toastId = sonnerToast.error(message, toastOptions)
      break
    case "warning":
      toastId = sonnerToast.warning(message, toastOptions)
      break
    case "info":
      toastId = sonnerToast.info(message, toastOptions)
      break
    default:
      toastId = sonnerToast(message, toastOptions)
  }

  // Return object matching legacy API
  return {
    id: toastId,
    dismiss: () => sonnerToast.dismiss(toastId),
    update: (updateOptions: Partial<ToastOptions>) => {
      // Sonner doesn't have a built-in update, but we can dismiss and show a new one
      // or just log a warning for now
      console.warn(
        "Toast.update() is not fully supported with Sonner. Consider dismissing and creating a new toast."
      )
    },
  }
}

// Add variant methods to toast function
toast.success = (options: ToastOptions) =>
  toast({ ...options, variant: "success" })
toast.error = (options: ToastOptions) => toast({ ...options, variant: "error" })
toast.warning = (options: ToastOptions) =>
  toast({ ...options, variant: "warning" })
toast.info = (options: ToastOptions) => toast({ ...options, variant: "info" })

// Simple message helper
toast.message = (message: string, options?: ToastOptions) =>
  toast({ ...options, title: message })

// Expose sonner's promise and custom methods directly
toast.promise = sonnerToast.promise
toast.custom = sonnerToast.custom

// Dismiss toast(s)
toast.dismiss = (toastId?: string | number) => sonnerToast.dismiss(toastId)

/**
 * Hook to use toast functionality in React components
 * Compatible with both legacy and modern usage
 * @returns Object with toast methods and toasts array (for legacy compatibility)
 */
function useToast() {
  // For backward compatibility, return empty toasts array
  // In the old implementation, this would contain the active toasts
  return {
    toast: toast as ToastFunction,
    dismiss: toast.dismiss,
    toasts: [] as any[], // Legacy compatibility - sonner manages state internally
  }
}

export { useToast, toast }
export type { ToastOptions, ToastVariant, ToastActionElement }
