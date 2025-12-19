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
import React, { useCallback, useEffect, useState } from 'react';
import { Images } from '@/assets/images/images';
import { fontFamily, reCol } from '@/utils/configuration';
import { getApiCall } from '@/utils/ApiHandler';
import Globals from '@/utils/Globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ModalApply, ModalSaveApply } from '@/component/Modal';
import { useSelector } from 'react-redux';

const SaveJobListing = () => {
  const [flatData, setFlatData] = useState([]);
  const navigation = useNavigation();
  const id = useSelector(state => state.deviceId?.deviceId);
  const [visibleApply, setVisibleApply] = useState(false);
  const [jobDetails, setJobDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        const jsonValue = await AsyncStorage.getItem('jobSaved');
        const conValue = await JSON.parse(jsonValue);
        // console.log('DownloadOfflineData', conValue);
        setFlatData(conValue);
      };
      getData();
    }, []),
  );
  const removeAlert = savedItem => {
    Alert.alert('Favoritenstelle entfernen', 'Bist du sicher ?', [
      {
        text: 'Abbrechen',
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => saveJob(savedItem),
      },
    ]);
  };
  const saveJob = async savedItem => {
    try {
      const existingData = await AsyncStorage.getItem('jobSaved');
      const isIdPresent = JSON.parse(existingData)?.some(
        item => item._id === savedItem._id,
      );
      // console.log('Is ID present:', isIdPresent);
      if (isIdPresent) {
        // setSaveLoader(false);
        // alert('This Job has already been saved.');
        const updatedData = JSON.parse(existingData).filter(
          item => item._id !== savedItem._id,
        );
        await AsyncStorage.setItem('jobSaved', JSON.stringify(updatedData));
        setSavedJobs(updatedData);
        setFlatData(updatedData);
      }
      // else {
      //     let dataArray = [];
      //     if (existingData) {
      //         dataArray = JSON.parse(existingData);
      //     }
      //     // console.log('dataResponseResult', dataResponse);
      //     dataArray.push(savedItem);
      //     // setSaveLoader(false);
      //     await AsyncStorage.setItem('jobSaved', JSON.stringify(dataArray));
      //     setSavedJobs([...savedJobs, savedItem._id]);
      //     // navigateToDownload(dataArray);
      // }
    } catch (error) {
      // setSaveLoader(false);
      console.error('Error saving data to local storage:', error);
    }
  };
  const getJobsDetails = async id => {
    try {
      setLoader(true);
      let res = await getApiCall({ url: 'admin/job/' + id });
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
  const renderItem = ({ item }) => {
    const { jobTitle, city, startDate, companyLogo } = item;
    const isSaved = savedJobs.includes(item._id);
    // console.log('item', item);
    return (
      <TouchableHighlight underlayColor={'none'}>
        <View style={styles.renderMainView}>
          <TouchableOpacity
            style={{ width: '83%', paddingHorizontal: 10, paddingVertical: 10 }}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('DetailsJobs', { item: item })}>

            {/* Job Title */}
            <Text
              style={[styles.nameTxt, { color: reCol().color.BDRCLR }]}
              numberOfLines={2}>
              {item?.jobTitle || 'N/A'}
            </Text>

            {/* Company */}
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
                    uri:
                      item?.companyId?.profileIcon
                        ? Globals.BASE_URL + item.companyId.profileIcon
                        : undefined,
                  }}
                  defaultSource={Images.fallbackLogo}
                />
              </View>

              <Text
                style={[
                  styles.nameTxt,
                  { color: reCol().color.BTNCOLOR, left: 10 },
                ]}
                numberOfLines={2}>
                {item?.companyId?.companyname || 'Unknown Company'}
              </Text>
            </View>

            {/* location  */}
            <View style={styles.locView}>
              <Image
                source={Images.location}
                style={styles.locImage}
                resizeMode="contain"
              />
              <Text style={styles.locTxt}>
                {item?.city?.length > 0
                  ? item.city
                    .map(c => c?.name)
                    .filter(Boolean)
                    .join(', ')
                  : 'No City'}
              </Text>
            </View>

            {/* job type */}
            <View style={styles.locView}>
              <View
                style={{
                  backgroundColor: '#f3c12dff',
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
                  {item?.jobType?.jobTypeName || 'N/A'}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#1373d9ff',
                  borderRadius: 2,
                  height: 20,
                  width: '25%',
                  paddingHorizontal: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  left: 5,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 11,
                    fontFamily: fontFamily.poppinsRegular,
                  }}>
                  {item?.industryName?.industryName
                    ? item.industryName.industryName.length > 9
                      ? item.industryName.industryName.slice(0, 9) + '...'
                      : item.industryName.industryName
                    : 'N/A'}
                </Text>
              </View>

              <Text style={styles.mwdTxt}></Text>
            </View>
          </TouchableOpacity>

          {/* right side buttons */}
          <View style={{ width: '100%' }}>
            <TouchableOpacity
              style={{
                height: '50%',
                width: '17%',
                backgroundColor: '#9deefeff',
                borderTopRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                if (item?._id) getJobsDetails(item._id);
              }}>
              <Image
                style={{ height: 20, width: 24 }}
                resizeMode="contain"
                source={require('../../assets/images/sms-tracking.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: '50%',
                width: '17%',
                backgroundColor: '#16b5caff',
                borderBottomRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                if (item) removeAlert(item);
              }}>
              <Image
                style={{ height: 20, width: 24 }}
                resizeMode="contain"
                source={require('../../assets/images/heartFill.png')}
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
          {/* <Image
                        source={require('../../assets/images/heartEmpty.png')}
                        resizeMode='contain'
                        style={styles.heartImg}
                    />
                    <Text style={styles.heText}>Meine gespeicherten Jobs</Text>
                    <Text style={styles.suText}>Du hast noch keine Jobs gespeichert.
                        Tippe bei interessanten Jobs einfach auf dash Herz.
                        um sie hier zu speichern</Text> */}
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
              }} >No Gespeichert</Text>
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
    </View>
  );
};

export default SaveJobListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  heartImg: {
    height: '10%',
    width: '100%',
  },
  heText: {
    fontSize: 15,
    paddingTop: 10,
    fontFamily: fontFamily.NunitoBold,
    color: reCol().color.BLACK,
    fontWeight: '700',
  },
  suText: {
    fontSize: 13,
    paddingTop: 5,
    fontFamily: fontFamily.poppinsLight,
    color: reCol().color.BLACK,
    textAlign: 'center',
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
    flex: 1,
    justifyContent: 'space-between',
    // height: 140,
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
});
