const fs = require('fs');
let code = fs.readFileSync('attached_assets/listingreel-globals.css', 'utf8');
code = code.replace('@import "tailwindcss";', "@import 'tailwindcss';");
fs.writeFileSync('artifacts/listing-reel-app/src/index.css', code);
