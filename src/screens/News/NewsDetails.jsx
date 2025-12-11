import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackHeader from '@/component/BackHeader';
import { Images } from '@/assets/images/images';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BASE_URL = 'https://azubi.api.digimonk.net/api/v1';
const IMAGE_BASE = 'https://azubi.api.digimonk.net/';

const NewsDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [newsDetails, setNewsDetails] = useState(null);

  const fetchNewsDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/get-news/${route.params?.item?._id}`
      );
      if (response.status === 200) {
        setNewsDetails(response?.data?.data || {});
      }
    } catch (error) {
      console.log('fetchNewsDetails Error => ', error);
    }
  };

  useEffect(() => {
    fetchNewsDetails();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader title={route.params?.item?.companyname ?? 'News'} />
      ),
    });
  }, [navigation]);

  const convertHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').trim();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toDateString();
  };

  const renderImage = ({ item }) => {
    return (
      <Image
        source={{ uri: IMAGE_BASE + item.file }}
        style={styles.galleryImage}
        resizeMode="cover"
      />
    );
  };

  const renderPlaceholder = ({ item }) => {
    return (
      <Image
        source={require('../../assets/images/gallery.png')}
        style={styles.galleryImage}
        resizeMode="cover"
      />
    );
  };

  if (!newsDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ padding: 20 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const imagesToShow =
    newsDetails?.images?.length > 0
      ? newsDetails?.images
      : [1, 2, 3, 4].map((id) => ({ id })); // dummy placeholders

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={Images.bgImage} style={styles.bg}>
        <FlatList
          data={imagesToShow}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <>
              {/* Title */}
              <Text style={styles.newsTitle}>{newsDetails?.title}</Text>

              {/* Date */}
              <Text style={styles.date}>{formatDate(newsDetails?.createdAt)}</Text>
            </>
          }
          renderItem={
            newsDetails?.images?.length > 0 ? renderImage : renderPlaceholder
          }
          ListFooterComponent={
            <>
              <Text style={styles.description}>
                {convertHtml(newsDetails?.description)}
              </Text>
              <View style={{ height: 40 }} />
            </>
          }
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bg: {
    flex: 1,
    padding: 18,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    fontWeight: '600',
  },

  // 2-column gallery images
  galleryImage: {
    width: (width - 56) / 2, // padding = 18 + 18
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
  },

  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginTop: 10,
  },
});
