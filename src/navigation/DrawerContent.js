import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from '@/utils/configuration';
import { ModalLocation } from '@/component/ModalLocation';
import Share from 'react-native-share';
import { Images } from '@/assets/images/images';
import { getApiCall } from '@/utils/ApiHandler';



export function DrawerContent(props) {
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [menu, setMenu] = useState('');
    const [menu1, setMenu1] = useState('');
    const [menu2, setMenu2] = useState('');
    const [menu3, setMenu3] = useState('');
    const [contentKontact, setContentKontact] = useState('');
    const shareEmail = async () => {
        const shareOptions = {
            // social: Share.Social.EMAIL,
            // email: email,
            subject: 'AzubiRegional.de APP Empfehlung',
            message: `Hey,
            schau dir die AzubiRegional APP an: hier findest du regionale TOP-Unternehmen mit attraktiven Ausbildungs- und dualen Studienangeboten in deiner Nähe 😉🚀🤘🏻👍 #startedurch`,
            title: 'AzubiRegional'
        }
        try {
            const shareResponse = await Share.open(shareOptions);
            // console.log('Shared successfully:', shareResponse);
            // alert(shareResponse);
        } catch (error) {
            console.error('Sharing failed:', error);
            // alert(error);
        }
    }
    const getDrawerContent = async () => {
        try {
            let res = await getApiCall({ url: 'manage_content/side-bar-content' });
            if (res.status == 200) {
                setMenu(res?.data?.menu_1);
                setMenu1(res?.data?.menu_2);
                setMenu2(res?.data?.menu_3);
                setMenu3(res?.data?.menu_4);
                setContentKontact(res?.data?.contact_below_content);
            }

        } catch (e) {
            alert(e);
        } finally {
            // setLoading(false)
        }
    };
    useEffect(() => {
        getDrawerContent()
    }, [])
    return (

        <SafeAreaView style={{ flex: 1 }}>

            <SafeAreaView style={styles.userInfoSection}>
                <TouchableOpacity style={{ backgroundColor: '#2894A2', width: 30, height: 30, borderRadius: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', elevation: 10, margin: 10 }} activeOpacity={0.5} onPress={() => { props.navigation.closeDrawer() }}>
                    <Icon
                        name="close"
                        color={'#fff'}
                        size={20}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ height: '50%', width: '40%', top: '1%', left: '5%', }} activeOpacity={0.5} onPress={() => {
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'DrawerDashboard' }],
                    });
                }}>
                    <Image style={{ height: '100%', width: '100%', }} resizeMode='contain' source={require('../assets/images/azr-logo.png')} />
                </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView style={{ height: '100%', width: '100%', backgroundColor: '#2894A2' }}>
                <DrawerContentScrollView {...props} style={{ top: Platform.OS === 'ios' ? '-6%' : -5 }}>
                    {menu && (
                        <>
                            <DrawerItem icon={({ size }) => (
                                <Image style={{ height: size, width: size }} resizeMode='contain' source={require('../assets/images/user-octagon.png')} />

                            )} inactiveTintColor='white' label={menu} onPress={() => { props.navigation.navigate('AboutUs', { headerName: menu }); }} />

                            <Image style={{ height: 10, width: '100%' }} resizeMode='contain' source={require('../assets/images/Rectangleline.png')} />
                        </>
                    )}
                    {menu1 && (
                        <>
                            <DrawerItem icon={({ size }) => (
                                <Image style={{ height: size, width: size }} resizeMode='contain' source={require('../assets/images/tabData.png')} />

                            )} inactiveTintColor='white' label={menu1} onPress={() => { props.navigation.navigate('PrivacyPolicy', { headerName: menu1 }); }} />

                            <Image style={{ height: 10, width: '100%' }} resizeMode='contain' source={require('../assets/images/Rectangleline.png')} />
                        </>
                    )}
                    {menu2 && (
                        <>
                            <DrawerItem icon={({ size }) => (
                                <Image style={{ height: size, width: size }} resizeMode='contain' source={require('../assets/images/personalcard.png')} />

                            )} inactiveTintColor='white' label={menu2} onPress={() => { props.navigation.navigate('Contact', { headerName: menu2, contentAdmin: contentKontact }); }} />

                            <Image style={{ height: 10, width: '100%' }} resizeMode='contain' source={require('../assets/images/Rectangleline.png')} />
                        </>
                    )}
                    {menu3 && (
                        <>

                            <DrawerItem icon={({ size }) => (
                                <Image style={{ height: size, width: size }} resizeMode='contain' source={require('../assets/images/information.png')} />

                            )} inactiveTintColor='white' label={menu3} onPress={() => { props.navigation.navigate('ApplicationTips', { headerName: menu3 }); }} />

                            <Image style={{ height: 10, width: '100%' }} resizeMode='contain' source={require('../assets/images/Rectangleline.png')} />
                        </>
                    )}
                    <DrawerItem icon={({ size }) => (
                        <Image style={{ height: size, width: size, tintColor: color.WHITE }} resizeMode='contain' source={require('../assets/images/location.png')} />

                    )} inactiveTintColor='white' label={'Region wählen'} onPress={() => { props.navigation.closeDrawer(), setVisibleLocation(true) }} />

                    <Image style={{ height: 10, width: '100%' }} resizeMode='contain' source={require('../assets/images/Rectangleline.png')} />

                    <DrawerItem icon={({ size }) => (
                        <Image style={{ height: size, width: size, tintColor: color.WHITE }} resizeMode='contain' source={Images.tabJobAlert} />

                    )} inactiveTintColor='white' label={'Job Alarm'} onPress={() => { props.navigation.navigate('JobAlerts') }} />

                    <Image style={{ height: 10, width: '100%' }} resizeMode='contain' source={require('../assets/images/Rectangleline.png')} />

                    <DrawerItem icon={({ size }) => (
                        <Image style={{ height: size, width: size, tintColor: color.WHITE }} resizeMode='contain' source={require('../assets/images/share.png')} />

                    )} inactiveTintColor='white' label={'App teilen'} onPress={() => shareEmail()} />

                    <Image style={{ height: 10, width: '100%' }} resizeMode='contain' source={require('../assets/images/Rectangleline.png')} />

                    <DrawerItem icon={({ size }) => (
                        <Image style={{ height: size, width: size, tintColor: color.WHITE }} resizeMode='contain' source={require('../assets/images/rate.png')} />

                    )} inactiveTintColor='white' label={'Azubi Regional App bewerten'} />

                    <Image style={{ height: 10, width: '100%' }} resizeMode='contain' source={require('../assets/images/Rectangleline.png')} />



                </DrawerContentScrollView>
            </SafeAreaView>
            {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        height: '15%'
    },
    title: {
        fontSize: 14,
        marginTop: 3,
        fontWeight: 'bold',

    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        color: '#525252'
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    listStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 1,
        backgroundColor: '#F2F4F4',
        borderRadius: 5
    },
    txtstyle: {
        color: '#8e1212',
        textAlign: 'center'
    }


});