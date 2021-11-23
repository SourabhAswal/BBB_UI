import React from 'react'
import './Dashboard.css'
import { Link } from 'react-router-dom'
import Event from '../../service/admin_related_services/Event'
import service from '../../service/user_related_services/Users_Service'
import survey from '../../service/survey_related_services/Survey'
import Document from '../../service/document_related_services/Document'
import FeedbackSurvey from './FeedbackSurvey'
import url from "../../constant/index";
import Alert from 'react-s-alert'
import security from '../../utils/EncryptionDecryption'

class UserDashboard extends React.Component {
  constructor() {
    super()
    this.state = {
      even_arr: [],
      upcoming_even_arr: [],
      speaker: [],
      suggested_events: [],
      agenda_arr: []
    }
  }

  async componentDidMount() {
    var email = localStorage.getItem("email")
    try {
      var response = await service.getRegisteredEvents(security.encrypt({ email: email }))
   
    let res = await Event.getAllEvents();
   let arr = res.filter(({ id: id1 }) => !response.some(({ id: id2 }) => id2 === id1));
   let suggestion = await survey.getSuggestion(security.encrypt({ email: email }))
    var suggested_events = [], k = 0;
    for (var j = 0; j < suggestion.length; j++) {
      for (let i = 0; i < res.length; i++) {
        if ((res[i].meeting_name.toLowerCase().includes(suggestion[j].toLowerCase())) || (suggestion[j].toLowerCase().includes(res[i].meeting_name.toLowerCase()))) {
          suggested_events[k] = res[i]
          k++
        }


      }
    }

    this.setState({ even_arr: response, upcoming_even_arr: arr, suggested_events })
  } catch (err) {
    
    const msg=err.status===400?err.msg:"Connection Refused"
    Alert.error(msg, {
      position: 'top-right',
      effect: 'slide',
      beep: true,
      timeout: 3000,
      offset: 100
    });

  }

  }
  async updateRegisteredEvents() {
    var email = localStorage.getItem("email")
    try {
      var response = await service.getRegisteredEvents(security.encrypt({ email: email }))
      let res = await Event.getAllEvents();
     let arr = res.filter(({ id: id1 }) => !response.some(({ id: id2 }) => id2 === id1));
      this.setState({ even_arr: response, upcoming_even_arr: arr})
    } catch (err) {

    }
  }
  sortByDate = arr => {
		const sorter = (a, b) => {
		   return new Date(a.date) - new Date(b.date);
		}
		arr.sort(sorter);
		
	 };


  fullDate = (d) => {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date(d);
    var monthName = months[date.getMonth()];
    return d.substring(8, 10) + " " + monthName + "," + d.substring(0, 4);
  }
  date = (d) => {
    return d.substring(8, 10)
  }

  month = (d) => {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date(d);
    var monthName = months[date.getMonth()];
    return monthName;
  }
  logout = () => {
    localStorage.clear()
    this.props.history.replace("/")
  }


  showSpeaker = async (id) => {
    const res = await Event.getSpeakerByEvent(id);
    if (res.length > 0)
      this.setState({ speaker: res })


    else {
      Alert.warning("Speaker is not uploaded yet!!!", {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 3000,
        offset: 100
      });
    }
  }

  toggle_visibility = () => {
    var e = document.getElementById('survey-main');
    if (e.style.display === 'block')
      e.style.display = 'none';
    else
      e.style.display = 'block';
  }

  handleLists = async (id) => {
try{
  const response = await Document.downloadFiles(({ meeting_id: id, category: "Agenda" }))
  if (response.length > 0)
    this.downloadFile(response[0].id)
  else {
    Alert.warning("Agenda not uploaded yet!!!", {
      position: 'top-right',
      effect: 'slide',
      beep: true,
      timeout: 3000,
      offset: 100
    });
  }
}
catch (error) {

      document.getElementById('download').innerHTML = "Download failed..Connection Error";
      setTimeout(function () {
        document.getElementById('download').innerHTML = "";
      }, 2000)
    }
   
  }

