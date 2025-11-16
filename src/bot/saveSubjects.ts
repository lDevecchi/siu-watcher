import { chromium } from '@playwright/test';
import fs from 'fs';
import { extractSubjects, getExamsData, getSubjectName, goToHistoriaAcademica, login } from '../utils/commands';
import { Subject } from '../utils/types';
import { getFilePath } from '../utils/functions';

export const saveSubjects = async (email: string, password: string) => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await login(page, email, password);
    await goToHistoriaAcademica(page);

    const subjects: Subject[] = await extractSubjects(page);

    fs.writeFileSync(getFilePath(), JSON.stringify(subjects, null, 2), 'utf8');

    await browser.close();
};
