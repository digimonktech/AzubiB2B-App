
import { Images } from "@/assets/images/images";
import { fontFamily, reCol } from "@/utils/configuration";
import React, { useEffect, useState } from "react"
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { getApiCall } from "@/utils/ApiHandler";
import Loader from "./Loader";
import { useCity } from "@/Context/CityProvider";
import { useSelector } from "react-redux";


export const ModalLocation = ({ visibleLocation, setVisibleLocation, navigation }) => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedLocationName, setSelectedLocationName] = useState([]);
    const { setCity, selectedCityId, setVisible} = useCity();
    const comId = useSelector(
        (state) => state.companyId?.companyId
    );
    const getLocation = async () => {
        try {
            setLoading(true);
            let res = await getApiCall({ url: 'admin/cities', params: { companyId: comId } });
            if (res.status == 200) {
                const newData = [{ _id: '', name: 'Alle' }, ...res?.data.cities];
                setContent(newData);
                setVisible(res?.data?.cities[0].companyId?.cityStatus);
            }
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getLocation();
        setSelectedLocation(selectedCityId)
    }, [visibleLocation]);



    const handleCitySelection = () => {
        setCity(selectedLocationName, selectedLocation);
        // console.log('SKSKSKSKSKSKSK', selectedLocation)
        setVisibleLocation(false);
        navigation ? navigation.navigate('Aktuelle Jobs') : null
    };


    const handleCheckboxChange = (item, isChecked) => {
        if (item?._id === '') {
            // Check or uncheck all other items based on the special item's state
            const allItemIds = content.map((item) => item._id);
            const allItemNames = content.map((item) => item.name);

            setSelectedLocation(isChecked ? allItemIds : []);
            setSelectedLocationName(isChecked ? allItemNames : []);
        } else {
            // Update the selected items based on the checkbox state
            setSelectedLocation((prevSelected) => {
                if (isChecked) {
                    const newSelected = [...prevSelected, item?._id];
                    // Check if all individual items are selected, and if so, select the "All" checkbox
                    if (newSelected.length === content.length - 1) {
                        return ['', ...newSelected];
                    }
                    return newSelected;
                } else {
                    // If deselecting an item, remove it from the selected locations
                    // and deselect the "All" checkbox if necessary
                    const newSelected = prevSelected.filter((id) => id !== item?._id);
                    if (newSelected.includes('')) {
                        return newSelected.filter((id) => id !== '');
                    }
                    return newSelected;
                }
            });

            setSelectedLocationName((prevSelectedNames) => {
                if (isChecked) {
                    const newSelectedNames = [...prevSelectedNames, item?.name];
                    // Check if all individual items are selected, and if so, add 'All' to the names list
                    if (newSelectedNames.length === content.length - 1) {
                        return ['Alle', ...newSelectedNames];
                    }
                    return newSelectedNames;
                } else {
                    // If deselecting an item, remove it from the selected names list
                    const newSelected = prevSelectedNames.filter((name) => name !== item?.name);
                    if (newSelected.includes('Alle')) {
                        return newSelected.filter((name) => name !== 'Alle')
                    }
                    return newSelected;
                }
            });
        }
    };
    const renderItem = (item) => {
        const isChecked = selectedLocation.includes(item.item._id);
        return (
            <TouchableOpacity onPress={() => handleCheckboxChange(item.item, !isChecked)}>
                <View style={styles.renderView}>
                    <Text style={{ fontFamily: fontFamily.poppinsMedium, fontSize: 16, color: 'black' }}>{item.item.name}</Text>
                    <Image source={isChecked ? Images.checkedIcon : Images.unCheckedIcon}
                        style={{ height: 20, width: 20 }}
                    />
                </View>

            </TouchableOpacity>
        )
    }
    const resetFilter = () => {
        setSelectedLocation([]);
        setSelectedLocationName([]);
    }
    return (
        <Modal animationType="slide" visible={visibleLocation} transparent={true}>
            <View style={styles.modalBgView}>
                <View style={styles.modalIndustryView}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.flexView}>
                            <Text style={styles.headingText}>{'Region wählen'}</Text>
                            <TouchableOpacity onPress={() => setVisibleLocation(false)}>
                                <Image source={Images.modalClose} style={styles.closeImg} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.main}>
                            <FlatList
                                data={content}
                                renderItem={renderItem}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                        {selectedLocation.length > 0 &&
                            <View style={{
                                alignSelf: 'center',
                                alignItems: 'center', justifyContent: 'center', bottom: '13%',
                                position: 'absolute', width: '97%'
                            }}>
                                <TouchableOpacity onPress={() => resetFilter()} style={{
                                    height: 50, alignItems: 'center',
                                    justifyContent: 'center', width: '97%'
                                }}>
                                    <Text style={{ fontFamily: fontFamily.poppinsMedium, fontSize: 16, color: 'black' }}>{'Filter zurücksetzen'}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <TouchableOpacity style={{
                            width: '95%', alignSelf: 'center',
                            alignItems: 'center', justifyContent: 'center',
                            height: 50, backgroundColor: reCol().color.BTNCOLOR,
                            borderRadius: 10, bottom: '5%',
                            position: 'absolute'
                        }}
                            activeOpacity={0.5} onPress={() => { handleCitySelection() }}>
                            <Text style={{ fontFamily: fontFamily.poppinsRegular, fontSize: 16, color: '#fff' }}>{'Auswahl speichern'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {loading && <Loader />}

        </Modal>
    );
};

const styles = {
    modalBgView: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#00000050"
    },
    modalMainView: {
        backgroundColor: reCol().color.WHITE,
        height: '92%',
        width: '100%',
        borderRadius: 20,
    },
    modalIndustryView: {
        backgroundColor: reCol().color.WHITE,
        height: '90%',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    flexView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginHorizontal: 20,
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center'
    },
    headingText: {
        color: reCol().color.BDRCLR,
        fontFamily: fontFamily.poppinsBold,
        fontSize: 20,
        fontWeight: 'bold'
    },
    closeImg: {
        height: 30,
        width: 30,
        alignSelf: 'flex-end',
        tintColor: reCol().color.BDRCLR
    },
    main: {
        // marginHorizontal: 20
        width: '88%',
        height: '70%',
        alignSelf: 'center'
    },
    labelText: {
        color: reCol().color.BLACK,
        fontFamily: fontFamily.poppinsBold,
        fontSize: 15,
        // fontWeight: '500',
        marginTop: 10,
        marginBottom: 10
    },
    txtInput: {
        marginTop: 15,
    },
    renderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    }
};