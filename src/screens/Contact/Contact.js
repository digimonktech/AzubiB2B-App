import BackHeader from "@/component/BackHeader";
import { Alert, Image, ImageBackground, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/component/Header'
import { Images } from '@/assets/images/images'
import { color, fontFamily } from '@/utils/configuration'
import FormInput from '@/component/FormInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema } from './schema'
import TextAreaInput from '@/component/FormArea'
import { Button, Checkbox, Row } from 'native-base'
import { getApiCall, postApiCall } from "@/utils/ApiHandler";
import { ModalLocation } from "@/component/ModalLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from "react-native-render-html";


export default function Contact({ navigation, route }) {
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

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title={headerName} press={() => setVisibleLocation(true)} />,
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
            "message": values.About
        };
        console.log(info);
        try {
            setLoading(true);
            let res = await postApiCall({ url: 'contacts', json: info })
            console.log(":::::::::::::::::::::", res)
            if (res.success) {
                Alert.alert('Nachricht erfolgreich gesendet.', 'Wir melden uns in Kürze zurück.')
            }
        }
        catch (e) {
            alert(e)
        }
        finally {
            setLoading(false);
        }
    }
    const ContentData = async () => {
        try {
            let res = await getApiCall({ url: 'manage_content' });
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
            console.error('Error retrieving data: ', error);
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
                            borderColor={color.BDRCLR}
                            placeholder={'NAME/NACHNAME (erforderlich)'}
                            style={styles.txtSize}
                        />
                        <View style={styles.midSpace}>
                            <Text style={{ color: '#000', fontSize: 14, fontFamily: fontFamily.poppinsMedium }}>E-Mail</Text>

                            <FormInput
                                name="Email"
                                control={control}
                                borderColor={color.BDRCLR}
                                placeholder={'E-Mail'}
                                style={styles.txtSize}

                            />
                        </View>
                        <View style={styles.midSpace}>
                            <Text style={{ color: '#000', fontSize: 14, fontFamily: fontFamily.poppinsMedium }}>{'Telefonnummer (optional)'}</Text>

                            <FormInput
                                name='Mobile'
                                borderColor={color.BDRCLR}
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
                                borderColor={color.BDRCLR}
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
                            <Button size={'lg'}
                                variant={'solid'}
                                _text={styles.btnText}
                                disabled={isChecked ? false : true}
                                colorScheme={isChecked ? color.BTNCOLOR : 'gray'}
                                style={styles.buttonStyle}
                                onPress={() => { handleSubmit(onSubmit)() }} >{'Absenden'}
                            </Button>
                            <View style={{
                                marginTop: 15,
                                backgroundColor: color.WHITE,
                                borderWidth: 1,
                                borderColor: color.BDRCLR,
                                padding: 10,
                                borderRadius: 10
                            }}>
                                <Text style={{ color: 'black', fontSize: 15 }}>{contentAdmin}</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
                {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}
                {renderPrivacyModal()}
            </ImageBackground>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
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
        fontFamily: fontFamily.poppinsBold
    },
    welText: {
        color: '#4E4D4D',
        fontFamily: fontFamily.NunitoBold,
        fontSize: 15,
    },
    landText: {
        marginTop: 15,
        color: color.BLACK,
        fontFamily: fontFamily.poppinsBold,
        fontSize: 25,
    },
    fTxt: {
        color: color.BTNCOLOR,
    },
    azubiTxt: {
        color: color.BDRCLR,
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
        backgroundColor: color.WHITE,
    },
    modalBgView: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#00000050"
    },
    modalMainView: {
        backgroundColor: color.WHITE,
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
        color: color.BDRCLR,
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