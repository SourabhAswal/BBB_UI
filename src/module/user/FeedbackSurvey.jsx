import React from 'react'
import './FeedbackSurvey.css'
import Alert from 'react-s-alert';
import './Tagging.css'
import security from '../../utils/EncryptionDecryption'
import Survey from '../../service/survey_related_services/Survey'
import { data } from 'jquery';

class FeedbackSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 0,
            rate: [1, 2, 3, 4, 5],
            question: [],
            ans: [],
            tagging: [],
            suggestion: "",
            eventId: "",
            email: ""

        }
    }



    nextPrev = (n) => {
        var view = this.state.view
        if (n === 1) {
            view = view + n
            this.setState({ view })
        }
        else if (n === -1 && view !== 0) {
            view = view + n;
            this.setState({ view })
        }
    }


    highlight_btn = (id) => {
        console.log(id)

        //pushing  questions To array
        var ques = document.getElementById('q' + this.state.view + 1).innerText;
        if (this.state.question.indexOf(ques) === -1)
            this.state.question.push(ques);
        if (this.state.view < 5) {
            //pushing answer to array
            if (this.state.ans[this.state.view] == null)
                this.state.ans.push(id)
            else {
                this.state.ans.splice(this.state.view, 1, id);
            }
        }

        // highlighting the rating button
        var arr = this.state.rate
        document.getElementById(id).style.backgroundColor = "#22B1ED"
        document.getElementById(id).style.color = "#fff"
        for (var i = 0; i < arr.length; i++) {
            if (id !== arr[i]){
                document.getElementById(arr[i]).style.backgroundColor = "#fff"
                document.getElementById(arr[i]).style.color = "#22B1ED"
            }
                
        }

    }

    submit = async (e) => {
        

        const { question, ans, eventId, tagging } = this.state
        
        console.log(tagging)
        if (eventId === "") {
            Alert.warning("Please select Event!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 3000,
                offset: 100
            });
            this.setState({ view: 0 })
        }
         else if (tagging == ""|| tagging==null) {
             Alert.warning("Please write your interest", {
                 position: 'top-right',
                 effect: 'slide',
                 beep: true,
                 timeout: 3000,
                 offset: 100
             });
             this.setState({ view: 5 })

         }
        else {
            var survey = {
                question: question,
                ans: ans,
                suggestion: tagging.join(),
                eventId: eventId,
                email: localStorage.getItem("email")
            }
            try {
                await Survey.postSurvey(security.encrypt(survey))
                
            }
            catch (err) {
            }
        }
    }
    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })

        console.log(e.target.name);
        console.log(e.target.value)
    }


 

    render() {
        const selectedTags = tags => {
            this.setState({ tagging: tags })
        };


        return (
            <div className="container mt-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-8">
                        <form id="regForm">
                            <div>
                            </div>
                            <h1 id="register" className="text-center">Survey Form</h1>
                            <div className="all-steps" id="all-steps">
                                <span className="step"><i className="fa fa-user"></i>
                                </span> <span className="step"><i className="fa fa-map-marker"></i></span>
                                <span className="step"><i className="fa fa-shopping-bag"></i></span>
                                <span className="step"><i className="fa fa-car"></i></span>
                                <span className="step"><i className="fa fa-spotify"></i></span>
                                <span className="step"><i className="fa fa-mobile-phone"></i></span>
                            </div>
                            {this.state.view === 0 && <div className="tab">
                                <select name="eventId" value={this.state.eventId} onChange={this.changeHandler} className="form-control" style={{ color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }}>
                                    <option key="" selected value="">Select Event</option>
                                    {this.props.registeredEvents.map(e => (<option key={e.id} value={e.id}>{e.meeting_name}</option>))}
                                </select>
                                <h6 className="text-center" id={"q" + this.state.view + 1} style={{ marginTop: "10px"  ,color: "#757575 " }}>Rate your experience in this event</h6>
                                <div className="" style={{ display: "flex", justifyContent: "space-around" }}> 
                                    {this.state.rate.map(rate => (<p> <button type="button" id={rate} className="btn btn-outline-primary" style={{ borderRadius: "50%" }} onClick={() => this.highlight_btn(rate)}>{rate}</button></p>))}</div>
                            </div>
                            }
                            {this.state.view === 1 && <div class="tab">
                                <h6 className="text-center" style={{ color: "#757575 "}} id={"q" + this.state.view + 1}>Planning and Management</h6>
                                <div className="" style={{ display: "flex", justifyContent: "space-around" }}> 
                                    {this.state.rate.map(rate => (<p> <button type="button" id={rate} className="btn btn-outline-primary" style={{ borderRadius: "50%" }} onClick={() => this.highlight_btn(rate)}>{rate}</button></p>))}</div>
                            </div>
                            }
                            {this.state.view === 2 && <div class="tab">
                                <h6 className="text-center" style={{ color: "#757575 "}} id={"q" + this.state.view + 1}>What's your Event Experience?</h6>
                                <div className="" style={{ display: "flex", justifyContent: "space-around" }}>   
                                  {this.state.rate.map(rate => (<p> <button type="button" id={rate} className="btn btn-outline-primary" style={{ borderRadius: "50%" }} onClick={() => this.highlight_btn(rate)}>{rate}</button></p>))}</div>
                            </div>
                            }
                            {this.state.view === 3 && <div class="tab">
                                <h6 className="text-center" style={{ color: "#757575 "}} id={"q" + this.state.view + 1}>Planning and organization</h6>
                                <div className="" style={{ display: "flex", justifyContent: "space-around" }}>   
                                  {this.state.rate.map(rate => (<p> <button type="button" id={rate} className="btn btn-outline-primary" style={{ borderRadius: "50%" }} onClick={() => this.highlight_btn(rate)}>{rate}</button></p>))}</div>
                            </div>
                            }
                            {this.state.view === 4 && <div class="tab">
                                <h6 className="text-center" style={{ color: "#757575 "}} id={"q" + this.state.view + 1}>How relevant was the event to you?</h6>
                                <div className="" style={{ display: "flex", justifyContent: "space-around" }}>  
                                   {this.state.rate.map(rate => (<p> <button type="button" id={rate} className="btn btn-outline-primary" style={{ borderRadius: "50%" }} onClick={() => this.highlight_btn(rate)}>{rate}</button></p>))}</div>
                            </div>
                            }
                            {this.state.view === 5 && <div class="tab">
                                <h6 style={{ color: "#757575 "}} >Any Interested Topic</h6>
                                <TagsInput selectedTags={selectedTags} tags={[]} />
                                <div style={{ display: "none" }}><p><input className="suggestion_input" placeholder="Write Your suggestion here..." name="suggestion" onChange={this.changeHandler} /></p></div>
                            </div>
                            }
                            {this.state.view === 6 && this.submit() && <div class="thanks-message text-center" id="text-message"> <img alt='' src="https://i.imgur.com/O18mJ1K.png" width="100" class="mb-4" />
                                <h3>Thank you for your survey!</h3> <span>Thanks for your valuable information. It helps us to improve our services!</span>
                            </div>
                            }
                            <div style={{ overFlow: "auto" }} id="nextprevious">
                                <div style={{ float: "right" }}>
                                    {this.state.view > 0 && this.state.view < 6 && <button className="sur_button" type="button" id="prevBtn" onClick={() => this.nextPrev(-1)}><i class="fa fa-angle-double-left"></i></button>}
                                    {this.state.view < 6 && <button className="sur_button" type="button" id="nextBtn" onClick={() => this.nextPrev(1)}><i class="fa fa-angle-double-right"></i></button>}
                                </div>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        )
    }
}

