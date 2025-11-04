import { type Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
  {
    name: "accordion",
    type: "registry:ui",
    files: [
      {
        path: "ui/accordion.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-accordion",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "alert",
    type: "registry:ui",
    files: [
      {
        path: "ui/alert.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "class-variance-authority",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "alert-dialog",
    type: "registry:ui",
    files: [
      {
        path: "ui/alert-dialog.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "aspect-ratio",
    type: "registry:ui",
    files: [
      {
        path: "ui/aspect-ratio.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["@radix-ui/react-aspect-ratio"],
  },
  {
    name: "avatar",
    type: "registry:ui",
    files: [
      {
        path: "ui/avatar.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["@radix-ui/react-avatar", "clsx", "react", "tailwind-merge"],
  },
  {
    name: "badge",
    type: "registry:ui",
    files: [
      {
        path: "ui/badge.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    files: [
      {
        path: "ui/breadcrumb.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    files: [
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "button-group",
    type: "registry:ui",
    registryDependencies: ["button", "separator"],
    files: [
      {
        path: "ui/button-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "calendar",
    type: "registry:ui",
    files: [
      {
        path: "ui/calendar.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/button.tsx",
        type: "registry:ui",
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
  },
  {
    name: "card",
    type: "registry:ui",
    files: [
      {
        path: "ui/card.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["clsx", "react", "tailwind-merge"],
  },
  {
    name: "carousel",
    type: "registry:ui",
    files: [
      {
        path: "ui/carousel.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "embla-carousel-react",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "chart",
    type: "registry:ui",
    files: [
      {
        path: "ui/chart.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["clsx", "react", "recharts", "tailwind-merge"],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    files: [
      {
        path: "ui/checkbox.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-checkbox",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "collapsible",
    type: "registry:ui",
    files: [
      {
        path: "ui/collapsible.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["@radix-ui/react-collapsible"],
  },
  {
    name: "command",
    type: "registry:ui",
    files: [
      {
        path: "ui/command.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/dialog.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-dialog",
      "clsx",
      "cmdk",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "context-menu",
    type: "registry:ui",
    files: [
      {
        path: "ui/context-menu.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-context-menu",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "dialog",
    type: "registry:ui",
    files: [
      {
        path: "ui/dialog.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-dialog",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "drawer",
    type: "registry:ui",
    files: [
      {
        path: "ui/drawer.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["clsx", "react", "tailwind-merge", "vaul"],
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    files: [
      {
        path: "ui/dropdown-menu.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-dropdown-menu",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "empty",
    type: "registry:ui",
    files: [
      {
        path: "ui/empty.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "field",
    type: "registry:ui",
    registryDependencies: ["label", "separator"],
    files: [
      {
        path: "ui/field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "form",
    type: "registry:ui",
    files: [
      {
        path: "ui/form.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/label.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "clsx",
      "react",
      "react-hook-form",
      "tailwind-merge",
    ],
  },
  {
    name: "hover-card",
    type: "registry:ui",
    files: [
      {
        path: "ui/hover-card.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-hover-card",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    files: [
      {
        path: "ui/input.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["clsx", "react", "tailwind-merge"],
  },
  {
    name: "input-group",
    type: "registry:ui",
    registryDependencies: ["button", "input", "textarea"],
    files: [
      {
        path: "ui/input-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input-otp",
    type: "registry:ui",
    files: [
      {
        path: "ui/input-otp.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "clsx",
      "input-otp",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "item",
    type: "registry:ui",
    registryDependencies: ["separator"],
    files: [
      {
        path: "ui/item.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "label",
    type: "registry:ui",
    files: [
      {
        path: "ui/label.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["@radix-ui/react-label", "clsx", "react", "tailwind-merge"],
  },
  {
    name: "menubar",
    type: "registry:ui",
    files: [
      {
        path: "ui/menubar.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-menubar",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "navigation-menu",
    type: "registry:ui",
    files: [
      {
        path: "ui/navigation-menu.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-navigation-menu",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "pagination",
    type: "registry:ui",
    files: [
      {
        path: "ui/pagination.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "popover",
    type: "registry:ui",
    files: [
      {
        path: "ui/popover.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-popover",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "progress",
    type: "registry:ui",
    files: [
      {
        path: "ui/progress.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-progress",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    files: [
      {
        path: "ui/radio-group.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-radio-group",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "resizable",
    type: "registry:ui",
    files: [
      {
        path: "ui/resizable.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "clsx",
      "lucide-react",
      "react",
      "react-resizable-panels",
      "tailwind-merge",
    ],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    files: [
      {
        path: "ui/scroll-area.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-scroll-area",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    files: [
      {
        path: "ui/select.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-select",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    files: [
      {
        path: "ui/separator.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-separator",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "sheet",
    type: "registry:ui",
    files: [
      {
        path: "ui/sheet.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-dialog",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "sidebar",
    type: "registry:ui",
    files: [
      {
        path: "ui/sidebar.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/input.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/separator.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/sheet.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/skeleton.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-tooltip",
      "class-variance-authority",
      "clsx",
      "lucide-react",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    files: [
      {
        path: "ui/skeleton.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
  },
  {
    name: "slider",
    type: "registry:ui",
    files: [
      {
        path: "ui/slider.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["@radix-ui/react-slider", "clsx", "react", "tailwind-merge"],
  },
  {
    name: "sonner",
    type: "registry:ui",
    files: [
      {
        path: "ui/sonner.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["next-themes", "sonner"],
  },
  {
    name: "spinner",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "ui/spinner.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    files: [
      {
        path: "ui/switch.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["@radix-ui/react-switch", "clsx", "react", "tailwind-merge"],
  },
  {
    name: "table",
    type: "registry:ui",
    files: [
      {
        path: "ui/table.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["clsx", "react", "tailwind-merge"],
  },
  {
    name: "tabs",
    type: "registry:ui",
    files: [
      {
        path: "ui/tabs.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["@radix-ui/react-tabs", "clsx", "react", "tailwind-merge"],
  },
  {
    name: "textarea",
    type: "registry:ui",
    files: [
      {
        path: "ui/textarea.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: ["clsx", "react", "tailwind-merge"],
  },
  {
    name: "toggle",
    type: "registry:ui",
    files: [
      {
        path: "ui/toggle.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-toggle",
      "class-variance-authority",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "toggle-group",
    type: "registry:ui",
    files: [
      {
        path: "ui/toggle-group.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/toggle.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "class-variance-authority",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    files: [
      {
        path: "ui/tooltip.tsx",
        type: "registry:ui",
      },
    ],
    dependencies: [
      "@radix-ui/react-tooltip",
      "clsx",
      "react",
      "tailwind-merge",
    ],
  },
  {
    name: "toaster",
    type: "registry:ui",
    files: [
      {
        path: "ui/toaster.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "kbd",
    type: "registry:ui",
    files: [
      {
        path: "ui/kbd.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "native-select",
    type: "registry:ui",
    files: [
      {
        path: "ui/native-select.tsx",
        type: "registry:ui",
      },
    ],
  },
]
