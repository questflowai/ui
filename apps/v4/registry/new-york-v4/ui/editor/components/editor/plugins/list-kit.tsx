"use client"

import { ListPlugin } from "@platejs/list/react"
import { KEYS } from "platejs"

import { IndentKit } from "@/registry/new-york-v4/ui/editor/components/editor/plugins/indent-kit"
import { BlockList } from "@/registry/new-york-v4/ui/editor/ui/block-list"

export const ListKit = [
  ...IndentKit,
  ListPlugin.configure({
    inject: {
      targetPlugins: [
        ...KEYS.heading,
        KEYS.p,
        KEYS.blockquote,
        KEYS.codeBlock,
        KEYS.toggle,
        KEYS.img,
      ],
    },
    render: {
      belowNodes: BlockList,
    },
  }),
]
