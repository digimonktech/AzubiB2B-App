import { Alert, Dimensions, FlatList, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/component/Header'
import { Images } from '@/assets/images/images'
import { fontFamily, reCol } from '@/utils/configuration'
import FormInput from '@/component/FormInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema } from './schema'
import TextAreaInput from '@/component/FormArea'
import { Button, Checkbox } from 'native-base'
import MainHeader from '@/component/MainHeader'
import { getApiCall, getApiCall1, postApiCall } from '@/utils/ApiHandler'
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
import { selectCompanyId } from '@/redux/reducers/companyIdSlice'
import networkWithoutToken from '@/networkApi/networkWithoutToken'
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
    const [selectedImage, setSelectedImage] = useState([]);
    const [selectedImageShow, setSelectedImageShow] = useState([]);
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [contentSubHead, setContentSubHead] = useState();
    const [contentTxt, setContentTxt] = useState();
    const [isChecked, setIsChecked] = useState(false);
    const [comId, setComId] = useState();
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
        setMonth(moment(selectedDate).format('MM'));
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
    const getCompany = async () => {
        try {
            setLoading(true);
            dispatch(selectCompanyId('6745d20181461ac7a3c48fba'));
            setComId('6745d20181461ac7a3c48fba');
        } catch (error) {
            alert(error);
        }
    }
    const welcomeData = async () => {
        try {
            setLoading(true);
            let res = await getApiCall1({ url: 'manage_content/home-page-v2' });
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
        getCompany();
    }, []);
    const launchImageLibrary = async () => {
        let options = {
            // includeBase64: true,
            selectionLimit: 3 - selectedImageShow.length,
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
                const newImages = [];
                const newImagesBase64 = [];
                response.assets.forEach((image) => {
                    console.log('Image', image);
                    newImages.push(image);
                    newImagesBase64.push({
                        name: image.fileName,
                        type: image.type,
                        uri: image.uri
                    });
                })
                setSelectedImage((prev) => [...prev, ...newImages]);
                setSelectedImageShow((prev) => [...prev, ...newImagesBase64]);
            }
        });
    };

    async function apiContact(values) {
        // console.log('dob', date,month,year)
        try {
            const data = new FormData();
            data.append('companyId', comId);
            data.append('name', values.Name);
            data.append('email', values.Email);
            data.append('phoneNumber', values.Mobile);
            data.append('message', values.About);
            data.append('dateOfBirth', `${date}-${month}-${year}`);
            // { selImage ? data.append('image', selImage) : null }
            if (selectedImageShow.length > 0) {
                selectedImageShow.forEach((image) => {
                    data.append('image', image);
                });
            }
            const response = await networkWithoutToken.createMobileOtp().registerData(data);
            if (response.status === 200) {
                retrieveData()
            } else {
                console.log('Error')
            }
        } catch (error) {
            alert(error)
        }
    }
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
            apiContact(values);
            Alert.alert('Herzlich Willkommen!', 'Deine Daten sind erfolgreich gespeichert.');
            setLoading(false);
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
    const renderItemImage = (item) => {
        const { uri } = item.item;
        const removeImage = (uriToRemove) => {
            // Use the filter method to remove the image at the specified index
            const updatedImageList = selectedImageShow.filter((image) => image.uri !== uriToRemove);
            const updatedbase64List = selectedImage.filter((image) => image.uri !== uriToRemove);
            setSelectedImageShow(updatedImageList);
            setSelectedImage(updatedbase64List);
        };
        return (
            <View style={{
                height: 200, width: width / 3.8,
                paddingLeft: 5, marginTop: 20
            }}>
                <Image source={{ uri: uri }}
                    style={{ height: '100%', width: '100%' }}
                    borderRadius={15}
                />
                <TouchableOpacity style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    top: -10,
                    right: -5
                }} onPress={() => removeImage(uri)}>
                    <Image source={Images.modalClose}
                        style={{
                            height: 20,
                            width: 20,
                        }} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={Images.bgImage} style={styles.container}>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.main}>
                        <FormInput
                            name='Name'
                            control={control}
                            borderColor={reCol().color.BDRCLR}
                            placeholder={'NAME/NACHNAME (erforderlich)'}
                            style={styles.txtSize}
                        />
                        <View style={styles.midSpace}>
                            <FormInput
                                name='Email'
                                control={control}
                                borderColor={reCol().color.BDRCLR}
                                placeholder={'E-MAIL (erforderlich)'}
                                style={styles.txtSize}
                            />
                        </View>
                        <View style={styles.midSpace}>
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
                            <TextAreaInput
                                name='About'
                                height={180}
                                borderColor={reCol().color.BDRCLR}
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
                            style={selectedImage.length > 0 ?
                                styles.pickerTouch1 :
                                styles.pickerTouch}
                            onPress={() => launchImageLibrary()}>
                            {selectedImage.length > 0 ?
                                <FlatList
                                    data={selectedImageShow}
                                    renderItem={renderItemImage}
                                    numColumns={3}
                                />
                                :
                                <Image
                                    source={Images.imagePicker}
                                    style={styles.imagePickerStyle} />}
                            {selectedImage.length < 3 && selectedImage.length != 0 &&
                                <TouchableOpacity
                                    style={{
                                        alignSelf: "center",
                                        marginRight: selectedImage.length === 1 ? '40%' : '10%'
                                    }}
                                    onPress={() => launchImageLibrary()}>
                                    <Image source={Images.addGallery} style={{ height: 65, width: 65, tintColor: reCol().color.BDRCLR }} />
                                </TouchableOpacity>
                            }
                            {(selectedImage.length >= 3 && selectedImage.length < 3) &&
                                <TouchableOpacity
                                    style={{
                                        alignSelf: "flex-end",
                                        position: 'absolute',
                                        left: selectedImage.length === 4 ? '40%' :
                                            selectedImage.length === 3 ? '8%' : '75%',
                                        bottom: selectedImage.length === 3 ? '-40%' : '15%'
                                        // marginRight: selectedImage.length === 4 ? '40%' : '10%'
                                    }}
                                    onPress={() => launchImageLibrary()}>
                                    <Image source={Images.addGallery} style={{ height: 65, width: 65, tintColor: reCol().color.BDRCLR }} />
                                </TouchableOpacity>
                            }
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
                        <View style={[styles.buttonView,
                        { backgroundColor: isChecked ? reCol().color.BTNCOLOR : 'grey' }]}>
                            <Button
                                size={'lg'}
                                variant={'solid'}
                                disabled={isChecked ? false : true}
                                _text={styles.btnText}
                                colorScheme={isChecked ? reCol().color.BTNCOLOR : 'grey'}
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
        backgroundColor: reCol().color.WHITE,
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
    },
    dobView: {
        borderColor: reCol().color.BDRCLR,
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
        width: width * 0.8,
        flexDirection: 'row'
    },
    pickerTouch1: {
        height: height * 0.26,
        width: width * 0.8,
        flexDirection: 'row'
    },
    labelText: {
        color: reCol().color.BLACK,
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
