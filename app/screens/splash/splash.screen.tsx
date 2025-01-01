import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VersionNumber from 'react-native-version-number';
import { Colors, sharedStyles } from '@assets/styles';
import { useLoadingContext } from '@contexts/loading.context';
import { Gradient } from '@components/gradient';
import { Logo } from '@components/logo';
import { useToast } from '@hooks/use-toast';

/**
 * Displays a logo and spinner when App opens (from cold start)
 */
export const SplashScreen = () => {
  const { load } = useLoadingContext();
  const toast = useToast();

  /**
   * Begin loading at startup
   */
  useEffect(() => {
    setTimeout(() => {
      beginLoading();
    }, 3000);
  }, []);

  /**
   * Load
   */
  const beginLoading = async () => {
    try {
      await load();
    } catch (err) {
      toast.error({ title: "Noget gik galt. Prøv igen" });
    }
  };

  return (
    <Gradient style={styles.container}>
      <SafeAreaView style={styles.container}>

        <View style={styles.logoViewStyle}>
          <Logo height={220} width={220} />

          <Text style={styles.headerStyle}>Beverages and snacks</Text>
        </View>

        <View style={styles.content}>
          <ActivityIndicator style={styles.spinner} size="large" color={Colors.white} />
          <Text style={styles.version}>Version {VersionNumber.appVersion}</Text>
        </View>

      </SafeAreaView>
    </Gradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 3,
    justifyContent: 'center',
  },
  logoViewStyle: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  headerStyle: {
    ...sharedStyles.fontInter,
    color: Colors.white,
    fontWeight: '500',
    fontSize: 19,
  },
  title: {
    ...sharedStyles.textSemiBold,
    fontSize: 30,
    color: Colors.white,
    textAlign: 'center',
  },
  spinner: {
    justifyContent: 'flex-start',
    marginTop: 80,
    flex: 1
  },
  version: {
    marginBottom: 20,
    ...sharedStyles.textSemiBold,
    fontSize: 12,
    color: Colors.white,
    textAlign: 'center',
  },
});
