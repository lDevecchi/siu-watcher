import { ResponseStatus, Subject } from "./utils/types";

export { };

declare global {
  interface Window {
    guaraniAPI: {
      getSubjects: (email: string, password: string) => Promise<ResponseStatus>;
      checkForChanges: (email: string, password: string) => Promise<[Subject[] | null, ResponseStatus]>;
      toggleCronJob: (email: string, password: string) => Promise<{ running: boolean; }>;
      onCronJobUpdate: (callback: (updated: boolean) => void) => void;
      onCronJobError: (callback: (error: string) => void) => void;
    };
  }
}
