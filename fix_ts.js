const fs = require('fs');
let code = fs.readFileSync('artifacts/listing-reel-app/src/pages/Home.tsx', 'utf8');

code = code.replace(/function drawFrame\([\s\S]*?\)\s*\{/, match => {
  return match + '\n        if (!context) return;';
});

fs.writeFileSync('artifacts/listing-reel-app/src/pages/Home.tsx', code);
console.log("Replaced successfully!");
