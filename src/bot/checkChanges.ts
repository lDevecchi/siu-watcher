// comparar.ts
import fs from 'fs';
import deepEqual from 'fast-deep-equal';
import { chromium } from '@playwright/test';
import { extractSubjects, goToHistoriaAcademica, login } from '../utils/commands';
import { Subject } from '../utils/types';
import { getFilePath } from '../utils/functions';

export const checkChanges = async (email: string, password: string) => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await login(page, email, password);
    await goToHistoriaAcademica(page);

    const newSubjects: Subject[] = await extractSubjects(page);

    let oldSubjects: Subject[] = [];
    const path = getFilePath();
    if (fs.existsSync(path)) {
        oldSubjects = JSON.parse(fs.readFileSync(path, 'utf8')) as Subject[];
    }

    for (const subj of newSubjects) {
        const old = oldSubjects.find(s => s.name === subj.name);
        if (!old) {
            console.log(`🆕 Nueva materia detectada: ${subj.name}`);
            continue;
        }
        if (!deepEqual(old.examsData, subj.examsData)) {
            console.log(`✏️ Cambios en notas de ${subj.name}`);
        }
    }

    await browser.close();
};
