import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackHeader from '@/component/BackHeader';
import { Images } from '@/assets/images/images';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Globals from '@/utils/Globals';

const { width } = Dimensions.get('window'); // Device width for responsive UI

const BASE_URL = 'https://azubi.api.digimonk.net/api/v1';

const CompanyNews = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const [news, setNews] = useState([]);

    // console.log('CompanyNews => ', news);


    const fetchCompanyAllNews = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/admin/all-news/${route.params?.item?._id}`
            );

            if (response.status === 200) {
                const newsData = response?.data?.data?.news || [];
                setNews(newsData);
            }
        } catch (error) {
            console.log('fetchCompanyAllNews Error => ', error);
        }
    };

    useEffect(() => {
        fetchCompanyAllNews();
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <BackHeader
                    title={route.params?.item?.companyname ?? 'News'}
                />
            ),
        });
    }, [navigation]);

    const handleNavigation = (item) => {
        navigation.navigate('NewsDetails', { item })
    }

    // Convert HTML to plain text
    const convertHtmlToText = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]+>/g, '').trim();
    };

    const renderNews = ({ item }) => {
        const img = item.images[0].file
        // console.log('img ', img);

        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleNavigation(item)}>
                <View style={styles.card}>

                    {item.images?.[0]?.file ? (
                        <Image
                            source={{ uri: `https://azubi.api.digimonk.net/${item.images[0].file}` }}
                            style={styles.thumbImage}
                        />
                    ) : (
                        <Image
                            source={require('../../assets/images/gallery.png')}
                            style={styles.thumbImage}
                        />
                    )}


                    <View style={styles.contentBox}>
                        <Text style={styles.newsTitle} numberOfLines={1}>
                            {item?.title}
                        </Text>

                        <Text style={styles.newsDescription} numberOfLines={2}>
                            {convertHtmlToText(item?.description)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground style={styles.container} source={Images.bgImage}>
                <Text style={styles.headerTitle}>News</Text>

                <FlatList
                    data={news}
                    keyExtractor={(item) => item?._id}
                    renderItem={renderNews}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            </ImageBackground>
        </SafeAreaView>
    );
};

export default CompanyNews;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    container: {
        flex: 1,
        paddingTop: 10,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        padding: 16,
        color: '#000',
    },

    card: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#f8f8f8',
        padding: 8,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },

    thumbImage: {
        width: width * 0.22,       // 22% of screen width
        height: width * 0.22,
        borderRadius: 10,
        resizeMode: 'cover',
    },

    contentBox: {
        flex: 1,                   // Take remaining space responsively
        justifyContent: 'center',
    },

    newsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },

    newsDescription: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
});
