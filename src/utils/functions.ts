import { join } from "path";
import { Subject } from "./types";
import fs from "fs";

export const getFilePath = () => {
    return join(__dirname, "..", "..", "src", "bot", "subjectsInfo.txt");
};

export const updateSubjectsFile = (subjects: Subject[]) => {
    fs.writeFileSync(getFilePath(), JSON.stringify(subjects, null, 2), 'utf8');
};