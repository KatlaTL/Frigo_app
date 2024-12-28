import { APIBaseURL } from '../app.json';
import { Platform } from 'react-native';

// APP Environment (used for API)
export const APP_ENV: 'development' | 'test' | 'production' = 'test';

// API Base URL
export const API_BASE_URL = APIBaseURL[APP_ENV];

export const IS_IOS = Platform.OS === 'ios';

export const IS_ANDROID = Platform.OS === 'android';

// API Base URL for Localhost api test
export const LOCALHOST_API_BASE_URL = IS_ANDROID ? "http://10.0.2.2:3000" : "http://localhost:3000";

export const currency = "DKK";

export const dateTimeFormatOptions = {
    historySectionHeader: {
        month: "long",
        year: "numeric"
    } as Intl.DateTimeFormatOptions,
    historyItem: {
        day: "2-digit",
        month: "long"
    } as Intl.DateTimeFormatOptions,
}