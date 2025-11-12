import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { fontFamily, reCol, screenName } from '@/utils/configuration';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text } from 'react-native';
import { Images } from '@/assets/images/images';
import Register from '@/screens/register/screen';
import Jobs from '@/screens/jobs/screen';
import Companies from '@/screens/companies/screen';
import DetailsJobs from '@/screens/detailJobs/screen';
import DetailsCompany from '@/screens/detailsCompany/screen';
import { View } from 'native-base';
import Notification from '@/screens/notification/screen';
import SplashScreen from '@/screens/SplashScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './DrawerContent';
import AboutUs from '@/screens/AboutUs/AboutUs';
import PrivacyPolicy from '@/screens/PrivacyPolicy/PrivacyPolicy';
import ApplicationTips from '@/screens/ApplicationTips/ApplicationTips';
import Contact from '@/screens/Contact/Contact';
import SaveJobs from '@/screens/saveJobs/screen';
import JobAlerts from '@/screens/jobAlerts/screen';
import Gallery from '@/screens/Gallery/screen';
import GalleryDetails from '@/screens/GalleryDetail/screen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const DrawerNav = createDrawerNavigator();

const { TAB } = screenName;
const screenOptions = {
  headerShown: false,
}


const DrawerDashboard = ({ navigation }) => {
  return (
    <DrawerNav.Navigator
      screenOptions={{
        drawerStyle:
          { width: '95%' },
        headerShown: false,
      }} drawerContent={(props) => <DrawerContent {...props} />}>
      <DrawerNav.Screen name="Tab" component={Tabs} />
    </DrawerNav.Navigator>
  );
};


const Tabs = () => {
  return (
    <Tab.Navigator
      // initialRouteName={TAB}
      initialRouteName={'Meine Daten'}
      screenOptions={{
        tabBarActiveTintColor: reCol().color.WHITE,
        tabBarInactiveTintColor: '#3D0061',
        tabBarOptions: {
          contentStyle: { backgroundColor: "#000" },
          sceneContainerStyle: { backgroundColor: "#000" },
        },
        tabBarStyle: {
          height: 100,
          backgroundColor: reCol().color.BTNCOLOR,
          contentStyle: { backgroundColor: "#000" },
          sceneContainerStyle: { backgroundColor: "#00" },
        },
        contentStyle: { backgroundColor: "#000" },
        sceneContainerStyle: { backgroundColor: "#000" },
        headerShown: true,
      }}
    >

      <Tab.Screen
        name={'Meine Daten'}
        component={Register}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{
              color: focused ? color : '#3D0061',
              textAlign: 'center'
            }}>
              Meine{'\n'}Daten
            </Text>
          ),
          tabBarColor: '#000',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Image
                source={Images.tabData}
                style={{
                  tintColor: color,
                  width: size, height: size,
                }} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'Aktuelle Jobs'}
        component={Jobs}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{
              color: focused ? color : '#3D0061',
              textAlign: 'center'
            }}>
              Aktuelle{'\n'}Jobs
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Image
                source={Images.tabJob}
                style={{
                  tintColor: color,
                  width: size, height: size
                }} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'Unternehmen'}
        component={Companies}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{
              color: focused ? color : '#3D0061',
              width: 90,
              paddingBottom: 15,
              textAlign: 'center'
            }}>Unternehmen</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Image source={Images.tabCompanies}
                style={{
                  tintColor: color,
                  width: size, height: size
                }} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'JobWall'}
        component={Gallery}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{
              color: focused ? color : '#3D0061',
              textAlign: 'center',
              paddingBottom: 15
            }}>
              JobWall
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Image source={Images.tabGallery} style={{ tintColor: color, width: size, height: size }} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'Meine Jobs'}
        component={SaveJobs}
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{
              color: focused ? color : '#3D0061',
              textAlign: 'center'
            }}>
              Meine{'\n'}Jobs
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <View>
              <Image source={Images.tabSaveJob}
                style={{
                  tintColor: color,
                  width: size, height: size
                }} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function ScreenProvider() {
  return (
    <Stack.Navigator initialRouteName={'SplashScreen'} screenOptions={screenOptions}>
      <Stack.Screen name={'SplashScreen'} component={SplashScreen} options={{
        headerShown: false, animation: 'fade'
      }} />
      <Stack.Screen name={'Tabs'} component={Tabs} />
      <Stack.Screen name={'DrawerDashboard'} component={DrawerDashboard} />
      <Stack.Screen name={'JobAlerts'} component={JobAlerts} options={{
        headerShown: true, animation: 'fade'
      }} />
      <Stack.Screen name={'DetailsJobs'} component={DetailsJobs} options={{
        headerShown: true, animation: 'fade'
      }} />
      <Stack.Screen name={'DetailsCompany'} component={DetailsCompany} options={{
        headerShown: true, animation: 'fade'
      }} />
      <Stack.Screen name={'Notification'} component={Notification} />
      <Stack.Screen name={'AboutUs'} component={AboutUs} options={{
        headerShown: true, animation: 'fade'
      }} />
      <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} options={{
        headerShown: true, animation: 'fade'
      }} />
      <Stack.Screen name={'ApplicationTips'} component={ApplicationTips} options={{
        headerShown: true, animation: 'fade'
      }} />
      <Stack.Screen name={'Contact'} component={Contact} options={{
        headerShown: true, animation: 'fade'
      }} />
      <Stack.Screen name={'GalleryDetail'} component={GalleryDetails} options={{
        headerShown: true, animation: 'fade'
      }} />



    </Stack.Navigator>
  )
}

export default ScreenProvider
const styles = StyleSheet.create({
  tabIconImg: {
    height: 20,
    width: 20
  },
  mainImgView: {
    flexDirection: 'row',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabText: {
    marginLeft: 5,
    fontFamily: fontFamily.poppinsMedium,
    fontWeight: '400',
    fontSize: 15
  }
})