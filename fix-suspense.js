const fs = require('fs');
const path = require('path');

const pages = [
  'app/summary/page.js',
  'app/story/page.js',
  'app/slides/page.js',
  'app/quiz/page.js',
  'app/mcq/page.js',
  'app/exam/page.js',
  'app/essay/page.js'
];

pages.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add Suspense import if not exists
  if (!content.includes('import { Suspense }')) {
    content = content.replace(
      "import { useState", 
      "import { useState, Suspense"
    );
    if (!content.includes('Suspense')) {
        content = content.replace("import ", "import { Suspense } from 'react';\nimport ");
    }
  }

  // Rename "export default function ComponentName()" to "function ComponentNameContent()"
  const exportMatch = content.match(/export default function ([A-Za-z0-9_]+)\(\) \{/);
  if (exportMatch) {
    const componentName = exportMatch[1];
    content = content.replace(
      `export default function ${componentName}() {`,
      `function ${componentName}Content() {`
    );

    // Append the new default export at the end
    content += `\n\nexport default function ${componentName}() {\n  return (\n    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>\n      <${componentName}Content />\n    </Suspense>\n  );\n}\n`;
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
