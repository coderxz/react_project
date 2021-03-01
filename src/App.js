import React from 'react';
import Login from './pages/login/login';
import Admin from './pages/admin/admin';
import {Route,Switch} from 'react-router-dom';
export default class App extends React.Component{
  render() {
    return (
      <div className="app">
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/admin" component={Admin}/>
        </Switch>
      </div>
    )
  }
 }

