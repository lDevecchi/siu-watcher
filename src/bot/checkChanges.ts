// comparar.ts
import fs from 'fs';
import deepEqual from 'fast-deep-equal';
import { chromium } from '@playwright/test';
import { extractSubjects, goToHistoriaAcademica, login } from '../utils/commands';
import { ResponseStatus, Subject } from '../utils/types';
import { getFilePath, updateSubjectsFile } from '../utils/functions';

const compareForUpdates = (oldSubjects: Subject[], newSubjects: Subject[]): [Subject[] | null, ResponseStatus] => {
    const changes: Subject[] = [];
    for (const subj of newSubjects) {
        const old = oldSubjects.find(s => s.name === subj.name);

        if (!old) {
            console.log(`🆕 Nueva materia detectada: ${subj.name}`); //! Delete post tests.
            continue;
        }

        // Check for changes in examsData
        if (!deepEqual(old.examsData, subj.examsData)) {
            console.log(`Cambios en notas de ${subj.name}`); //! Delete post tests.
            changes.push({ name: subj.name, examsData: subj.examsData });
        }
    }

    // Update the stored subjects only if there are changes
    if (changes.length > 0) updateSubjectsFile(newSubjects);

    return [changes, ResponseStatus.SUCCESS];
};

export const checkChanges = async (email: string, password: string): Promise<[Subject[] | null, ResponseStatus]> => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await login(page, email, password);
    } catch (error) {
        console.error(error);
        return [null, ResponseStatus.INVALID_CREDENTIALS];
    }

    try {
        await goToHistoriaAcademica(page);
    } catch (error) {
        console.error(error);
        return [null, ResponseStatus.ERR_ACCESS_ACADEMIC_RECORD];
    }

    let newSubjects: Subject[] = [];
    try {
        newSubjects = await extractSubjects(page);
    } catch (error) {
        console.error(error);
        return [null, ResponseStatus.ERR_GET_SUBJECTS];
    }

    // Close the browser after extracting subjects
    await browser.close();

    let oldSubjects: Subject[] = [];

    const path = getFilePath();
    if (fs.existsSync(path)) {
        oldSubjects = JSON.parse(fs.readFileSync(path, 'utf8')) as Subject[];
    }

    return compareForUpdates(oldSubjects, newSubjects);
};