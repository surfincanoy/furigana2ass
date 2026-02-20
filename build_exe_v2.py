#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
改进的打包脚本 - 字典文件放在exe旁边
"""

import subprocess
import sys
import shutil
from pathlib import Path


def build_exe():
    """构建exe（不包含字典，字典单独放置）"""
    print("=== 日语振假名生成器 - 打包工具 ===\n")

    # 检查必要文件
    print("1. 检查必要文件...")
    if not Path("kuroshiro.exe").exists():
        print("错误: kuroshiro.exe 不存在！")
        print("请先运行: bun build --compile kuroshiro.mjs --outfile kuroshiro.exe")
        return False

    if not Path("dict").exists():
        print("错误: dict 目录不存在！")
        return False

    print("2. 开始打包Python项目（不包含字典）...")

    # 打包命令（不包含dict）
    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--name",
        "日语振假名生成器",
        "--onefile",
        "--windowed",
        "--add-binary",
        "kuroshiro.exe;.",
        "--add-data",
        "src;src",
        # 不包含 dict，单独处理
        "--hidden-import",
        "customtkinter",
        "--hidden-import",
        "darkdetect",
        "--clean",
        "test.py",
    ]

    result = subprocess.run(cmd)

    if result.returncode != 0:
        print("\n=== 打包失败 ===")
        return False

    print("\n3. 复制字典文件到dist目录...")

    # 创建发布目录
    dist_dir = Path("dist")
    release_dir = dist_dir / "日语振假名生成器"
    release_dir.mkdir(exist_ok=True)

    # 复制主程序exe
    shutil.copy(dist_dir / "日语振假名生成器.exe", release_dir)

    # 复制kuroshiro.exe（必需）
    if Path("kuroshiro.exe").exists():
        shutil.copy("kuroshiro.exe", release_dir)
        print("  已复制 kuroshiro.exe")
    else:
        print("  [警告] 找不到 kuroshiro.exe")

    # 复制字典目录
    dict_dest = release_dir / "dict"
    if dict_dest.exists():
        shutil.rmtree(dict_dest)
    shutil.copytree("dict", dict_dest)

    # 复制src目录
    src_dest = release_dir / "src"
    if src_dest.exists():
        shutil.rmtree(src_dest)
    shutil.copytree("src", src_dest)

    # 创建启动脚本
    readme_content = """使用说明
========

1. 运行程序
   双击 "日语振假名生成器.exe"

2. 使用步骤
   - 点击"文件选择"按钮
   - 选择 SRT 字幕文件
   - 点击"开始转换"
   - 生成的 ASS 文件会在同一目录

3. 注意事项
   - 不要删除 dict 文件夹（包含日语词典）
   - 不要删除 src 文件夹（包含用户词典）
   - 可以将整个文件夹复制到任意位置使用

文件说明
========
日语振假名生成器.exe  - 主程序
kuroshiro.exe         - 日语分词引擎（会被自动调用）
dict/                 - 日语词典数据（必需）
src/                  - 用户词典目录（可选）
"""

    with open(release_dir / "使用说明.txt", "w", encoding="utf-8") as f:
        f.write(readme_content)

    print("\n=== 打包成功！===")
    print(f"输出目录: {release_dir}")
    print(f"文件列表:")
    for item in release_dir.iterdir():
        if item.is_file():
            size = item.stat().st_size / 1024 / 1024
            print(f"  {item.name} ({size:.1f} MB)")
        else:
            print(f"  {item.name}/ (目录)")

    print("\n使用方法:")
    print("1. 将整个文件夹复制到任意位置")
    print("2. 双击运行 日语振假名生成器.exe")
    print("3. 确保 dict 和 src 文件夹与exe在同一目录")

    return True


if __name__ == "__main__":
    import sys

    sys.exit(0 if build_exe() else 1)
