import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import MainHeader from '@/component/MainHeader';

const CompanyJobWall = () => {
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader title={'Job Wall'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);
    return (
        <View>
            <Text>Job Wall</Text>
        </View>
    )
}

export default CompanyJobWall

const styles = StyleSheet.create({})