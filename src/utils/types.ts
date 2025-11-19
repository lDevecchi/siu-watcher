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

export enum ResponseStatus {
    SUCCESS = 'SUCCESS',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    ERR_ACCESS_ACADEMIC_RECORD = 'ERR_ACCESS_ACADEMIC_RECORD',
    ERR_GET_SUBJECTS = 'ERR_GET_SUBJECTS',
}