"use client"

import { CalloutPlugin } from "@platejs/callout/react"

import { CalloutElement } from "@/registry/new-york-v4/blocks/editor/ui/callout-node"

export const CalloutKit = [CalloutPlugin.withComponent(CalloutElement)]
