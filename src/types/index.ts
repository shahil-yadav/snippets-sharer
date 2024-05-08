export enum AuthStates {
  login = "Login",
  signup = "Sign-up",
}

export type TItems = {
  documentId?: string;
  description: string;
  header: JSX.Element;
  icon: JSX.Element;
  snippetRef: string;
  title: string;
}[];
