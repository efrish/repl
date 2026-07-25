const fs = require('fs');
const code = fs.readFileSync('attached_assets/listingreel-page.tsx', 'utf8');
const searchStr = `"use client";\n\nimport {\n  CSSProperties,\n  ChangeEvent,\n  DragEvent,\n  useCallback,\n  useEffect,\n  useMemo,\n  useRef,\n  useState,\n} from "react";`;
const replaceStr = `import React, {\n  CSSProperties,\n  ChangeEvent,\n  DragEvent,\n  useCallback,\n  useEffect,\n  useMemo,\n  useRef,\n  useState,\n} from 'react';`;
let newCode;
if (code.includes(searchStr)) {
  newCode = code.replace(searchStr, replaceStr);
} else {
  // If line endings are different or something
  newCode = code.replace(/"use client";\r?\n+/, '');
  newCode = `import React from 'react';\n` + newCode;
}
fs.mkdirSync('artifacts/listing-reel-app/src/pages', { recursive: true });
fs.writeFileSync('artifacts/listing-reel-app/src/pages/Home.tsx', newCode);
