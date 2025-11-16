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

const getRowsInformation = async (filas: Locator, filasCount: number): Promise<ExamData[]> => {
    const results: ExamData[] = [];

    for (let j = 0; j < filasCount; j++) {
        const row = filas.nth(j);
        const cols = row.locator('td');

        const date = (await cols.nth(0).innerText()).trim();
        const description = (await cols.nth(1).innerText()).trim();
        const type = (await cols.nth(2).innerText()).trim();
        const grade = (await cols.nth(3).innerText()).trim();
        const result = (await cols.nth(4).innerText()).trim();
        results.push({
            date,
            description,
            type,
            grade,
            result
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
    const subjectsLength = await buttons.count();

    const subjects: Subject[] = [];

    // Iterate over each subject
    for (let i = 0; i < subjectsLength; i++) {
        const btn = buttons.nth(i);

        // Get subject name
        const subjectName = (await btn
            .locator('xpath=ancestor::div[@class="catedras"]//h3')
            .innerText()).trim();

        const id = await btn.getAttribute('id');
        if (!id) {
            console.log("[ERROR] No se pudo obtener el id del botón");
            continue;
        }

        // Click on "Detalle"
        await btn.click();

        // Wait on detail dropdown load
        await page.waitForSelector(`#info_det_${id}`, { state: 'visible' });

        // Check if table exists
        const selectorTable = `#info_det_${id} table`;
        const isTable = await page.locator(selectorTable).count();

        // If no table, continue to next subject
        if (isTable === 0) {
            subjects.push({ name: subjectName, examsData: [] });
            console.log(`📘 ${subjectName}: Sin evaluaciones`); //! Test purpose, Delete on final version.
            continue;
        }

        // Now wait for rows with <td>
        await page.waitForSelector(`${selectorTable} tr:has(td)`, { state: 'attached' });

        // Filter only <tr> with <td> (avoids empty headers)
        const filas = page.locator(`${selectorTable} tr:has(td)`);
        const filasCount = await filas.count();

        const examsData = filasCount > 0
            ? await getRowsInformation(filas, filasCount)
            : [];

        subjects.push({
            name: subjectName,
            examsData,
        });
    }
    // Guardar archivo
    fs.writeFileSync(getFilePath(), JSON.stringify(subjects, null, 2), "utf8");

    await browser.close();
};