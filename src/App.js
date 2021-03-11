import React,{Component} from 'react';
import Login from "./containers/login/login";
import Admin from "./containers/admin/admin";
import {Switch,Route,Redirect} from 'react-router-dom'
export default class App extends Component{
  render() {
    return(
      <div className="app">
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/admin" component={Admin}/>
          <Redirect to="/admin"/>
        </Switch>
      </div>
    )
  }
}