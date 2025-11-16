import { checkChanges } from "./checkChanges";
import { saveSubjects } from "./saveSubjects";

export async function getSubjects(email: string, password: string) {
    const result = await saveSubjects(email, password);
    return result;
}

export async function checkForChanges(email: string, password: string) {
    const result = await checkChanges(email, password);
    return result;
}