const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/page.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/AssetsTab.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/BankTab.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/EducationTab.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/ExperienceTab.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/FamilyTab.tsx'
];

const replacements = {
  'gap-6': 'gap-3',
  'gap-5': 'gap-2',
  'gap-4': 'gap-2',
  'gap-3': 'gap-1.5',
  
  'p-8': 'p-4',
  'p-6': 'p-3',
  'p-5': 'p-3',
  'p-4': 'p-2',
  
  'px-8': 'px-4',
  'py-8': 'py-4',
  'px-6': 'px-3',
  'py-6': 'py-3',
  'px-5': 'px-3',
  'py-5': 'py-3',
  'px-4': 'px-2',
  'py-4': 'py-2',
  
  'mb-8': 'mb-4',
  'mt-8': 'mt-4',
  'pb-8': 'pb-4',
  'pt-8': 'pt-4',

  'mb-6': 'mb-3',
  'mt-6': 'mt-3',
  'pb-6': 'pb-3',
  'pt-6': 'pt-3',
  
  'mb-5': 'mb-2',
  'mt-5': 'mt-2',
  'pb-5': 'pb-2',
  'pt-5': 'pt-2',

  'mb-4': 'mb-2',
  'mt-4': 'mt-2',
  'pb-4': 'pb-2',
  'pt-4': 'pt-2',
  
  // Specific tall elements shrinking slightly to fit viewport
  'h-24': 'h-20',
  'w-24': 'w-20',
  'h-[100px]': 'h-[80px]',
  'w-[100px]': 'w-[80px]'
};

for (const filePath of filesToProcess) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // We want to replace these classes globally but safely (with word boundaries or space boundaries)
  // Since they are inside strings, a regex like \b(gap-6)\b works well.
  // Exception: for h-[100px], \b might not work perfectly because of brackets, so we use string replacement loop or a customized regex.
  
  for (const [oldClass, newClass] of Object.entries(replacements)) {
    // Escape brackets in oldClass for regex
    const escapedOld = oldClass.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    // Regex: look for the class name bounded by spaces, quotes, or backticks
    const regex = new RegExp(`(?<=[\\s"'\\\`])` + escapedOld + `(?=[\\s"'\\\`])`, 'g');
    content = content.replace(regex, newClass);
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Optimized spacing in', path.basename(filePath));
}

console.log('Spacing optimization complete.');
