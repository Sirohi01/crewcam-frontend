const fs = require('fs');
const path = require('path');

const directoriesToSearch = [
  path.join(__dirname, 'src', 'app', '(company)'),
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'lib')
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx') || dirPath.endsWith('.js') || dirPath.endsWith('.jsx')) {
        callback(dirPath);
      }
    }
  });
}

const replacements = [
  { from: /'\/company\/'/g, to: "'/company/" },
  { from: /"\/company\/"/g, to: '"/company/' },
  { from: /`\/company\/`/g, to: '`/company/' }
];

let filesModified = 0;

directoriesToSearch.forEach(dir => {
  walkDir(dir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      console.log(`Fixed: ${filePath}`);
    }
  });
});

console.log(`Done fixing! Modified ${filesModified} files.`);
