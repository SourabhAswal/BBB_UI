import React from 'react';
import '../event/eventpage.css';
import BootFeedBack from './BootFeedBack'
import userService from '../../service/user_related_services/Users_Service';
import loggedInUsers from '../../service/admin_related_services/User_Details'
import Rating from '../../service/rating_related_services/Rating';
import Event from '../../service/admin_related_services/Event';
import url from "../../constant/index";
import 'font-awesome/css/font-awesome.min.css';
import Alert from 'react-s-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import security from '../../utils/EncryptionDecryption'
import Document from '../../service/document_related_services/Document'

class EventPage extends React.Component {

  state = {
    view: 0, Feedback: { userName: "", email: "", feedback: "", event_id: '' }, meeting: {}, rating: [],
    filelist:[],
    Speaker: [],
    category: "",
    lists: 0,
    defaultFeedback: ""
  };

  async componentDidMount() {
    this.getDetail()

  }
  changeView = (view) => {
    this.setState({ view })
  }
  changeHandler = (e) => {
    const { Feedback } = this.state;
    Feedback[e.target.name] = e.target.value;
    this.setState({ Feedback })
  }
  handleSubmit = async (e) => {
    e.preventDefault()
    const { Feedback, defaultFeedback } = this.state;
    Feedback.event_id = localStorage.getItem("eventId");
    const attendees = await loggedInUsers.get_LoggedIn_Users()

    const attendeeFound = attendees.find(obj => obj.email === Feedback.email && obj.event.id === +Feedback.event_id)
    if (!attendeeFound) {

      Alert.warning("Please submit feedback after joining event", {
        position: 'top-right',
        effect: 'slide',
        timeout: 4000,
        offset: 100
      });
    }
    else {
      if (Feedback.feedback.trim() === "")
        Feedback.feedback = defaultFeedback
      try {
        const eventId=Feedback.event_id
      delete Feedback["event_id"]
        await userService.post_feedback(eventId, security.encrypt(Feedback))

        Alert.success("Feedback submitted!!", {
          position: 'top-right',
          effect: 'slide',
          beep: true,
          timeout: 2000,
          offset: 100
        });
      } catch (error) {

      }
    }
    window.location = '/eventpage'

  }
  toggle_visibility = () => {
    if (document.getElementById('event-div').style.opacity === "1")
      document.getElementById('event-div').style.opacity = "0.4"
    else
      document.getElementById('event-div').style.opacity = "1"
    var e = document.getElementById('feedback-main');
    if (e.style.display === 'block')
      e.style.display = 'none';
    else
      e.style.display = 'block';
  }

