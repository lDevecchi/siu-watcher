import { Locator, Page } from "@playwright/test";
import { ExamData, Subject } from "./types";

export const login = async (page: Page, email: string, password: string) => {
    await page.goto('https://guarani.frba.utn.edu.ar/autogestion/grado/');
    await page.getByRole('textbox', { name: 'Usuario' }).fill(email);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
};

export const goToHistoriaAcademica = async (page: Page) => {
    await page.goto('https://guarani.frba.utn.edu.ar/autogestion/grado/historia_academica');
    await page.waitForTimeout(200);
    await page.getByText('En curso', { exact: true }).click();
    await page.waitForTimeout(200);
};

export const getSubjectName = async (btn: Locator): Promise<string> => {
    return (await btn.locator('xpath=ancestor::div[@class="catedras"]//h3').innerText()).trim();
};

export const getExamsData = async (id: string, page: Page): Promise<ExamData[]> => {
    const subjectTable = `#info_det_${id} table`;

    // Wait for the subject details to be visible
    await page.waitForSelector(`#info_det_${id}`, { state: 'visible' });

    const tableExists = (await page.locator(subjectTable).count()) > 0;
    if (!tableExists) return [];

    await page.waitForSelector(`${subjectTable} tr:has(td)`, { state: 'attached' });
    const filas = page.locator(`${subjectTable} tr:has(td)`);

    const results: ExamData[] = [];
    const filasCount = await filas.count();

    for (let i = 0; i < filasCount; i++) {
        const cols = filas.nth(i).locator('td');
        results.push({
            date: (await cols.nth(0).innerText()).trim(),
            description: (await cols.nth(1).innerText()).trim(),
            type: (await cols.nth(2).innerText()).trim(),
            grade: (await cols.nth(3).innerText()).trim(),
            result: (await cols.nth(4).innerText()).trim(),
        });
    }
    return results;
};

export const extractSubjects = async (page: Page): Promise<Subject[]> => {
    const buttons = page.locator('a[data-origen="EnCurso"]');
    const count = await buttons.count();
    const subjects: Subject[] = [];

    for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        const id = await btn.getAttribute('id');
        if (!id) continue;

        // Click on "Grabar"
        await btn.click();
        const name = await getSubjectName(btn);
        const examsData = await getExamsData(id, page);

        subjects.push({ name, examsData });
    }

    return subjects;
};