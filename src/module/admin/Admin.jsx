import React, { Component } from 'react'

import 'font-awesome/css/font-awesome.min.css';

import ShowFeedback from './ShowFeedback';
import ScheduleMeeting from './ScheduleMeeting';

import UploadFiles from './UploadFiles';

import EmailForm from './SetMailDescription';
import { NavLink } from 'react-router-dom';
import UploadSpeaker from './UploadSpeaker';
import User from './User';
import './admin_sidebar.css'
import Footer from './Footer';


export default class Admin extends Component {


  constructor(props) {
    super(props)

    this.state = {
      view: -1
    }

  }
  componentDidMount() {
    document.getElementById('logo2').style.display = 'none'
    document.getElementById('accordionSidebar').classList.add('toggled')
    document.getElementById('logo1').style.display = 'block'
  }
  changeView = (view) => {
    //  document.getElementById(view).style.color="#90a3ef"
    this.setState({ view })
    for (var i = 0; i < 6; i++) {

      if (i + 1 === view) {
        document.getElementById(i + 1).parentNode.classList.add('active')
      }
      else {
        document.getElementById(i + 1).parentNode.classList.remove('active')

      }
    }


  }
  logo() {
    if (document.getElementById('logo2').style.display === 'block') {
      document.getElementById('logo2').style.display = 'none'
      document.getElementById('accordionSidebar').classList.add('toggled')
      document.getElementById('logo1').style.display = 'block'

    }
    else {
      document.getElementById('accordionSidebar').classList.remove('toggled')
      document.getElementById('logo2').style.display = 'block'
      document.getElementById('logo1').style.display = 'none'
    }
  }
  render() {
    const { view } = this.state
    return (<>
      <div>
        <div id="page-top" style={{ position: "relative" }}>
          <div id="wrapper">

            <ul class="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
              <a  class="sidebar-brand d-flex align-items-center justify-content-center">
                <div class="sidebar-brand-icon">
                  <img id="logo2" alt='logo' src="iconrc.png" style={{ display: 'block', position: "fixed", top: "3%" }} />
                  <img id="logo1" alt='logo' src="img/logo/logo-2.png" className='ml-2' style={{ display: 'none', position: "fixed", top: "3%" }} />
                </div>

              </a>
              {/* <hr class="sidebar-divider my-0" /> */}
              <li className="nav-item active dashboard" style={{ textDecoration: "none", position: "fixed", top: "11%" }}>
                <a class="nav-link" id="dashboard" href="/admin" >
                  <i class="fas fa-fw fa-tachometer-alt" style={{ color: "gray" }}></i>
                  <span style={{ color: "#22b1ed" }}>Dashboard</span></a>
              </li>
              {/* <hr class="sidebar-divider" /> */}
              <div class="sidebar-heading" style={{ position: "fixed", top: "21%" }}>
                Features
              </div>


              <li class="nav-item" style={{ position: "fixed", top: "32%" }}>
                <NavLink class="nav-link" id="2" activeClassName="is-active" to="#" onClick={() => this.changeView(2)}>
                  <i class="fa fa-calendar my-ic"></i>
                  <span style={{ marginLeft: "5px", fontSize: "14px", fontFamily: " 'Rubik', sans-serif" }}>  Schedule Meeting</span>
                </NavLink>
              </li>

              <li class="nav-item" style={{ position: "fixed", top: "25%" }}>
                <NavLink class="nav-link" id="4" activeClassName="active" exact to="#" onClick={() => this.changeView(4)} >
                  <i id="test" class="fa fa-user my-ic"></i>
                  <span style={{ marginLeft: "5px", fontSize: "14px", fontFamily: " 'Rubik', sans-serif" }}>   Users</span>
                </NavLink>
              </li>

            

              <li class="nav-item " style={{ position: "fixed", top: "39%" }}>
                <NavLink class="nav-link " id="3" to="#" onClick={() => this.changeView(3)}>
                  <i class="fa fa-upload my-ic"></i>
                  <span style={{ marginLeft: "5px", fontSize: "14px", fontFamily: " 'Rubik', sans-serif" }}>  Upload Files</span>
                </NavLink>
              </li>


              <li class="nav-item" style={{ position: "fixed", top: "46%" }}>
                <NavLink class="nav-link" id="1" to="#" onClick={() => this.changeView(1)}>
                  <i class="fa fa-comments my-ic"></i>
                  <span style={{ marginLeft: "5px", fontSize: "14px", fontFamily: " 'Rubik', sans-serif" }}>  Feedback Management</span>
                </NavLink>
              </li>
              <li class="nav-item" style={{ position: "fixed", top: "53%" }}>
                <NavLink class="nav-link" id="5" to="#" onClick={() => this.changeView(5)}>
                  <i class="fa fa-paper-plane my-ic"></i>
                  <span style={{ marginLeft: "5px", fontSize: "14px", fontFamily: " 'Rubik', sans-serif" }}>  Email Notification</span>
                </NavLink>
              </li>

              <li class="nav-item" style={{ position: "fixed", top: "60%" }}>
                <NavLink class="nav-link" id="6" to="#" onClick={() => this.changeView(6)}>
                  <i class="fa fa-sign-in my-ic"></i>
                  <span style={{ marginLeft: "5px", fontSize: "14px", fontFamily: " 'Rubik', sans-serif" }}>  Upload Speaker</span> 
                </NavLink>
              </li>
              {/* <hr class="sidebar-divider" /> */}

            </ul>
            <div id="content-wrapper" style={{ position: "relative" }} class="d-flex flex-column">
              <div id="content">

                <nav class="navbar navbar-expand navbar-light bg-navbar topbar " style={{  top: "0", width: "100%" }}>
                  <button onClick={this.logo} id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                  </button>
                  {/* <h5  style={{margin:"350px",color:"#fff",fontSize:"30px",fontWeight:"700",}}>Welcome to Admin </h5> */}
                  {/* <a class="nav-link dropdown-toggle" href="#" id="userDropdown"  aria-haspopup="true" aria-expanded="false"> */}
                  <div style={{ position: "fixed", left: "88%" }}>

                    <img class="img-profile rounded-circle" alt='' src="img/undraw_profile.svg" style={{ height: "2rem", width: "2rem", border: "0px" }} />
                    <span class="ml-2 d-none d-lg-inline text-white small">Admin</span>
                  </div>

                </nav>



                {/* <div class="ScrollStyle" style={{maxHeight:"auto",overflowY:"scroll"}}> */}
                {view === -1 && <img src='/5.jfif' style={{ width: "100%", position: "fixed", marginTop: 0 }} alt="new" />}
                {view !== -1 && <div><br /><br /></div>}


                {view === 2 && <ScheduleMeeting />}

                {view === 3 && <UploadFiles />}

                {view === 1 && <ShowFeedback />}
                {view === 4 && <User />}
                {view === 5 && <EmailForm />}

                {view === 6 && <UploadSpeaker />}
                {/* </div> */}
               

              </div>
              <Footer />
            </div>


          </div>

        </div>
        
      </div>

    </>)
  }
}




