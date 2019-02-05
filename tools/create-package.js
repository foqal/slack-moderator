import fs from 'fs';
import path from 'path';

const oldPackage = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json")));

const newPackage = {};
["name", "description", "version", "private", "dependencies", "repository", "bugs", "main", "files", "bin"].forEach(key => {
    newPackage[key] = oldPackage[key];
});

fs.writeFileSync(path.resolve(__dirname, "../dist/package/package.json"), JSON.stringify(newPackage, 0, 4));
