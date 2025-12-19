import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

import BackHeader from '@/component/BackHeader';
import { fontFamily, reCol } from '@/utils/configuration';
import { SafeAreaView } from 'react-native-safe-area-context';

const CompanyPrivacy = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [privacyPolicy, setPrivacyPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------------- Header ---------------- */
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title="Privacy Policy" />,
        });
    }, [navigation]);

    /* ---------------- API ---------------- */
    useEffect(() => {
        if (!route.params?.item?._id) {
            setLoading(false);
            return;
        }

        const fetchPrivacyPolicy = async () => {
            try {
                const response = await axios.get(
                    `https://azubi.api.digimonk.net/api/v1/admin/privacy-policy/${route.params.item._id}`,
                );

                setPrivacyPolicy(response.data?.data || null);
            } catch (error) {
                console.log(
                    'Privacy policy error => ',
                    error?.response?.data || error.message,
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPrivacyPolicy();
    }, [route.params?.item?._id]);

    /* ---------------- Render ---------------- */
    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loaderView}>
                    <ActivityIndicator size="large" color={reCol().color.BDRCLR} />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View style={styles.card}>
                        <Text style={styles.titleText}>Privacy Policy</Text>

                        <View style={styles.divider} />

                        <Text style={styles.bodyText}>
                            {privacyPolicy?.description || 'No privacy policy available.'}
                        </Text>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default CompanyPrivacy;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: reCol().color.WHITE,
    },
    loaderView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 16,
    },
    card: {
        padding: 16,
    },
    titleText: {
        fontSize: 18,
        fontFamily: fontFamily.poppinsBold,
        // color: reCol().color.BLACK,
        color: '#222',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 12,
    },
    bodyText: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: fontFamily.poppinsRegular,
        color: '#444',
    },
});

