const fs = require('fs');
const path = require('path');

function minifyCss(src) {
    let out = '';
    let i = 0;
    while (i < src.length) {
        const c = src[i];

        if (c === '"' || c === "'") {
            const quote = c;
            out += c;
            i++;
            while (i < src.length) {
                if (src[i] === '\\') { out += src[i] + (src[i + 1] || ''); i += 2; continue; }
                out += src[i];
                if (src[i] === quote) { i++; break; }
                i++;
            }
            continue;
        }

        if (src.startsWith('/*', i)) {
            const end = src.indexOf('*/', i + 2);
            i = end === -1 ? src.length : end + 2;
            continue;
        }

        if (/\s/.test(c)) {
            let j = i;
            while (j < src.length && /\s/.test(src[j])) j++;
            const prev = out[out.length - 1];
            const next = src[j];

            if (prev && next && !'{}:;,>~('.includes(prev) && !'{}:;,>~)'.includes(next)) {
                out += ' ';
            }
            i = j;
            continue;
        }

        out += c;
        i++;
    }
    return out.replace(/;\}/g, '}').trim();
}

const cssDir = path.join(__dirname, 'css');
const parts = fs.readdirSync(cssDir)
    .filter(f => /^\d\d-.*\.css$/.test(f))
    .sort();

let bundle = '';
let rawBytes = 0;
for (const f of parts) {
    const src = fs.readFileSync(path.join(cssDir, f), 'utf8');
    rawBytes += Buffer.byteLength(src);
    bundle += minifyCss(src) + '\n';
}

const outFile = path.join(cssDir, 'main.min.css');
fs.writeFileSync(outFile, bundle);

const outBytes = Buffer.byteLength(bundle);
const saved = Math.round((1 - outBytes / rawBytes) * 100);
console.log(`css: ${parts.length} files, ${rawBytes} -> ${outBytes} bytes (-${saved}%)`);
console.log(`     wrote css/main.min.css`);

let depth = 0;
for (const ch of bundle) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth < 0) { console.error('ERROR: unbalanced braces in bundle'); process.exit(1); }
}
if (depth !== 0) { console.error('ERROR: unbalanced braces in bundle'); process.exit(1); }

const badCalc = (bundle.match(/calc\([^)]*\)/g) || [])
    .filter(e => /[\w%)]\s*[+]\s*[\w.]/.test(e) && !/ \+ /.test(e));
if (badCalc.length) {
    console.error('ERROR: calc() lost required whitespace around +:');
    badCalc.slice(0, 5).forEach(e => console.error('   ', e));
    process.exit(1);
}

const countRules = s => (s.match(/\{/g) || []).length;
const srcRules = parts.reduce((n, f) => n + countRules(fs.readFileSync(path.join(cssDir, f), 'utf8')), 0);
if (countRules(bundle) !== srcRules) {
    console.error(`ERROR: rule count changed (${srcRules} -> ${countRules(bundle)})`);
    process.exit(1);
}
console.log(`     ${srcRules} rules, braces balanced`);
