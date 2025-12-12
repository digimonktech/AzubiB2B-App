import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  Linking,
  View,
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ModalLocation } from '@/component/ModalLocation';
import Share from 'react-native-share';
import { Images } from '@/assets/images/images';
import { getApiCall } from '@/utils/ApiHandler';
import { reCol } from '@/utils/configuration';
import { useSelector } from 'react-redux';
import Globals from '@/utils/Globals';
import { SafeAreaView } from 'react-native-safe-area-context';

export function DrawerContent(props) {
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [flatData, setFlatData] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [dynamicLogo, setDynamicLogo] = useState('');
  const comId = useSelector(state => state.companyId?.companyId);

  const shareEmail = async () => {
    const shareOptions = {
      subject: 'AzubiRegional.de APP Empfehlung',
      message: `Hey,
schau dir die AzubiRegional APP an: hier findest du regionale TOP-Unternehmen mit attraktiven Ausbildungs- und dualen Studienangeboten in deiner Nähe 😉🚀🤘🏻👍 #startedurch`,
      title: 'AzubiRegional',
    };
    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const fetchLogo = async () => {
    try {
      let res = await getApiCall({ url: 'admin/sidebar-content' });
      if (res.status === 200) setDynamicLogo(res.data?.logo);
    } catch (e) {
      console.log(e);
    }
  };

  const getDrawerContent = async () => {
    try {
      let res = await getApiCall({
        url: `admin/sidemenus?pageNo=1&recordPerPage=10&companyId=${comId}`,
      });
      if (res.status === 200) {
        const sideMenus = res?.data?.SideMenus || [];
        setFlatData(sideMenus);
        if (sideMenus.length) {
          setShowAlarm(sideMenus[0].jobAlarm);
          setShowRegion(sideMenus[0].regionWahlen);
          setShowTips(sideMenus[0].tips);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchLogo();
    getDrawerContent();
  }, []);

  const Divider = () => (
    <Image
      style={styles.divider}
      resizeMode="contain"
      source={require('../assets/images/Rectangleline.png')}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        {/* Close Button (Top Right) */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => props.navigation.closeDrawer()}>
          <Icon name="close" color="#fff" size={22} />
        </TouchableOpacity>

        {/* Logo (Bottom Left) */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logoContainer}
          onPress={() =>
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'DrawerDashboard' }],
            })
          }>
          <Image
            source={require('../assets/images/JobLogo.jpeg')}
            // source={{ uri: Globals.BASE_URL + dynamicLogo }}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Drawer Content */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        <View style={styles.menuContainer}>
          <DrawerItem
            icon={({ size }) => (
              <Image style={{ height: size, width: size }} source={require('../assets/images/user-octagon.png')} />
            )}
            label="Datenschutz & AGB"
            labelStyle={styles.labelStyle}
            onPress={() => props.navigation.navigate('AboutUs', { headerName: 'Datenschutz & AGB' })}
          />
          <Divider />

          <DrawerItem
            icon={({ size }) => (
              <Image style={{ height: size, width: size }} source={require('../assets/images/tabData.png')} />
            )}
            label="Impressum"
            labelStyle={styles.labelStyle}
            onPress={() => props.navigation.navigate('PrivacyPolicy', { headerName: 'Impressum' })}
          />
          <Divider />

          <DrawerItem
            icon={({ size }) => (
              <Image style={{ height: size, width: size }} source={require('../assets/images/personalcard.png')} />
            )}
            label="Kontakt"
            labelStyle={styles.labelStyle}
            onPress={() => props.navigation.navigate('Contact', { headerName: 'Kontakt' })}
          />
          <Divider />

          {showTips && (
            <>
              <DrawerItem
                icon={({ size }) => (
                  <Image style={{ height: size, width: size }} source={require('../assets/images/information.png')} />
                )}
                label="Bewerbungstipps"
                labelStyle={styles.labelStyle}
                onPress={() =>
                  props.navigation.navigate('ApplicationTips', { headerName: 'Bewerbungstipps' })
                }
              />
              <Divider />
            </>
          )}

          {showRegion && (
            <>
              <DrawerItem
                icon={({ size }) => (
                  <Image
                    style={{ height: size, width: size, tintColor: '#fff' }}
                    source={require('../assets/images/location.png')}
                  />
                )}
                label="Region wählen"
                labelStyle={styles.labelStyle}
                onPress={() => {
                  props.navigation.closeDrawer();
                  setVisibleLocation(true);
                }}
              />
              <Divider />
            </>
          )}

          {showAlarm && (
            <>
              <DrawerItem
                icon={({ size }) => (
                  <Image
                    style={{ height: size, width: size, tintColor: '#fff' }}
                    source={Images.tabJobAlert}
                  />
                )}
                label="Job Alarm"
                labelStyle={styles.labelStyle}
                onPress={() => props.navigation.navigate('JobAlerts')}
              />
              <Divider />
            </>
          )}

          <DrawerItem
            icon={({ size }) => (
              <Image
                style={{ height: size, width: size, tintColor: '#fff' }}
                source={require('../assets/images/share.png')}
              />
            )}
            label="App teilen"
            labelStyle={styles.labelStyle}
            onPress={shareEmail}
          />
          <Divider />

          <DrawerItem
            icon={({ size }) => (
              <Image
                style={{ height: size, width: size, tintColor: '#fff' }}
                source={require('../assets/images/rate.png')}
              />
            )}
            label="Azubi Regional App bewerten"
            labelStyle={styles.labelStyle}
          />
          <Divider />

          <FlatList
            data={flatData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <>
                <DrawerItem
                  icon={({ size }) => (
                    <Image
                      style={{ height: size, width: size }}
                      source={{ uri: Globals.BASE_URL + item.icon }}
                    />
                  )}
                  label={item.name}
                  labelStyle={styles.labelStyle}
                  onPress={() => Linking.openURL(item.url)}
                />
                <Divider />
              </>
            )}
          />
        </View>
      </DrawerContentScrollView>

      {ModalLocation({
        visibleLocation: visibleLocation,
        setVisibleLocation: setVisibleLocation,
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#124170' },

  /** HEADER */
  headerContainer: {
    height: 150,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#124170',
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    zIndex: 2,
  },
  logoContainer: {
    paddingLeft: 20,
    paddingBottom: 15,
    width: '50%',
  },
  logo: {
    width: '100%',
    height: 100,
    marginLeft: 15,
  },

  /** CONTENT */
  scrollView: { paddingVertical: 10 },
  menuContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  labelStyle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 10,
    width: '100%',
    marginVertical: 5,
  },
});
