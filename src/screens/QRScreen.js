import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

export default function QRScanner() {
    const navigation = useNavigation();
    const device = useCameraDevice('back');
    const scannedRef = useRef(false);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (scannedRef.current) return;

            const value = codes[0]?.value;
            if (value) {
                scannedRef.current = true;
                console.log('SCANNED:', value);
                navigation.goBack();
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
});
