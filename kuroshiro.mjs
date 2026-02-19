import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import path from 'path';

// 获取命令行参数
const args = process.argv.slice(2);
const text = args[0];

async function main(text) {
    const kuroshiro = new Kuroshiro();
    
    // 对于编译后的exe，使用当前工作目录（exe所在目录）
    // process.cwd() 通常是exe文件所在的目录
    const cwd = process.cwd();
    
    // 尝试字典路径 - 优先使用当前工作目录
    const possibleDictPaths = [
        // 当前工作目录（exe所在目录）
        path.join(cwd, 'dict'),
        // 上级目录
        path.join(cwd, '..', 'dict'),
        // 开发环境
        path.join(process.cwd(), 'node_modules', 'kuromoji', 'dict'),
    ];
    
    let analyzer;
    let lastError;
    
    for (const dictPath of possibleDictPaths) {
        try {
            analyzer = new KuromojiAnalyzer({ dictPath });
            await kuroshiro.init(analyzer);
            // 如果成功初始化，跳出循环
            break;
        } catch (err) {
            lastError = err;
            continue;
        }
    }
    
    if (!analyzer) {
        throw new Error(`无法加载字典文件。请确保 dict 文件夹与程序在同一目录。错误: ${lastError?.message}`);
    }
    
    // 转换为振假名（平假名）
    const result = await kuroshiro.convert(text, { 
        mode: "furigana", 
        to: "hiragana" 
    });
    
    return result;
}

// 如果没有输入参数，显示帮助
if (!text) {
    console.log('用法: kuroshiro.exe <日语文本>');
    console.log('示例: kuroshiro.exe "昨夜拉面很好吃"');
    process.exit(0);
}

// 运行并输出结果
main(text).then(result => {
    console.log(result);
}).catch(err => {
    console.error('错误:', err.message);
    process.exit(1);
});
