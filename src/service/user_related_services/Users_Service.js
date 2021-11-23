import url from "../../constant/index";
import request from "../../utils/ApiUtils"
const API_BASE_URL= url+"/users";
class Registered_Users_Service{

       register(user){
        return request({
            url: API_BASE_URL + "/process_register",
            method: 'POST',
            body: JSON.stringify(user)
        });
       }
       registerFromDashboard(user){
        return request({
            url: API_BASE_URL + "/register",
            method: 'POST',
            body: JSON.stringify(user)
        });
       }

       login(user){
        return request({
            url: API_BASE_URL + "/loginUser/",
            method: 'POST',
            body: JSON.stringify(user)
        });
       }

       
       login_via_google(user){
        return request({
            url: API_BASE_URL + "/email/",
            method: 'POST',
            body: JSON.stringify(user)
        });
       }
       post_feedback(event_id,feedback){
        return request({
            url: API_BASE_URL + "/submitFeedback/"+event_id,
            method: 'POST',
            body: JSON.stringify(feedback)
        });
       }

       getRegisteredEvents(user){
        return request({
            url: API_BASE_URL + "/getRegisteredEvents",
            method: 'POST',
            body: JSON.stringify(user)
        });

        
       }


       
}

export default new Registered_Users_Service();
