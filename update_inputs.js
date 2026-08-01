const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('d:\\\\new-hr-crm\\\\crewcam-frontend-main\\\\src');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/<(input|select)([\s\S]*?)>/gi, (match, tag, inner) => {
    // Only modify the className attribute
    let newInner = inner.replace(/className=(["'{])([^"'}]+)(["'}])/g, (classMatch, quote1, classes, quote2) => {
      let newClasses = classes
        .replace(/\bh-6\b/g, 'h-8')
        .replace(/\bh-7\b/g, 'h-8')
        .replace(/\bh-9\b/g, 'h-8')
        .replace(/\bh-10\b/g, 'h-8')
        .replace(/\bpy-1\.5 sm:py-1\b/g, 'h-8')
        .replace(/\bh-12\b/g, 'h-8');
      
      // If there's no h-* class in the new classes, let's inject h-8
      if (!/\bh-\d+\b/.test(newClasses) && !newClasses.includes('h-full') && !newClasses.includes('h-auto')) {
        newClasses = newClasses.trim() + ' h-8';
      }
      return `className=${quote1}${newClasses}${quote2}`;
    });
    return `<${tag}${newInner}>`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});
console.log(`Modified ${changedFiles} files`);
