const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.env.USERPROFILE, '.gemini', 'antigravity', 'skills');
fs.mkdirSync(targetDir, { recursive: true });

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        https.get(url, { headers: { 'User-Agent': 'Node.js/Antigravity' } }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => { file.close(resolve); });
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

const treeUrl = 'https://api.github.com/repos/sickn33/antigravity-awesome-skills/git/trees/main?recursive=1';
https.get(treeUrl, { headers: { 'User-Agent': 'Node.js/Antigravity' } }, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', async () => {
        try {
            const result = JSON.parse(data);
            if (!result.tree) throw new Error(data);
            const files = result.tree.filter(i => i.path.startsWith('skills/') && i.type === 'blob');
            console.log(`Found ${files.length} skills files.`);
            let count = 0;
            for (const f of files) {
                const relPath = f.path.substring(7); // Remove 'skills/' prefix
                const rawUrl = `https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/${f.path}`;
                await downloadFile(rawUrl, path.join(targetDir, relPath));
                count++;
            }
            console.log(`Successfully downloaded ${count} files!`);
        } catch (e) {
            console.error('Error:', e.message);
            process.exit(1);
        }
    });
});
