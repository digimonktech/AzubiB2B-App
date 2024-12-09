import * as yup from "yup"

export const registerSchema = yup.object({
    Email: yup.string().email().required('Pflichtfeld, bitte ausfüllen'),
    Name: yup.string().required('Pflichtfeld, bitte ausfüllen'),
    Mobile: yup.string().notRequired(),
    About: yup.string().required('Bitte fülle noch das Nachrichtenfeld aus.'),
})