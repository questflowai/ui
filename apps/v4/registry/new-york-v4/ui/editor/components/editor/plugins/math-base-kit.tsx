import { BaseEquationPlugin, BaseInlineEquationPlugin } from "@platejs/math"

import {
  EquationElementStatic,
  InlineEquationElementStatic,
} from "@/registry/new-york-v4/ui/editor/ui/equation-node-static"

export const BaseMathKit = [
  BaseInlineEquationPlugin.withComponent(InlineEquationElementStatic),
  BaseEquationPlugin.withComponent(EquationElementStatic),
]
