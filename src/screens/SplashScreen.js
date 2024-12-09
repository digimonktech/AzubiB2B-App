import React from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";
import LottieView from "lottie-react-native";

const LoaderAnimation = require('../assets/images/animation_lmzwwr3b.json');

export default function SplashScreen({ navigation }) {



    React.useEffect(() => {
        setTimeout(() => {
            navigation.replace('DrawerDashboard');
        }, 3000);
    }, [navigation]);


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