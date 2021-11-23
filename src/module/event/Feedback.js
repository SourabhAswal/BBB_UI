import React, {useState } from 'react';
import './feedback.css';
import { FaStar } from 'react-icons/fa';
import service from '../../service/admin_related_services/Event'
import security from '../../utils/EncryptionDecryption'
const Feedback =(props) =>{

  
    var feedback={
    id:"",
    rating:0
  }

 
    var [rating, setRating]= useState(null);
    const [hover, setHover]= useState(null);
    var [count, setCount] = useState(0);
    const [id, setId]= useState(props.Speaker.id);
    

    const Rating=async(ratingValue)=>{
      setId(props.Speaker.id);
      feedback.id = id; 
      feedback.rating=ratingValue;
      
   await service.postRating(security.encrypt(feedback))
      
     

    }

    
    return (
    <div style={{marginLeft:'3px', marginRight: '3px'}}>{[...Array(5)].map((star,i) =>{
        const ratingValue = i+1;
        return (<label>
       
        <input type="radio" name="rating" value={ratingValue} 
        onClick={()=> {Rating(ratingValue);setRating(ratingValue)}}
        />
          <FaStar className="star" 
          color={ratingValue <= (hover || rating) ? "#ffc107" :"#ecf0f3"} 
          size={30}
          onMouseEnter={()=> {setHover(ratingValue);setCount(count++)}}
          onMouseLeave={()=> {setHover(null);setCount(count++)}}
          
          />
    </label>)
    } )}</div>

    )

}

export default Feedback