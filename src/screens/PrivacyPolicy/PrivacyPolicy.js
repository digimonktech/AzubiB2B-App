import { Images } from "@/assets/images/images";
import BackHeader from "@/component/BackHeader";
import { ModalLocation } from "@/component/ModalLocation";
import { getApiCall, getApiCall1, postApiCall } from "@/utils/ApiHandler";
import { fontFamily, reCol } from "@/utils/configuration";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Text, ImageBackground } from "react-native";
import RenderHtml from 'react-native-render-html';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


export default function PrivacyPolicy({ navigation, route }) {
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState([]);
    const { headerName } = route.params;
    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.main1}>
                    <Text style={styles.landText}>{'Allgemeine Geschäftsbedingungen'}</Text>
                    <RenderHtml style={styles.detailTxt} source={{ html: content?.privacyPolicy }} />

                </View>
            </View>
        )
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title={headerName} press={() => setVisibleLocation(true)} />,
        });
    }, [navigation]);





    const ContentData = async () => {
        try {
            setLoading(true);
            let res = await getApiCall1({ url: 'manage_content' });
            console.log('privacy res => ', res);
            
            if (res.status == 200) {
                setContent(res?.data)
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        ContentData();
    }, []);





    const SkeletonLoader = () => {
        return (
            <View>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 10, height: '100%' }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item width="80%" height={20} />
                            </SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item marginTop={10} width="100%" height={50} />
                            <SkeletonPlaceholder.Item marginTop={10} width="100%" height={50} />
                        </SkeletonPlaceholder>
                    </SkeletonPlaceholder>

                </SkeletonPlaceholder>
            </View>
        );
    };


    return (

        <View style={{ flex: 1, alignItems: 'center' }}>
            <ImageBackground source={Images.bgImage} style={{ height: '100%', width: '100%' }}>
                {loading ?
                    <FlatList
                        data={[1]}
                        renderItem={SkeletonLoader}
                        keyExtractor={index => index.toString()}
                    />
                    :
                    <FlatList
                        data={[content]}
                        renderItem={renderItem}
                        keyExtractor={index => index.toString()}
                    />
                }
                {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        paddingHorizontal: 20,
        marginHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: reCol().color.WHITE,
        borderRadius: 10,
    },
    main1: {
        marginHorizontal: 20,
        marginVertical: 10
    },
    midSpace: {
        marginTop: 15,
    },
    buttonView: {
        marginTop: 15,
        justifyContent: 'flex-end',
        backgroundColor: '#8C65A3',
        borderRadius: 10

    },
    buttonStyle: {
        borderRadius: 10
    },
    btnText: {
        fontFamily: fontFamily.poppinsBold
    },
    welText: {
        color: '#4E4D4D',
        fontFamily: fontFamily.NunitoBold,
        fontSize: 15,
    },
    landText: {
        marginTop: 15,
        color: reCol().color.BLACK,
        fontFamily: fontFamily.poppinsBold,
        fontSize: 25,
    },
    fTxt: {
        color: reCol().color.BTNCOLOR,
    },
    azubiTxt: {
        color: reCol().color.BDRCLR,
    },
    detailTxt: {
        marginTop: 15,
        color: '#4E4D4D',
        fontFamily: fontFamily.poppinsLight,
        fontSize: 15,
    },
    txtSize: {
        fontSize: 14,
        fontFamily: fontFamily.poppinsRegular,
        color: '#000',
    }
})