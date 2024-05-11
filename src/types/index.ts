export enum AuthStates {
  login = "Login",
  signup = "Sign-up",
}

export enum WorkerThreadMessages {
  onAuthStateChanged = "ON_AUTH_STATE_CHANGED",
}

export type TItems = {
  documentId?: string;
  description: string;
  header: JSX.Element;
  icon: JSX.Element;
  snippetRef: string;
  title: string;
}[];
