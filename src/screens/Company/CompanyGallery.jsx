import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '@/component/MainHeader';

const dummyImages = Array(12).fill('../../assets/images/gallery.png'); // Placeholder repeat

const CompanyGallery = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <MainHeader title={'Gallery'} press={() => { setVisibleLocation(true) }} />,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Gallery</Text>

        <View style={styles.galleryWrapper}>
          {dummyImages.map((img, index) => (
            <View key={index} style={styles.imageBox}>
              <Image
                source={require('../../assets/images/gallery.png')}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    marginLeft: 20,
  },
  galleryWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  imageBox: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
