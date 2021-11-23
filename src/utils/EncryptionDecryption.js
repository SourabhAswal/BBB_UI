
import CryptoJS from 'crypto-js';

const KEY="REALCODERZ123456"
class EncryptionDecryption{


	decrypt=(data)=> {
		
		if (data !== undefined) {
			const iv = CryptoJS.enc.Utf8.parse(KEY);
			const key = CryptoJS.enc.Utf8.parse(KEY);
			var result = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(data) }, key, {
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});
			return JSON.parse(result.toString(CryptoJS.enc.Utf8));
		}
	}
encrypt=(data) =>{
	
    if (data !== undefined) {
        const iv = CryptoJS.enc.Utf8.parse(KEY);
        const key = CryptoJS.enc.Utf8.parse(KEY);
        var result = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        return result.toString(CryptoJS.enc.Utf8);
    }
}

}
export default new EncryptionDecryption();