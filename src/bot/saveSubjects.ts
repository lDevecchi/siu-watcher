import { chromium } from '@playwright/test';
import { extractSubjects, goToHistoriaAcademica, login } from '../utils/commands';
import { ResponseStatus, Subject } from '../utils/types';
import { updateSubjectsFile } from '../utils/functions';

export const saveSubjects = async (email: string, password: string): Promise<ResponseStatus> => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await login(page, email, password);
    } catch (error) {
        console.error(error);
        return ResponseStatus.INVALID_CREDENTIALS;
    }
    
    try {
        await goToHistoriaAcademica(page);
    } catch (error) {
        console.error(error);
        return ResponseStatus.ERR_ACCESS_ACADEMIC_RECORD;
    }

    let subjects: Subject[] = [];

    try {
        subjects = await extractSubjects(page);
    } catch (error) {
        console.error(error);
        return ResponseStatus.ERR_GET_SUBJECTS;
    }

    await browser.close();

    // Write subjects on subjectsInfo.txt
    updateSubjectsFile(subjects);

    return ResponseStatus.SUCCESS;
};