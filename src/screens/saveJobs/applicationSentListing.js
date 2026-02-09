import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Images } from '@/assets/images/images';
import { fontFamily, reCol } from '@/utils/configuration';
import Globals from '@/utils/Globals';
import { useSelector } from 'react-redux';
import { delApiCall, getApiCall, postApiCall } from '@/utils/ApiHandler';
import Loader from '@/component/Loader';
import { ModalSaveApply } from '@/component/Modal';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const ApplicationSentListing = () => {
  const navigation = useNavigation();
  const [flatData, setFlatData] = useState([]);
  const [visibleApply, setVisibleApply] = useState(false);
  const isFocused = useIsFocused();
  const comId = useSelector(state => state.companyId?.companyId);
  const getAllJobs = async () => {
    try {
      let res = await getApiCall({
        url: 'admin/applications',
      });

      console.log('Bewerbungen list ', res);


      if (res.status == 200) {
        console.log('ResponseDataofapplylistings', res.data);
        setFlatData(res.data);
      }
    } catch (e) {
      alert(e);
    } finally {
    }
  };
  useEffect(() => {
    getAllJobs();
  }, [isFocused]);
  const id = useSelector(state => state.deviceId?.deviceId);
  const [jobDetails, setJobDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const removeJobApply = async jobId => {
    // console.log('JobId', jobId);
    try {
      setLoader(true);
      // let res = await postApiCall({
      //     url: 'job/revert-application', json: {
      //         jobId: jobId,
      //         deviceId: id
      //     }
      // });
      let res = await delApiCall({
        url: 'admin/application/' + jobId,
      });

      console.log('Remove application response', res);

      if (res.status == 200) {
        getAllJobs();
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoader(false);
    }
  };
  const getJobsDetails = async id => {
    try {
      setLoader(true);
      let res = await getApiCall({ url: 'admin/job/' + id });
      console.log('job details ', res);

      if (res.status == 200) {
        setJobDetails(res.data);
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoader(false);
      setVisibleApply(true);
    }
  };
  const removeAlert = jobId => {
    Alert.alert('Bewerbungsdaten entfernen', 'Bist du sicher ?', [
      {
        text: 'Abbrechen',
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => removeJobApply(jobId),
      },
    ]);
  };
  const renderItem = ({ item }) => {
    console.log('job item ', item);

    return (
      <TouchableHighlight underlayColor={'none'}>
        <View style={styles.renderMainView}>
          {/* job title */}
          <TouchableOpacity
            style={{
              width: '82%',
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('DetailsJobs', {
                item: item.jobId,
                allData: item,
              })
            }>
            <Text
              style={[styles.nameTxt, { color: reCol().color.BDRCLR }]}
              numberOfLines={2}>
              {item?.jobId.jobTitle}
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
                <Image
                  style={{ height: '100%', width: '100%', borderRadius: 10 }}
                  resizeMode="cover"
                  source={{
                    uri: Globals.BASE_URL + item?.companyId?.profileIcon,
                  }}
                />
              </View>
              <Text
                style={[
                  styles.nameTxt,
                  { color: reCol().color.BTNCOLOR, left: 10 },
                ]}
                numberOfLines={2}>
                {item?.companyId?.companyname}
              </Text>
            </View>

            {/* location */}
            <View style={styles.locView}>
              <Image
                source={Images.location}
                style={styles.locImage}
                resizeMode="contain"
              />
              <Text style={styles.locTxt}>{item?.jobId.city[0]?.name ?? 'No City'}</Text>
            </View>
            <View style={styles.locView}>
              <View
                style={{
                  // backgroundColor: reCol().color.EMLCLR,
                  backgroundColor: '#efcb2aff',
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
                  {item?.jobId?.jobType?.jobTypeName}
                </Text>
              </View>
              <View
                style={{
                  // backgroundColor: reCol().color.HRTCLR,
                  backgroundColor: '#1587d3ff',
                  borderRadius: 2,
                  height: 20,
                  width: '25%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  left: 5,
                }}>
                {item?.jobId?.industryName?.industryName?.length > 9 ? (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 11,
                      fontFamily: fontFamily.poppinsRegular,
                    }}>
                    {item?.jobId?.industryName.industryName.slice(0, 9) + '...'}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 11,
                      fontFamily: fontFamily.poppinsRegular,
                    }}>
                    {item?.jobId?.industryName?.industryName}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>


          {/* actions */}
          <View style={{ width: '100%' }}>
            <TouchableOpacity
              style={{
                height: '50%',
                width: '18.2%',
                // backgroundColor: reCol().color.EMLCLR,
                backgroundColor: '#5ee7fcff',
                borderTopRightRadius: 10,
                // borderBottomRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                getJobsDetails(item?.jobId?._id);
              }}>
              <Image
                style={{ height: 20, width: 24 }}
                resizeMode="contain"
                source={require('../../assets/images/sms-tracking.png')}
              />
            </TouchableOpacity>

            {/* X */}
            <TouchableOpacity
              style={{
                height: '50%',
                width: '18.2%',
                // backgroundColor: reCol().color.HRTCLR,
                backgroundColor: '#0ba1c6ff',
                borderBottomRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => removeAlert(item?._id)}>
              <Image
                style={{ height: 30, width: 30 }}
                resizeMode="contain"
                source={require('../../assets/images/close.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={Images.bgImage} style={styles.container}>
        <View style={styles.main}>
          <FlatList
            data={flatData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 500,
              }}
            >
              <Text style={{
                color: '#222',
                fontWeight: '500',
                fontSize: 16
              }} >Noch keine Ergebnisse</Text>
            </View>}
          />
        </View>
      </ImageBackground>
      {ModalSaveApply({
        visibleApply,
        setVisibleApply,
        applyData: jobDetails,
        deviceId: id,
      })}
      {loader && <Loader />}
    </View>
  );
};

export default ApplicationSentListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  heText: {
    fontSize: 15,
    fontFamily: fontFamily.NunitoBold,
    color: reCol().color.BLACK,
    fontWeight: '700',
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
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // height: 160,
    flex: 1,
    flexDirection: 'row',
  },
  nameTxt: {
    color: reCol().color.BDRCLR,
    fontFamily: fontFamily.poppinsSeBold,
    fontSize: 14,
    width: '100%',
  },
  locTxt: {
    left: 5,
    // color: reCol().color.BLACK,
    color: '#222',
    fontFamily: fontFamily.poppinsLight,
    fontSize: 10,
    top: 3,
  },
  locView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locImage: {
    marginTop: 5,
    height: 15,
    width: 15,
  },
});
