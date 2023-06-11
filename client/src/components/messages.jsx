import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./messages.css"

function Messages(){

    //citation for routing using js start: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
    const navigate = useNavigate();
    function goLogin() {
        navigate("/login");
    }

    function goHome() {
        navigate("/home");
    }
    //citation for routing using js end


    //react hook citation: https://legacy.reactjs.org/docs/hooks-effect.html
    const [username, setUsername] = useState("");
    const [messages, setMessages] = useState([{}]);

    //check if logged in, and if so set username, else redirect
    fetch("/retrieveUsername", {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => console.log(data.loggedIn ? setUsername(data.username) : goLogin()))
        .catch(err => console.error(err));

    //citation for retrieving from backend start: https://www.youtube.com/watch?v=w3vs4a03y3I
    useEffect(() => {
        fetch("/retrieveMessages", {
            method: 'POST',
        }).then(
            response => response.json()
        ).then(
            data => {
                setMessages(data);
            }
        )

    }, [])
    console.log(messages);
    //citation for retrieving from backend end

    // citation start: https://legacy.reactjs.org/docs/lists-and-keys.html

    const messageItems = (messages.messages)?.map((message, i) =>
        <div className="message">
           <h1>From: {message.creator}</h1>
            <h2>About: {message.eventName}</h2>
            <h2>Message: {message.message}</h2>
            <hr />
        </div>
    );
    // citation end


    return(
        <div className="main">
            <button onClick={goHome} className="homeButton">Back to Home</button>
            <br />
            <div className="title">Messages From Hosts of Your Events</div>
            <div className="username">Welcome User {username}</div>
            <h1>Your Messages: </h1>
            <hr />
            {messageItems}
            <hr />
        </div>
    )
}

export default Messages;