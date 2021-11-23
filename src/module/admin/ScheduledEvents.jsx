import React from 'react';
import adminService from '../../service/admin_related_services/Event';
import Table from '../../Table/table'
import './ScheduledEvents.css'
import Alert from 'react-s-alert';
import security from '../../utils/EncryptionDecryption'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import ScheduleMeeting from './ScheduleMeeting';

class ScheduledEvents extends React.Component {
    constructor() {
        super()

        this.state = {
            columns: [{
                text: <>Name <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
                dataField: "meeting_name",
                sort: true
            },
            {
                text: <>Event Date <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
                dataField: "date",
                sort: true
            },
            {
                text: <>Start Time <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
                dataField: "start_time", sort: true
            },
            {
                text: <>End Time <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
                dataField: "end_time", sort: true
            },
           
            {
                text: <>Moderator Link </>,
                dataField: "moderator_link"
            }

            ],
            checked: '',
            eventList: [],
            view: 0, link: '',status:true
        }
    }


    componentDidMount = async () => {
        this.show()

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.show()
        }
    }

    show = async () => {
        try {
            
            const res = await adminService.getAllEvents()
            for (var i = 0; i < res.length; i++) {
                let link = res[i].moderator_link
                res[i].moderator_link = <button  id="button-web" style={{  fontSize: "15px" }} value={res[i].moderator_link} onClick={() => this.JoinAsModerator(link)}>Join As Moderator</button>
            }
            if (res.length > 0)
                this.setState({ eventList: res })
            else
                this.setState({ view: 1 })

        }
        catch (error) {
            this.setState({ view: 2 })
            Alert.error("Connection Refused!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 4000,
                offset: 100
              });
        }


    }


   

    JoinAsModerator =  (link) => {
       
            confirmAlert({
                title: 'Confirm to Join',
                message: 'Are You Sure You want to  join',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async()=>{
                            try{
                                let id;
                                const res = await adminService.getAllEvents()
                               
                                for (var i = 0; i < res.length; i++) {
                                    if(res[i].moderator_link===link)
                                    {
                                         id= res[i].id
                                        
                                    }
                                }

                                const event = await adminService.getEventById(id)
                                event["status"] = true
                                 await adminService.updateEventStatus(id, security.encrypt(event))
                    
                            }catch( e){
                    
                            }
                            
                           
                            window.location=link

                            
                            
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => <ScheduleMeeting/>
                    }
                ]
            });
        

    }
    render() {

        return (
            <>
          
                {this.state.eventList.length > 0 && <Table columns={this.state.columns} data={this.state.eventList} />}
           
                
            </>
        )
    }
}
export default ScheduledEvents