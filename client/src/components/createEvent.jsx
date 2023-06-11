import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./createEvent.css"


function CreateEvent() {
    //citation for routing using js start: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
    const navigate = useNavigate();
    function goLogin() {
        navigate("/login");
    }

    function goHome() {
        navigate("/home");
    }
    //citation for routing using js end


    //function to create new user on site
    function createEvent() {
        const name = document.getElementById("name").value;
        const venue = document.getElementById("venue").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const data = { "name": name, "venue" : venue, "date": date, "time" : time };
        console.log(data);
        fetch("/createEvent", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? alert(data.message) : alert(data.message)))
            .catch(err => console.error(err));
    }

    //react hook citation: https://legacy.reactjs.org/docs/hooks-effect.html
    const [username, setUsername] = useState("");

    //check if logged in, and if so set username, else redirect
    fetch("/retrieveUsername", {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => console.log(data.loggedIn ? setUsername(data.username) : goLogin()))
        .catch(err => console.error(err));

    return (
        <div className="main">
            <button onClick={goHome} className="homeButton">Back to Home</button>
            <br />
            <div className="title">Event Creation Page</div>
            <div className="username">Welcome User {username}</div>
            <div className="Event Creation Form">
                <input id='name' type='text' placeholder='Event Name' className="eventInput"></input>
                <input id='venue' type='text' placeholder='Event Venue' className="eventInput"></input>
                <input id='date' type='text' placeholder='Event Date' className="eventInput"></input>
                <input id='time' type='text' placeholder='Event Time' className="eventInput"></input>
                <button onClick={createEvent} className="eventButton">Create Event</button>
            </div>
        </div>

    )
}

export default CreateEvent;