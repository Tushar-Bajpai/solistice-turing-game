import fs from 'fs';
import path from 'path';

const SRC_DIR = './stitch_solstice_turing_design_system/stitch_solstice_turing_design_system';
const DEST_DIR = './src/screens';

if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

const folders = [
    'phosphor_monolith',
    'shader',
    'solstice_turing_ai_core',
    'solstice_turing_cipher_core',
    'solstice_turing_main_hub',
    'solstice_turing_memory_core',
    'solstice_turing_reconstruction_core',
    'solstice_turing_restoration_complete'
];

function toPascalCase(str) {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function htmlToJsx(html) {
    let jsx = html;
    
    // Replace class= with className=
    jsx = jsx.replace(/class=/g, 'className=');
    // Replace for= with htmlFor=
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    // Replace inline styles (simplistic, just string to object for common ones if any, but let's assume few)
    jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
        const styles = p1.split(';').filter(s => s.trim() !== '');
        const styleObj = {};
        styles.forEach(s => {
            let [key, value] = s.split(':');
            key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            styleObj[key] = value.trim();
        });
        return `style={${JSON.stringify(styleObj)}}`;
    });

    // Handle HTML comments
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

    // Self-close tags
    const tagsToClose = ['input', 'img', 'br', 'hr', 'source', 'link', 'meta'];
    tagsToClose.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
        jsx = jsx.replace(regex, (match, p1) => {
            if (p1.trim().endsWith('/')) return match; // Already self-closed
            return `<${tag}${p1} />`;
        });
    });
    
    // Extract script tags (we will just remove them from the JSX return and perhaps log them for manual migration)
    let scripts = '';
    jsx = jsx.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, p1) => {
        scripts += p1 + '\n';
        return '';
    });

    return { jsx, scripts };
}

folders.forEach(folder => {
    const htmlPath = path.join(SRC_DIR, folder, 'code.html');
    if (!fs.existsSync(htmlPath)) return;

    let content = fs.readFileSync(htmlPath, 'utf-8');
    
    // Extract body inner content
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) return;
    
    let bodyContent = bodyMatch[1];
    
    const { jsx, scripts } = htmlToJsx(bodyContent);
    
    let componentName = toPascalCase(folder.replace('solstice_turing_', ''));
    if (componentName === 'MainHub') componentName = 'MainHub'; // just a check
    
    const componentCode = `import React, { useEffect } from 'react';

export default function ${componentName}() {
  useEffect(() => {
    /* 
    Extracted Scripts from original HTML:
    ${scripts.replace(/\/\*/g, '').replace(/\*\//g, '')}
    */
  }, []);

  return (
    <>
      ${jsx}
    </>
  );
}
`;

    fs.writeFileSync(path.join(DEST_DIR, `${componentName}.jsx`), componentCode);
    console.log(`Migrated ${folder} to ${componentName}.jsx`);
});
