# 日语振假名生成器

将SRT字幕文件转换为带振假名标注的ASS字幕文件。

## 功能特点

- 📝 支持SRT字幕文件输入
- 🎯 自动识别日语汉字并添加振假名
- 🎨 输出标准ASS格式字幕
- 🖥️ 图形界面，操作简单
- 🚀 使用Bun + kuromoji进行高性能分词

## 系统要求

- Windows 7/8/10/11
- Python 3.8+（可选，用于GUI界面）

## 使用方法

### 图形界面（推荐）

```bash
python test.py
```

然后：
1. 点击"文件选择"按钮
2. 选择SRT字幕文件
3. 点击"开始转换"
4. 生成的ASS文件会在同一目录

### 命令行

```bash
python cli.py input.srt output.ass
```

## 项目结构

```
.
├── test.py              # Python GUI主程序
├── cli.py               # 命令行版本
├── kuroshiro.mjs        # Bun日语分词程序
├── package.json         # Bun项目配置
├── dict/                # 日语词典数据（必需）
│   ├── base.dat.gz
│   ├── tid.dat.gz
│   └── ...
└── src/
    └── user_vocab.json  # 用户自定义词典
```

## 打包为独立exe

### 1. 编译kuroshiro.mjs

```bash
bun build --compile kuroshiro.mjs --outfile kuroshiro.exe
```

### 2. 打包Python程序

```bash
pip install pyinstaller
python build_exe_v2.py
```

### 3. 分发

`dist/日语振假名生成器/` 文件夹包含：
- `日语振假名生成器.exe` - 主程序
- `kuroshiro.exe` - 分词引擎
- `dict/` - 日语词典
- `src/` - 用户词典

## 注意事项

- 词典文件 `dict/*.dat.gz` 必须存在
- 运行时需要约200MB内存
- 首次运行可能需要几秒钟加载词典

## 许可证

MIT

## 致谢

- [kuromoji](https://github.com/takuyaa/kuromoji.js) - 日语分词库
- [kuroshiro](https://github.com/hexenq/kuroshiro) - 日语转换库
- [Bun](https://bun.sh/) - JavaScript运行时
