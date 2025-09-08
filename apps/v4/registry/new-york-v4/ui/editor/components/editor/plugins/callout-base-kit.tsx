import { BaseCalloutPlugin } from "@platejs/callout"

import { CalloutElementStatic } from "@/registry/new-york-v4/ui/editor/ui/callout-node-static"

export const BaseCalloutKit = [
  BaseCalloutPlugin.withComponent(CalloutElementStatic),
]
