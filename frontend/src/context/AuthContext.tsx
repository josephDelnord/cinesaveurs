import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getTokenAndPseudoFromLocalStorage } from "../localstorage/localstorage";

interface AuthContextProps {
  isAdmin: boolean;
  isLoading: boolean;
}

interface AuthContextProps {
  isAdmin: boolean;
  isLoading: boolean;
}
export const AuthContext = createContext<AuthContextProps>({
  isAdmin: false,
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = getTokenAndPseudoFromLocalStorage();
      if (user?.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
