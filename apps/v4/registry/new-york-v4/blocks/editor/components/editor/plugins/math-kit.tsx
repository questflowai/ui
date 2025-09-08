"use client"

import { EquationPlugin, InlineEquationPlugin } from "@platejs/math/react"

import {
  EquationElement,
  InlineEquationElement,
} from "@/registry/new-york-v4/blocks/editor/ui/equation-node"

export const MathKit = [
  InlineEquationPlugin.withComponent(InlineEquationElement),
  EquationPlugin.withComponent(EquationElement),
]
