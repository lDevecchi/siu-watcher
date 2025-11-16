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
