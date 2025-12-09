import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import React from 'react';
import { fontFamily, reCol } from '@/utils/configuration'; // if exists
import { useNavigation } from '@react-navigation/native';
import MainHeader from '@/component/MainHeader';

const CompanyPrivacy = () => {
    const navigation = useNavigation();
    
      React.useLayoutEffect(() => {
        navigation.setOptions({
          header: () => <MainHeader title={'Privacy'} press={() => { setVisibleLocation(true) }} />,
        });
      }, [navigation]);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <Text style={styles.heading}>Privacy Policy</Text>

                <Text style={styles.text}>
                    This is a sample privacy policy page for companies.
                    Here you will provide details about how the user data is
                    collected, used, and protected by your organization.
                </Text>

                <Text style={styles.subHeading}>Data Collection</Text>
                <Text style={styles.text}>
                    We collect basic personal information necessary to provide
                    our services in the best way possible.
                </Text>

                <Text style={styles.subHeading}>User Rights</Text>
                <Text style={styles.text}>
                    Users can request access or deletion of their stored data
                    anytime via support.
                </Text>

                <Text style={styles.subHeading}>Contact Information</Text>
                <Text style={styles.text}>
                    If you have any questions regarding this policy, feel free to reach out to us.
                </Text>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CompanyPrivacy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 10,
        // fontFamily: fontFamily.poppinsBold, // if exists
    },
    subHeading: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginTop: 18,
        marginBottom: 6,
        // fontFamily: fontFamily.poppinsSemiBold,
    },
    text: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        // fontFamily: fontFamily.poppinsRegular,
    },
});
