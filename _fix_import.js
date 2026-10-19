const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'app', 'components', 'chat', 'BaseChat.tsx');
let content = fs.readFileSync(filePath, 'utf8');
// Replace the malformed line
content = content.replace(
    /import StarterTemplates from '.\/StarterTemplates'; \\nimport \{ PromptLibrary \} from '.\/PromptLibrary';/,
    "import StarterTemplates from './StarterTemplates';\nimport { PromptLibrary } from './PromptLibrary';"
);
fs.writeFileSync(filePath, content);
console.log('Fixed!');
