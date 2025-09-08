import { BaseTogglePlugin } from "@platejs/toggle"

import { ToggleElementStatic } from "@/registry/new-york-v4/ui/editor/ui/toggle-node-static"

export const BaseToggleKit = [
  BaseTogglePlugin.withComponent(ToggleElementStatic),
]
