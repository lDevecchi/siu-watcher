export {};

declare global {
  interface Window {
    guaraniAPI: {
      checkNotas: (email: string, password: string) => Promise<boolean>;
    };
  }
}
