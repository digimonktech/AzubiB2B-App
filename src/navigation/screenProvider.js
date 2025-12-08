import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, Text, View, Platform, StyleSheet } from 'react-native';
import { reCol, fontFamily, screenName } from '@/utils/configuration';
import { Images } from '@/assets/images/images';

// Screens
import Register from '@/screens/register/screen';
import Jobs from '@/screens/jobs/screen';
import Companies from '@/screens/companies/screen';
import DetailsJobs from '@/screens/detailJobs/screen';
import DetailsCompany from '@/screens/detailsCompany/screen';
import Notification from '@/screens/notification/screen';
import SplashScreen from '@/screens/SplashScreen';
import AboutUs from '@/screens/AboutUs/AboutUs';
import PrivacyPolicy from '@/screens/PrivacyPolicy/PrivacyPolicy';
import ApplicationTips from '@/screens/ApplicationTips/ApplicationTips';
import Contact from '@/screens/Contact/Contact';
import SaveJobs from '@/screens/saveJobs/screen';
import JobAlerts from '@/screens/jobAlerts/screen';
import Gallery from '@/screens/Gallery/screen';
import GalleryDetails from '@/screens/GalleryDetail/screen';
import { DrawerContent } from './DrawerContent';
import QRScreen from '@/screens/QRScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DrawerNav = createDrawerNavigator();

const { TAB } = screenName;

const DrawerDashboard = () => (
  <DrawerNav.Navigator
    screenOptions={{
      drawerStyle: { width: '95%' },
      headerShown: false,
    }}
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <DrawerNav.Screen name="Tab" component={Tabs} />
  </DrawerNav.Navigator>
);

const Tabs = () => {
  const activeColor = '#3D0061';
  const inactiveColor = '#fff';
  const tabBg = reCol().color.BTNCOLOR || '#F87B1B';

  return (
    <Tab.Navigator
      initialRouteName="Unternehmen"
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 65 : 60,
          backgroundColor: tabBg,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 2,
          paddingTop: 6,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
          fontFamily: fontFamily.poppinsMedium,
          flexWrap: 'nowrap',      // 🔥 FORCE SINGLE LINE
          // includeFontPadding: false,
        },
      }}
    >

      {/* --- Unternehmen  start --- */}
      <Tab.Screen
        name="Unternehmen"
        component={Companies}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.tabCompanies}
              style={{ tintColor: color, width: size, height: size, marginBottom: 4 }}
              resizeMode="contain"
            />
          ),
          tabBarLabel: "Start",
        }}
      />


      {/* --- Meine Daten --- */}
      <Tab.Screen
        name="Meine Daten"
        component={Register}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.tabData}
              style={{ tintColor: color, width: size, height: size, marginBottom: 4 }}
              resizeMode="contain"
            />
          ),
          tabBarLabel: "Meine Daten",
        }}
      />

      {/* --- Aktuelle Jobs jobs --- */}
      <Tab.Screen
        name="Aktuelle Jobs"
        component={Jobs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.tabJob}
              style={{ tintColor: color, width: size, height: size, marginBottom: 4 }}
              resizeMode="contain"
            />
          ),
          tabBarLabel: "Jobs",
        }}
      />


      {/* --- JobWall news --- */}
      <Tab.Screen
        name="JobWall"
        component={Gallery}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.tabGallery}
              style={{ tintColor: color, width: size, height: size, marginBottom: 4 }}
              resizeMode="contain"
            />
          ),
          tabBarLabel: "News",
        }}
      />

      {/* --- Meine Jobs kontakt --- */}
      <Tab.Screen
        name="Meine Jobs"
        component={SaveJobs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.tabSaveJob}
              style={{ tintColor: color, width: size, height: size, marginBottom: 4 }}
              resizeMode="contain"
            />
          ),
          tabBarLabel: "Kontakt",
        }}
      />
    </Tab.Navigator>
  );
};


const ScreenProvider = () => (
  <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name="QRScreen" component={QRScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name="Tabs" component={Tabs} />
    <Stack.Screen name="DrawerDashboard" component={DrawerDashboard} />
    <Stack.Screen name="JobAlerts" component={JobAlerts} options={{ headerShown: true, animation: 'fade' }} />
    <Stack.Screen name="DetailsJobs" component={DetailsJobs} options={{ headerShown: true, animation: 'fade' }} />
    <Stack.Screen name="DetailsCompany" component={DetailsCompany} options={{ headerShown: true, animation: 'fade' }} />
    <Stack.Screen name="Notification" component={Notification} />
    <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerShown: true, animation: 'fade' }} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: true, animation: 'fade' }} />
    <Stack.Screen name="ApplicationTips" component={ApplicationTips} options={{ headerShown: true, animation: 'fade' }} />
    <Stack.Screen name="Contact" component={Contact} options={{ headerShown: true, animation: 'fade' }} />
    <Stack.Screen name="GalleryDetail" component={GalleryDetails} options={{ headerShown: true, animation: 'fade' }} />
  </Stack.Navigator>
);

export default ScreenProvider;

const styles = StyleSheet.create({
  tabIconImg: {
    height: 20,
    width: 20,
  },
  mainImgView: {
    flexDirection: 'row',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    marginLeft: 5,
    fontFamily: fontFamily.poppinsMedium,
    fontWeight: '400',
    fontSize: 15,
  },
});
