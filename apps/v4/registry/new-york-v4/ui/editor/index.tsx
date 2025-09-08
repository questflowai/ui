"use client"

import React, { useEffect } from "react"
import { type Value } from "platejs"
import {
  Plate,
  PlateContent,
  PlateEditor,
  PlatePlugin,
  usePlateEditor,
} from "platejs/react"

import { cn } from "@/lib/utils"

import QFPlugins from "./components/editor"

export default function Editor({
  className,
  editorCls,
  value,
  plugins,
  onChange,
  disabledPluginKeys,
}: {
  value: Value
  editorCls?: string
  className?: string
  plugins?: PlatePlugin[]
  onChange?: (x: { editor: PlateEditor; value: Value }) => void
  disabledPluginKeys?: string[]
}) {
  // 合并所有插件
  const allPlugins = [...QFPlugins, ...(plugins || [])]
  // 过滤禁用插件
  const enabledPlugins =
    Array.isArray(disabledPluginKeys) && disabledPluginKeys.length > 0
      ? allPlugins.filter((plugin) => !disabledPluginKeys.includes(plugin?.key))
      : allPlugins

  const editor = usePlateEditor({
    plugins: enabledPlugins,
    value: value,
  })

  useEffect(() => {
    editor.tf.setValue(value)
  }, [value])

  return (
    <div className={className}>
      <Plate
        editor={editor}
        onChange={(editorEvent) => {
          onChange && onChange(editorEvent)
        }}
      >
        <PlateContent
          className={cn(
            "h-full min-h-1 w-full p-2 focus:outline-none",
            editorCls
          )}
          placeholder="Type your amazing content here..."
        />
      </Plate>
    </div>
  )
}
