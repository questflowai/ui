"use client"

import Editor from "@/registry/new-york-v4/ui/editor/index"

export default function EditorUiDemo() {
  const initialValue = [
    {
      children: [{ text: "Title" }],
      type: "h3",
    },
    {
      children: [{ text: "This is a quote." }],
      type: "blockquote",
    },
    {
      children: [
        { text: "With some " },
        { bold: true, text: "bold" },
        { text: " text for emphasis!" },
      ],
      type: "p",
    },
  ]

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Editor className="h-1/2 w-1/2" value={initialValue} />
    </div>
  )
}
