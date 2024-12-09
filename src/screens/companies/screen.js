import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ImageBackground, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Platform, Dimensions } from 'react-native';
import { Images } from '@/assets/images/images';
import { color, fontFamily } from '@/utils/configuration';
import { Icon, Input } from 'native-base';
import Loader from '@/component/Loader';
import MainHeader from '@/component/MainHeader';
import { ModalAppointment } from '@/component/Modal';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getApiCall } from '@/utils/ApiHandler';
import Globals from '@/utils/Globals';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from "native-base";
import RenderHtml from 'react-native-render-html';
import { ModalLocation } from '@/component/ModalLocation';
import { useCity } from '@/Context/CityProvider';

const Companies = (props) => {
    const { height, width } = Dimensions.get('screen');
    const { navigation } = props;
    const [loading, setLoading] = useState(false);
    const [flatData, setFlatData] = useState([]);
    const [selectedIndustryName, setSelectedIndustryName] = useState([]);
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [scrollTop, setScrollTop] = useState(false);
    const refIndustrySheet = React.useRef();
    const [IndustryType, setIndustryType] = useState([]);
    const [industryData, setIndustryData] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [loader, setLoader] = useState(false);
    const [companyJobs, setCompanyJobs] = useState([]);
    const { selectedCityId } = useCity();
    const [isRefresh, setIsRefresh] = useState(false);
    const [visibleAppointments, setVisibleAppointments] = useState(false);
    const scrollViewRef = useRef(null);
    const onRefresh = () => {
        setIsRefresh(true);
    };
    useEffect(() => {
        if (scrollTop && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
            setScrollTop(false); // Reset the scrollTop state
        }
    }, [scrollTop]);
    useEffect(() => {
        getAllCompanies();
    }, [!searchValue, IndustryType, selectedCityId, isRefresh]);


    useEffect(() => {
        getCompanySearchApi();
    }, [searchValue]);


    const getCompanySearchApi = async () => {
        let repeatIndustryParams
        let repeatCityParams

        try {
            if (searchValue.length >= 3 || searchValue.length == 0) {
                setLoading(true);
                let res = await getApiCall({ url: 'employer/get-all-emp-frontend?' + repeatIndustryParams + '&searchValue=' + searchValue + '&' + repeatCityParams });
                if (res.status == 200) {
                    setFlatData(res.data);
                }
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    };



    const getAllCompanies = async () => {
        let repeatIndustryParams
        let repeatCityParams
        if (selectedCityId && selectedCityId.length > 0) {
            repeatCityParams = selectedCityId.map(cityId => `slectedCity=${cityId}`).join('&');
        }
        if (selectedIndustries && selectedIndustries.length > 0) {
            repeatIndustryParams = selectedIndustries.map(industryId => `isFillter=${industryId}`).join('&');
        }
        try {
            setLoading(true);
            let res = await getApiCall({ url: 'employer/get-all-emp-frontend?' + repeatIndustryParams + '&searchValue=' + searchValue + '&' + repeatCityParams });
            if (res.status == 200) {
                setFlatData(res.data);
            }
        } catch (e) {
            alert(e);
        } finally {
            setIsRefresh(false);
            getAllIndustry();
        }
    };

    const RenderImageComponent = ({ item }) => {
        const { companyName, industryName, companyLogo } = item;
        const truncateHtml = (htmlString, maxLength) => {
            // Convert HTML string to plain text
            const plainText = htmlString.replace(/<[^>]*>?/gm, '');

            // Return the first 'maxLength' characters of the plain text
            return plainText.length > maxLength ? `${plainText.substring(0, maxLength)}...` : plainText;
        };
        const [showLoadImage, setShowLoadImage] = useState(true);
        const handleLoad = () => {
            setShowLoadImage(false);
        };
        return (
            <View>
                <View style={styles.renderMainView}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, height: 50, width: 50, alignItems: 'center', justifyContent: 'center', margin: 5 }}>
                        {showLoadImage && (
                            <View style={styles.indicatorView}>
                                <ActivityIndicator size="small" color="gray" />
                            </View>
                        )}
                        <Image style={{ height: '100%', width: '100%', borderRadius: 10 }} resizeMode='cover' source={{ uri: Globals.BASE_URL + companyLogo }} onLoad={handleLoad} />
                    </View>
                    <TouchableOpacity style={{ width: '60%', paddingHorizontal: 10, paddingVertical: 10 }} onPress={() => navigation.navigate('DetailsCompany', { item: item })}>
                        <Text style={styles.nameTxt} numberOfLines={2}>{companyName}</Text>
                        <Text style={[styles.nameTxt, { color: '#646464', fontFamily: fontFamily.poppinsRegular, marginTop: Platform.OS === 'ios' ? 5 : 0 }]}>{industryName}</Text>
                        <View style={[styles.locView, { marginTop: Platform.OS === 'ios' ? 5 : 0 }]}>
                            <Image source={Images.location} style={styles.locImage} resizeMode='contain' />
                            <Text style={styles.locTxt}>{item?.location}</Text>
                        </View>
                        {/* <View style={{ marginTop: Platform.OS === 'ios' ? 10 : 0 }}>
                            <RenderHtml
                                style={[styles.nameTxt, { color: '#646464', fontFamily: fontFamily.poppinsRegular }]}
                                source={{ html: truncateHtml(item?.description, 26) }}
                            />
                        </View> */}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ height: '100%', width: '20%', borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue' }} onPress={() => { getCompaniesDetails(item._id) }}>
                        <Image style={{ height: 24, width: 24 }} resizeMode='contain' source={require('../../assets/images/sms-tracking.png')} />
                        <Text style={{ color: '#646464', fontSize: 10, fontFamily: fontFamily.poppinsRegular }}>{'E-Mail'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const renderItem = ({ item }) => {
        return <RenderImageComponent item={item} navigation={navigation} />;
    };


    const SkeletonLoader = () => {
        return (
            <View style={styles.renderMainLoader}>
                <SkeletonPlaceholder style={styles.renderMainView}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                            <SkeletonPlaceholder.Item
                                width={50}
                                height={50}
                                borderRadius={25}
                                marginRight={10}
                            />
                            <SkeletonPlaceholder.Item width="60%" height={20} />
                        </SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item marginTop={10} width="100%" height={30} />
                        <SkeletonPlaceholder.Item
                            flexDirection="row"
                            justifyContent="space-between"
                            marginTop={10}
                        >
                            <SkeletonPlaceholder.Item
                                width="50%"
                                height={20}
                                borderRadius={5}
                            />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                </SkeletonPlaceholder>
            </View>
        );
    };


    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader title={'Unternehmen'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);

    function OpenIndustryMenu() {
        refIndustrySheet.current.open();
    }


    const CloseIndustryMenu = (selectedIndustries) => {
        // Handle the selected industries as needed
        // console.log('Selected Industries:', selectedIndustries);
        setIndustryType(selectedIndustries)
        // Additional logic, e.g., close the bottom sheet
        refIndustrySheet.current.close();
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
            setLoading(false);
        }
    };



    const getCompaniesDetails = async (id) => {
        try {
            setLoader(true);
            let res = await getApiCall({ url: 'employer/company-detail/' + id });
            if (res.status == 200) {
                setCompanyJobs(res.data);

            }
        } catch (e) {
            alert(e);
        } finally {
            setLoader(false)
            setVisibleAppointments(true)
        }
    };



    const handleIndustryCheckboxChange = (item, isChecked) => {
        if (item?._id === '') {
            // Check or uncheck all other items based on the special item's state
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
    const resetFilter = () => {
        setSelectedIndustries([]);
        setSelectedIndustryName([]);
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
        <SafeAreaView style={styles.container}>


            <ScrollView
                ref={scrollViewRef}
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                    refreshing={isRefresh}
                    onRefresh={onRefresh}
                />}
                scrollsToTop={scrollTop}>

                <ImageBackground style={styles.container} source={Images.bgImage}>
                    <View style={[styles.whiteBox, { marginTop: 5 }]}>
                        <View style={styles.fieldView}>
                            <Input
                                placeholder={'Berufsbezeichnung, Stichwörter oder Unternehmen'}
                                style={{ fontSize: 13 }}
                                variant={'unstyled'}
                                size={'md'}
                                value={searchValue}
                                onChangeText={(txt) => setSearchValue(txt)}
                                returnKeyType='done'
                                InputLeftElement={<Icon
                                    ml="2"
                                    size="5"
                                    as={<Image source={Images.search} />}
                                />} bgColor={color.WHITE} marginTop={5}
                                InputRightElement={
                                    searchValue ?
                                        <TouchableOpacity onPress={() => setSearchValue('')}>
                                            <Icon ml="2" size="5" marginRight={2}
                                                as={<Image source={Images.modalClose} />}
                                            /></TouchableOpacity> : null} />
                        </View>
                    </View>
                    <View style={styles.infoMainView}>
                        <Text style={styles.jobsNumberText}>{flatData?.length} {'Unternehmen gefunden'}</Text>
                        <TouchableOpacity style={[styles.sortTouch,
                        { width: '32%' }]}
                            underlayColor={'#fff'} activeOpacity={0.5}
                            onPress={() => { OpenIndustryMenu() }}>
                            <View style={[styles.sortView]}>
                                <Text style={[styles.sortText, {}]}>
                                    {selectedIndustryName?.length > 0
                                        ? selectedIndustryName?.length > 1
                                            ? selectedIndustryName[0] === 'Alle'
                                                ? 'Alle ausgewählt'.slice(0, 8) + '...'
                                                : selectedIndustryName[0].length > 12
                                                    ? selectedIndustryName[0].slice(0, 10) + '...' + ` +${selectedIndustryName?.length - 1}`
                                                    : selectedIndustryName[0] + ` +${selectedIndustryName?.length - 1}`
                                            : selectedIndustryName[0].length > 12
                                                ? selectedIndustryName[0].slice(0, 10) + '...'
                                                : selectedIndustryName[0]
                                        : 'Branche'}
                                </Text>


                                <Image source={Images.downArrow} style={styles.sortDownImage} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {loading ?
                        <FlatList
                            data={[1, 1, 1]}
                            renderItem={SkeletonLoader}
                            showsVerticalScrollIndicator={false}
                        />
                        :
                        <FlatList
                            data={flatData}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                        />
                    }
                </ImageBackground>
                {loader && <Loader />}
            </ScrollView>
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
                        <TouchableOpacity onPress={() => {
                            refIndustrySheet.current.close();
                        }}>
                            <Image source={Images.modalClose} style={styles.closeImg} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.main}>
                        <FlatList
                            data={industryData}
                            renderItem={renderItemIndustry}
                            keyExtractor={index => index.toString()} />
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
                            bgColor={color.BTNCOLOR}
                            _text={{ fontFamily: fontFamily.poppinsBold, fontWeight: 'bold' }}
                            size={'lg'}
                            onPress={() => { CloseIndustryMenu(selectedIndustries) }}
                            style={{ marginTop: 15, }}
                            borderRadius={10}
                        >{'Auswahl speichern'}</Button>
                    </View>
                </View>
            </RBSheet>
            {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}


            {ModalAppointment({ visibleAppointment: visibleAppointments, setVisibleAppointment: setVisibleAppointments, appointmentData: companyJobs })}

        </SafeAreaView>

    );
};

export default Companies;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    whiteBox: {
        paddingHorizontal: 5,
        marginHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: color.WHITE,
        borderRadius: 10,
    },
    fieldView: {
        marginTop: -20
    },
    dropdown: {
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: color.WHITE,
    },
    iconStyle: {
        height: 30,
        width: 30,
        tintColor: color.BLACK
    },
    renderRightStyle: {
        height: 20, width: 20
    },
    sortDownImage: {
        marginLeft: 5,
        height: 15,
        width: 15
    },
    infoMainView: {
        justifyContent: 'space-between',
        marginTop: 15,
        flexDirection: 'row',
        paddingHorizontal: 25,
        alignItems: 'center'
    },
    dropPlace: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily: fontFamily.poppinsLight,
        fontSize: 13,
        fontWeight: '200'
    },
    jobsNumberText: {
        color: color.BDRCLR,
        fontFamily: fontFamily.poppinsSeBold,
        fontWeight: '400',
        marginBottom: 10,
        fontSize: 15
    },
    sortView: {
        flexDirection: 'row',
        // backgroundColor: color.WHITE,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 10,
        alignItems: 'center',
        // width: '50%'
    },
    sortTouch: {
        backgroundColor: color.WHITE,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 10,
        // width: '20%'
    },
    sortText: {
        color: color.BLACK,
        fontFamily: fontFamily.poppinsLight,
        fontWeight: '200',
        fontSize: 12
    },
    filterImage: {
        height: 60,
        width: 60
    },
    renderMainView: {
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
        backgroundColor: color.WHITE,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        // height: 140,
        flex: 1,
        flexDirection: 'row'
    },
    locImage: {
        marginTop: 5,
        height: 15,
        width: 15
    },
    locView: {
        flexDirection: 'row',
        marginTop: 5
    },
    mainFlexView: {
        width: '85%'
    },
    mainFlexView1: {
        width: '10%'
    },
    headingImage: {
        height: 70,
        width: 70,
        alignSelf: 'center',
        marginTop: 6,
        borderRadius: 100 / 2
    },
    editCalTaskImage: {
        height: 20,
        width: 20,
    },
    nameTxt: {
        color: color.BDRCLR,
        fontFamily: fontFamily.poppinsBold,
        // fontSize: 13
    },
    locTxt: {
        marginTop: 5,
        marginLeft: 5,
        color: color.BLACK,
        fontFamily: fontFamily.poppinsLight,
        fontWeight: '100',
        fontSize: 12
    },
    renderMainLoader: {
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: color.WHITE,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: 140,
        flexDirection: 'row'
    },
    main: {
        // marginHorizontal: 20
        width: '93%',
        height: '75%',
        alignSelf: 'center'
    },
    renderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    flexView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginHorizontal: 20,
        marginVertical: 20,
        width: '95%',
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
        tintColor: color.BDRCLR,
        width: 30,
        alignSelf: 'flex-end'
    },
    indicatorView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 35,
        height: '100%'
    },
});
