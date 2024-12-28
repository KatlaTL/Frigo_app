/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';

import { name as appName } from './app.json';
import App from './app/App';

AppRegistry.registerComponent(appName, () => App);

LogBox.ignoreLogs(["new NativeEventEmitter", "Sending `onAnimatedValueUpdate` with no listeners registered."]);
