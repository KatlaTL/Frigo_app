# frigoReactNative
This project is build on the Pentia Mobile React Native Template.
Includes React Navigation with Stack and Bottom Tabs, 
TanStack Query and Axios with automatic refresh token support.

## Enviroment
### Add the following to your ~/.zshrc file
```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export NODE_ENV=22.2.0
```

## Setup, run and deploy
### 1. Setup
Init the project and install dependencies.

```bash
npx react-native init --template @pentiamobile/react-native-template
yarn
npx react-native-rename@latest -b "BUNDLE_IDENTIFER"
npx pod-install
```
__^ BUNDLE_IDENTIFIER = new bundle name (iOS) or package name (Android) __

### 2. Run
```bash
yarn android
yarn ios
```

### 3. Clean project
```bash
yarn clean
```

### 4.1. Deploy iOS
Build and archive with Xcode and upload to App Store for testing using TestFlight.

### 4.2. Deploy Android
Find keystore passwords in Secure Notes.

Add the following configuration to your `~/.gradle/gradle.properties` file

```
MYAPP_UPLOAD_STORE_FILE=frigoreactnative-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=frigoreactnative-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=******
MYAPP_UPLOAD_KEY_PASSWORD=******
```

Build `.aab` file with the following command:
```bash
yarn deploy
```

Upload `./app/build/outputs/app-release.aab` to Google Play.
