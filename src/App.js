import React ,{Component} from 'react';
import { Route,Switch} from 'react-router-dom';
import HomePage from './module/user/HomePage';
import Register from './module/user/Register';
import Login from './module/user/Login';
import EventPage from './module/event/EventPage';
import Admin from './module/admin/Admin';
import ProtectedRouter from './ProtectedRouter';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import UserDashboard from './module/user/UserDashboard';
import FeedbackSurvey from './module/user/FeedbackSurvey';
import MenuItem from './module/admin/MenuItem'


export default class App extends Component{

  constructor(props){
    super(props)
      this.state={isAuth : localStorage.getItem('isAuth')}
     
  }


    
    render(){
      
      return (
        <div >
          <Alert stack={{limit: 3}} />
          <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path='/register' component={Register} />
      <ProtectedRouter exact path='/eventpage' component={EventPage} isAuth={this.state.isAuth} />
    <Route exact path='/login' component={Login} />

         <Route exact path='/admin' component={MenuItem} />
         <ProtectedRouter exact path='/userdashboard' component={UserDashboard} isAuth={this.state.isAuth}/>
         
         <Route exact path='/feedbacksurvey' component={FeedbackSurvey} />

          </Switch>
        </div>
      )
    }
}

