import { endPoint, urlApi } from "@/utils/configuration";
import { create } from "apisauce";
import apiMonitor from "./monitor";
import setInterceptor from './interceptor';
const createMobileOtp = () => {
    const instanceMobile = create({
        baseURL: urlApi.DEVELOPMENT,
        timeout: 150000,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    instanceMobile.addMonitor(apiMonitor);
    setInterceptor(instanceMobile);
    const jobApi = (params) => instanceMobile.get(endPoint.job, params);
    const companyApi = (params) => instanceMobile.get(endPoint.company, params);
    const applyJob = (payload) => instanceMobile.post(endPoint.applyJob, payload);
    const addAppointment = (payload) => instanceMobile.post(endPoint.appointment, payload);
    const registerData = (payload) => instanceMobile.post(endPoint.register, payload);
    return {
        jobApi,
        companyApi,
        applyJob,
        addAppointment,
        registerData,
    }
}
export default { createMobileOtp }