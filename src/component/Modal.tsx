import { Images } from '@/assets/images/images';
import { fontFamily, reCol } from '@/utils/configuration';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { applySchema } from './schema';
import FormInput from './FormInput';
import TextAreaInput from './FormArea';
import networkWithoutToken from '@/networkApi/networkWithoutToken';
import { IApply } from './interface';
import Loader from './Loader';
import Globals from '@/utils/Globals';
import { getApiCall, getApiCall1 } from '@/utils/ApiHandler';
import { useIsFocused } from '@react-navigation/native';
import { RichEditor } from 'react-native-pell-rich-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import RenderHTML from 'react-native-render-html';
import { useSelector } from 'react-redux';
import axios from 'axios';
const width = Dimensions.get('window').width;
interface IndustryProps {
  id: number;
  name: string;
}
const industryFlatData: IndustryProps[] = [
  { id: 1, name: 'Industry 1' },
  { id: 2, name: 'Industry 2' },
  { id: 3, name: 'Industry 3' },
  { id: 4, name: 'Industry 4' },
  { id: 5, name: 'Industry 5' },
  { id: 6, name: 'Industry 6' },
  { id: 7, name: 'Industry 7' },
  { id: 8, name: 'Industry 8' },
  { id: 9, name: 'Industry 9' },
  { id: 10, name: 'Industry 10' },
];

interface LocationProps {
  id: number;
  name: string;
}

const locationFlatData: LocationProps[] = [
  { id: 1, name: 'Location 1' },
  { id: 2, name: 'Location 2' },
  { id: 3, name: 'Location 3' },
  // Add more locations as needed
];

interface ModalLocationProps {
  visibleLocation: boolean;
  setVisibleLocation: React.Dispatch<React.SetStateAction<boolean>>;
}

