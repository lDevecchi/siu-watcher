import { checkGrades } from "./guarani";

export async function runCheck(email: string, password: string) {
    const result = await checkGrades(email, password);
    return result;
}