  downloadFile = async (id) => {
 
  await fetch(url + "/files/download/" + id, { method: 'POST' })
  .then(response=>response.json())
  .then(res=>
    security.decrypt(res.data)).then(resp=>{ 
      const blob = this.dataURItoBlob(resp.content);
      const url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download=resp.name
        a.click()
      })
      
  }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/pdf'});
    return blob;
  }

  redirectToRegister(event_id) {
		localStorage.setItem("mid", event_id)
		this.props.history.push('/register')
	}
  
  render() {
    
    this.sortByDate(this.state.even_arr);
    this.sortByDate(this.state.suggested_events);
    this.sortByDate(this.state.upcoming_even_arr);
    

    return (
      <>
        <div style={{ background: "#262626" }}>
          <nav className="navbar navbar-expand navbar-light bg-navbar topbar " style={{ backgroundColor: "#262626", position: "fixed", top: "0", width: "100%" }}>
            <div style={{ position: "fixed", left: "88%" }}>
              <img className="img-profile rounded-circle dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt='' src="img/undraw_profile.svg" style={{ height: "2rem", width: "2rem", border: "0px" }} />
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" style={{ cursor: "pointer" }} href="" onClick={this.logout}>Logout</a>
              </div>
              <span className="ml-2 d-none d-lg-inline text-white small">{localStorage.getItem("name")}</span>
            </div>
          </nav>
          <div style={{ backgroundImage: "url('/event3.jpg')", backgroundSize: "cover", backgroundPosition: "center", minHeight: "500px", width: "100%" }}>
            <div className="accordion" id="accordionExample" style={{ width: "50%", marginTop: "70px" }}>
              <div className="accordion-item" style={{ borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: "none", background: "transparent" }}>
                <h2 className="accordion-header" id="headingOne" style={{}}>
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" style={{ background: "transparent", borderBottom: "1px solid white", color: "yellow" }}>
                    Your Events
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body" style={{ color: "white" }}>
                    <div className="d-flex my-scroll" style={{}}>

                      {this.state.even_arr.map(event => new Date(event.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) && (<a href="#myevent" key={event.id}><div className="event_cards" >

                        <img src="/image.jpg" alt="dc" height="100" width="150" className="img-card" />
                        <div className="evn_dates " >
                          <p style={{ fontSize: "10px" }}> {this.fullDate(event.date)}</p>
                        </div>
                        <div className="contents_div" >
                          <div>
                            <h6 style={{ color: "#020d26", fontSize: "10px" }}>{event.meeting_name}</h6>
                          </div>
                        </div>
                      </div>
                      </a>
                      ))}

                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item" style={{ borderLeft: "none", borderRight: "none", background: "transparent" }}>
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" style={{ background: "transparent", borderBottom: "1px solid white", color: "yellow" }}>
                    Upcoming Events
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body" style={{ color: "white" }}>

                    <div className="d-flex my-scroll">

                      {this.state.upcoming_even_arr.map(event => new Date(event.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) && (<div className="event_cards" key={event.id}>
                        <img src="/image.jpg" alt="dc" height="100" width="150" className="img-card" />
                        <div className="evn_dates " >
                          <p style={{ fontSize: "10px" }}> {this.fullDate(event.date)}</p>
                        </div>
                        <div className="contents_div" >
                          <div>
                            <h6 style={{ color: "#020d26", fontSize: "10px" }}>{event.meeting_name}</h6>
                          </div>
                          <Link onClick={() => this.Register(event.id)} style={{ color: "#22b1ed" }}>pre-register</Link>
                        </div>
                      </div>
                      ))}

                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item" style={{ borderLeft: "none", borderRight: "none", background: "transparent" }}>
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" style={{ background: "transparent", borderBottom: "1px solid white", color: "yellow" }}>
                    You may be interest in...
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body" style={{ color: "white" }}>
                    <div className="d-flex my-scroll">

                      {this.state.suggested_events.map(event => (<div className="event_cards" key={event.id}>
                        <img src="/image.jpg" alt="dc" height="100" width="150" className="img-card" />
                        <div className="evn_dates " >
                          <p style={{ fontSize: "10px" }}> {this.fullDate(event.date)}</p>
                        </div>
                        <div className="contents_div" >
                          <div>
                            <h6 style={{ color: "#020d26", fontSize: "10px" }}>{event.meeting_name}</h6>
                          </div>
                          <Link onClick={() => this.Register(event.id)} style={{ color: "#22b1ed" }}>pre-register</Link>
                        </div>
                      </div>
                      ))}

                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div style={{ color: "#d4d4d4", position: "absolute", top: "220px", left: "55%" }}>
              <h1>Welcome To Conferencing World</h1>
            </div>

          </div>


          {/* ------------------- Events card----------------------------------------------------------- */}

          <div id="myevent" style={{ marginTop: "25px" }}>

            <div className="container">
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                {this.state.even_arr.map(event => new Date().setHours(0, 0, 0, 0) <= new Date(event.date).setHours(0, 0, 0, 0) && (
                  <div className="col-lg-4 " key={event.id} >
                    <div className="card card-margin my-env-card">
                      <div className="card-header no-border ">
                        <h5 className="card-title text-warning">{event.meeting_name}</h5>
                      </div>
                      <div className="card-body pt-0">
                        <div className="widget-49">
                          <div className="widget-49-title-wrapper">
                            <div className="widget-49-date-info">
                              <span className="widget-49-date-day">{this.date(event.date)}</span>
                              <span className="widget-49-date-month text-center">{this.month(event.date)}</span>
                            </div>
                            <div className="widget-49-meeting-info">
                              <span className="widget-49-pro-title" style={{ marginBottom: "5px", color: "whitesmoke" }}>Coming Up</span>
                              <span className="widget-49-meeting-time">{event.start_time} to {event.end_time} Hrs</span>
                            </div>
                          </div>
                          <ol className="widget-49-meeting-points">
                            <li className="widget-49-meeting-item"><span style={{ cursor: "pointer" }}><code onClick={() => this.handleLists(event.id)}>Download Agenda</code></span></li>
                            <li className="widget-49-meeting-item"><a href="#sp" rel="click here" style={{ textDecoration: "none" }}><span style={{ cursor: "pointer" }} onClick={() => this.showSpeaker(event.id)}><code>Speakers</code></span></a></li>
                            <li className="widget-49-meeting-item"><a href="https://realcoderz.com/" rel="click here" style={{ textDecoration: "none" }}><span style={{ cursor: "pointer" }} ><code>About Us</code></span></a></li>
                          </ol>
                          <div className="widget-49-meeting-action">
                            <button className="btn btn-sm btn-flash-border-primary" style={{ background: "white" }} onClick={() => this.handleJoinEvent(event.id)}>Join Event</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/*--------------------------- Speaker for particular Events------------------------------------- */}

          {this.state.speaker.length > 0 && <div><h4 className="text-center " style={{ color: "yellow" }}>Speakers</h4><div className="scroll-sp" style={{ display: "flex", justifyContent: " space-between" }}>

            {this.state.speaker.map(speaker => (
              <div id="sp" style={{ boxShadow: "10px 10px 10px rgb(31,30,30) ", margin: "25px" }} key={speaker.id}>

                <img src={`${speaker.sImage}`} style={{ borderRadius: "50%" }} height="200" width="200" alt="speaker" />
                <div>
                  <h4 className="text-center text-light">{speaker.sName}</h4>
                </div>

              </div>
            ))}


          </div>
          </div>}
          <a href="#survey-main"> <button id="popup" class="feedback-survey-button"  onClick={() => this.toggle_visibility()}>Survey</button></a>
        </div>
        <div id="survey-main" style={{ display: "none", marginBottom: "100px" , backgroundColor:"#fff" }}>
          <FeedbackSurvey registeredEvents={this.state.even_arr}/>
        </div>
      </>

    )
  }
  handleJoinEvent = (id) => {
    localStorage.setItem("eventId", id)
    this.props.history.push("/eventpage")
  }

  Register=async(event_id)=>{
    let name = localStorage.getItem("name")
    let email = localStorage.getItem("email")
    try{
    const res= await service.registerFromDashboard(security.encrypt({userName:name,email:email,mid:event_id}))
    this.updateRegisteredEvents()
    Alert.success(res.msg, {
      position: 'top-right',
      effect: 'slide',
      beep: true,
      timeout: 3000,
      offset: 100
    });
    }catch(err){
      Alert.warning(err.msg, {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 3000,
        offset: 100
      });
    }
    
  }
}
export default UserDashboard