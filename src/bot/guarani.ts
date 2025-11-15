import { chromium } from '@playwright/test';

export const checkNotas = async (email: string, password: string) => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://guarani.frba.utn.edu.ar/autogestion/grado/');
    await page.getByRole('textbox', { name: 'Usuario' }).click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill(email);
    await page.getByRole('textbox', { name: 'Usuario' }).press('Tab');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
    await page.getByRole('textbox', { name: 'Contraseña' }).press('Enter');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.getByRole('link', { name: 'Reportes' }).click();
    await page.getByRole('link', { name: 'Historia académica' }).click();
    await page.getByRole('link', { name: 'Materias en curso' }).click();
    await page.getByText('Historia académica Por').click();
    // TODO: Seleccionar todo el texto del div que contiene las notas. En otro archivo guardamos las notas anteriores y las comparamos
};