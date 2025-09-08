"use client"

import { createPlatePlugin } from "platejs/react"

import { FixedToolbar } from "@/registry/new-york-v4/ui/editor/ui/fixed-toolbar"
import { FixedToolbarButtons } from "@/registry/new-york-v4/ui/editor/ui/fixed-toolbar-buttons"

export const FixedToolbarKit = [
  createPlatePlugin({
    key: "fixed-toolbar",
    render: {
      beforeEditable: () => (
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
      ),
    },
  }),
]
