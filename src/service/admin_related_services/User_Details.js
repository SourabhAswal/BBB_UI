import url from "../../constant/index";
import request from "../../utils/ApiUtils"
const API_BASE_URL = url + "/users";
class UserService {

    get_Registered_Users() {
        return request({
            url: API_BASE_URL + "/registered_users",
            method: 'POST',
        });
    }

    get_LoggedIn_Users() {
        return request({
            url: API_BASE_URL + "/loggedin_users",
            method: 'POST',
        });
    }

    get_Feedbacks() {
        return request({
            url: API_BASE_URL + "/feedback",
            method: 'POST',
        });
    }
    send_email( email) {
        return request({
            url: API_BASE_URL + "/send",
            method: 'POST',
            body: JSON.stringify(email)
        });
    }
    saveLoginUser( Feedback) {
        return request({
            url: API_BASE_URL + "/saveloggedin",
            method: 'POST',
            body: JSON.stringify(Feedback)
        })
    }

}

export default new UserService();