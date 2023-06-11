import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./home.css"

function Home (){
    //citation for routing using js start: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
    const navigate = useNavigate();
    function goLogin() {
        navigate("/login");
    }

    function goCreateEvent() {
        navigate("/createEvent");
    }

    function goManageEvents() {
        navigate("/manageEvents");
    }

    function goViewEvents() {
        navigate("/viewEvents");
    }

    function goMessage(){
        navigate("/messages");
    }

    function goYourEvents() {
        navigate("/yourEvents");
    }
    //citation for routing using js end

    //react hook citation: https://legacy.reactjs.org/docs/hooks-effect.html
    const [username, setUsername] = useState("");

    //check if logged in, and if so set username, else redirect
    fetch("/retrieveUsername", {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => console.log(data.loggedIn ?  setUsername(data.username) : goLogin()))
        .catch(err => console.error(err));

    //function to log out
    function logout() {
        fetch("/logout", {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? goLogin() : alert("You couldn't log out")))
            .catch(err => console.error(err));
    }
    


    return (
    <div>
        <button onClick={logout} className="logoutButton">Logout</button>
        <br />
        <div className="title">Home Page</div>
        <div className="username">Welcome User {username}</div>
        <div className="buttons">
            <button onClick={goCreateEvent} className="navButton">Create An Event</button>
            <button onClick={goManageEvents} className="navButton">Manage Your Events</button>
            <button onClick={goYourEvents} className="navButton">View Your Upcoming Events</button>
            <button onClick={goViewEvents} className="navButton">View All Events/Sign Up For One</button>
            <button onClick={goMessage} className="navButton">View Messages Sent to You</button>
        </div>
        <img src="logo.svg" alt="" />
    </div>
    )
}

export default Home;