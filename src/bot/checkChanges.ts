// comparar.ts
import fs from 'fs';
import deepEqual from 'fast-deep-equal';
import { chromium } from '@playwright/test';
import { extractSubjects, goToHistoriaAcademica, login } from '../utils/commands';
import { Subject } from '../utils/types';
import { getFilePath, updateSubjectsFile } from '../utils/functions';

const compareForUpdates = (oldSubjects: Subject[], newSubjects: Subject[]) => {
    const changes = [];
    for (const subj of newSubjects) {
        const old = oldSubjects.find(s => s.name === subj.name);

        if (!old) {
            console.log(`🆕 Nueva materia detectada: ${subj.name}`);
            continue;
        }

        // Check for changes in examsData
        if (!deepEqual(old.examsData, subj.examsData)) {
            console.log(`Cambios en notas de ${subj.name}`);
            changes.push({ subject: subj.name, examsData: subj.examsData });
        }
    }

    // Update the stored subjects only if there are changes
    if (changes.length > 0) updateSubjectsFile(newSubjects);

    return changes;
};

export const checkChanges = async (email: string, password: string) => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await login(page, email, password);
    await goToHistoriaAcademica(page);

    const newSubjects: Subject[] = await extractSubjects(page);

    // Close the browser after extracting subjects
    await browser.close();

    let oldSubjects: Subject[] = [];

    const path = getFilePath();
    if (fs.existsSync(path)) {
        oldSubjects = JSON.parse(fs.readFileSync(path, 'utf8')) as Subject[];
    }

    return compareForUpdates(oldSubjects, newSubjects);
};