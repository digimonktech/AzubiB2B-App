import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InfoBox = () => {
    return (
        <View style={styles.container}>
            <Text>InfoBox</Text>
        </View>
    )
}

export default InfoBox

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})