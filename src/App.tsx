import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ScreenProvider from './navigation/screenProvider';
import ThemeProvider from './themeProvider';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { myStore } from './redux/store/myStore';
import { CityProvider } from './Context/CityProvider';
import { CityAlertsProvider } from './Context/CityProviderAlerts';
import { LogBox, Alert, PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import messaging, {
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
// import notifee, {AndroidImportance} from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import {
  NotificationListner,
  requestNotificationPermission,
} from './utils/CommonUtill';

// Suppress all log warnings
// LogBox.ignoreAllLogs(true);

// // Define headless task for background messages
// const YourHeadlessTask = async (
//   remoteMessage: FirebaseMessagingTypes.RemoteMessage,
// ) => {
//   console.log('Background Message:', remoteMessage);
// };

// AppRegistry.registerHeadlessTask(
//   'ReactNativeFirebaseMessagingHeadlessTask',
//   () => YourHeadlessTask,
// );

const requestUserPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // For Android 13 and above
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted.');
        } else {
          Alert.alert('Permission Denied', 'You need to allow notifications.');
        }
      } else {
        // No permission needed for Android 12 and below
        console.log(
          'Notification permission is automatically granted for this Android version.',
        );
      }
    } else {
      // iOS-specific permission request
      const authStatus = await messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        sound: true,
      });

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted for iOS.');
      } else {
        console.warn('Notification permission denied for iOS.');
        Alert.alert('Permission Denied', 'Notifications will not work.');
      }
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
  }
};

const App: React.FC = () => {
  // Request user permission and initialize notification listener
  // useEffect(() => {
  //   requestUserPermission();
  //   requestNotificationPermission();
  //   NotificationListner();
  // }, []);

  // Display local notification using Notifee
  // const displayNotification = async (
  //   remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  // ) => {
  //   if (remoteMessage.notification) {
  //     await notifee.displayNotification({
  //       title: remoteMessage.notification.title,
  //       body: remoteMessage.notification.body,
  //       android: {
  //         channelId: 'default',
  //         importance: AndroidImportance.HIGH,
  //       },
  //     });
  //   }
  // };

  // // Handle FCM messages for both foreground and background states
  // useEffect(() => {
  //   const handleFCMMessage = async (
  //     remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  //   ) => {
  //     console.log('FCM Message:', remoteMessage);
  //     // Display notification if app is in the foreground
  //     await displayNotification(remoteMessage);
  //   };

  //   // Listener for foreground messages
  //   const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
  //     handleFCMMessage(remoteMessage);
  //   });

  //   // Listener for background messages
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     handleFCMMessage(remoteMessage);
  //   });

  //   // Cleanup
  //   return () => {
  //     unsubscribeForeground();
  //   };
  // }, []);

  // // Get and log the device FCM token
  // useEffect(() => {
  //   const getToken = async () => {
  //     try {
  //       await messaging().registerDeviceForRemoteMessages();
  //       const token = await messaging().getToken();
  //       console.log('Device FCM Token:', token);
  //     } catch (error) {
  //       console.error('Error fetching FCM token:', error);
  //     }
  //   };

  //   getToken();
  // }, []);

  // // Create a notification channel for Android
  // useEffect(() => {
  //   const createNotificationChannel = async () => {
  //     await notifee.createChannel({
  //       id: 'default',
  //       name: 'Default Channel',
  //       importance: AndroidImportance.HIGH,
  //     });
  //   };

  //   createNotificationChannel();
  // }, []);

  // Hide the splash screen once the app is loaded
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={myStore}>
        <CityProvider>
          <CityAlertsProvider>
            <NavigationContainer>
              <ThemeProvider>
                <ScreenProvider />
              </ThemeProvider>
            </NavigationContainer>
          </CityAlertsProvider>
        </CityProvider>
      </Provider>
    </SafeAreaProvider>

  );
};

export default App;
