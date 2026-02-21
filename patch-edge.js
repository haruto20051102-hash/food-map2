const fs = require('fs');
const path = require('path');

const targetFile = path.join(
    __dirname,
    'node_modules',
    'next',
    'dist',
    'compiled',
    'ua-parser-js',
    'ua-parser.js'
);

if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');

    // Webpack's Edge builder injects `__nccwpck_require__.ab = __dirname + "/"`
    // which completely crashes Vercel's V8 Isolate since __dirname is undefined.
    // By scrubbing the original source entirely, Webpack stops injecting it.
    if (content.includes('__dirname')) {
        content = content.replace(/__dirname/g, '""');
        fs.writeFileSync(targetFile, content, 'utf8');
        console.log(`[Edge Runtime Patch] Successfully scrubbed __dirname from ${targetFile}`);
    } else {
        console.log(`[Edge Runtime Patch] Target already clean: ${targetFile}`);
    }
} else {
    console.log(`[Edge Runtime Patch] Target not found (might be a different Next.js version): ${targetFile}`);
}
