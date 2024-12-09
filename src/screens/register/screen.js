import { Alert, Dimensions, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/component/Header'
import { Images } from '@/assets/images/images'
import { color, fontFamily } from '@/utils/configuration'
import FormInput from '@/component/FormInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema } from './schema'
import TextAreaInput from '@/component/FormArea'
import { Button, Checkbox } from 'native-base'
import MainHeader from '@/component/MainHeader'
import { getApiCall, postApiCall } from '@/utils/ApiHandler'
import RenderHtml, { RenderHTML } from 'react-native-render-html';
import { ModalLocation } from '@/component/ModalLocation'
import Loader from '@/component/Loader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DeviceInfo from 'react-native-device-info'
import { useDispatch } from 'react-redux'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { selectDeviceId } from '@/redux/reducers/deviceIdSlice'
import moment from 'moment'
import * as ImagePicker from 'react-native-image-picker';
const { width, height } = Dimensions.get('screen');
const Register = ({ navigation }) => {
    const dispatch = useDispatch();
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            Email: "",
            Name: "",
            Mobile: "",
            About: "",
        },
        resolver: yupResolver(registerSchema),
    })
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contentHead, setContentHead] = useState();
    const [date, setDate] = useState();
    const [selImage, setSelImage] = useState();
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [contentSubHead, setContentSubHead] = useState();
    const [contentTxt, setContentTxt] = useState();
    const [isChecked, setIsChecked] = useState(false);
    DeviceInfo.getUniqueId().then((id) => {
        dispatch(selectDeviceId(id));
    })
    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader title={'Meine Daten'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);
    const updateDate = (selectedDate) => {
        setDate(moment(selectedDate).format('DD'));
        setMonth(moment(selectedDate).format('MMM'));
        setYear(moment(selectedDate).format('YYYY'));
    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        updateDate(date);
        hideDatePicker();
    };
    const welcomeData = async () => {
        try {
            setLoading(true);
            let res = await getApiCall({ url: 'manage_content/home-page-v2' });
            if (res.status == 200) {
                setContentHead(res.data.welcomeMessageForApp.heading)
                setContentSubHead(res.data.welcomeMessageForApp.subHeading)
                setContentTxt(res.data.welcomeMessageForApp.text)
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        welcomeData();
        retrieveData();
    }, []);
    const launchImageLibrary = async () => {
        let options = {
            // includeBase64: true,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        await ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                setSelImage({
                    name: response?.assets[0]?.fileName,
                    uri: response?.assets[0]?.uri,
                    type: response?.assets[0]?.type,
                });
            }
        });
    };


    async function contactApi(values) {

        try {
            setLoading(true);
            await AsyncStorage.setItem('name', values.Name || '');
            await AsyncStorage.setItem('phoneNumber', values.Mobile || '');
            await AsyncStorage.setItem('email', values.Email || '');
            await AsyncStorage.setItem('message', values.About || '');
        }
        catch (e) {
            alert(e)
        }
        finally {
            retrieveData();
            Alert.alert('Herzlich Willkommen!', 'Deine Daten sind erfolgreich gespeichert.');

        }
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

    const onSubmit = async (values) => {
        contactApi(values);
    }


    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={Images.bgImage} style={styles.container}>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.main}>
                        <FormInput
                            name='Name'
                            control={control}
                            borderColor={color.BDRCLR}
                            placeholder={'NAME/NACHNAME (erforderlich)'}
                            style={styles.txtSize}
                        />
                        <View style={styles.midSpace}>
                            <FormInput
                                name='Email'
                                control={control}
                                borderColor={color.BDRCLR}
                                placeholder={'E-MAIL (erforderlich)'}
                                style={styles.txtSize}
                            />
                        </View>
                        <View style={styles.midSpace}>
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
                            <TextAreaInput
                                name='About'
                                height={180}
                                borderColor={color.BDRCLR}
                                backgroundColor='white'
                                control={control}
                                placeholder={'Über mich (optional)'}
                                style={styles.txtSize}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.dobView}
                            onPress={() => showDatePicker()}>
                            {date ?
                                <Text style={styles.dobValTextSize}>{`${date}/${month}/${year}`}</Text> :
                                <Text style={styles.dobValTextSize}>Date of birth</Text>}
                            <Image source={Images.calendar1} style={styles.calPicStyle} />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                        <TouchableOpacity
                            style={selImage ?
                                styles.pickerTouch1 :
                                styles.pickerTouch}
                            onPress={() => launchImageLibrary()}>
                            {selImage ?
                                <Image source={{ uri: selImage.uri }}
                                    style={styles.imagePickerStyle}
                                    borderRadius={15} /> :
                                <Image
                                    source={Images.imagePicker}
                                    style={styles.imagePickerStyle} />}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.checkboxTouch}
                            onPress={() => setIsChecked(!isChecked)}>
                            <Checkbox
                                isChecked={isChecked}
                                alignSelf={"center"}
                                value='1'
                                size={"lg"}
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <Text style={styles.labelText}>{`Ich akzeptiere die elektronische Speicherung meiner Daten gemäß der `}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.buttonView}>
                            <Button
                                size={'lg'}
                                variant={'solid'}
                                _text={styles.btnText}
                                colorScheme={color.BTNCOLOR}
                                style={styles.buttonStyle}
                                onPress={() => { handleSubmit(onSubmit)() }}
                            >
                                {'Speichern'}
                            </Button>
                        </View>
                    </View>

                    <View style={styles.main1}>
                        <RenderHTML
                            style={styles.welText}
                            source={{ html: contentHead }}
                        />
                        <RenderHTML
                            source={{ html: contentSubHead }}
                        />
                        <RenderHTML
                            source={{ html: contentTxt }}
                        />
                    </View>
                </ScrollView>
                {ModalLocation({
                    visibleLocation: visibleLocation,
                    setVisibleLocation: setVisibleLocation
                })}
                {loading && <Loader />}
            </ImageBackground>
        </SafeAreaView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        paddingHorizontal: 20,
        marginHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: color.WHITE,
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
        marginTop: 15,
        justifyContent: 'flex-end',
        backgroundColor: '#8C65A3',
        borderRadius: 10

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
    },
    dobView: {
        borderColor: color.BDRCLR,
        borderWidth: 1,
        borderRadius: 15,
        marginVertical: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 15,
        justifyContent: 'space-between'
    },
    calPicStyle: {
        height: 30,
        width: 30
    },
    dobValTextSize: {
        fontSize: 14,
        fontFamily: fontFamily.poppinsRegular,
        color: 'black',
        alignSelf: 'center'
    },
    imagePickerStyle: {
        height: '100%',
        width: '100%'
    },
    pickerTouch: {
        height: height * 0.08,
        width: width * 0.8
    },
    pickerTouch1: {
        height: height * 0.3,
        width: width * 0.8
    },
    labelText: {
        color: color.BLACK,
        fontFamily: fontFamily.poppinsBold,
        fontWeight: '500',
        marginLeft: 10,
        fontSize: 13
    },
    checkboxTouch: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center'
    }
})
