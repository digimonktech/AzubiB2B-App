import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {fontFamily, reCol, screenName} from '@/utils/configuration';
import {useNavigation} from '@react-navigation/native';
import {Header as HeaderElement} from 'react-native-elements';
import {Images} from '@/assets/images/images';
import {Divider} from 'native-base';
const {NOTIFICATION} = screenName;
const Header = (props: any) => {
  const {
    bc,
    isBack,
    data,
    isBackHide,
    title,
    isRightAction,
    screen,
    titleLogo,
  } = props;
  const navigation: any = useNavigation();
  const backPressImg = () => {
    if (isBack) {
      navigation.goBack();
      return;
    }
  };
  const leftComponent = () => {
    if (isBack && !isBackHide) {
      return (
        <>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.leftComponentIsBack}
              onPress={() => backPressImg()}>
              <Image source={Images.back} style={styles.menubar} />
            </TouchableOpacity>
            {/* <View style={{ width: 250 }}>
                            <Text style={[styles.centerTitle, { marginTop: 5 }]}>{title}</Text>
                        </View> */}
          </View>
          <Image source={Images.dividerLine} style={styles.lineDivider} />
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity style={styles.leftComponentLogo}>
            <Image
              source={Images.logoMain}
              style={styles.menubarLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Image source={Images.dividerLine} style={styles.lineDivider} />
        </>
      );
    }
  };

  // ******************* right component of header ***********************************
  const rightComponent = () => {
    if (isRightAction === undefined) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate(NOTIFICATION)}>
          <View style={styles.rightComponent}>
            <Image
              source={Images.notification}
              style={{height: 80, width: 80, marginTop: 15}}
            />
          </View>
        </TouchableOpacity>
      );
    }
    if (isRightAction === 'edit') {
      return (
        <TouchableOpacity>
          <View style={styles.rightComponent}>
            {/* <Image source={Images.downCircle} style={{ height: 80, width: 80, marginTop: 40 }} /> */}
          </View>
        </TouchableOpacity>
      );
    }
    return <View style={styles.rightComponent}></View>;
  };

  // *************** center component where title appear in header *******************
  const centerComponent = () => {
    if (titleLogo) {
      return <View style={styles.centercomponent}></View>;
    } else {
      return (
        <View style={styles.centercomponent}>
          <Text style={styles.centerTitleMain}>{title}</Text>
        </View>
      );
    }
  };
  return (
    <View style={styles.mainView}>
      <ImageBackground source={Images.bgImage}>
        {/* @ts-ignore */}
        <HeaderElement
          statusBarProps={{
            // barStyle: 'light-content',
            translucent: true,
            backgroundColor: 'transparent',
          }}
          containerStyle={styles.container}
          placement={'center'}
          centerComponent={centerComponent}
          leftComponent={leftComponent}
          rightComponent={rightComponent}
          backgroundColor={bc ? 'transparent' : 'transparent'}
        />
      </ImageBackground>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainView: {
    marginTop: Platform.OS === 'ios' ? -55 : 0,
  },
  container: {
    borderBottomColor: 'transparent',
  },
  leftComponent: {
    height: 30,
    width: 200,
  },
  leftComponentLogo: {
    height: 30,
    width: 30,
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
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 20,
    width: 50,
  },
  centercomponent: {
    height: 40,
  },
  lineDivider: {
    marginTop: 8,
    height: 1.2,
    marginLeft: '35%',
    width: '450%',
  },
  drawerImage: {
    marginTop: 8,
    height: 1.2,
    marginLeft: '35%',
    width: '450%',
  },
});
