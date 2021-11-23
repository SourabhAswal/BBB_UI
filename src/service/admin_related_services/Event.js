import url from "../../constant/index";
import request from "../../utils/ApiUtils"
const API_BASE_URL = url + "/meetings";

class EventService {

    scheduleEvent(event) {

        return request({
            url: API_BASE_URL + "/schedulemeeting",
            method: 'POST',
            body: JSON.stringify(event)
        });
    }
postRating(rating){
    return request({
        url: API_BASE_URL + "/addrating",
        method: 'POST',
        body: JSON.stringify(rating)
    }); 
}
getAttendeeLink(detail){
    return request({
        url: API_BASE_URL + "/getAttendeeLink",
        method: 'POST',
        body: JSON.stringify(detail)
    });
    
}

    getAllEvents() {
        return request({
            url: API_BASE_URL + "/get_meetings",
            method: 'POST',
        });
    }

    getEventById(event_id) {
        return request({
            url: API_BASE_URL + "/get_meeting/" + event_id,
            method: 'POST',
        });
    }

    uploadSpeakers(speaker) {

        return  request({
            url: API_BASE_URL + "/uploadSpeaker",
            method: 'POST',
            body: JSON.stringify(speaker)
        });

    }

    getSpeakers() {
        return request({
            url: API_BASE_URL + "/showSpeakers",
            method: 'POST',
        });

    }

    removeSpeaker(id) {
        return request({
            url: API_BASE_URL + "/removeSpeaker/" + id,
            method: 'POST',

        });

    }
    updateSpeaker(speaker){
        return request({
            url: API_BASE_URL + "/updateSpeaker" ,
            method: 'POST',
            body: JSON.stringify(speaker)
        });
    }
    getSpeakerById(id){
        return request({
            url: API_BASE_URL + "/speaker/" + id,
            method: 'POST',

        });

       
    }
    getSpeakerByEvent(mid){
        return request({
            url: API_BASE_URL + "/speaker/meeting/" + mid,
            method: 'POST',

        });}

        


        updateEventStatus(mid,event){
            return request({
                url: API_BASE_URL + "/statusUpdate/" + mid,
                method: 'POST',
                body: JSON.stringify(event)
    
            });}
}

export default new EventService();