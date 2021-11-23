import React from 'react';
import userService from '../../service/user_related_services/Users_Service';
import Alert from 'react-s-alert'
import './login1.css';
import GoogleLogin from 'react-google-login';
import { useState } from 'react'
import HomePage from './HomePage';
import { Link } from 'react-router-dom'
import security from '../../utils/EncryptionDecryption';


function Login() {

    const [NAME, setname] = useState("");
    const [EMAIL, setemail] = useState("");
    const [view] = useState(0);
    const [loading, setloading] = useState(false)

    const email = {
        email: "",
        userName: ""
    }

    const handleSubmit = async (e) => {
        setloading(true)
        e.preventDefault()

        try {

            await userService.login(security.encrypt({ "userName": NAME, "email": EMAIL }))
            localStorage.clear();
            localStorage.setItem("email", EMAIL)
            localStorage.setItem("name", NAME)
            localStorage.setItem('isAuth', true)
            window.location = "/userdashboard"
        }
        catch (error) {
            Alert.warning(error.msg, {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 4000,
                offset: 100
            });
            setloading(false)
        }
    }

    const responseGoogle = async (response) => {
        email.userName = response.profileObj.name
        email.email = response.profileObj.email;;
        try {
            await userService.login_via_google(security.encrypt(email))
            localStorage.clear();
            localStorage.setItem("email", email.email)
            localStorage.setItem("name", email.userName)
            localStorage.setItem('isAuth', true)
            window.location = "/userdashboard"
        } catch (error) {

            Alert.warning(error.msg, {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 4000,
                offset: 100
            });
        }



    }
    return (<>
        {view === 1 && <HomePage />}
        {view === 0 && <div>
            <div className="row myrow">
                <div className="col-8" style={{ background: "url('/bg-2.jpg')", backgroundSize: "cover" }}>
                    <div className="logo2" style={{ fontSize: "1 rem" }}><img src="/logotwhite.png" height="36.8" width="137.98" alt="logo" style={{ float: "left" }} /></div>
                    <div className="background-img">
                        <div className="coding" style={{ marginTop: '390px', textAlign: "center" }}>
                            <h1 style={{ fontSize: "4rem", color: 'white' }}><em>CODING </em><span><h1 style={{ display: "inline", color: "rgb(254, 203, 50)", fontSize: "4rem" }}><em>BOOTCAMP</em></h1></span></h1>
                        </div>
                    </div>
                </div>
                <div className="col-4" style={{ opacity: `${loading ? "0.3" : "1"}`, backgroundColor: "#fff" }} >
                    <div className="register-login-box"  >
                        <p className="login-wrapper-signup-text">Don't have an account?<Link to="/"><span style={{ color: "#22b1ed", cursor: "pointer" }} className="spanlink"> Signup here</span></Link></p>
                        <div className="title" >Sign in</div>
                        <div >
                            <form onSubmit={handleSubmit}>
                                <div className="uname">
                                    <input type="text" name="NAME" className="user-input" placeholder="Full Name" onChange={e => setname(e.target.value)} />
                                </div>
                                <div className="email1">
                                    <input type="email" name="EMAIL" className="email-input" placeholder="Email Address" onChange={e => setemail(e.target.value)} />
                                </div>
                                <div>
                                    <button type="submit" className="action-btn"  > Login</button>
                                    <span>
                                        <GoogleLogin
                                            clientId="618617721551-pr9da8ve8kogd364tgbqbm6228uqu08f.apps.googleusercontent.com"
                                            render={renderProps => (
                                                <button className='butn-google' onClick={renderProps.onClick} disabled={renderProps.disabled} style={{ background: "none", width: "127px", height: '55px', border: "solid 1px #d5dae2", fontSize: "22px", marginLeft: '30px' }}><img src="/icon.png" alt="icon" height="20" width="20" style={{ marginLeft: '10px', marginTop: '5px', float: 'left' }} /><h6 style={{ marginTop: "7px", display: 'inline' }}><b>Google</b></h6></button>
                                            )}
                                            onSuccess={responseGoogle}
                                            onFailure={responseGoogle}
                                            cookiePolicy={'single_host_origin'} />
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="App" style={{ position: "fixed", top: "110px", left: "46%" }}>
                {loading && <header className="App-header">
                    <img src="/tabicon.png" className="App-logo" alt="logo" />
                </header>}
            </div>
        </div>}





    </>
    )

}
export default Login;