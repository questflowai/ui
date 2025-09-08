import { BaseColumnItemPlugin, BaseColumnPlugin } from "@platejs/layout"

import {
  ColumnElementStatic,
  ColumnGroupElementStatic,
} from "@/registry/new-york-v4/blocks/editor/ui/column-node-static"

export const BaseColumnKit = [
  BaseColumnPlugin.withComponent(ColumnGroupElementStatic),
  BaseColumnItemPlugin.withComponent(ColumnElementStatic),
]
