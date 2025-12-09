import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '@/component/MainHeader';
// import { fontFamily, reCol } from '@/utils/configuration'; // If available

const CompanyTrems = () => {
    const navigation = useNavigation();
    
      React.useLayoutEffect(() => {
        navigation.setOptions({
          header: () => <MainHeader title={'Trems & Policy'} press={() => { setVisibleLocation(true) }} />,
        });
      }, [navigation]);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <Text style={styles.heading}>Terms & Conditions</Text>

                <Text style={styles.text}>
                    These are the sample company terms and conditions.
                    By continuing to use our services, you agree to abide by these terms.
                </Text>

                <Text style={styles.subHeading}>Usage Policy</Text>
                <Text style={styles.text}>
                    You must use our services for lawful purposes only and avoid violating rights of others.
                </Text>

                <Text style={styles.subHeading}>Limitations</Text>
                <Text style={styles.text}>
                    We are not liable for any loss or damage that occurs due to misuse of information.
                </Text>

                <Text style={styles.subHeading}>Changes</Text>
                <Text style={styles.text}>
                    Terms may be updated periodically. Users will be informed whenever major changes occur.
                </Text>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CompanyTrems;

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
        // fontFamily: fontFamily.poppinsBold,
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
