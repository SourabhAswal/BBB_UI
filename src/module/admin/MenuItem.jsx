import React from 'react'

import 'font-awesome/css/font-awesome.min.css';
import * as $ from "jquery";
import ShowFeedback from './ShowFeedback';
import ScheduleMeeting from './ScheduleMeeting';

import UploadFiles from './UploadFiles';

import EmailForm from './SetMailDescription';
import { NavLink,Link } from 'react-router-dom';
import UploadSpeaker from './UploadSpeaker';
import User from './User';
import './admin_sidebar.css'
import Footer from './Footer';

class MenuItem extends React.Component{
state={view:-1}

async componentDidMount() {
  $(".sidebar").toggleClass("toggled", true);
  $("sidebarToggle, #sidebarToggleTop").on("click", function (e) {
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $(".sidebar .collapse").removeClass("show");
    }
  });

// componentDidMount() {
//   document.getElementById('logo2').style.display = 'none'
//   document.getElementById('accordionSidebar').classList.add('toggled')
//   document.getElementById('logo1').style.display = 'block'
}
changeView = (view) => {
  //  document.getElementById(view).style.color="#90a3ef"
  this.setState({ view })
 


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
    render(){
      const {view}=this.state
        return  <div style={{ width: "100vw", height: "100vh" }}>
        <div id="wrapper">
          {/*---------------------- sidebar --------------------------------*/}
          <div id="accordionSidebar">
            <ul className="navbar-nav sidebar sidebar-light accordion">
              <a
                class="sidebar-brand d-flex align-items-center justify-content-center"

              >
                
                <div class="sidebar-brand-icon">
                  <img src="iconrc.png" className="logo-1" id="logo1" />
                  <img src="img/logo/logo-2.png" className="logo-2" id="logo2" />
                </div>
              </a>
              <hr className="sidebar-divider my-0" />
              <li className="nav-item">
                
                        <NavLink className="nav-link" to="/admin" activeStyle={{ color: "#3abaf4" }}>
                          {/* <i className={dash.i}></i> */}
                          <i className="" style={{ color: '#ffc107' }}></i>
                          <span>Dashboard</span>
                        </NavLink>
                     
              </li>
              <hr className="sidebar-divider" />
              <div className="sidebar-heading">Features</div>


            
             <li class="nav-item">
                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#adminRoles"
                  aria-expanded="true" aria-controls="collapseBootstrap">
                  <i class="fa fa-user"></i>
                  <span>Event Related</span>
                </a>
                <div id="adminRoles" class="collapse" aria-labelledby="headingBootstrap" data-parent="#accordionSidebar">
                  <div class="bg-white py-2 collapse-inner rounded">
                    <h6 class="collapse-header">Admin Roles</h6>
                    <Link class="collapse-item"  onClick={()=>this.changeView(1)} style={{color:view===1?"#22b1ed":"black"}}>Schedule Meeting</Link>
                    <Link class="collapse-item"  onClick={()=>this.changeView(2)} style={{color:view===2?"#22b1ed":"black"}}>Upload Speaker</Link>
                    <Link class="collapse-item"  onClick={()=>this.changeView(4)} style={{color:view===4?"#22b1ed":"black"}}>Event Users</Link>
                    <Link class="collapse-item"  onClick={()=>this.changeView(3)} style={{color:view===3?"#22b1ed":"black"}}>Email Notification</Link>
                    <Link class="collapse-item"  onClick={()=>this.changeView(5)} style={{color:view===5?"#22b1ed":"black"}}>Show Feedback</Link>
                  </div>
                </div>
              </li>

              
              <li class="nav-item">
                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#speakerRoles"
                  aria-expanded="true" aria-controls="collapseBootstrap">
                  <i class="fa fa-user"></i>
                  <span>Speaker Roles</span>
                </a>
                <div id="speakerRoles" class="collapse" aria-labelledby="headingBootstrap" data-parent="#accordionSidebar">
                  <div class="bg-white py-2 collapse-inner rounded">
                    <h6 class="collapse-header">Speaker Roles</h6>
                    <Link class="collapse-item"  onClick={()=>this.changeView(7)} style={{color:view===7?"#22b1ed":"black"}}>Join Event</Link>
                    <Link class="collapse-item"  onClick={()=>this.changeView(6)} style={{color:view===6?"#22b1ed":"black"}}>Upload Files</Link>

                  </div>
                </div>
              </li>

              <hr className="sidebar-divider" />
            </ul>
          </div>
          <div
            id="content"
            style={{ width: "100vw", overflowY: "auto", overflowX: 'hidden', height: "100vh" }}
          >
            <nav className="navbar navbar-expand navbar-light bg-navbar topbar sticky-top">
              <button
                id="sidebarToggleTop"
                className="btn btn-link rounded-circle mr-3"
              >
                <i className="fa fa-bars"></i>
              </button>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow">
                  <div
                    className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                    aria-labelledby="searchDropdown"
                  >
                   
                  </div>
                </li>
                <div className="topbar-divider d-none d-sm-block"></div>
                <li className="nav-item dropdown no-arrow mx-5">
               
                          <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="userDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <img
                              className="img-profile rounded-circle"
                              src="img/undraw_profile.svg"
                              style={{ maxWidth: "60px" }}
                            />
                         
              </a>
                </li>
              </ul>
            </nav>
        


            {view === -1 && <img src='/5.jfif' style={{ width: "100%", position: "fixed", marginTop: 0 }} alt="new" />}
                {view !== -1 && <div><br /><br /></div>}


                {view === 1 && <ScheduleMeeting />}
                {view === 2 && <UploadSpeaker />}
                {view === 3 && <EmailForm />}
                {view === 4 && <User />}
                {view === 5 && <ShowFeedback />}
                {view === 6 && <UploadFiles />}
                {view === 7 && <ScheduleMeeting />}

            </div>
      </div>
    </div>
        
       

        
     
        
        
        
        
        
        
        
    }


}
export default MenuItem