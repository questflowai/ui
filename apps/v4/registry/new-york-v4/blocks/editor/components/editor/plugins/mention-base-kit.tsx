import { BaseMentionPlugin } from "@platejs/mention"

import { MentionElementStatic } from "@/registry/new-york-v4/blocks/editor/ui/mention-node-static"

export const BaseMentionKit = [
  BaseMentionPlugin.withComponent(MentionElementStatic),
]
