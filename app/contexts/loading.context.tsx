import React, { createContext, useContext } from 'react';
import { useAuth } from '@hooks/use-auth';
import { useProducts } from '@hooks/use-products';

type LoadingStateType = {
  isLoaded: boolean;
};

const initialState: LoadingStateType = {
  isLoaded: false,
};

interface LoadingContextI extends LoadingStateType {
  load: () => Promise<void>;
}

const LoadingContext = createContext<LoadingContextI>({
  ...initialState,
  load: async () => { },
});

interface Props {
  preLoad?: () => Promise<void>;
  postLoad?: () => Promise<void>;
  children: React.ReactNode;

}

export const LoadingProvider = ({ preLoad, postLoad, children }: React.PropsWithChildren<Props>) => {
  const { isLoaded: isAuthLoaded, load: loadCredentials, credentials } = useAuth();
   const { loadProducts, isLoaded: isProductsLoaded } = useProducts();

  /**
   * Load
   */
  const load = async () => {
    // Load credentials context
    await preLoad?.();

    await loadCredentials();
    await loadProducts();

    await postLoad?.();
  };

  return (
    <LoadingContext.Provider
      value={{
        // isLoaded will only be true when isAuthLoaded is true and credentials and isProductsLoaded is either both true or false
        // This ensures that products are properly loaded when the credentials are set which might either be after the app starts or the user has logged in 
        isLoaded: isAuthLoaded && (!!credentials === isProductsLoaded),
        load,
      }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
};
