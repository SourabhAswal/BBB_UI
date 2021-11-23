import React from 'react';
import '../event/Card.css';
import Feedback from './Feedback';

const PrakharCard = props => {
    return(
        <div className="cards text-center " style={{height:"150px"}}>
            <div  style={{marginLeft:'5px', marginRight: '5px', marginTop:'10px'}}>
                <Feedback Speaker={props.Speaker}/>
            </div>
        <div className="cardrate">
            <div className="overflow"> 
                <h5 style={{color:"white"}}> {props.Speaker.sName}'s Session</h5>
            </div>
            <div className="card-body text-dark">
            <h5 style={{color:"white"}}> {props.Speaker.sRole}  </h5>
            </div>

            </div>

        </div>
    )
}

export default PrakharCard