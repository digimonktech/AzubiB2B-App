import React, {useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Image} from 'react-native';
import LottieView from 'lottie-react-native';
import {getApiCall} from '@/utils/ApiHandler';
import DeviceInfo from 'react-native-device-info';
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';

const LoaderAnimation = require('../assets/images/animation_lmzwwr3b.json');
export let colorDynamic1 = '';
export let colorDynamic2 = '';
export let manageEmail = '';
export let manageSavedJob = '';

export default function SplashScreen({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('----------Token-----------', token);
      await getCompany(token);
    };

    getToken();
    const timer = setTimeout(() => {
      navigation.replace('DrawerDashboard');
    }, 3000);

    return () => clearTimeout(timer);
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
        source={require('../assets/images/azr-logo-1.png')}
        resizeMode="contain"
        style={{height: '30%', width: '70%'}}
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
