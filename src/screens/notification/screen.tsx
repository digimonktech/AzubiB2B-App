import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Images } from '@/assets/images/images'
import Header from '@/component/Header'
import { color, fontFamily } from '@/utils/configuration'
import { Divider } from 'native-base'

const Notification = () => {
    interface FlatDataNoti {
        id: number;
        desc: string;
        name: string;
        time: string;
    }
    const flatData: FlatDataNoti[] = [
        { id: 1, name: 'Loreum epsum', desc: 'Loreum epsum sit dolar emit endum.', time: '2 min ago' },
        { id: 2, name: 'Loreum epsum', desc: 'Loreum epsum sit dolar emit endum.', time: '2 min ago' },
        { id: 3, name: 'Loreum epsum', desc: 'Loreum epsum sit dolar emit endum.', time: '2 min ago' },
        { id: 4, name: 'Loreum epsum', desc: 'Loreum epsum sit dolar emit endum.', time: '2 min ago' },
        { id: 5, name: 'Loreum epsum', desc: 'Loreum epsum sit dolar emit endum.', time: '2 min ago' },
        { id: 6, name: 'Loreum epsum', desc: 'Loreum epsum sit dolar emit endum.', time: '2 min ago' },
    ];
    const renderNoti = ({ item }: { item: FlatDataNoti }) => {
        const { name, desc, time } = item;
        return (
            <>
                <View style={styles.renderView}>
                    <View>
                        <Text style={styles.renderName}>{name}</Text>
                        <Text style={styles.renderDesc}>{desc}</Text>
                    </View>
                    <Text style={styles.renderDate}>{time}</Text>
                </View>
                <View style={{ marginHorizontal: 20 }}>
                    <Divider />
                </View>
            </>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground style={styles.container} source={Images.bgImage}>
                <Header title='Notification' isBack />
                <FlatList
                    data={flatData}
                    renderItem={renderNoti}
                    showsVerticalScrollIndicator={false}
                />
            </ImageBackground>
        </SafeAreaView>
    )
}

export default Notification

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    renderView: {
        marginHorizontal: 15,
        paddingHorizontal: 15,
        marginVertical: 15,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    renderName: {
        color: color.BDRCLR,
        fontFamily: fontFamily.poppinsSeBold,
        fontWeight: '400',
        marginBottom: 10,
        fontSize: 15
    },
    renderDesc: {
        color: color.BLACK,
        fontFamily: fontFamily.poppinsRegular,
        fontWeight: '300',
        marginBottom: 10,
        fontSize: 12
    },
    renderDate: {
        color: color.BLACK,
        fontFamily: fontFamily.poppinsRegular,
        fontWeight: '300',
        marginBottom: 10,
        alignSelf: 'center',
        fontSize: 12
    }
})