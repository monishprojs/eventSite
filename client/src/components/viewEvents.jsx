import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./viewEvents.css"


function ViewEvents() {
    //citation for routing using js start: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
    const navigate = useNavigate();
    function goLogin() {
        navigate("/login");
    }

    function goHome() {
        navigate("/home");
    }
    //citation for routing using js end

    //function to register user for an event
    function registerUser(eventName) {
        const data = { "eventName": eventName };
        console.log(data);
        fetch("/registerUser", {
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
    const [events, setEvents] = useState([{}]);

    //check if logged in, and if so set username, else redirect
    fetch("/retrieveUsername", {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => console.log(data.loggedIn ? setUsername(data.username) : goLogin()))
        .catch(err => console.error(err));

    //citation for retrieving from backend start: https://www.youtube.com/watch?v=w3vs4a03y3I
    useEffect(() => {
        fetch("/retrieveAllEvents", {
            method: 'POST',
        }).then(
            response => response.json()
        ).then(
            data => {
                setEvents(data);
            }
        )

    }, [])
    console.log(events);
    //citation for retrieving from backend end


    // citation start: https://legacy.reactjs.org/docs/lists-and-keys.html

    const eventItems = (events.events)?.map((event, i) =>
        <div className="event">
            <h1 key={i}>Event: {event.name}</h1>
            <div key={i}>Hosted by: {event.creator}</div>
            <button classname="sign" onClick={() => registerUser(event.name)}>Sign Up For Event</button>
            <div key={i}>Venue: {event.venue}</div>
            <div key={i}>Date: {event.date}</div>
            <div key={i}>Time: {event.time}</div>
            <hr />
        </div>
    );
    // citation end

    return (
        <div className="main">
            <button onClick={goHome} className="homeButton">Back to Home</button>
            <br />
            <div className="title">Event Sign Up Page</div>
            <div className="username">Welcome User {username}</div>
            <ul>{eventItems}</ul>
        </div>
    )
}

export default ViewEvents;