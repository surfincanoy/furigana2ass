# 日语字幕振假名生成器

将 SRT 字幕文件转换为 ASS 格式，自动为日文汉字标注振假名。

## 前置要求

安装 **Node.js**（>= 18）和 **npm**：

- 官网下载：https://nodejs.org/
- 验证安装：`node --version` → 应显示 v18.x 或更高
- 验证安装：`npm --version` → 应显示 9.x 或更高

## 安装依赖

将项目下载到本地后（`node_modules/` 不包含在仓库中），在项目根目录执行：

```bash
npm install
```

此命令会读取 `package.json`，自动下载以下包到 `node_modules/`：

### 运行时依赖（dependencies）

| 包名 | 版本 | 作用 | 安装后位置 |
|------|------|------|-----------|
| `kuroshiro` | ^1.2.0 | 日文汉字转振假名的核心引擎。接收日文字符串，返回带假名标注的 ruby HTML | `node_modules/kuroshiro/` |
| `kuroshiro-analyzer-kuromoji` | ^1.1.0 | kuroshiro 的分析器插件，负责日文分词和读音提取 | `node_modules/kuroshiro-analyzer-kuromoji/` |

kuroshiro-analyzer-kuromoji 内部依赖 **kuromoji.js**（日文形态素分析器，Java Kuromoji 的 JS 移植版），后者自带离线词典数据，位于：

```
node_modules/kuromoji/dict/
├── base.dat.gz
├── cc.dat.gz
├── check.dat.gz
├── tid.dat.gz
├── tid_map.dat.gz
├── tid_pos.dat.gz
├── unk.dat.gz
├── unk_char.dat.gz
├── unk_compat.dat.gz
└── unk_invoke.dat.gz
```

所有词典文件随 npm 包一起安装，**无需联网**即可离线运行。

### 开发依赖（devDependencies）

| 包名 | 版本 | 作用 | 安装后位置 |
|------|------|------|-----------|
| `electron` | ^42.0.1 | 桌面 GUI 框架。提供 Chromium 渲染 + Node.js 运行时，用于开发运行 `.` 和打包为独立应用 | `node_modules/electron/`（内含 `dist/electron` 二进制） |
| `electron-builder` | ^26.0.0 | 打包构建工具。将项目与 Electron 打包为 exe / AppImage / deb 等分发格式 | `node_modules/electron-builder/` |

### npm install 执行过程

1. npm 读取 `package.json` 中的 `dependencies` 和 `devDependencies`
2. 下载所有包到 `node_modules/`
3. Electron 的 postinstall 脚本自动下载对应平台（win/linux/mac）的 Electron 二进制文件到 `node_modules/electron/dist/`
4. 安装完成后目录结构如下：

```
ass-rs/
├── node_modules/          # 所有依赖（已加入 .gitignore，不上传 GitHub）
│   ├── electron/          # Electron 框架 + 二进制
│   ├── electron-builder/  # 打包工具
│   ├── kuroshiro/         # 日文转换引擎
│   ├── kuroshiro-analyzer-kuromoji/
│   ├── kuromoji/          # 日文形态素分析器 + 词典
│   └── ...                # 间接依赖
├── main.js
├── preload.cjs
├── renderer/
│   ├── index.html
│   ├── style.css
│   └── renderer.js
└── package.json
```

### 注意事项

- **首次安装 Electron 较慢**（~120MB 二进制下载），视网络情况可能需要几分钟
- 中国大陆用户可设置镜像加速：`export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"`
- `node_modules/` **不要提交到 GitHub**（已在 `.gitignore` 中忽略）
- 如需在另一台机器上运行，只需重新执行 `npm install`

## 运行

```bash
npm start
```

## 构建

### Windows 单文件 exe

需要 Windows 系统或 Linux + wine64：

```bash
npx electron-builder --win portable
```

输出：`dist/日语振假名生成器 2.0.0.exe`

### Linux AppImage

```bash
npx electron-builder --linux appimage
```

输出：`dist/日语振假名生成器-2.0.0.AppImage`

### Linux deb

```bash
npx electron-builder --linux deb
```

输出：`dist/ass-rs_2.0.0_amd64.deb`

## 使用

1. 打开程序，点击「文件选择」选取 `.srt` 字幕文件
2. 点击「开始转换」
3. 同目录下生成 `.ass` 文件

生成的 ASS 文件包含两条 Aegisub 模板注释行，可在 Aegisub 中执行卡拉 OK 模板渲染振假名。
