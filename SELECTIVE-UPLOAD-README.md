# 选择性 CDN 上传系统

这个系统允许你只上传部分文件到 CDN，而不是每次都上传所有文件。支持按类别、具体组件或预设配置进行选择性上传。

## 🚀 快速开始

### 1. 环境配置

复制环境变量模板并配置：

```bash
cp .env.example .env
# 编辑 .env 文件，配置你的 CDN 信息
```

### 2. 使用统一管理界面

```bash
npm run ui
```

这会启动一个交互式菜单，你可以选择不同的操作：

- ✅ 检查环境配置
- 🔨 构建 UI 组件
- 🚀 完整发布
- 🎨 只上传 CSS
- 📦 只上传特定类别（UI、Blocks、Charts、Hooks、Lib）
- 🎯 使用预设配置
- 🛠️ 自定义上传
- 👀 干运行模式

## 📋 命令行使用

### 基本用法

```bash
# 只上传 CSS 文件
npm run upload:css

# 只上传 UI 组件
npm run upload:ui

# 只上传 blocks
npm run upload:blocks

# 只上传配置文件
npx tsx scripts/selective-upload.ts --manifests-only      # 只上传 manifest.json
npx tsx scripts/selective-upload.ts --importmap-only      # 只上传 importmap.json
npx tsx scripts/selective-upload.ts --config-files-only   # 上传所有配置文件

# 使用预设配置
npm run upload:essential    # 基础组件包
npm run upload:dashboard    # 仪表板组件包
npx tsx scripts/selective-upload.ts --preset=manifests-only     # 只上传 manifest 文件
npx tsx scripts/selective-upload.ts --preset=config-files-only  # 上传所有配置文件

# 干运行（查看会上传什么，但不实际上传）
npm run upload:dry-run
```

### 高级用法

```bash
# 上传特定组件
npm run upload -- --components=button,card,input

# 上传特定 blocks，排除某些组件
npm run upload -- --blocks=calendar-01,dashboard-01 --exclude=sidebar-*

# 组合多个类别
npm run upload -- --ui-only --hooks-only --lib-only
```

## 🔧 环境变量配置

### 必需变量

```bash
CDN_STRATEGY=s3  # 或 r2, gcs
CDN_BASE_URL=https://cdn.example.com
```

### AWS S3 配置

```bash
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Cloudflare R2 配置

```bash
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=auto
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_FORCE_PATH_STYLE=true
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Google Cloud Storage 配置

```bash
GCS_BUCKET=your-gcs-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_PROJECT_ID=your-project-id
```

## 📦 预设配置

- **essential-ui**: 基础 UI 组件（button, card, input 等）
- **dashboard-components**: 仪表板应用组件（包含 UI、blocks、charts）
- **css-only**: 只上传 CSS 文件
- **charts-complete**: 完整的图表组件包
- **manifests-only**: 只上传 manifest.json 配置文件
- **importmap-only**: 只上传 importmap.json 配置文件
- **config-files-only**: 上传所有配置文件（manifest.json 和 importmap.json）

## 🛠️ 自定义预设

在 `upload-config.json` 中添加自定义预设：

```json
{
  "presets": {
    "my-preset": {
      "name": "my-preset",
      "description": "我的自定义组件集",
      "categories": ["ui", "hooks"],
      "components": ["button", "input"],
      "exclude": ["deprecated-*"]
    }
  }
}
```

## 📚 使用场景

### 场景 1: 只更新了样式
```bash
npm run upload:css
```

### 场景 2: 添加了新的 UI 组件
```bash
npm run upload -- --components=new-component
```

### 场景 3: 更新仪表板相关功能
```bash
npm run upload:dashboard
```

### 场景 4: 测试上传内容
```bash
npm run upload:dry-run -- --ui-only
```

## 🔍 故障排除

### 检查环境配置
```bash
npm run check-env
npm run check-env -- --help  # 查看配置指南
```

### 查看构建文件
```bash
npm run build:ui
ls -la build/
```

### 使用交互式界面
```bash
npm run ui  # 最简单的方式
```

## 💡 优势

- **更快的部署**: 只上传变更的文件
- **节省带宽**: 减少不必要的文件传输
- **灵活的工作流**: 支持不同的部署策略
- **环境安全**: 自动加载 .env 文件
- **交互友好**: 提供统一的管理界面
