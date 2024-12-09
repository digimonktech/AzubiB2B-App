export default (api) => {
    api.axiosInstance.interceptors.response.use(
        (response) => {
            if (__DEV__) {

            }
            return { data: response.data, status: true };
        },

        (error) => {
            if (__DEV__) {
            }
            return { data: error?.response?.data ?? "", status: false }
        },
    );
};