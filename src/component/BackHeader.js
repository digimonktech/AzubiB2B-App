import React from "react";
import { Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Dimensions } from 'react-native';
import { Images } from '@/assets/images/images';
import { Header as HeaderElement } from 'react-native-elements';
import { fontFamily, reCol, screenName } from '@/utils/configuration'
import MaterialIcons from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useTheme } from "@react-navigation/native";
import Globals from "@/utils/Globals";
import { useCity } from "@/Context/CityProvider";


export default function BackHeader({ title, press }) {
    const { width } = Dimensions.get('screen');
    const { selectedCity } = useCity();
    const navigation = useNavigation();
    const { colors, dark } = useTheme();
    const leftComponent = () => {
        return (
            <>
                <SafeAreaView style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-around', left: 10, }}>
                    <TouchableOpacity style={styles.leftComponentLogo} activeOpacity={0.5} onPress={() => {
                        navigation.goBack();
                    }}>
                        <MaterialIcons name='chevron-left' size={20} color={'#2894A2'} underlayColor={'#FFFFFF'} />
                    </TouchableOpacity>
                    <Text style={{ left: 20, color: '#2894A2', fontFamily: fontFamily.poppinsSeBold, fontSize: 14 }}>{title}</Text>
                </SafeAreaView>
                <Image source={Images.dividerLine} style={styles.lineDivider} />
            </>
        );
    };

    const rightComponent = () => {

        return (
            <TouchableOpacity style={styles.rightComponent} activeOpacity={0.5} onPress={press}>
                <Image style={{ height: 20, width: 20 }} source={require('../assets/images/location.png')} />
                <Text style={{ color: '#2894A2', fontSize: 10, fontFamily: fontFamily.poppinsRegular }}>{Globals.location}</Text>
                <Image style={{ height: 20, width: 20 }} source={require('../assets/images/downArrow.png')} />

            </TouchableOpacity>
        );
    };


    return (
        <View style={[styles.mainView, { backgroundColor: dark ? 'white' : colors.background, }]}>
            <ImageBackground style={styles.mainViews}>
                <SafeAreaView style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-around', left: 10, }}>
                    <TouchableOpacity style={styles.leftComponentLogo} activeOpacity={0.5} onPress={() => {
                        navigation.goBack();
                    }}>
                        <MaterialIcons name='chevron-left' size={20} color={reCol().color.BDRCLR} underlayColor={'#FFFFFF'} />
                    </TouchableOpacity>
                    {title.length > 12 ? <Text style={{
                        left: 20,
                        color: reCol().color.BDRCLR,
                        fontFamily: fontFamily.poppinsSeBold,
                        fontSize: 14,
                        width: selectedCity.length > 0 ? width / 2.5 : width / 2.4
                    }}>{title.slice(0, 12) + '...'}</Text> :
                        <Text style={{
                            left: 20,
                            color: reCol().color.BDRCLR,
                            fontFamily: fontFamily.poppinsSeBold,
                            fontSize: 14,
                            width: selectedCity.length > 0 ? width / 2.5 : width / 2.4
                        }}>{title}</Text>}

                </SafeAreaView>
                <TouchableOpacity style={[styles.rightComponent, { width: '35%' }]} activeOpacity={0.5} onPress={press}>
                    <Image style={{ height: 20, width: 20 }} source={require('../assets/images/location.png')} />
                    <Text style={{
                        color: reCol().color.BDRCLR,
                        fontSize: 10,
                        fontFamily: fontFamily.poppinsRegular,
                        paddingLeft: 5,
                        width: '67%'
                    }}>{selectedCity?.length > 0
                        ? selectedCity?.length > 1
                            ? selectedCity[0] === 'All'
                                ? 'Alle'
                                : selectedCity[0] + ` +${selectedCity?.length - 1}`
                            : selectedCity[0]
                        : 'Region wählen'
                        }</Text>
                    <Image style={{ height: 20, width: 20, marginLeft: 0 }} source={require('../assets/images/downArrow.png')} />

                </TouchableOpacity>
                <SafeAreaView>
                    <TouchableOpacity activeOpacity={0.5}
                        style={{ height: 35, justifyContent: 'center' }}
                        onPress={() => navigation.navigate('JobAlerts')}>
                        <Image source={Images.tabJobAlert} style={{ height: 25, width: 25 }} />
                    </TouchableOpacity>
                </SafeAreaView>
            </ImageBackground>
            <Image source={Images.dividerLine} style={styles.lineDivider} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        // marginTop: Platform.OS === 'ios' ? -55 : 0
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainViews: {
        // marginTop: Platform.OS === 'ios' ? -55 : 0
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    container: {
        borderBottomColor: 'transparent',
    },
    leftComponent: {
        height: 30,
        width: 200,
    },
    leftComponentLogo: {
        height: 35,
        width: 35,
        backgroundColor: '#fff',
        borderRadius: 50,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'row'
    },
    leftComponentIsBack: {
        height: 40,
        width: 40,
        // marginTop: -6
    },
    menubar: {
        height: '100%',
        width: '100%',
        marginTop: -15
    },
    menubarLogo: {
        height: 35,
        width: 35,
    },
    text: {
        fontSize: 20,
        color: reCol().color.BLACK,
        fontWeight: 'bold',
        marginLeft: 10,
        fontFamily: fontFamily.poppinsBold,
    },
    centerTitle: {
        fontSize: 20,
        color: reCol().color.BLACK,
        fontWeight: 'bold',
        fontFamily: fontFamily.poppinsBold,
    },
    centerTitleMain: {
        fontSize: 20,
        color: 'rgba(10, 150, 158, 1)',
        fontWeight: 'bold',
        fontFamily: fontFamily.poppinsBold,
    },
    rightComponent: {
        height: 35,
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        borderRadius: 10,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        alignItems: 'center',
        flexDirection: 'row',
        top: Platform.OS === 'ios' && '28%',
        // right: 10
    },
    centercomponent: {
        height: 40,
    },
    lineDivider: {
        height: 1.2,
        width: '100%'
    },
    drawerImage: {
        marginTop: 8,
        height: 1.2,
        marginLeft: '35%',
        width: '450%'
    },
})