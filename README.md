# AI画廊小程序

一个基于微信小程序原生框架开发的AI艺术创作平台，使用TDesign组件库构建现代化的用户界面。

## 项目特色

- 🎨 **AI艺术创作** - 通过文字描述生成精美的艺术作品
- 🏛️ **作品画廊** - 浏览和分享社区创作的艺术作品
- 👤 **个人中心** - 管理个人作品和创作历程
- 📱 **现代化UI** - 基于TDesign组件库的精美界面设计
- 🔧 **TypeScript** - 完整的类型安全支持

## 技术栈

- **框架**: 微信小程序原生框架
- **语言**: TypeScript
- **UI组件库**: TDesign for 小程序
- **样式**: SCSS/WXSS
- **状态管理**: 小程序原生globalData

## 项目结构

```
miniprogram/
├── app.json                 # 小程序配置文件
├── app.ts                   # 小程序入口文件
├── app.scss                 # 全局样式文件
├── pages/                   # 页面目录
│   ├── home/               # 首页 - 作品浏览
│   │   ├── home.wxml
│   │   ├── home.ts
│   │   ├── home.wxss
│   │   └── home.json
│   ├── create/             # 创作页面 - AI生成
│   │   ├── create.wxml
│   │   ├── create.ts
│   │   ├── create.wxss
│   │   └── create.json
│   ├── create-success/     # 创作成功页面
│   │   ├── create-success.wxml
│   │   ├── create-success.ts
│   │   ├── create-success.wxss
│   │   └── create-success.json
│   ├── profile/            # 个人中心
│   │   ├── profile.wxml
│   │   ├── profile.ts
│   │   ├── profile.wxss
│   │   └── profile.json
│   └── test/               # 测试页面
│       ├── test.wxml
│       ├── test.ts
│       ├── test.wxss
│       └── test.json
├── components/             # 自定义组件
├── utils/                  # 工具函数
└── miniprogram_npm/        # npm包目录
```

## 页面功能

### 🏠 首页 (home)
- 瀑布流展示AI艺术作品
- 作品点赞和收藏功能
- 用户头像和创作信息
- 搜索和筛选功能

### 🎨 创作页面 (create)
- 文字描述输入
- 艺术风格选择
- 高级参数设置
- 实时生成预览

### ✅ 创作成功页面 (create-success)
- 作品发布成功提示
- 统计数据展示
- 分享功能
- 继续创作引导

### 👤 个人中心 (profile)
- 登录/未登录状态切换
- 用户信息展示
- 个人作品画廊
- 成就系统
- 快捷操作入口

### 🧪 测试页面 (test)
- 组件功能测试
- 页面导航测试
- 系统信息展示
- 功能验证工具

## 开发环境

### 前置要求
- 微信开发者工具
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
cd miniprogram
npm install
```

### 开发调试
1. 使用微信开发者工具打开项目
2. 选择 `miniprogram` 目录作为项目根目录
3. 点击编译运行

### 构建发布
```bash
npm run build
```

## 组件库使用

项目使用 [TDesign 小程序组件库](https://tdesign.tencent.com/miniprogram/overview)，主要使用的组件包括：

- `t-button` - 按钮组件
- `t-dialog` - 对话框组件
- `t-tag` - 标签组件
- `t-avatar` - 头像组件
- `t-icon` - 图标组件
- `t-image` - 图片组件
- `t-toast` - 提示组件

## 设计特色

### 🎨 视觉设计
- 渐变色彩搭配
- 圆角卡片设计
- 阴影层次效果
- 响应式布局

### 🔄 交互体验
- 平滑过渡动画
- 触摸反馈效果
- 加载状态提示
- 错误处理机制

### 📱 适配支持
- 多设备尺寸适配
- 深色模式支持
- 安全区域适配
- 横竖屏兼容

## 开发规范

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 统一的命名约定
- 完整的注释文档

### 文件命名
- 页面文件：`kebab-case`
- 组件文件：`PascalCase`
- 工具函数：`camelCase`
- 样式文件：与对应文件同名

### Git 提交
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建工具或辅助工具的变动
```

## 部署说明

### 小程序发布
1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 登录微信公众平台提交审核
4. 审核通过后发布上线

### 版本管理
- 开发版本：用于开发调试
- 体验版本：用于内部测试
- 正式版本：用于线上发布

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目地址：[GitHub Repository]
- 问题反馈：[Issues]
- 邮箱：[your-email@example.com]

---

**AI画廊小程序** - 让创意无限可能 🎨✨ 