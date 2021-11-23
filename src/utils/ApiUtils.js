
import security from './EncryptionDecryption'

const request = (options) => {
    const headers = new Headers();
    if (options.multipart === undefined) {
        headers.append('Content-Type', 'application/json')
        headers.append( "Access-Control-Allow-Origin", "*");
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);
    return fetch(options.url, options)
        .then(response =>

            response.json().then(json => {

                if (!response.ok) {
                    return Promise.reject(security.decrypt(json.data));
                }
                return security.decrypt(json.data);
            })
        );
};
export default request;
