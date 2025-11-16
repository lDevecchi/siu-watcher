import { chromium, Locator, Page } from '@playwright/test';
import fs from 'fs';
import { getFilePath } from '../utils/utils';

export interface ExamData {
    date: string;
    description: string;
    type: string;
    grade: string;
    result: string;
}

export interface Subject {
    name: string;
    examsData: ExamData[];
}

const login = async (page: Page, email: string, password: string) => {
    await page.goto('https://guarani.frba.utn.edu.ar/autogestion/grado/');
    await page.getByRole('textbox', { name: 'Usuario' }).fill(email);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
};

const goToHistoriaAcademica = async (page: Page) => {
    await page.goto('https://guarani.frba.utn.edu.ar/autogestion/grado/historia_academica');
    await page.waitForTimeout(200);
    await page.getByText('En curso', { exact: true }).click();
    await page.waitForTimeout(200);
};

const getSubjectName = async (btn: Locator): Promise<string> => {
    return (await btn.locator('xpath=ancestor::div[@class="catedras"]//h3').innerText()).trim();
};

const getExamsData = async (id: string, page: Page): Promise<ExamData[]> => {
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


export const checkGrades = async (email: string, password: string) => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await login(page, email, password);
    await goToHistoriaAcademica(page);

    const buttons = page.locator('a[data-origen="EnCurso"]');
    const subjects: Subject[] = [];

    const count = await buttons.count();
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

    fs.writeFileSync(getFilePath(), JSON.stringify(subjects, null, 2), 'utf8');

    await browser.close();
};
