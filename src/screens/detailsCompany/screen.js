import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, FlatList, TouchableHighlight, Linking, ActivityIndicator } from 'react-native';
import { Images } from '@/assets/images/images';
import { fontFamily, reCol } from '@/utils/configuration';
import { ModalApply, ModalAppointment, ModalIndustry, ModalJobPic } from '@/component/Modal';
import BackHeader from '@/component/BackHeader';
import { getApiCall } from '@/utils/ApiHandler';
import Globals from '@/utils/Globals';
import RenderHTML from 'react-native-render-html';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useCity } from '@/Context/CityProvider';
import { ModalLocation } from '@/component/ModalLocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/component/Loader';
import YoutubePlayer from "react-native-youtube-iframe";
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
const DetailsCompany = ({ navigation, route }) => {
    const [visibleAppointments, setVisibleAppointments] = useState(false);
    const [visibleApply, setVisibleApply] = useState(false);
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [flatData, setFlatData] = useState([]);
    const [locIcon, setLocIcon] = useState();
    const [IndIcon, setIndIcon] = useState();
    const [detailImage, setDetailImage] = useState('');
    const [visibleImage, setVisibleImage] = useState(false);
    const [contIcon, setContIcon] = useState();
    const [companyJobs, setCompanyJobs] = useState([]);
    const { item } = route.params;
    // console.log('ItemsOfCompanyDetails', item);
    const { selectedCityId } = useCity();
    const [jobDetails, setJobDetails] = useState([]);
    const [loader, setLoader] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [showLoadImage, setShowLoadImage] = useState(true);
    const handleLoad = () => {
        setShowLoadImage(false);
    };
    const comId = useSelector(
            (state) => state.companyId?.companyId
        );
    const getCompaniesIcons = async () => {
        try {
            setLoading(true);
            let res = await getApiCall({ url: 'manage_content/job-wall' });
            if (res.status == 200) {
                setLocIcon(res.data.locationIcon.filepath);
                setContIcon(res.data.contactPersonIcon.filepath);
                setIndIcon(res.data.industryIcon.filepath)
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false)
        }
    };
    const id = useSelector(
        (state) => state.deviceId?.deviceId
    );
    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            // Alert.alert("video has finished playing!");
        }
    }, []);
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const existingData = await AsyncStorage.getItem('jobSaved');
                    if (existingData) {
                        const savedItems = JSON.parse(existingData).map(item => item._id);
                        setSavedJobs(savedItems);
                    }
                } catch (error) {
                    console.error('Error fetching saved data from local storage:', error);
                }
            };

            fetchData();
        }, [])
    );

    const saveJob = async (savedItem) => {
        try {
            const existingData = await AsyncStorage.getItem('jobSaved');
            const isIdPresent = JSON.parse(existingData)?.some((item) => item._id === savedItem._id);
            // console.log('Is ID present:', isIdPresent);
            if (isIdPresent) {
                const updatedData = JSON.parse(existingData).filter((item) => item._id !== savedItem._id);
                await AsyncStorage.setItem('jobSaved', JSON.stringify(updatedData));
                setSavedJobs(savedJobs.filter(id => id !== savedItem._id));
            }
            else {
                let dataArray = [];
                if (existingData) {
                    dataArray = JSON.parse(existingData);
                }
                // console.log('dataResponseResult', dataResponse);
                dataArray.push(savedItem);
                await AsyncStorage.setItem('jobSaved', JSON.stringify(dataArray));
                setSavedJobs([...savedJobs, savedItem._id]);
            }
        } catch (error) {
            console.error('Error saving data to local storage:', error);
        }
    }
    const renderItem = ({ item }) => {
        const isSaved = savedJobs.includes(item._id);;
        return (
            <TouchableHighlight underlayColor={'none'}>
                <View style={[styles.renderMainView, { height: 160 }]}>

                    <TouchableOpacity style={{ width: '80%', paddingHorizontal: 10, paddingVertical: 10, }} onPress={() => navigation.navigate('DetailsJobs', { item: item })} activeOpacity={0.5}>
                        <Text style={styles.nameTxt} numberOfLines={2}>{item?.jobTitle}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, width: '85%' }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 5, height: 25, width: 25, alignItems: 'center', justifyContent: 'center', }}>
                                <Image style={{ height: '100%', width: '100%' }} resizeMode='center' source={{ uri: Globals.BASE_URL.concat(item?.companyLogo) }} />
                            </View>
                            <Text style={[styles.nameTxt, { color: '#F1841D', left: 10 }]} numberOfLines={2}>{item?.company}</Text>
                        </View>
                        <View style={styles.locView}>
                            <Image source={Images.location} style={styles.locImage} resizeMode='contain' />
                            <Text style={styles.locTxt}>{item?.city.join(', ')}</Text>
                        </View>
                        <View style={[styles.locView, { marginTop: 5 }]}>
                            <View style={{ backgroundColor: '#95A000', borderRadius: 2, height: 20, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 11, fontFamily: fontFamily.poppinsRegular }}>{item.jobType}</Text>
                            </View>
                            <View style={{ backgroundColor: '#007F9D', borderRadius: 2, height: 20, width: '25%', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', left: 5 }}>
                                <Text style={{ color: '#fff', fontSize: 11, fontFamily: fontFamily.poppinsRegular }}>{item?.industryName}</Text>
                            </View>
                        </View>


                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <TouchableOpacity style={{ height: '50%', width: '20%', backgroundColor: reCol().color.EMLCLR, borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { getJobsDetails(item._id) }}>
                            <Image style={{ height: 20, width: 24 }} resizeMode='contain' source={require('../../assets/images/sms-tracking.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: '50%', width: '20%', backgroundColor: reCol().color.HRTCLR, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => saveJob(item)}>
                            <Image style={{ height: 20, width: 24 }} resizeMode='contain' source={isSaved ? require('../../assets/images/heartFill.png') : require('../../assets/images/heartEmpty.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title={'Zurück'} press={() => setVisibleLocation(true)} />,
        });
    }, [navigation]);


    React.useEffect(() => {
        getCompaniesDetails();
        getCompaniesIcons();
    }, []);

    useEffect(() => {
        getCompaniesJobs();
    }, [selectedCityId])


    const getCompaniesDetails = async () => {
        try {
            setLoading(true);
            let res = await getApiCall({ url: `admin/company/${comId}` });
            if (res.status == 200) {
                setFlatData([res.data]);
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false)
        }
    };


    const renderImages = ({ item }) => {
        return (
            <TouchableOpacity
                style={[styles.locView, { marginTop: 10, marginRight: 10 }]}
                onPress={() => { setDetailImage(item), setVisibleImage(true) }}>
                <Image
                    source={{ uri: Globals.BASE_URL + item }}
                    style={styles.camPic} resizeMode='contain'
                />
            </TouchableOpacity>
        )
    }

    const renderSeketon = () => {

        return (
            <View>
                <View style={styles.jobDetailBox}>
                    <View style={{ width: '100%' }}>
                        <SkeletonPlaceholder style={styles.mainFlexView}>
                            <SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                                    <SkeletonPlaceholder.Item width={80} height={80} borderRadius={40} marginRight={20} />
                                    <SkeletonPlaceholder.Item>
                                        <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} marginBottom={6} />
                                        <SkeletonPlaceholder.Item width={100} height={14} borderRadius={4} />
                                    </SkeletonPlaceholder.Item>
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder.Item>

                        </SkeletonPlaceholder>
                    </View>
                    <View style={styles.mainFlexView1}>
                        <SkeletonPlaceholder.Item width={100} height={100} borderRadius={50} />
                    </View>
                </View>





                <View style={[styles.jobDetailBox, styles.jobDetailBox1]}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item marginBottom={10}>
                            <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={250} height={16} borderRadius={4} marginTop={6} />
                        </SkeletonPlaceholder.Item>

                        {/* Repeat the above structure for other sections */}

                        <SkeletonPlaceholder.Item marginTop={20}>
                            <SkeletonPlaceholder.Item width={200} height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={300} height={16} borderRadius={4} marginTop={6} />
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item marginTop={20}>
                            {/* Customize this for your FlatList items */}
                            <FlatList
                                data={[1, 2, 3, 4]}
                                keyExtractor={(item) => item.toString()}
                                renderItem={({ item }) => (
                                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={10}>
                                        <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} marginRight={10} />
                                        <SkeletonPlaceholder.Item flex={1} height={40} borderRadius={4} />
                                    </SkeletonPlaceholder.Item>
                                )}
                            />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>

                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item marginBottom={10}>
                            <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={250} height={16} borderRadius={4} marginTop={6} />
                        </SkeletonPlaceholder.Item>

                        {/* Repeat the above structure for other sections */}

                        <SkeletonPlaceholder.Item marginTop={20}>
                            <SkeletonPlaceholder.Item width={200} height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={300} height={16} borderRadius={4} marginTop={6} />
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item marginTop={20}>
                            {/* Customize this for your FlatList items */}
                            <FlatList
                                data={[1, 1, 1, 1]}
                                keyExtractor={(item) => item.toString()}
                                renderItem={({ item }) => (
                                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={10}>
                                        <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} marginRight={10} />
                                        <SkeletonPlaceholder.Item flex={1} height={40} borderRadius={4} />
                                    </SkeletonPlaceholder.Item>
                                )}
                            />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>


                    <View style={[styles.locView, { paddingVertical: 20 }]}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                                <SkeletonPlaceholder.Item width={40} height={20} borderRadius={4} marginRight={10} />
                                <SkeletonPlaceholder.Item width={80} height={20} borderRadius={4} />
                                <SkeletonPlaceholder.Item width={20} height={20} borderRadius={4} marginLeft={10} />
                                <SkeletonPlaceholder.Item width={80} height={20} borderRadius={4} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    </View>

                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={'100%'} height={50} borderRadius={10} marginTop={15} />
                    </SkeletonPlaceholder>
                    <View style={{ height: 40 }} />
                </View>
            </View>
        )
    }
    const shareEmail = async (email) => {
        const link = `https://www.azubiregional.de/unternehmen/${item._id}`
        const shareOptions = {
            social: Share.Social.EMAIL,
            email: email,
            subject: 'Bewerbung auf AzubiRegional.de',
            message: `Sehr geehrte/r Herr/Frau ,
            
            über AzubiRegional.de bin ich auf Ihre Stellenanzeige aufmerksam geworden:
            ${link}
            
            Hiermit bewerbe ich mich auf die von Ihnen ausgeschriebene Stelle in Ihrem Unternehmen. Nachfolgend übersende ich Ihnen im Anhang meine Bewerbungsunterlagen. 
            
            Über eine positive Rückmeldung würde ich mich freuen.
            
            Für Rückfragen bin ich gerne für Sie erreichbar.
            
            Mit freundlichen Grüßen,`,
            title: item?.companyName
        }
        try {
            const shareResponse = await Share.shareSingle(shareOptions);
            // console.log('Shared successfully:', shareResponse);
        } catch (error) {
            console.error('Sharing failed:', error);
            alert(error);
        }
    }

    const renderCompanyDetails = ({ item }) => {

        const cleanHtmlContent = (html) => {
            return html?.replace(/<p><br><\/p>/g, '');
        };
        const cleanedData = cleanHtmlContent(item?.companyDescription);
        const extractVideoId = (url) => {
            const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

            return videoIdMatch ? videoIdMatch[1] : null;
        };

        const videoIds = item?.videoLink?.map(extractVideoId);

        return (
            <View style={[styles.jobDetailBox, styles.jobDetailBox1]}>
                <Text style={styles.titleText}>{'E-Mail'}</Text>
                <TouchableOpacity>
                    <Text style={styles.aboutComText}>{item?.email}</Text>
                </TouchableOpacity>
                {/* <Text style={styles.titleText}>{'Webseite'}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(item?.website)}>
                    <Text style={styles.aboutComText}>{item?.website}</Text>
                </TouchableOpacity> */}
                <Text style={styles.titleText}>{'Telefonnummer'}</Text>
                <TouchableOpacity>
                    <Text style={styles.aboutComText}>{item?.phoneNumber}</Text>
                </TouchableOpacity>
                <RenderHTML
                    style={styles.aboutComText}
                    enableExperimentalMarginCollapsing={true}
                    source={{ html: cleanedData }}
                />

                <FlatList data={item?.companyImages}
                    renderItem={renderImages}
                    keyExtractor={index => index.toString()}
                    numColumns={2} />

                {item?.videoLink != "" &&
                    <YoutubePlayer
                        height={230}
                        play={playing}
                        playList={videoIds}
                        onChangeState={onStateChange}
                        webViewStyle={{ borderRadius: 20, borderCurve: 'circular', top: 30, elevation: 10 }}
                    />
                }

                <TouchableOpacity style={{ width: '100%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', height: 50, backgroundColor: reCol().color.BTNCOLOR, borderRadius: 10, top: 15, flexDirection: 'row' }} activeOpacity={0.5} onPress={() => { setVisibleAppointments(true) }}>
                    <Image source={require('../../assets/images/sms-tracking.png')} style={{ height: 20, width: 20 }} resizeMode='contain' tintColor={'#fff'} />
                    <Text style={{ fontFamily: fontFamily.poppinsSeBold, fontSize: 16, color: '#fff', left: 5 }}>{'Direktbewerbung absenden'}</Text>
                </TouchableOpacity>
                <View style={{ height: 40 }} />

            </View>
        )
    }




    const getCompaniesJobs = async () => {
        try {
            setLoading(true);
            let res = await getApiCall({
                url: 'employer/get-jobs-by-id?companyId=' +
                    item?._id + '&skip=0&slectedCity=' +
                    selectedCityId
            });
            if (res.status == 200) {
                console.log('Companies Jobs', res.data)
                setCompanyJobs(res.data);
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    };



    const getJobsDetails = async (id) => {
        try {
            setLoader(true);
            let res = await getApiCall({ url: 'job/' + id });
            if (res.status == 200) {
                setJobDetails(res.data);
                setVisibleApply(true);
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoader(false);
            setVisibleApply(true);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground style={styles.container} source={Images.bgImage}>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.jobDetailBox}>
                        <View style={styles.mainFlexView}>
                            <Text style={styles.nameTxt}>{item?.companyname}</Text>
                            <View style={styles.locView}>
                                <Image
                                    source={require('../../assets/images/locationDetail.png')}
                                    style={styles.locImage}
                                />
                                <Text style={styles.locTxt}>{item?.city.name}</Text>
                            </View>
                            <View style={styles.locView}>
                                <Image source={require('../../assets/images/contactDetail.png')} style={styles.locImage} />
                                <Text style={styles.locTxt}>{flatData[0]?.contactPerson}</Text>
                            </View>
                            <View style={styles.locView}>
                                <Image source={require('../../assets/images/serachDetail.png')} style={styles.locImage} />
                                <Text style={styles.locTxt}>{item?.industryName?.industryName}</Text>
                            </View>
                        </View>
                        <View style={styles.mainFlexView1}>
                            {showLoadImage && (
                                <View style={styles.indicatorView}>
                                    <ActivityIndicator size="small" color="gray" />
                                </View>
                            )}
                            <Image
                                source={{ uri: Globals.BASE_URL + item?.profileIcon }}
                                style={styles.headingImage}
                                onLoad={handleLoad}
                                resizeMode='contain'
                            />
                        </View>
                    </View>
                    {item.mapUrl && <TouchableOpacity style={[styles.jobDetailBox,
                    { flexDirection: 'row', height: 50, paddingVertical: 0, paddingHorizontal: 0, justifyContent: 'space-between' }]}
                        onPress={() => { Linking.openURL(item.mapUrl) }}>
                        <Text style={[styles.nameTxt, { alignSelf: 'center', paddingLeft: 15 }]}>Standort / Route anzeigen</Text>
                        <View
                            style={{
                                height: 50,
                                width: '15%',
                                backgroundColor: '#0096A438',
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            activeOpacity={0.5}
                        >
                            <Image style={{ height: 20, width: 24, }} resizeMode='contain' source={require('../../assets/images/shiftArrow.png')} />
                        </View>
                    </TouchableOpacity>}
                    {item.locationUrl && <TouchableOpacity style={[styles.jobDetailBox,
                    { flexDirection: 'row', height: 50, paddingVertical: 0, paddingHorizontal: 0, justifyContent: 'space-between' }]}
                        onPress={() => { Linking.openURL(item.locationUrl) }}>
                        <Text style={[styles.nameTxt, { alignSelf: 'center', paddingLeft: 15 }]}>{`Erfahre mehr über uns`}</Text>
                        <View
                            style={{
                                height: 50,
                                width: '15%',
                                backgroundColor: '#0096A438',
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            activeOpacity={0.5}
                        >
                            <Image style={{ height: 20, width: 24, }} resizeMode='contain' source={require('../../assets/images/shiftArrow.png')} />
                        </View>
                    </TouchableOpacity>}
                    {loading ?
                        <FlatList data={[1]} renderItem={renderSeketon} showsVerticalScrollIndicator={false} keyExtractor={index => index.toString()} />
                        :
                        <FlatList data={flatData} renderItem={renderCompanyDetails} showsVerticalScrollIndicator={false} keyExtractor={index => index.toString()} />
                    }



                    {/* {companyJobs?.length > 0 &&
                        <Text style={[styles.titleText, { marginHorizontal: 15 }]}>{'Aktuelle Jobs'}</Text>
                    }
                    <FlatList data={companyJobs} renderItem={renderItem} showsVerticalScrollIndicator={false} keyExtractor={index => index.toString()} ListHeaderComponent={() => {

                    }} /> */}
                </ScrollView>
            </ImageBackground>
            {loader && <Loader />}
            {ModalAppointment({ visibleAppointment: visibleAppointments, setVisibleAppointment: setVisibleAppointments, appointmentData: flatData })}
            {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation, navigation: navigation })}
            {ModalApply({ visibleApply, setVisibleApply, applyData: jobDetails, deviceId: id })}
            {ModalJobPic({ visibleJobImage: visibleImage, setVisibleJobImage: setVisibleImage, imageData: detailImage })}
        </SafeAreaView>
    );
};

export default DetailsCompany;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    jobDetailBox: {
        marginHorizontal: 15,
        paddingHorizontal: 15,
        marginVertical: 15,
        paddingVertical: 15,
        backgroundColor: reCol().color.WHITE,
        borderRadius: 10,
        flexDirection: 'row',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    jobDetailBox1: {
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
    },
    locView: {
        flexDirection: 'row',
        elevation: 10,
    },
    mainFlexView: {
        width: '80%',
    },
    nameTxt: {
        color: reCol().color.BDRCLR,
        fontFamily: fontFamily.poppinsBold,
        fontWeight: 'bold',
        fontSize: 13,
    },
    locTxt: {
        marginTop: 5,
        marginLeft: 5,
        color: reCol().color.BLACK,
        fontFamily: fontFamily.poppinsLight,
        fontWeight: '300',
        fontSize: 12,
    },
    locImage: {
        marginTop: 5,
        height: 15,
        width: 15,
    },
    mainFlexView1: {
        width: '15%',
    },
    headingImage: {
        height: 90,
        width: 90,
        alignSelf: 'center',
        borderRadius: 20
    },
    aboutComText: {
        color: reCol().color.BLACK,
        paddingTop: 5,
        fontFamily: fontFamily.poppinsRegular,
        fontSize: 13,
    },
    titleText: {
        color: reCol().color.BDRCLR,
        paddingTop: 10,
        fontWeight: 'bold',
        fontSize: 13,
    },
    camPic: {
        height: 160,
        width: 160,
        borderRadius: 20
    },
    renderMainView: {
        marginVertical: 10,
        // paddingHorizontal: 10,
        // paddingVertical: 10,
        // marginHorizontal: 15,
        borderRadius: 10,
        flex: 1,
        width: '90%',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        alignSelf: 'center',
        justifyContent: 'space-between',
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: reCol().color.WHITE,
    },
    editCalTaskImage: {
        height: 20,
        width: 20,
    },
    renderView: {
        marginVertical: 10,
        // paddingHorizontal: 10,
        // paddingVertical: 10,
        // marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: reCol().color.WHITE,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        // height: 140,
        flex: 1,
        flexDirection: 'row'
    },
    indicatorView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
});

