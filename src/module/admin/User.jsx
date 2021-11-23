import React from 'react';
import RegisteredUsers from './RegisteredUsers';
import UsersList from './UsersList';
import '../../css/button.css'
import Footer from './Footer';



export default class User extends React.Component {

  constructor(props) {

    super(props)
    this.state = {
      test: 0,

      arrregistered: [], arrloggedin: [], arrevent: [], mid: ''
    }
  }



  handleChange = e => {

    let { mid } = this.state
    mid = e.target.value;
    this.setState({ mid })

  }




  getregistereduserlist = () => {
    // document.getElementById("divfoot").style.display="none"
    this.setState({ test: 1 })
  }


  getlogineduserlist = () => {
    // document.getElementById("divfoot").style.display="none"
    this.setState({ test: 2 })

  }



  render() {
    return (<><div >

      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="./admin">Home</a></li>
        <li class="breadcrumb-item active" aria-current="page">User</li>
      </ol>
      <div className="row">
        <div className="col-lg-12">
          <div id="usdiv" style={{ marginTop: "40px" }}>
            <div className="card mx-auto " style={{ width: "400px", height: "auto", borderRadius: '5px', marginBottom: "25px", marginTop: "1%", marginLeft: '5000px !important' }}>
              <div className="header">
                <div className="card-header text-center" style={{ backgroundColor: "#eaecf4" }}><h2 style={{ color: "#6e707e", marginLeft: '90px' }}>User Details</h2></div>
              </div>
              <div style={{ marginLeft: "50px" }} >
                <button type="button" id='button-web' style={{ marginLeft: "-5px", marginTop: "40px", marginBottom: "18px" }} onClick={this.getregistereduserlist}>Registered</button>
                <button type="button" id='button-web' style={{ marginLeft: "40px", marginTop: "40px", marginBottom: "18px" }} onClick={this.getlogineduserlist} > Attendees </button>
              </div>
            </div>
          </div>
        </div>
      </div><br/>
        <br/>
        <br/>
      {this.state.test === 2 && <UsersList />}
      {this.state.test === 1 && <RegisteredUsers />}
    </div>
    </>)

  }

}





