"use client"

import { CursorOverlayPlugin } from "@platejs/selection/react"

import { CursorOverlay } from "@/registry/new-york-v4/ui/editor/ui/cursor-overlay"

export const CursorOverlayKit = [
  CursorOverlayPlugin.configure({
    render: {
      afterEditable: () => <CursorOverlay />,
    },
  }),
]
