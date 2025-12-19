import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ImageBackground, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { Images } from '@/assets/images/images';
import { fontFamily, reCol } from '@/utils/configuration';
import Loader from '@/component/Loader';
import MainHeader from '@/component/MainHeader';
import { ModalAppointment } from '@/component/Modal';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getApiCall } from '@/utils/ApiHandler';
import Globals from '@/utils/Globals';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from "native-base";
import { ModalLocation } from '@/component/ModalLocation';
import { useCity } from '@/Context/CityProvider';
import { useDispatch, useSelector } from 'react-redux';
import { useCompany } from '@/Context/CompanyId';
import { addJobsFromCompany, removeJobsByCompanyId } from '@/redux/reducers/companiesJobList';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { addCompany, clearCompanyList, removeCompany } from '@/redux/reducers/ShowCompaniesList';

const { height: Screen_Height } = Dimensions.get('window')

const { height, width } = Dimensions.get('screen');

const Companies = (props) => {
    const [loading, setLoading] = useState(false);
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [scrollTop, setScrollTop] = useState(false);
    const refIndustrySheet = React.useRef();
    const [industryData, setIndustryData] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [loader, setLoader] = useState(false);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [visibleAppointments, setVisibleAppointments] = useState(false);
    const scrollViewRef = useRef(null);
    const [allCompanies, setAllCompanies] = useState([])






    // const companyList = useSelector(state => state.companiesList.list);
    const showCompaniesList = useSelector(state => state.showcompaniesList.list)
    const CompaniesJobs = useSelector(state => state.companiesJobList.list)
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        console.log('fromRQ => ', route.params);

    }, [route.params?.fromOR])

    // console.log('Start Screen Route => ', route.params);


    // console.log('redux showCompaniesList ', showCompaniesList);
    // console.log('redux CompaniesJobs ', CompaniesJobs);




    //  ------ all func for all companies ------

    // 1 fetch all companies
    const fetchAllCompanies = async () => {
        try {
            const response = await axios.get(
                'https://azubi.api.digimonk.net/api/v1/admin/companies'
            );

            const data = response?.data?.data?.companies

            setAllCompanies(data?.companies)

            console.log('All Companies  => ', data);

        } catch (error) {
            console.log('Error fetch all companies => ', error.message);
        }
    };
    useEffect(() => {
        fetchAllCompanies();
    }, []);


    // 2 filter companies by search
    const findComapnyInAllCompanies = (val) => {
        const input = val?.trim()?.toLowerCase();

        if (!input) return; // 🛑 IMPORTANT

        const filtered = allCompanies.filter(item =>
            item?.companyname?.trim()?.toLowerCase() === input
        );

        if (filtered.length > 0) {
            dispatch(addCompany(filtered));
        }
    };
    useEffect(() => {
        if (!searchValue) return;
        findComapnyInAllCompanies(searchValue);
    }, [searchValue]);



    // 3 filter companies by route companyId
    const findComapnyByCompanyID = (id) => {
        console.log('Call find company by companyId => ', id);
        console.log('allCompanies => ', allCompanies);


        const filtered = allCompanies.filter((com) => com._id === id)
        console.log('filtred company by comapnyId => ', filtered);

        dispatch(addCompany(filtered))


    }
    useEffect(() => {
        if (route.params?.companyId && allCompanies.length > 0) {
            findComapnyByCompanyID(route.params.companyId);
            return; // 🛑 STOP search logic
        }
    }, [route.params?.companyId, allCompanies]);

    // 4 filter companies by route companyId
    const findComapnyByFromQR = (id) => {
        console.log('Call find company by fromQR => ', id);
        // console.log('allCompanies => ', allCompanies);


        const filtered = allCompanies.filter((com) => com._id === id)
        console.log('filtred company by comapnyId => ', filtered);

        dispatch(addCompany(filtered))


    }
    useEffect(() => {
        if (route.params?.fromQR && allCompanies.length > 0) {
            findComapnyByFromQR(route.params.companyId);
            return; // 🛑 STOP search logic
        }
    }, [route.params?.fromQR, allCompanies]);



    // all func for companies jobs

    // 1 get companies jobs by route -> params -> companyId
    const getCompaniesJobByComapnyId = async () => {
        if (!route?.params?.companyId) return;

        try {
            let res = await getApiCall({
                url: `admin/jobs?companyId=${route.params.companyId}`,
            });

            console.log('✅ Companies job by route:', res.data);

            if (res.status === 200) {
                dispatch(addJobsFromCompany(res.data))
            }

        } catch (e) {
            console.log('❌ Get company jobs Error ', e);
        }
    };
    useEffect(() => {
        getCompaniesJobByComapnyId();
    }, [route.params?.companyId,])


    // 2 get companies jobs by search 
    const getCompaniesJobBySearch = async (val) => {
        const input = val?.trim()?.toLowerCase();

        if (!input) return;
        if (allCompanies.length === 0) return;

        const filtered = allCompanies.filter(item =>
            item?.companyname?.trim()?.toLowerCase() === input
        );

        if (filtered.length === 0) {
            console.log('No company found for:', input);
            return;
        }

        const companyId = filtered[0]._id;

        try {
            let res = await getApiCall({
                url: `admin/jobs?companyId=${companyId}`,
            });

            if (res.status === 200) {
                dispatch(addJobsFromCompany(res.data))
            }

            // console.log('✅ Companies Jobs API Response:', res);
        } catch (e) {
            console.log('❌ Get company jobs Error ', e);
        }
    };
    useEffect(() => {
        getCompaniesJobBySearch(searchValue);
    }, [searchValue])


    const onClearSearch = () => {
        setSearchValue('');

    };



    useEffect(() => {
        if (scrollTop && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
            setScrollTop(false); // Reset the scrollTop state
        }
    }, [scrollTop]);




    // const getAllCompanies = async () => {
    //     // let repeatIndustryParams
    //     // let repeatCityParams
    //     // if (selectedCityId && selectedCityId.length > 0) {
    //     //     repeatCityParams = selectedCityId.map(cityId => `slectedCity=${cityId}`).join('&');
    //     // }
    //     // if (selectedIndustries && selectedIndustries.length > 0) {
    //     //     repeatIndustryParams = selectedIndustries.map(industryId => `isFillter=${industryId}`).join('&');
    //     // }
    //     try {
    //         setLoading(true);
    //         // let res = await getApiCall({ url: 'employer/get-all-emp-frontend?' + repeatIndustryParams + '&searchValue=' + searchValue + '&' + repeatCityParams });
    //         let res = await getApiCall({ url: `admin/company/id/${companyId}` });
    //         // console.log('untern getAllComapay ', res);

    //         if (res.status == 200) {
    //             // console.log('ResponseCompany', res.data)
    //             setFlatData([res.data]);
    //         }
    //     } catch (e) {
    //         // alert(e);
    //         console.log('Get ALl Companies Error ', e);

    //     } finally {
    //         // setIsRefresh(false);
    //         setLoading(false);
    //         // getAllIndustry();
    //     }
    // };

    const removeComapnyfromList = (item) => {
        console.log('removeComapnyfromList item ', item._id);
        dispatch(removeCompany(item._id))

        // remove all jobs related company
        dispatch(removeJobsByCompanyId(item._id))

    }

    const RenderImageComponent = ({ item, navigation }) => {
        // console.log('companyItem ', item);

        const { companyname, profileIcon } = item;
        const [showLoadImage, setShowLoadImage] = useState(true);
        const [showMenu, setShowMenu] = useState(false);

        const toggleMenu = () => setShowMenu(!showMenu);

        const handleMenuSelect = (type) => {
            setShowMenu(false);
            if (type === "gallery") {
                navigation.navigate('CompanyGallery', { item });
            } else if (type === "terms") {
                navigation.navigate('CompanyTrems');
            } else if (type === "privacy") {
                navigation.navigate('CompanyPrivacy', {item});
            } else if (type === "JobWall") {
                navigation.navigate('CompanyJobWall', { item });
            } else if (type === 'kontakt') {
                navigation.navigate('CompanyKontakt', { item })
            }
        };

        return (
            <View
                style={{
                    height: 150,
                    width: '90%',
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 12,
                    padding: 8,
                    elevation: 3,
                    position: 'relative', // 🆕 required for zIndex children
                    zIndex: 1, // 🆕 lift above below cards
                }}
            >
                {/* Company Image */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        height: 130,
                        width: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        style={{ height: '100%', width: '100%', borderRadius: 10 }}
                        resizeMode="cover"
                        onLoadEnd={() => setShowLoadImage(false)}
                        source={
                            profileIcon === ''
                                ? require('../../assets/images/gallery.png')
                                : { uri: Globals.BASE_URL + profileIcon }
                        }
                    />
                </View>

                {/* Company Info */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('DetailsCompany', { item })}
                    style={{ flex: 1, paddingHorizontal: 10 }}
                >
                    <Text
                        style={{
                            color: reCol().color.BDRCLR,
                            fontFamily: fontFamily.poppinsSemiBold,
                            fontSize: 16,
                            fontWeight: 'bold',
                        }}
                        numberOfLines={2}
                    >
                        {item?.companyname ?? '--'}
                    </Text>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View
                    style={{
                        height: '100%',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        alignItems: 'center',
                    }}
                >

                    {/* Email */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ alignItems: 'center' }}
                        onPress={() => getCompaniesDetails(item._id)}
                    >
                        <Image
                            style={{ height: 22, width: 22 }}
                            resizeMode="contain"
                            source={require('../../assets/images/sms-tracking.png')}
                        />
                        <Text style={{ fontSize: 10, color: '#646464' }}>E-Mail</Text>
                    </TouchableOpacity>

                    {/* More Button */}
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity activeOpacity={0.7} onPress={toggleMenu}>
                            <Image
                                style={{ height: 22, width: 22 }}
                                resizeMode="contain"
                                source={require('../../assets/images/mk.png')}
                            />
                            <Text style={{ fontSize: 10, color: '#646464' }}>More</Text>
                        </TouchableOpacity>

                        {/* Dropdown menu */}
                        {showMenu && (
                            <View
                                style={{
                                    position: 'absolute',
                                    right: 35,
                                    top: -25,
                                    backgroundColor: '#fff',
                                    elevation: 5,
                                    borderRadius: 6,
                                    padding: 6,
                                    width: 100,
                                    zIndex: 10,
                                    zIndex: 999, // 🆕 ensure dropdown stays on top
                                }}
                            >
                                {[
                                    { label: 'JobWall', key: 'JobWall' },
                                    { label: 'Privacy Policy', key: 'privacy' },
                                    { label: 'Kontakt', key: 'kontakt' },
                                ].map((m, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => handleMenuSelect(m.key)}
                                        style={{
                                            paddingVertical: 6,
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, color: '#222', fontWeight: '400' }} numberOfLines={1}>{m.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Delete */}
                    <TouchableOpacity activeOpacity={0.7} style={{ alignItems: 'center' }} onPress={() => removeComapnyfromList(item)}>
                        <Image
                            style={{ height: 22, width: 22 }}
                            resizeMode="contain"
                            source={require('../../assets/images/deleteAccount.png')}
                        />
                        <Text style={{ fontSize: 10, color: '#646464' }}>Delete</Text>
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
            header: () => <MainHeader title={'Start'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);

    // function OpenIndustryMenu() {
    //     refIndustrySheet.current.open();
    // }


    // const CloseIndustryMenu = (selectedIndustries) => {
    //     // Handle the selected industries as needed
    //     // console.log('Selected Industries:', selectedIndustries);
    //     setIndustryType(selectedIndustries)
    //     // Additional logic, e.g., close the bottom sheet
    //     refIndustrySheet.current.close();
    // };

    // const getAllIndustry = async () => {
    //     try {
    //         let res = await getApiCall({ url: 'industries/get_all_Industry?searchValue=&pageNo=1&recordPerPage=100' });
    //         if (res.status == 200) {
    //             const newArr = [{ _id: '', industryName: "Alle" }, ...res?.data.data]
    //             setIndustryData(newArr);
    //         }
    //     } catch (e) {
    //         alert(e);
    //     } finally {
    //         setLoading(false);
    //     }
    // };



    const getCompaniesDetails = async (id) => {
        try {
            setLoader(true);
            // let res = await getApiCall({ url: 'employer/company-detail/' + id });
            let res = await getApiCall({ url: `admin/company/id/${id}` });

            console.log('getCompaniesDetails res => ', res);

            if (res.status == 200) {
                setCompanyJobs(res.data);

            }
        } catch (e) {
            // alert(e);
            console.log('getCompaniesDetails Error => ', e);

        } finally {
            setLoader(false)
            setVisibleAppointments(true)
        }
    };



    // const handleIndustryCheckboxChange = (item, isChecked) => {
    //     if (item?._id === '') {
    //         // Check or uncheck all other items based on the special item's state
    //         const allIndustryIds = industryData.map((item) => item._id);
    //         const allIndustryName = industryData.map((item) => item.industryName);
    //         setSelectedIndustries(isChecked ? allIndustryIds : []);
    //         setSelectedIndustryName(isChecked ? allIndustryName : []);
    //     }
    //     else {
    //         setSelectedIndustries((pre) => {
    //             if (isChecked) {
    //                 return [...pre, item._id]
    //             } else {
    //                 return pre.filter((id) => id !== item._id)
    //             }
    //         })
    //         setSelectedIndustryName((pre) => {
    //             if (isChecked) {
    //                 return [...pre, item.industryName]
    //             } else {
    //                 return pre.filter((id) => id != item.industryName);
    //             }
    //         })
    //     }
    // };
    // const resetFilter = () => {
    //     setSelectedIndustries([]);
    //     setSelectedIndustryName([]);
    // }
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


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <SafeAreaView style={styles.container}>


            <ScrollView
                ref={scrollViewRef}
                style={styles.container}
                showsVerticalScrollIndicator={false}
                scrollsToTop={scrollTop}
            >
                <ImageBackground style={styles.container} source={Images.bgImage}>
                    <View style={[styles.whiteBox, { marginTop: 15 }]}>
                        <View style={styles.fieldView}>

                            {/* Search Container */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 4,
                                    paddingVertical: 5,
                                    backgroundColor: '#FFFFFF',
                                }}
                            >
                                <Image
                                    source={Images.search}
                                    style={{ width: 20, height: 20, tintColor: '#8E8E8E', marginRight: 5 }}
                                    resizeMode="contain"
                                />

                                <TextInput
                                    placeholder="Berufsbezeichnung, Stichwörter oder Unternehmen"
                                    value={searchValue}
                                    onChangeText={setSearchValue}
                                    style={{ flex: 1, fontSize: 12, color: '#333', paddingVertical: 0 }}
                                    placeholderTextColor="#9E9E9E"
                                />

                                <TouchableOpacity style={{ paddingVertical: 4, paddingHorizontal: 8 }} onPress={onClearSearch}>
                                    <Image
                                        source={Images.modalClose}
                                        style={{ width: 20, height: 20, tintColor: '#8E8E8E', marginRight: 5 }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>




                        </View>
                    </View>

                    <View style={styles.infoMainView}>
                        <Text style={styles.jobsNumberText}>{showCompaniesList?.length} {'Unternehmen gefunden'}</Text>
                    </View>
                    {loading ?
                        <FlatList
                            data={[1, 1, 1]}
                            renderItem={SkeletonLoader}
                            showsVerticalScrollIndicator={false}
                        />
                        :
                        <FlatList
                            data={showCompaniesList}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 500 }} >
                                <Text style={{
                                    fontSize: 18,
                                    color: '#1f1b1bff',
                                    fontWeight: 'bold',
                                }}>No Unternehmen found</Text>
                            </View>}
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
                            bgColor={reCol().color.BTNCOLOR}
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
        height: Screen_Height,
    },
    whiteBox: {
        paddingHorizontal: 5,
        marginHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: reCol().color.WHITE,
        borderRadius: 10,
    },
    fieldView: {
        // marginTop: -20
    },
    dropdown: {
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: reCol().color.WHITE,
    },
    iconStyle: {
        height: 30,
        width: 30,
        tintColor: reCol().color.BLACK
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
        color: reCol().color.BDRCLR,
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
        backgroundColor: reCol().color.WHITE,
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
        color: reCol().color.BLACK,
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
        backgroundColor: reCol().color.WHITE,
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
        color: reCol().color.BDRCLR,
        fontFamily: fontFamily.poppinsBold,
        // fontSize: 13
    },
    locTxt: {
        marginTop: 5,
        marginLeft: 5,
        color: reCol().color.BLACK,
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
        backgroundColor: reCol().color.WHITE,
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
        color: reCol().color.BDRCLR,
        fontFamily: fontFamily.poppinsBold,
        fontSize: 20,
        fontWeight: 'bold'
    },
    closeImg: {
        height: 30,
        tintColor: reCol().color.BDRCLR,
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
