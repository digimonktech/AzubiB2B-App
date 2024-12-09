import { endPoint, urlApi } from '@/utils/configuration';
import { create } from 'apisauce';
import SharedManager from './sharedManager';
import setInterceptor from './interceptor';
import apiMonitor from './monitor';
const createApiClient = () => {
    const instance = create({
        baseURL: urlApi.DEVELOPMENT,
        timeout: 150000,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + SharedManager.getInstance().getToken()
        }
    })
    instance.addMonitor(apiMonitor);
    setInterceptor(instance);
    const registerUserDetails = (payload) => instance.post(endPoint.register, payload);
    return {
        registerUserDetails,
    }
}
export default { createApiClient };