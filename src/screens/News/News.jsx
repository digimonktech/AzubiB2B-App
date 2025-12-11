import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    FlatList,
} from 'react-native';

import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '@/component/MainHeader';
import { fontFamily, reCol } from '@/utils/configuration';
import { Images } from '@/assets/images/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'native-base';
import Globals from '@/utils/Globals';

const { width } = Dimensions.get('screen');

// Fallback when API returns empty
const fallbackNews = [
    {
        id: '1',
        companyname: 'Tech Corp Expands',
        description: 'Leading software company opens new offices in major cities.',
    },
    {
        id: '2',
        companyname: 'AI Market Growth',
        description: 'Artificial Intelligence transforms business operations.',
    },
];

const NEWS = 'Artificial Intelligence transforms business operations.'

// Remove HTML tags from description
const stripHtml = (htmlString = '') => htmlString.replace(/<[^>]*>/g, '').trim();

const News = () => {
    const navigation = useNavigation();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log('News ', companies)


    const fetchAllCompanies = async () => {
        try {
            const response = await axios.get(
                'https://azubi.api.digimonk.net/api/v1/admin/companies'
            );
            const data = response?.data?.data?.companies?.companies || [];
            setCompanies(data);
        } catch (error) {
            console.log('Error fetching companies => ', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllCompanies();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader title={'News'} />,
        });
    }, [navigation]);

    const handleNavigation = (item) => {
        navigation.navigate('CompanyNews', { item })
    }

    const RenderCard = ({ item }) => {
        const cleanDescription = stripHtml(item.description) || 'No description available';
        const imageUrl = item.profileIcon
            ? { uri: Globals.BASE_URL + item.profileIcon }
            : require('../../assets/images/gallery.png');

        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer} onPress={() => handleNavigation(item)}>
                <View style={styles.imagePlaceholder}>
                    <Image
                        style={styles.image}
                        resizeMode="cover"
                        source={imageUrl}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>
                        {item.companyname || 'Unknown Company'}
                    </Text>
                    <Text style={[styles.descText, { fontWeight: '600' }]} numberOfLines={1}>
                        {cleanDescription}
                    </Text>
                    {/* <Text style={[styles.descText, { fontWeight: 'bold' }]} numberOfLines={1}>
                        <Text style={{ color: '#0c7496ff', fontWeight: 'bold', fontSize: 14 }}>News : </Text>{NEWS}
                    </Text> */}
                </View>
            </TouchableOpacity>
        );
    };

    const dataToDisplay = loading || companies.length === 0 ? fallbackNews : companies;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground style={styles.container} source={Images.bgImage}>
                <FlatList
                    data={dataToDisplay}
                    renderItem={RenderCard}
                    keyExtractor={(item, index) => item._id || item.id || index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            </ImageBackground>
        </SafeAreaView>
    );
};

export default News;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingTop: 10,
    },
    heading: {
        width: '92%',
        alignSelf: 'center',
        fontSize: 18,
        fontFamily: fontFamily.poppinsSemiBold,
        color: reCol().color.BLACK,
        marginBottom: 10,
    },
    cardContainer: {
        width: '92%',
        alignSelf: 'center',
        backgroundColor: reCol().color.WHITE,
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 1 },
    },
    imagePlaceholder: {
        height: 60,
        width: 60,
        backgroundColor: reCol().color.BDRCLR,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 8,
    },
    textContainer: {
        width: width * 0.65,
    },
    titleText: {
        fontSize: 14,
        fontFamily: fontFamily.poppinsBold,
        color: reCol().color.BLACK,
        marginBottom: 4,
    },
    descText: {
        fontSize: 12,
        fontFamily: fontFamily.poppinsLight,
        color: reCol().color.GRAY,
    },
});
