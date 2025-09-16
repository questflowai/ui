import { execSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { createInterface } from "node:readline"

// Load environment variables from .env file
async function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env")
    const envContent = await fs.readFile(envPath, "utf-8")

    for (const line of envContent.split("\n")) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=")
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=")
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      }
    }
  } catch (error) {
    // .env file doesn't exist or can't be read, that's okay
  }
}

interface MenuOption {
  key: string
  title: string
  description: string
  command: string
  requiresEnv?: boolean
}

const MENU_OPTIONS: MenuOption[] = [
  {
    key: "1",
    title: "检查环境配置",
    description: "检查 CDN 上传所需的环境变量",
    command: "tsx scripts/check-env.ts",
    requiresEnv: false
  },
  {
    key: "2",
    title: "构建 UI 组件",
    description: "构建所有 UI 组件、样式和清单文件",
    command: "tsx scripts/build-ui.ts",
    requiresEnv: false
  },
  {
    key: "3",
    title: "完整发布",
    description: "构建并上传所有文件到 CDN",
    command: "tsx scripts/release.ts",
    requiresEnv: true
  },
  {
    key: "4",
    title: "只上传 CSS",
    description: "只上传样式文件",
    command: "tsx scripts/selective-upload.ts --css-only",
    requiresEnv: true
  },
  {
    key: "5",
    title: "只上传 UI 组件",
    description: "只上传基础 UI 组件",
    command: "tsx scripts/selective-upload.ts --ui-only",
    requiresEnv: true
  },
  {
    key: "6",
    title: "只上传 Blocks",
    description: "只上传复杂组件块",
    command: "tsx scripts/selective-upload.ts --blocks-only",
    requiresEnv: true
  },
  {
    key: "7",
    title: "只上传 Charts",
    description: "只上传图表组件",
    command: "tsx scripts/selective-upload.ts --charts-only",
    requiresEnv: true
  },
  {
    key: "8",
    title: "只上传 Hooks",
    description: "只上传 React hooks",
    command: "tsx scripts/selective-upload.ts --hooks-only",
    requiresEnv: true
  },
  {
    key: "9",
    title: "只上传 Lib",
    description: "只上传工具函数库",
    command: "tsx scripts/selective-upload.ts --lib-only",
    requiresEnv: true
  },
  {
    key: "10",
    title: "基础组件包",
    description: "上传基础 UI 组件预设包",
    command: "tsx scripts/selective-upload.ts --preset=essential-ui",
    requiresEnv: true
  },
  {
    key: "11",
    title: "仪表板组件包",
    description: "上传仪表板应用组件预设包",
    command: "tsx scripts/selective-upload.ts --preset=dashboard-components",
    requiresEnv: true
  },
  {
    key: "12",
    title: "自定义上传",
    description: "使用自定义参数进行选择性上传",
    command: "custom",
    requiresEnv: true
  },
  {
    key: "13",
    title: "干运行模式",
    description: "查看会上传什么文件（不实际上传）",
    command: "tsx scripts/selective-upload.ts --dry-run",
    requiresEnv: false
  }
]

function createReadlineInterface() {
  return createInterface({
    input: process.stdin,
    output: process.stdout
  })
}

function printHeader() {
  console.log("╔══════════════════════════════════════════════════════════════╗")
  console.log("║                    🚀 UI 组件管理工具                        ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")
  console.log("")
}

function printMenu() {
  console.log("请选择操作：")
  console.log("")

  MENU_OPTIONS.forEach(option => {
    const envIcon = option.requiresEnv ? "🔐" : "📋"
    console.log(`${envIcon} ${option.key.padStart(2)}: ${option.title}`)
    console.log(`     ${option.description}`)
    console.log("")
  })

  console.log("🚪  0: 退出")
  console.log("")
  console.log("💡 提示: 🔐 表示需要环境变量配置，📋 表示不需要")
  console.log("")
}

async function checkEnvironment(): Promise<boolean> {
  try {
    execSync("tsx scripts/check-env.ts", { stdio: "pipe" })
    return true
  } catch {
    return false
  }
}

