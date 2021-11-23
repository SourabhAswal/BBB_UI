import url from "../../constant/index";
import request from "../../utils/ApiUtils"
const API_BASE_URL = url ;

class DocumentService {

    postSurvey(survey) {
       
        return request({
            url: API_BASE_URL+ "/survey" ,
            method: 'POST',
            body: JSON.stringify(survey)
        });
    }
getSuggestion(email){
    return request({
        url: API_BASE_URL+ "/getSuggestion" ,
        method: 'POST',
        body: JSON.stringify(email)
    });
}
   
}

export default new DocumentService();