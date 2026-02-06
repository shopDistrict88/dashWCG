import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recursively get all CSS files
function getCSSFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getCSSFiles(fullPath, files);
    } else if (item.endsWith('.css')) {
      files.push(fullPath);
    }
  });
  return files;
}

// Remove color-changing properties in hover/focus/active states
function removeHoverEffects(content) {
  // Split into lines for better processing
  let lines = content.split('\n');
  let result = [];
  let inHoverBlock = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if this line starts a hover/focus/active rule
    if (line.match(/.*:(?:hover|focus|active|focus-visible)[:\w\-]* *\{/i)) {
      inHoverBlock = true;
      braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      
      // Skip the entire hover/focus/active block
      continue;
    } else if (inHoverBlock) {
      // Count braces while in hover block
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      braceCount += openBraces - closeBraces;
      
      if (braceCount <= 0) {
        // End of hover block
        inHoverBlock = false;
      }
      continue;
    }
    
    // Remove @media blocks that only contain hover rules
    if (line.match(/@media.*\(hover:/)) {
      // Skip the entire @media hover block
      while (i < lines.length && !line.match(/^\s*\}\s*$/)) {
        i++;
        line = lines[i];
      }
      continue;
    }
    
    result.push(line);
  }
  
  return result.join('\n')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim() + '\n';
}

const srcDir = path.join(__dirname, 'src');
const cssFiles = getCSSFiles(srcDir);

console.log(`Found ${cssFiles.length} CSS files`);

cssFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalLength = content.length;
    content = removeHoverEffects(content);
    
    if (content.length !== originalLength) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✓ Fixed ${path.relative(srcDir, file)}`);
    } else {
      console.log(`- No changes: ${path.relative(srcDir, file)}`);
    }
  } catch (err) {
    console.error(`✗ Error processing ${file}: ${err.message}`);
  }
});

console.log('Done!');

