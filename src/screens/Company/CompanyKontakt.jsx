import BackHeader from "@/component/BackHeader";
import { Alert, Image, ImageBackground, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Images } from '@/assets/images/images'
import { fontFamily, reCol } from '@/utils/configuration'
import FormInput from '@/component/FormInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import TextAreaInput from '@/component/FormArea'
import { Button, Checkbox, Row } from 'native-base'
import { getApiCall, getApiCall1, postApiCall } from "@/utils/ApiHandler";
import { ModalLocation } from "@/component/ModalLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from "react-native-render-html";
import { useSelector } from "react-redux";
import { registerSchema } from "../Contact/schema";
import { useNavigation, useRoute } from "@react-navigation/native";


const CompanyKontakt = () => {
    const route = useRoute()
    const navigation = useNavigation();
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            Email: "",
            Name: "",
            Mobile: "",
            About: "",
        },
        resolver: yupResolver(registerSchema),
    })
    const { headerName, contentAdmin } = route.params;
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [visiblePrivacy, setVisiblePrivacy] = useState(false);
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
   

    // console.log('CompanyKontakt route => ', route.params?.item)
    const companyId = route.params?.item?._id

    const comapnyName = route.params?.item?.companyname ?? 'Company'



    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title={comapnyName + ' Kontakt'} press={() => setVisibleLocation(true)} />,
        });
    }, [navigation]);


    useEffect(() => {
        retrieveData();
        ContentData();
    }, [])


    async function contactApi(values) {

        let info =
        {
            "name": values.Name,
            "phoneNumber": values.Mobile || "",
            "email": values.Email,
            "message": values.About,
            "companyId": companyId
        };
        console.log(info);
        try {
            setLoading(true);
            let res = await postApiCall({ url: 'admin/contact-form', json: info })
            console.log("form submit res", res)
            if (res.status === 200) {
                Alert.alert('Nachricht erfolgreich gesendet.', 'Wir melden uns in Kürze zurück.')
            }
        }
        catch (e) {
            // alert(e)
            console.log('form submit Error ', e);

        }
        finally {
            setLoading(false);
        }
    }
    const ContentData = async () => {
        try {
            let res = await getApiCall1({ url: 'manage_content' });
            if (res.status == 200) {
                setContent(res?.data?.termsConditions)
            }
        } catch (e) {
            alert(e);
        } finally {
        }
    };

    const onSubmit = async (values) => {
        contactApi(values);
    }
    const renderPrivacyModal = () => {
        return (
            <Modal animationType="slide" visible={visiblePrivacy} transparent={true}>
                <ScrollView contentContainerStyle={styles.modalBgView}>
                    <View style={styles.modalMainView}>
                        <View style={styles.flexView}>
                            <Text style={styles.headingText}>{'Datenschutz & AGB'}</Text>
                            <TouchableOpacity onPress={() => setVisiblePrivacy(false)}>
                                <Image source={Images.modalClose} style={styles.closeImg} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <View style={{ marginHorizontal: 15 }}>
                                <RenderHTML source={{ html: content }} />
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </Modal>
        )
    }

    const retrieveData = async () => {
        try {
            const name = await AsyncStorage.getItem('name');
            const phoneNumber = await AsyncStorage.getItem('phoneNumber');
            const email = await AsyncStorage.getItem('email');
            const message = await AsyncStorage.getItem('message');
            if (name) {
                setValue('Name', name);
                setValue('Mobile', phoneNumber);
                setValue('Email', email);
                setValue('About', message);
            }
        } catch (error) {
            console.log('Error retrieving data: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={Images.bgImage} style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.main}>
                        <Text style={{ color: '#000', fontSize: 14, fontFamily: fontFamily.poppinsMedium }}>Name</Text>
                        <FormInput
                            name='Name'
                            control={control}
                            borderColor={reCol().color.BDRCLR}
                            placeholder={'NAME/NACHNAME (erforderlich)'}
                            style={styles.txtSize}
                        />
                        <View style={styles.midSpace}>
                            <Text style={{ color: '#000', fontSize: 14, fontFamily: fontFamily.poppinsMedium }}>E-Mail</Text>

                            <FormInput
                                name="Email"
                                control={control}
                                borderColor={reCol().color.BDRCLR}
                                placeholder={'E-Mail'}
                                style={styles.txtSize}

                            />
                        </View>
                        <View style={styles.midSpace}>
                            <Text style={{ color: '#000', fontSize: 14, fontFamily: fontFamily.poppinsMedium }}>{'Telefonnummer (optional)'}</Text>

                            <FormInput
                                name='Mobile'
                                borderColor={reCol().color.BDRCLR}
                                control={control}
                                placeholder={'Telefonnummer (optional)'}
                                style={styles.txtSize}
                                type="number-pad"
                                Valuelen={10}

                            />
                        </View>
                        <View style={styles.midSpace}>
                            <Text style={{ color: '#000', fontSize: 14, fontFamily: fontFamily.poppinsMedium }}>{'Nachricht'}</Text>

                            <TextAreaInput
                                name='About'
                                height={180}
                                borderColor={reCol().color.BDRCLR}
                                backgroundColor='white'
                                control={control}
                                placeholder={'Nachricht'}
                                style={styles.txtSize}
                            />
                        </View>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                marginTop: 10,
                                alignItems: 'center'
                            }}
                            onPress={() => setIsChecked(!isChecked)}>
                            <Checkbox
                                isChecked={isChecked}
                                alignSelf={"center"}
                                value='1'
                                size={"lg"}
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <Text style={[styles.labelText, {
                                marginBottom: 0, marginLeft: 10,
                                marginTop: 0, fontSize: 13
                            }]}>{`Ich akzeptiere die elektronische Speicherung${"\n"}meiner Daten gemäß der  `}
                                <Text
                                    style={
                                        [styles.labelText,
                                        {
                                            marginTop: 0,
                                            fontSize: 13,
                                            textDecorationLine: 'underline'
                                        }]}
                                    onPress={() => setVisiblePrivacy(true)}
                                >Datenschutzrichtlinien.
                                </Text>
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.buttonView}>
                            <TouchableOpacity style={[styles.submitbtn, { backgroundColor: isChecked ? '#e98436ff' : 'gray' }]} onPress={() => { handleSubmit(onSubmit)() }}>
                                <Text style={styles.btnText}>Absenden</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
                {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}
                {renderPrivacyModal()}
            </ImageBackground>
        </SafeAreaView>
    )
}

