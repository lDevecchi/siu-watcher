import { chromium, Locator, Page } from '@playwright/test';

const login = async (page: Page, email: string, password: string) => {
    await page.goto('https://guarani.frba.utn.edu.ar/autogestion/grado/');
    await page.getByRole('textbox', { name: 'Usuario' }).click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill(email);
    await page.getByRole('textbox', { name: 'Usuario' }).press('Tab');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
};

const goToHistoriaAcademica = async (page: Page) => {
    await page.goto('https://guarani.frba.utn.edu.ar/autogestion/grado/historia_academica');

    await page.waitForTimeout(200);
    await page.getByText('En curso', { exact: true }).click();
    await page.waitForTimeout(200);
};

const getRowInformation = async (filas: Locator, filasCount: number) => {
    for (let j = 0; j < filasCount; j++) {
        const fila = filas.nth(j);
        const cols = fila.locator('td');

        const fecha = (await cols.nth(0).innerText()).trim();
        const descripcion = (await cols.nth(1).innerText()).trim();
        const tipo = (await cols.nth(2).innerText()).trim();
        const nota = (await cols.nth(3).innerText()).trim();
        const resultado = (await cols.nth(4).innerText()).trim();

        console.log({
            fecha,
            descripcion,
            tipo,
            nota,
            resultado
        });
    }
};

export const checkNotas = async (email: string, password: string) => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await login(page, email, password);

    await goToHistoriaAcademica(page);

    const botones = page.locator('a[data-origen="EnCurso"]');
    const subjectsLength = await botones.count();

    // Itera por cada materia
    for (let i = 0; i < subjectsLength; i++) {
       const btn = botones.nth(i);

    const id = await btn.getAttribute('id');
    if (!id) {
        console.log("[ERROR] No se pudo obtener el id del botón");
        continue;
    }

    // Obtener el nombre de la materia
    const nombreMateria = (await btn
        .locator('xpath=ancestor::div[@class="catedras"]//h3')
        .innerText()).trim();

    // Abrir detalle
    await btn.click();

    // ==== Verificar si hay tabla ====
    const selectorTabla = `#info_det_${id} table`;
    const existeTabla = await page.locator(selectorTabla).count();

    if (existeTabla === 0) {
        console.log(`📘 ${nombreMateria}: No hay información sobre evaluaciones`);
        continue;
    }

    // Esperar filas con datos
    await page.waitForSelector(`${selectorTabla} tr:has(td)`);

    const filas = page.locator(`${selectorTabla} tr:has(td)`);
    const filasCount = await filas.count();

    if (filasCount === 0) {
        console.log(`📘 ${nombreMateria}: Tabla presente pero vacía`);
        continue;
    }

    console.log(`📘 ${nombreMateria}:`);

        await getRowInformation(filas, filasCount);
    }

    await browser.close();

    // TODO: Seleccionar todo el texto del div que contiene las notas. En otro archivo guardamos las notas anteriores y las comparamos
};