export default FeedbackSurvey


const TagsInput = props => {
    const [tags, setTags] = React.useState(props.tags);
    const removeTags = indexToRemove => {
        
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
        
        props.selectedTags([ ...tags.filter((_, index) => index !== indexToRemove)]);
    
        
    };
    const addTags = event => {
        if (event.target.value !== "" ) {
            var datatag = event.target.value;
            console.log(datatag)
            if(datatag.trim().length===0 || datatag ==="")
            {
                Alert.warning("Interest should not be empty", {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 3000,
                    offset: 100
                });
            
            }
            else {

                // var domain=datatag.replace('The',"")


                var uselessWordsArray =
                    [
                        "a", "at", "be", "can", "cant", "could", "couldnt", "my", "can't", "couldn't", "favroute", "I'm",
                        "do", "does", "how", "i", "in", "is", "many", "much", "of", "found", "get", "got", "favroute", "i'am",
                        "on", "or", "should", "shouldnt", "so", "such", "the", "watch", "see", "teach", "sports", "sport", "i'm",
                        "them", "they", "to", "us", "we", "what", "who", "why", "watching", "dream", "favorite", "are", "i'am",
                        "with", "wont", "would", "wouldnt", "you", "am", "loved", "interest", "interested", "like", "loved",
                        "love", "want", "know", "about", "iam", "interestedin", "im", "topic", "likes", "been", "being", "liked",
                        "topics", "iaminterestedin", "iaminterested", "iaminterest", "ia", "aminterested", "aminterest",
                        "just", "interestin", "know", "about", "u", "to", "something related", "something", "related", "sometime",
                        "sometimes", "somethingrelated", "somethingrelatedto", "somebody", "give", "gave", "get", "got", "eat", "find"

                    ];

                var expStr = uselessWordsArray.join("|");
                var domain = datatag.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
                    .replace(/\s{2,}/g, ' ');

                setTags([...tags, domain]);
                props.selectedTags([...tags, domain]);
                event.target.value = "";





            }


        }
    };
    return (
        <div className="tags-input">
            <ul id="tags">
                {tags.map((tag, index) => (
                    <li key={index} className="tag">
                        <span className='tag-title'>{tag}</span>
                        <span className='tag-close-icon'
                            onClick={() => removeTags(index)}
                        >
                            x
                        </span>
                    </li>
                ))}
            </ul>
            <input className="inputtag"
                type="text"
                onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
                placeholder="Enter your interested topic and then press enter" required
            />
        </div>
    );
};