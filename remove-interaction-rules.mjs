import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, 'src');

function getCssFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getCssFiles(fullPath, files);
    } else if (entry.isFile() && fullPath.endsWith('.css')) {
      files.push(fullPath);
    }
  }
  return files;
}

function shouldRemoveSelector(selector) {
  return /:(hover|focus|active|focus-visible|focus-within)/i.test(selector);
}

function pruneRules(root) {
  // Remove rules with interactive pseudo-classes.
  root.walkRules((rule) => {
    if (shouldRemoveSelector(rule.selector)) {
      rule.remove();
    }
  });

  // Remove empty at-rules after pruning.
  root.walkAtRules((atRule) => {
    if (atRule.nodes && atRule.nodes.length === 0) {
      atRule.remove();
    }
  });
}

const cssFiles = getCssFiles(rootDir);
let changedCount = 0;

for (const file of cssFiles) {
  const css = fs.readFileSync(file, 'utf8');
  const root = postcss.parse(css, { from: file });
  const before = root.toString();

  pruneRules(root);

  const after = root.toString();
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changedCount += 1;
    console.log(`Updated ${path.relative(rootDir, file)}`);
  }
}

console.log(`Done. Updated ${changedCount} file(s).`);
