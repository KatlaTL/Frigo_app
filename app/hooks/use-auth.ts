import { Settings } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { Credentials, useAuthContext } from '@contexts/auth.context';
import { IS_IOS } from '~/constants';
import { useProductContext } from '@contexts/product.context';
import { AuthService } from '@services/Auth.service';
import { AxiosInstance } from 'axios';

/**
 * Auth hook
 */
export const useAuth = () => {
  const authContext = useAuthContext();
  const productContext = useProductContext();

  /**
   * Load credentials from Keychain
   */
  const load = async () => {
    if (IS_IOS && !Settings.get('hasOpened')) {
      // Remove previous saved credentials (after reinstall) on iOS
      await removeCredentials();
      Settings.set({ hasOpened: true });
    }
    try {
      // Load credentials
      const value = await Keychain.getGenericPassword();
      if (value !== false) {
        const credentials: Credentials = JSON.parse(value.password);
        authContext.setCredentials(credentials);
      } else {
        authContext.setCredentials(null);
      }
    } catch (e) {
      authContext.setCredentials(null);
    }
  };

  /**
   * Save credentials to Keychain
   */
  const saveCredentials = async (credentials: Credentials) => {
    await Keychain.setGenericPassword('token', JSON.stringify(credentials));
  };

  /**
   * Remove credentials from Keychain
   */
  const removeCredentials = async () => {
    await Keychain.resetGenericPassword();
  };

  /**
   * Perform sign out and remove credentials
   */
  const signOut = async (axiosInstance: AxiosInstance) => {
    const { credentials } = authContext;

    // Invalid the refresh token
    if (credentials && axiosInstance) {
      await new AuthService(axiosInstance)
        .signOut(credentials.userId, credentials.email)
        .catch((err) => console.error(err));
    }

    // Remove credentials from localstorage
    authContext.setCredentials(null);
    await removeCredentials();
    productContext.actionDispatch?.resetProductAndFavoriteState();
  };

  return {
    load,
    signOut,
    saveCredentials,
    ...authContext,
  };
};
