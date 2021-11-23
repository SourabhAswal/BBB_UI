import url from "../../constant/index";
import request from "../../utils/ApiUtils"
const API_BASE_URL= url+"/meetings";
 class Rating_Service{

       post_rating(rating){
        return request({
            url: API_BASE_URL+"/addrating" ,
            method: 'POST',
            body: JSON.stringify(rating)
        });
       }
       

      
       get_ratings(mid){
        return request({
            url: API_BASE_URL+"/rating/"+mid ,
            method: 'POST',
        
        });
       }

}


export default new Rating_Service();