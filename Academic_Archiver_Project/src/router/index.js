import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Login from '../pages/User/Log-in'
import Signup from '../pages/User/Sign-up'
import Main from '../pages/Main'
import Personal from '../pages/Personal'
import PaperDetail from '../pages/PaperDetail'
import Map from '../pages/Map'

export default () => (
  <Router>
    <Switch>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/mainpage">
        <Main />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/personal">
        <Personal />
      </Route>
      <Route path="/paperDetail">
        <PaperDetail />
      </Route>
      <Route path="/map">
        <Map />
      </Route>
      <Redirect from="/*" to="/login" />
    </Switch>
  </Router>
);