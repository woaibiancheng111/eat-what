# 中午吃什么？

一个原生微信小程序 MVP，用来解决“中午不知道吃什么”的日常纠结。

## 当前功能

- 首页一键推荐 / 重抽
- 午餐库新增、编辑、搜索
- 按预算 / 距离 / 标签筛选
- 标记“今天就吃这个”
- 本地存储，关闭后数据仍保留
- Node 纯逻辑测试

## 项目结构

```text
miniprogram/
  app.js
  app.json
  app.wxss
  pages/
    index/
    options/
    meal-form/
    filters/
    settings/
  services/
    recommend.js
  utils/
    default-data.js
    storage.js
tests/
  recommend.test.js
  storage.test.js
project.config.json
project.private.config.json
package.json
```

## 运行方式

### 方式一：微信开发者工具运行

1. 打开微信开发者工具
2. 选择“导入项目”
3. 项目目录选择：`D:/WORKS/eat-what`
4. AppID 使用当前项目里的 `touristappid` 即可用于本地调试
5. 导入后直接编译运行

### 方式二：命令行运行测试

在项目根目录执行：

```bash
npm test
```

当前测试覆盖：
- 推荐逻辑
- 本地存储逻辑

## 页面说明

### 首页
- 路径：`miniprogram/pages/index/index`
- 功能：展示推荐结果、进入筛选、记录今天吃了什么

### 午餐库
- 路径：`miniprogram/pages/options/index`
- 功能：查看午餐项、搜索、进入新增/编辑

### 新增/编辑页
- 路径：`miniprogram/pages/meal-form/index`
- 功能：维护单个午餐项

### 筛选页
- 路径：`miniprogram/pages/filters/index`
- 功能：按预算、距离、标签和开关条件筛选

### 设置页
- 路径：`miniprogram/pages/settings/index`
- 功能：配置推荐方式、清空历史记录

## 数据说明

当前版本为本地单机版，不依赖后端。

本地存储内容包括：
- 午餐项列表
- 筛选条件
- 设置项
- 历史记录

首次进入会根据设置决定是否注入示例数据。

## 开发说明

### 推荐逻辑
核心文件：`miniprogram/services/recommend.js`

包含：
- `filterMeals`：筛选候选项
- `getMealScore`：计算推荐分数
- `pickMeal`：随机 / 加权随机选择
- `buildRecommendation`：组合推荐结果

### 存储逻辑
核心文件：`miniprogram/utils/storage.js`

负责：
- 读取本地缓存
- 初始化默认设置
- 保存午餐项 / 筛选 / 设置 / 历史

## 注意事项

- 当前是原生微信小程序，不是 Taro / uni-app
- 当前没有接入云开发或后端服务
- 当前 tab 只有：首页、午餐库、设置
- 筛选页通过页面跳转进入，不在 tab 中

## 后续可扩展方向

- 更智能的“最近没吃优先”推荐策略
- 更细的价格和距离模型
- 首页增加历史洞察与统计
- 云端同步
- 分享给同事一起抽
- 给午餐项增加真实图片

## 常见问题

### 1. 为什么 `npm test` 报错？
先确认根目录 `package.json` 是合法 JSON，没有多余字符。

### 2. 为什么真机和开发者工具显示不同？
优先检查：
- 基础库版本
- 组件默认样式差异
- 文本换行和按钮高度

### 3. 数据会丢吗？
不会，正常保存在小程序本地存储里；但如果你清缓存或卸载小程序，本地数据会消失。
