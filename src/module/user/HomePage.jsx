import React from 'react';
import './homepage.css';
import Event from '../../service/admin_related_services/Event'
import { Link } from 'react-router-dom';
import Footer from '../admin/Footer';

class HomePage extends React.Component {
	constructor() {
		super()
		this.state = {
			even_arr: [],
			sort_arr:[]
		}
	}

	async componentDidMount() {
		
		let res = await Event.getAllEvents();
		this.setState({ even_arr: res })
		
		
		
	}

	 sortByDate = arr => {
		const sorter = (a, b) => {
		   return new Date(a.date) - new Date(b.date);
		}
		arr.sort(sorter);
		
	 };
	 
	 



	date = (d) => {
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var date = new Date(d);
		var monthName = months[date.getMonth()];
		return d.substring(8, 10) + " " + monthName + "," + d.substring(0, 4);
	}

	adminLogin = () => {
		if (document.getElementById("psw").value === "admin")
			window.location = "/admin"
		else
			window.location.reload();
	}

	render() {
		this.sortByDate(this.state.even_arr)
		console.log(this.state.even_arr)
		localStorage.clear();
		return (

			<div style={{ height: "100%" , backgroundColor: "#fff"}}>
				<div style={{ marginLeft: "88%", marginTop: "1%" }}>
					<img className="img-profile rounded-circle dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt='' src="img/undraw_profile.svg" style={{ height: "2rem", width: "2rem", border: "0px" }} />
					<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
						Password: <input type="password" id="psw" name="psw" style={{ cursor: "pointer", width: "80px" }} /><br /><br />
						<button id="button-web" onClick={this.adminLogin}> Login</button>
					</div>
					<span className="ml-2 d-none d-lg-inline text-black small">Admin</span>
				</div>
				<div className="title-heading1">
					<h2 className>Upcoming Event</h2>
					<h3 style={{ color: 'lightgray', fontSize: '2rem' }}> Learn Latest Technologies</h3>
				</div>
				<div className="header1"  >
					<div className="welcome1" ><h3><div className="logo" style={{ fontSize: "1 rem" }}><img src="/logotwhite.png" height="36.8" width="137.98" alt="logo" style={{ float: "left" }} /> </div><br /> <br /></h3>
					</div>
				</div>
				<div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginBottom: "80px" }}>
					{this.state.even_arr.length === 0 && <div style={{ marginTop: "10%" }}>
						<div style={{ justifyContent: "center", display: "flex" }}>
							<div className="spinner-grow text-danger" role="status"  >
								<span className="visually-hidden">Loading...</span>
							</div>
							<div className="spinner-grow text-warning" role="status"  >
								<span className="visually-hidden">Loading...</span>
							</div>
							<div className="spinner-grow text-info" role="status"  >
								<span className="visually-hidden">Loading...</span>
							</div>
							<div className="spinner-grow text-primary" role="status"  >
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
						<h3 className="text-info" >Event will Schedule soon!!!!!!</h3></div>}
					{this.state.even_arr.map(event => new Date(event.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) && (
						<div className="event_card" key={event.id}>
							<img src="/image.jpg" alt="dc" height="200" width="400" className="img-card" />
							<div className="evn_date " >
								<p > {this.date(event.date)}</p>
							</div>
							<div className="content_div" >
								<div>
									<h3 style={{ color: "#020d26" }}>{event.meeting_name}</h3>
								</div>
								<Link onClick={() => this.redirectToRegister(event.id)} style={{ color: "#22b1ed" }}>pre-register</Link>
							</div>
						</div>
					))}

				</div>
				
				<Footer/>
				
			</div>
		);
	}

	redirectToRegister(event_id) {
		localStorage.setItem("mid", event_id)
		this.props.history.push('/register')
	}
}
export default HomePage;