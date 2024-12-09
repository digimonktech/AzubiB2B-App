// BottomSheetComponent.js
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";

const LocationList = ({ isVisible, onClose }) => {
    const bottomSheetRef = useRef();

    const openBottomSheet = () => {
        bottomSheetRef.current.open();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current.close();
    };

    const data = [
        { id: '1', title: 'Item 1' },
        { id: '2', title: 'Item 2' },
        { id: '3', title: 'Item 3' },
        // Add more items as needed
    ];

    const renderItem = ({ item }) => (
        <View style={{ padding: 8 }}>
            <Text>{item.title}</Text>
        </View>
    );

    return (
        <RBSheet
            ref={bottomSheetRef}
            height={300}
            closeOnDragDown={true}
            openDuration={250}
            customStyles={{
                container: {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                },
            }}
        >
            <View style={{ padding: 16, backgroundColor: 'white' }}>
                <Text>Hello Bottom Sheet!</Text>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />

                <TouchableOpacity onPress={onClose}>
                    <Text>Close Bottom Sheet</Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    );
};

export default LocationList;
