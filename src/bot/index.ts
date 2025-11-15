import { checkNotas } from "./guarani";

export async function runCheck(email: string, password: string) {
    const result = await checkNotas(email, password);
    return result;
}