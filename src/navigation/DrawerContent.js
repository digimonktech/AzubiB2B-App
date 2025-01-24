import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  FlatList,
  Linking,
  View,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ModalLocation} from '@/component/ModalLocation';
import Share from 'react-native-share';
import {Images} from '@/assets/images/images';
import {getApiCall} from '@/utils/ApiHandler';
import {reCol} from '@/utils/configuration';
import {useSelector} from 'react-redux';
import Globals from '@/utils/Globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      // social: Share.Social.EMAIL,
      // email: email,
      subject: 'AzubiRegional.de APP Empfehlung',
      message: `Hey,
            schau dir die AzubiRegional APP an: hier findest du regionale TOP-Unternehmen mit attraktiven Ausbildungs- und dualen Studienangeboten in deiner Nähe 😉🚀🤘🏻👍 #startedurch`,
      title: 'AzubiRegional',
    };
    try {
      const shareResponse = await Share.open(shareOptions);
      // console.log('Shared successfully:', shareResponse);
      // alert(shareResponse);
    } catch (error) {
      console.error('Sharing failed:', error);
      // alert(error);
    }
  };

  const fetchLogo = async () => {
    try {
      let res = await getApiCall({url: 'admin/sidebar-content'});
      // console.log('ressss', res);
      if (res.status == 200) {
        // console.log('ressss', res.data.logo);
        setDynamicLogo(res.data.logo);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getDrawerContent = async () => {
    try {
      let res = await getApiCall({
        url: 'admin/sidemenus?pageNo=1&recordPerPage=10&companyId=' + comId,
      });
      if (res.status == 200) {
        setFlatData(res?.data?.SideMenus);
        setShowAlarm(res?.data?.SideMenus[0].jobAlarm);
        setShowRegion(res?.data?.SideMenus[0].regionWahlen);
        setShowTips(res?.data?.SideMenus[0].tips);
      }
    } catch (e) {
      alert(e);
    } finally {
      // setLoading(false)
    }
  };
  useEffect(() => {
    fetchLogo();
    getDrawerContent();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <SafeAreaView style={styles.userInfoSection}>
        <TouchableOpacity
          style={{
            backgroundColor: reCol().color.BDRCLR,
            width: 30,
            height: 30,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
            elevation: 10,
            margin: 10,
          }}
          activeOpacity={0.5}
          onPress={() => {
            props.navigation.closeDrawer();
          }}>
          <Icon name="close" color={'#fff'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{height: '50%', width: '40%', top: '1%', left: '5%'}}
          activeOpacity={0.5}
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DrawerDashboard'}],
            });
          }}>
          <Image
            style={{height: '100%', width: '100%'}}
            resizeMode="contain"
            // source={require('../assets/images/azr-logo.png')}
            source={{uri: Globals.BASE_URL + dynamicLogo}}
          />
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView
        style={{
          height: '90%',
          width: '100%',
          backgroundColor: reCol().color.BDRCLR,
        }}>
        <DrawerContentScrollView {...props}>
          <View
            style={{
              top: Platform.OS === 'ios' ? '-6%' : -5,
              paddingBottom: '5%',
            }}>
            <>
              <DrawerItem
                icon={({size}) => (
                  <Image
                    style={{height: size, width: size}}
                    resizeMode="contain"
                    source={require('../assets/images/user-octagon.png')}
                  />
                )}
                inactiveTintColor="white"
                label={'Datenschutz & AGB'}
                onPress={() => {
                  props.navigation.navigate('AboutUs', {
                    headerName: 'Datenschutz & AGB',
                  });
                }}
              />

              <Image
                style={{height: 10, width: '100%'}}
                resizeMode="contain"
                source={require('../assets/images/Rectangleline.png')}
              />
            </>

            <>
              <DrawerItem
                icon={({size}) => (
                  <Image
                    style={{height: size, width: size}}
                    resizeMode="contain"
                    source={require('../assets/images/tabData.png')}
                  />
                )}
                inactiveTintColor="white"
                label={'Impressum'}
                onPress={() => {
                  props.navigation.navigate('PrivacyPolicy', {
                    headerName: 'Impressum',
                  });
                }}
              />

              <Image
                style={{height: 10, width: '100%'}}
                resizeMode="contain"
                source={require('../assets/images/Rectangleline.png')}
              />
            </>

            <>
              <DrawerItem
                icon={({size}) => (
                  <Image
                    style={{height: size, width: size}}
                    resizeMode="contain"
                    source={require('../assets/images/personalcard.png')}
                  />
                )}
                inactiveTintColor="white"
                label={'Konkakt'}
                onPress={() => {
                  props.navigation.navigate('Contact', {
                    headerName: 'Konkakt',
                    contentAdmin: 'Testing',
                  });
                }}
              />

              <Image
                style={{height: 10, width: '100%'}}
                resizeMode="contain"
                source={require('../assets/images/Rectangleline.png')}
              />
            </>

            {showTips && (
              <>
                <DrawerItem
                  icon={({size}) => (
                    <Image
                      style={{height: size, width: size}}
                      resizeMode="contain"
                      source={require('../assets/images/information.png')}
                    />
                  )}
                  inactiveTintColor="white"
                  label={'Bewerbungstipps'}
                  onPress={() => {
                    props.navigation.navigate('ApplicationTips', {
                      headerName: 'Bewerbungstipps',
                    });
                  }}
                />

                <Image
                  style={{height: 10, width: '100%'}}
                  resizeMode="contain"
                  source={require('../assets/images/Rectangleline.png')}
                />
              </>
            )}
            {showRegion && (
              <>
                <DrawerItem
                  icon={({size}) => (
                    <Image
                      style={{
                        height: size,
                        width: size,
                        tintColor: reCol().color.WHITE,
                      }}
                      resizeMode="contain"
                      source={require('../assets/images/location.png')}
                    />
                  )}
                  inactiveTintColor="white"
                  label={'Region wählen'}
                  onPress={() => {
                    props.navigation.closeDrawer(), setVisibleLocation(true);
                  }}
                />

                <Image
                  style={{height: 10, width: '100%'}}
                  resizeMode="contain"
                  source={require('../assets/images/Rectangleline.png')}
                />
              </>
            )}
            {showAlarm && (
              <>
                <DrawerItem
                  icon={({size}) => (
                    <Image
                      style={{
                        height: size,
                        width: size,
                        tintColor: reCol().color.WHITE,
                      }}
                      resizeMode="contain"
                      source={Images.tabJobAlert}
                    />
                  )}
                  inactiveTintColor="white"
                  label={'Job Alarm'}
                  onPress={() => {
                    props.navigation.navigate('JobAlerts');
                  }}
                />

                <Image
                  style={{height: 10, width: '100%'}}
                  resizeMode="contain"
                  source={require('../assets/images/Rectangleline.png')}
                />
              </>
            )}
            <DrawerItem
              icon={({size}) => (
                <Image
                  style={{
                    height: size,
                    width: size,
                    tintColor: reCol().color.WHITE,
                  }}
                  resizeMode="contain"
                  source={require('../assets/images/share.png')}
                />
              )}
              inactiveTintColor="white"
              label={'App teilen'}
              onPress={() => shareEmail()}
            />

            <Image
              style={{height: 10, width: '100%'}}
              resizeMode="contain"
              source={require('../assets/images/Rectangleline.png')}
            />

            <DrawerItem
              icon={({size}) => (
                <Image
                  style={{
                    height: size,
                    width: size,
                    tintColor: reCol().color.WHITE,
                  }}
                  resizeMode="contain"
                  source={require('../assets/images/rate.png')}
                />
              )}
              inactiveTintColor="white"
              label={'Azubi Regional App bewerten'}
            />

            <Image
              style={{height: 10, width: '100%'}}
              resizeMode="contain"
              source={require('../assets/images/Rectangleline.png')}
            />

            <FlatList
              data={flatData}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <>
                  <DrawerItem
                    icon={({size}) => (
                      <Image
                        style={{
                          height: size,
                          width: size,
                        }}
                        resizeMode="contain"
                        source={{uri: Globals.BASE_URL + item.icon}}
                      />
                    )}
                    inactiveTintColor="white"
                    label={item.name}
                    onPress={() => Linking.openURL(item.url)}
                  />

                  <Image
                    style={{
                      height: 10,
                      width: '100%',
                    }}
                    resizeMode="contain"
                    source={require('../assets/images/Rectangleline.png')}
                  />
                </>
              )}
            />
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
      {ModalLocation({
        visibleLocation: visibleLocation,
        setVisibleLocation: setVisibleLocation,
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    height: '15%',
  },
  title: {
    fontSize: 14,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: '#525252',
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 1,
    backgroundColor: '#F2F4F4',
    borderRadius: 5,
  },
  txtstyle: {
    color: '#8e1212',
    textAlign: 'center',
  },
});
