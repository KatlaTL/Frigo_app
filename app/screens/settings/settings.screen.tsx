import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, sharedStyles } from '@assets/styles';
import { Button } from '@components/button';
import { useAuth } from '@hooks/use-auth';
import { BottomTabScreenProps } from '@navigators/types';
import { useAxiosContext } from '@contexts/axios.context';

/**
 * Displays Settings Screen
 */
export const SettingsScreen = ({ navigation }: BottomTabScreenProps<'SettingsTab'>) => {
  const { signOut } = useAuth();
  const { publicAxios } = useAxiosContext();

  return (
    <SafeAreaView style={[sharedStyles.container, { backgroundColor: Colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Button color="primary" onPress={() => signOut(publicAxios)}>
          Log ud
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    margin: 40,
    justifyContent: 'flex-end',
  },
});
