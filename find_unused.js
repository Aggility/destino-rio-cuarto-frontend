const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    return arrayOfFiles;
}

const srcDir = path.join(__dirname, 'src');
const allFiles = getAllFiles(srcDir);

const entryPointsRegex = /\\(page|layout|loading|not-found|error|route)\.jsx?$/;
const ignoredDirs = ['\\api\\', '\\(pages)\\'];

const isEntryPoint = (file) => entryPointsRegex.test(file) || ignoredDirs.some(dir => file.includes(dir));

const componentsToCheck = allFiles.filter(f => !isEntryPoint(f) && (f.includes('\\components\\') || f.includes('\\utils\\') || f.includes('\\hooks\\')));

const results = [];
for (const file of componentsToCheck) {
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    let isUsed = false;
    for (const otherFile of allFiles) {
        if (file === otherFile) continue;
        const content = fs.readFileSync(otherFile, 'utf8');
        if (content.includes(basename)) {
            isUsed = true;
            break;
        }
    }
    if (!isUsed) {
        results.push(file);
    }
}

console.log('---UNUSED FILES---');
results.forEach(r => console.log(r.replace(__dirname, '')));
