import { FlatList, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { color, fontFamily } from '@/utils/configuration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModalApply } from '@/component/Modal';
import { useSelector } from 'react-redux';
import { getApiCall } from '@/utils/ApiHandler';
import { Images } from '@/assets/images/images';
import Globals from '@/utils/Globals';
import Loader from '@/component/Loader';
import { useFocusEffect } from '@react-navigation/native';

const JobAlertListing = (props) => {
    const { loading, data } = props;
    const [loader, setLoader] = useState(false);
    const [savedJobs, setSavedJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState([]);
    const [visibleApply, setVisibleApply] = useState(false);
    const id = useSelector(
        (state) => state.deviceId?.deviceId
    );
    const saveJob = async (savedItem) => {
        try {
            const existingData = await AsyncStorage.getItem('jobSaved');
            const isIdPresent = JSON.parse(existingData)?.some((item) => item._id === savedItem._id);
            // console.log('Is ID present:', isIdPresent);
            if (isIdPresent) {
                // setSaveLoader(false);
                // alert('This Job has already been saved.');
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
                // setSaveLoader(false);
                await AsyncStorage.setItem('jobSaved', JSON.stringify(dataArray));
                setSavedJobs([...savedJobs, savedItem._id]);
                // navigateToDownload(dataArray);
            }
        } catch (error) {
            // setSaveLoader(false);
            console.error('Error saving data to local storage:', error);
        }
    }
    const getJobsDetails = async (id) => {
        try {
            setLoader(true);
            let res = await getApiCall({ url: 'job/' + id });
            if (res.status == 200) {
                setJobDetails(res.data)
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoader(false);
            setVisibleApply(true);
        }
    };
    const SkeletonLoader = () => {
        return (
            <View style={styles.renderMainLoader}>
                <SkeletonPlaceholder style={styles.renderMainView}>
                    <SkeletonPlaceholder style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 10 }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                                <SkeletonPlaceholder.Item
                                    width={30}
                                    height={30}
                                    borderRadius={15}
                                    marginRight={10}
                                />
                                <SkeletonPlaceholder.Item width="80%" height={20} />
                            </SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item marginTop={10} width="100%" height={30} />
                            <SkeletonPlaceholder.Item
                                flexDirection="row"
                                justifyContent="space-between"
                                marginTop={10}
                            >
                                <SkeletonPlaceholder.Item
                                    width="25%"
                                    height={20}
                                    borderRadius={2}
                                />
                                <SkeletonPlaceholder.Item
                                    width="25%"
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
    const renderItem = ({ item }) => {
        const { jobTitle, city, startDate, companyLogo } = item;
        const isSaved = savedJobs.includes(item._id);
        return (
            <TouchableHighlight underlayColor={'none'}>
                <View style={styles.renderMainView}>



                    <TouchableOpacity style={{ width: '80%', paddingHorizontal: 10, paddingVertical: 10, }} activeOpacity={0.5} onPress={() => navigation.navigate('DetailsJobs', { item: item })}>
                        <Text style={styles.nameTxt} numberOfLines={2}>{item?.jobTitle}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', width: '85%' }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 5, height: 30, width: 30, alignItems: 'center', justifyContent: 'center', }}>
                                <Image style={{ height: '100%', width: '100%', borderRadius: 10 }} resizeMode='cover' source={{ uri: Globals.BASE_URL + item?.companyLogo }} />
                            </View>
                            <Text style={[styles.nameTxt, { color: '#F1841D', left: 10 }]} numberOfLines={2}>{item?.company}</Text>
                        </View>
                        <View style={styles.locView}>
                            <Image source={Images.location} style={styles.locImage} resizeMode='contain' />
                            <Text style={styles.locTxt}>{item?.city.join(', ')}</Text>
                        </View>
                        <View style={styles.locView}>
                            <View style={{ backgroundColor: '#95A000', borderRadius: 2, height: 20, width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 10, fontFamily: fontFamily.poppinsRegular }}>{item?.jobType}</Text>
                            </View>
                            <View style={{ backgroundColor: '#007F9D', borderRadius: 2, height: 20, width: '25%', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', left: 5 }}>
                                <Text style={{ color: '#fff', fontSize: 10, fontFamily: fontFamily.poppinsRegular }}>{item?.industryName}</Text>
                            </View>
                        </View>


                    </TouchableOpacity>


                    <View style={{ width: '100%' }}>
                        <TouchableOpacity style={{ height: '50%', width: '20%', backgroundColor: '#0096A438', borderTopRightRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { getJobsDetails(item._id) }}>
                            <Image style={{ height: 20, width: 24 }} resizeMode='contain' source={require('../../assets/images/sms-tracking.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: '50%', width: '20%', backgroundColor: '#48d1cc', borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => saveJob(item)}>
                            {/* {visibleRed ? <Image style={{ height: 20, width: 24 }} resizeMode='contain' source={require('../../assets/images/heartFill.png')} />
                                : */}
                            <Image style={{ height: 20, width: 24 }} resizeMode='contain' source={isSaved ? require('../../assets/images/heartFill.png') : require('../../assets/images/heartEmpty.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                // Render skeleton loader when loading
                <FlatList
                    data={[1, 1, 1]}
                    renderItem={() => <SkeletonLoader />}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                // Render actual data when not loading
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
            {ModalApply({ visibleApply, setVisibleApply, applyData: jobDetails, deviceId: id })}
            {loader && <Loader />}
        </View>
    )
}

export default JobAlertListing

const styles = StyleSheet.create({
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
        // height: 160,
        flex: 1,
        flexDirection: 'row'
    },
    nameTxt: {
        color: color.BDRCLR,
        fontFamily: fontFamily.poppinsSeBold,
        fontSize: 14,
        width: '100%'
    },
    locView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    locImage: {
        marginTop: 5,
        height: 15,
        width: 15,
    },
    locTxt: {
        left: 5,
        color: color.BLACK,
        fontFamily: fontFamily.poppinsLight,
        fontSize: 10,
        top: 3
    },
})