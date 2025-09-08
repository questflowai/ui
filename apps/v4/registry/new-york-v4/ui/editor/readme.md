# 更新插件步骤

## 更新components.json文件以下内容：

"tailwind": {
"config": "",
"css": "styles/plate-ui.css",
"baseColor": "neutral",
"cssVariables": true,
"prefix": ""
},
"aliases": {
"components": "@/registry/new-york-v4/ui/editor/components",
"utils": "@/lib/utils",
"ui": "@/registry/new-york-v4/ui/editor/ui",
"lib": "@/lib",
"hooks": "@@/registry/new-york-v4/ui/editor/hooks"
},

## 拷贝从Platejs官方拷贝的新增Kit命令。

比如： npx shadcn@latest add https://platejs.org/r/markdown-to-slate-demo。将命令中的shadcn@latest 改为 shadcn

## 执行命令

结束后在 @/registry/new-york-v4/ui/editor文件夹下找到对应的组件即可

# 如果可以，尽量使用单个文件拷贝的方式新增内容。这样对原项目影响较小

###

部分情况下会安装已有的组件，此时会提示是否需要覆盖，一般情况下选择不用，因为旧的组件其他的引用都是配置好的
并且，由于修改了安装目录，所以安装时检测不到已有的基础组件（button等），所以可能会新安装一些基础组件在：@/registry/new-york-v4/ui/editor/ui。如果有可以删除，改为使用项目中的组件。
例如： @/registry/new-york-v4/ui/editor/ui/separator
可以替换为 @/registry/new-york-v4/ui/separator
