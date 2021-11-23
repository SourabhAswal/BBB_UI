import React from 'react';
import './register.css';
import userService from '../../service/user_related_services/Users_Service';
import '../admin/loader.css'
import Alert from 'react-s-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Login from './Login';
import { Link } from 'react-router-dom'
import security from '../../utils/EncryptionDecryption';

class Register extends React.Component {
  constructor() {
    super()
    this.state = {
      user: { userName: '', email: '', contact: '', mid: '' },
      event_id: '',
      message: "", msg: "", loading: false, view: 0
    }

  }
  componentDidMount = () => {
    sessionStorage.clear();
    const event_id = localStorage.getItem("mid")
    this.setState({ event_id })
  }

  changeHandler = e => {
    let { user } = this.state;
    user[e.target.name] = e.target.value
    this.setState({ user })
  }
  handleSubmit = async e => {
    this.setState({ loading: true })
    e.preventDefault();
    const { user, event_id } = this.state;
    user["mid"] = event_id

    try {
      const data = await userService.register(security.encrypt(user))
      if (data != null) {
        this.setState({ loading: false })
      }
      Alert.success(data.msg, {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 3000,
        offset: 100
      });
      this.setState({ user: { userName: '', email: '', contact: '', mid: '' } })

    }

    catch (err) {
      if (err.msg)
        Alert.warning(err.msg, {
          position: 'top-right',
          effect: 'slide',
          beep: true,
          timeout: 3000,
          offset: 100
        });
      else
        Alert.error("Unable to connect to network!!!", {
          position: 'top-right',
          effect: 'slide',
          beep: true,
          timeout: 3000,
          offset: 100
        });
      this.setState({ loading: false })

    }

  }


  onchangepagetologin = () => {
    this.setState({ view: 1 })
  }

  render() {
    const { user, message, loading } = this.state;
    return (<>
      <div>
        {this.state.view === 1 && <Login />}
      </div>


      {this.state.view === 0 && <>

        <div className="row myrow" >
          <div className="col-8" style={{ background: "url('/bg-2.jpg')", backgroundSize: "cover" }}>
            <div className="logo2" style={{ fontSize: "1 rem" }}><img src="/logotwhite.png" height="36.8" width="137.98" alt="logo" style={{ float: "left" }} /></div>
            <div className="background-img">
              <div className="coding" style={{ marginTop: '390px', textAlign: "center" }}>
                <h1 style={{ fontSize: "4rem", color: 'white' }}><em>CODING </em><span><h1 style={{ display: "inline", color: "rgb(254, 203, 50)", fontSize: "4rem" }}><em>BOOTCAMP</em></h1></span></h1>
              </div>
            </div>
          </div>
          <div className="col-4" style={{ backgroundColor: "#fff" }} >
            <div className="register-login-box"  >
              <p className="login-wrapper-signup-text">Have an account?<Link to="/login"><span style={{ color: "#22b1ed", cursor: "pointer" }}> Login here</span></Link></p>
              <div className="title" >Sign Up</div>
              <p id="success">{message}</p>
              <div style={{ opacity: `${loading ? "0.3" : "1"}` }}>
                <form onSubmit={this.handleSubmit}>
                  <div className="uname">
                    <input type="text" name="userName" value={user.userName} className="user-input" placeholder="Full Name" onChange={this.changeHandler} />
                  </div>
                  <div className="email1">
                    <input type="email" name="email" value={user.email} className="email-input" placeholder="Email address" onChange={this.changeHandler} />
                  </div>
                  <div className="contact1">
                    <input type="text" name="contact" value={user.contact} className="contact-input" placeholder="Mobile Number" onChange={this.changeHandler} />
                  </div>
                  <div>
                    <button type="submit" className="action-btn"> Register</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="App" style={{ position: "fixed", top: "110px", left: "46%" }}>
              {loading && <header className="App-header">
                <img src="/tabicon.png" className="App-logo" alt="logo" />
              </header>}
            </div>
          </div>
        </div>
      </>


      }





    </>
    )
  }
}
export default Register