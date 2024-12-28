import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import React, { createContext, useContext } from 'react';

import { API_BASE_URL, LOCALHOST_API_BASE_URL } from '~/constants';
import { useAuth } from '@hooks/use-auth';
import { Credentials, useAuthContext } from './auth.context';
import { useProductContext } from './product.context';

interface AxiosContextI {
  publicAxios: AxiosInstance;
  authAxios: AxiosInstance;
}

type RefreshResponse = {
  credentials: {
    userId: number;
    accessToken: string;
    refreshToken: string;
  }
}

const AxiosContext = createContext<AxiosContextI | undefined>(undefined);

export const AxiosProvider = ({ children }: React.PropsWithChildren) => {
  const { credentials, setCredentials, saveCredentials, signOut } = useAuth();

  const authContext = useAuthContext();
  const productContext = useProductContext();

  if (!authContext || !productContext) {
    return null; // Wait for context initialization
  }

  const publicAxios = axios.create({
    baseURL: LOCALHOST_API_BASE_URL + "/api/v1/app"
  });

  publicAxios.interceptors.request.use(
    config => {
      config.headers['Content-Type'] = 'application/json'
      config.headers['Accept'] = 'application/json'

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  )

  const authAxios = axios.create();

  authAxios.interceptors.request.use(
    config => {
      // Add 'Authorization' header
      if (!config.headers.Authorization && credentials?.accessToken) {
        config.headers.Authorization = `Bearer ${credentials.accessToken}`;
      }

      config.headers['Content-Type'] = 'application/json'
      config.headers['Accept'] = 'application/json'

      if (credentials?.userId) {
        config.baseURL = LOCALHOST_API_BASE_URL + `/api/v1/app/protected/users/${credentials.userId}`
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const refreshAuthLogic = async (failedRequest: any) => {
    if (!credentials) {
      console.log('Could not refresh access token. Missing credentials');
      return Promise.reject();
    }

    console.log('Refreshing access token...');
    try {
      const tokenRefreshResponse = await publicAxios.post<RefreshResponse>("auth/refresh-token", {
        refreshToken: credentials.refreshToken,
      });

      if (tokenRefreshResponse.status === 200) {
        // Update accessToken on original request
        failedRequest.response.config.headers.setAuthorization(`Bearer ${tokenRefreshResponse.data.credentials.accessToken}`);
        // Save credentials with new access and refresh tokens
        const newCredentials: Credentials = {
          ...credentials,
          accessToken: tokenRefreshResponse.data.credentials.accessToken,
          refreshToken: tokenRefreshResponse.data.credentials.refreshToken,
        };

        await saveCredentials(newCredentials);
        setCredentials(newCredentials);

        console.log('Refreshing access token complete!');
        return Promise.resolve();
      } else {
        console.log('Failed to refresh access token:', tokenRefreshResponse);
        await signOut(publicAxios);
        return Promise.reject();
      }
    } catch (error) {
      console.log('Failed to refresh access token:', error);
      await signOut(publicAxios);
      return Promise.reject(error);
    }
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic);  

  return <AxiosContext.Provider value={{ publicAxios, authAxios }}>{children}</AxiosContext.Provider>;
};

export const useAxiosContext = () => {
  const context = useContext(AxiosContext);
  if (context === undefined) {
    throw new Error('useAxiosContext must be used within a AxiosProvider');
  }
  return context;
};
