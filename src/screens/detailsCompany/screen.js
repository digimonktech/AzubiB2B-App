import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Linking,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Images } from '@/assets/images/images';
import { fontFamily, reCol } from '@/utils/configuration';
import {
  ModalApply,
  ModalAppointment,
  ModalIndustry,
  ModalJobPic,
} from '@/component/Modal';
import BackHeader from '@/component/BackHeader';
import { getApiCall } from '@/utils/ApiHandler';
import Globals from '@/utils/Globals';
import RenderHTML from 'react-native-render-html';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useCity } from '@/Context/CityProvider';
import { ModalLocation } from '@/component/ModalLocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/component/Loader';
import YoutubePlayer from 'react-native-youtube-iframe';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';


const COMPANY_DESCRIPTION = 'company is a leading logistics and supply chain management organization dedicated to delivering safe, reliable, and cost-efficient cargo solutions. With years of industry experience, we specialize in transporting goods across multiple sectors including manufacturing, retail, construction, and consumer services. Our mission is to build strong connections between businesses and their customers by ensuring timely movement of goods with complete transparency.'


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

const SOCIAL_ICONS = [
  {
    icon: require('../../assets/images/instagram.png'),
    label: 'Instagram'
  },

  {
    icon: require('../../assets/images/faceBook.png'),
    label: 'FaceBook'
  },

  {
    icon: require('../../assets/images/X.png'),
    label: 'X'
  }
]

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
  const [companyJobList, setCompanyJobList] = useState([])
  const handleLoad = () => {
    setShowLoadImage(false);
  };

  // console.log('company jobs list => ', companyJobList);


  const fetchCompanyJobsList = async () => {
    try {
      setLoading(true);

      let res = await getApiCall({
        url: `admin/jobs?companyId=${item?._id}`,
      });
      // console.log('Company Jobs res ', res);

      if (res.status === 200) {
        setCompanyJobList(res.data)
      }

    } catch (e) {
      console.log('Get company Error ', e);

    }
  };

  useEffect(() => {
    fetchCompanyJobsList()
  }, [])


  // const comId = useSelector(state => state.companyId?.companyId);
  const getCompaniesIcons = async () => {
    try {
      setLoading(true);
      let res = await getApiCall({ url: 'manage_content/job-wall' });
      // console.log('company details ', res);

      if (res.status == 200) {
        setLocIcon(res.data.locationIcon.filepath);
        setContIcon(res.data.contactPersonIcon.filepath);
        setIndIcon(res.data.industryIcon.filepath);
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };
  const id = useSelector(state => state.deviceId?.deviceId);
  const onStateChange = useCallback(state => {
    if (state === 'ended') {
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
    }, []),
  );

  const saveJob = async savedItem => {
    try {
      const existingData = await AsyncStorage.getItem('jobSaved');
      const isIdPresent = JSON.parse(existingData)?.some(
        item => item._id === savedItem._id,
      );
      // console.log('Is ID present:', isIdPresent);
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
        // console.log('dataResponseResult', dataResponse);
        dataArray.push(savedItem);
        await AsyncStorage.setItem('jobSaved', JSON.stringify(dataArray));
        setSavedJobs([...savedJobs, savedItem._id]);
      }
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  };



  const renderJobCard = ({ item }) => {
    const isSaved = savedJobs.includes(item._id);

    // Extract Safe Values
    const jobTypeText = item?.jobType?.jobTypeName || '--';
    const cityText = Array.isArray(item?.city)
      ? item.city.map(c => c?.name).join(', ')
      : item?.city?.name || '--';

    const industryText = item?.industryName?.industryName || '--';
    const companyNameText = item?.companyId?.companyname || '--';

    return (
      <TouchableOpacity activeOpacity={0.8}>
        <View style={[styles.renderMainView]}>
          <TouchableOpacity
            style={{ width: '75%', paddingHorizontal: 10, paddingVertical: 10 }}
            onPress={() => navigation.navigate('DetailsJobs', { item })}
            activeOpacity={0.6}
          >
            {/* Job Title */}
            <Text style={styles.nameTxt} numberOfLines={2}>
              {item?.jobTitle || '--'}
            </Text>

            {/* Company Logo + Name */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  height: 25,
                  width: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{ height: '100%', width: '100%' }}
                  resizeMode="center"
                  source={{
                    uri: Globals.BASE_URL.concat(item?.companyId?.profileIcon || ''),
                  }}
                />
              </View>

              <Text
                style={[styles.nameTxt, { color: reCol().color.BTNCOLOR, marginLeft: 10 }]}
                numberOfLines={1}>
                {companyNameText}
              </Text>
            </View>

            {/* City */}
            <View style={styles.locView}>
              <Image source={Images.location} style={styles.locImage} resizeMode="contain" />
              <Text style={styles.locTxt}>{cityText}</Text>
            </View>

            {/* Job Type + Industry */}
            <View style={[styles.locView, { marginTop: 5 }]}>
              <View
                style={{
                  backgroundColor: '#336405ff',
                  borderRadius: 3,
                  height: 20,
                  paddingHorizontal: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 11, fontFamily: fontFamily.poppinsRegular }}>
                  {jobTypeText}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#322ff5ff',
                  borderRadius: 3,
                  height: 20,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 6,
                }}>
                <Text style={{ color: '#fff', fontSize: 11, fontFamily: fontFamily.poppinsRegular }}>
                  {industryText}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Buttons Column */}
          <View style={{ width: '25%' }}>

            {/* Message Button */}
            <TouchableOpacity
              style={{
                height: '50%',
                width: '100%',
                backgroundColor: '#97daf5ff',
                borderTopRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => getJobsDetails(item._id)}
            >
              <Image style={{ height: 20, width: 24 }} resizeMode="contain"
                source={require('../../assets/images/sms-tracking.png')}
              />
            </TouchableOpacity>

            {/* Like Button */}
            <TouchableOpacity
              style={{
                height: '50%',
                width: '100%',
                // backgroundColor: reCol().color.HRTCLR,
                backgroundColor: '#6ad9efff',
                borderBottomRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => saveJob(item)}
            >
              <Image style={{ height: 20, width: 24 }} resizeMode="contain"
                source={
                  isSaved
                    ? require('../../assets/images/heartFill.png')
                    : require('../../assets/images/heartEmpty.png')
                }
              />
            </TouchableOpacity>

          </View>
        </View>
      </TouchableOpacity>
    );
  };


  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader title={'Zurück'} press={() => setVisibleLocation(true)} />
      ),
    });
  }, [navigation]);

  React.useEffect(() => {
    getCompaniesDetails();
    getCompaniesIcons();
  }, []);

  useEffect(() => {
    getCompaniesJobs();
  }, [selectedCityId]);

  const getCompaniesDetails = async () => {
    try {
      setLoading(true);
      let res = await getApiCall({ url: `admin/company/id/${item._id}` });
      // console.log('getCompaniesDetails res ', res);

      if (res.status == 200) {
        setFlatData([res.data]);
      }
    } catch (e) {
      // alert(e);
      console.log('getCompaniesDetails error ', e);

    } finally {
      setLoading(false);
    }
  };

  const renderImages = ({ item }) => {
    // console.log('renderImages ', item);
    const imageUrl = Globals.BASE_URL + item?.file
    console.log('imageUrl ', imageUrl);
    return (
      <TouchableOpacity
        style={[styles.locView, { marginTop: 10, marginRight: 10 }]}
        onPress={() => {
          setDetailImage(item), setVisibleImage(true);
        }}>
        <Image
          source={{ uri: Globals.BASE_URL + item.file }}
          style={styles.camPic}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  const renderSeketon = () => {
    return (
      <View>
        <View style={styles.jobDetailBox}>
          <View style={{ width: '100%' }}>
            <SkeletonPlaceholder style={styles.mainFlexView}>
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center">
                  <SkeletonPlaceholder.Item
                    width={80}
                    height={80}
                    borderRadius={40}
                    marginRight={20}
                  />
                  <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                      width={120}
                      height={20}
                      borderRadius={4}
                      marginBottom={6}
                    />
                    <SkeletonPlaceholder.Item
                      width={100}
                      height={14}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
          <View style={styles.mainFlexView1}>
            <SkeletonPlaceholder.Item
              width={100}
              height={100}
              borderRadius={50}
            />
          </View>
        </View>

        <View style={[styles.jobDetailBox, styles.jobDetailBox1]}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item marginBottom={10}>
              <SkeletonPlaceholder.Item
                width={150}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={250}
                height={16}
                borderRadius={4}
                marginTop={6}
              />
            </SkeletonPlaceholder.Item>

            {/* Repeat the above structure for other sections */}

            <SkeletonPlaceholder.Item marginTop={20}>
              <SkeletonPlaceholder.Item
                width={200}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={300}
                height={16}
                borderRadius={4}
                marginTop={6}
              />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item marginTop={20}>
              {/* Customize this for your FlatList items */}
              <FlatList
                data={[1, 2, 3, 4]}
                keyExtractor={item => item.toString()}
                renderItem={({ item }) => (
                  <SkeletonPlaceholder.Item
                    flexDirection="row"
                    alignItems="center"
                    marginBottom={10}>
                    <SkeletonPlaceholder.Item
                      width={40}
                      height={40}
                      borderRadius={20}
                      marginRight={10}
                    />
                    <SkeletonPlaceholder.Item
                      flex={1}
                      height={40}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                )}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>

          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item marginBottom={10}>
              <SkeletonPlaceholder.Item
                width={150}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={250}
                height={16}
                borderRadius={4}
                marginTop={6}
              />
            </SkeletonPlaceholder.Item>

            {/* Repeat the above structure for other sections */}

            <SkeletonPlaceholder.Item marginTop={20}>
              <SkeletonPlaceholder.Item
                width={200}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={300}
                height={16}
                borderRadius={4}
                marginTop={6}
              />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item marginTop={20}>
              {/* Customize this for your FlatList items */}
              <FlatList
                data={[1, 1, 1, 1]}
                keyExtractor={item => item.toString()}
                renderItem={({ item }) => (
                  <SkeletonPlaceholder.Item
                    flexDirection="row"
                    alignItems="center"
                    marginBottom={10}>
                    <SkeletonPlaceholder.Item
                      width={40}
                      height={40}
                      borderRadius={20}
                      marginRight={10}
                    />
                    <SkeletonPlaceholder.Item
                      flex={1}
                      height={40}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                )}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>

          <View style={[styles.locView, { paddingVertical: 20 }]}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item
                  width={40}
                  height={20}
                  borderRadius={4}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={80}
                  height={20}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  width={20}
                  height={20}
                  borderRadius={4}
                  marginLeft={10}
                />
                <SkeletonPlaceholder.Item
                  width={80}
                  height={20}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>

          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={'100%'}
              height={50}
              borderRadius={10}
              marginTop={15}
            />
          </SkeletonPlaceholder>
          <View style={{ height: 40 }} />
        </View>
      </View>
    );
  };
  const shareEmail = async email => {
    const link = `https://www.azubiregional.de/unternehmen/${item._id}`;
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
      title: item?.companyName,
    };
    try {
      const shareResponse = await Share.shareSingle(shareOptions);
      // console.log('Shared successfully:', shareResponse);
    } catch (error) {
      console.error('Sharing failed:', error);
      alert(error);
    }
  };

  const renderCompanyDetails = ({ item }) => {
    // console.log('renderCompanyDetails', item);
    const cleanHtmlContent = html => {
      return html?.replace(/<p><br><\/p>/g, '');
    };
    const cleanedData = cleanHtmlContent(item?.companyDescription);
    // const extractVideoId = url => {
    //   const videoIdMatch = url.match(
    //     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    //   );

    //   return videoIdMatch ? videoIdMatch[1] : null;
    // };
    // const videoIds = item?.videoLink?.map(extractVideoId);

    const extractVideoId = url => {
      const regex = /(?:v=|\/(?!.*\/)([a-zA-Z0-9_-]{11}))(?!.*\?.*\bindex\b)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const videoUrl = item.videoLink
      ? item.videoLink
      : 'https://www.youtube.com/';
    const videoId = extractVideoId(videoUrl);
    return (
      <View style={[styles.jobDetailBox, styles.jobDetailBox1]}>
        <Text style={[styles.titleText, { color: reCol().color.BDRCLR ? reCol().color.BDRCLR : '#0865b7ff' }]}>
          {'E-Mail'}
        </Text>
        <TouchableOpacity>
          <Text style={styles.aboutComText}>{item?.email ?? '--'}</Text>
        </TouchableOpacity>
        <Text style={[styles.titleText, { color: reCol().color.BDRCLR ? reCol().color.BDRCLR : '#0865b7ff' }]}>{'Webseite'}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item?.websiteLink)}>
          {/* <Text style={[styles.aboutComText, { color: '#222' }]}>{item?.websiteLink ?? '--'}</Text> */}
          <Text style={[styles.aboutComText, { color: '#222' }]}>{'https://www.britannica.com/topic/German-language'}</Text>

        </TouchableOpacity>
        <Text style={[styles.titleText, { color: reCol().color.BDRCLR ? reCol().color.BDRCLR : '#0865b7ff' }]}>
          {'Telefonnummer'}
        </Text>
        <TouchableOpacity>
          {/* <Text style={styles.aboutComText}>{item?.phoneNumber ?? '--'}</Text> */}
          <Text style={styles.aboutComText}>6232762406</Text>
        </TouchableOpacity>
        {/* <RenderHTML
          style={styles.aboutComText}
          enableExperimentalMarginCollapsing={true}
          source={{ html: cleanedData }}
        /> */}


        <Text style={[styles.titleText, { color: reCol().color.BDRCLR ? reCol().color.BDRCLR : '#0865b7ff' }]}>
          {'Discription'}
        </Text>

        <Text style={styles.aboutComText}>
          {item?.companyname ?? 'some'} {COMPANY_DESCRIPTION}
        </Text>





        {/* <FlatList
          data={item?.companyImages}
          // companyImages
          renderItem={renderImages}
          keyExtractor={index => index.toString()}
          numColumns={2}
        /> */}

        {item?.videoLink != '' && (
          <YoutubePlayer
            height={230}
            play={playing}
            // playList={videoIds}
            videoId={videoId}
            onChangeState={onStateChange}
            webViewStyle={{
              borderRadius: 20,
              borderCurve: 'circular',
              top: 30,
              elevation: 10,
            }}
          />
        )}

        {/* social links */}
        <Text style={[styles.titleText, { color: reCol().color.BDRCLR ? reCol().color.BDRCLR : '#0865b7ff' }]}>
          {'Social links'}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
            paddingHorizontal: 10,
          }}
        >
          {SOCIAL_ICONS.map((social) => (
            <TouchableOpacity
              key={social.label}
              activeOpacity={0.7}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              <Image
                source={social.icon}
                style={{
                  width: 45,
                  height: 45,
                  marginBottom: 6,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#000',
                  textAlign: 'center',
                }}
              >
                {social.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>


        {/* gallery */}
        <Text style={[styles.titleText, { color: reCol().color.BDRCLR ? reCol().color.BDRCLR : '#0865b7ff' }]}>
          {'Gallery'}
        </Text>

        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          keyExtractor={(item) => item.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                marginVertical: 8,
              }}
            >
              <Image
                source={require('../../assets/images/gallery.png')}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  resizeMode: 'cover',
                }}
              />
            </View>
          )}
          contentContainerStyle={{
            paddingVertical: 10,
            gap: 8,
          }}
        />


        <TouchableOpacity
          style={{
            width: '100%',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            // backgroundColor: reCol().color.BTNCOLOR,
            backgroundColor: '#fc8636ff',
            borderRadius: 10,
            top: 15,
            flexDirection: 'row',
          }}
          activeOpacity={0.5}
          onPress={() => {
            setVisibleAppointments(true);
          }}>
          <Image
            source={require('../../assets/images/sms-tracking.png')}
            style={{ height: 20, width: 20 }}
            resizeMode="contain"
            tintColor={'#fff'}
          />
          <Text
            style={{
              fontFamily: fontFamily.poppinsSeBold,
              fontSize: 16,
              color: '#fff',
              left: 5,
            }}>
            {'Direktbewerbung absenden'}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </View>
    );
  };

  const getCompaniesJobs = async () => {
    try {
      setLoading(true);
      let res = await getApiCall({
        url:
          'employer/get-jobs-by-id?companyId=' +
          item?._id +
          '&skip=0&slectedCity=' +
          selectedCityId,
      });
      if (res.status == 200) {
        // console.log('Companies Jobs', res.data);
        setCompanyJobs(res.data);
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const getJobsDetails = async id => {
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

  const companyProfileUrl = Globals.BASE_URL + item.profileIcon
  console.log('companyProfile ', item);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.container} source={Images.bgImage}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Company Header */}
          <View style={styles.jobDetailBox}>
            <View style={styles.mainFlexView}>
              <Text style={[styles.nameTxt, { color: reCol().color.BDRCLR }]}>
                {item?.companyname ?? '--'}
              </Text>

              {/* Location */}
              <View style={styles.locView}>
                <Image
                  source={require('../../assets/images/locationDetail.png')}
                  style={styles.locImage}
                />
                <Text style={styles.locTxt}>{item?.city?.name ?? '--'}</Text>
              </View>

              {/* Contact Person */}
              <View style={styles.locView}>
                <Image
                  source={require('../../assets/images/contactDetail.png')}
                  style={styles.locImage}
                />
                <Text style={styles.locTxt}>{item?.contactPerson ?? '--'}</Text>
              </View>

              {/* Industry */}
              <View style={styles.locView}>
                <Image
                  source={require('../../assets/images/serachDetail.png')}
                  style={styles.locImage}
                />
                <Text style={styles.locTxt}>
                  {item?.industryName?.industryName ?? '--'}
                </Text>
              </View>
            </View>

            {/* Company Image */}
            <View style={styles.mainFlexView1}>
              <Image
                source={
                  item.profileIcon
                    ? { uri: Globals.BASE_URL + item.profileIcon }
                    : require('../../assets/images/gallery.png')
                }
                style={styles.headingImage}
                resizeMode="contain"
                onLoad={handleLoad}
              />
            </View>
          </View>

          {/* Map URL */}
          {item?.mapUrl && (
            <TouchableOpacity
              style={[styles.jobDetailBox, styles.routeBtn]}
              onPress={() => Linking.openURL(item.mapUrl)}
            >
              <Text style={[styles.nameTxt, styles.routeText]}>
                Standort / Route anzeigen
              </Text>
              <View style={styles.routeIconBox}>
                <Image
                  style={styles.routeIcon}
                  resizeMode="contain"
                  source={require('../../assets/images/shiftArrow.png')}
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Website URL */}
          {item?.locationUrl && (
            <TouchableOpacity
              style={[styles.jobDetailBox, styles.routeBtn]}
              onPress={() => Linking.openURL(item.locationUrl)}
            >
              <Text style={[styles.nameTxt, styles.routeText]}>
                Erfahre mehr über uns
              </Text>
              <View style={styles.routeIconBox}>
                <Image
                  style={styles.routeIcon}
                  resizeMode="contain"
                  source={require('../../assets/images/shiftArrow.png')}
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Company Details */}
          {loading ? (
            <FlatList
              data={[1]}
              renderItem={renderSeketon}
              keyExtractor={(index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={flatData}
              renderItem={renderCompanyDetails}
              keyExtractor={(index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          )}


          {/* jobs */}
          <View style={{ height: 200, }}>

            <Text style={[styles.titleText, { marginHorizontal: 15 }]}>
              Jobs {companyJobList.length}
            </Text>

            <FlatList
              data={companyJobList || []}
              renderItem={renderJobCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 15 }}
            />

          </View>

        </ScrollView>
      </ImageBackground>

      {/* Modals */}
      {loader && <Loader />}

      {ModalAppointment({
        visibleAppointment: visibleAppointments,
        setVisibleAppointment: setVisibleAppointments,
        appointmentData: flatData,
      })}

      {ModalLocation({
        visibleLocation,
        setVisibleLocation,
        navigation,
      })}

      {ModalApply({
        visibleApply,
        setVisibleApply,
        applyData: jobDetails,
        deviceId: id,
      })}

      {ModalJobPic({
        visibleJobImage: visibleImage,
        setVisibleJobImage: setVisibleImage,
        imageData: detailImage,
      })}
    </SafeAreaView>
  );

};

export default DetailsCompany;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
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
    // color: reCol().color.BLACK,
    color: 'black',
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
    borderRadius: 20,
  },
  aboutComText: {
    color: '#222',
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
    borderRadius: 20,
  },
  renderMainView: {
    marginVertical: 10,
    borderRadius: 10,
    width: SCREEN_WIDTH * 0.7,        // 👈 70% of screen width → scroll works properly
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    alignSelf: 'flex-start',   // 👈 Very important for horizontal scroll
    justifyContent: 'space-between',
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: reCol().color.WHITE,
    marginRight: 12,           // 👈 Space between cards
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
    flexDirection: 'row',
  },
  indicatorView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

// import { Dimensions } from 'react-native';

// const { width } = Dimensions.get('window');

// const DetailsCompany = () => {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

//       <FlatList
//         data={[1, 2, 3, 4, 5]}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={{
//             width: width * 0.8,
//             height: 200,
//             backgroundColor: 'red',
//             marginRight: 10,
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}>
//             <Text style={{ fontSize: 20, color: '#fff' }}>{item}</Text>
//           </View>
//         )}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//       />

//     </SafeAreaView>
//   )
// }

// export default DetailsCompany;
