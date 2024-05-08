import { useContext } from "react";
import { AuthContext } from "./auth-provider";

export const useAuthContext = () => useContext(AuthContext);
