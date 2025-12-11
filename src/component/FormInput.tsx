import { FormControl, WarningOutlineIcon } from 'native-base'
import React from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { TextStyle, ViewStyle, KeyboardTypeOptions, TextInput } from 'react-native';

type Props<T extends FieldValues> = {
    children?: React.ReactNode,
    placeholder?: string,
    label?: string,
    leftImage?: React.JSX.Element,
    style?: ViewStyle | TextStyle,
    disable?: boolean,
    borderColor?: string,
    backgroundColor?: string,
    variant?: string;
    type?: KeyboardTypeOptions;
    Valuelen?: number;
} & UseControllerProps<T>

function FormInput<T extends FieldValues = any>(props: Props<T>) {
    console.log('FprmInput props ', props.variant);

    const { fieldState, field } = useController(props)

    return (
        <FormControl isInvalid={!!fieldState.error?.message}>
            {props.label && <FormControl.Label>{props.label}</FormControl.Label>}
            {
                props.children ?
                    props.children : (
                        // <Input
                        //     // placeholder={props.placeholder}
                        //     // onBlur={field.onBlur}
                        //     onChangeText={field.onChange}
                        //     // variant={props.variant ? props.variant : null}
                        //     // value={field.value}
                        //     // returnKeyType='done'
                        //     // backgroundColor={props.backgroundColor ? props.backgroundColor : 'transparent'}
                        //     // borderRadius={10}
                        //     // isReadOnly={props.disable === true ? true : false}
                        //     // borderColor={props.borderColor ? props.borderColor : 'black'}
                        //     // size={'xl'}
                        //     // InputLeftElement={props.leftImage}
                        //     // style={props.style}
                        //     // keyboardType={props.type}
                        //     // maxLength={props.Valuelen}
                        // />
                        <TextInput
                            placeholder={props.placeholder}
                            onBlur={field.onBlur}
                            onChangeText={field.onChange}
                            value={field.value}
                            style={{
                                backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
                                borderRadius: 10,
                                borderColor: props.borderColor ? props.borderColor : 'black',
                                borderWidth: 1,
                                padding: 10,
                                paddingHorizontal: 15,
                                ...props.style
                            }}
                        />
                    )
            }

            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {fieldState.error?.message && fieldState.error.message}
            </FormControl.ErrorMessage>
        </FormControl>
    )
}

export default FormInput