import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  Dimensions,
  TextInput,
} from 'react-native';
import { Images } from '@/assets/images/images';
import { fontFamily, reCol } from '@/utils/configuration';
import Loader from '@/component/Loader';
import MainHeader from '@/component/MainHeader';
import { ModalApply } from '@/component/Modal';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getApiCall } from '@/utils/ApiHandler';
import Globals from '@/utils/Globals';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from 'native-base';
import { ModalLocation } from '@/component/ModalLocation';
import { useCity } from '@/Context/CityProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useCompany } from '@/Context/CompanyId';
import { addJobsFromCompany, removeJob } from '@/redux/reducers/companiesJobList';
import { addCompany } from '@/redux/reducers/companiesList';


const { height, width } = Dimensions.get('screen');


const Jobs = props => {
  const route = useRoute();
  const { navigation } = props;
  const id = useSelector(state => state.deviceId?.deviceId);
  const comId = useSelector(state => state.companyId?.companyId);
  const scrollViewRef = useRef(null);
  const [flatData, setFlatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);
  const [visibleApply, setVisibleApply] = useState(false);
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const refRBSheet = React.useRef();
  const [jobType, setJobType] = useState('Alle anzeigen');
  const [isRefresh, setIsRefresh] = useState(false);
  const [jobTypeId, setJobTypeId] = useState('');
  const [jobTypeData, setJobTypeData] = useState([]);
  const refIndustrySheet = React.useRef();
  const [IndustryType, setIndustryType] = useState([]);
  const [industryData, setIndustryData] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedIndustryName, setSelectedIndustryName] = useState([]);
  const { selectedCityId, showCity } = useCity();
  const [jobDetails, setJobDetails] = useState([]);
  const [showIndustry, setShowIndustry] = useState(false);
  const [loader, setLoader] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [QRCode, setQRCode] = useState(null);
  const [newComId, setNewComId] = useState();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { updateCompanyId } = useCompany();
  const dispatch = useDispatch()

  const jobList = useSelector(state => state.companiesJobList.list);


  // console.log('filteredJobs ', filteredJobs);

  // console.log('Company ID => ', route.params?.companyId);




  useEffect(() => {
    setFilteredJobs(jobList)
  }, [jobList])



  const onRefresh = () => {
    setIsRefresh(true);
  };
  useEffect(() => {
    getAllJobs();
  }, [!searchValue, jobTypeId, IndustryType, selectedCityId, isRefresh]);

  useEffect(() => {
    getJobDetailsSearchApi();
  }, [searchValue, route.params?.companyId]);

  const onClearSearch = () => {
    setSearchValue('');
    setFilteredJobs(jobList)
  };

  const filterJobList = (word) => {
    if (!word?.trim()) {
      setFilteredJobs(jobList)
      // return []; // return empty list if no search text
    }

    const lower = word.toLowerCase();

    const filteredList = jobList.filter((job) =>
      job?.jobTitle?.toLowerCase().includes(lower)
    );

    setFilteredJobs(filteredList)

    // console.log('filteredList:', filteredList);
    // return filteredList;
  };



  useEffect(() => {
    filterJobList(searchValue)
  }, [searchValue])

  // const getQRCode = async () => {
  //   try {
  //     // const res = await getApiCall({
  //     //   url: `https://azubi.api.digimonk.net/api/v1/company/id/'69203c9bd1fbb34dc2a5e825`
  //     // })

  //     const res = await axios.get('https://azubi.api.digimonk.net/api/v1/admin/company/id/69203c9bd1fbb34dc2a5e825')

  //     // console.log('QR code res ', res.data.data?.qrCode);
  //     setQRCode(res.data.data?.qrCode);

  //   } catch (error) {
  //     console.log('QR code error ', error);
  //   }
  // }

  useEffect(() => {
    if (route?.params?.companyId) {
      updateCompanyId(route.params.companyId);
    }
  }, [route]);

  const getJobDetailsSearchApi = async () => {
    try {
      if (searchValue.length >= 3 || searchValue.length == 0) {
        setLoading(true);
        let res = await getApiCall({
          url: `admin/jobs?companyId=${route?.params?.companyId}` + '&searchValue=' + searchValue,
        });

        // let res = await getApiCall({
        //   url: `admin/jobs?companyId=${newComId || '692c5420c0e8b3044c256b1f'}&searchValue=${searchValue}`,
        // });


        console.log('flatData search res:', res);

        if (res.status == 200) {
          setFlatData(res.data);
          dispatch(addJobsFromCompany(res.data))
        }
      }
    } catch (e) {
      // alert(e);
      console.log('err ', e);

    } finally {
      setLoading(false);
      // setFlatData([])
    }
  };

  const getCompany = async () => {
    // let repeatIndustryParams
    // let repeatCityParams
    // if (selectedCityId && selectedCityId.length > 0) {
    //     repeatCityParams = selectedCityId.map(cityId => `slectedCity=${cityId}`).join('&');
    // }
    // if (selectedIndustries && selectedIndustries.length > 0) {
    //     repeatIndustryParams = selectedIndustries.map(industryId => `isFillter=${industryId}`).join('&');
    // }
    try {
      setLoading(true);
      // let res = await getApiCall({ url: 'employer/get-all-emp-frontend?' + repeatIndustryParams + '&searchValue=' + searchValue + '&' + repeatCityParams });
      let res = await getApiCall({ url: `admin/company/id/${route?.params?.companyId}` });
      // console.log('getComapay res ', res);

      if (res.status == 200) {
        // console.log('ResponseCompany', res.data)
        // setFlatData([res.data]);
        dispatch(addCompany([res.data]))

      }
    } catch (e) {
      // alert(e);
      console.log('Get company Error ', e);

    } finally {
      // setIsRefresh(false);
      setLoading(false);
      // getAllIndustry();
    }
  };


  useEffect(() => {
    getCompany();
  }, [route.params?.companyId])

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
    }, []),
  );

  const saveJob = async savedItem => {
    try {
      const existingData = await AsyncStorage.getItem('jobSaved');
      const isIdPresent = JSON.parse(existingData)?.some(
        item => item._id === savedItem._id,
      );
      if (isIdPresent) {
        const updatedData = JSON.parse(existingData).filter(
          item => item._id !== savedItem._id,
        );
        await AsyncStorage.setItem('jobSaved', JSON.stringify(updatedData));
        setSavedJobs(savedJobs.filter(id => id !== savedItem._id));
      } else {
        let dataArray = [];
        if (existingData) {
          dataArray = JSON.parse(existingData);
        }
        dataArray.push(savedItem);
        await AsyncStorage.setItem('jobSaved', JSON.stringify(dataArray));
        setSavedJobs([...savedJobs, savedItem._id]);
      }
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  };
  const getAllJobs = async () => {
    try {
      setLoading(true);

      // Prepare query parameters
      let selectedCityParams =
        selectedCityId && selectedCityId.length > 0
          ? `selectedCities=${encodeURIComponent(
            JSON.stringify(selectedCityId),
          )}`
          : '';
      let industryParams =
        selectedIndustries && selectedIndustries.length > 0
          ? `industry=${encodeURIComponent(JSON.stringify(selectedIndustries))}`
          : '';
      let jobTypeParams = jobTypeId
        ? `jobType=${encodeURIComponent(JSON.stringify([jobTypeId]))}` // Wrap jobType in an array and stringify
        : '';

      // Combine all query parameters
      const queryParams = [selectedCityParams, industryParams, jobTypeParams]
        .filter(Boolean) // Remove empty parameters
        .join('&');

      // Construct the full URL
      const url = `admin/jobs?companyId=${'69203c9bd1fbb34dc2a5e825'}&${queryParams}`;

      // console.log('Final URL:', url);

      // Make the API call
      let res = await getApiCall({ url });

      // console.log('getAllJobs res ', res);


      if (res.status === 200) {
        // console.log('Response:', res.data);
        // setFlatData(res.data);
      }
    } catch (e) {
      console.error('Error:', e);
      // alert(e);
    } finally {
      setIsRefresh(false);
      getAllIndustry();
    }
  };

  const removeJobfromList = (item) => {
    console.log('removejob ', item);
    dispatch(removeJob(item._id))

    

  }

  const RenderImageComponent = ({ item, navigation }) => {
    // console.log('RenderImageComponent item:', item);

    const [showLoadImage, setShowLoadImage] = useState(true);
    const handleLoad = () => {
      setShowLoadImage(false);
    };
    const isSaved = savedJobs.includes(item._id);
    // console.log('ITEM1...', item);
    return (
      <TouchableHighlight underlayColor={'none'}>
        <View style={styles.renderMainView}>
          <TouchableOpacity
            style={{ width: '80%', paddingHorizontal: 10, paddingVertical: 10 }}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('DetailsJobs', { item: item })}>
            <Text
              style={[styles.nameTxt, { color: reCol().color.BDRCLR }]}
              numberOfLines={2}>
              {item?.jobTitle}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                alignItems: 'center',
                width: '85%',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  height: 30,
                  width: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* {showLoadImage && (
                  <View style={styles.indicatorView}>
                    <ActivityIndicator size="small" color="gray" />
                  </View>
                )} */}
                <Image
                  style={{ height: '100%', width: '100%', borderRadius: 10 }}
                  resizeMode="cover"
                  source={{ uri: 'https://api.kundenzugang-recruiting.app/' + item?.companyId.profileIcon }}
                  onLoad={handleLoad}
                />
              </View>
              <Text
                style={[
                  styles.nameTxt,
                  { color: reCol().color.BTNCOLOR, left: 10 },
                ]}
                numberOfLines={2}>
                {item?.companyId.companyname}
              </Text>
            </View>
            {showCity && (
              <View style={[styles.locView, { width: '85%' }]}>
                <Image
                  source={Images.location}
                  style={styles.locImage}
                  resizeMode="contain"
                />
                <Text style={styles.locTxt}>
                  {item.city.map(city => city.name).join(', ')} / {item?.address}
                </Text>
              </View>
            )}
            <View style={styles.locView}>
              <View
                style={{
                  // backgroundColor: reCol().color.EMLCLR,
                  backgroundColor: '#FFA500',
                  borderRadius: 2,
                  height: 20,
                  paddingHorizontal: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 11,
                    fontFamily: fontFamily.poppinsRegular,
                  }}>
                  {item?.jobType?.jobTypeName}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#4479ecff',
                  borderRadius: 2,
                  height: 20,
                  width: '25%',
                  paddingHorizontal: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  left: 5,
                }}>
                {item?.industryName.industryName.length > 9 ? (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 11,
                      fontFamily: fontFamily.poppinsRegular,
                    }}>
                    {item?.industryName.industryName.slice(0, 9) + '...'}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 11,
                      fontFamily: fontFamily.poppinsRegular,
                    }}>
                    {item?.industryName.industryName}
                  </Text>
                )}
              </View>

            </View>
          </TouchableOpacity>

          <View style={{ width: '100%' }}>
            {/* msg */}
            <TouchableOpacity
              style={{
                height: '30%',
                width: '20%',
                backgroundColor: reCol().color.EMLCLR,
                borderTopRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                getJobsDetails(item._id);
              }}>
              <Image
                style={{ height: 20, width: 24 }}
                resizeMode="contain"
                source={require('../../assets/images/sms-tracking.png')}
              />
            </TouchableOpacity>
            {/* like */}
            <TouchableOpacity
              style={{
                height: '30%',
                width: '20%',
                backgroundColor: reCol().color.HRTCLR,
                borderBottomRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => saveJob(item)}>
              <Image
                style={{ height: 20, width: 24 }}
                resizeMode="contain"
                source={
                  isSaved
                    ? require('../../assets/images/heartFill.png')
                    : require('../../assets/images/heartEmpty.png')
                }
              />
            </TouchableOpacity>
            
            {/* delete */}
            <TouchableOpacity
              style={{
                height: '30%',
                width: '20%',
                backgroundColor: reCol().color.HRTCLR,
                borderBottomRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => removeJobfromList(item)}>
              <Image
                style={{ height: 35, width: 26 }}
                resizeMode="contain"
                source={require('../../assets/images/deleteAccount.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  const renderItem = ({ item }) => {
    return <RenderImageComponent item={item} navigation={navigation} />;
  };

  const SkeletonLoader = () => {
    return (
      <View style={styles.renderMainLoader}>
        <SkeletonPlaceholder style={styles.renderMainView}>
          <SkeletonPlaceholder
            style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 10 }}>
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
              <SkeletonPlaceholder.Item
                marginTop={10}
                width="100%"
                height={30}
              />
              <SkeletonPlaceholder.Item
                flexDirection="row"
                justifyContent="space-between"
                marginTop={10}>
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
  useEffect(() => {
    if (scrollTop && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      setScrollTop(false);
    }
  }, [scrollTop]);

  const getJobType = async () => {
    try {
      let res = await getApiCall({
        url: 'admin/job-types',
        params: { companyId: comId },
      });
      if (res.status == 200) {
        const newArr = [
          { _id: '', jobTypeName: 'Alle anzeigen' },
          ...res?.data.jobTypes,
        ];
        setJobTypeData(newArr);
      }
    } catch (e) {
      // alert(e);
      console.log('e ', e);

    } finally {
      setLoading(false);
    }
  };

  function OpenMenu() {
    refRBSheet.current.open();
  }

  function CloseMenu(item) {
    setJobType(item?.jobTypeName);
    setJobTypeId(item?.jobTypeName === 'Alle anzeigen' ? '' : item?._id);
    refRBSheet.current.close();
  }

  function OpenIndustryMenu() {
    refIndustrySheet.current.open();
  }

  const CloseIndustryMenu = selectedIndustries => {
    setIndustryType(selectedIndustries);
    refIndustrySheet.current.close();
  };

  const getAllIndustry = async () => {
    try {
      let res = await getApiCall({
        url: 'admin/industries',
        params: { companyId: comId },
      });

      console.log('getAllIndustry res:', res);

      if (res.status == 200) {
        const newArr = [
          { _id: '', industryName: 'Alle' },
          ...res?.data.industries,
        ];
        setIndustryData(newArr);
        setShowIndustry(res?.data?.industries[0].companyId?.industryStatus);
      }
    } catch (e) {
      // alert(e);
      console.log('e ', e);

    } finally {
      getJobType();
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <MainHeader
          title={'Jobs'}
          press={() => {
            setVisibleLocation(true);
          }}
        />
      ),
    });
  }, [navigation]);

  const getJobsDetails = async id => {
    try {
      setLoader(true);
      let res = await getApiCall({ url: 'admin/job/' + id });
      console.log('message details res' , res);

      if (res.status == 200) {
        setJobDetails(res.data);
      }
    } catch (e) {
      // alert(e);
      console.log('message deteail by id ', e);

    } finally {
      setLoader(false);
      setVisibleApply(true);
    }
  };

  const handleIndustryCheckboxChange = (item, isChecked) => {
    if (item?._id === '') {
      const allIndustryIds = industryData.map(item => item._id);
      const allIndustryName = industryData.map(item => item.industryName);
      setSelectedIndustries(isChecked ? allIndustryIds : []);
      setSelectedIndustryName(isChecked ? allIndustryName : []);
    } else {
      setSelectedIndustries(pre => {
        if (isChecked) {
          return [...pre, item._id];
        } else {
          return pre.filter(id => id !== item._id);
        }
      });
      setSelectedIndustryName(pre => {
        if (isChecked) {
          return [...pre, item.industryName];
        } else {
          return pre.filter(id => id != item.industryName);
        }
      });
    }
  };
  const resetFilter = () => {
    setSelectedIndustries([]);
    setSelectedIndustryName([]);
  };
  const renderItemIndustry = item => {
    const isChecked = selectedIndustries.includes(item.item._id);
    return (
      <TouchableOpacity
        onPress={() => handleIndustryCheckboxChange(item.item, !isChecked)}>
        <View style={styles.renderView}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsMedium,
              fontSize: 16,
              color: 'black',
            }}>
            {item.item.industryName}
          </Text>
          <Image
            source={isChecked ? Images.checkedIcon : Images.unCheckedIcon}
            style={{ height: 20, width: 20 }}
          />
        </View>
      </TouchableOpacity>
    );
  };




  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          scrollsToTop={scrollTop}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
          }>
          <ImageBackground style={styles.container} source={Images.bgImage}>

            {/* search */}
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

            {/* drop-down */}
            <View style={styles.infoMainView}>
              <Text
                style={[styles.jobsNumberText, { color: reCol().color.BDRCLR }]}>
                {jobList?.length} {'Jobs gefunden'}
              </Text>
              <View style={styles.touchView}>
                {showIndustry && (
                  <TouchableOpacity
                    style={[styles.sortTouch, {}]}
                    onPress={() => {
                      OpenIndustryMenu();
                    }}>
                    <View style={styles.sortView}>
                      <Text style={[styles.sortText, {}]}>
                        {selectedIndustryName?.length > 0
                          ? selectedIndustryName?.length > 1
                            ? selectedIndustryName[0] === 'Alle'
                              ? 'Alle ausgewählt'.slice(0, 8) + '...'
                              : selectedIndustryName[0].length > 12
                                ? selectedIndustryName[0].slice(0, 5) + '...'
                                : selectedIndustryName[0] +
                                ` +${selectedIndustryName?.length - 1}`
                            : selectedIndustryName[0].length > 6
                              ? selectedIndustryName[0].slice(0, 3) + '...'
                              : selectedIndustryName[0]
                          : 'Branche'}
                      </Text>

                      <Image
                        source={Images.downArrow}
                        style={styles.sortDownImage}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.sortTouch, { left: 5 }]}
                  onPress={() => {
                    OpenMenu();
                  }}>
                  <View style={styles.sortView}>
                    <Text style={styles.sortText}>
                      {jobType.length == 0
                        ? 'Jobtyp'
                        : jobType.slice(0, 4) + '...'}
                    </Text>
                    <Image
                      source={Images.downArrow}
                      style={styles.sortDownImage}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

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
                data={filteredJobs}
                renderItem={renderItem}
                ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 500 }} >
                  <Text style={{
                    fontSize: 18,
                    color: '#1f1b1bff',
                    fontWeight: 'bold',
                  }}>No Jobs found</Text>
                </View>}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 800 }}
              />
            )}
          </ImageBackground>
          {ModalApply({
            visibleApply,
            setVisibleApply,
            applyData: jobDetails,
            deviceId: id,
          })}

          {ModalLocation({
            visibleLocation: visibleLocation,
            setVisibleLocation: setVisibleLocation,
          })}

          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: 'rgba(0,0,0,.8)',
              },
              draggableIcon: {
                backgroundColor: '#fff',
              },
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                elevation: 20,
                backgroundColor: '#fff',
              },
            }}
            height={500}>
            <View style={styles.flexView}>
              <Text style={styles.headingText}>{'Nach was suchst du'}</Text>
              <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                <Image source={Images.modalClose} style={styles.closeImg} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={jobTypeData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      jobType === item?.jobTypeName ? '#EFEFEF' : '#fff',
                  }}
                  onPress={() => CloseMenu(item)}>
                  <Text
                    style={[
                      styles.jobTypeText,
                      {
                        color:
                          jobType === item.jobTypeName
                            ? reCol().color.BDRCLR
                            : '#000',
                      },
                    ]}>
                    {item.jobTypeName}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={index => index.toString()}
            />
          </RBSheet>

          <RBSheet
            ref={refIndustrySheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: 'rgba(0,0,0,.8)',
              },
              draggableIcon: {
                backgroundColor: '#fff',
              },
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                elevation: 20,
                backgroundColor: '#fff',
              },
            }}
            height={700}>
            <View style={styles.container}>
              <View style={styles.flexView}>
                <Text style={styles.headingText}>{'Branche/n wählen'}</Text>
                <TouchableOpacity
                  onPress={() => refIndustrySheet.current.close()}>
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

              <View style={styles.industryView}>
                {selectedIndustries.length > 0 && (
                  <View style={styles.indusView}>
                    <TouchableOpacity
                      onPress={() => resetFilter()}
                      style={styles.indusTouch}>
                      <Text style={styles.clearFilterText}>
                        {'Filter zurücksetzen'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Button
                  bgColor={reCol().color.BTNCOLOR}
                  _text={{
                    fontFamily: fontFamily.poppinsBold,
                    fontWeight: 'bold',
                  }}
                  size={'lg'}
                  onPress={() => CloseIndustryMenu(selectedIndustries)}
                  style={{ marginTop: 15 }}
                  borderRadius={10}>
                  {'Auswahl speichern'}
                </Button>
              </View>
            </View>
          </RBSheet>
        </ScrollView>
        <TouchableOpacity
          style={styles.upImageTouch}
          onPress={() => setScrollTop(true)}>
          <Image
            source={require('../../assets/images/upArrow.png')}
            style={{ height: '50%', width: '50%' }}
          />
        </TouchableOpacity>
      </SafeAreaView>
      {loader && <Loader />}
    </View>
  );
};

export default Jobs;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    height: height,
  },
  whiteBox: {
    paddingHorizontal: 5,
    marginHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: reCol().color.WHITE,
    borderRadius: 10,
  },
  fieldView: {
    // marginTop: 10,
  },
  sortDownImage: {
    marginLeft: 5,
    height: 15,
    width: 15,
  },
  infoMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  jobsNumberText: {
    color: reCol().color.BDRCLR,
    fontFamily: fontFamily.poppinsSeBold,
    marginBottom: 10,
    fontSize: 15,
  },
  sortView: {
    flexDirection: 'row',
    backgroundColor: reCol().color.WHITE,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    // width: '100%'
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
    flexDirection: 'row',
  },
  locImage: {
    marginTop: 5,
    height: 15,
    width: 15,
  },
  locView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  nameTxt: {
    color: reCol().color.BDRCLR,
    fontFamily: fontFamily.poppinsSeBold,
    fontSize: 14,
    width: '100%',
  },
  locTxt: {
    left: 5,
    color: reCol().color.BLACK,
    fontFamily: fontFamily.poppinsLight,
    fontSize: 10,
    top: 3,
  },
  mwdTxt: {
    color: reCol().color.BLACK,
    fontFamily: fontFamily.poppinsLight,
    fontSize: 10,
    paddingHorizontal: 10,
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
    flexDirection: 'row',
  },
  main: {
    // marginHorizontal: 20
    width: '88%',
    height: '75%',
    alignSelf: 'center',
  },
  renderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginHorizontal: 20,
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
  },
  headingText: {
    color: reCol().color.BDRCLR,
    fontFamily: fontFamily.poppinsBold,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeImg: {
    height: 30,
    width: 30,
    tintColor: reCol().color.BDRCLR,
    alignSelf: 'flex-end',
  },
  indicatorView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 35,
    // backgroundColor: 'red',
    height: '100%',
  },
  touchView: {
    width: '45%',
    flexDirection: 'row-reverse',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  industryTouch: {
    width: '45%',
    flexDirection: 'row-reverse',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  jobTypeText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: fontFamily.poppinsBold,
  },
  industryView: {
    position: 'absolute',
    width: '95%',
    bottom: '5%',
    alignSelf: 'center',
  },
  indusView: {
    width: '100%',
    alignSelf: 'center',
  },
  indusTouch: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '97%',
  },
  clearFilterText: {
    fontFamily: fontFamily.poppinsMedium,
    fontSize: 16,
    color: 'black',
  },
  upImageTouch: {
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
  },
});
