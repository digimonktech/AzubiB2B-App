import { Images } from "@/assets/images/images";
import BackHeader from "@/component/BackHeader";
import { ModalLocation } from "@/component/ModalLocation";
import { getApiCall } from "@/utils/ApiHandler";
import { color, fontFamily } from "@/utils/configuration";
import React, { useState } from "react";
import { StyleSheet, View, FlatList, Text, SafeAreaView, ImageBackground } from "react-native";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function ApplicationTips({ navigation, route }) {
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const { headerName } = route.params;

    React.useEffect(() => {
        getApplicationTips();
    }, []);


    const getApplicationTips = async () => {
        try {
            setLoading(true);
            let res = await getApiCall({ url: 'tips/get_all_tips?searchValue=&pageNo=1&recordPerPage=100' });
            if (res.success == true) {
                setData(res?.data?.data);
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    };



    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.main1}>
                    <Text style={styles.landText}>{item?.title}</Text>
                    <Text style={styles.detailTxt}>{item?.description}</Text>
                </View>
            </View>
        )
    }


    const renderSkeletonItem = () => {
        return (
            <View style={styles.main2}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width="100%" height={50} borderRadius={10} marginBottom={10} />
                        <SkeletonPlaceholder.Item width="100%" height={80} borderRadius={10} />
                    </SkeletonPlaceholder>
                </SkeletonPlaceholder>
            </View>
        );
    }


    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title={headerName} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);
    return (

        <SafeAreaView style={{ flex: 1, alignItems: 'center', top: 10 }}>
            <ImageBackground source={Images.bgImage} style={{ width: '100%', height: '100%' }}>

                {loading ?
                    <FlatList
                        data={[1, 1, 1, 1]}
                        renderItem={renderSkeletonItem}
                        keyExtractor={(_, index) => index.toString()}
                    />
                    :
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                    />
                }
                {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}
            </ImageBackground>
        </SafeAreaView>
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
        backgroundColor: color.WHITE,
        borderRadius: 10,
    },
    main1: {
        width: '90%',
        padding: 5,
        borderWidth: 1,
        borderColor: color.BDRCLR,
        alignSelf: "center",
        borderRadius: 10,
        marginBottom: 10
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
        marginTop: 5,
        color: color.BDRCLR,
        fontFamily: fontFamily.poppinsRegular,
        fontSize: 14,
    },
    fTxt: {
        color: color.BTNCOLOR,
    },
    azubiTxt: {
        color: color.BDRCLR,
    },
    detailTxt: {
        marginTop: 5,
        color: '#4E4D4D',
        fontFamily: fontFamily.poppinsLight,
        fontSize: 12,
    },
    txtSize: {
        fontSize: 14,
        fontFamily: fontFamily.poppinsRegular,
        color: '#000',
    },
    main2: {
        width: '90%',
        padding: 5,
        alignSelf: "center",
        borderRadius: 10,
        marginBottom: 10
    },
})