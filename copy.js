const fs = require('fs');
const src = fs.readFileSync('c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile/page.tsx', 'utf8');
const dest = fs.readFileSync('c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/page.tsx', 'utf8');

const srcLines = src.split('\n');
const replacement = '        <div className="flex flex-col gap-2">\n' + srcLines.slice(49, 555).join('\n') + '\n        </div>\n      )}';

const destLines = dest.split('\n');
const startIdx = destLines.findIndex(l => l.includes("{tab === 'personal' && ("));
const endIdx = destLines.findIndex((l, i) => i > startIdx && l.includes("{tab === 'family' && ("));

const before = destLines.slice(0, startIdx + 1).join('\n');
const after = destLines.slice(endIdx - 1).join('\n'); // after will include the blank line and tab===family

fs.writeFileSync('c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/page.tsx', before + '\n' + replacement + '\n' + after);
console.log('Replaced successfully');
