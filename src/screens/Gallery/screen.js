import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Linking, Platform, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MainHeader from '@/component/MainHeader';
import { ModalLocation } from '@/component/ModalLocation';
import { fontFamily, reCol } from '@/utils/configuration';
import { Images } from '@/assets/images/images';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getApiCall } from '@/utils/ApiHandler';
import { Button } from 'native-base';
import Globals from '@/utils/Globals';
import RNFS from 'react-native-fs';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useCity } from '@/Context/CityProvider';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';
import Share from 'react-native-share';
const { height, width } = Dimensions.get('screen');
const Gallery = ({ navigation }) => {
    const scrollViewRef = useRef(null);
    const [visibleLocation, setVisibleLocation] = useState(false);
    const refIndustrySheet = React.useRef();
    const refImgSheet = React.useRef();
    const [jobTypeData, setJobTypeData] = useState([]);
    const { selectedCityId, showCity } = useCity();
    const [IndustryType, setIndustryType] = useState([]);
    const [scrollTop, setScrollTop] = useState(false);
    // const [flatData, setFlatData] = useState([]);
    const [industryData, setIndustryData] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showIndustry, setShowIndustry] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [jobTypeId, setJobTypeId] = useState('');
    const [zoomImage, setZoomImage] = useState('');
    const [reJobs, setReJobs] = useState();
    const [reJobsUrl, setReJobsUrl] = useState();
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [selectedIndustryName, setSelectedIndustryName] = useState([]);
    const [jobType, setJobType] = useState('Alles anzeigen');
    const refRBSheet = React.useRef();
    const [showLoadImageZoom, setShowLoadImageZoom] = useState(true);
    const LoaderAnimation = require('../../assets/images/Animation - 1713529999054.json');
    const { height, width } = Dimensions.get('screen');
    const comId = useSelector(
        (state) => state.companyId?.companyId
    );
    // const flatData = [
    //     {
    //         image: Images.demoJobWall, cityName: 'Bamberg', txt: [
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' }
    //         ]
    //     },
    //     {
    //         image: Images.demoJobWall, cityName: 'Paris', txt: [
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' }
    //         ]
    //     },
    //     {
    //         image: Images.demoJobWall, cityName: 'USA', txt: [
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' },
    //             { text: 'Rödinghausen' }
    //         ]
    //     }
    // ]
    const [flatData, setFlatData] = useState([]);
    useEffect(() => {
        if (scrollTop && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
            setScrollTop(false); // Reset the scrollTop state
        }
    }, [scrollTop]);
    const handleLoadZoom = () => {
        setShowLoadImageZoom(false);
    };
    const onRefresh = () => {
        setIsRefresh(true);
    };
    function OpenIndustryMenu() {
        refIndustrySheet.current.open();
    }
    function CloseMenu(item) {
        setJobType(item?.jobTypeName)
        setJobTypeId(item?.jobTypeName === 'Alle anzeigen' ? "" : item?._id)
        refRBSheet.current.close();
    }
    function OpenMenu() {
        refRBSheet.current.open();
    }
    function OpenImgMenu(path, jobs, jobUrl) {
        setShowLoadImageZoom(true);
        refImgSheet.current.open();
        setZoomImage(path);
        setReJobs(jobs);
        setReJobsUrl(jobUrl);
    }
    const getJobType = async () => {
        try {
            let res = await getApiCall({ url: 'admin/job-types', params: { companyId: comId } });
            if (res.status == 200) {
                setJobTypeData(res?.data?.jobTypes);
            }

        } catch (e) {
            alert(e);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => { getAllIndustry(), getJobType() }, []);
    useEffect(() => { getAllBanners() }, [IndustryType, isRefresh, selectedCityId, jobType]);
    const getAllBanners = async () => {
        // let repeatCityParams
        // let repeatIndustryParams
        // if (selectedCityId && selectedCityId.length > 0) {
        //     repeatCityParams = selectedCityId.map(cityId => `selectedCity=${cityId}`).join('&');
        // }
        // if (selectedIndustries && selectedIndustries.length > 0) {
        //     repeatIndustryParams = selectedIndustries.map(industryId => `industries=${industryId}`).join('&');
        // }
        // try {
        //     setLoading(true);
        //     let res = await getApiCall({
        //         url: 'banner/app?' +
        //             'pageNo=1&recordPerPage=100&search=&jobType=' + jobTypeId + '&' + repeatIndustryParams +
        //             '&' + repeatCityParams
        //     });

        //     if (res.status == 200) {
        //         setFlatData(res.data);
        //     }
        // } catch (e) {
        //     alert(e);
        // } finally {
        //     getAllIndustry();
        //     setIsRefresh(false);
        // }
        try {
            setLoading(true);

            // Prepare query parameters
            let selectedCityParams = selectedCityId && selectedCityId.length > 0
                ? `selectedCities=${encodeURIComponent(JSON.stringify(selectedCityId))}`
                : '';
            let industryParams = selectedIndustries && selectedIndustries.length > 0
                ? `industry=${encodeURIComponent(JSON.stringify(selectedIndustries))}`
                : '';
            let jobTypeParams = jobTypeId
                ? `jobType=${encodeURIComponent(JSON.stringify([jobTypeId]))}`  // Wrap jobType in an array and stringify
                : '';

            // Combine all query parameters
            const queryParams = [selectedCityParams, industryParams, jobTypeParams]
                .filter(Boolean) // Remove empty parameters
                .join('&');

            // Construct the full URL
            const url = `admin/job-banners?companyId=${comId}&${queryParams}`;

            console.log('Final URL:', url);

            // Make the API call
            let res = await getApiCall({ url });

            if (res.status === 200) {
                setFlatData(res.data);
            }
        } catch (e) {
            console.error('Error:', e);
            alert(e);
        } finally {
            setIsRefresh(false);
            getAllIndustry();
        }
    };
    const CloseIndustryMenu = (selectedIndustries) => {
        // Handle the selected industries as needed
        // console.log('Selected Industries:', selectedIndustries);
        setIndustryType(selectedIndustries)
        // Additional logic, e.g., close the bottom sheet
        refIndustrySheet.current.close();
    };
    const SkeletonLoader = () => {
        return (
            <View style={styles.renderMainLoader}>
                <SkeletonPlaceholder style={styles.renderMainView}>
                    <SkeletonPlaceholder style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 10 }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                                {/* <SkeletonPlaceholder.Item
                                    width={30}
                                    height={30}
                                    borderRadius={15}
                                    marginRight={10}
                                /> */}
                                <SkeletonPlaceholder.Item width="100%" height={50} />
                            </SkeletonPlaceholder.Item>
                            {/* <SkeletonPlaceholder.Item marginTop={10} width="100%" height={30} /> */}
                            <SkeletonPlaceholder.Item
                                flexDirection="row"
                                justifyContent="space-between"
                                marginTop={10}
                            >
                                <SkeletonPlaceholder.Item
                                    width="35%"
                                    height={20}
                                    borderRadius={2}
                                />
                                <SkeletonPlaceholder.Item
                                    width="35%"
                                    height={20}
                                    borderRadius={2}
                                    marginLeft={5}
                                />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    </SkeletonPlaceholder>

                </SkeletonPlaceholder>
            </View>
        );
    };
    const resetFilter = () => {
        setSelectedIndustries([]);
        setSelectedIndustryName([]);
    }
    const getAllIndustry = async () => {
        try {
            let res = await getApiCall({ url: 'admin/industries', params: { companyId: comId } });
            if (res.status == 200) {
                const newArr = [{ _id: '', industryName: "Alle" }, ...res?.data.industries]
                setIndustryData(newArr);
                setShowIndustry(res?.data?.industries[0].companyId?.industryStatus);
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false)
        }
    };
    const naviExt = async (job, url) => {
        if (url === '') {
            navigation.navigate('DetailsJobs', { item: job })
        } else {
            Linking.openURL(url)
        }
    }
    const naviExt1 = async (job, url) => {
        if (url === '') {
            refImgSheet.current.close()
            navigation.navigate('DetailsJobs', { item: job })
        } else {
            refImgSheet.current.close()
            Linking.openURL(url)
        }
    }
    const renderTxt = (item) => {
        return (
            <View>
                <Text style={{
                    color: 'black',
                    fontFamily: fontFamily.poppinsRegular,
                    fontSize: 18
                }}>{item.item}</Text>
            </View>
        )

    }
    const RenderImageComponent = ({ item, navigation }) => {
        const { images, city, addLine } = item;

        return (
            <TouchableHighlight underlayColor={'none'}
                style={styles.mainTouchView}
                onPress={() => { }}>
                <View style={styles.boxImg}>
                    <View style={styles.imgViewSty}>
                        <Image
                            source={{ uri: Globals.BASE_URL + images }}
                            style={styles.imgSty}
                            resizeMode='cover'
                            borderRadius={15}
                        />
                    </View>
                    <View style={styles.descView}>
                        <FlatList
                            data={addLine}
                            renderItem={renderTxt}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                        <TouchableOpacity
                            onPress={() => downloadImage(item.bannerTitle, images)}>
                            <Image
                                source={Images.downloadIcon}
                                style={{ height: 25, width: 25 }}
                            />
                        </TouchableOpacity>
                    </View>
                    {showCity && <View style={styles.locView}>
                        <View style={styles.locView1}>
                            <View>
                                <Image source={Images.location} style={{
                                    height: 15,
                                    width: 15,
                                    tintColor: 'white'
                                }} />
                            </View>
                            <View>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 13,
                                        left: 5,
                                        fontFamily: fontFamily.poppinsRegular
                                    }}
                                >{city.name}</Text>
                            </View>
                        </View>
                    </View>}
                </View>
            </TouchableHighlight>
        );
    };
    const renderImage = ({ item }) => {
        return <RenderImageComponent item={item} navigation={navigation} />;
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
            header: () => <MainHeader title={'JobWall'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);
    const downloadImage = async (imageName, imagePath) => {
        setLoadingImage(true);
        const fileExtension = imagePath.split('.').pop();
        const imageUrl = Globals.BASE_URL + imagePath;
        const imageFilePath = Platform.OS === 'ios'
            ? `${RNFS.DocumentDirectoryPath}/${imageName}.${fileExtension}`
            : `${RNFS.DownloadDirectoryPath}/${imageName}.${fileExtension}`;
        try {
            const res = await RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: imageFilePath,
                background: true,
                discretionary: true,
            }).promise
            // console.log('Resultofdownloadimage', res);
            if (res.statusCode === 200) {
                try {
                    // const result = await CameraRoll.saveAsset(imageFilePath + '/' + imageName, { type: 'photo' });
                    // console.log('Result', result);
                    // if (result) {
                    //     Alert.alert('Glückwunsch!', 'Bild erfolgreich heruntergeladen')
                    // } else {
                    //     alert('Failed to download image, Please try again later');
                    // }
                    const fileExists = await RNFS.exists(imageFilePath);
                    // console.log('File Exists:', fileExists);
                    if (fileExists) {
                        await Share.open({
                            title: 'Share Image',
                            url: Platform.OS === 'ios'
                                ? `file://${imageFilePath}`  // iOS requires file:// prefix
                                : imageFilePath,
                            type: 'image/jpeg',
                            failOnCancel: false, // Avoid error if user cancels
                        });
                        Alert.alert('Glückwunsch!', 'Bild erfolgreich heruntergeladen')
                    }
                } catch (error1) {
                    console.log('error1', error1);
                }
            } else {
                alert('Failed to download image Locally');
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoadingImage(false)
        }
    }
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
    return (
        <View style={[styles.container,
        {
            backgroundColor: loadingImage ? 'lightgray' : 'transparent'
        }]}>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    ref={scrollViewRef}
                    scrollsToTop={scrollTop}
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.infoMainView,
                    {
                        marginTop: loading || flatData.length <= 0 ? '7%' : '3%'
                    }]}>
                        {flatData.length > 0 &&
                            <Text style={[styles.jobsNumberText, { color: reCol().color.BDRCLR }]}>{flatData?.length} {'Ergebnisse'}</Text>}
                        <View style={styles.boxMainView}>
                            <TouchableOpacity style={[styles.sortTouch, { right: 10 }]}
                                onPress={() => { OpenMenu() }}>
                                <View style={styles.sortView}>
                                    <Text style={styles.sortText}>
                                        {jobType.length == 0 ? 'Jobtyp' :
                                            jobType == 'Alles anzeigen' ? 'Job Art' :
                                                jobType.slice(0, 6) + '...'}
                                    </Text>
                                    <Image source={Images.downArrow}
                                        style={styles.sortDownImage}
                                    />
                                </View>
                            </TouchableOpacity>
                            {showIndustry && <TouchableOpacity style={[styles.sortTouch,
                            { left: jobType?.length > 0 ? 0 : 0, width: '52%' }]}
                                underlayColor={'#fff'} activeOpacity={0.5}
                                onPress={() => { OpenIndustryMenu() }}>
                                <View style={[styles.sortView]}>
                                    <Text style={[styles.sortText, {}]}>
                                        {selectedIndustryName?.length > 0
                                            ? selectedIndustryName?.length > 1
                                                ? selectedIndustryName[0] === 'Alle'
                                                    ? 'Alle ausgewählt'.slice(0, 8) + '...'
                                                    : selectedIndustryName[0].length > 15
                                                        ? selectedIndustryName[0].slice(0, 6) + '...'
                                                        : selectedIndustryName[0] + ` +${selectedIndustryName?.length - 1}`
                                                : selectedIndustryName[0].length > 15
                                                    ? selectedIndustryName[0].slice(0, 6) + '...'
                                                    : selectedIndustryName[0]
                                            : 'Branche'
                                        }
                                    </Text>
                                    <Image source={Images.downArrow}
                                        style={styles.sortDownImage}
                                    />
                                </View>
                            </TouchableOpacity>}
                        </View>
                    </View>
                    <View style={{ marginTop: 15 }}>
                        {loading ?
                            <FlatList
                                data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
                                renderItem={() => <SkeletonLoader />}
                                showsVerticalScrollIndicator={false}
                            /> :
                            <FlatList
                                data={flatData}
                                refreshControl={<RefreshControl
                                    refreshing={isRefresh}
                                    onRefresh={onRefresh} />
                                }
                                renderItem={renderImage}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                            />}
                    </View>
                    {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}
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
                    <RBSheet
                        ref={refImgSheet}
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
                        height={730}
                    >
                        <View style={{ flex: 1, backgroundColor: loadingImage ? 'lightgray' : 'transparent' }}>
                            <View style={styles.flexView}>
                                <Text style={styles.headingText}>{'JobWall'}</Text>
                                <TouchableOpacity onPress={() => refImgSheet.current.close()}>
                                    <Image source={Images.modalClose} style={styles.closeImg} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: height * 0.6, marginHorizontal: 15 }}>
                                {showLoadImageZoom && (
                                    <View style={styles.indicatorView}>
                                        <ActivityIndicator size="large" color="gray" />
                                    </View>
                                )}
                                <Image source={{ uri: Globals.BASE_URL + zoomImage.path }}
                                    style={{ height: '100%', width: '100%' }}
                                    resizeMode='contain'
                                    borderRadius={15}
                                    onLoad={handleLoadZoom} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: '8%' }}>
                                    <Button
                                        bgColor={'#8C65A3'}
                                        _text={{ fontFamily: fontFamily.poppinsBold, fontWeight: 'bold' }}
                                        size={'sm'}
                                        onPress={() => naviExt1(reJobs, reJobsUrl)}
                                        style={{ marginTop: 10, }}
                                        borderRadius={10}
                                    >Mehr erfahren</Button>
                                    <TouchableOpacity onPress={() => downloadImage(zoomImage.fileName, zoomImage.path)} style={{ alignItems: 'flex-end', marginTop: 10 }}>
                                        <Image source={Images.downloadIcon} style={{ height: 35, width: 35 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {loadingImage && <LottieView style={styles.animate}
                                source={LoaderAnimation} autoPlay loop
                                colorFilters={[
                                    {
                                        keypath: "asdf",
                                        color: "black",
                                    }
                                ]} />}
                        </View>
                    </RBSheet>
                    <RBSheet
                        ref={refRBSheet}
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
                        height={500}
                    >
                        <View style={styles.flexView}>
                            <Text style={styles.headingText}>{'Nach was suchst du'}</Text>
                            <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                                <Image source={Images.modalClose} style={styles.closeImg} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={jobTypeData}
                            renderItem={({ item }) =>
                                <TouchableOpacity style={{
                                    height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: jobType === item?.jobTypeName ? '#EFEFEF' : '#fff',
                                }}
                                    onPress={() => CloseMenu(item)}>
                                    <Text style={{
                                        fontSize: 15, color: jobType === item.jobTypeName ? reCol().color.BDRCLR : '#000',
                                        textAlign: "center", fontFamily: fontFamily.poppinsBold
                                    }} >{item.jobTypeName}</Text>
                                </TouchableOpacity>
                            }
                            keyExtractor={index => index.toString()} />

                    </RBSheet>
                </ScrollView>
                {loadingImage &&
                    <LottieView style={styles.animate}
                        source={LoaderAnimation} autoPlay loop
                        colorFilters={[
                            {
                                keypath: "asdf",
                                color: "black",
                            }
                        ]} />
                }
                <TouchableOpacity style={{
                    backgroundColor: 'white',
                    borderRadius: 100 / 2,
                    height: height * 0.04,
                    width: width * 0.1,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    top: '93%',
                    right: 10,
                }} onPress={() => setScrollTop(true)}>
                    <Image
                        source={require('../../assets/images/upArrow.png')}
                        style={{ height: '50%', width: '50%' }}
                    />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

export default Gallery

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainTouchView: {
        marginHorizontal: 10,
        marginVertical: 10,
        width: '95%',
        borderRadius: 15
    },
    infoMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: '3%'
    },
    sortView: {
        flexDirection: 'row',
        backgroundColor: reCol().color.WHITE,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    sortTouch: {
        flexDirection: 'row',
        backgroundColor: reCol().color.WHITE,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        elevation: 10,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,

    },
    sortText: {
        color: reCol().color.BLACK,
        fontFamily: fontFamily.poppinsLight,
        fontWeight: '200',
        fontSize: 12,
    },
    sortDownImage: {
        marginLeft: 5,
        height: 15,
        width: 15,
    },
    boxImg: {

    },
    imgSty: {
        height: '100%',
        width: '100%'
    },
    flexView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center'
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
        tintColor: reCol().color.BDRCLR,
        alignSelf: 'flex-end'
    },
    main: {
        width: '88%',
        height: '75%',
        alignSelf: 'center'
    },
    renderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    renderMainLoader: {
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: reCol().color.WHITE,
        width: '45%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: '85%',
        flexDirection: 'row'
    },
    renderMainView: {
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: reCol().color.WHITE,
        width: '45%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: '85%',
        flexDirection: 'row'
    },
    jobsNumberText: {
        color: reCol().color.BDRCLR,
        fontFamily: fontFamily.poppinsSeBold,
        fontWeight: '400',
        marginBottom: 10,
        fontSize: 15
    },
    descView: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop: 10,
        justifyContent: 'space-between'
    },
    indicatorView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    animate: {
        width: '25%',
        height: '25%',
        alignSelf: 'center',
        top: '35%',
        backgroundColor: 'transparent',
        color: '#000',
        tintColor: '#000',
        overlayColor: '#30853A',
        position: 'absolute',
    },
    boxMainView: {
        width: '45%',
        flexDirection: 'row-reverse',
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        right: 0
    },
    imgViewSty: {
        height: height * 0.5,
        width: width * 0.97,
        borderRadius: 15
    },
    locView: {
        flexDirection: 'row',
        marginHorizontal: 15,
        alignItems: 'center',
        marginTop: 10,

    },
    locView1: {
        backgroundColor: '#0096A4',
        flexDirection: 'row',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingEnd: 15
    }
})