  about_us = () => {
    var e = document.getElementById('about-main');
    if (e.style.display === 'block')
      e.style.display = 'none';
    else
      e.style.display = 'block';
  }
  joinMeeting = async () => {
    this.getDetail()
    const { meeting } = this.state
    if (!meeting.status) {
      Alert.error("Meeting is not started yet", {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 3000,
        offset: 100
      });

    }
    else {
      var fullName = localStorage.getItem("name")
      var arr = fullName.split(" ")
      var firstName = arr[0]
      const detail = {
        attendee_link: meeting.attendee_link,
        meeting_name: firstName
      }
      const newAttendeeLink = await Event.getAttendeeLink(security.encrypt(detail));
      this.joinEvent(newAttendeeLink)
    }


  }
  joinEvent = async (link) => {

    const { Feedback } = this.state;
    delete Feedback['feedback']
    delete Feedback['event_id']
    Feedback.mid = localStorage.getItem("eventId");
    const res = await loggedInUsers.saveLoginUser(security.encrypt(Feedback))
    if (res)
      window.location = link
  }

  
  test(e) {
    document.getElementById(e).style.fontSize = '45px'
  }
  testagain(e) {
    document.getElementById(e).style.fontSize = '45px'
  }
  display(e) {
    let { defaultFeedback } = this.state
    if (e === "great-icon") {
      document.getElementById('great-text').style.display = 'block'
      document.getElementById('sad-text').style.display = 'none'
      document.getElementById('happy-text').style.display = 'none'
      document.getElementById('sendbtn').style.display = 'block'

      document.getElementById(e).style.fontSize = '55px';
      document.getElementById('sad-icon').style.fontSize = '45px';
      document.getElementById('happy-icon').style.fontSize = '45px';

      document.getElementById(e).style.color = 'green'
      document.getElementById('sad-icon').style.color = 'lightgray'
      document.getElementById('happy-icon').style.color = 'lightgray'
      defaultFeedback = "Great session!!"
    }
    else if (e === "happy-icon") {
      document.getElementById('happy-text').style.display = 'block'

      document.getElementById('sad-text').style.display = 'none'
      document.getElementById('great-text').style.display = 'none'
      document.getElementById('sendbtn').style.display = 'block'


      document.getElementById(e).style.fontSize = '55px';
      document.getElementById('sad-icon').style.fontSize = '45px';
      document.getElementById('great-icon').style.fontSize = '45px';

      document.getElementById(e).style.color = 'yellow'
      document.getElementById('sad-icon').style.color = 'lightgray'
      document.getElementById('great-icon').style.color = 'lightgray'
      defaultFeedback = "Good session!!"
    }
    else if (e === "sad-icon") {
      document.getElementById('sad-text').style.display = 'block'

      document.getElementById('great-text').style.display = 'none'
      document.getElementById('happy-text').style.display = 'none'
      document.getElementById('sendbtn').style.display = 'block'

      document.getElementById(e).style.fontSize = '55px';
      document.getElementById('happy-icon').style.fontSize = '45px';
      document.getElementById('great-icon').style.fontSize = '45px'

      document.getElementById(e).style.color = 'red'
      document.getElementById('great-icon').style.color = 'lightgray'
      document.getElementById('happy-icon').style.color = 'lightgray'
      defaultFeedback = "Bad session!!"
    }

    this.setState({ defaultFeedback })
  }
  test1() {
    document.getElementById("feedback-main").style.display = "none";
    document.getElementById("download-table").style.display = "none";
    document.getElementById("event-div").style.opacity = "1";
    document.getElementById("download_presentation").style.opacity = "1";
  }



  handlelist = (category) => {
    console.log(category)
    if (document.getElementById("event-div").style.opacity === "0") {
      document.getElementById("event-div").style.opacity = "0";
      document.getElementById("download_presentation").style.opacity = "0";
      document.getElementById("download-table").style.display = "block";

    } else {
      document.getElementById("event-div").style.opacity = "1";
      document.getElementById("download_presentation").style.opacity = "1";
      document.getElementById("download-table").style.display = "none";
    }
    this.setState({ lists: 1 });
  };

