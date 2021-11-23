import React from 'react';
import './loader.css'
import Events from '../../service/admin_related_services/Event';
import ScheduledEvents from './ScheduledEvents';
import './ScheduleMeeting.css'
import '../../css/button.css'
import Alert from 'react-s-alert';
import security from '../../utils/EncryptionDecryption'


class ScheduleMeeting extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            message: "",
            meeting: {
                start_time: '',
                end_time: '',
                date: '',
                meeting_name: '',

                loading: false
            }
        }

    }

    reset = () => {

        this.setState({
            meeting: {
                start_time: '',
                end_time: '',
                date: '',
                meeting_name: '',
                loading: false
            }
        })
    }
    scheduleMeeting = async (e) => {
        this.setState({ loading: true })
        e.preventDefault();
        const { meeting } = this.state;
        delete meeting["loading"]
        const regex = meeting.date && meeting.start_time && meeting.end_time && meeting.meeting_name.trim()
        var letters = /^[a-zA-Z\s]*$/;
        try {
            if (!regex) {
                Alert.warning('Please fill all input fields!!!', {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 4000,
                    offset: 100
                });
                this.setState({ loading: false })

            }
            else if (!meeting.meeting_name.match(letters)) {
                Alert.warning('Event Name should contain characters only!!!', {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 4000,
                    offset: 100
                });
                this.setState({ loading: false })
            }
            else {
                const data = await Events.scheduleEvent(security.encrypt(meeting))
                Alert.success(data.msg, {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 4000,
                    offset: 100
                });
                if (data) {
                    this.setState({ loading: false })
                    this.setState({
                        meeting: {
                            start_time: '',
                            end_time: '',
                            date: '',
                            meeting_name: '',
                        }
                    })

                }

            }
        }
        catch (error) {

            Alert.error(error.msg, {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 4000,
                offset: 100
            });
            this.setState({ loading: false })

        }


    }



    handleChange = (e) => {
        const { meeting } = this.state;
        meeting[e.currentTarget.name] = e.currentTarget.value
        this.setState({ meeting });


    }

    exit = () => {
        window.location = "/admin"
    }

    render() {
        const { meeting, message, loading } = this.state
        return (   <>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="./admin">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">ScheduleMeeting</li>
            </ol>

            <div className="App" style={{ marginTop: "10px", marginLeft: "50%" }}>
                {loading && <header className="App-header">
                    <img src="./tabicon.png" className="App-logo" alt="logo" />
                </header>}
            </div>

            <div style={{ opacity: `${loading ? "0.3" : "1"}`}}>
                <div className="row">
                    <div className="col-lg-12">
                        <div style={{ width: "100%" }}>
                            <div className="card mx-auto" style={{ width: "500px", background: "#fff", borderRadius: "2px" }}>
                                <div style={{ backgroundColor: "#eaecf4", textAlign: "center", width: "498px", height: "60px", paddingTop: "6px", paddingBottom: "4px" }}><h3 style={{ color: "#757575 ", fontSize: "30px", marginTop: '5px' }}>SCHEDULE MEETING</h3></div>
                                <div style={{ marginTop: '8px' }}>  <h5 className="text-success text-center" id="msg" >{message}</h5></div>
                                <div className="card-body" style={{ padding: '30px' }}>
                                    <form>
                                        <div className='row' id='row-1'>
                                            <div className='col-4' id='colm1'>
                                                <span style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px" }}> Event Date:</span>
                                            </div>
                                            <div className='col-8'>
                                                <input type="date" name="date" className="form-control myform" id="datecontrol" min={new Date().toISOString().split('T')[0]}
                                                    value={meeting.date} required style={{ color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className='row' id='row-2'>
                                            <div className='col-4' id='colm1'>
                                                <span style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px" }}>Start Time :</span>
                                            </div>
                                            <div className='col-8'>
                                                <input name="start_time" className="form-control" type="time"
                                                    value={meeting.start_time} style={{ color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }} onChange={this.handleChange} required />
                                            </div>

                                        </div>
                                        <div className='row' id='row-3'>
                                            <div className='col-4' id='colm1'>
                                                <span style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px" }}>End Time :</span>
                                            </div>
                                            <div className='col-8'>
                                                <input name="end_time" className="form-control" type="time"
                                                    value={meeting.end_time} style={{ color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }} onChange={this.handleChange} required /></div>

                                        </div>
                                        <div className='row' id='row-4'>
                                            <div className='col-4' id='colm1'>
                                                <span style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px" }}>Event Name :</span>

                                            </div>
                                            <div className='col-8'>
                                                <input name="meeting_name" className="form-control"
                                                    value={meeting.meeting_name} style={{ color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }} onChange={this.handleChange} placeholder='Event Name' required />

                                            </div>
                                        </div>

                                        <div className='row' id='row-5'>
                                            <div className='col-4'>
                                                <button id='button-web' style={{ marginLeft: '0px' }} onClick={this.scheduleMeeting}> SAVE </button>
                                            </div>
                                            <div className='col-4'>
                                                <button type='reset' id='button-web' style={{ marginLeft: '0px' }} onClick={this.reset}>RESET</button>
                                            </div>
                                            <div className='col-4'>
                                                <button id='button-web' style={{ marginLeft: '0px' }} onClick={this.exit}>EXIT</button>
                                            </div>

                                        </div>


                                    </form>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <ScheduledEvents />
            </div>
          
        </>



        )
    }
}
export default ScheduleMeeting;
