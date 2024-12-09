import * as yup from "yup"

export const applySchema = yup.object({
    Email: yup.string().email('Pflichtfeld, bitte gültige E-Mail angeben.').required('Pflichtfeld, bitte ausfüllen.'),
    Name: yup.string().required('Pflichtfeld, bitte ausfüllen.'),
    Mobile: yup.string().notRequired(),
    About: yup.string().notRequired(),
    Cover: yup.string().required(),
})