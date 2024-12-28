import React, { createContext, useContext, useState } from 'react';

export type Credentials = {
  userId: number;
  email: string;
  accessToken: string;
  refreshToken: string;
};

type AuthStateType = {
  isLoaded: boolean;
  isLoggedIn: boolean;
  credentials: undefined | null | Credentials;
};

const initialState: AuthStateType = {
  isLoaded: false,
  isLoggedIn: false,
  credentials: undefined,
};

interface AuthContextI extends AuthStateType {
  setCredentials: (credentials: Credentials | null) => void;
}

const AuthContext = createContext<AuthContextI>({
  ...initialState,
  setCredentials: () => null,
});

export const AuthProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  // Credentials or null if not logged in (undefined if not loaded)
  const [credentials, setCredentials] = useState<AuthStateType["credentials"]>(initialState.credentials);

  return (
    <AuthContext.Provider
      value={{
        isLoaded: credentials !== undefined,
        isLoggedIn: !!credentials,
        credentials,
        setCredentials,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};
