import { type Registry } from "shadcn/schema"

export const blocks: Registry["items"] = [
  {
    name: "hello-world",
    type: "registry:block",
    files: [
      {
        path: "blocks/hello-world/hello-world.tsx",
        type: "registry:block",
        target: "components/hello-world/hello-world.tsx",
      },
      {
        path: "blocks/hello-world/components/hello.tsx",
        type: "registry:component",
        target: "components/hello-world/components/hello.tsx",
      },
      {
        path: "blocks/hello-world/components/world.tsx",
        type: "registry:block",
        target: "components/hello-world/components/world.tsx",
      },
      {
        path: "blocks/hello-world/lib.ts",
        type: "registry:lib",
        target: "components/hello-world/lib.ts",
      },
      {
        path: "blocks/hello-world/test-hook.ts",
        type: "registry:hook",
        target: "components/hello-world/test-hook.ts",
      },
      {
        path: "blocks/hello-world/test.json",
        type: "registry:file",
        target: "components/hello-world/test.json",
      },
      {
        path: "blocks/hello-world/page.tsx",
        type: "registry:page",
        target: "components/hello-world/page.tsx",
      },
    ],
    dependencies: ["lucide-react"],
    registryDependencies: ["button"],
  },
  {
    name: "calendar-01",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-01.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-02",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-02.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-03",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-03.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-04",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-04.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-05",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-05.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-06",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-06.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-07",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-07.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-08",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-08.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-09",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-09.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-10",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-10.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "card"],
  },
  {
    name: "calendar-11",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-11.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-12",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-12.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "react-day-picker/locale",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "card", "select"],
  },
  {
    name: "calendar-13",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-13.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "label", "select"],
  },
  {
    name: "calendar-14",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-14.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-15",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-15.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-16",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-16.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "card", "input", "label"],
  },
  {
    name: "calendar-17",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-17.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "card", "input", "label"],
  },
  {
    name: "calendar-18",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-18.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-19",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-19.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "date-fns",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "card"],
  },
  {
    name: "calendar-20",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-20.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "card"],
  },
  {
    name: "calendar-21",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-21.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar"],
  },
  {
    name: "calendar-22",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-22.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "label", "popover"],
  },
  {
    name: "calendar-23",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-23.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "label", "popover"],
  },
  {
    name: "calendar-24",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-24.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "input", "label", "popover"],
  },
  {
    name: "calendar-25",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-25.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "input", "label", "popover"],
  },
  {
    name: "calendar-26",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-26.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "input", "label", "popover"],
  },
  {
    name: "calendar-27",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-27.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "recharts",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "card", "chart", "popover"],
  },
  {
    name: "calendar-28",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-28.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "input", "label", "popover"],
  },
  {
    name: "calendar-29",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-29.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "chrono-node",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "input", "label", "popover"],
  },
  {
    name: "calendar-30",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-30.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "little-date",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "label", "popover"],
  },
  {
    name: "calendar-31",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-31.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "little-date",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
    ],
    registryDependencies: ["button", "calendar", "card"],
  },
  {
    name: "calendar-32",
    type: "registry:block",
    files: [
      {
        path: "blocks/calendar-32.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "react-day-picker",
      "tailwind-merge",
      "vaul",
    ],
    registryDependencies: ["button", "calendar", "drawer", "label"],
  },
  {
    name: "editor",
    type: "registry:block",
    files: [
      {
        path: "blocks/editor/index.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/index.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/editor-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/ai-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/align-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/autoformat-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/basic-blocks-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/basic-marks-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/block-menu-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/block-placeholder-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/callout-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/code-block-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/column-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/comment-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/cursor-overlay-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/date-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/discussion-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/dnd-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/docx-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/emoji-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/exit-break-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/fixed-toolbar-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/floating-toolbar-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/font-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/line-height-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/link-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/list-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/markdown-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/math-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/media-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/mention-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/slash-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/suggestion-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/table-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/toc-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/toggle-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/ai-menu.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/ai-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/blockquote-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/heading-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/hr-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/paragraph-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/code-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/highlight-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/kbd-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/block-context-menu.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/block-selection-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/callout-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/code-block-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/column-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/comment-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/cursor-overlay.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/date-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/block-discussion.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/comment.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/block-draggable.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/emoji-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/fixed-toolbar.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/fixed-toolbar-buttons.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/floating-toolbar.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/floating-toolbar-buttons.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/link-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/link-toolbar.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/indent-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/block-list.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/equation-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-audio-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-embed-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-file-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-image-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-placeholder-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-preview-dialog.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-upload-toast.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-video-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/mention-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/slash-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/block-suggestion.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/suggestion-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/table-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/toc-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/toggle-node.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/use-chat.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/command.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/ai-chat-editor.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/hooks/use-is-touch-device.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/context-menu.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/block-selection.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/emoji-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/editor.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/hooks/use-debounce.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/inline-combobox.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/toolbar.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/ai-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/align-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/comment-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/export-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/font-color-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/font-size-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/history-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/import-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/indent-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/insert-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/line-height-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/link-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/list-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/mark-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/mode-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/more-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/table-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/toggle-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/turn-into-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/equation-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/suggestion-toolbar-button.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/caption.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-toolbar.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/resize-handle.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/hooks/use-upload-file.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor/hooks/use-mounted.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/transforms.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/table-icons.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/editor-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/editor-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/align-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/basic-blocks-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/basic-marks-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/callout-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/code-block-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/column-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/comment-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/date-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/font-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/line-height-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/link-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/list-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/math-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/media-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/mention-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/suggestion-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/table-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/toc-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/toggle-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/blockquote-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/heading-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/hr-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/paragraph-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/code-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/highlight-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/kbd-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/callout-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/code-block-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/column-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/comment-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/date-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/link-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/components/editor/plugins/indent-base-kit.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/block-list-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/equation-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-audio-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-file-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-image-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/media-video-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/mention-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/suggestion-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/table-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/toc-node-static.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor/ui/toggle-node-static.tsx",
        type: "registry:block",
      },
    ],
    dependencies: [
      "@ai-sdk/react",
      "@ariakit/react",
      "@emoji-mart/data",
      "@faker-js/faker",
      "@platejs/ai",
      "@platejs/ai/react",
      "@platejs/autoformat",
      "@platejs/basic-nodes",
      "@platejs/basic-nodes/react",
      "@platejs/basic-styles",
      "@platejs/basic-styles/react",
      "@platejs/callout",
      "@platejs/callout/react",
      "@platejs/caption",
      "@platejs/caption/react",
      "@platejs/code-block",
      "@platejs/code-block/react",
      "@platejs/combobox",
      "@platejs/combobox/react",
      "@platejs/comment",
      "@platejs/comment/react",
      "@platejs/date",
      "@platejs/date/react",
      "@platejs/dnd",
      "@platejs/docx",
      "@platejs/emoji",
      "@platejs/emoji/react",
      "@platejs/floating",
      "@platejs/indent",
      "@platejs/indent/react",
      "@platejs/juice",
      "@platejs/layout",
      "@platejs/layout/react",
      "@platejs/link",
      "@platejs/link/react",
      "@platejs/list",
      "@platejs/list/react",
      "@platejs/markdown",
      "@platejs/math",
      "@platejs/math/react",
      "@platejs/media",
      "@platejs/media/react",
      "@platejs/mention",
      "@platejs/mention/react",
      "@platejs/resizable",
      "@platejs/selection/react",
      "@platejs/slash-command/react",
      "@platejs/suggestion",
      "@platejs/suggestion/react",
      "@platejs/table",
      "@platejs/table/react",
      "@platejs/toc",
      "@platejs/toc/react",
      "@platejs/toggle",
      "@platejs/toggle/react",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-toolbar",
      "@radix-ui/react-tooltip",
      "@udecode/cn",
      "@uploadthing/react",
      "ai/react",
      "class-variance-authority",
      "clsx",
      "cmdk",
      "date-fns",
      "lodash/debounce.js",
      "lowlight",
      "lucide-react",
      "platejs",
      "platejs/react",
      "react",
      "react-day-picker",
      "react-dnd",
      "react-dnd-html5-backend",
      "react-lite-youtube-embed",
      "react-player",
      "react-textarea-autosize",
      "react-tweet",
      "remark-gfm",
      "remark-math",
      "sonner",
      "tailwind-merge",
      "uploadthing/next",
      "uploadthing/types",
      "use-file-picker",
      "zod",
    ],
    registryDependencies: [
      "alert-dialog",
      "avatar",
      "button",
      "calendar",
      "checkbox",
      "dialog",
      "dropdown-menu",
      "input",
      "popover",
      "separator",
      "tooltip",
    ],
  },
]
