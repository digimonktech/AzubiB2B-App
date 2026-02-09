import React, { useEffect, useLayoutEffect, useState, useMemo, useCallback } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'native-base';
import { useSelector } from 'react-redux';

import MainHeader from '@/component/MainHeader';
import { fontFamily, reCol } from '@/utils/configuration';
import { Images } from '@/assets/images/images';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('screen');

// ================= Utils =================

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();

// ================= Component =================

const News = () => {
    const navigation = useNavigation();

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const CompaniesList = useSelector(
        (state) => state.showcompaniesList.list || []
    );

    // ================= API =================

    const fetchAllCompanies = async () => {
        try {
            const response = await axios.get(
                'https://api.kundenzugang-companyjob.app/api/v1/admin/companies'
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

    // ================= HEADER =================

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader title="News" />,
        });
    }, [navigation]);

    // ================= FILTER =================

    const filteredCompanies = useMemo(() => {
        if (!companies.length || !CompaniesList.length) return [];

        const idSet = new Set(CompaniesList.map(c => c._id));
        return companies.filter(item => idSet.has(item._id));

    }, [companies, CompaniesList]);

    // ================= NAVIGATION =================

    const handleNavigation = useCallback((item) => {
        navigation.navigate('CompanyNews', { item });
    }, [navigation]);

    // ================= RENDER ITEM =================

    const RenderCard = React.memo(({ item }) => {
        const cleanDescription =
            stripHtml(item.description) || 'No description available';

        const imageUrl = item.profileIcon
            ? { uri: `https://api.kundenzugang-companyjob.app/${item.profileIcon}` }
            : require('../../assets/images/gallery.png');

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cardContainer}
                onPress={() => handleNavigation(item)}
            >
                <View style={styles.imagePlaceholder}>
                    <Image
                        style={styles.image}
                        resizeMode="cover"
                        source={imageUrl}
                        alt="company"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>
                        {item.companyname || 'Unknown Company'}
                    </Text>
                    <Text
                        style={[styles.descText, { fontWeight: '600' }]}
                        numberOfLines={2}
                    >
                        {cleanDescription}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    });

    const renderItem = useCallback(
        ({ item }) => <RenderCard item={item} />,
        []
    );

    const keyExtractor = useCallback(
        (item, index) => item._id || item.id || index.toString(),
        []
    );

    // ================= EMPTY STATE =================

    const EmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                Keine Neuigkeiten verfügbar
            </Text>
        </View>
    );

    // ================= UI =================

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground style={styles.container} source={Images.bgImage}>
                <FlatList
                    data={loading ? [] : filteredCompanies}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={!loading ? <EmptyList /> : null}
                    showsVerticalScrollIndicator={false}
                />
            </ImageBackground>
        </SafeAreaView>
    );
};

export default News;

// ================= Styles =================

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingTop: 10,
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
        fontSize: 16,
        fontFamily: fontFamily.poppinsBold,
        color: reCol().color.BLACK,
    },
    descText: {
        fontSize: 12,
        fontFamily: fontFamily.poppinsLight,
        color: reCol().color.GRAY,
        width: '80%',
    },
    emptyContainer: {
        height: SCREEN_HEIGHT - 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#222',
        fontWeight: '700',
        fontSize: 18,
    },
});