const renderIndustrtyData = ({ item }: { item: IndustryProps }) => {
  const { name } = item;
  return (
    <View style={styles.renderView}>
      <Text>{name}</Text>
      <Checkbox value={name} />
    </View>
  );
};
interface ModalApplyProps {
  visibleApply: boolean;
  setVisibleApply: React.Dispatch<React.SetStateAction<boolean>>;
  applyData: any;
  deviceId: string;
}
interface ModalJobDetailImageProps {
  visibleJobImage: boolean;
  setVisibleJobImage: React.Dispatch<React.SetStateAction<boolean>>;
  imageData: any;
}
interface ModalAppointmentProps {
  visibleAppointment: boolean;
  setVisibleAppointment: React.Dispatch<React.SetStateAction<boolean>>;
  appointmentData: any;
}
interface ModalIndustryProps {
  visibleIndustry: boolean;
  setVisibleIndustry: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ModalSaveApply: React.FC<ModalApplyProps> = ({
  visibleApply,
  setVisibleApply,
  applyData,
  deviceId,
}) => {
  console.log('model open ');

  console.log('ApplySaveData mk', applyData);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState<any>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [coverLabel, setCoverLabel] = useState<any>([]);
  const [showPrivacy, setShowPrivacy] = useState<any>(false);
  const richRef: any = useRef();
  const comId = useSelector((state: any) => state.companyId?.companyId);
  const [selectedImageShow, setSelectedImageShow] = useState<any>([]);
  const isfocused = useIsFocused();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      Email: '',
      Name: '',
      Mobile: '',
      About: '',
      Cover: '',
    },
    resolver: yupResolver(applySchema),
  });
  const ContentData = async () => {
    try {
      let res = await getApiCall1({ url: 'manage_content' });
      if (res.status == 200) {
        setContent(res?.data?.jobCoverLetter);
        setCoverLabel(res?.data.coverLetterFieldName);
        setFlag(true);
      }
    } catch (e) {
      alert(e);
    } finally {
    }
  };
  const blurContentEditor = () => {
    // Your logic to blur the editor and dismiss the keyboard
    // For example:
    richRef.current.blurContentEditor(); // This would call the blurContentEditor method if it exists in your RichEditor component
  };
  const retrieveData = async () => {
    try {
      // Retrieve data from AsyncStorage
      const name = await AsyncStorage.getItem('name');
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      const email = (await AsyncStorage.getItem('email')) || '';
      const message = await AsyncStorage.getItem('message');
      //   console.warn(name,email)
      if (name) {
        setValue('Name', name);
        setValue('Mobile', phoneNumber);
        setValue('Email', email);
        setValue('About', message);
      }
    } catch (error) {
      console.error('Error retrieving data: ', error);
    }
  };

  useEffect(() => {
    retrieveData();
    ContentData();
    setValue('Cover', content);
  }, [flag, isfocused]);
  const applyApi = async (values: IApply) => {
    // console.log('Called')
    const body: any = new FormData();
    body.append('jobId', applyData._id);
    body.append('name', values.Name);
    body.append('email', values.Email);
    body.append('phone', values.Mobile || '');
    body.append('aboutMe', values.About || '');
    body.append('companyId', comId);
    body.append('coverLetter', 'content job details');
    // body.append('deviceId', deviceId);
    // { selectedImage ? body.append('attachment', selectedImage) : null }
    if (selectedImageShow.length > 0) {
      selectedImageShow.forEach((image: any) => {
        body.append('attachement', image);
      });
    }
    console.log('deviceId123', body);
    const response = await networkWithoutToken.createMobileOtp().applyJob(body);
    console.log('ResponseOfApplyApi123', response);
    setLoading(false);
    setVisibleApply(false);
    Alert.alert(
      'Herzlichen Glückwunsch!',
      'Deine Bewerbung wurde erfolgreich versendet.',
    );
  };


  const onSubmit: any = async (values: IApply) => {
    setLoading(true);
    applyApi(values);
  };
  const renderItemImage = (item: any) => {
    const { uri } = item.item;
    const removeImage = (uriToRemove: any) => {
      // Use the filter method to remove the image at the specified index
      const updatedImageList = selectedImageShow.filter(
        (image: any) => image.uri !== uriToRemove,
      );
      const updatedbase64List = selectedImage.filter(
        (image: any) => image.uri !== uriToRemove,
      );
      setSelectedImageShow(updatedImageList);
      setSelectedImage(updatedbase64List);
    };
    return (
      <View
        style={{
          height: 200,
          width: width / 3.38,
          paddingLeft: 5,
          marginTop: 20,
        }}>
        <Image
          source={{ uri: uri }}
          style={{ height: '100%', width: '100%' }}
          borderRadius={15}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            top: -10,
            right: -5,
          }}
          onPress={() => removeImage(uri)}>
          <Image
            source={Images.modalClose}
            style={{
              height: 20,
              width: 20,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const launchImageLibrary = async () => {
    let options: any = {
      // includeBase64: true,
      selectionLimit: 6 - selectedImageShow.length,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await ImagePicker.launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const newImages: any = [];
        const newImagesBase64: any = [];
        response.assets.forEach((image: any) => {
          console.log('Image', image);
          newImages.push(image);
          newImagesBase64.push({
            name: image.fileName,
            type: image.type,
            uri: image.uri,
          });
        });
        setSelectedImage((prev: any) => [...prev, ...newImages]);
        setSelectedImageShow((prev: any) => [...prev, ...newImagesBase64]);
      }
    });
  };
  const handlePrivacyandclose = () => {
    if (showPrivacy) {
      setShowPrivacy(false);
    } else {
      setVisibleApply(false);
    }
  };
  return (
    <Modal animationType="slide" visible={visibleApply} transparent={true}>
      <ScrollView contentContainerStyle={styles.modalBgView}>
        <View style={styles.modalMainView}>
          <View style={[styles.flexView, { marginVertical: 10 }]}>
            {showPrivacy ? (
              <Text style={styles.headingText}>{'Datenschutz & AGB'}</Text>
            ) : (
              <Text style={styles.headingText}>{'Jetzt direkt bewerben'}</Text>
            )}
            <TouchableOpacity onPress={() => handlePrivacyandclose()}>
              <Image source={Images.modalClose} style={styles.closeImg} />
            </TouchableOpacity>
          </View>
          {showPrivacy ? (
            <ScrollView>
              <View style={{ marginHorizontal: 15 }}>
                <RenderHTML source={{ html: content }} />
              </View>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={true}>
              {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
              <View
                style={[
                  styles.main,
                  {
                    paddingBottom:
                      selectedImage.length > 3 && selectedImage.length <= 6
                        ? '75%'
                        : selectedImage.length === 3
                          ? '60%'
                          : '50%',
                  },
                ]}>
                <Text style={[styles.headingText, { fontSize: 15 }]}>
                  {applyData?.jobTitle}
                </Text>
                <Text
                  style={[
                    styles.headingText,
                    { fontSize: 15, marginTop: 10, color: '#ff9046' },
                  ]}>
                  {applyData?.company?.companyName}
                </Text>
                {applyData.isDesktopView && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        `https://www.azubiregional.de/jobs-board/${applyData._id}`,
                      )
                    }
                    style={{
                      marginTop: 10,
                      backgroundColor: '#ff9046',
                      padding: 10,
                      width: '25%',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{ color: 'white', textDecorationLine: 'underline' }}>
                      {'Job Link'}
                    </Text>
                  </TouchableOpacity>
                )}
                <Text style={[styles.labelText, { marginTop: 10 }]}>
                  {'Vorname/Nachname'}
                </Text>
                <FormInput
                  name="Name"
                  placeholder={'Geben Sie Ihren Namen ein'}
                  borderColor={reCol().color.BDRCLR}
                  control={control}
                />
                <Text style={styles.labelText}>{'E-Mail'}</Text>
                <FormInput
                  name="Email"
                  placeholder={'Geben Sie Ihre E-Mail-Adresse ein'}
                  borderColor={reCol().color.BDRCLR}
                  control={control}
                />
                <Text style={styles.labelText}>
                  {'Telefonnummer (optional)'}
                </Text>
                <FormInput
                  name="Mobile"
                  style={{ fontSize: 12 }}
                  placeholder={'Hier eingeben'}
                  borderColor={reCol().color.BDRCLR}
                  control={control}
                />
                <Text style={styles.labelText}>{'Über mich (optional)'}</Text>
                <TextAreaInput
                  name="About"
                  placeholder={'Hier eingeben'}
                  control={control}
                  height={100}
                  borderColor={reCol().color.BDRCLR}
                />
                <TouchableOpacity onPress={() => blurContentEditor()}>
                  <Text style={styles.labelText}>{coverLabel}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: '30%',
                    borderWidth: 1,
                    borderRadius: 3,
                    borderColor: reCol().color.BDRCLR,
                  }}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    style={{ height: 80 }}>
                    <RichEditor
                      ref={richRef}
                      initialContentHTML={content}
                      onChange={txt => {
                        setContent(txt);
                      }}
                      hideKeyboardAccessoryView={true}
                    />
                  </ScrollView>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {selectedImage.length > 0 ? (
                    <FlatList
                      data={selectedImageShow}
                      // @ts-ignore
                      renderItem={renderItemImage}
                      numColumns={3}
                    />
                  ) : (
                    <TouchableOpacity
                      style={{ flexDirection: 'row', marginTop: 15 }}
                      onPress={() => launchImageLibrary()}>
                      <Image
                        source={Images.addGallery}
                        style={{
                          height: 65,
                          width: 65,
                          tintColor: reCol().color.BDRCLR,
                        }}
                      />
                      <Text
                        style={[
                          styles.labelText,
                          {
                            marginBottom: 0,
                            marginTop: 0,
                            alignSelf: 'flex-start',
                          },
                        ]}>{`Bewerbungsunterlagen Datei(en)              auswählen (optional)`}</Text>
                    </TouchableOpacity>
                  )}
                  {selectedImage.length < 3 && selectedImage.length != 0 && (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'center',
                        marginRight: selectedImage.length === 1 ? '40%' : '10%',
                      }}
                      onPress={() => launchImageLibrary()}>
                      <Image
                        source={Images.addGallery}
                        style={{
                          height: 65,
                          width: 65,
                          tintColor: reCol().color.BDRCLR,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {selectedImage.length >= 3 && selectedImage.length < 6 && (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'flex-end',
                        position: 'absolute',
                        left:
                          selectedImage.length === 4
                            ? '40%'
                            : selectedImage.length === 3
                              ? '8%'
                              : '75%',
                        bottom: selectedImage.length === 3 ? '-40%' : '15%',
                        // marginRight: selectedImage.length === 4 ? '40%' : '10%'
                      }}
                      onPress={() => launchImageLibrary()}>
                      <Image
                        source={Images.addGallery}
                        style={{
                          height: 65,
                          width: 65,
                          tintColor: reCol().color.BDRCLR,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: selectedImage.length === 3 ? '30%' : 10,
                    alignItems: 'center',
                  }}
                  onPress={() => setIsChecked(!isChecked)}>
                  <Checkbox
                    isChecked={isChecked}
                    alignSelf={'center'}
                    value="1"
                    size={'lg'}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <Text
                    style={[
                      styles.labelText,
                      {
                        marginBottom: 0,
                        marginLeft: 10,
                        marginTop: 0,
                        fontSize: 13,
                      },
                    ]}>
                    {`Ich akzeptiere die elektronische Speicherung${'\n'}meiner Daten gemäß der  `}
                    <Text
                      style={[
                        styles.labelText,
                        {
                          marginTop: 0,
                          fontSize: 13,
                          textDecorationLine: 'underline',
                        },
                      ]}
                      onPress={() => setShowPrivacy(true)}>
                      Datenschutzrichtlinien.
                    </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    backgroundColor: isChecked
                      ? reCol().color.BTNCOLOR
                      : 'gray',
                    borderRadius: 10,
                    top: 15,
                    flexDirection: 'row',
                    marginBottom: selectedImage ? '50%' : 40,
                  }}
                  activeOpacity={0.5}
                  onPress={() => handleSubmit(onSubmit)()}>
                  <Text
                    style={{
                      fontFamily: fontFamily.poppinsSeBold,
                      fontSize: 16,
                      color: '#fff',
                      left: 5,
                    }}>
                    {'Bewerbung absenden'}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* </TouchableWithoutFeedback> */}
            </ScrollView>
          )}
        </View>
      </ScrollView>
      {loading && <Loader />}
    </Modal>
  );
};
export const ModalApply: React.FC<ModalApplyProps> = ({
  visibleApply,
  setVisibleApply,
  applyData,
  deviceId,
}) => {
  console.log('applyJobDataModal', applyData);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>([]);
  const [coverLabel, setCoverLabel] = useState<any>([]);
  const [showPrivacy, setShowPrivacy] = useState<any>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>([]);
  const [selectedImageShow, setSelectedImageShow] = useState<any>([]);
  const [isChecked, setIsChecked] = useState(false);
  const richRef: any = useRef();
  const isfocused = useIsFocused();
  const comId = useSelector((state: any) => state.companyId?.companyId);
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      Email: '',
      Name: '',
      Mobile: '',
      About: '',
      Cover: '',
    },
    resolver: yupResolver(applySchema),
  });
  const ContentData = async () => {
    try {
      let res = await getApiCall1({ url: 'manage_content' });
      console.log('ContentData job res => ', res);

      if (res.status == 200) {
        setContent(res?.data?.jobCoverLetter);
        setCoverLabel(res?.data.coverLetterFieldName);
        setFlag(true);
      }
    } catch (e) {
      // alert(e);
      console.log('ContentData job Error => ', e);

    } finally {
    }
  };
  const launchImageLibrary = async () => {
    let options: any = {
      // includeBase64: true,
      selectionLimit: 6 - selectedImageShow.length,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await ImagePicker.launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const newImages: any = [];
        const newImagesBase64: any = [];
        response.assets.forEach((image: any) => {
          // console.log('Image', image);
          newImages.push(image);
          newImagesBase64.push({
            name: image.fileName,
            type: image.type,
            uri: image.uri,
          });
        });
        setSelectedImage((prev: any) => [...prev, ...newImages]);
        setSelectedImageShow((prev: any) => [...prev, ...newImagesBase64]);
      }
    });
  };
  // console.log('selectedImage', selectedImage);
  const retrieveData = async () => {
    try {
      // Retrieve data from AsyncStorage
      const name = await AsyncStorage.getItem('name');
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      const email = (await AsyncStorage.getItem('email')) || '';
      const message = await AsyncStorage.getItem('message');
      //   console.warn(name,email)
      if (name) {
        setValue('Name', name);
        setValue('Mobile', phoneNumber);
        setValue('Email', email);
        setValue('About', message);
      }
    } catch (error) {
      console.error('Error retrieving data: ', error);
    }
  };

  useEffect(() => {
    retrieveData();
    ContentData();
    setValue('Cover', content);
  }, [flag, isfocused]);
  const applyApi = async (values: IApply) => {
    console.log('Called applyApi ')
    const body: any = new FormData();
    body.append('jobId', applyData._id);
    body.append('name', values.Name);
    body.append('email', values.Email);
    body.append('phone', values.Mobile || '');
    body.append('aboutMe', values.About || '');
    body.append('companyId', applyData.companyId._id);
    body.append('coverLetter', 'Content job details');
    // body.append('coverLetter', content);
    // { selectedImage ? body.append('attachment', selectedImage) : null }
    if (selectedImageShow.length > 0) {
      selectedImageShow.forEach((image: any) => {
        body.append('attachement', image);
      });
    }
    console.log('PayLoad', body);
    const response = await networkWithoutToken.createMobileOtp().applyJob(body);
    console.log('ResponseOfApplyApi', response?.data);
    setLoading(false);
    setVisibleApply(false);
    Alert.alert(
      'Herzlichen Glückwunsch!',
      'Deine Bewerbung wurde erfolgreich versendet.',
    );
  };
  const onSubmit: any = async (values: IApply) => {
    setLoading(true);
    applyApi(values);
  };
  const blurContentEditor = () => {
    // Your logic to blur the editor and dismiss the keyboard
    // For example:
    richRef.current.blurContentEditor(); // This would call the blurContentEditor method if it exists in your RichEditor component
  };
  const renderItemImage = (item: any) => {
    const { uri } = item.item;
    const removeImage = (uriToRemove: any) => {
      // Use the filter method to remove the image at the specified index
      const updatedImageList = selectedImageShow.filter(
        (image: any) => image.uri !== uriToRemove,
      );
      const updatedbase64List = selectedImage.filter(
        (image: any) => image.uri !== uriToRemove,
      );
      setSelectedImageShow(updatedImageList);
      setSelectedImage(updatedbase64List);
    };
    return (
      <View
        style={{
          height: 200,
          width: width / 3.38,
          paddingLeft: 5,
          marginTop: 20,
        }}>
        <Image
          source={{ uri: uri }}
          style={{ height: '100%', width: '100%' }}
          borderRadius={15}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            top: -10,
            right: -5,
          }}
          onPress={() => removeImage(uri)}>
          <Image
            source={Images.modalClose}
            style={{
              height: 20,
              width: 20,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const handlePrivacyandclose = () => {
    if (showPrivacy) {
      setShowPrivacy(false);
    } else {
      setVisibleApply(false);
    }
  };
  return (
    <Modal animationType="slide" visible={visibleApply} transparent={true}>
      <ScrollView contentContainerStyle={styles.modalBgView}>
        <View style={styles.modalMainView}>
          <View style={[styles.flexView, { marginVertical: 10 }]}>
            {showPrivacy ? (
              <Text style={styles.headingText}>{'Datenschutz & AGB'}</Text>
            ) : (
              <Text style={styles.headingText}>{'Jetzt direkt bewerben'}</Text>
            )}
            <TouchableOpacity onPress={() => handlePrivacyandclose()}>
              <Image source={Images.modalClose} style={styles.closeImg} />
            </TouchableOpacity>
          </View>
          {showPrivacy ? (
            <ScrollView>
              <View style={{ marginHorizontal: 15 }}>
                <RenderHTML source={{ html: content }} />
              </View>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={true}>
              <View
                style={[
                  styles.main,
                  {
                    paddingBottom:
                      selectedImage.length > 3 && selectedImage.length <= 6
                        ? '75%'
                        : selectedImage.length === 3
                          ? '60%'
                          : '50%',
                  },
                ]}>
                <Text style={[styles.headingText, { fontSize: 15 }]}>
                  {applyData?.jobTitle}
                </Text>
                <Text
                  style={[
                    styles.headingText,
                    { fontSize: 15, marginTop: 10, color: '#ff9046' },
                  ]}>
                  {applyData?.company?.companyName}
                </Text>
                {applyData.isDesktopView && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        `https://www.azubiregional.de/jobs-board/${applyData._id}`,
                      )
                    }
                    style={{
                      marginTop: 10,
                      backgroundColor: '#ff9046',
                      padding: 10,
                      width: '25%',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{ color: 'white', textDecorationLine: 'underline' }}>
                      {'Job Link'}
                    </Text>
                  </TouchableOpacity>
                )}
                <Text style={[styles.labelText, { marginTop: 10 }]}>
                  {'Vorname/Nachname'}
                </Text>
                <FormInput
                  name="Name"
                  placeholder={'Geben Sie Ihren Namen ein'}
                  borderColor={reCol().color.BDRCLR}
                  control={control}
                />
                <Text style={styles.labelText}>{'E-Mail'}</Text>
                <FormInput
                  name="Email"
                  placeholder={'Geben Sie Ihre E-Mail-Adresse ein'}
                  borderColor={reCol().color.BDRCLR}
                  control={control}
                />
                <Text style={styles.labelText}>
                  {'Telefonnummer (optional)'}
                </Text>
                <FormInput
                  name="Mobile"
                  placeholder={'Hier eingeben'}
                  style={{ fontSize: 12 }}
                  borderColor={reCol().color.BDRCLR}
                  control={control}
                />
                <Text style={styles.labelText}>{'Über mich (optional)'}</Text>
                <TextAreaInput
                  name="About"
                  placeholder={'Hier eingeben'}
                  control={control}
                  height={100}
                  borderColor={reCol().color.BDRCLR}
                />
                <TouchableOpacity onPress={() => blurContentEditor()}>
                  <Text style={styles.labelText}>{coverLabel}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: '30%',
                    borderWidth: 1,
                    borderRadius: 3,
                    borderColor: reCol().color.BDRCLR,
                  }}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    style={{ height: 80 }}>
                    <RichEditor
                      ref={richRef}
                      initialContentHTML={content}
                      onChange={txt => {
                        setContent(txt);
                      }}
                      hideKeyboardAccessoryView={true}
                    />
                  </ScrollView>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {selectedImage.length > 0 ? (
                    <FlatList
                      data={selectedImageShow}
                      // @ts-ignore
                      renderItem={renderItemImage}
                      numColumns={3}
                    />
                  ) : (
                    <TouchableOpacity
                      style={{ flexDirection: 'row', marginTop: 15 }}
                      onPress={() => launchImageLibrary()}>
                      <Image
                        source={Images.addGallery}
                        style={{
                          height: 65,
                          width: 65,
                          tintColor: reCol().color.BDRCLR,
                        }}
                      />
                      <Text
                        style={[
                          styles.labelText,
                          {
                            marginBottom: 0,
                            marginTop: 0,
                            alignSelf: 'flex-start',
                          },
                        ]}>{`Bewerbungsunterlagen Datei(en)              auswählen (optional)`}</Text>
                    </TouchableOpacity>
                  )}
                  {selectedImage.length < 3 && selectedImage.length != 0 && (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'center',
                        marginRight: selectedImage.length === 1 ? '40%' : '10%',
                      }}
                      onPress={() => launchImageLibrary()}>
                      <Image
                        source={Images.addGallery}
                        style={{
                          height: 65,
                          width: 65,
                          tintColor: reCol().color.BDRCLR,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {selectedImage.length >= 3 && selectedImage.length < 6 && (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'flex-end',
                        position: 'absolute',
                        left:
                          selectedImage.length === 4
                            ? '40%'
                            : selectedImage.length === 3
                              ? '8%'
                              : '75%',
                        bottom: selectedImage.length === 3 ? '-40%' : '15%',
                      }}
                      onPress={() => launchImageLibrary()}>
                      <Image
                        source={Images.addGallery}
                        style={{
                          height: 65,
                          width: 65,
                          tintColor: reCol().color.BDRCLR,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: selectedImage.length === 3 ? '30%' : 10,
                    alignItems: 'center',
                  }}
                  onPress={() => setIsChecked(!isChecked)}>
                  <Checkbox
                    isChecked={isChecked}
                    alignSelf={'center'}
                    value="1"
                    size={'lg'}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <Text
                    style={[
                      styles.labelText,
                      {
                        marginBottom: 0,
                        marginLeft: 10,
                        marginTop: 0,
                        fontSize: 13,
                      },
                    ]}>
                    {`Ich akzeptiere die elektronische Speicherung${'\n'}meiner Daten gemäß der  `}
                    <Text
                      style={[
                        styles.labelText,
                        {
                          marginTop: 0,
                          fontSize: 13,
                          textDecorationLine: 'underline',
                        },
                      ]}
                      onPress={() => setShowPrivacy(true)}>
                      Datenschutzrichtlinien.
                    </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    backgroundColor: isChecked
                      ? '#f39632ff'
                      : 'gray',
                    borderRadius: 10,
                    top: 15,
                    flexDirection: 'row',
                    marginBottom: selectedImage ? '50%' : 0,
                  }}
                  activeOpacity={0.5}
                  disabled={isChecked ? false : true}
                  onPress={() => handleSubmit(onSubmit)()}>
                  <Text
                    style={{
                      fontFamily: fontFamily.poppinsSeBold,
                      fontSize: 16,
                      color: '#fff',
                      left: 5,
                    }}>
                    {'Bewerbung absenden'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>
      {loading && <Loader />}
    </Modal>
  );
};
export const ModalAppointment: React.FC<ModalAppointmentProps> = ({
  visibleAppointment,
  setVisibleAppointment,
  appointmentData,
}) => {
  console.log('appointmentData data => ', appointmentData);

  const [content, setContent] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [coverLabel, setCoverLabel] = useState<any>([]);
  const [showPrivacy, setShowPrivacy] = useState<any>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const isfocused = useIsFocused();
  const [selectedImage, setSelectedImage] = useState<any>([]);
  const [selectedImageShow, setSelectedImageShow] = useState<any>([]);
  const [isChecked, setIsChecked] = useState(false);
  const richRef: any = useRef();

  console.log('content => ', content);
  console.log('coverLabel => ', coverLabel);


  const ContentData = async () => {
    try {
      // let res = await getApiCall({ url: 'manage_content' });
      let res = await getApiCall1({ url: 'manage_content' });
      // console.log('ContentData res mk => ', res.data);

      if (res.status == 200) {
        setContent(res?.data?.appointment);
        setCoverLabel(res?.data?.appointmentFieldName);
        setFlag(true);
      }
    } catch (e) {
      console.log('ContentData Error ', e);
    }
  };


  const launchImageLibrary = async () => {
    let options: any = {
      // includeBase64: true,
      selectionLimit: 6 - selectedImageShow.length,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await ImagePicker.launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const newImages: any = [];
        const newImagesBase64: any = [];
        response.assets.forEach((image: any) => {
          // console.log('Image', image);
          newImages.push(image);
          newImagesBase64.push({
            name: image.fileName,
            type: image.type,
            uri: image.uri,
          });
        });
        setSelectedImage((prev: any) => [...prev, ...newImages]);
        setSelectedImageShow((prev: any) => [...prev, ...newImagesBase64]);
      }
    });
  };

  const retrieveData = async () => {
    try {
      // Retrieve data from AsyncStorage
      const name = await AsyncStorage.getItem('name');
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      const email = (await AsyncStorage.getItem('email')) || '';
      const message = await AsyncStorage.getItem('message');
      //   console.warn(name,email)
      if (name) {
        setValue('Name', name);
        setValue('Mobile', phoneNumber);
        setValue('Email', email);
        setValue('About', message);
      }
    } catch (error) {
      console.error('Error retrieving data: ', error);
    }
  };
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      Email: '',
      Name: '',
      Mobile: '',
      About: '',
      Cover: '',
    },
    resolver: yupResolver(applySchema),
  });
  // const takeAppointmentApi = async (values: IApply) => {
  //   const body: any = new FormData();
  //   body.append('companyId', appointmentData._id);
  //   body.append('applicantName', values.Name);
  //   body.append('email', values.Email);
  //   body.append('phone', values.Mobile || '');
  //   body.append('aboutMe', values.About || '');
  //   body.append('coverLetter', content);
  //   if (selectedImageShow.length > 0) {
  //     selectedImageShow.forEach((image: any) => {
  //       body.append('attachment', image);
  //     });
  //   }
  //   console.log('BodyOfAddAppointment', body);
  //   // const response = await networkWithoutToken
  //   //   .createMobileOtp()
  //   //   .addAppointment(body);
  //   // console.log('ResponseOfAddAppointment => ', response);
  //   // setLoading(false);
  //   // if (response?.data?.message?.trim() == 'success') {
  //   //   setSuccess(true);
  //   // }

  //   const response = await axios.post(`https://azubi.api.digimonk.net/api/v1/admin/appointment-form`, body);
  //   console.log('res appointment => ', response);
  //   setLoading(false);


  // };

  const takeAppointmentApi = async (values: IApply) => {
    console.log('values ', values);
    
    try {
      setLoading(true);

      const body = new FormData();

      body.append('companyId', appointmentData._id);
      body.append('name', values.Name);
      body.append('email', values.Email);
      body.append('phone', values.Mobile || '');
      body.append('aboutMe', values.About || '');
      body.append('appointment', content);

      if (selectedImageShow?.length > 0) {
        selectedImageShow.forEach((image: any, index: number) => {
          body.append('attachment', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.fileName || `attachment_${index}.jpg`,
          } as any);
        });
      }

      const response = await axios.post(
        'https://azubi.api.digimonk.net/api/v1/admin/appointment-form',
        body,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Appointment response => ', response.data);

      if (response.status === 200) {
        setSuccess(true);
        setVisibleAppointment(false);
        Alert.alert(
          'Herzlichen Glückwunsch!',
          'Deine Terminvereinbarung wurde erfolgreich versendet.',
        );
      }
    } catch (error: any) {
      console.log(
        'Appointment API error => ',
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };


  const onSubmit: any = async (values: IApply) => {
    console.log('onSubmit values => ', values);

    setLoading(true);
    await takeAppointmentApi(values);
  };
  const renderItemImage = (item: any) => {
    const { uri } = item.item;
    const removeImage = (uriToRemove: any) => {
      // Use the filter method to remove the image at the specified index
      const updatedImageList = selectedImageShow.filter(
        (image: any) => image.uri !== uriToRemove,
      );
      const updatedbase64List = selectedImage.filter(
        (image: any) => image.uri !== uriToRemove,
      );
      setSelectedImageShow(updatedImageList);
      setSelectedImage(updatedbase64List);
    };
    return (
      <View
        style={{
          height: 200,
          width: width / 3.38,
          paddingLeft: 5,
          marginTop: 20,
        }}>
        <Image
          source={{ uri: uri }}
          style={{ height: '100%', width: '100%' }}
          borderRadius={15}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            top: -10,
            right: -5,
          }}
          onPress={() => removeImage(uri)}>
          <Image
            source={Images.modalClose}
            style={{
              height: 20,
              width: 20,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  useEffect(() => {
    retrieveData();
    ContentData();
    setValue('Cover', content);
  }, [flag, isfocused]);
  const blurContentEditor = () => {
    // Your logic to blur the editor and dismiss the keyboard
    // For example:
    richRef.current.blurContentEditor(); // This would call the blurContentEditor method if it exists in your RichEditor component
  };
  const handlePrivacyandclose = () => {
    if (showPrivacy) {
      setShowPrivacy(false);
    } else {
      setVisibleAppointment(false);
    }
  };
  return (
    <Modal
      animationType="slide"
      visible={visibleAppointment}
      transparent={true}>
      <ScrollView contentContainerStyle={styles.modalBgView}>
        {success == false ? (
          <View style={styles.modalMainView}>
            <View style={[styles.flexView, { marginVertical: 10 }]}>
              {showPrivacy ? (
                <Text style={styles.headingText}>{'Datenschutz & AGB'}</Text>
              ) : (
                <Text style={styles.headingText}>{'Direktbewerbung'}</Text>
              )}
              <TouchableOpacity onPress={() => handlePrivacyandclose()}>
                <Image source={Images.modalClose} style={styles.closeImg} />
              </TouchableOpacity>
            </View>
            {showPrivacy ? (
              <ScrollView>
                <View style={{ marginHorizontal: 15 }}>
                  <RenderHTML source={{ html: content }} />
                </View>
              </ScrollView>
            ) : (
              <ScrollView showsVerticalScrollIndicator={true}>
                <View
                  style={[
                    styles.main,
                    {
                      paddingBottom:
                        selectedImage.length > 3 && selectedImage.length <= 6
                          ? '75%'
                          : selectedImage.length === 3
                            ? '60%'
                            : '50%',
                    },
                  ]}>
                  <Text style={[styles.headingText, { fontSize: 15 }]}>
                    {appointmentData.companyname}
                  </Text>
                  <Text style={[styles.labelText, { marginTop: 10 }]}>
                    {'Vorname/Nachname'}
                  </Text>
                  <FormInput
                    name="Name"
                    placeholder={'Geben Sie Ihren Namen ein'}
                    borderColor={reCol().color.BDRCLR}
                    control={control}
                  />
                  <Text style={styles.labelText}>{'E-Mail'}</Text>
                  <FormInput
                    name="Email"
                    placeholder={'Geben Sie Ihre E-Mail-Adresse ein'}
                    borderColor={reCol().color.BDRCLR}
                    control={control}
                  />
                  <Text style={styles.labelText}>
                    {'Telefonnummer (optional)'}
                  </Text>
                  <FormInput
                    name="Mobile"
                    placeholder="Hier eingeben"
                    style={{ fontSize: 12 }}
                    borderColor={reCol().color.BDRCLR}
                    control={control}
                  />
                  <Text style={styles.labelText}>{'Über mich (optional)'}</Text>
                  <TextAreaInput
                    name="About"
                    placeholder="Hier eingeben"
                    control={control}
                    height={100}
                    borderColor={reCol().color.BDRCLR}
                  />
                  <TouchableOpacity onPress={() => blurContentEditor()}>
                    <Text style={styles.labelText}>{coverLabel}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: '30%',
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: reCol().color.BDRCLR,
                    }}>
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                      style={{ height: 80 }}>
                      <RichEditor
                        ref={richRef}
                        initialContentHTML={content}
                        onChange={txt => {
                          setContent(txt);
                        }}
                        hideKeyboardAccessoryView={true}
                      />
                    </ScrollView>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    {/* image section */}
                    {/* {selectedImage.length > 0 ? (
                      <FlatList
                        data={selectedImageShow}
                        // @ts-ignore
                        renderItem={renderItemImage}
                        numColumns={3}
                      />
                    ) : (
                      <TouchableOpacity
                        style={{ flexDirection: 'row', marginTop: 15 }}
                        onPress={() => launchImageLibrary()}>
                        <Image
                          source={Images.addGallery}
                          style={{
                            height: 65,
                            width: 65,
                            tintColor: reCol().color.BDRCLR,
                          }}
                        />
                        <Text
                          style={[
                            styles.labelText,
                            {
                              marginBottom: 0,
                              marginTop: 0,
                              alignSelf: 'flex-start',
                            },
                          ]}>{`Bewerbungsunterlagen Datei(en)              auswählen (optional)`}</Text>
                      </TouchableOpacity>
                    )} */}
                    {selectedImage.length < 3 && selectedImage.length != 0 && (
                      <TouchableOpacity
                        style={{
                          alignSelf: 'center',
                          marginRight:
                            selectedImage.length === 1 ? '40%' : '10%',
                        }}
                        onPress={() => launchImageLibrary()}>
                        <Image
                          source={Images.addGallery}
                          style={{
                            height: 65,
                            width: 65,
                            tintColor: reCol().color.BDRCLR,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    {selectedImage.length >= 3 && selectedImage.length < 6 && (
                      <TouchableOpacity
                        style={{
                          alignSelf: 'flex-end',
                          position: 'absolute',
                          left:
                            selectedImage.length === 4
                              ? '40%'
                              : selectedImage.length === 3
                                ? '8%'
                                : '75%',
                          bottom: selectedImage.length === 3 ? '-40%' : '15%',
                        }}
                        onPress={() => launchImageLibrary()}>
                        <Image
                          source={Images.addGallery}
                          style={{
                            height: 65,
                            width: 65,
                            tintColor: reCol().color.BDRCLR,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      marginTop: selectedImage.length === 3 ? '30%' : 10,
                      alignItems: 'center',
                    }}
                    onPress={() => setIsChecked(!isChecked)}>
                    <Checkbox
                      isChecked={isChecked}
                      alignSelf={'center'}
                      value="1"
                      size={'lg'}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <Text
                      style={[
                        styles.labelText,
                        {
                          marginBottom: 0,
                          marginLeft: 10,
                          marginTop: 0,
                          fontSize: 13,
                        },
                      ]}>
                      {`Ich akzeptiere die elektronische Speicherung${'\n'}meiner Daten gemäß der  `}
                      <Text
                        style={[
                          styles.labelText,
                          {
                            marginTop: 0,
                            fontSize: 13,
                            textDecorationLine: 'underline',
                          },
                        ]}
                        onPress={() => setShowPrivacy(true)}>
                        Datenschutzrichtlinien.
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 50,
                      backgroundColor: isChecked
                        ? '#faa029ff'
                        : 'gray',
                      borderRadius: 10,
                      top: 15,
                      flexDirection: 'row',
                      marginBottom: selectedImage ? '50%' : 40,
                    }}
                    disabled={isChecked ? false : true}
                    activeOpacity={0.5}
                    onPress={handleSubmit(onSubmit)}>
                    <Image
                      source={require('../assets/images/sms-tracking.png')}
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
                      {'Bewerbung senden'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        ) : (
          <View style={styles.modalMainView}>
            <ScrollView>
              <View style={{ flex: 1, width: '95%', alignSelf: 'center' }}>
                <View style={styles.flexView}>
                  <Text style={styles.headingText}>{'Direktbewerbung'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSuccess(false), setVisibleAppointment(false);
                    }}>
                    <Image source={Images.modalClose} style={styles.closeImg} />
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.main,
                    { alignSelf: 'center', alignItems: 'center' },
                  ]}>
                  <Image
                    source={require('../assets/images/Successfull.jpeg')}
                    style={{ height: 200, width: 200 }}
                    resizeMode="contain"
                  />
                  <Text style={[styles.headingText, { marginTop: 30 }]}>
                    {'Glückwunsch!'}
                  </Text>
                  <Text style={styles.labelText}>
                    {'Deine Nachricht wurde erfolgreich gesendet.'}
                  </Text>
                </View>
                <Button
                  bgColor={'#8C65A3'}
                  _text={{
                    fontFamily: fontFamily.poppinsBold,
                    fontWeight: 'bold',
                  }}
                  size={'lg'}
                  onPress={() => {
                    setSuccess(false), setVisibleAppointment(false);
                  }}
                  style={{ marginTop: 15 }}
                  borderRadius={10}>
                  {'Zur Startseite'}
                </Button>
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
      {loading && <Loader />}
    </Modal>
  );
};
export const ModalJobPic: React.FC<ModalJobDetailImageProps> = ({
  visibleJobImage,
  setVisibleJobImage,
  imageData,
}) => {
  return (
    <Modal animationType="slide" visible={visibleJobImage} transparent={true}>
      <ScrollView contentContainerStyle={styles.modalBgView}>
        <View style={styles.modalMainView}>
          <View
            style={[
              styles.flexView,
              { flexDirection: 'column', alignItems: 'flex-end' },
            ]}>
            {/* <Text style={styles.headingText}>{'Jetzt direkt bewerben'}</Text> */}
            <TouchableOpacity onPress={() => setVisibleJobImage(false)}>
              <Image source={Images.modalClose} style={styles.closeImg} />
            </TouchableOpacity>
          </View>
          <View style={{ height: 400, marginHorizontal: 15 }}>
            <Image
              source={{ uri: Globals.BASE_URL + imageData }}
              resizeMode="cover"
              borderRadius={10}
              style={{ height: 400, width: '100%' }}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export const ModalIndustry: React.FC<ModalIndustryProps> = ({
  visibleIndustry,
  setVisibleIndustry,
}) => {
  return (
    <Modal animationType="slide" visible={visibleIndustry} transparent={true}>
      <View style={styles.modalBgView}>
        <View style={styles.modalIndustryView}>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View style={styles.flexView}>
                <Text style={styles.headingText}>Select Industry</Text>
                <TouchableOpacity onPress={() => setVisibleIndustry(false)}>
                  <Image source={Images.modalClose} style={styles.closeImg} />
                </TouchableOpacity>
              </View>
              <View style={styles.main}>
                <FlatList
                  data={industryFlatData}
                  renderItem={renderIndustrtyData}
                  showsVerticalScrollIndicator={false}
                />
                <Button
                  bgColor={'#8C65A3'}
                  _text={{
                    fontFamily: fontFamily.poppinsBold,
                    fontWeight: 'bold',
                  }}
                  size={'lg'}
                  onPress={() => { }}
                  style={{ marginTop: 15 }}
                  borderRadius={10}>
                  Appointment
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export const ModalLocation: React.FC<ModalLocationProps> = ({
  visibleLocation,
  setVisibleLocation,
}) => {
  const handleLocationSelect = (location: string) => {
    Globals.location = location;
    setVisibleLocation(false); // Close the modal after location selection
  };

  return (
    <Modal animationType="slide" visible={visibleLocation} transparent={true}>
      <View style={styles.modalBgView}>
        <View style={styles.modalIndustryView}>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View style={styles.flexView}>
                <Text style={styles.headingText}>Select Location</Text>
                <TouchableOpacity onPress={() => setVisibleLocation(false)}>
                  <Image source={Images.modalClose} style={styles.closeImg} />
                </TouchableOpacity>
              </View>
              <View style={styles.main}>
                <FlatList
                  data={locationFlatData}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleLocationSelect(item.name)}>
                      <View style={styles.renderView}>
                        <Text>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export const ModalSuccessfull: React.FC<ModalIndustryProps> = ({
  visibleIndustry,
  setVisibleIndustry,
}) => {
  return (
    <Modal animationType="slide" visible={visibleIndustry} transparent={true}>
      <View style={styles.modalBgView}>
        <View style={styles.modalIndustryView}>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View style={styles.flexView}>
                <Text style={styles.headingText}>Appointment Successful</Text>
                <TouchableOpacity onPress={() => setVisibleIndustry(false)}>
                  <Image source={Images.modalClose} style={styles.closeImg} />
                </TouchableOpacity>
              </View>
              <View style={styles.main}>
                <Image
                  source={require('../assets/images/correct.png')}
                  style={{ height: 100, width: 100 }}
                  resizeMode="contain"
                />
                <Text style={styles.headingText}>Yippieh!</Text>
                <Text style={styles.headingText}>Your Appointment Created</Text>

                <Button
                  bgColor={'#8C65A3'}
                  _text={{
                    fontFamily: fontFamily.poppinsBold,
                    fontWeight: 'bold',
                  }}
                  size={'lg'}
                  onPress={() => { }}
                  style={{ marginTop: 15 }}
                  borderRadius={10}>
                  Home
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBgView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000050',
  },
  modalMainView: {
    backgroundColor: reCol().color.WHITE,
    height: '92%',
    width: '100%',
    borderRadius: 20,
  },
  modalIndustryView: {
    backgroundColor: reCol().color.WHITE,
    height: '95%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  headingText: {
    // color: reCol().color.BDRCLR,
    color: '#222',
    fontFamily: fontFamily.poppinsBold,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeImg: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    tintColor: reCol().color.BDRCLR,
  },
  main: {
    marginHorizontal: 20,
    paddingBottom: '50%',
  },
  labelText: {
    color: reCol().color.BDRCLR,
    fontFamily: fontFamily.poppinsBold,
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 10,
  },
  txtInput: {
    marginTop: 15,
  },
  renderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
