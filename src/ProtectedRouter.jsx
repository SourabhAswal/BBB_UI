import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import EventPage from './module/event/EventPage';

function ProtectedRouter({ component: Component, isAuth, ...rest }) {

    return (
        <Route {...rest} render={(props) => {
            if (isAuth) {

                return <Component {...props} />
            }
            else {

                return (

                    <Redirect to={{ pathname: "/", state: { from: props.location } }} />
                )
            }
        }}
        />
    )

}

export default ProtectedRouter;
