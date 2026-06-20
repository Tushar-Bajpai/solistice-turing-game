import fs from 'fs';
import path from 'path';

const dir = './src/screens';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // Replace text node standalone prompts
    content = content.replace(/> EXPLAIN/g, '&gt; EXPLAIN');
    content = content.replace(/> GIVE/g, '&gt; GIVE');
    
    // Replace specific terminal prompt > 
    content = content.replace(/<span className="text-terminal-green">>(\s*)<\/span>/g, '<span className="text-terminal-green">&gt;$1</span>');
    content = content.replace(/<span className="text-terminal-green">>([A-Z])/g, '<span className="text-terminal-green">&gt;$1');

    fs.writeFileSync(path.join(dir, file), content);
});
console.log('Fixed JSX characters properly.');
