import url from "../../constant/index";
import request from "../../utils/ApiUtils"

const API_BASE_URL = url + "/files";

class DocumentService {

    upload_file(event_id, data) {
        
        return request({
            url: API_BASE_URL + "/upload/" + event_id,
            method: 'POST',
            body: data
        });
    }

    downloadFiles(data) {
        return request({
            url: API_BASE_URL + "/downloadfiles",
            method: 'POST',
            body:JSON.stringify(data)
        });
    }
    getFiles(id) {
        return request({
            url: API_BASE_URL + "/uploadedfiles/" + id,
            method: 'POST',
        });
    }

    deleteFile(id) {
        return request({
            url: API_BASE_URL + "/deletefiles/" + id,
            method: 'POST',
        });

    }


}

export default new DocumentService();