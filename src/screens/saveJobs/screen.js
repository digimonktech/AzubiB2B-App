import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { color, fontFamily } from '@/utils/configuration'
import { Images } from '@/assets/images/images'
import SaveJobListing from './saveJobListing'
import ApplicationSentListing from './applicationSentListing'
import MainHeader from '@/component/MainHeader'
import { ModalLocation } from '@/component/ModalLocation'

const SaveJobs = ({ navigation }) => {
    const [selected, setSelected] = useState(0);
    const [visibleLocation, setVisibleLocation] = useState(false);
    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader title={'Meine Jobs'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);
    return (
        <View style={styles.container}>
            <ImageBackground source={Images.bgImage} style={styles.container}>
                <View style={styles.tabView}>
                    <TouchableOpacity onPress={() => setSelected(0)} style={[styles.touchStyle, { backgroundColor: selected === 0 ? '#2894A2' : 'white' }]}>
                        <Text style={[styles.tabText, { color: selected === 0 ? 'white' : 'gray' }]}>Gespeichert</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected(1)} style={[styles.touchStyle, { backgroundColor: selected === 1 ? '#2894A2' : 'white' }]}>
                        <Text style={[styles.tabText, { color: selected === 1 ? 'white' : 'gray' }]}>Bewerbungen</Text>
                    </TouchableOpacity>
                </View>
                {selected === 0 ? <SaveJobListing /> : <ApplicationSentListing />}
            </ImageBackground>
            {ModalLocation({ visibleLocation: visibleLocation, setVisibleLocation: setVisibleLocation })}
        </View>
    )
}

export default SaveJobs

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabView: {
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        height: 50,
        alignItems: 'center',
        backgroundColor: color.WHITE,
        justifyContent: 'space-around',
        borderBottomColor: 'gray'
    },
    tabText: {
        fontSize: 15,
        fontFamily: fontFamily.poppinsRegular,
    },
    touchStyle: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignItems: 'center'
    }
})