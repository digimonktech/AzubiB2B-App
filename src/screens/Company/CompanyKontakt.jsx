import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import MainHeader from '@/component/MainHeader';

const CompanyKontakt = () => {
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader title={'Kontakt'} press={() => { setVisibleLocation(true) }} />,
        });
    }, [navigation]);
    return (
        <View>
            <Text>Kontakt</Text>
        </View>
    )
}

export default CompanyKontakt

const styles = StyleSheet.create({})