import { saveSubjects  } from "./saveSubjects";

export async function runCheck(email: string, password: string) {
    const result = await saveSubjects (email, password);
    return result;
}