async function handleCustomUpload(): Promise<string> {
  const rl = createReadlineInterface()

  console.log("\n🛠️  自定义上传配置")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const options: string[] = []

  // 类别选择
  console.log("\n📂 选择类别 (可多选，用逗号分隔，留空跳过):")
  console.log("   ui, blocks, charts, hooks, lib, examples")

  const categories = await new Promise<string>((resolve) => {
    rl.question("类别: ", resolve)
  })

  if (categories.trim()) {
    const cats = categories.split(",").map(c => c.trim())
    cats.forEach(cat => {
      if (["ui", "blocks", "charts", "hooks", "lib", "examples"].includes(cat)) {
        options.push(`--${cat}-only`)
      }
    })
  }

  // 具体组件选择
  console.log("\n🎯 指定具体组件 (可选，用逗号分隔):")

  const components = await new Promise<string>((resolve) => {
    rl.question("组件名称: ", resolve)
  })

  if (components.trim()) {
    options.push(`--components=${components.trim()}`)
  }

  // 排除模式
  console.log("\n🚫 排除模式 (可选，支持通配符 *):")

  const exclude = await new Promise<string>((resolve) => {
    rl.question("排除模式: ", resolve)
  })

  if (exclude.trim()) {
    options.push(`--exclude=${exclude.trim()}`)
  }

  // 预设选择
  console.log("\n📦 或选择预设 (可选):")
  console.log("   essential-ui, dashboard-components, css-only, charts-complete")

  const preset = await new Promise<string>((resolve) => {
    rl.question("预设名称: ", resolve)
  })

  if (preset.trim()) {
    options.push(`--preset=${preset.trim()}`)
  }

  rl.close()

  if (options.length === 0) {
    console.log("❌ 没有选择任何选项")
    return ""
  }

  return `tsx scripts/selective-upload.ts ${options.join(" ")}`
}

async function executeCommand(command: string): Promise<boolean> {
  try {
    console.log(`\n🔄 执行命令: ${command}`)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    execSync(command, { stdio: "inherit" })

    console.log("\n✅ 命令执行成功!")
    return true
  } catch (error) {
    console.log("\n❌ 命令执行失败!")
    console.error(error)
    return false
  }
}

async function main() {
  // Load environment variables from .env file
  await loadEnvFile()

  printHeader()

  // Check if .env file exists
  try {
    await fs.access(path.join(process.cwd(), ".env"))
  } catch {
    console.log("⚠️  未找到 .env 文件")
    console.log("💡 请复制 .env.example 为 .env 并配置你的环境变量")
    console.log("")
  }

  const rl = createReadlineInterface()

  while (true) {
    printMenu()

    const choice = await new Promise<string>((resolve) => {
      rl.question("请输入选项编号: ", resolve)
    })

    if (choice === "0") {
      console.log("👋 再见!")
      break
    }

    const option = MENU_OPTIONS.find(opt => opt.key === choice)

    if (!option) {
      console.log("❌ 无效选项，请重新选择")
      console.log("")
      continue
    }

    // Check environment if required
    if (option.requiresEnv) {
      console.log("\n🔍 检查环境配置...")
      const envOk = await checkEnvironment()

      if (!envOk) {
        console.log("❌ 环境配置不完整，请先配置环境变量")
        console.log("💡 选择选项 1 查看详细配置指南")
        console.log("")
        continue
      }
      console.log("✅ 环境配置正确")
    }

    let command = option.command

    // Handle custom upload
    if (command === "custom") {
      command = await handleCustomUpload()
      if (!command) {
        continue
      }
    }

    const success = await executeCommand(command)

    if (success) {
      console.log("\n🎉 操作完成!")
    } else {
      console.log("\n💔 操作失败，请检查错误信息")
    }

    console.log("\n" + "=".repeat(60))

    // Ask if user wants to continue
    const continueChoice = await new Promise<string>((resolve) => {
      rl.question("按 Enter 继续，或输入 'q' 退出: ", resolve)
    })

    if (continueChoice.toLowerCase() === "q") {
      console.log("👋 再见!")
      break
    }

    console.clear()
    printHeader()
  }

  rl.close()
}

main().catch(error => {
  console.error("❌ 程序执行出错:", error)
  process.exit(1)
})
