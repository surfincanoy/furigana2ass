# 日语字幕振假名生成 & 双语字幕合并

Electron 桌面工具，提供两个功能：
- **注音转换**：将 SRT/ASS 字幕转换为 ASS 格式，自动为日文汉字标注振假名（furigana），生成 Aegisub 卡拉 OK 模板
- **双语合并**：将两个字幕文件按行合并为双语字幕（如中文 + 英文）

<div style="border-left: 4px solid #ffa500; background: #2d2d2d; padding: 10px 16px; color: #ffcc66;">

**注意**：本程序不保证振假名的正确性，如需要更改字幕文本，比如字体大小，纠正振假名错误等，请在应用卡拉 OK 模板前更改。

</div>

## 前置要求

安装 **Node.js**（>= 18）和 **npm**：

- 官网下载：https://nodejs.org/
- 验证安装：`node --version` → 应显示 v18.x 或更高
- 验证安装：`npm --version` → 应显示 9.x 或更高

## 安装依赖

```bash
npm install
```

### 运行时依赖

| 包名 | 作用 |
|------|------|
| `kuroshiro` | 日文汉字转振假名核心引擎 |
| `kuroshiro-analyzer-kuromoji` | 日文分词和读音提取（内置 kuromoji.js 离线词典） |

### 开发依赖

| 包名 | 作用 |
|------|------|
| `electron` | 桌面 GUI 框架 |
| `electron-builder` | 打包构建工具 |

### 注意事项

- 首次安装 Electron 较慢（~120MB），中国大陆用户可设镜像：
  ```bash
  export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
  ```
- `node_modules/` 不要提交到 GitHub

## 运行

```bash
npm start
```

## 构建

```bash
# Windows 单文件 exe（需 wine64 或 Windows）
npx electron-builder --win portable

# Linux AppImage
npx electron-builder --linux appimage

# Linux deb
npx electron-builder --linux deb
```

输出在 `dist/` 目录。

## 使用

### 注音转换

1. 点击「文件选择」选取 `.srt` / `.ass` 字幕文件
2. 点击「开始转换」
3. 同目录下生成 `.ass` 文件

生成的 ASS 文件包含两条 Aegisub 模板注释行，可在 Aegisub 中执行卡拉 OK 模板渲染振假名。

### 双语字幕合并

1. 点击「浏览」分别选择两个字幕文件（支持 SRT/ASS 格式，任意组合）
2. 可选勾选「翻转顺序」切换双语上下显示顺序
3. 点击「合并字幕」，选择保存路径
4. 输出合并后的 SRT 或 ASS 文件

合并按行号一一对应，行数不一致时会报错。
