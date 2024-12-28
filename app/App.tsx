/**
 * React Native Template
 *
 * @format
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { AuthProvider } from '@contexts/auth.context';
import { AxiosProvider } from '@contexts/axios.context';
import { LoadingProvider } from '@contexts/loading.context';
import { RootNavigator } from '@navigators/root.navigator';
import { ProductProvider } from '@contexts/product.context';

const retryConfig = (retries: number) => {
  return {
    retry: (failureCount: number, error: Error) => {
      if (error?.message.includes("Network Error")) {
        return failureCount < retries;
      }
      return false;
    },
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 10000), // doubles the amount of time between each retry. The first retry is 1000 ms, second is 2000 ms and third is 4000 ms
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...retryConfig(2)
    },
    mutations: {
      ...retryConfig(1)
    }
  }
});

enableScreens();

const App = gestureHandlerRootHOC(() => {
  return (
    <RootSiblingParent>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <ProductProvider>
              <AxiosProvider>
                <LoadingProvider>
                  <RootNavigator />
                </LoadingProvider>
              </AxiosProvider>
            </ProductProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  );
});

export default App;
