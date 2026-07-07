const fs = require('fs');
const path = require('path');

const files = [
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/page.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/AssetsTab.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/BankTab.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/EducationTab.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/ExperienceTab.tsx',
  'c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/components/FamilyTab.tsx'
];

const classReplacements = {
  // Gaps
  'gap-4': 'gap-2',
  'gap-3': 'gap-1.5',
  'gap-2.5': 'gap-1.5',
  'gap-2': 'gap-1',
  
  // Padding
  'p-4': 'p-2',
  'p-3': 'p-1.5',
  'p-2.5': 'p-1.5',
  
  'px-4': 'px-2',
  'py-4': 'py-2',
  'px-3': 'px-2',
  'py-3': 'py-1.5',
  'px-2.5': 'px-2',
  'py-2.5': 'py-1.5',
  
  // Margin
  'mb-4': 'mb-2',
  'mt-4': 'mt-2',
  'pb-4': 'pb-2',
  'pt-4': 'pt-2',

  'mb-3': 'mb-1.5',
  'mt-3': 'mt-1.5',
  'pb-3': 'pb-1.5',
  'pt-3': 'pt-1.5',

  'mb-2.5': 'mb-1',
  'mt-2.5': 'mt-1',
  'pb-2.5': 'pb-1',
  'pt-2.5': 'pt-1',
  
  'mb-2': 'mb-1',
  'mt-2': 'mt-1',
  'pb-2': 'pb-1',
  'pt-2': 'pt-1',

  // Icon / Avatars / Containers sizes
  'h-12 w-12': 'h-8 w-8',
  'h-10 w-10': 'h-7 w-7',
  'h-8 w-8': 'h-6 w-6',
  'h-5 w-5': 'h-4 w-4',
  'w-[100px] h-[100px]': 'w-[64px] h-[64px]',
  'w-[80px] h-[80px]': 'w-[64px] h-[64px]',
  'w-20 h-20': 'w-16 h-16',
  'h-20 w-20': 'h-16 w-16',

  // Text sizes if explicitly needed for extreme density (but skipping core typography changes)
  // 'text-lg': 'text-[13px]',
  // 'text-sm': 'text-[12px]',
  
  // Specific padding on list items or cards
  'space-y-4': 'space-y-2',
  'space-y-3': 'space-y-1.5',
  'space-y-2.5': 'space-y-1',
  'space-y-2': 'space-y-1',
  
  // Specific hardcoded heights
  'h-[200px]': 'h-[140px]',
  'h-[250px]': 'h-[160px]',
  'h-[300px]': 'h-[180px]',
  
  // Grid tweaks
  'xl:w-[260px]': 'xl:w-[220px]',
  'w-[260px]': 'w-[220px]'
};

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Safe replacement loop
  for (const [oldClass, newClass] of Object.entries(classReplacements)) {
    const escapedOld = oldClass.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?<=[\\s"'\\\`])` + escapedOld + `(?=[\\s"'\\\`])`, 'g');
    content = content.replace(regex, newClass);
  }
  
  // Icon sizes (Lucide React)
  // e.g., size={16} -> size={13}
  content = content.replace(/size=\{18\}/g, 'size={15}');
  content = content.replace(/size=\{16\}/g, 'size={13}');
  content = content.replace(/size=\{15\}/g, 'size={12}');
  content = content.replace(/size=\{14\}/g, 'size={11}');
  
  fs.writeFileSync(filePath, content);
  console.log('Densified:', path.basename(filePath));
}
