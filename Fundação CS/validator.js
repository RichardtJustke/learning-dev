const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'cs_curso.html');
const content = fs.readFileSync(filePath, 'utf8');
const scriptMatches = [...content.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
const scriptContent = scriptMatches[scriptMatches.length - 1][1];
const linesBefore = content.substring(0, scriptMatches[scriptMatches.length - 1].index).split('\n').length;

function findError(code) {
    try {
        new Function(code);
        return null;
    } catch (e) {
        return e.message;
    }
}

const lines = scriptContent.split('\n');
let code = '';
for (let i = 0; i < lines.length; i++) {
    code += lines[i] + '\n';
    const err = findError(code);
    if (err && !err.includes("Unexpected end of input") && !err.includes("is not defined")) {
        console.log(`Error at relative line ${i+1} (HTML line ${linesBefore + i + 1}): ${err}`);
        console.log("Line content:", lines[i].trim());
        // Try to see if previous lines were part of a template literal
        break;
    }
}
