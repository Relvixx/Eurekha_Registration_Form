const fs = require('fs');
const path = require('path');

const directories = [
  'src/components/eureka-form',
  'src/hooks',
  'src/app/eureka'
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/WizardShell/g, 'FormShell')
    .replace(/WizardProgress/g, 'FormProgress')
    .replace(/WizardNavigation/g, 'FormNavigation')
    .replace(/useWizardState/g, 'useFormState')
    .replace(/wizardState/g, 'formState')
    .replace(/resetWizard/g, 'resetForm')
    .replace(/eureka-wizard/g, 'eureka-form');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

for (const dir of directories) {
  processDirectory(path.join(__dirname, dir));
}
