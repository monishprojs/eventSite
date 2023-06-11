import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./home.css"

function YourEvents() {
    //citation for routing using js start: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
    const navigate = useNavigate();
    function goLogin() {
        navigate("/login");
    }

    function goHome() {
        navigate("/home");
    }
    //citation for routing using js end


    //function to send a message to creator of an event you've signed up for
    function sendMessage(eventName, eventCreator) {
        let msg = document.getElementById(eventName).value;
        if (!msg) {
            alert("Message cannot be empty");
            return;
        }
        const data = { "eventName": "Your Event "+ eventName, "eventCreator": eventCreator, "message": msg };
        fetch("/sendMessagePersonal", {
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

  
    //retrieve all events a user is signed up for and not checked in for
    //citation for retrieving from backend start: https://www.youtube.com/watch?v=w3vs4a03y3I
    useEffect(() => {
        fetch("/retrieveMyEvents", {
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

    const eventItems = (events.events)?.map((event, i) =>
        <div className="event">
            <h1 key={i}>Event: {event.name}</h1>
            <div key={i}>Hosted By: {event.creator}</div>
            <div key={i}>Venue: {event.venue}</div>
            <div key={i}>Date: {event.date}</div>
            <div key={i}>Time: {event.time}</div>
            <textarea type="text" id={event.name} placeholder="Message to Send to Creator" />
            <button onClick={() => sendMessage(event.name, event.creator)}>Send Message</button>
            <br />
            <button onClick={() => unRegisterUser(event.name)}>Un-Sign Up For Event</button>
            <hr />
        </div>
    );
    // citation end

    //function to unregister user for an event
    function unRegisterUser(eventName) {
        const data = { "eventName": eventName };
        console.log(data);
        fetch("/unRegisterUser", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? reload() : alert(data.message)))
            .catch(err => console.error(err));
    }

    function reload() {
        //reload citation start: https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react
        window.location.reload(false);
        //reload citation end
    }


    return (
        <div>
            <button onClick={goHome} className="homeButton">Back to Home</button>
            <br />
            <div className="title">Your Upcoming Events That You Have Not Checked in For: </div>
            <div className="username">Welcome User {username}</div>
            <div>Your Events: </div>
            <div>{eventItems}</div>
        </div>
    )
}

export default YourEvents;