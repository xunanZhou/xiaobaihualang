**前端：**
3个核心功能: 
1. prompt输入框
2. 单选艺术风格，艺术风格可不选
3. 创作灵感，直接填充prompt到

点击“生成图片"按钮时，触发调用api生成图片功能
前端校验
1. prompt不可为空，否则提示“必须输入提示词”
2. 艺术风格可以不选

前端API逻辑
1. 首先调用createtask云函数, 创建task成功时，展示进度条 (生成图片旁边显示数字百分比进度)，如果创建task失败则直接报错
2. 页面加载30秒，如果加载30秒内获得图片，则打开create-success页面，展示图片，如果没有30秒内轮询成功则提示“图片生成中，个人画廊查看”， 允许用户再次生成图片

**云函数逻辑**
1. 云函数imageGeneration按照名字路由创建四个功能 
   1. generateTask
   2. queryTask
   3. saveImage
   4. getUserHistory
2. queryTask 是异步轮询api, 一直轮询，每5秒轮询一次，轮询1分钟，如果超过1分钟，则提示轮询结果失败
3. saveImage: 轮询图片成功后将图片保存到数据库 artworks, 最重要的是imageurl存到collections然后回给前端
4. getUserHistory: 在profile页打开个人画廊时调用getUserHistory，查看数据现状