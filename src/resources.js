import path from "path";
import fs from "fs";
import {tokenize} from "./tokenizer";

function loadResources(rootPath) {
    rootPath = rootPath || path.join(__dirname, "../resources");

    const list = fs.readdirSync(rootPath);
    return list.mapFilter(fileName => {
        const data = fs.readFileSync(path.join(rootPath, fileName));
        const lines = data.toString().split("\n").filterMap(line => tokenize(line), words => !words.isEmpty);
        const maxWordCount = lines.maxValue(words => words.length);
        const words = lines.map(line => line.join(" "));
        return {
            file: path.basename(fileName).toLowerCase(),
            contents: {
                words: new Set(words),
                maxWordCount
            }
        };
    }).toIdMap("file", "contents");
}
export {loadResources};
