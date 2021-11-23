import React from 'react';
import './email.css';
import './loader.css';
import Events from '../../service/admin_related_services/Event';
import adminService from '../../service/admin_related_services/User_Details';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Alert from 'react-s-alert';
import '../../css/button.css'
import security from '../../utils/EncryptionDecryption'


export default class EmailForm extends React.Component {
  constructor() {
    super();
    this.onreset = this.onreset.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChanges = this.handleChanges.bind(this)
    this.state = {
      content: '',
      email: { subject: "", msgBody: "", eventId: '' }, events: [], loading: false, message: ''

    }

  }



  handleSend = async (e) => {
    this.setState({ loading: true })
    e.preventDefault();
    const { email, content } = this.state;
    var div = document.createElement("div");
    div.innerHTML = email.msgBody
    if (email.eventId === '' || email.subject === "" || email.msgBody === "" || content === "" || email.subject.trim().length === 0 || div.innerText.trim().length === 0) {

      Alert.error("Please fill the details", {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 4000,
        offset: 100
      });
      this.setState({ loading: false })

    }

    else {
      try {
        const response = await adminService.send_email(security.encrypt(email))
        Alert.success(response.msg, {
          position: 'top-right',
          effect: 'slide',
          beep: true,
          timeout: 4000,
          offset: 100
        });

        this.setState({ loading: false, content: "" })
        document.getElementById("subject").value = ""
        document.getElementById("event").value = ""
      }
      catch (error) {
        Alert.warning(error.msg, {
          position: 'top-right',
          effect: 'slide',
          beep: true,
          timeout: 4000,
          offset: 100
        });

        this.setState({ loading: false })

      }
    }
  }

  handleChange = (e) => {
    let { email } = this.state
    email[e.target.name] = e.target.value;
    this.setState({ email })
  }

  onreset = (e) => {
    e.preventDefault()
    document.getElementById("subject").value = ""
    document.getElementById("event").value = ""
    this.setState({content: ''})

  }
  componentDidMount = async () => {
    document.querySelector("#emailform > form > div.quill > div.ql-toolbar.ql-snow").style.backgroundColor = "#eaecf4"
    document.querySelector("#emailform > form > div.quill > div.ql-toolbar.ql-snow")
    const events = await Events.getAllEvents()
    this.setState({ events })
  }

  handleChanges(html) {
    this.setState({ content: html })
    let { email } = this.state
    email.msgBody = html
    this.setState({ email })

  }

  date = (d) => {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date(d);
    var monthName = months[date.getMonth()];
    return d.substring(8, 10) + " " + monthName + "," + d.substring(0, 4);
  }

  render() {
    const { events, loading } = this.state;
    return (<>

      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="./admin">Home</a></li>

        <li class="breadcrumb-item active" aria-current="page">Email Notification</li>
      </ol>

    
      <div style={{ opacity: `${loading ? 0.3 : 1}` }}>
        <br />
        <div className="row">
          <div className="col-lg-12">

            <div id="emailform" className="container" style={{ background: "#fff", width: "500px" }}>
              <div style={{ backgroundColor: "#eaecf4", marginLeft: "-20px", marginTop: "-20px", textAlign: "center", width: "500px", height: "60px", paddingTop: "6px", paddingBottom: "4px" }}><h3 style={{ color: "#757575 ", fontSize: "30px" }}>EMAIL NOTIFICATION</h3></div>
              <br />
              <form className="myform">
                <div class="form-group"  >
                  <div className="d-flex">
                    <div>
                      <p style={{ color: "#757575 ", marginTop: "10px", fontSize: "18px", marginLeft: "80px", fontWeight: "700px" }}>Event Date : </p>
                    </div>
                    <select name="eventId" id="event" onChange={this.handleChange} className="form-control" style={{ marginLeft: "15px", width: "150px", color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }}>
                      <option key="" enable selected value="">Select Event Date</option>
                      {events.map(e => (<option key={e.id} value={e.id}>{this.date(e.date)}</option>))}
                    </select>
                  </div>
                </div>
          <div className="form-group" style={{ marginBottom: 30 }}>
                  <input id="subject" type="text" placeholder="Email Subject" className="form-control" name="subject" onChange={this.handleChange} style={{ marginLeft: "-1px", width: "460px", color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }} />
                </div>
                <ReactQuill name="msgBody" value={this.state.content} onChange={this.handleChanges} placeholder="Write your mail message here!" theme="snow" style={{
                  lineHeight: "0px",
                  color: "darkgray"
                }} />
                <br />
                <div className="mt-4">
                  <button style={{ marginRight: "20px", marginLeft: "10px" }} id='button-web' onClick={this.handleSend}>SEND</button>
                  <button id='button-web' style={{ marginLeft: '-2px' }} onClick={this.onreset}>RESET</button>
                  <button id='button-web' style={{ marginLeft: '15px' }} onClick={this.onexit}>EXIT</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="App">
        {loading && <header className="App-header" style={{ position: "fixed", top: "30%", left: "58%" }}>
          <img src="./tabicon.png" className="App-logo" alt="logo" />
        </header>}
      </div>
   


    </>)
  }

}




