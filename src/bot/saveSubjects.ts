import { chromium } from '@playwright/test';
import { extractSubjects, goToHistoriaAcademica, login } from '../utils/commands';
import { Subject } from '../utils/types';
import { updateSubjectsFile } from '../utils/functions';

export const saveSubjects = async (email: string, password: string): Promise<boolean> => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await login(page, email, password);
    await goToHistoriaAcademica(page);

    const subjects: Subject[] = await extractSubjects(page);
    await browser.close();
    updateSubjectsFile(subjects);

    return true;
};
