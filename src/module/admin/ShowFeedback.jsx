import React from 'react';
import adminService from '../../service/admin_related_services/Event';
import userDetails from '../../service/admin_related_services/User_Details';
import Table from '../../Table/table'
import ReactToPrint from 'react-to-print';
import '../../css/button.css'
import Alert from 'react-s-alert';
export default class ShowFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          text: <>Name  <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
          dataField: 'userName',
          sort: true



        },
        {
          text: <>Email  <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,

          dataField: 'email',
          sort: true



        },
        {
          text: <>Feedback</>,
          dataField: 'feedback',

        },
        {
          text: <>Event date <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
          dataField: 'date',
          sort: true

        },
      ],
      rows: [],
      arr: [], mid: '', btnview: true
    }
  }

  onreset = () => {
    this.setState({ rows: [], mid: '' })
    this.setState({ btnview: true })

  }

  componentDidMount = async () => {
    try {
      const eventArray = await adminService.getAllEvents()
      const feedbackArray = await userDetails.get_Feedbacks()
      let { arr } = this.state
      arr = eventArray.map(function (e, i) {
        return { "eventDate": e.date, feedbackAr: feedbackArray.filter(f => f.event.id === e.id) }
      })
      this.setState({ arr })


    }
    catch (er) {
      Alert.error("Connection Refused!!!", {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 4000,
        offset: 100
      });
    
    }
  }

  onexit() {
    window.location = "/admin"
  }

  handleChange = e => {

    let { rows, arr } = this.state
    let { mid } = this.state
    mid = e.target.value;
    for (var i = 0; i < this.state.arr.length; i++) {
      if (this.state.arr[i].eventDate === mid) {
        if (this.state.arr[i].feedbackAr.length > 0) {
          this.setState({ btnview: false })
          rows = arr[i].feedbackAr
          document.getElementById("tableprint").style.display = "block"
        }

        else {
          this.setState({ btnview: true })

          Alert.warning("No data found", {
            position: 'top-right',
            effect: 'slide',
            beep: true,
            timeout: 3000,
            offset: 100
          });
          document.getElementById("tableprint").style.display = "none"
        }





      }
    }
    for (let i = 0; i < rows.length; i++)
      rows[i].date = mid
    this.setState({ rows, mid })


  }

  date = (d) => {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var date = new Date(d);
    var monthName = months[date.getMonth()];

    return d.substring(8, 10) + " " + monthName + "," + d.substring(0, 4);
  }



  render() {
    const { mid, arr, columns, rows, btnview } = this.state
    console.log(arr)
    return (<>
     
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="./admin">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">Feedback Management</li>
        </ol>
    
      <div className="row" >
        <div className="col-lg-12" >
          <div id="usdiv" style={{ marginTop: "40px" }} >
            <div className="card mx-auto " style={{ width: "500px", height: "190px", borderRadius: '5px', marginBottom: "25px", marginTop: "1%" }}>
              <div className="header">
                <div className="card-header text-center" style={{ backgroundColor: "#eaecf4" }}><h2 style={{ color: "#6e707e", marginLeft: '120px' }}>User Feedback</h2></div>
              </div>
              <div className="d-flex" style={{ marginTop: "15px", width: "1500px", marginLeft: "10%" }}>
                <div style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px", marginTop: "12px" }}>Event Date:</div>
                <div className="1"><select name="mid" value={mid} onChange={this.handleChange} className="form-control" style={{ marginLeft: "39px", color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }}>
                  <option value="" disabled> Event Date</option>
                  {arr.map(e => <option value={e.eventDate} key={e.eventDate}>{this.date(e.eventDate)}</option>)}


                </select></div>
              </div>
              <div className="mt-4">

                <ReactToPrint
                  trigger={() => <button id='button-web' disabled={btnview} >PRINT</button>}
                  content={() => this.componentRef}
                />
                <div style={{ display: "none" }}><Table columns={columns} data={rows} ref={el => (this.componentRef = el)} /></div>
                <button id='button-web' style={{}} onClick={this.onreset}>RESET</button>
                <button id='button-web' onClick={this.onexit}>EXIT</button>
              </div>
            </div>
          </div>
          <div id="tableprint">
            {mid && <Table columns={columns} data={rows} />}
          </div>
        </div>
      </div>

    </>)

  }



}







