import { join } from "path";

export const getFilePath = () => {
    return join(__dirname, "..", "..", "src", "bot", "subjectsInfo.txt");
};

