import { chromium } from '@playwright/test';
import { extractSubjects, goToHistoriaAcademica, login } from '../utils/commands';
import { Subject } from '../utils/types';
import { updateSubjectsFile } from '../utils/functions';

export const saveSubjects = async (email: string, password: string) => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await login(page, email, password);
    await goToHistoriaAcademica(page);

    const subjects: Subject[] = await extractSubjects(page);
    updateSubjectsFile(subjects);

    await browser.close();
};
