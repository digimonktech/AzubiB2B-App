import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, Linking } from 'react-native';
import LottieView from 'lottie-react-native';
import { getApiCall } from '@/utils/ApiHandler';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';

const LoaderAnimation = require('../assets/images/animation_lmzwwr3b.json');
export let colorDynamic1 = '';
export let colorDynamic2 = '';
export let manageEmail = '';
export let manageSavedJob = '';

export default function SplashScreen({ navigation }) {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const initializeApp = async () => {
  //     try {
  //       // 1️⃣ FCM Token fetch
  //       await messaging().registerDeviceForRemoteMessages();
  //       const token = await messaging().getToken();
  //       console.log('----------Token-----------', token);

  //       // 2️⃣ Company API call
  //       await getCompany(token);

  //       // 3️⃣ Deep link check
  //       const url = await Linking.getInitialURL();
  //       console.log('Deep link URL:', url);

  //       if (url) {
  //         // Example: http://azubib2b/aktuelle-jobs
  //         if (url.includes('aktuelle-jobs')) {
  //           // navigation.replace('Aktuelle Jobs'); // tera Jobs tab ka screen name
  //         } else {
  //           // navigation.replace('DrawerDashboard'); // fallback
  //         }
  //       } else {
  //         // 4️⃣ Normal flow if no deep link
  //         setTimeout(() => {
  //           // navigation.replace('DrawerDashboard');
  //         }, 2000);
  //       }
  //     } catch (error) {
  //       console.error('Splash init error:', error);
  //       // fallback navigation on error
  //       navigation.replace('DrawerDashboard');
  //     } finally {
  //       // setLoading(false); // Loader hide
  //     }
  //   };

  //   initializeApp();
  // }, []);


  // useEffect(() => {
  //   const getToken = async () => {
  //     await messaging().registerDeviceForRemoteMessages();
  //     const token = await messaging().getToken();
  //     console.log('----------Token-----------', token);
  //     await getCompany(token);
  //   };

  //   getToken();
  //   // const timer = setTimeout(() => {
  //   //   navigation.replace('DrawerDashboard');
  //   // }, 3000);

  //   // return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   const handleLink = async () => {
  //     const url = await Linking.getInitialURL();
  //     console.log('deep url ', url);

  //     if (url.includes('aktuelle-jobs')) {
  //       console.log('Navigating to Aktuelle Jobs via deep link', url.includes('aktuelle-jobs'));
  //       navigation.replace('Aktuelle Jobs');
  //     }
  //     setTimeout(() => {
  //       navigation.replace('DrawerDashboard');
  //     }, 3000);
  //   };

  //   handleLink();
  // }, []);


  // useEffect(() => {
  //   const handleLink = async () => {
  //     const url = await Linking.getInitialURL();
  //     console.log('deep url ', url);

  //     if (url && url.includes('aktuelle-jobs')) {
  //       console.log('Navigating to Aktuelle Jobs via deep link', url);
  //       // navigation.replace('Aktuelle Jobs');

  //       // Navigate to DrawerDashboard, then Tab -> "Aktuelle Jobs"
  //       navigation.navigate('DrawerDashboard', {
  //         screen: 'Tab', // the Tab navigator inside DrawerDashboard
  //         params: {
  //           screen: 'Aktuelle Jobs', // the Tab screen
  //         },
  //       });

  //     } else {
  //       // Only navigate to default screen if no deep link
  //       setTimeout(() => {
  //         navigation.replace('DrawerDashboard');
  //       }, 3000);
  //     }
  //   };

  //   handleLink();
  // }, []);


  useEffect(() => {
    const handleLink = async () => {
      const url = await Linking.getInitialURL();
      console.log('deep url', url);

      if (!url) {
        setTimeout(() => navigation.replace('DrawerDashboard'), 2000);
        return;
      }

      const deepLinkMap = {
        // Tab Screens inside DrawerDashboard → Tab
        'aktuelle-jobs': { type: 'tab', drawer: 'DrawerDashboard', tab: 'Aktuelle Jobs' },
        'meine-daten': { type: 'tab', drawer: 'DrawerDashboard', tab: 'Meine Daten' },
        'unternehmen': { type: 'tab', drawer: 'DrawerDashboard', tab: 'Unternehmen' },
        'jobwall': { type: 'tab', drawer: 'DrawerDashboard', tab: 'JobWall' },
        'meine-jobs': { type: 'tab', drawer: 'DrawerDashboard', tab: 'Meine Jobs' },

        // Drawer-level screens
        'job-alerts': { type: 'drawer', screen: 'JobAlerts' },
        'about-us': { type: 'drawer', screen: 'AboutUs' },
        'privacy-policy': { type: 'drawer', screen: 'PrivacyPolicy' },
        'application-tips': { type: 'drawer', screen: 'ApplicationTips' },
        'contact': { type: 'drawer', screen: 'Contact' },

        // Stack screens (outside Drawer)
        'details-job': { type: 'stack', screen: 'DetailsJobs' },
        'details-company': { type: 'stack', screen: 'DetailsCompany' },
        'qr-screen': { type: 'stack', screen: 'QRScreen' },
      };


      let target = null;
      for (const key in deepLinkMap) {
        if (url.includes(key)) {
          target = deepLinkMap[key];
          break;
        }
      }

      if (target) {
        switch (target.type) {
          case 'tab':
            navigation.navigate(target.drawer, {
              screen: 'Tab',
              params: { screen: target.tab },
            });
            break;

          case 'drawer':
            navigation.navigate(target.screen);
            break;

          case 'stack':
            navigation.navigate(target.screen);
            break;

          default:
            setTimeout(() => navigation.replace('DrawerDashboard'), 2000);
            break;
        }
      } else {
        setTimeout(() => navigation.replace('DrawerDashboard'), 2000);
      }
    };

    handleLink();
  }, []);



  // React.useEffect(() => {
  //   const fetchDeviceId = async () => {
  //     try {
  //       const deviceId = await DeviceInfo.getUniqueId();
  //       // dispatch(selectDeviceId(deviceId));
  //       await getCompany(deviceId); // Pass device ID to API call
  //     } catch (error) {
  //       console.error('Error fetching device ID:', error);
  //     }
  //   };

  //   fetchDeviceId();

  //   const timer = setTimeout(() => {
  //     navigation.replace('DrawerDashboard');
  //   }, 3000);

  //   return () => clearTimeout(timer); // Cleanup timeout on unmount
  // }, [navigation, dispatch]);

  const getCompany = async deviceToken => {
    console.log('deviceToken', deviceToken);

    try {
      const res = await getApiCall({
        url: `admin/get-app-color`,
      });
      log('res company data', res);

      const d_token = await getApiCall({
        url: `admin/device-token?deviceId=${deviceToken}`,
      });

      if (res?.status === 200) {
        colorDynamic1 = res.data.headingOneColor;
        colorDynamic2 = res.data.headingTwoColor;
        manageEmail = res.data.manageEmail;
        manageSavedJob = res.data.manageSavedJob;
      }
    } catch (error) {
      alert('Error fetching company data: ' + error.message);
    }
  };

  return (
    <ImageBackground
      style={styles.Container}
      resizeMode="cover"
      source={require('../assets/images/Onboarding.png')}>
      <Image
        source={require('../assets/images/NewSplashLogo.png')}
        resizeMode="contain"
        style={{ height: '30%', width: '70%' }}
      />
      <LottieView
        style={styles.animate}
        source={LoaderAnimation}
        autoPlay
        loop
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animate: {
    width: 70,
    height: 70,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: '5%',
  },
});
