const fs = require('fs');
let file = fs.readFileSync('c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/page.tsx', 'utf8');

file = file.replace(
  'Trash2, BarChart3, BadgeCheck, Target, Rocket,',
  'Trash2, BarChart3, BadgeCheck, Target, Rocket, BriefcaseBusiness, Building, CreditCard, Receipt, Goal, CheckSquare, BookOpen,'
);

if (!file.includes('const taskData')) {
  file = file.replace(
    "import { AssetsTab } from './components/AssetsTab';",
    "import { AssetsTab } from './components/AssetsTab';\n\nconst taskData = [\n  { name: 'Completed', value: 6, color: '#22c55e' },\n  { name: 'In Progress', value: 3, color: '#3b82f6' },\n  { name: 'Pending', value: 2, color: '#f59e0b' },\n  { name: 'Overdue', value: 1, color: '#ef4444' },\n];"
  );
}

fs.writeFileSync('c:/Projects/hr-crm/crewcam-frontend/src/app/(dashboard)/dashboard/my-profile-extension/page.tsx', file);
console.log('Fixed imports');
