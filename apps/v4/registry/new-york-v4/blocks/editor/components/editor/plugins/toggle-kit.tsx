"use client"

import { TogglePlugin } from "@platejs/toggle/react"

import { IndentKit } from "@/registry/new-york-v4/blocks/editor/components/editor/plugins/indent-kit"
import { ToggleElement } from "@/registry/new-york-v4/blocks/editor/ui/toggle-node"

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
]
