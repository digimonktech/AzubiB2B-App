import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Spinner } from 'native-base'
import { color, fontFamily } from '@/utils/configuration'

const Loader = () => {
    return (
        <View style={styles.container}>
            <Spinner color='black' />
            <Text style={styles.txt}>Loading</Text>
        </View>
    )
}

export default Loader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    txt: {
        fontFamily: fontFamily.poppinsRegular,
        fontWeight: '400',
        color: color.BLACK,
        fontSize: 15,
        paddingLeft: 10
    }
})