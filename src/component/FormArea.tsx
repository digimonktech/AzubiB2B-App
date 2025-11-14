import { FormControl, Input, TextArea, WarningOutlineIcon } from 'native-base'
import React from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { TextInput, ViewStyle } from 'react-native';

type Props<T extends FieldValues> = {
    children?: React.ReactNode,
    placeholder?: string,
    label?: string,
    height?: number,
    style?: ViewStyle,
    disable?: boolean,
    borderColor?: string,
    backgroundColor?: string;
} & UseControllerProps<T>

function TextAreaInput<T extends FieldValues = any>(props: Props<T>) {
    const { fieldState, field } = useController(props)

    return (
        <FormControl isInvalid={!!fieldState.error?.message}>
            {props.label && <FormControl.Label>{props.label}</FormControl.Label>}
            {
                props.children ?
                    props.children : (
                        // <TextArea
                        //     placeholder={props.placeholder}
                        //     onChangeText={field.onChange}
                        //     value={field.value}
                        //     returnKeyType='done'
                        //     onBlur={field.onBlur}
                        //     h={props.height}
                        //     backgroundColor={props.backgroundColor ? props.backgroundColor : 'transparent'}
                        //     borderRadius={10}
                        //     borderColor={props.borderColor ? props.borderColor : 'black'}
                        //     style={props.style}
                        //     autoCompleteType={'off'}
                        // />

                        <TextInput 
                            placeholder={props.placeholder}
                            onBlur={field.onBlur}
                            onChangeText={field.onChange}
                            value={field.value}
                            multiline={true}
                            numberOfLines={4}
                            style={{
                                textAlignVertical: 'top',
                                height: props.height ? props.height : 100,
                                backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
                                borderRadius: 10,
                                borderColor: props.borderColor ? props.borderColor : 'black',
                                borderWidth: 1,
                                padding: 10,
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

export default TextAreaInput