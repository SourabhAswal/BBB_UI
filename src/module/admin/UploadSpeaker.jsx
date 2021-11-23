import React from 'react'
import './loader.css'
import './UploadSpeaker.css'
import Event from '../../service/admin_related_services/Event'
import imageToBase64 from 'image-to-base64/browser'
import Table from '../../Table/table'
import Alert from 'react-s-alert';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import '../../css/button.css'
import security from '../../utils/EncryptionDecryption'


class UploadSpeaker extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            confirm: false,
            prevSlot: '',

            sp: {
                sName: "",
                sRole: "",
                sImage: "",
                rating: 5,
                eventId: '',
                timeslot: '', count: 1
            },
            Speaker: [],
            idOfspeaker: '',
            events: [],
            view: 0,
            changeSlotView: 0,
            columns: [
                {
                    text: <> Name <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,

                    dataField: 'sName', sort: true


                },

                {
                    text: <> Topic <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,

                    dataField: 'sRole', sort: true


                },
                {
                    text: <> Image </>,
                    dataField: 'sImage',


                },
                {
                    text: <>Allot / Allotted Slot</>,
                    dataField: 'timeslot',



                },
                {
                    dataField: "update",
                    text: "Update",


                },
                {
                    dataField: "remove",
                    text: "Delete",


                },
            ],
        }
    }

    sortValue = (obj1, order) => {
        var obs = obj1.map(obj =>


        ({
            sImage: obj.sImage,
            id: obj.id,
            sName: obj.sName,
            eventId: obj.eventId,
            sRole: obj.sRole,
            timeslot: obj.timeslot.split("-")[0].split(":")
        })
        )

        for (let i = 1; i < obs.length; i++) {
            for (let j = i - 1; j > -1; j--) {

                if (order === 'asc') {
                    if (+obs[j + 1].timeslot[0] < +obs[j].timeslot[0]) {
                        [obs[j + 1], obs[j]] = [obs[j], obs[j + 1]];
                    }
                    else if (+obs[j + 1].timeslot[0] === +obs[j].timeslot[0]) {
                        if (+obs[j + 1].timeslot[1] < +obs[j].timeslot[1])
                            [obs[j + 1], obs[j]] = [obs[j], obs[j + 1]];
                    }
                }

                else {
                    if (+obs[j + 1].timeslot[0] > +obs[j].timeslot[0]) {
                        [obs[j + 1], obs[j]] = [obs[j], obs[j + 1]];
                    }
                }

            }
        }
        return obs;


    }







    handleSort = async () => {
        try {
            var arr = await Event.getSpeakerByEvent(this.state.sp.eventId);
            let ress = this.sortValue(arr, "asc");
            let res = ress.map(obj => arr.find(obj1 => obj1.id === obj.id))

            for (let i = 0; i < res.length; i++) {
                res[i].remove = <button style={{ color: "white", backgroundColor: "#22b1ed", fontSize: "15px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem", padding: "10px 20px 10px 15px" }} onClick={() => this.removeSpeaker(res[i].id)}>Delete</button>
                res[i].update = <a href="#sp-div"><button style={{ color: "white", backgroundColor: "#22b1ed", fontSize: "15px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem", padding: "10px 20px 10px 15px" }} onClick={() => this.updateSpeaker(res[i].id)}>Update</button></a>
                res[i].sImage = <img alt='speaker' src={`${res[i].sImage}`} height="70" width="70" />
                res[i].timeslot =

                    this.state.changeSlotView === 1 && this.state.idOfspeaker === res[i].id ?
                        (
                            <form className="form-inline ml-4" onSubmit={this.handleSlot}>
                                <div className="d-flex">
                                    <div>
                                        <input name="timeslot" id="slotValue" className="form-control" type="text"
                                            placeholder="hh:mm-hh:mm" style={{ color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem", width: "120px" }} onChange={this.changeHandler} />
                                    </div>

                                    <div>
                                        <button type="submit" onClick={() => this.handleSlotView(0, res[i].id)} className="btn btn-info ml-3" style={{ borderRadius: 50, color: "white", backgroundColor: "#22b1ed", fontSize: "15px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)" }} placeholder="00:00-00:00">Save</button>
                                    </div></div>

                            </form>
                        )

                        :

                        <div className="d-flex">

                            {res[i].timeslot ? <p style={{ width: "145px" }}>{res[i].timeslot}</p> : <p style={{ width: "145px" }}>No slot allotted</p>}
                            <p> <button onClick={() => this.handleSlotView(1, res[i].id)} className="btn btn-info ml-3" style={{ borderRadius: "55%", color: "white", backgroundColor: "#22b1ed", fontSize: "20px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", }}>+</button>
                            </p>


                        </div>



            }
            this.setState({ Speaker: res })
        }
        catch (error) {

        }

    }



    async componentDidMount() {
        try {
            let events = await Event.getAllEvents();
            this.setState({ events })

        }
        catch (error) {
            Alert.error("Connection Refused!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 4000,
                offset: 100
              });
            
        }
    }


    onFileChange = event => {

        const maxFileSize = "1000000";
        const selectedFiles = event.target.files;

        if (selectedFiles[0]) {

            var fileName = document.getElementById("filename").value;

            var idxDot = fileName.lastIndexOf(".") + 1;
            var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
            if (extFile === "jpg" || extFile === "jpeg" || extFile === "png") {
                if (selectedFiles[0].size >= maxFileSize) {
                    document.getElementById('image-size').innerHTML = "Size exceed 1Mb"
                    this.setState({ sImage: "" })
                    Alert.error("Image size should be less than 1 MB", {
                        position: 'top-right',
                        effect: 'slide',
                        beep: true,
                        timeout: 3000,
                        offset: 100
                    });

                }
                else {
                    document.getElementById('image-size').innerHTML = selectedFiles[0].name
                    const fr = new FileReader();
                    fr.readAsDataURL(selectedFiles[0]);

                    fr.addEventListener("load", () => {
                        let { sp } = this.state;
                        sp[event.target.name] = fr.result;
                        this.setState({ sp })

                    })
                }


            }
            else {

                Alert.error("Only jpg/jpeg and png files are allowed!", {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 3000,
                    offset: 100
                });


            }





        }

    }
    handleReset = () => {
        let { sp } = this.state;

        sp = { sName: '', sRole: '', sImage: '', timeslot: '', eventId: sp.eventId, rating: 5, count: 1 }

        this.setState({ sp })
        document.getElementById("image-size").innerHTML = "* Image size <= 1 Mb "
        document.getElementById("image-size").innerHTML += "<br>"
        document.getElementById("image-size").innerHTML += "*image format .png, .jpg, .jpeg"
        document.getElementById("filename").value = ""

    }

    changeHandler = async (e) => {


        const regex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
        let timecheck = 0, invalidTime = false


        if (e.target.name === 'timeslot' && e.target.value.length === 11) {

            const time1 = e.target.value.substring(0, 5)
            const time2 = e.target.value.substring(6, 11)


            if ((regex.test(time1) && regex.test(time2) && e.target.value.charAt(5) === "-")) {


                let currentTime = e.target.value
                var startTime = currentTime.split("-")[0];
                var endTime = currentTime.split("-")[1]

                const Speaker = await Event.getSpeakerByEvent(this.state.sp.eventId);

                Speaker.filter(function (obj) {

                    if (obj.timeslot) {
                        let currentDate = new Date()
                        currentDate.setHours(startTime.split(":")[0])
                        currentDate.setMinutes(startTime.split(":")[1])

                        let currentDate2 = new Date()
                        currentDate2.setHours(endTime.split(":")[0])
                        currentDate2.setMinutes(endTime.split(":")[1])

                        var startTime1 = obj.timeslot.split("-")[0];
                        var endTime1 = obj.timeslot.split("-")[1];

                        let startDate = new Date(currentDate.getTime());
                        startDate.setHours(startTime1.split(":")[0]);
                        startDate.setMinutes(startTime1.split(":")[1]);


                        let endDate = new Date(currentDate.getTime());
                        endDate.setHours(endTime1.split(":")[0]);
                        endDate.setMinutes(endTime1.split(":")[1]);

                        //check invalid endtime
                        let invalid = currentDate > currentDate2
                        if (invalid)
                            invalidTime = true
                        else {
                            let before = currentDate < currentDate2 && currentDate < startDate && currentDate2 < startDate && currentDate < endDate && currentDate2 < endDate
                            let after = currentDate < currentDate2 && currentDate > startDate && currentDate > endDate && currentDate2 > startDate && currentDate2 > endDate
                            if (!before && !after)
                                timecheck++

                        }
                    }
                    return obj;
                })

                if (invalidTime) {
                      document.getElementById("slotValue").value = ""
                    Alert.warning("Wrong end time!!!", {
                        position: 'top-right',
                        effect: 'slide',
                        timeout: 2000,
                    });
                }

                if (timecheck !== 0) {
                    Alert.warning("Time elapsed!!!", {
                        position: 'top-right',
                        effect: 'slide',
                        beep: true,
                        timeout: 2000,
                        offset: 100
                    });
                }


            }

            else {
                document.getElementById("slotValue").value = ""
                Alert.error("Please enter in format hh:mm-hh:mm", {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 2000,
                    offset: 100
                });
            }





        }
        const { sp } = this.state

        sp[e.target.name] = e.target.value;
        this.setState({ sp })
        if (e.target.name !== "timeslot") {
            this.handleSort()
        }
    }


    handleSubmit = async (e) => {
        const { sp } = this.state
        e.preventDefault()
        var letters = /^[a-zA-Z\s]*$/;

        if (sp.eventId === "") {
            Alert.warning("Please select event date!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 3000,
                offset: 100
            });
        }
        else if (sp.sName.trim().length === 0) {
            Alert.warning("Please enter speaker name!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 3000,
                offset: 100
            });
        }
        else if (!sp.sName.match(letters)) {
            Alert.warning("Name can contain characters only!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 3000,
                offset: 100
            });
        }
        else if (sp.sRole.trim().length === 0) {
            Alert.warning("Please enter Topic!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 3000,
                offset: 100
            });
        }

        else if (sp.sImage === "") {
            document.getElementById('image-size').innerHTML = "* please choose image <= 1 Mb"
            Alert.warning("Please choose speaker image!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 3000,
                offset: 100
            });

        }
        else {


            imageToBase64(sp.sImage)
                .then(response => {
                    sp.sImage = response
                    this.setState({ sp })

                })

            try {
                this.setState({ loading: true })
                let res;
                if (this.state.view === 0) {
                    res = await Event.uploadSpeakers(security.encrypt(sp))
                    if (res != null) {
                        this.setState({ loading: false })
                    }
                    Alert.success(res.msg, {
                        position: 'top-right',
                        effect: 'slide',
                        beep: true,
                        timeout: 3000,
                        offset: 100
                    });
                }
                else {
                    res = await Event.updateSpeaker(security.encrypt(sp))
                    if (res != null) {
                        this.setState({ loading: false })
                    }
                    Alert.success("Speaker details updated successfully!!!", {
                        position: 'top-right',
                        effect: 'slide',
                        beep: true,
                        timeout: 3000,
                        offset: 100
                    });

                }
                this.handleSort();
                this.handleReset()

            } catch (error) {
                this.setState({ loading: false })
                Alert.error(error.msg, {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 3000,
                    offset: 100
                });

            }

        }

        // window.reload();

    }

    handleSlot = async e => {
        e.preventDefault()
        const { sp, prevSlot } = this.state
        try {
            if (sp.timeslot === "") {
                sp.timeslot = prevSlot
                Alert.warning("No slot alloted!!!", {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 3000,
                    offset: 100
                });

            } else {
                Alert.success("Speaker slot updated successfully!!!", {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 3000,
                    offset: 100
                });
            }

            await Event.updateSpeaker(security.encrypt(sp))
            this.handleSort()
        }
        catch (error) {
            Alert.warning("No changes made!!!", {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 3000,
                offset: 100
            });

        }


    }






    show = async () => {

        try {
            const res = await Event.getSpeakerByEvent(this.state.sp.eventId);
            for (let i = 0; i < res.length; i++) {
                res[i].remove = <button id="button-web" onClick={() => this.removeSpeaker(res[i].id)}>Delete</button>
                res[i].update = <a href="#sp-div"><button style={{ color: "white", backgroundColor: "#22b1ed", fontSize: "15px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem", padding: "10px 20px 10px 15px" }} onClick={() => this.updateSpeaker(res[i].id)}>Update</button></a>
                res[i].sImage = <img alt="" src={`${res[i].sImage}`} height="70" width="70" />
                res[i].timeslot =

                    this.state.changeSlotView === 1 && this.state.idOfspeaker === res[i].id ?
                        (
                            <form className="form-inline ml-4" onSubmit={this.handleSlot}>
                                <div className="d-flex">
                                    <div>
                                        <input name="timeslot" id="slotValue" className="form-control" type="text" placeholder="hh:mm-hh:mm"
                                            style={{ color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem", width: "120px" }} onChange={this.changeHandler} />
                                    </div>

                                    <div>
                                        <button type="submit" onClick={() => this.handleSlotView(0, res[i].id)} className="btn btn-info ml-3" style={{ borderRadius: 50, color: "white", backgroundColor: "#22b1ed", fontSize: "15px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)" }}>Save</button>
                                    </div></div>
                            </form>
                        )

                        :

                        <div className="d-flex">
                            {res[i].timeslot ? <p style={{ width: "145px" }}>{res[i].timeslot}</p> : <p style={{ width: "145px" }}>No slot allotted</p>}
                            <p> <button onClick={() => this.handleSlotView(1, res[i].id)} className="btn btn-info ml-3" style={{ borderRadius: "55%", color: "white", backgroundColor: "#22b1ed", fontSize: "20px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", }}>+</button>
                            </p></div>



            }
            this.setState({ Speaker: res })
        }
        catch (error) {

        }

    }

    handleSlotView = (changeSlotView, idOfspeaker) => {
        this.updateSpeaker(idOfspeaker)
        this.setState({ changeSlotView, idOfspeaker })
        // this.show()
        this.handleSort()
    }

    removeSpeaker = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleted(id)
                },
                {
                    label: 'No',
                    onClick: () => this.show()
                }
            ]
        });



    }

    deleted = async (id) => {
        try {
            await Event.removeSpeaker(id)
            this.show()
        }
        catch (error) {
            alert(error.msg)
        }
    }
    updateSpeaker = async (id) => {

        const { changeSlotView } = this.state
        if (changeSlotView === 1) {

        }

        try {
            const res = await Event.getSpeakerById(id)
            this.setState({ sp: res, view: 1, prevSlot: res.timeslot })
        }
        catch (error) {
            alert("error")
        }

    }
    handleExit = () => {
        window.location = "/admin"
    }

    // getTimeSlots = () => {
    //     var obj = this.state.events.find(obj => obj.id == this.state.sp.eventId);
    //     if (obj !== undefined) {
    //         var d1 = new Date();
    //         d1.setHours(obj.start_time.substring(0, 2));
    //         d1.setMinutes(obj.start_time.substring(3, 5));


    //         var d2 = new Date();
    //         d2.setHours(obj.end_time.substring(0, 2));
    //         d2.setMinutes(obj.end_time.substring(3, 5));
    //         var slotArray = [], arr = [];
    //         while (d1 < d2) {
    //             arr.push(d1.toTimeString().substring(0, 5));
    //             d1.setMinutes(d1.getMinutes() + obj.durationOfEachSlots);
    //         }
    //         for (let i = 0; i < arr.length - 2; i++) {
    //             slotArray.push(arr[i] + " - " + arr[i + 1])
    //         }
    //         slotArray.push(arr[arr.length - 2] + " - " + obj.end_time)
    //         return slotArray
    //     }
    // }

    date = (d) => {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var date = new Date(d);
        var monthName = months[date.getMonth()];
        return d.substring(8, 10) + " " + monthName + "," + d.substring(0, 4);
    }
    render() {
        const { message, loading, Speaker, events, columns, sp } = this.state

        return (
            <>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="./admin">Home</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Upload Speaker</li>
                </ol>

                <div className="App" style={{ marginTop: "10px", marginLeft: "50%" }}>
                    {loading && <header className="App-header">
                        <img src="./tabicon.png" className="App-logo" alt="logo" />
                    </header>}
                </div>

                <div style={{ opacity: `${loading ? "0.3" : "1"}` }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div style={{ marginLeft: "29%", width: "100%" }}>
                                <div className="card" id="sp-div" style={{ width: "500px", background: "#fff", borderRadius: "2px" }}>
                                    <div style={{ backgroundColor: "#eaecf4", textAlign: "center", width: "498px", height: "60px", paddingTop: "6px", paddingBottom: "4px" }}><h3 style={{ color: "#757575 ", fontSize: "30px" }}>Upload Speaker Details</h3></div>
                                    <div style={{ marginTop: '8px' }}>  <h5 className="text-success text-center" id="msg" >{message}</h5></div>
                                    <div className="card-body" style={{ padding: '30px' }}>

                                        <div className='row' id="row-1">
                                            <div className='col-4' id="colm1"> <span style={{ color: "#757575 ", fontWeight: "500px", fontSize: "18px" }}>Event Date:</span>
                                            </div> <div className='col-5'>
                                                <select name="eventId" className="custom-select" type="text" value={sp.eventId}
                                                    style={{ color: "darkgray", fontSize: "12px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }} onChange={this.changeHandler}>
                                                    <option>Select Event</option>


                                                    {events.map(event => new Date(event.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) && (<option key={event.id} value={event.id}>{this.date(event.date)}</option>))}

                                                </select>

                                            </div>
                                        </div>

                                        <div className='row mt-3' id="row-1">
                                            <div className='col-4' id='colm1'>
                                                <span style={{ color: "#757575 ", fontWeight: "500px", fontSize: "18px" }}> Name: </span>
                                            </div>
                                            <div className='col-5'>
                                                <input type="text" name="sName" className="form-control myform" style={{ color: "darkgray", fontSize: "12px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }} placeholder="Enter Speaker Name" onChange={this.changeHandler} value={sp.sName} />
                                            </div></div>

                                        <div className='row mt-3' id="row-1">
                                            <div className='col-4' id="colm1"> <span style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px", marginTop: "15px" }}>Topic: </span>
                                            </div> <div className='col-5'> <input name="sRole" className="form-control" type="text" placeholder="Enter Event Topic"
                                                style={{ color: "darkgray", fontSize: "12px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }} onChange={this.changeHandler} value={sp.sRole} />
                                            </div>
                                        </div>


                                        <div className='row mt-4'>
                                            <div className='col-4 mb-4' > <label class='label' style={{ marginLeft: '10px' }}><input type="file" name='sImage' id="filename" onChange={this.onFileChange} className='input-file' /><h6 style={{ marginTop: '9px', marginLeft: '-9px', fontSize: '12px' }}>CHOOSE A FILE</h6></label>
                                            </div>
                                            <div className='col-5 mb-4'>
                                                <h6 id="image-size" style={{ color: "red", fontSize: "12px" }}>* Image size {"<="} 1 Mb<br />*image format .png, .jpg, .jpeg </h6>
                                            </div>

                                        </div>

                                        <br />
                                        <div className="mt-4">
                                            <button type="submit" id='button-web' style={{ marginLeft: '5px' }} onClick={this.handleSubmit}>Save</button>
                                            <button id='button-web' style={{ marginLeft: '10px' }} onClick={() => this.handleReset()}>Reset</button>
                                            <button id='button-web' style={{ marginLeft: '10px' }} onClick={this.handleExit}>Exit</button>

                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>




                <br />
                <br />

                {Speaker.length > 0 && <Table columns={columns} data={Speaker} />
                }



                {/* <Footer /> */}
            </>
        )
    }
}
export default UploadSpeaker