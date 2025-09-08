import { BlockquotePlugin } from "@platejs/basic-nodes/react"
import { PlateElement, PlateElementProps } from "platejs/react"

// 自定义组件实例，具体内容参考Platejs及Slatejs文档。
// 实现组件内容后需要在外层的index.ts中引入并添加到插件列表中。

export function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement
      as="blockquote"
      style={{
        borderLeft: "2px solid #eee",
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: "24px",
        color: "#666",
        fontStyle: "italic",
      }}
      {...props}
    />
  )
}

export default BlockquotePlugin.withComponent(BlockquoteElement)
