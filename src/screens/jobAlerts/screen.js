import { Alert, Dimensions, FlatList, Image, ImageBackground, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainHeader from '@/component/MainHeader';
import { Images } from '@/assets/images/images';
import { color, fontFamily } from '@/utils/configuration';
import { Button, Checkbox, Divider, Input } from 'native-base';
import { getApiCall, postApiCall } from '@/utils/ApiHandler';
import RBSheet from 'react-native-raw-bottom-sheet';
import { ModalLocationAlert } from '@/component/ModalLocationAlert';
import RenderHTML from 'react-native-render-html';
import Globals from '@/utils/Globals';
import { useCityAlerts } from '@/Context/CityProviderAlerts';
import moment from 'moment';
import JobAlertListing from './jobAlertListing';
import SaveJobAlert from './saveJobAlert';
import BackHeader from '@/component/BackHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobAlerts = ({ navigation }) => {
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(false);
    const [flatData, setFlatData] = useState([]);
    const [imagetop, setImageTop] = useState('');
    const [heading, setHeading] = useState('');
    const [selectedIndustryName, setSelectedIndustryName] = useState([]);
    const [subHeading, setSubHeading] = useState('');
    const refIndustrySheet = React.useRef();
    const [industryData, setIndustryData] = useState([]);
    const [email, setEmail] = useState('');
    const { selectedCityAlertsId, selectedCityAlerts } = useCityAlerts();
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [IndustryType, setIndustryType] = useState([]);
    const [visibleAlert, setVisibleAlert] = useState(false);
    function OpenIndustryMenu() {
        refIndustrySheet.current.open();
    }
    const { width } = Dimensions.get('screen');

    const CloseIndustryMenu = (selectedIndustries) => {
        // Handle the selected industries as needed
        console.log('Selected Industries:', selectedIndustries);
        setIndustryType(selectedIndustries)
        // Additional logic, e.g., close the bottom sheet
        refIndustrySheet.current.close();
    };
    useEffect(() => {
        const retreiveData = async () => {
            const email = await AsyncStorage.getItem('email') || '';
            setEmail(email);
        }
        retreiveData();
    }, [])
    const jobAlertsSave = async () => {
        let repeatCityParams
        let repeatIndustryParams
        if (selectedCityAlerts && selectedCityAlerts.length > 0) {
            repeatCityParams = selectedCityAlerts.map(city => `${city}`).join(' ');
        }
        if (selectedIndustryName && selectedIndustryName.length > 0) {
            repeatIndustryParams = selectedIndustryName.map(name => `${name}`).join(' ');
        }
        let info = {
            "email": email,
            "location": repeatCityParams,
            "industry": repeatIndustryParams
        }
        try {
            // setLoading(false);
            let res = await postApiCall({
                url: 'alert/job-alarm', json: info
            });

            if (res.status == 200) {
                console.log("jobalarmapiresult", res)
            }
        } catch (e) {
            alert(e);
        }
    }
    const getAllAlertsJobs = async () => {
        let repeatCityParams
        let repeatIndustryParams
        if (selectedCityAlertsId && selectedCityAlertsId.length > 0) {
            repeatCityParams = selectedCityAlertsId.map(cityId => `slectedCity=${cityId}`).join('&');
        }
        if (selectedIndustries && selectedIndustries.length > 0) {
            repeatIndustryParams = selectedIndustries.map(industryId => `isFillter=${industryId}`).join('&');
        }
        try {
            setLoading(false);
            let res = await getApiCall({
                url: 'job/?filter=DSC&' + repeatIndustryParams +
                    '&pageNo=100&recordPerPage=&searchValue=&isFrontend=true&date=' + moment().format('YYYY-MM-DD') +
                    '&' + repeatCityParams
            });

            if (res.status == 200) {
                setFlatData(res.data.jobs);
                { visibleAlert && Alert.alert('Glückwunsch!', 'Dein Job Alarm ist aktiviert') }
                // console.log('responseOfAlertsJob', res.data)
                setLoading(false)
            }
        } catch (e) {
            alert(e);
        } finally {
            setVisibleAlert(true);
            getAllIndustry();
        }
    };
    const getAllIndustry = async () => {
        try {
            let res = await getApiCall({ url: 'industries/get_all_Industry?searchValue=&pageNo=1&recordPerPage=100' });
            if (res.status == 200) {
                const newArr = [{ _id: '', industryName: "Alle" }, ...res?.data.data]
                setIndustryData(newArr);
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false)
        }
    };
    const getAlertsAdminData = async () => {
        try {
            let res = await getApiCall({ url: 'alert' });
            if (res.status == 200) {
                setSubHeading(res.data.subheading);
                setImageTop(res.data.image);
                setHeading(res.data.heading);
            }
        } catch (e) {
            alert(e);
        } finally {
        }
    };
    useEffect(() => {
        getAllIndustry()
        getAlertsAdminData();
        getAllAlertsJobs();
    }, []);
    const renderItemIndustry = (item) => {
        const isChecked = selectedIndustries.includes(item.item._id);
        return (
            <TouchableOpacity onPress={() => handleIndustryCheckboxChange(item.item, !isChecked)}>
                <View style={styles.renderView}>
                    <Text style={{ fontFamily: fontFamily.poppinsMedium, fontSize: 16, color: 'black' }}>{item.item.industryName}</Text>
                    <Image source={isChecked ? Images.checkedIcon : Images.unCheckedIcon}
                        style={{ height: 20, width: 20 }}
                    />
                </View>

            </TouchableOpacity>
        )
    }
    // const getAllAlertsJobs = async () => {
    //     let repeatCityParams
    //     let repeatIndustryParams
    //     if (selectedCityAlertsId && selectedCityAlertsId.length > 0) {
    //         repeatCityParams = selectedCityAlertsId.map(cityId => `slectedCity=${cityId}`).join('&');
    //     }
    //     if (selectedIndustries && selectedIndustries.length > 0) {
    //         repeatIndustryParams = selectedIndustries.map(industryId => `isFillter=${industryId}`).join('&');
    //     }
    //     try {
    //         setLoading(true);
    //         let res = await getApiCall({
    //             url: 'job/?filter=DSC&' + repeatIndustryParams +
    //                 '&pageNo=100&recordPerPage=&searchValue=&isFrontend=true&date=' + moment().format('YYYY-MM-DD') +
    //                 '&' + repeatCityParams
    //         });

    //         if (res.status == 200) {
    //             // setFlatData(res.data.jobs);
    //             console.log('responseOfAlertsJob', res.data)
    //         }
    //     } catch (e) {
    //         alert(e);
    //     } finally {
    //         getAllIndustry();
    //     }
    // };
    const resetFilter = () => {
        setSelectedIndustries([]);
        setSelectedIndustryName([]);
    }
    const handleIndustryCheckboxChange = (item, isChecked) => {
        if (item?._id === '') {
            const allIndustryIds = industryData.map((item) => item._id);
            const allIndustryName = industryData.map((item) => item.industryName);
            setSelectedIndustries(isChecked ? allIndustryIds : []);
            setSelectedIndustryName(isChecked ? allIndustryName : []);
        }
        else {
            setSelectedIndustries((pre) => {
                if (isChecked) {
                    return [...pre, item._id]
                } else {
                    return pre.filter((id) => id !== item._id)
                }
            })
            setSelectedIndustryName((pre) => {
                if (isChecked) {
                    return [...pre, item.industryName]
                } else {
                    return pre.filter((id) => id != item.industryName);
                }
            })
        }
    };
    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title={'Job Alarm'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);
    const tagStyle = {
        body: styles.headingText1
    };
    const tagStyle1 = {
        body: styles.subHeadingText
    };
    const source = {
        html: heading
    }
    const source1 = {
        html: subHeading
    }
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <ImageBackground source={Images.bgImage} style={styles.container}>

                    <View style={{ marginHorizontal: 15, flex: 1 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Image source={{ uri: Globals.BASE_URL + imagetop }} style={styles.img}
                                resizeMode='cover' borderRadius={15} />
                            {/* <Text style={styles.headingText1}>Lass dich uber passende neue Jobs direkt informieren!</Text> */}
                            <RenderHTML
                                contentWidth={width}
                                baseStyle={{ marginTop: -15 }}
                                source={source}
                                tagsStyles={tagStyle}
                            />
                            {/* <Text style={styles.subHeadingText}>Wir empfehlen dir diesen Job Alert</Text> */}
                            <RenderHTML
                                contentWidth={width}
                                baseStyle={{ marginTop: -30 }}
                                source={source1}
                                tagsStyles={tagStyle1}
                            />
                            <TouchableOpacity style={{ marginTop: 0, width: '100%' }} onPress={() => setVisibleLocation(true)}>
                                <View style={{ height: 60, backgroundColor: color.WHITE, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={Images.notification} style={{ height: 50, width: 50 }} />
                                        <Text style={[styles.subHeadingText, { paddingTop: 0 }]}>
                                            {selectedCityAlerts?.length > 0
                                                ? selectedCityAlerts?.length > 1
                                                    ? selectedCityAlerts[0] === 'All'
                                                        ? 'Alle'
                                                        : selectedCityAlerts[0] + ` +${selectedCityAlerts?.length - 1}`
                                                    : selectedCityAlerts[0]
                                                : 'Region wählen'
                                            }
                                        </Text>
                                    </View>
                                    <Image source={Images.forwardArrow} style={{ height: 15, width: 15, marginRight: 15 }} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginTop: 15, width: '100%' }} onPress={() => { OpenIndustryMenu() }}>
                                <View style={{
                                    height: 60,
                                    backgroundColor: color.WHITE,
                                    borderRadius: 10, flexDirection: 'row',
                                    alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between'
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../assets/images/industrial.png')} style={{ height: 20, width: 20, tintColor: 'black' }} />
                                        <Text style={[styles.subHeadingText, { marginLeft: 10, paddingTop: 0 }]}>
                                            {selectedIndustryName?.length > 0
                                                ? selectedIndustryName?.length > 1
                                                    ? selectedIndustryName[0] === 'Alle'
                                                        ? 'Alle ausgewählt'
                                                        : selectedIndustryName[0] + ` +${selectedIndustryName?.length - 1}`
                                                    : selectedIndustryName[0]
                                                : 'Branche'
                                            }
                                        </Text>
                                    </View>
                                    <Image source={Images.forwardArrow} style={{ height: 15, width: 15 }} />
                                </View>
                            </TouchableOpacity>
                            <KeyboardAvoidingView style={{ width: '95%', height: isKeyboardVisible ? '85%' : '15%' }} behavior='padding'>
                                <View style={{ width: '95%' }}>
                                    <Input
                                        returnKeyType='done'
                                        size={'xl'}
                                        marginTop={2}
                                        borderRadius={10}
                                        value={email}
                                        placeholder={'Geben Sie Ihre E-Mail-Adresse ein'}
                                        borderColor={color.BDRCLR}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </KeyboardAvoidingView>
                            <View style={{ justifyContent: 'flex-end', width: '100%', flex: 1, paddingBottom: 10 }}>
                                <Divider marginY={2.5} />
                                <TouchableOpacity style={{
                                    height: 50,
                                    justifyContent: 'center',
                                    width: '100%',
                                    backgroundColor: email ? color.BTNCOLOR : 'gray',
                                    borderRadius: 20, flexDirection: 'row',
                                    alignItems: 'center', paddingHorizontal: 15
                                }} onPress={() => { jobAlertsSave(), getAllAlertsJobs() }}
                                    disabled={email ? false : true}>
                                    <Text style={{
                                        color: color.WHITE, fontWeight: 'bold',
                                        fontFamily: fontFamily.NunitoBold,
                                        fontSize: 18,
                                    }}>{'Job Alarm absenden'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* <>
                            <View style={styles.tabView}>
                                <TouchableOpacity onPress={() => setSelected(0)} style={[styles.touchStyle, { backgroundColor: selected === 0 ? '#2894A2' : 'white' }]}>
                                    <Text style={[styles.tabText, { color: selected === 0 ? 'white' : 'gray' }]}>{'Job Alarm absenden'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelected(1)} style={[styles.touchStyle, { backgroundColor: selected === 1 ? '#2894A2' : 'white' }]}>
                                    <Text style={[styles.tabText, { color: selected === 1 ? 'white' : 'gray' }]}>Benachrichtigungen festlege</Text>
                                </TouchableOpacity>
                            </View>
                            {selected == 0 ? <JobAlertListing loading={loading} data={flatData} /> : <SaveJobAlert />}
                        </> */}

                </ImageBackground>
                {ModalLocationAlert({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}
            </SafeAreaView>
            <RBSheet
                ref={refIndustrySheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,.8)'
                    },
                    draggableIcon: {
                        backgroundColor: '#fff'
                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        elevation: 20,
                        backgroundColor: '#fff',
                    }
                }}
                height={700}
            >
                <View style={{ flex: 1 }}>
                    <View style={styles.flexView}>
                        <Text style={styles.headingText}>{'Branche/n wählen'}</Text>
                        <TouchableOpacity onPress={() => refIndustrySheet.current.close()}>
                            <Image source={Images.modalClose} style={styles.closeImg} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.main}>
                        <FlatList
                            data={industryData}
                            renderItem={renderItemIndustry}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ position: 'absolute', width: '95%', bottom: '5%', alignSelf: 'center' }}>
                        {selectedIndustries.length > 0 &&
                            <View style={{ width: '100%', alignSelf: 'center' }}>
                                {/* <Button
                                    bgColor={'#8C65A3'}
                                    _text={{ fontFamily: fontFamily.poppinsBold, fontWeight: 'bold' }}
                                    size={'lg'}
                                    onPress={() => resetFilter()}
                                    borderRadius={10}
                                >{'Filter zurücksetzen'}</Button> */}
                                <TouchableOpacity onPress={() => resetFilter()} style={{
                                    height: 50, alignItems: 'center',
                                    justifyContent: 'center', width: '97%'
                                }}>
                                    <Text style={{ fontFamily: fontFamily.poppinsMedium, fontSize: 16, color: 'black' }}>{'Filter zurücksetzen'}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <Button
                            bgColor={'#8C65A3'}
                            _text={{ fontFamily: fontFamily.poppinsBold, fontWeight: 'bold' }}
                            size={'lg'}
                            onPress={() => CloseIndustryMenu(selectedIndustries)}
                            style={{ marginTop: 15 }}
                            borderRadius={10}
                        >
                            {'Auswahl speichern'}
                        </Button>
                    </View>
                </View>
            </RBSheet>
        </View>
    )
}

export default JobAlerts

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    img: {
        marginTop: '5%',
        height: '45%',
        width: '100%',
    },
    headingText1: {
        color: '#4E4D4D',
        paddingTop: 10,
        fontWeight: '300',
        fontFamily: fontFamily.poppinsBold,
        fontSize: 18,
    },
    subHeadingText: {
        color: '#4E4D4D',
        paddingTop: 10,
        fontWeight: '300',
        fontFamily: fontFamily.poppinsSeBold,
        fontSize: 14,
    },
    locText: {

    },
    flexView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginHorizontal: 20,
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center'
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
        tintColor: color.BDRCLR,
        alignSelf: 'flex-end'
    },
    main: {
        // marginHorizontal: 20
        width: '88%',
        alignSelf: 'center'
    },
    renderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    tabView: {
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        height: 50,
        alignItems: 'center',
        backgroundColor: color.WHITE,
        justifyContent: 'space-around',
        borderBottomColor: 'gray'
    },
    tabText: {
        fontSize: 15,
        fontFamily: fontFamily.poppinsRegular,
        paddingHorizontal: 5,
    },
    touchStyle: {
        borderRadius: 10,
        // width: '45%',
        height: '50%',
        alignItems: 'center'
    }
})