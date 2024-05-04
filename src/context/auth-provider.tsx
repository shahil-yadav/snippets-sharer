import React, { useContext, useState } from "react";
import { createContext } from "react";
import { User } from "firebase/auth";

const defaulVal: {
  user: null | User;
  setUser: React.Dispatch<React.SetStateAction<null | User>>;
} = {
  user: null,
  setUser: () => {},
};
const AuthContext = createContext(defaulVal);
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
