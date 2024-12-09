export default class SharedManager {
    static myInstance = null;
    token = '';

    /**
     * @returns {SharedManager}
     */
    static getInstance() {
        if (SharedManager.myInstance == null) {
            SharedManager.myInstance = new SharedManager();
        }

        return this.myInstance;
    }
    getToken() {
        return this.token;
    }
    setToken(token) {
        this.token = token;
    }
}