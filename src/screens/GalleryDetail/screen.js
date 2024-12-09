import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import BackHeader from '@/component/BackHeader';
import Globals from '@/utils/Globals';

const GalleryDetails = (props) => {
    const { navigation, route } = props;
    const { galleryData } = route.params;
    console.log('GalleryData', galleryData.images);
    const [visibleLocation, setVisibleLocation] = useState(false);
    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader title={'JobWall'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);
    return (
        <View style={{ flex: 1, marginTop: 15, marginHorizontal: 15 }}>
            <Image source={{ uri: Globals.BASE_URL + galleryData?.images[0]?.path }}
                style={{ height: '90%', width: '100%' }}
                resizeMode='cover' borderRadius={15} />
        </View>
    )
}

export default GalleryDetails

const styles = StyleSheet.create({})