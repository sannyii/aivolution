# AI新闻信息流

一个专注于AI领域的新闻信息流网站，每日精选10条最重要的AI新闻。

## 功能特点

- 📰 每日精选10条AI领域重大新闻
- 🌍 国际化支持（中英文切换）
- 📅 历史新闻时间线页面
- 🎨 现代化响应式设计
- 📱 移动端友好
- 🏷️ 新闻分类和标签系统
- 📊 优先级排序显示
- 💾 基于JSON文件的轻量级数据存储

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **时间线**: react-vertical-timeline-component
- **数据存储**: JSON文件（无需数据库）
- **部署**: 支持Vercel等平台

## 后端与云基础设施

- **后端服务**：`services/api` 中提供了基于 TypeScript + Express 的 API 基础工程，内置安全中间件、健康检查与 Jest 单元/集成测试。
- **云平台**：推荐部署在 AWS ECS Fargate，镜像存放至 ECR，并通过 Application Load Balancer 暴露流量。
- **持续交付**：`.github/workflows/backend-ci.yml` 会在推送后自动执行 Lint、单元测试、集成测试，并在主分支/预发布分支完成后续容器构建与 ECS 部署。

更多细节见 `docs/devops/backend-cloud.md` 与 `docs/devops/infra-aws.md`。

## 项目结构

```
src/
├── app/
│   ├── [locale]/           # 国际化路由
│   │   ├── page.tsx        # 主页面
│   │   ├── history/        # 历史新闻页面
│   │   └── layout.tsx      # 布局组件
│   ├── globals.css         # 全局样式
│   └── layout.tsx          # 根布局
├── components/
│   ├── Header.tsx          # 网站头部
│   ├── Footer.tsx          # 网站底部
│   ├── NewsCard.tsx        # 新闻卡片组件
│   ├── NewsList.tsx        # 新闻列表组件
│   └── LanguageSwitcher.tsx # 语言切换组件
├── data/
│   └── news.json           # 新闻数据存储
├── lib/
│   └── news.ts             # 新闻数据获取逻辑
├── messages/               # 国际化翻译文件
│   ├── zh.json            # 中文翻译
│   └── en.json            # 英文翻译
├── types/
│   └── news.ts             # TypeScript类型定义
├── i18n.ts                 # 国际化配置
└── middleware.ts           # 中间件配置
```

## 快速开始

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 新功能说明

### 国际化支持
- 支持中英文切换
- 使用 `next-intl` 库实现
- 所有文本内容都支持多语言
- 语言切换器位于页面右上角

### 历史新闻时间线
- 访问 `/zh/history` 或 `/en/history` 查看历史新闻
- 以时间线形式展示每日新闻
- 每天显示前3条重要新闻
- 按时间倒序排列

## 数据格式

新闻数据存储在 `src/data/news.json` 文件中，格式如下：

```json
{
  "2024-01-15": {
    "date": "2024-01-15",
    "news": [
      {
        "id": "1",
        "title": "新闻标题",
        "summary": "新闻摘要",
        "content": "新闻详细内容",
        "author": "作者",
        "publishDate": "2024-01-15T09:00:00Z",
        "category": "分类",
        "tags": ["标签1", "标签2"],
        "source": "来源",
        "sourceUrl": "原文链接",
        "imageUrl": "图片链接（可选）",
        "priority": 1
      }
    ]
  }
}
```

## 添加新新闻

1. 编辑 `src/data/news.json` 文件
2. 在对应日期下添加新的新闻条目
3. 确保每个新闻条目包含所有必需字段
4. 按优先级（priority）排序，数字越小优先级越高

## 部署

### Vercel部署

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 自动部署完成

### 其他平台

项目是标准的Next.js应用，可以部署到任何支持Node.js的平台。

### 移动端与多端 CI/CD

- `.github/workflows/mobile-ci.yml` 针对 `mobile/` 目录的 React Native 应用配置了自动化构建。
- 通过 Fastlane (`mobile/fastlane/Fastfile`) 在主分支构建完成后自动分发 TestFlight。
- 详细流程说明位于 `docs/devops/ci-cd.md`。

## 自定义配置

- 修改 `src/lib/news.ts` 来调整数据获取逻辑
- 修改 `src/components/` 中的组件来自定义UI
- 修改 `src/app/globals.css` 来自定义样式

## 许可证

MIT License