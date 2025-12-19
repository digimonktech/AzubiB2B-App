import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import BackHeader from '@/component/BackHeader';
import { fontFamily, reCol } from '@/utils/configuration';
import Globals from '@/utils/Globals';
import { Images } from '@/assets/images/images';

const { height, width } = Dimensions.get('screen');

const ITEM_WIDTH = width * 0.42;

const CompanyJobWall = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const companyId = route.params?.item?._id;

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ---------------- Header ---------------- */
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title="Job Wall" />,
        });
    }, [navigation]);

    /* ---------------- API ---------------- */
    useEffect(() => {
        if (!companyId) {
            setLoading(false);
            return;
        }

        const fetchBanners = async () => {
            try {
                const res = await axios.get(
                    `https://azubi.api.digimonk.net/api/v1/admin/job-banners?companyId=${companyId}`,
                );
                setBanners(res.data?.data || []);
            } catch (e) {
                console.log('Job banner error => ', e);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, [companyId]);

    /* ---------------- Skeleton ---------------- */
    const SkeletonItem = useMemo(
        () => () => (
            <View style={styles.item}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                        width={ITEM_WIDTH}
                        height={height * 0.18}
                        borderRadius={12}
                    />
                    <SkeletonPlaceholder.Item marginTop={8} width="70%" height={14} />
                    <SkeletonPlaceholder.Item marginTop={4} width="50%" height={12} />
                </SkeletonPlaceholder>
            </View>
        ),
        [],
    );

    /* ---------------- Render Item ---------------- */
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image
                source={{ uri: Globals.BASE_URL + item.images }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>
                    {item.bannerTitle || 'No Title'}
                </Text>

                <TouchableOpacity>
                    <Image
                        source={Images.downloadIcon}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.locationRow}>
                <Image source={Images.location} style={styles.locationicon} />
                <Text style={styles.location} numberOfLines={1}>
                    {item?.city?.name || 'No City'}
                </Text>
            </View>
        </View>
    );

    /* ---------------- Render ---------------- */
    return (
        <View style={styles.container}>
            <FlatList
                data={loading ? Array.from({ length: 6 }) : banners}
                keyExtractor={(item, index) => item?._id || index.toString()}
                renderItem={loading ? () => <SkeletonItem /> : renderItem}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyView}>
                            <Text style={styles.emptyText}>No banners available</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default CompanyJobWall;




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: reCol().color.WHITE,
    },
    list: {
        padding: 10,
    },
    item: {
        width: ITEM_WIDTH,
        margin: 8,
    },
    image: {
        width: '100%',
        height: height * 0.18,
        borderRadius: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    title: {
        // flex: 1,
        marginLeft: 6,
        fontFamily: fontFamily.poppinsMedium,
        fontSize: 18,
        color: '#222',
        fontWeight: '600',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    location: {
        fontFamily: fontFamily.poppinsLight,
        fontSize: 12,
        color: '#222',
        fontWeight: '500',
    },
    icon: {
        height: 28,
        width: 28,
        tintColor: reCol().color.EMLCLR,
        marginRight: 8,
    },
 
    locationicon: {
        height: 16,
        width: 16,
        tintColor: reCol().color.EMLCLR,
        marginRight: 8,
    },

    emptyView: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
});



