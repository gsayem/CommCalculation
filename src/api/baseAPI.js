import fetch from 'node-fetch'

/**
 * API GET, POST, PUT, DELETE;
 * We only need GET for now.
 */
export class BaseApi {
    constructor() {

    }
    /**
     * Get call     
     */
    async get(url) {
        return await fetch(url, {
            method: 'GET'
        }).then(res => {
            return res.json();
        });
    }
}
