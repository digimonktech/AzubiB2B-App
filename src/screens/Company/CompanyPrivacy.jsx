import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ActivityIndicator,
    useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackHeader from '@/component/BackHeader';
import { fontFamily, reCol } from '@/utils/configuration';

const CompanyPrivacy = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { width } = useWindowDimensions();

    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);

    /* ---------------- Header ---------------- */
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title="Privacy Policy" />,
        });
    }, [navigation]);

    /* ---------------- API ---------------- */
    useEffect(() => {
        const policyId = route?.params?.item?._id;

        if (!policyId) {
            setLoading(false);
            return;
        }

        const fetchPrivacyPolicy = async () => {
            try {
                const res = await axios.get(
                    `https://api.kundenzugang-recruiting.app/api/v1/admin/privacy-policy/${policyId}`,
                );

                setHtmlContent(res?.data?.data?.description || '');
            } catch (e) {
                setHtmlContent('');
            } finally {
                setLoading(false);
            }
        };

        fetchPrivacyPolicy();
    }, [route?.params?.item?._id]);

    /* ---------------- Render ---------------- */
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loaderView}>
                    <ActivityIndicator size="large" color={reCol().color.BDRCLR} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={styles.card}>
                    {htmlContent ? (
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: htmlContent }}
                            tagsStyles={htmlStyles}
                        />
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CompanyPrivacy;



const htmlStyles = {
    h2: {
        fontSize: 20,
        fontFamily: fontFamily.poppinsBold,
        color: '#222',
        marginBottom: 10,
    },
    h3: {
        fontSize: 16,
        fontFamily: fontFamily.poppinsSemiBold,
        marginTop: 14,
        marginBottom: 6,
    },
    p: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: fontFamily.poppinsRegular,
        color: '#444',
    },
};



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
        padding: 10,
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

