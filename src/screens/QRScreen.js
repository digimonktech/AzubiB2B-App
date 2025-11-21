import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Keyboard,
} from 'react-native';
import { getApiCall } from '@/utils/ApiHandler';
import messaging from '@react-native-firebase/messaging';



export default function QRScreen({ navigation }) {
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    const handleContinue = () => {
        navigation.replace('DrawerDashboard');
    }

    useEffect(() => {
        const fetchTokenAndCompanyData = async () => {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            console.log('Device Token:', token);
            await getCompanyData(token);
        };

        fetchTokenAndCompanyData();
    }, []);

    const getCompanyData = async (deviceToken) => {
        try {
            const res = await getApiCall({ url: `admin/get-app-color` });

            await getApiCall({
                url: `admin/device-token?deviceId=${deviceToken}`,
            });

            if (res?.status === 200) {
                colorDynamic1 = res.data.headingOneColor;
                colorDynamic2 = res.data.headingTwoColor;
                manageEmail = res.data.manageEmail;
                manageSavedJob = res.data.manageSavedJob;
            }
        } catch (error) {
            alert('Error fetching company data: ' + error.message);
        }
    };

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', (e) =>
            setKeyboardOffset(e.endCoordinates.height)
        );
        const hideSub = Keyboard.addListener('keyboardDidHide', () =>
            setKeyboardOffset(0)
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <ImageBackground
            style={styles.container}
            resizeMode="cover"
            source={require('../assets/images/Onboarding.png')}
        >
            {/* Logo */}
            <Image
                source={require('../assets/images/azr-logo-1.png')}
                resizeMode="contain"
                style={styles.logo}
            />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: keyboardOffset + 20 },
                    ]}
                >
                    <View style={styles.contentWrapper}>

                        <Text style={styles.title}>
                            Scan QR Code or enter your company name to continue
                        </Text>

                        <Image
                            source={require('../assets/images/QRScanner.png')}
                            resizeMode="contain"
                            style={styles.qrImage}
                        />

                        {/* Scan QR */}
                        <View style={styles.scanWrapper}>
                            <TouchableOpacity style={styles.scanBtn} activeOpacity={0.8}>
                                <Text style={styles.btnText}>Scan QR</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
                                <Text style={styles.qrText}>Download QR</Text>
                            </TouchableOpacity>
                        </View>

                        <Image
                            source={require('../assets/images/Container.png')}
                            resizeMode="contain"
                            style={styles.containerImg}
                        />

                        {/* Company Name */}
                        <View style={styles.companyWrapper}>
                            <Text style={styles.companyText}>Company Name</Text>

                            <TextInput
                                placeholder="Enter your company name"
                                placeholderTextColor="#A0A0A0"
                                style={styles.input}
                            />

                            <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={handleContinue}>
                                <Text style={styles.btnText}>Continue</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },

    container: {
        flex: 1,
        paddingTop: 40,
    },

    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        minHeight: '100%',
    },

    logo: {
        height: 70,
        width: 140,
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 20,
    },

    contentWrapper: {
        width: '100%',
        alignItems: 'center',
    },

    title: {
        color: '#555555',
        fontSize: 18,
        marginTop: 10,
        width: 300,
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },

    qrImage: {
        marginTop: 20,
        width: 150,
        height: 150,
    },

    scanWrapper: {
        alignItems: 'center',
        marginTop: 5,
    },

    scanBtn: {
        backgroundColor: '#0097A7',
        width: 90,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 0,
    },

    downloadBtn: {
        width: 200,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        marginBottom: 8,
    },

    qrText: {
        color: '#7B5CB5',
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'center',
    },

    containerImg: {
        height: 40,
        width: 280,
        alignSelf: 'center',
        marginTop: 10,
    },

    companyWrapper: {
        width: '85%',
        marginTop: 30,
    },

    companyText: {
        color: '#424242',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },

    input: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 50,
        color: '#717182',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        backgroundColor: '#ffffff',
    },

    btn: {
        backgroundColor: '#8C65A3',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        marginTop: 20,
    },

    btnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Poppins-Medium',
    },
});
