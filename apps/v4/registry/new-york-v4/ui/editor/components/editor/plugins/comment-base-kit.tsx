import { BaseCommentPlugin } from "@platejs/comment"

import { CommentLeafStatic } from "@/registry/new-york-v4/ui/editor/ui/comment-node-static"

export const BaseCommentKit = [
  BaseCommentPlugin.withComponent(CommentLeafStatic),
]
