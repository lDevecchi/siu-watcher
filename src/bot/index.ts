import cron, { ScheduledTask } from 'node-cron';
import { ResponseStatus, Subject } from "../utils/types";
import { checkChanges } from "./checkChanges";
import { saveSubjects } from "./saveSubjects";

export async function getSubjects(email: string, password: string) {
    return await saveSubjects(email, password);
}

// Global cronjob to handle in different functions.
let cronJob: ScheduledTask | null = null;

export async function checkForChanges(email: string, password: string): Promise<[Subject[] | null, ResponseStatus]> {
// TODO: cronjobs needs to execute checkChanges. only stops if it founds changes or cronjob.stop()
    let changes: Subject[] | null = null;
    let responseStatus: ResponseStatus = ResponseStatus.SUCCESS;

    // if (!cronJob) {
    //     cronJob = cron.schedule('* * * * *', async () => {
    //         const [asdchanges, asdresponseStatus] = await checkChanges(email, password);
    //         changes = asdchanges;
    //         responseStatus = asdresponseStatus;
    //         return [changes, responseStatus];
    //     });
    // }
    return [changes, responseStatus];
}

export function toggleCronJob(): { running: boolean } {
    if (!cronJob) return { running: false };

    if (cronJob.getStatus() === "scheduled") {
        cronJob.stop();
        return { running: false };
    } else {
        cronJob.start();
        return { running: true };
    }
}