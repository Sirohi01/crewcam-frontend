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
  { from: /['"`]\/dashboard\/my-profile-extension['"`]/g, to: "'/company/employees/my-profile'" },
  { from: /['"`]\/dashboard\/my-profile-extension\/(.*?)['"`]/g, to: "'/company/employees/my-profile/$1'" },
  { from: /['"`]\/dashboard\/my-profile['"`]/g, to: "'/company/employees/my-profile'" },
  { from: /['"`]\/dashboard\/employee\/assets['"`]/g, to: "'/company/employees/assets'" },
  { from: /['"`]\/dashboard\/employee\/bank-details['"`]/g, to: "'/company/employees/bank-details'" },
  { from: /['"`]\/dashboard\/employee\/family['"`]/g, to: "'/company/employees/family'" },
  { from: /['"`]\/dashboard\/employee['"`]/g, to: "'/company/employees/dashboard'" },
  { from: /['"`]\/dashboard\/employees['"`]/g, to: "'/company/employees'" },
  { from: /['"`]\/dashboard\//g, to: "'/company/'" },
  { from: /['"`]\/dashboard['"`]/g, to: "'/company'" }
];

let filesModified = 0;

directoriesToSearch.forEach(dir => {
  walkDir(dir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    replacements.forEach(r => {
      content = content.replace(r.from, (match, p1) => {
        let quote = match[0];
        let newStr = r.to.replace(/'/g, quote);
        if (p1) newStr = newStr.replace('$1', p1);
        return newStr;
      });
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      console.log(`Modified: ${filePath}`);
    }
  });
});

console.log(`Done! Modified ${filesModified} files.`);
