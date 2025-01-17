import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Images} from '@/assets/images/images';
import {Header as HeaderElement} from 'react-native-elements';
import {fontFamily, reCol, screenName} from '@/utils/configuration';
import MaterialIcons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useTheme} from '@react-navigation/native';
import Globals from '@/utils/Globals';
import {useCity} from '@/Context/CityProvider';
import {ModalLocation} from './ModalLocation';

export default function MainHeader({title, press}) {
  const {colors, dark} = useTheme();
  const navigation = useNavigation();
  const {width} = Dimensions.get('screen');
  const {selectedCity, setCity, showCity} = useCity();
  // Function to reset selected locations
  const resetLocation = () => {
    setCity([], []); // Reset city in context
  };

  return (
    <View
      style={[
        styles.mainView,
        {backgroundColor: dark ? 'white' : colors.background},
      ]}>
      <ImageBackground style={styles.mainViews}>
        <SafeAreaView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            left: 10,
          }}>
          <TouchableOpacity
            style={styles.leftComponentLogo}
            activeOpacity={0.5}
            onPress={() => {
              navigation.openDrawer();
            }}>
            <MaterialIcons
              name="menu"
              size={20}
              color={reCol().color.BDRCLR}
              underlayColor={'#FFFFFF'}
            />
          </TouchableOpacity>
          <Text
            style={{
              left: 20,
              color: reCol().color.BDRCLR,
              fontFamily: fontFamily.poppinsSeBold,
              fontSize: 14,
              // width: selectedCity.length > 0 ? 130 : 150,
              width: selectedCity.length > 0 ? width / 2.8 : width / 2.4,
            }}>
            {title}
          </Text>
        </SafeAreaView>
        {showCity && (
          <TouchableOpacity
            style={[
              styles.rightComponent,
              {
                borderColor: selectedCity.length > 0 ? '' : 'transparent',
                borderWidth: selectedCity.length > 0 ? 1.2 : 0,
                width: '35%',
              },
            ]}
            activeOpacity={0.5}
            onPress={press}>
            <Image
              style={{height: 20, width: 20}}
              source={require('../assets/images/location.png')}
            />
            <Text
              style={{
                color: reCol().color.BDRCLR,
                fontSize: 10,
                width: '67%',
                fontFamily: fontFamily.poppinsRegular,
                paddingLeft: 5,
              }}>
              {selectedCity?.length > 0
                ? selectedCity?.length > 1
                  ? selectedCity[0] === 'All'
                    ? 'Alle'
                    : selectedCity[0] + ` +${selectedCity?.length - 1}`
                  : selectedCity[0]
                : 'Region wählen'}
            </Text>
            <Image
              style={{height: 20, width: 20, marginLeft: 0}}
              source={require('../assets/images/downArrow.png')}
            />
          </TouchableOpacity>
        )}
        {selectedCity.length > 0 && (
          <TouchableOpacity
            style={{top: Platform.OS === 'ios' ? '6%' : 0}}
            onPress={() => resetLocation()}>
            <Image source={Images.modalClose} style={{height: 25, width: 25}} />
          </TouchableOpacity>
        )}
        <SafeAreaView>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{height: 35, justifyContent: 'center'}}
            onPress={() => navigation.navigate('JobAlerts')}>
            <Image
              source={Images.tabJobAlert}
              style={{height: 25, width: 25}}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
      <Image source={Images.dividerLine} style={styles.lineDivider} />
      {/* {ModalLocation({ visibleLocation, setVisibleLocation })} */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    // marginTop: Platform.OS === 'ios' ? -55 : 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainViews: {
    // marginTop: Platform.OS === 'ios' ? -55 : 0
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  container: {
    borderBottomColor: 'transparent',
  },
  leftComponent: {
    height: 30,
    width: 200,
  },
  leftComponentLogo: {
    height: 35,
    width: 35,
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftComponentIsBack: {
    height: 40,
    width: 40,
    // marginTop: -6
  },
  menubar: {
    height: '100%',
    width: '100%',
    marginTop: -15,
  },
  menubarLogo: {
    height: 35,
    width: 35,
  },
  text: {
    fontSize: 20,
    color: reCol().color.BLACK,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: fontFamily.poppinsBold,
  },
  centerTitle: {
    fontSize: 20,
    color: reCol().color.BLACK,
    fontWeight: 'bold',
    fontFamily: fontFamily.poppinsBold,
  },
  centerTitleMain: {
    fontSize: 20,
    color: 'rgba(10, 150, 158, 1)',
    fontWeight: 'bold',
    fontFamily: fontFamily.poppinsBold,
  },
  rightComponent: {
    height: 35,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: 'center',
    flexDirection: 'row',
    top: Platform.OS === 'ios' && '28%',
  },
  centercomponent: {
    height: 40,
  },
  lineDivider: {
    height: 1.2,
    width: '100%',
  },
  drawerImage: {
    marginTop: 8,
    height: 1.2,
    marginLeft: '35%',
    width: '450%',
  },
});
