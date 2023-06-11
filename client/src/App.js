import React,{useEffect,useState} from 'react';
import Login from './components/login';
import Home from './components/home';
import CreateEvent from './components/createEvent';
import ManageEvents from './components/manageEvents';
import ViewEvents from './components/viewEvents';
import Messages from './components/messages';
import YourEvents from './components/yourEvents';


//citation: https://www.geeksforgeeks.org/how-to-redirect-to-another-page-in-reactjs/
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App(){

  //router citations: https://www.geeksforgeeks.org/how-to-redirect-to-another-page-in-reactjs/#
  //https://stackoverflow.com/questions/63124161/attempted-import-error-switch-is-not-exported-from-react-router-dom,
  //https://stackoverflow.com/questions/63690695/react-redirect-is-not-exported-from-react-router-dom,
  //https://www.reddit.com/r/react/comments/rew2yd/react_router_not_rendering_pages_but_link_changes/

  return(
    <div>
      {/* This is the alias of BrowserRouter i.e. Router */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/home" element={<Home />} />

          <Route path="/createEvent" element={<CreateEvent/>} />

          <Route path="/manageEvents" element={<ManageEvents />} />

          <Route path="/viewEvents" element={<ViewEvents />} />

          <Route path="/messages" element={<Messages />} />

          <Route path="/yourEvents" element={<YourEvents />} />

          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </div>
  )
}




export default App