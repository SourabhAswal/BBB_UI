import React from 'react';
import adminService from '../../service/admin_related_services/Event';
import userDetails from '../../service/admin_related_services/User_Details';
import Table from '../../Table/table';
import ReactToPrint from 'react-to-print';
import '../../css/button.css';
import Alert from 'react-s-alert';
export default class RegisteredUsers extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          text: <>Name  <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
          sort: true,
          dataField: 'userName',



        },
        {
          text: <>Email <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
          sort: true,
          dataField: 'email',
          


        },
        {
          text: <>Contact<span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
          dataField: 'contact',
          sort: true


        },
        {
          text: <>Event date </>,
          dataField: 'date',



        },
      ],
      rows: [],
      arr: [], mid: '',btnview:true
    }
  }


  componentDidMount = async () => {
    try {

      const users = await userDetails.get_Registered_Users()
      const eventArray = await adminService.getAllEvents()
      let { arr } = this.state
      arr = eventArray.map(function (e, i) {
        return { "eventDate": e.date, UserArray: users.filter(u => u.event.id === e.id) }
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


  handleChange = e => {
    let { rows, arr } = this.state
    let { mid } = this.state
    mid = e.target.value;
    for (var i = 0; i < this.state.arr.length; i++) {
      if (this.state.arr[i].eventDate === mid) {
        if(this.state.arr[i].UserArray.length>0){
          this.setState({btnview:false})
          rows = arr[i].UserArray
          document.getElementById("tableprint").style.display="block"
        }
        
        else
        {
          this.setState({btnview:true})
          Alert.warning("No data found", {
            position: 'top-right',
            effect: 'slide',
            beep: true,
            timeout: 3000,
            offset: 100
          });
          document.getElementById("tableprint").style.display="none"
        }
      }
    }
    for (let i = 0; i < rows.length; i++)
      rows[i].date = mid
    this.setState({ rows, mid })
    
   

  }

  onreset = () => {
    this.setState({ rows: [], mid: '' })
    this.setState({btnview:true})

  }

  date=(d)=>{
		var  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		var date = new Date(d);
		var monthName=months[date.getMonth()];
		return d.substring(8,10)+" "+monthName+","+d.substring(0,4);
	}

  render() {
    const { mid, arr, rows, columns ,btnview } = this.state
   
    return (

      <div >
        <div id="usdiv"  >
          <div className="card mx-auto " style={{ width: "400px", height: "170px", borderRadius: '5px', marginBottom: "25px", marginTop: "1%", marginLeft: '5000px !important' }}>
            <div className="header">
              <div className="card-header text-center" style={{ backgroundColor: "#eaecf4" }}><h2 style={{ color: "#6e707e" , marginLeft :'65px'}}>Registered Users</h2></div>
            </div>
            <div className="d-flex" style={{ marginTop: "15px", width: "1500px", marginLeft: "10%" }}>
              <div style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px", marginTop: "10px" }}>Event Date:</div>
              <div><select name="mid" value={mid} onChange={this.handleChange} className="form-control" style={{ marginLeft: "39px", color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }}>
                <option value="" disabled > Event Date</option>
                {arr.map(e => <option value={e.eventDate} key={e.eventDate}>{this.date(e.eventDate)}</option>)}


              </select></div>

            </div>
            <div style={{ marginLeft: "20px" }} >
              <ReactToPrint
                trigger={() => <button type="button" disabled={btnview} style={{ marginLeft: "30px", marginTop: "20px", marginBottom: "18px" }} id="button-web"  >Print </button>}
                content={() => this.componentRef}
              />
              <button id='button-web' style={{}} onClick={this.onreset}>RESET</button>
              
              <div style={{ display: "none" }}><Table columns={columns} data={rows} ref={el => (this.componentRef = el)} /></div>
              

            </div>


          </div>

        </div><div className="ml-3" id="tableprint">
          {mid && <Table columns={columns} data={rows} />}
        </div>
        
        {/* <br/>
        <br/>
        <br/>
        <Footer/> */}
      </div>

    )

  }

}

