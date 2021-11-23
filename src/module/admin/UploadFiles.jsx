import React from 'react';
import documents from '../../service/document_related_services/Document';
import url from "../../constant/index";
import adminService from '../../service/admin_related_services/Event';
import './loader.css'
import './UploadFiles.css'
import Alert from 'react-s-alert';
import Table from '../../Table/table'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import '../../css/button.css';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import { Document, Page, pdfjs } from 'react-pdf';
import security from '../../utils/EncryptionDecryption'






class UploadFiles extends React.Component {
  constructor(props) {
    super(props)
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    this.state = {
      columns: [
        {
          text: <>Name  <span style={{ marginLeft: "10px" }}>&#8657;</span> <span style={{ marginLeft: "-5px" }}>&#8659;</span></>,
          dataField: 'name',
          sort: true
        }, {
          text: <>Category  <span style={{ marginLeft: "10px" }}></span> <span style={{ marginLeft: "-5px" }}></span></>,
          dataField: 'category',

        },
        {
          dataField: "remove",
          text: "Delete",


        }

      ],
      selectedFile: null,
      message: "", events: [], mid: { mid: "" }, loading: false, rows: '', category: '', id: '', btnview: "true", isOpen: false, file: '', pdf: '', numPages: [],
      onHide: 'false', image: "* file size {" <= "} than 300kb", stateBr: ""

    }
  }

  componentDidMount = async () => {
    try{
    const events = await adminService.getAllEvents()
    this.setState({ events })
    }catch(err){
      Alert.error("Connection Refused!!!", {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 4000,
        offset: 100
      });
    
    }
  }
  onInputChange = (e) => {
    this.setState({
      category: e.target.value
    })

  }

  //   onPreview(){
  //       document.getElementById("file").value=""

  //   }

  PreviewImage = () => {

    this.setState({ isOpen: true })
  }

  close = () => {
    this.setState({ isOpen: false })
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    let arr = [];
    for (let i = 0; i < numPages; i++)
      arr.push(i)
    this.setState({ numPages: arr });
  }
  pdfName = (event) => {
    console.log(event.target.files[0].name)
    document.getElementById('fsize').innerHTML = event.target.files[0].name

  }

  onFileChange = event => {


    const selectedFiles = event.target.files;
    if (selectedFiles[0]) {

      var fileName = event.target.files[0].name
      this.setState({ file: event.target.files[0].name });

      var idxDot = fileName.lastIndexOf(".") + 1;
      var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      this.setState({ pdf: event.target.files[0] });

      if (extFile === "pdf") {

        if (event.target.files[0].size >= 307200) {
          this.setState({ selectedFile: null });
          document.getElementById('fsize').innerHTML = "Size exceed 300kb"
          Alert.warning("Size exceed 300kb", {
            position: 'top-right',
            effect: 'slide',
            beep: true,
            timeout: 4000,
            offset: 100
          });
        }
        else {
          // alert("File size too big")
          document.getElementById('fsize').innerHTML = event.target.files[0].name

          this.setState({ selectedFile: event.target.files[0] });
          this.setState({ btnview: false })
        }
      }
      else {
        Alert.error("Only pdf files are allowed!", {
          position: 'top-right',
          effect: 'slide',
          beep: true,
          timeout: 3000,
          offset: 100
        });
      }
    }
  };

  onreset = () => {

    this.setState({ selectedFile: null, message: "" })
    // document.getElementById("presentation").checked = false;
    //document.getElementById("agenda").checked = false;
    document.getElementById('fsize').innerHTML = "* file size <= than 300kb"
    document.getElementById("fsize").innerHTML += "<br>"
    document.getElementById("fsize").innerHTML += "*pdf files only"
    this.setState({ btnview: true })
    document.getElementById("preview").style.display = "none"
    document.getElementById("uploadPDF").value = ""
    this.setState({ category: "" })
  }


  onFileUpload = async () => {

    const formData = new FormData();
    const { mid, selectedFile, category } = this.state

    if (mid.mid === '') {
      Alert.warning("Event date is not selected!!", {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 4000,
        offset: 100
      });
    }

    else if (category === '') {
      Alert.warning("No Category Choosen!!!!", {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 4000,
        offset: 100
      });

    }

    else if (selectedFile === null) {
      Alert.warning("No File Choosen!!!!", {
        position: 'top-right',
        effect: 'slide',
        beep: true,
        timeout: 4000,
        offset: 100
      });

    }


    else {
      try {
        formData.append("document", selectedFile, selectedFile.name);
        this.setState({ loading: true })
        const response = await fetch(url + "/files/upload/" + mid.mid + "/" + category, { method: 'POST', body: formData }).then(response => response.json())
        this.setState({ loading: false })
        const res = security.decrypt(response.data)
        Alert.success(res.msg, {
          position: 'top-right',
          effect: 'slide',
          beep: true,
          timeout: 4000,
          offset: 100
        });
        this.show()
        this.onreset()

      }
      catch (error) {
        Alert.error("Unable to upload!!!", {
          position: 'top-right',
          effect: 'slide',
          beep: true,
          timeout: 4000,
          offset: 100
        });
      }

    }
  }





  changeHandler = async e => {
    let { mid } = this.state
    mid[e.target.name] = e.target.value;
    this.setState({ mid })
    this.show()




  }

