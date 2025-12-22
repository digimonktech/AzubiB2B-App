import React, {useState, useLayoutEffect, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Images} from '@/assets/images/images';
import {fontFamily, reCol} from '@/utils/configuration';
import {Divider} from 'native-base';
import {ModalApply, ModalIndustry, ModalJobPic} from '@/component/Modal';
import BackHeader from '@/component/BackHeader';
import {getApiCall} from '@/utils/ApiHandler';
import Globals from '@/utils/Globals';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {RenderHTML} from 'react-native-render-html';
import {ModalLocation} from '@/component/ModalLocation';
import {useCity} from '@/Context/CityProvider';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import WebView from 'react-native-webview';
import Share from 'react-native-share';
const width = Dimensions.get('window').width;

const DetailsJobs = ({navigation, route}) => {
  const [visibleApply, setVisibleApply] = useState(false);
  const [visibleIndustry, setVisibleIndustry] = useState(false);
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [visibleImage, setVisibleImage] = useState(false);
  const [detailImage, setDetailImage] = useState('');
  const [loading, setLoading] = useState(false);
  const {allData} = route.params;
  // console.log('allData...', allData, 'allData...');
  const {item} = route.params;
  // console.log('ITEM...', item, '...ITEM');
  const [jobDetails, setJobDetails] = useState([]);
  const [jobListing, setJobListing] = useState([]);
  const {selectedCityId} = useCity();
  const [playing, setPlaying] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showLoadImage, setShowLoadImage] = useState(true);
  const handleLoad = () => {
    setShowLoadImage(false);
  };
  const [showLoadImage1, setShowLoadImage1] = useState(true);
  const handleLoad1 = () => {
    setShowLoadImage1(false);
  };
  const id = useSelector(state => state.deviceId?.deviceId);
  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      // Alert.alert("video has finished playing!");
    }
  }, []);

  const flatTasks = [
    {
      id: 1,
      txt: 'Support in the planning, implementation and maintenance of IT systems and networks',
    },
    {
      id: 2,
      txt: 'Error analysis and resolution of IT problems in close collaboration with the IT team',
    },
    {
      id: 3,
      txt: 'Installation, configuration and updating of hardware and software components',
    },
    {id: 4, txt: 'Support of servers, databases and cloud infrastructures'},
  ];

  const flatWish = [
    {
      id: 1,
      txt: 'High school diploma, technical college diploma or a good secondary school diploma with a strong interest in IT topics',
    },
    {
      id: 2,
      txt: 'Basic knowledge of operating systems (e.g. Windows, Linux) and network technologies',
    },
    {
      id: 3,
      txt: 'Willingness to learn, ability to work in a team and analytical thinking skills',
    },
    {id: 4, txt: 'Reliability and commitment to training'},
  ];

  const flatOffer = [
    {id: 1, txt: 'An agile environment with modern methods and equipment'},
    {id: 2, txt: 'Exciting and varied customer projects'},
    {
      id: 3,
      txt: 'Open communication and a successful and committed team that looks forward to seeing you',
    },
    {id: 4, txt: 'Personal and appreciative interaction'},
  ];

  useEffect(() => {
    getJobsDetails(item?._id);
  }, []);

  useEffect(() => {
    getRelatedJobs();
  }, [selectedCityId]);

  const getJobsDetails = async id => {
    // console.log('getJobsDetails...', id);
    try {
      setLoading(true);
      let res = await getApiCall({url: 'admin/job/' + id});
      // console.log('getJobsDetails1...', res);
      if (res.status == 200) {
        setJobDetails(res.data);
        // console.log('JobDetails', res.data);
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    const {txt} = item;
    return (
      <View style={styles.bulletView}>
        <Text style={styles.dotText}>.</Text>
        <Text style={styles.flatText}>{txt}</Text>
      </View>
    );
  };

  const renderImage = ({item}) => {
    return (
      <FlatList
        data={[item]}
        renderItem={({item: imageItem}) => (
          <TouchableOpacity
            style={{
              height: 160,
              width: width * 0.43,
              borderRadius: 20,
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              paddingVertical: 5,
              paddingRight: 10,
            }}
            onPress={() => {
              setDetailImage(imageItem?.filepath), setVisibleImage(true);
            }}>
            {/* Access the filepath property for each image */}
            <Image
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 20,
                alignSelf: 'center',
              }}
              resizeMode="cover"
              source={{uri: Globals.BASE_URL + imageItem?.filepath}}
            />
          </TouchableOpacity>
        )}
        keyExtractor={imageItem => imageItem?._id}
        numColumns={2}
      />
    );
  };

  const renderDocs = ({item}) => {
    return (
      <View
        style={{
          width: width,
          flexDirection: 'row',
          paddingVertical: 10,
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{height: 20, width: 20}}
          resizeMode="contain"
          source={require('../../assets/images/Frame.png')}
        />
        <Text
          style={{
            color: '#000',
            fontSize: 14,
            fontFamily: fontFamily.poppinsSeBold,
            left: 5,
          }}
          onPress={() => {
            setDetailImage(item?.document?.filepath), setVisibleImage(true);
          }}>
          {item?.document?.fileName.slice(0, 10)}...
        </Text>
      </View>
    );
  };

  const renderJobs = ({item}) => {
    const {jobTitle} = item;
    const isSaved = savedJobs.includes(item._id);
    return (
      <View>
        <View style={[styles.renderMainView, {width: '93%', flex: 1}]}>
          <TouchableOpacity
            style={{width: '80%', paddingHorizontal: 10, paddingVertical: 10}}
            activeOpacity={0.5}
            onPress={() => {
              getJobsDetails(item._id);
            }}>
            <Text style={styles.nameTxt} numberOfLines={2}>
              {jobTitle}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                width: '85%',
              }}>
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
                  style={{height: '100%', width: '100%', borderRadius: 50}}
                  resizeMode="cover"
                  source={{uri: Globals.BASE_URL + item.companyLogo}}
                />
              </View>
              <Text
                style={[
                  styles.nameTxt,
                  {color: reCol().color.BTNCOLOR, left: 10},
                ]}
                numberOfLines={2}>
                {item.company}
              </Text>
            </View>
            <View style={styles.locView}>
              <Image
                source={Images.location}
                style={styles.locImage}
                resizeMode="contain"
              />
              <Text style={styles.locTxt}>{item?.city?.join(', ')}</Text>
            </View>
            <View style={styles.locView}>
              <View
                style={{
                  backgroundColor: reCol().color.EMLCLR,
                  borderRadius: 2,
                  height: 20,
                  paddingHorizontal: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 10,
                    fontFamily: fontFamily.poppinsRegular,
                  }}>
                  {item?.jobType}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: reCol().color.HRTCLR,
                  borderRadius: 2,
                  height: 20,
                  width: '25%',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  left: 5,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 10,
                    fontFamily: fontFamily.poppinsRegular,
                  }}>
                  {item?.industryName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{width: '100%'}}>
            <TouchableOpacity
              style={{
                height: '50%',
                width: '20%',
                backgroundColor: reCol().color.EMLCLR,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.5}
              onPress={() => {
                getJobsDetails(item._id);
                setVisibleApply(true);
              }}>
              <Image
                style={{height: 20, width: 24}}
                resizeMode="contain"
                source={require('../../assets/images/sms-tracking.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: '50%',
                width: '20%',
                backgroundColor: reCol().color.HRTCLR,
                borderBottomRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => saveJob(item)}>
              <Image
                style={{height: 20, width: 24}}
                resizeMode="contain"
                source={
                  isSaved
                    ? require('../../assets/images/heartFill.png')
                    : require('../../assets/images/heartEmpty.png')
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader title={'Zurück'} press={() => setVisibleLocation(true)} />
      ),
    });
  }, [navigation]);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    // Add leading zero if day or month is a single digit
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const renderSeketon = () => {
    return (
      <View>
        <View style={styles.jobDetailBox}>
          <View style={styles.loderFlexView}>
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
                renderItem={({item}) => (
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
                renderItem={({item}) => (
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

          <View style={[styles.locView, {paddingVertical: 20}]}>
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
          <View style={{height: 40}} />
        </View>
      </View>
    );
  };
  const shareEmail = async email => {
    const link = `https://www.azubiregional.de/jobs-board/${item._id}`;
    const shareOptions = {
      social: Share.Social.EMAIL,
      email: email,
      subject: 'Bewerbung auf AzubiRegional.de',
      message: item.isDesktopView
        ? `Sehr geehrte/r Herr/Frau ,
            
            über AzubiRegional.de bin ich auf Ihre Stellenanzeige aufmerksam geworden:
            ${link}
            
            Hiermit bewerbe ich mich auf die von Ihnen ausgeschriebene Stelle in Ihrem Unternehmen. Nachfolgend übersende ich Ihnen im Anhang meine Bewerbungsunterlagen. 
            
            Über eine positive Rückmeldung würde ich mich freuen.
            
            Für Rückfragen bin ich gerne für Sie erreichbar.
            
            Mit freundlichen Grüßen,`
        : `Sehr geehrte/r Herr/Frau ,
            
            über AzubiRegional.de bin ich auf Ihre Stellenanzeige aufmerksam geworden:
            
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

  const openGmail = gid => {
    const emailid = gid;
    if (emailid) {
      const url = `mailto:${emailid}`;
      Linking.openURL(url).catch(err =>
        console.error('Error opening email', err),
      );
    }
  };

  const renderJobsDetails = ({item, index}) => {
    console.log('renderJobsDetails', item);
    const originalDateString = item.createdAt;
    const formattedDate = formatDate(originalDateString);
    const cleanHtmlContent = html => {
      return html?.replace(/<p><br><\/p>/g, '');
    };
    const cleanedData = cleanHtmlContent(item?.jobDescription);
    // const extractVideoId = url => {
    //   const videoIdMatch = url.match(
    //     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    //   );

    //   return videoIdMatch ? videoIdMatch[1] : null;
    // };
    // const videoIds = temp?.map(extractVideoId);

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
      <View>
        <View style={styles.jobDetailBox}>
          <View style={styles.mainFlexView}>
            <Text
              style={[
                styles.nameTxt,
                {color: reCol().color.BDRCLR},
              ]}>{`Kontakt`}</Text>
            <Text
              style={[
                styles.locTxt,
                {fontSize: 12, fontFamily: fontFamily.poppinsRegular},
              ]}>
              {item?.industryName?.industryName}
            </Text>
            <View style={styles.locView}>
              <Image
                source={Images.location}
                style={[styles.locImage, {tintColor: reCol().color.BTNCOLOR}]}
              />
              <Text style={styles.locTxt}>
                {item?.city?.map(city => city.name).join(', ')}
              </Text>
            </View>
            <View style={styles.locView}>
              <Image source={Images.callingIcn} style={styles.locImage} />
              <TouchableOpacity>
                <Text style={styles.locTxt}>
                  {item?.phoneNumber}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.locView}>
              <Image source={Images.smsIcn} style={styles.locImage} />
              <TouchableOpacity
                onPress={() => openGmail(item?.companyId?.email)}>
                <Text style={styles.locTxt}>{item?.companyId?.email}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.locView}>
              <Image source={Images.smsIcn} style={styles.locImage} />
              <TouchableOpacity
                onPress={() => openGmail(item?.additionalEmail)}>
                <Text style={styles.locTxt}>{item?.additionalEmail}</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.locView}>
                            <Image source={Images.globalIcn} style={styles.locImage} />
                            <TouchableOpacity>
                                <Text style={styles.locTxt}>{item?.company?.website}</Text>
                            </TouchableOpacity>
                        </View> */}
            {item?.additionalData?.length > 0 &&
              item?.additionalData?.map(itemMap => {
                return (
                  <View style={styles.locView}>
                    <Image
                      source={{
                        uri: Globals.BASE_URL + itemMap?.image?.filepath,
                      }}
                      style={styles.locImage}
                    />
                    <TouchableOpacity>
                      <Text style={styles.locTxt}>{itemMap?.text}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
          <View style={styles.mainFlexView1}>
            {showLoadImage1 && (
              <View style={styles.indicatorView}>
                <ActivityIndicator size="small" color="gray" />
              </View>
            )}
            <Image
              source={{
                uri: Globals.BASE_URL + item?.companyId?.profileIcon,
              }}
              style={styles.headingImage}
              onLoad={handleLoad1}
              resizeMode="contain"
            />
          </View>
        </View>
        {item?.mapUrl && (
          <TouchableOpacity
            style={[
              styles.jobDetailBox,
              {
                flexDirection: 'row',
                height: 50,
                paddingVertical: 0,
                paddingHorizontal: 0,
                marginVertical: 0,
              },
            ]}
            onPress={() => {
              Linking.openURL(item.mapUrl);
            }}>
            <Text
              style={[
                styles.nameTxt,
                {
                  alignSelf: 'center',
                  paddingLeft: 15,
                  color: reCol().color.BDRCLR,
                },
              ]}>
              Standort / Route anzeigen
            </Text>
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
              activeOpacity={0.5}>
              <Image
                style={{height: 20, width: 24}}
                resizeMode="contain"
                source={require('../../assets/images/shiftArrow.png')}
              />
            </View>
          </TouchableOpacity>
        )}
        {item?.locationUrl && (
          <TouchableOpacity
            style={[
              styles.jobDetailBox,
              {
                flexDirection: 'row',
                height: 50,
                paddingVertical: 0,
                paddingHorizontal: 0,
                marginVertical: 10,
              },
            ]}
            onPress={() => {
              Linking.openURL(item?.locationUrl);
            }}>
            <Text
              style={[
                styles.nameTxt,
                {
                  alignSelf: 'center',
                  paddingLeft: 15,
                  color: reCol().color.BDRCLR,
                },
              ]}>
              {item?.locationField || 'Erfahre mehr über uns'}
            </Text>
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
              activeOpacity={0.5}>
              <Image
                style={{height: 20, width: 24}}
                resizeMode="contain"
                source={require('../../assets/images/shiftArrow.png')}
              />
            </View>
          </TouchableOpacity>
        )}
        {item?.embeddedCode !== '' ? (
          <View style={[styles.jobDetailBox, styles.jobDetailBox1]}>
            <WebView
              scalesPageToFit={true}
              bounces={false}
              onLoad={syntheticEvent => {
                const {nativeEvent} = syntheticEvent;
                setLoading(nativeEvent.loading);
              }}
              javaScriptEnabled
              style={{height: 60}}
              source={{
                html: `
                        <!DOCTYPE html>
                        <html>
                          <body>
                            <div id="baseDiv">${item?.embeddedCode}</div> 
                          </body>
                        </html>
                  `,
              }}
              automaticallyAdjustContentInsets={false}
            />
          </View>
        ) : null}
        <View style={[styles.jobDetailBox, styles.jobDetailBox1]}>
          <Text style={[styles.titleText, {color: reCol().color.BDRCLR}]}>
            {'Jobbeschreibung'}
          </Text>
          {/* <Text style={styles.aboutComText}>{item.jobDescription}</Text> */}
          <RenderHTML
            tagsStyles={{
              p: {
                marginVertical: 3, // Removes the vertical margin
                color: '#646464',
              },
            }}
            enableExperimentalMarginCollapsing={true}
            source={{html: cleanedData}}
          />
          {/* <Text style={styles.titleText}>{'Über das Unternehmen'}</Text> */}
          {/* <Text style={styles.aboutComText}>{item?.company?.companyDescription}</Text> */}
          {/* <RenderHTML
                        tagsStyles={{
                            p: {
                                marginVertical: 3, // Removes the vertical margin
                                color: '#646464'
                            }
                        }}
                        source={{ html: item?.company?.companyDescription }}
                    /> */}
          <Text style={[styles.titleText, {color: reCol().color.BDRCLR}]}>
            {'Berufsbezeichnung'}
          </Text>
          <Text style={styles.aboutComText}>{item?.jobTitle}</Text>
          {/* <Text style={styles.titleText}>{'Ihre Aufgaben'}</Text>
                    <FlatList
                        data={flatTasks}
                        renderItem={renderItem}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                    <Text style={styles.titleText}>{'Wir wünschen}</Text>
                    <FlatList
                        data={flatWish}
                        renderItem={renderItem}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    /> */}
          {item?.jobImages?.length > 0 && (
            <>
              <Text style={[styles.titleText, {color: reCol().color.BDRCLR}]}>
                {'Bilder-/Videogalerie'}
              </Text>
              {/* <FlatList
                data={item?.jobImages}
                renderItem={renderImage}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
              /> */}
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
                resizeMode="cover"
                source={{uri: Globals.BASE_URL + item.jobImages}}
              />
            </>
          )}
          {item?.videoLink != '' && (
            <YoutubePlayer
              height={230}
              play={playing}
              //   playList={videoIds}
              // playList={['QRt7LjqJ45k', 'fHsa9DqmId8']}
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

          {/* <Text style={styles.titleText}>{'Wir bieten'}</Text>
                    <FlatList
                        data={flatOffer}
                        renderItem={renderItem}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    /> */}
          <Text style={[styles.titleText, {color: reCol().color.BDRCLR}]}>
            {'Adresse'}
          </Text>
          <Text style={styles.aboutComText}>
            {item.address} {item.zipCode}
          </Text>
          <Image source={Images.dividerLine} style={styles.lineDivider} />

          {/* <FlatList
                        data={item?.attachments}
                        renderItem={renderDocs}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                    /> */}

          {/* <Image source={Images.dividerLine} style={styles.lineDivider} /> */}

          <View style={[styles.locView, {paddingVertical: 20}]}>
            <Text
              style={[
                styles.titleText,
                {paddingTop: 0, fontWeight: '400', color: reCol().color.BDRCLR},
              ]}>
              {'ID'}:
            </Text>
            <Text
              style={[
                styles.aboutComText,
                {
                  paddingTop: 2,
                  fontWeight: '400',
                  paddingLeft: 2,
                  fontSize: 12,
                },
              ]}>
              {item?._id?.slice(0, 8)}...
            </Text>
            <Divider
              orientation="vertical"
              alignSelf={'center'}
              marginLeft={'10%'}
            />
            <Text
              style={[
                styles.titleText,
                {
                  paddingTop: 0,
                  fontWeight: '400',
                  paddingLeft: '10%',
                  color: reCol().color.BDRCLR,
                },
              ]}>
              {'Datum'}:
            </Text>
            <Text
              style={[
                styles.aboutComText,
                {
                  paddingTop: 2,
                  fontWeight: '400',
                  paddingLeft: 5,
                  fontSize: 12,
                },
              ]}>
              {originalDateString ? formattedDate : ''}
            </Text>
          </View>
          <Image source={Images.dividerLine} style={styles.lineDivider} />

          <TouchableOpacity
            style={{
              width: '100%',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              backgroundColor: reCol().color.BTNCOLOR,
              borderRadius: 10,
              top: 15,
            }}
            activeOpacity={0.5}
            onPress={() => {
              setVisibleApply(true);
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSeBold,
                fontSize: 16,
                color: '#fff',
              }}>
              {'Jetzt bewerben'}
            </Text>
          </TouchableOpacity>
          <View style={{height: 40}} />
        </View>
      </View>
    );
  };
  useEffect(() => {
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
  }, []);
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

  const getRelatedJobs = async () => {
    try {
      setLoading(true);
      let res = await getApiCall({
        url:
          'employer/get-jobs-by-id?companyId=' +
          item?.companyId +
          '&skip=0&slectedCity=' +
          selectedCityId,
      });
      if (res.status == 200) {
        setJobListing(res?.data);
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };
  const isSaved = savedJobs.includes(item._id);
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.container} source={Images.bgImage}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!loading && (
            <TouchableHighlight underlayColor={'none'}>
              <View style={[styles.renderMainView, {width: '93%', flex: 1}]}>
                <View
                  style={{
                    width: '80%',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={[styles.nameTxt, {color: reCol().color.BDRCLR}]}
                    numberOfLines={2}>
                    {item?.jobTitle}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                      width: '85%',
                    }}>
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
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 10,
                        }}
                        resizeMode="cover"
                        source={{
                          uri: allData
                            ? 'https://api.kundenzugang-recruiting.app/' + allData.companyId?.profileIcon
                            : 'https://api.kundenzugang-recruiting.app/' + item?.companyId?.profileIcon,
                        }}
                        onLoad={handleLoad}
                      />
                    </View>
                    <Text
                      style={[
                        styles.nameTxt,
                        {color: reCol().color.BTNCOLOR, left: 10},
                      ]}>
                      {allData
                        ? allData.companyId?.companyname
                        : item?.companyId?.companyname}
                    </Text>
                  </View>
                  <View style={styles.locView}>
                    <Image
                      source={Images.location}
                      style={styles.locImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.locTxt}>
                      {item?.city?.map(city => city.name).join(', ')}
                    </Text>
                  </View>
                  <View style={styles.locView}>
                    <View
                      style={{
                        backgroundColor:  '#4bad0aff',
                        // reCol().color.EMLCLR
                        borderRadius: 2,
                        height: 20,
                        paddingHorizontal: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 10,
                          fontFamily: fontFamily.poppinsRegular,
                        }}>
                        {item?.jobType?.jobTypeName}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: '#1991edff',
                        // reCol().color.HRTCLR
                        borderRadius: 2,
                        height: 20,
                        width: '25%',
                        paddingHorizontal: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        left: 5,
                      }}>
                      {/* {item?.industryName?.industryName.length > 9 ? <Text style={{ color: '#fff', fontSize: 10, fontFamily: fontFamily.poppinsRegular }}>{item?.industryName?.industryName.slice(0, 9) + '...'}</Text> :
                                                <Text style={{ color: '#fff', fontSize: 10, fontFamily: fontFamily.poppinsRegular }}>{item?.industryName?.industryName}</Text>} */}
                      {item?.industryName?.industryName?.length > 9 ? (
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 11,
                            fontFamily: fontFamily.poppinsRegular,
                          }}>
                          {item?.industryName?.industryName?.slice(0, 9) +
                            '...'}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 11,
                            fontFamily: fontFamily.poppinsRegular,
                          }}>
                          {item?.industryName?.industryName}
                        </Text>
                      )}
                    </View>
                    {/* <Text style={styles.mwdTxt}>(m/w/d)</Text> */}
                  </View>
                </View>
                <View style={{width: '100%'}}>
                  <TouchableOpacity
                    style={{
                      height: '50%',
                      width: '20%',
                      backgroundColor: reCol().color.EMLCLR,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.5}
                    onPress={() => {
                      setVisibleApply(true);
                    }}>
                    <Image
                      style={{height: 20, width: 24}}
                      resizeMode="contain"
                      source={require('../../assets/images/sms-tracking.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      height: '50%',
                      width: '20%',
                      backgroundColor: reCol().color.HRTCLR,
                      borderBottomRightRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      saveJob(item);
                    }}>
                    <Image
                      style={{height: 20, width: 24}}
                      resizeMode="contain"
                      source={
                        isSaved
                          ? require('../../assets/images/heartFill.png')
                          : require('../../assets/images/heartEmpty.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableHighlight>
          )}
          {loading ? (
            <FlatList
              data={[1]}
              renderItem={renderSeketon}
              showsVerticalScrollIndicator={false}
              keyExtractor={index => index.toString()}
            />
          ) : (
            <FlatList
              data={[jobDetails]}
              renderItem={renderJobsDetails}
              showsVerticalScrollIndicator={false}
              keyExtractor={index => index.toString()}
            />
          )}
          {/* {jobListing?.length > 0 &&
                        <Text style={{ marginTop: 30, fontSize: 14, fontFamily: fontFamily.poppinsSeBold, color: '#2894A2', left: 20 }}>{'Aktuelle Jobs'}</Text>
                    } */}
          {/* <FlatList data={jobListing} renderItem={renderJobs} showsVerticalScrollIndicator={false} /> */}
        </ScrollView>
      </ImageBackground>
      {ModalApply({
        visibleApply,
        setVisibleApply,
        applyData: jobDetails,
        deviceId: id,
      })}
      {ModalIndustry({visibleIndustry, setVisibleIndustry})}
      {ModalLocation({visibleLocation, setVisibleLocation, navigation})}
      {ModalJobPic({
        visibleJobImage: visibleImage,
        setVisibleJobImage: setVisibleImage,
        imageData: detailImage,
      })}
    </SafeAreaView>
  );
};

export default DetailsJobs;

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
    flexDirection: 'row-reverse',
    elevation: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  jobDetailBox1: {
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginVertical: 5,
    elevation: 5,
  },
  locView: {
    flexDirection: 'row',
    marginTop: 5,
  },
  mainFlexView: {
    width: '72%',
  },
  loderFlexView: {
    width: '100%',
  },
  nameTxt: {
    color: reCol().color.BDRCLR,
    fontFamily: fontFamily.poppinsBold,
    fontSize: 16,
  },
  titleText: {
    color: reCol().color.BDRCLR,
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  locTxt: {
    marginTop: 5,
    marginLeft: 5,
    color: '#646464',
    fontFamily: fontFamily.poppinsLight,
    fontSize: 12,
  },
  locImage: {
    marginTop: 5,
    height: 15,
    width: 15,
  },
  mainFlexView1: {
    width: '15%',
    elevation: 10,
    right: 15,
    // left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingImage: {
    height: 90,
    width: 90,
    alignSelf: 'center',
    borderRadius: 20,
  },
  aboutComText: {
    color: '#646464',
    paddingTop: 5,
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 13,
  },
  flatText: {
    color: '#646464',
    paddingTop: 5,
    paddingLeft: 5,
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 13,
  },
  bulletView: {
    flexDirection: 'row',
  },
  dotText: {
    color: reCol().color.BLACK,
    paddingTop: 2,
    paddingLeft: 5,
    fontFamily: fontFamily.poppinsThin,
    fontSize: 13,
  },
  lineDivider: {
    marginTop: 8,
    height: 1.2,
    width: '95%',
  },
  naviImg: {height: 25, width: 25},
  btnTxt: {},
  renderMainView: {
    marginVertical: 10,
    // paddingHorizontal: 10,
    // paddingVertical: 10,
    // marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: reCol().color.WHITE,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // height: 140,
    flexDirection: 'row',
  },
  indicatorView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  mwdTxt: {
    color: reCol().color.BLACK,
    fontFamily: fontFamily.poppinsLight,
    fontSize: 12,
    paddingHorizontal: 10,
  },
});
