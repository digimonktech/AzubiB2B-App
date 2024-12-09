import { Images } from "@/assets/images/images";
import BackHeader from "@/component/BackHeader";
import { ModalLocation } from "@/component/ModalLocation";
import { getApiCall } from "@/utils/ApiHandler";
import { color, fontFamily } from "@/utils/configuration";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Text, ImageBackground } from "react-native";
import RenderHTML from "react-native-render-html";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


export default function AboutUs({ navigation, route }) {
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState([]);
    const { headerName } = route.params;
    const tagsStyle = {
        h2: {
            color: 'black',
            fontWeight: 'bold'
        },
        p: {
            color: 'black'
        },
        h3: {
            color: 'black'
        }
    }
    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.main1}>
                    <Text style={styles.landText}>{'Verwirklichen Sie Ihren Traumjob mit'}
                        <Text style={styles.fTxt}> A</Text>
                        <Text style={styles.azubiTxt}>zubi</Text>
                    </Text>
                    <RenderHTML tagsStyles={tagsStyle} source={{ html: item?.termsConditions }} />
                </View>
            </View >
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
            let res = await getApiCall({ url: 'manage_content' });
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
                            <SkeletonPlaceholder.Item marginTop={10} width="100%" height={50} />

                            <SkeletonPlaceholder.Item marginTop={10} width="100%" height={50} />
                            <SkeletonPlaceholder.Item marginTop={10} width="100%" height={100} />

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
        backgroundColor: color.WHITE,
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
        color: color.BLACK,
        fontFamily: fontFamily.poppinsBold,
        fontSize: 25,
    },
    fTxt: {
        color: color.BTNCOLOR,
    },
    azubiTxt: {
        color: color.BDRCLR,
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