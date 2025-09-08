"use client"

import { createPlatePlugin } from "platejs/react"

import { FloatingToolbar } from "@/registry/new-york-v4/blocks/editor/ui/floating-toolbar"
import { FloatingToolbarButtons } from "@/registry/new-york-v4/blocks/editor/ui/floating-toolbar-buttons"

export const FloatingToolbarKit = [
  createPlatePlugin({
    key: "floating-toolbar",
    render: {
      afterEditable: () => (
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
      ),
    },
  }),
]
