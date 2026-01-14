import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {fontFamily, reCol} from '@/utils/configuration';
import {Images} from '@/assets/images/images';
import SaveJobListing from './saveJobListing';
import ApplicationSentListing from './applicationSentListing';
import MainHeader from '@/component/MainHeader';
import {ModalLocation} from '@/component/ModalLocation';

const SaveJobs = ({navigation}) => {
  const [selected, setSelected] = useState(0);
  const [visibleLocation, setVisibleLocation] = useState(false);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <MainHeader
          title={'Meine Jobs'}
          press={() => {
            setVisibleLocation(true);
          }}
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <ImageBackground source={Images.bgImage} style={styles.container}>
        <View style={styles.tabView}>
          <TouchableOpacity
            onPress={() => setSelected(0)}
            style={[
              styles.touchStyle,
              {backgroundColor: selected === 0 ? '#0b7693ff' : 'white'},
            ]}>
            <Text
              style={[
                styles.tabText,
                {color: selected === 0 ? 'white' : 'gray'},
              ]}>
              Gespeichert
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected(1)}
            style={[
              styles.touchStyle,
              // {
              //   backgroundColor:
              //     selected === 1 ? reCol().color.EMLCLR : 'white',
              // },
              {
                backgroundColor: selected === 1 ? '#0b7693ff' : 'white'
              }
            ]}>
            <Text
              style={[
                styles.tabText,
                {color: selected === 1 ? 'white' : 'gray'},
              ]}>
              Bewerbungen
            </Text>
          </TouchableOpacity>
        </View>
        {selected === 0 ? <SaveJobListing /> : <ApplicationSentListing />}
      </ImageBackground>
      {ModalLocation({
        visibleLocation: visibleLocation,
        setVisibleLocation: setVisibleLocation,
      })}
    </View>
  );
};

export default SaveJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    height: 50,
    alignItems: 'center',
    backgroundColor: reCol().color.WHITE,
    justifyContent: 'space-around',
    borderBottomColor: 'gray',
  },
  tabText: {
    fontSize: 15,
    fontFamily: fontFamily.poppinsRegular,
    fontWeight: '700',
  },
  touchStyle: {
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
   
    alignItems: 'center',
  },
});
