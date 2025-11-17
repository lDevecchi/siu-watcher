export {};

declare global {
  interface Window {
    guaraniAPI: {
      getSubjects: (email: string, password: string) => Promise<boolean>;
      checkForChanges: (email: string, password: string) => Promise<boolean>;
      toggleWatch: (email: string, password: string) => Promise<{ running: boolean }>;
      onWatchUpdate: (callback: (updated: boolean) => void) => void;
      onWatchError: (callback: (error: string) => void) => void;
    };
  }
}
