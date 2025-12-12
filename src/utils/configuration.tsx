import {
  colorDynamic1,
  colorDynamic2,
  manageEmail,
  manageSavedJob,
} from '@/screens/SplashScreen';

export const fontFamily = {
  poppinsRegular: 'Poppins-Regular',
  poppinsMedium: 'Poppins-Medium',
  poppinsSeBold: 'Poppins-SemiBold',
  poppinsBold: 'Poppins-Bold',
  poppinsLight: 'Poppins-Light',
  poppinsThin: 'Poppins-Thin',
  NunitoBold: 'Nunito-Bold',
};
export const validationMessage = {
  mobile: 'Please enter Mobile number',
  otp: 'Please enter otp',
  mobileLength: 'Please enter valid mobile number',
  otpLength: 'Please enter valid otp',
};
export const screenName = {
  SPLASHSCREEN: 'SplashScreen',
  REGISTER: 'Register',
  NOTIFICATION: 'Notification',
  TAB: 'My Data',
  JOBS: 'Jobs',
  DASHBOARD: 'Dashboard',
  COMPANIES: 'Companies',
  DETAILSJOB: 'DetailsJob',
  DETAILSCOMPANY: 'DetailsCompany',
};
export const urlApi = {
  // DEVELOPMENT: 'http://digimonk.net:2751/api/v1/',
  DEVELOPMENT: 'https://azubi.api.digimonk.net/api/v1/',
  DEVELOPMENTIMAGE: 'https://api.azubiregional.de/',
};
export const endPoint = {
  job: 'job',
  company: 'employer/get-all-emp-frontend',
  applyJob: 'admin/application',
  appointment: 'employer/add-appoinment',
  register: 'admin/register-form',
};
export const reCol = () => {
  const color = {
    BLACK: 'black',
    WHITE: 'white',
    RED: 'red',
    BDRCLR: colorDynamic1,
    BTNCOLOR: colorDynamic2,
    EMLCLR: manageEmail,
    HRTCLR: manageSavedJob,
  };
  return {
    color,
  };
};