  getDetail = async () => {
    const mid = localStorage.getItem("eventId");
    let { Feedback } = this.state
    Feedback.email = localStorage.getItem("email")
    Feedback.userName = localStorage.getItem("name")
    const meeting = await Event.getEventById(mid)
    const rating = await Rating.get_ratings(mid)
    this.setState({ meeting, rating, Feedback })
    try {
      const res = await Event.getSpeakerByEvent(mid)
      if (res.length > 0)
        this.setState({ Speaker: res })
      else {
        document.getElementById("speakerDiv").style.display = "none"
        document.getElementById("sHeading").style.display = "none"
      }
    }
    catch (error) { }
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
    handlelist = async() => {
      const mid=localStorage.getItem("eventId");
      const category="Presentation"
   
      const res= await Document.downloadFiles(({meeting_id:mid, category:category}))
      console.log(res)
          if (res.length > 0)
            {
              this.setState({ filelist: res , view:100})
              document.getElementById("eventpage").style.opacity="0.5"
   
          }
          else
          {
            Alert.warning("Presenation material not found", {
              position: 'top-right',
              effect: 'slide',
              beep: true,
              timeout: 3000,
              offset: 100
            });
          }}
          close=()=>{
            this.setState({view:0})
            document.getElementById("eventpage").style.opacity="1"
          }

  render() {
    const { meeting, Speaker, Feedback,filelist } = this.state;

    return (

      <><div id="eventpage">
        <div id="event-div" style={{ opacity: "1", backgroundColor: "#fff" }} onClick={this.test1}>
          <div style={{ background: "url('/3.jfif')", height: "500px", width: "auto", backgroundSize: 'cover' }} className="maindiv" >
            <div style={{ marginLeft: "2%", width: "96%", height: "500px", backgroundSize: "100% 100%" }}>
              <h2 style={{ color: "white", display: "inline", position: "relative", marginLeft: '20px' }} >
                <img src="/logotwhite.png" alt="logo" height="37.33" width="140" style={{ marginTop: "20px" }} />
              </h2>
              <div style={{ position: "absolute", marginLeft: "38%", marginTop: "4%" }}>
                <p><h2 style={{ color: "rgb(4 4 4)", fontFamily: "Times New Roman, Times, serif" }}><strong><em> {meeting.start_time ? "Event will start at " + meeting.start_time : "No Event Scheduled Yet!!"}</em></strong></h2></p>
                {meeting.start_time && <button className="btn  btn-apply" style={{ marginLeft: "35%", color: "white", backgroundColor: "#22b1ed", fontSize: "15px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", marginTop: '7px', fontFamily: "'Oswald', sans-serif" }} onClick={() => this.joinMeeting()}> Join Us</button>}
              </div>
            </div>
          </div>
          <div id="sHeading">
            <h1 className="speaker" style={{ color: "rgb(117,117,117)", fontWeight: "500" }}>Speaker</h1>
          </div>
          <div class="scroll-speaker d-flex1" id="speakerDiv">
            {Speaker.map((user, i) => (
              <div className="card-container" key={i} style={{marginLeft:"7%"}} >
                <img src={`${user.sImage}`} alt="speaker" style={{ borderRadius: "50%" }} height="200px" width="200px" />
                <div>
                  <button className="btn btn-info" style={{ width: "100%" }}><em>{user.sName}</em></button>
                </div>
                <div>
                  <button className="btn btn-outline-standard" style={{ width: "100%" }} id={user.id}> Rating :  {this.state.rating[i]}</button>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center" }}>
            <div className="card-container"  >
              <img src="/ravisir.png" alt="speaker" height="200" width="200" />
              <div>
                <button className="btn btn-info" style={{ width: "100%" }}><em>Ravi Singh</em> </button>
              </div>
              <div>
                <button className="btn btn-outline-standard" style={{ width: "100%" }}>CEO</button>
              </div>
            </div>
          </p>
          <div>
            <BootFeedBack Speaker={this.state.Speaker} />
          </div>


          <div id="about-main" style={{ marginTop: "3%" }}>
            <div id="about-div" style={{ width: "100%" }} >
              <div className="scrollit">
                <img src="/img1.jpg" alt="1" className="ppt-image" />
                <img src="/img2.jpg" alt="1" className="ppt-image" />
                <img src="/img3.jpg" alt="1" className="ppt-image" />
                <img src="/img4.jpg" alt="1" className="ppt-image" />
                <img src="/img5.jpg" alt="1" className="ppt-image" />
                <img src="/img6.jpg" alt="1" className="ppt-image" />
                <img src="/img7.jpg" alt="1" className="ppt-image" />
                <img src="/img8.jpg" alt="1" className="ppt-image" />
                <img src="/img9.jpg" alt="1" className="ppt-image" />
                <img src="/img10.jpg" alt="1" className="ppt-image" />
                <img src="/img11.jpg" alt="1" className="ppt-image" />
                <img src="/img12.jpg" alt="1" className="ppt-image" />
              </div>
            </div>
          </div>
          <button id="popup" class="about-button" onClick={() => this.about_us()}>About us</button>
        </div>
        <div className="App-intro download_presentation" id="download_presentation" style={{ backgroundColor: "#fff"}}>
          <p style={{ textAlign: "center", color: "rgb(117,117,117)" }}><h3>Download  files as discussed in the meeting</h3>
            <p id="download"></p>
            <button
              id="button-download"
              onClick={() => this.handlelist("presentation")}
            >
              Presentation Material
            </button>
          </p>
        </div>
        <div id="feedback-main" style={{ position: "fixed", top: "8%", left: "55%" }}>
          <div id="feedback-div">
            <h4 className="text-center" style={{ marginBottom: "20px", color: "gray" }}>Let us know your feedback</h4>
            <form class="form" id="feedback-form1" name="form1" enctype="multipart/form-data" onSubmit={this.handleSubmit}>
              <p class="name">
                <input name="userName" disabled value={Feedback.userName} type="name" class="validate[required,custom[onlyLetter],length[0,100]] feedback-input" required placeholder="Name" id="feedback-name" onChange={this.changeHandler} />
              </p>
              <p class="email">
                <input name="email" disabled value={Feedback.email} type="email" class="validate[required,custom[email]] feedback-input" id="feedback-email" placeholder="Email" required onChange={this.changeHandler} />
              </p>
              <p className="d-flex" style={{ justifyContent: 'space-evenly' }}>
                <div className="icon-hover" >
                  <i class="fas fa-frown   " title="Bad" id="sad-icon" onClick={() => this.display("sad-icon")} style={{ color: "lightgray", fontSize: "40px", cursor: "pointer" }}></i>
                  <p id="great" className="great text-center " style={{ color: 'gray' }}>Bad</p>
                </div><div className="icon-hover">
                  <i class="fas fa-meh  " title="Okay" id="happy-icon" onClick={() => this.display("happy-icon")} style={{ color: "lightgray", fontSize: "40px", cursor: "pointer" }}></i>
                  <p className="happy text-center" id="happy" style={{ color: 'gray' }}>Okay</p>
                </div><div className="icon-hover">
                  <i class="fas fa-smile  " title="Great" id="great-icon" onClick={() => this.display("great-icon")} style={{ color: "lightgray", fontSize: "40px", cursor: "pointer" }}></i>
                  <p className="sad text-center" id="sad" style={{ color: 'gray' }}>Great</p>
                </div>
              </p>
              <p id="sad-text" class="text" style={{ display: 'none' }}>
                <textarea name="feedback" value={Feedback.feedback} type="comment" class="validate[required,length[6,300]] feedback-input" id="feedback-comment" placeholder="We would really like to improve.Kindly provide suggestions for more improvement" onChange={this.changeHandler}></textarea>
              </p>
              <p id="happy-text" class="text" style={{ display: 'none' }}>
                <textarea name="feedback" value={Feedback.feedback} type="comment" class="validate[required,length[6,300]] feedback-input" id="feedback-comment" placeholder="We are satisfied to know that. Kindly provide suggestions for further improvement" onChange={this.changeHandler}></textarea>
              </p>
              <p id="great-text" class="text" style={{ display: 'none' }}>
                <textarea name="feedback" value={Feedback.feedback} type="comment" class="validate[required,length[6,300]] feedback-input" id="feedback-comment" placeholder="We are glad to know that.Kindly provide suggestions for further improvement" onChange={this.changeHandler}></textarea>
              </p>
              <div id="sendbtn" style={{ display: 'none' }} class="feedback-submit">
                <button type="submit" value="SEND" id="feedback-button-blue" style={{
                  color: "white", backgroundColor: "#22b1ed", fontSize: "15px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)"
                }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
        <button id="popup" class="feedback-button" onClick={() => this.toggle_visibility()}>Feedback</button>
        <div
          id="download-table"
          style={{
            position: "fixed",
            top: "20%",
            left: "35%",
            display: "none"
          }}
        >
          {/* {this.state.lists === 1 &&
            <DownloadList
              mid={localStorage.getItem("eventId")}
              category="Presentation"
              onBack={() => this.handleView()}
            />
          } */}

          </div></div>

{this.state.view === 100 && <div className="download-list"  ><table className="table table-hover"><thead><tr><th>Presentation Material</th><th><i className="fa fa-download"></i><span style={{marginLeft:"70px"}}><i className="fa fa-window-close" onClick={this.close}></i></span></th></tr></thead><tbody style={{background:"white"}}>
            {filelist.map((list, i) => (
              <tr><td>{list.name}</td><td><button  onClick={() => this.downloadFile(list.id)} id='button-web'> Download</button></td></tr>
            ))}
          </tbody>
          </table>
          </div>}

        
      </>
    )
  }

  handleView = () => {
    this.setState({ lists: 0 })
  }
}
export default EventPage;