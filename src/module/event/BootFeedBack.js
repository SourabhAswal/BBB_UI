import React from "react";
//import {Spring} from 'react-spring';
import './eventpage.css'

import PrakharCard from './PrakharCard';

import '../event/BootFeedBack.css';
class BootFeedBack extends React.Component {


    render() {
        
        return (
            
            <div className="container-fluid ">

                <div className="row " >
                    <h2 style={{ textAlign: "center", color: "rgb(117,117,117)",fontWeight:"500" }}>Review our Speakers after the session</h2>

                    {this.props.Speaker.map(s => (
                        <div className="col-md-3 " id="1" >
                            <PrakharCard  Speaker={s}/>
                        </div>

                    ))}

                  
                </div>

            
            </div>
        )
    }
}
export default BootFeedBack;