  removeFile = (id) => {
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
      await documents.deleteFile(id)
      this.show()
    }
    catch (error) {
      alert(error.msg)
    }
  }


  show = async () => {

    const res = await documents.getFiles(this.state.mid.mid)
    for (let i = 0; i < res.length; i++) {
      res[i].remove = <button style={{ color: "white", backgroundColor: "#22b1ed", fontSize: "15px", borderColor: "#e3eaef", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem", padding: "10px 20px 10px 15px" }} onClick={() => this.removeFile(res[i].id)}>Delete</button>

    }
    this.setState({ rows: res })

  }
  exit = () => {
    window.location = "/admin"
  }

  date = (d) => {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var date = new Date(d);
    var monthName = months[date.getMonth()];
    return d.substring(8, 10) + " " + monthName + "," + d.substring(0, 4);
  }

  render() {

    const { message, events, mid, loading, columns, rows, numPages } = this.state
    return (<>

      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="./admin">Home</a></li>

        <li class="breadcrumb-item active" aria-current="page">UploadFiles</li>
      </ol>

      <div style={{ opacity: `${loading ? 0.3 : 1}`, left: "10%" }}>
        {/* <h4 className=" text-dark" id="msg" style={{ left: "35%", position: "relative" }}>{message}</h4> */}
        <div className="row">
          <div className="col-lg-12">
            <div>

              <div className="card mx-auto" style={{ boxShadow: "10px 10px 10px lightgray", height: "360px", width: '500px', borderRadius: "2px", background: "#fefefa", marginLeft: '350px' }}>
                <div style={{ backgroundColor: '#eaecf4', textAlign: 'center', height: '60px', paddingTop: '10px' }}><h3 style={{ color: 'rgb(117, 117, 117)', fontSize: '30px' }}>Upload Files</h3></div>
                <div className="row" style={{ marginTop: '20px' }}>
                  <div className='col-4' ><h6 id='date-col'>Event Date : </h6></div>
                  <div className="col-4" style={{ marginTop: '10px' }} >

                    <select name="mid" value={mid.mid} onChange={this.changeHandler} className="form-control" style={{ color: "darkgray", fontSize: "13px", boxShadow: "0 .125rem .25rem 0 rgba(58,59,69,.2)", borderRadius: ".25rem" }}>
                      <option key="" selected value="">Select Event Date</option>
                      {events.map(e => new Date(e.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) && (<option key={e.id} value={e.id}>{this.date(e.date)}</option>))}
                    </select>

                  </div>
                </div>
                <div className='row' style={{ marginTop: " 30px", paddingLeft: " 32px" }}>
                  <div className='col-5 d-flex' style={{ width: "300px" }}>
                    <input type="radio" id="presentation" name="fav_language" value="Presentation" onChange={this.onInputChange} style={{ display: "block" }} checked={this.state.category === "Presentation"} />
                    <label style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px" }} for="presentation">Presentation Material</label>
                  </div>
                  <div className="col-7 d-flex" >
                    <input type="radio" id="agenda" name="fav_language" value="Agenda" onChange={this.onInputChange} style={{ display: "block" }} checked={this.state.category === "Agenda"} />
                    <label style={{ color: "#757575 ", fontWeight: "500", fontSize: "18px" }} for="agenda">Agenda Material</label>

                  </div>

                  <div className='col-4' >
                  </div>




                </div>
                <div style={{ display: "flex" }}>
                  <label class='label' style={{ marginLeft: '25px', height: "35px", borderColor: "#e3eaef", marginTop: "1%" }}><input id="uploadPDF" type="file" name='file' onChange={this.onFileChange} className='input-file' /><h6 style={{ marginTop: '9px', marginLeft: '-9px', fontFamily: "sans-serif", fontSize: '12px' }}>CHOOSE A FILE</h6></label>
                  <span className='col-4' ><h6 id='fsize'>* file size {"<="} than 300kb <br /> * pdf files only</h6></span>


                  {this.state.btnview === false && <button id="button-web" type="button" onClick={() => this.PreviewImage()} style={{ marginLeft: "31px", marginTop: "1%" }}>Preview</button>}


                  <div id="preview" style={{ clear: "both", position: "fixed", top: "16%", left: "35%", display: "none", marginLeft: "180px" }}>

                    <Modal
                      show={this.state.isOpen}
                      onHide={this.close}
                      contentclassname="custom-model-content"
                      style={{ width: "200vh", top: "8%", marginLeft: "120px" }}>
                      <ModalHeader
                        style={{
                          justifyContent: "center", backgroundColor: "#e3eaef"
                        }}>
                        <h5>{this.state.file}</h5>
                      </ModalHeader>
                      <ModalBody>

                        <Document
                          file={this.state.pdf}
                          onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                          {numPages.map(page => <Page pageNumber={page} />)}
                        </Document>

                      </ModalBody>
                      <ModalFooter>
                        <button id="button-web" style={{ marginRight: '230px', marginBottom: '30px' }} onClick={() => this.setState({ isOpen: false })}>Cancel</button>

                      </ModalFooter>
                    </Modal>

                  </div>

                </div>


                <div className='row' style={{ marginTop: '25px' }}>

                  <div className='col-4'> <button id='button-web' onClick={this.onFileUpload} style={{ marginLeft: '20px' }} > SAVE</button>
                  </div>
                  <div className='col-4'> <button id='button-web' onClick={this.onreset} style={{ marginLeft: '7px' }}>RESET</button>

                  </div>
                  <div className='col-4'><button id='button-web' onClick={this.exit} style={{ marginLeft: '-5px' }}> EXIT</button></div>
                </div>


              </div>


            </div>
          </div>
        </div>

        <div className="App">
          {loading && <header className="App-header" style={{ position: "fixed", top: "25%", left: "55%" }}>
            <img src="./tabicon.png" className="App-logo" alt="logo" />
          </header>}
        </div>

      </div>
      <br />
      <br />
      <div >
        {/* {this.state.mid!="" && this.show()} */}

        <div id="btable">{rows.length > 0 && <Table columns={columns} data={rows} />}</div>


      </div>
    </>
    )
  }
}

export default UploadFiles;