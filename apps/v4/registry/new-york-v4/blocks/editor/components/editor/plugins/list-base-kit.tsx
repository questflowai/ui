import { BaseListPlugin } from "@platejs/list"
import { KEYS } from "platejs"

import { BaseIndentKit } from "@/registry/new-york-v4/blocks/editor/components/editor/plugins/indent-base-kit"
import { BlockListStatic } from "@/registry/new-york-v4/blocks/editor/ui/block-list-static"

export const BaseListKit = [
  ...BaseIndentKit,
  BaseListPlugin.configure({
    inject: {
      targetPlugins: [
        ...KEYS.heading,
        KEYS.p,
        KEYS.blockquote,
        KEYS.codeBlock,
        KEYS.toggle,
      ],
    },
    render: {
      belowNodes: BlockListStatic,
    },
  }),
]
