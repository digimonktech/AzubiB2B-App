import React from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";
import LottieView from "lottie-react-native";
import { getApiCall } from "@/utils/ApiHandler";

const LoaderAnimation = require('../assets/images/animation_lmzwwr3b.json');
export let colorDynamic1 = '';
export let colorDynamic2 = '';
export default function SplashScreen({ navigation }) {



    React.useEffect(() => {
        getCompany();
        setTimeout(() => {
            navigation.replace('DrawerDashboard');
        }, 3000);
    }, [navigation]);
    const getCompany = async () => {
        try {
            let res = await getApiCall({ url: 'admin/company/6745d20181461ac7a3c48fba' });
            if (res?.status == 200) {
                colorDynamic1 = res.data.headingOneColor;
                colorDynamic2 = res.data.headingTwoColor;
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <ImageBackground style={styles.Container} resizeMode="cover" source={require('../assets/images/Onboarding.png')}>
            <Image source={require('../assets/images/azr-logo-1.png')} resizeMode="contain" style={{ height: '30%', width: '70%', }} />

            <LottieView style={styles.animate} source={LoaderAnimation} autoPlay loop
                colorFilters={[
                    {
                        keypath: "asdf",
                        color: "#30853A",
                    }
                ]} />

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    animate: {
        width: 70,
        height: 70,
        backgroundColor: 'transparent',
        color: '#000',
        tintColor: '#000',
        overlayColor: '#30853A',
        position: 'absolute',
        bottom: '5%'
    }
})