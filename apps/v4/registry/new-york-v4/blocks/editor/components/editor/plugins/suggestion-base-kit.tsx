import { BaseSuggestionPlugin } from "@platejs/suggestion"

import { SuggestionLeafStatic } from "@/registry/new-york-v4/blocks/editor/ui/suggestion-node-static"

export const BaseSuggestionKit = [
  BaseSuggestionPlugin.withComponent(SuggestionLeafStatic),
]
