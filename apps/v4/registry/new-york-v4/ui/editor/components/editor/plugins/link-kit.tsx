"use client"

import { LinkPlugin } from "@platejs/link/react"

import { LinkElement } from "@/registry/new-york-v4/ui/editor/ui/link-node"
import { LinkFloatingToolbar } from "@/registry/new-york-v4/ui/editor/ui/link-toolbar"

export const LinkKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <LinkFloatingToolbar />,
    },
  }),
]