export default CompanyKontakt

const styles = StyleSheet.create({
    submitbtn: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    container: {
        flex: 1
    },
    main: {
        paddingHorizontal: 20,
        marginHorizontal: 10,
        paddingVertical: 15,
        // backgroundColor: color.WHITE,
        borderRadius: 10,
    },
    main1: {
        marginHorizontal: 20,
        marginVertical: 10
    },
    midSpace: {
        marginTop: 15,
    },
    buttonView: {
        marginTop: '5%',
        justifyContent: 'flex-end',
        // backgroundColor: '#8C65A3',
        borderRadius: 10,

    },
    buttonStyle: {
        borderRadius: 10
    },
    btnText: {
        fontFamily: fontFamily.poppinsBold,
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    welText: {
        color: '#4E4D4D',
        fontFamily: fontFamily.NunitoBold,
        fontSize: 15,
    },
    landText: {
        marginTop: 15,
        color: reCol().color.BLACK,
        fontFamily: fontFamily.poppinsBold,
        fontSize: 25,
    },
    fTxt: {
        color: reCol().color.BTNCOLOR,
    },
    azubiTxt: {
        color: reCol().color.BDRCLR,
    },
    detailTxt: {
        marginTop: 15,
        color: '#4E4D4D',
        fontFamily: fontFamily.poppinsLight,
        fontSize: 15,
    },
    txtSize: {
        fontSize: 14,
        fontFamily: fontFamily.poppinsRegular,
        color: '#000',
        backgroundColor: reCol().color.WHITE,
    },
    modalBgView: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#00000050"
    },
    modalMainView: {
        backgroundColor: reCol().color.WHITE,
        height: '92%',
        width: '100%',
        borderRadius: 20,
    },
    flexView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    headingText: {
        color: reCol().color.BDRCLR,
        fontFamily: fontFamily.poppinsBold,
        fontSize: 20,
        fontWeight: 'bold'
    },
    closeImg: {
        height: 30,
        width: 30,
        alignSelf: 'flex-end'
    },
})