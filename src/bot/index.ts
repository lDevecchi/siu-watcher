import { checkChanges } from "./checkChanges";
import { saveSubjects } from "./saveSubjects";

export async function getSubjects(email: string, password: string) {
    return await saveSubjects(email, password);
}

export async function checkForChanges(email: string, password: string) {
    const result = await checkChanges(email, password);
    return result;
}