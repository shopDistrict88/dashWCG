import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function fixBraces(content) {
  let fixed = content;
  
  // Remove dangling closing braces (preceded only by whitespace/newlines)
  fixed = fixed.replace(/\n\s*\}\s*\n(\s*\})/g, '\n$1');
  
  // Remove stray closing braces that don't match opening braces
  let openCount = 0;
  let lines = fixed.split('\n');
  let result = [];
  
  for (let line of lines) {
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    
    openCount += opens;
    
    // Only keep closing braces if we have open braces to close
    if (closes > openCount) {
      // Remove extra closing braces
      const extraCloses = closes - openCount;
      line = line.replace(/\}/g, (match, offset, str) => {
        openCount--;
        if (openCount >= 0) {
          return match;
        }
        return '';
      });
      line = line.trim();
      if (!line) continue;
    }
    
    openCount -= closes;
    result.push(line);
  }
  
  fixed = result.join('\n')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim() + '\n';
  
  return fixed;
}

const srcDir = path.join(__dirname, 'src');
const cssFiles = getCSSFiles(srcDir);

cssFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalLength = content.length;
    content = fixBraces(content);
    
    if (content.length !== originalLength) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✓ Fixed ${path.relative(srcDir, file)}`);
    }
  } catch (err) {
    console.error(`✗ Error: ${path.relative(srcDir, file)}: ${err.message}`);
  }
});
