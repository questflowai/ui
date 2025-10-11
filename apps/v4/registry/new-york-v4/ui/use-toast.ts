"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"
import type { ExternalToast } from "sonner"

type ToastActionElement = React.ReactElement

type ToastVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "destructive"

type ToastAction =
  | ToastActionElement
  | {
      label: string
      onClick: () => void
    }

interface ToastOptions extends Omit<ExternalToast, "action"> {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  action?: ToastAction
}

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

  if (React.isValidElement(action)) {
    const props = action.props as any
    const label = typeof props.children === "string" ? props.children : "Action"
    const onClick = props.onClick || (() => {})

    return {
      label,
      onClick,
    }
  }

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

  if (variant === "destructive") {
    variant = "error"
  }

  const message = title
  const toastOptions: ExternalToast = {
    ...rest,
    description,
    action: parseAction(action),
  }

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

  return {
    id: toastId,
    dismiss: () => sonnerToast.dismiss(toastId),
    update: (updateOptions: Partial<ToastOptions>) => {
      console.warn(
        "Toast.update() is not fully supported with Sonner. Consider dismissing and creating a new toast."
      )
    },
  }
}

toast.success = (options: ToastOptions) =>
  toast({ ...options, variant: "success" })
toast.error = (options: ToastOptions) => toast({ ...options, variant: "error" })
toast.warning = (options: ToastOptions) =>
  toast({ ...options, variant: "warning" })
toast.info = (options: ToastOptions) => toast({ ...options, variant: "info" })

toast.message = (message: string, options?: ToastOptions) =>
  toast({ ...options, title: message })

toast.promise = sonnerToast.promise
toast.custom = sonnerToast.custom

toast.dismiss = (toastId?: string | number) => sonnerToast.dismiss(toastId)

/**
 * Hook to use toast functionality in React components
 * Compatible with both legacy and modern usage
 * @returns Object with toast methods and toasts array (for legacy compatibility)
 */
function useToast() {
  return {
    toast: toast as ToastFunction,
    dismiss: toast.dismiss,
    toasts: [] as any[],
  }
}

export { useToast, toast }
export type { ToastOptions, ToastVariant, ToastActionElement }
