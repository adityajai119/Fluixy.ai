const { execSync } = require('child_process');

// Get git hash with fallback
const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'no-git-info';
  }
};

let commitJson = {
  hash: JSON.stringify(getGitHash()),
  version: JSON.stringify(process.env.npm_package_version),
};

console.log(`
★═══════════════════════════════════════★
           F L U I X Y . A I - by Aditya
         ⚡️  Welcome  ⚡️
★═══════════════════════════════════════★
`);
console.log('  Please wait until the URL appears here');
console.log('★═══════════════════════════════════════★');
