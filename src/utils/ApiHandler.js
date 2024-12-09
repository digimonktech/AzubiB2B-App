import Globals from '../utils/Globals';
import axios from 'axios';
import { Alert } from 'react-native';
// Call post Api
export function postApiCall(param) {
  var url = param.url;
  var json = param.json;
  return axios
    .post(Globals.API_URL.concat(url), json)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error.toJSON().message === 'Network Error') {
        alert('no internet connection');
      }
      return error;
    });
}

export function postCall(param) {
  var url = param.url;
  var json = param.json;
  return axios
    .post(Globals.API_URL.concat(url), json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Globals.token,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error.toJSON().message === 'Network Error') {
        alert('no internet connection');
      }
      return error;
    });
}

export function getApiCall(param) {
  var url = param.url;
  return axios
    .get(Globals.API_URL.concat(url), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Globals.token,
      },
    })
    .then(response => {

      return response.data;
    })
    .catch(error => {
      if (error == 'AxiosError: Network Error') {
        Alert.alert('Network Connection Failed');
      }
      return error;
    });
}

export function patchApiCall(param) {
  var url = param.url;
  var json = param.json;
  return axios
    .patch(Globals.API_URL.concat(url), json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Globals.token,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error.toJSON().message === 'Network Error') {
        alert('no internet connection');
      }
      return error;
    });
}
