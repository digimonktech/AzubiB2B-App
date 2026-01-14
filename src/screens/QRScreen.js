import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';

export default function QRScanner() {
    const navigation = useNavigation();
    const device = useCameraDevice('back');
    const scannedRef = useRef(false);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (scannedRef.current) return;

            const value = codes[0]?.value;
            console.log('scan value:', value);

            if (!value) return;

            // Extract companyId manually (RN-safe)
            const match = value.match(/companyId=([^&]+)/);

            if (match && match[1]) {
                scannedRef.current = true;

                const companyId = match[1];

                navigation.navigate('Tabs', {
                    screen: 'Aktuelle Jobs',
                    params: {
                        companyId,
                        fromQR: true,
                    },
                });


            } else {
                console.log('companyId not found in QR');
            }
        },
    });



    useEffect(() => {
        Camera.requestCameraPermission();
    }, []);

    if (!device) return null;

    return (
        <View style={StyleSheet.absoluteFill}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />

            {/* close X */}
            {/* close X */}
            <Pressable
                onPress={() => navigation.goBack()}
                style={styles.closeBtn}
            >
                <Text style={styles.closeText}>X</Text>
            </Pressable>


            {/* Overlay */}
            <View style={styles.overlay}>
                <View style={styles.scanBox} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanBox: {
        width: 240,
        height: 240,
        borderWidth: 2,
        borderColor: '#00FF88',
        borderRadius: 12,
    },

    closeBtn: {
        position: 'absolute',
        top: 40,        // status bar ke niche
        right: 25,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeText: {
        color: 'white',
        fontSize: 28,
        fontWeight: '400',
    },


});
