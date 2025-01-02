import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, sharedStyles } from '@assets/styles';
import { Button } from '@components/button';
import { useAxiosContext } from '@contexts/axios.context';
import { useAuth } from '@hooks/use-auth';
import { SigninScreenProps } from '@navigators/auth.navigator';
import { AuthService } from '@services/Auth.service';
import { IS_IOS } from '~/constants';
import { SignInInput } from './_components/text-input';
import { Logo } from '@components/logo';
import { Gradient } from '@components/gradient';
import { useToast } from '@hooks/use-toast';

/**
 * Displays the signin Screen
 */
export const SigninScreen = ({ }: SigninScreenProps) => {
  const { publicAxios } = useAxiosContext();
  const { setCredentials, saveCredentials } = useAuth();

  const toast = useToast();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const passwordInputRef = useRef<TextInput>(null);

  /**
   * Sign In using email and password
   */
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);

    return new AuthService(publicAxios).signIn(email, password);
  };

  /**
   * Perform Sign In
   */
  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (data: any) => {
      if (!!data.credentials.accessToken && !!data.credentials.refreshToken) {
        await saveCredentials(data.credentials);
        setCredentials(data.credentials);
      }
    },
    onError: async () => {
      setEmail("");
      setPassword("");
      setIsLoading(false);

      toast.error({
        title: "Log ind mislykkedes"
      })
    },
  });


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={IS_IOS ? 'padding' : 'height'}
        style={styles.flex}
      >
        <Gradient style={styles.flex}>
          <SafeAreaView style={styles.flex}>

            <View style={styles.logoViewStyle}>
              <Logo height={220} width={220} />

              <Text style={styles.headerStyle}>Beverages and snacks</Text>
            </View>

            <View style={styles.loginViewStyle}>
              <SignInInput
                style={styles.emailInputField}
                placeholder="Email"
                isLoading={isLoading}
                returnKeyType="next"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <View style={styles.passwordViewStyle}>
                <SignInInput
                  ref={passwordInputRef}
                  style={styles.passwordInputField}
                  placeholder="Password"
                  isLoading={isLoading}
                  secureTextEntry={true}
                  returnKeyType="go"
                  textContentType="password"
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={() => signInMutation.mutate({ email: email, password: password })}
                />

                <TouchableOpacity
                  style={styles.linkViewStyle}
                  onPress={() => toast.error({ title: "Glemt password", message: "ikke implementeret" })}>
                  <Text style={styles.resetPasswordlinkText}>
                    Glemt?
                  </Text>
                </TouchableOpacity>

              </View>

              <Button
                style={styles.signInButton}
                color="light"
                onPress={() => {
                  signInMutation.mutate({ email: email, password: password });
                }}>
                Log ind
              </Button>

              <TouchableOpacity
                style={styles.linkViewStyle}
                onPress={() => toast.error({ title: "FaceID", message: "ikke implementeret" })}>
              <Text style={styles.faceIdlinkText}>Brug Face ID</Text>
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </Gradient>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback >
  );

};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
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
  loginViewStyle: {
    flex: 3,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  emailInputField: {
    ...sharedStyles.fontInter,
    fontWeight: '300',
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    fontSize: 16,
    height: 48
  },
  passwordViewStyle: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 5,
    marginTop: 8,
  },
  passwordInputField: {
    flex: 3,
    ...sharedStyles.fontInter,
    fontWeight: '300',
    borderWidth: 1,
    borderColor: Colors.white,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    height: 48
  },
  linkViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  resetPasswordlinkText: {
    ...sharedStyles.fontInter,
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.primary,
    fontSize: 16,
  },
  signInButton: {
    marginTop: 15,
    backgroundColor: Colors.secondary,
    shadowColor: '#000',
    ...Platform.select<ViewStyle>({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      }
    })
  },
  faceIdlinkText: {
    ...sharedStyles.fontInter,
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.white,
    fontSize: 16,
  },
});

