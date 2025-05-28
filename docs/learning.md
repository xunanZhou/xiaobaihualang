# 项目结构
miniprogram/
├── app.json     ← 全局配置
├── app.ts       ← 全局逻辑  
├── app.wxss     ← 全局样式 (正确)
├── pages/
│   ├── home/
│   │   ├── home.wxml
│   │   ├── home.wxss  ← 页面样式
│   │   ├── home.ts
│   │   └── home.json
└── miniprogram_npm/
    └── tdesign-miniprogram/  ← npm包


# Dependency 管理
1. package.json的dependency里管理全局依赖，比如TDesign包(不需要专门在app.wxss里专门再import的了，因为npm安装好后，通过package.json声明的依赖，app会自己去找这个包)
2. app.json里管理需要从这个包里引入的elements, 比如button, icon, image, input等控件
